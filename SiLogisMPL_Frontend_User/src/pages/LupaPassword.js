import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, KeyRound, ArrowRight } from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'https://rosa15-silogismpl-backend.hf.space';

const LupaPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Silakan masukkan email Anda'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.code === 200) {
        toast.success('Kode OTP telah dikirim ke email Anda');
        setStep(2);
      } else {
        toast.error(data.errors || 'Email tidak ditemukan');
      }
    } catch {
      toast.error('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.join('').length < 4) { toast.error('Masukkan 4 digit kode verifikasi'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otp.join('') }),
      });
      const data = await res.json();
      if (data.code === 200) {
        toast.success('Verifikasi berhasil');
        setStep(3);
      } else {
        toast.error(data.errors || 'Kode OTP salah atau kadaluarsa');
      }
    } catch {
      toast.error('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword.length < 6) { toast.error('Kata sandi minimal 6 karakter'); return; }
    if (passwords.newPassword !== passwords.confirmPassword) { toast.error('Kata sandi dan konfirmasi tidak cocok'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword: passwords.newPassword }),
      });
      const data = await res.json();
      if (data.code === 200) {
        toast.success('Kata sandi berhasil diubah! Silakan masuk kembali.');
        setTimeout(() => navigate('/masuk'), 1500);
      } else {
        toast.error(data.errors || 'Gagal mengubah kata sandi');
      }
    } catch {
      toast.error('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="min-h-screen flex bg-[#0a0a0a] font-['Inter',_sans-serif]"
      data-testid="forgot-password-page"
    >
      {/* Left: Truck Image */}
      <div className="hidden lg:flex w-[60%] relative overflow-hidden rounded-r-3xl">
        <img
          src="/images/login-bg-hd.png"
          alt="Mandiri Perkasa Logis"
          className="w-full h-full object-cover"
        />
        {/* Logo overlay */}
        <div className="absolute top-6 left-6 flex items-center gap-3">
          <img src="/logo-mpl.jpg" alt="MPL Logo" className="h-10 w-auto" />
          <span className="text-white font-bold text-xl tracking-widest uppercase font-['Manrope',_sans-serif]">
            Mandiri Perkasa
          </span>
        </div>
      </div>

      {/* Right: Form Panel */}
      <div className="flex-1 flex flex-col justify-center px-10 lg:px-16 xl:px-24">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-3 mb-10">
          <img src="/logo-mpl.jpg" alt="MPL Logo" className="h-8 w-auto" />
          <span className="text-white font-bold text-lg tracking-widest uppercase font-['Manrope',_sans-serif]">
            Mandiri Perkasa
          </span>
        </div>

        <div className="max-w-sm w-full mx-auto lg:mx-0">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-4xl font-bold mb-3 font-['Manrope',_sans-serif] text-[#F5BC00]">
                Lupa Sandi
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                Masukkan email yang terdaftar pada akun Anda. Kami akan mengirimkan kode verifikasi untuk mengatur ulang kata sandi.
              </p>

              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-0 h-5 w-5 text-[#F5BC00]" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-transparent text-white text-sm placeholder-gray-500 border-b border-gray-600 focus:outline-none focus:border-[#F5BC00] transition-colors font-['Inter',_sans-serif]"
                      placeholder="Masukkan Email Anda"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-full font-bold text-base text-black bg-[#F5BC00] hover:bg-[#dca900] font-['Manrope',_sans-serif] transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
                  >
                    {loading ? 'Mengirim...' : <>Kirim Kode <ArrowRight className="w-5 h-5" /></>}
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center">
                <Link to="/masuk" className="text-sm text-gray-400 hover:text-[#F5BC00] transition-colors">
                  Kembali ke Halaman Masuk
                </Link>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-4xl font-bold mb-3 font-['Manrope',_sans-serif] text-[#F5BC00]">
                Verifikasi
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                Kami telah mengirimkan 4 digit kode verifikasi ke <span className="text-[#F5BC00] font-semibold">{email}</span>. Silakan masukkan kode tersebut di bawah ini.
              </p>

              <form onSubmit={handleOtpSubmit} className="space-y-8">
                <div className="flex justify-between gap-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !otp[index] && index > 0) {
                          document.getElementById(`otp-${index - 1}`).focus();
                        }
                      }}
                      className="w-16 h-16 text-center text-2xl font-bold bg-transparent text-white border-b-2 border-gray-600 focus:border-[#F5BC00] focus:outline-none transition-colors"
                    />
                  ))}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-full font-bold text-base text-black bg-[#F5BC00] hover:bg-[#dca900] font-['Manrope',_sans-serif] transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
                  >
                    {loading ? 'Memverifikasi...' : <>Verifikasi Kode <KeyRound className="w-5 h-5" /></>}
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-400">
                  Belum menerima kode?{' '}
                  <button 
                    onClick={() => toast.success('Kode verifikasi baru telah dikirim')}
                    className="text-[#F5BC00] hover:underline font-semibold"
                  >
                    Kirim Ulang
                  </button>
                </p>
                <button 
                  onClick={() => setStep(1)} 
                  className="text-sm text-gray-500 hover:text-gray-300 transition-colors mt-4 block mx-auto"
                >
                  Ganti Email
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-4xl font-bold mb-3 font-['Manrope',_sans-serif] text-[#F5BC00]">
                Sandi Baru
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                Buat kata sandi baru untuk akun Anda. Pastikan kata sandi kuat dan mudah diingat.
              </p>

              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Kata Sandi Baru
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-0 h-5 w-5 text-[#F5BC00]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                      className="w-full pl-8 pr-10 py-2 bg-transparent text-white text-sm placeholder-gray-500 border-b border-gray-600 focus:outline-none focus:border-[#F5BC00] transition-colors font-['Inter',_sans-serif]"
                      placeholder="Minimal 6 karakter"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 flex items-center text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Konfirmasi Kata Sandi Baru
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-0 h-5 w-5 text-[#F5BC00]" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                      className="w-full pl-8 pr-10 py-2 bg-transparent text-white text-sm placeholder-gray-500 border-b border-gray-600 focus:outline-none focus:border-[#F5BC00] transition-colors font-['Inter',_sans-serif]"
                      placeholder="Ketik ulang kata sandi"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-0 flex items-center text-gray-500 hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-full font-bold text-base text-black bg-[#F5BC00] hover:bg-[#dca900] font-['Manrope',_sans-serif] transition-colors disabled:opacity-70"
                  >
                    {loading ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LupaPassword;
