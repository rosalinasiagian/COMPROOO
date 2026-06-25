import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// 1. Kunci jalur import secara tegas ke file .jsx yang baru
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // 2. Tambahkan kata 'async' di depan (e)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 3. Tambahkan kata 'await' saat memanggil fungsi login API
    const result = await login(formData.email, formData.password);

    // 4. Cek hasilnya berdasarkan status sukses yang dikembalikan AuthContext
    if (result.success) {
      toast.success('Login berhasil!');
      setTimeout(() => {
        navigate('/'); // Alihkan user ke halaman Beranda utama
      }, 1000);
    } else {
      // Menampilkan pesan kegagalan dinamis langsung dari Back-End
      toast.error(result.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      className="min-h-screen flex font-['Inter',_sans-serif]"
      style={{ backgroundColor: '#0a0a0a' }}
      data-testid="login-page"
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
          {/* Title */}
          <h2
            className="text-4xl font-bold mb-3 font-['Manrope',_sans-serif] text-[#F5BC00]"
            data-testid="login-title"
          >
            Masuk
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            Jika kamu belum punya akun kamu dapat{' '}
            <Link
              to="/daftar"
              className="font-semibold transition-colors text-[#F5BC00] hover:text-[#F5BC00]"
              data-testid="register-link"
            >
              Daftar disini
            </Link>
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>
              <div className="relative flex items-center">
                <Mail
                  className="absolute left-0 h-5 w-5 text-[#F5BC00]"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-8 pr-3 py-2 bg-transparent font-['Inter',_sans-serif] text-white text-sm placeholder-gray-500 border-b border-gray-600 focus:outline-none focus:border-[#F5BC00] transition-colors"
                  placeholder="Masukan Email Anda"
                  data-testid="login-email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Kata Sandi
              </label>
              <div className="relative flex items-center">
                <Lock
                  className="absolute left-0 h-5 w-5 text-[#F5BC00]"
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-8 pr-10 py-2 bg-transparent font-['Inter',_sans-serif] text-white text-sm placeholder-gray-500 border-b border-gray-600 focus:outline-none focus:border-[#F5BC00] transition-colors"
                  placeholder="Masukan Kata Sandi Anda"
                  data-testid="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 flex items-center text-gray-500 hover:text-gray-300"
                  data-testid="toggle-password"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border border-gray-600 bg-transparent accent-[#F5BC00] cursor-pointer"
                />
                <span className="text-sm text-gray-400">Ingat saya</span>
              </label>
              <Link
                to="/lupa-password"
                className="text-sm text-gray-400 hover:text-[#F5BC00] transition-colors"
              >
                Lupa kata sandi?
              </Link>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-full font-bold text-base text-black bg-[#F5BC00] hover:bg-[#F5BC00]/90 font-['Manrope',_sans-serif] transition-colors"
                data-testid="login-submit-button"
              >
                Masuk
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;