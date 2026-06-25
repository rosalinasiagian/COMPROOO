import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { User, Mail, Lock, Eye, EyeOff, Phone } from 'lucide-react'; // Tambah icon Phone jika diperlukan

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false); // State pelindung double-click submit
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // TAMBAHKAN async DI SINI
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Password dan konfirmasi password tidak cocok');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }

    try {
      setLoading(true);
      // TAMBAHKAN await DI SINI agar menunggu respon asli dari backend Spring Boot
      const result = await register(formData.name, formData.email, formData.password, formData.confirmPassword);

      if (result && result.success) {
        toast.success('Registrasi berhasil! Selamat datang.');
        setTimeout(() => navigate('/'), 1000);
      } else {
        toast.error(result?.message || 'Registrasi gagal, silakan coba lagi.');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan jaringan atau server.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div
      className="min-h-screen flex bg-[#0a0a0a] font-['Inter',_sans-serif]"
      data-testid="register-page"
    >
      {/* Left: Truck Image */}
      <div className="hidden lg:flex w-[60%] relative overflow-hidden rounded-r-3xl">
        <img
          src="/images/login-bg-hd.png"
          alt="Mandiri Perkasa Logis"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-6 left-6 flex items-center gap-3">
          <img src="/logo-mpl.jpg" alt="MPL Logo" className="h-10 w-auto" />
          <span className="text-white font-['Manrope',_sans-serif] font-bold text-xl tracking-widest uppercase">
            Mandiri Perkasa
          </span>
        </div>
      </div>

      {/* Right: Form Panel */}
      <div className="flex-1 flex flex-col justify-center px-10 lg:px-16 xl:px-24">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-3 mb-10">
          <img src="/logo-mpl.jpg" alt="MPL Logo" className="h-8 w-auto" />
          <span className="text-white font-['Manrope',_sans-serif] font-bold text-lg tracking-widest uppercase">
            Mandiri Perkasa
          </span>
        </div>

        <div className="max-w-sm w-full mx-auto lg:mx-0">
          {/* Title */}
          <h2
            className="text-4xl font-['Manrope',_sans-serif] font-bold mb-3 text-[#F5BC00]"
            data-testid="register-title"
          >
            Daftar
          </h2>
          <p className="text-gray-400 font-['Inter',_sans-serif] text-sm mb-8">
            Jika kamu sudah punya akun, kamu dapat{' '}
            <Link
              to="/masuk"
              className="font-semibold transition-colors text-[#F5BC00] hover:text-[#F5BC00]"
              data-testid="login-link"
            >
              Masuk disini
            </Link>
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-['Inter',_sans-serif] font-medium text-gray-300 mb-2">Email</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-0 h-5 w-5 text-[#F5BC00]" />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Masukan Email Anda"
                  className="w-full pl-8 pr-3 py-2 bg-transparent font-['Inter',_sans-serif] text-white text-sm placeholder-gray-500 border-b border-gray-600 focus:outline-none focus:border-[#F5BC00] transition-colors"
                  data-testid="register-email"
                />
              </div>
            </div>

            {/* Nama Pengguna */}
            <div>
              <label className="block text-sm font-['Inter',_sans-serif] font-medium text-gray-300 mb-2">Nama Pengguna</label>
              <div className="relative flex items-center">
                <User className="absolute left-0 h-5 w-5 text-[#F5BC00]" />
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Masukan Nama Pengguna"
                  className="w-full pl-8 pr-3 py-2 bg-transparent font-['Inter',_sans-serif] text-white text-sm placeholder-gray-500 border-b border-gray-600 focus:outline-none focus:border-[#F5BC00] transition-colors"
                  data-testid="register-name"
                />
              </div>
            </div>
            {/* Kata Sandi */}
            <div>
              <label className="block text-sm font-['Inter',_sans-serif] font-medium text-gray-300 mb-2">Kata Sandi</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-0 h-5 w-5 text-[#F5BC00]" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Masukan Kata Sandi Anda"
                  className="w-full pl-8 pr-10 py-2 bg-transparent font-['Inter',_sans-serif] text-white text-sm placeholder-gray-500 border-b border-gray-600 focus:outline-none focus:border-[#F5BC00] transition-colors"
                  data-testid="register-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 text-gray-500 hover:text-[#F5BC00] transition-colors"
                  data-testid="toggle-password"
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Konfirmasi Kata Sandi */}
            <div>
              <label className="block text-sm font-['Inter',_sans-serif] font-medium text-gray-300 mb-2">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-0 h-5 w-5 text-[#F5BC00]" />
                <input
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Konfirmasi Kata Sandi Anda"
                  className="w-full pl-8 pr-10 py-2 bg-transparent font-['Inter',_sans-serif] text-white text-sm placeholder-gray-500 border-b border-gray-600 focus:outline-none focus:border-[#F5BC00] transition-colors"
                  data-testid="register-confirm-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-0 text-gray-500 hover:text-[#F5BC00] transition-colors"
                >
                  {showConfirm ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full font-['Manrope',_sans-serif] font-bold text-base text-black bg-[#F5BC00] hover:bg-[#F5BC00]/90 transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
                data-testid="register-submit-button"
              >
                {loading ? 'Mendaftarkan...' : 'Daftar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;