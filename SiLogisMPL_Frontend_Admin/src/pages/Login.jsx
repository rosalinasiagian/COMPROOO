import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { Lock, Mail, Loader2, Wifi } from "lucide-react";
import { api } from "../lib/api.js";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState("checking"); // 'checking' | 'ready' | 'slow'

  // Ping backend saat halaman login dibuka agar HuggingFace space bangun
  useEffect(() => {
    const wakeUpBackend = async () => {
      try {
        await api.get("/user/companyprofile", { timeout: 8000 });
        setServerStatus("ready");
      } catch {
        // Kalau timeout, coba sekali lagi
        setServerStatus("slow");
        try {
          await api.get("/user/companyprofile", { timeout: 30000 });
          setServerStatus("ready");
        } catch {
          setServerStatus("ready"); // tetap lanjut meski server lambat
        }
      }
    };
    wakeUpBackend();
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.ok) {
      toast.success("Login berhasil! Selamat datang Admin.");
      const to = location.state?.from?.pathname || "/dashboard";
      setTimeout(() => {
        navigate(to, { replace: true });
      }, 1000);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f6fa] px-4">
      <div className="w-full max-w-md mpl-card p-10 fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-[#1a1a1a] flex items-center justify-center mb-4 shadow">
            <span className="text-[#FFA000] font-extrabold text-2xl">MPL</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Panel Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Logistics Controller</p>
          {/* Status koneksi server */}
          {serverStatus === "checking" && (
            <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-400">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Menghubungkan ke server...</span>
            </div>
          )}
          {serverStatus === "slow" && (
            <div className="flex items-center gap-1.5 mt-3 text-xs text-amber-500">
              <Wifi className="w-3 h-3" />
              <span>Server sedang bangun, harap tunggu...</span>
            </div>
          )}
          {serverStatus === "ready" && (
            <div className="flex items-center gap-1.5 mt-3 text-xs text-green-500">
              <Wifi className="w-3 h-3" />
              <span>Server siap</span>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-5" data-testid="login-form">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs uppercase tracking-wider text-gray-500">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                data-testid="login-username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-11"
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs uppercase tracking-wider text-gray-500">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                data-testid="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-11"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading}
            data-testid="login-submit"
            className="w-full h-11 mpl-btn-primary"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Masuk"}
          </Button>
        </form>
      </div>
    </div>
  );
}