import { useState, useRef, useEffect } from "react";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../lib/api.js";
import { Button } from "../components/ui/button";
import { Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Profil() {
  const { setProfile } = useData();
  const { setUser } = useAuth();

  // ── 1. INITIAL STATE DIBUAT KOSONG (TIDAK STATIS / MENUNGGU DATA BE) ──
  const [form, setForm] = useState({
    name: "",
    email: "",
    noTelepon: "",
    role: "",
    avatarUrl: ""
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const fileInputRef = useRef(null);
  const set = (k, v) => setForm({ ...form, [k]: v });

  // ── 2. AUTO-LOAD DATA LAMA SAAT HALAMAN DIBUKA (PREFILL DATA) ──
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await api.get("/user/admin/profile");
        const data = response.data?.data || response.data;

        // Memastikan objek data tidak null sebelum dibongkar
        if (data) {
          const mappedData = {
            // Mengambil data kredensial utama user
            name: data.username || "",
            email: data.email || "",
            role: data.role || "ADMIN",

            // 🛠️ Bongkar nested object 'adminProfile' untuk nomor telepon dan foto avatar
            noTelepon: data.adminProfile?.noTelepon || "",
            avatarUrl: data.adminProfile?.urlProfilePicture || ""
          };

          setForm(mappedData);
          setProfile(mappedData); // Sinkronisasi ke DataContext global
        }
      } catch (err) {
        console.error("Gagal menjemput data profil lama:", err);
        toast.error("Gagal memuat profil dari server");
      } finally {
        setFetching(false);
      }
    };

    fetchProfileData();
  }, []); // Array kosong [] menjamin fungsi ini cuma jalan 1 kali saat page dibuka (Anti GET terus-menerus)

  // ── 3. SIMPAN PERUBAHAN TEKS (PATCH PROFILE) ──
  const handleSave = async () => {
    setLoading(true);
    try {
      await api.patch("/user/admin/edit/profile", {
        username: form.name,
        email: form.email,
        noTelepon: form.noTelepon, // Menggunakan noTelepon agar konsisten dan tidak hilang saat diketik
      });

      // Update DataContext global
      setProfile(form);

      // Sync ke AuthContext supaya sidebar otomatis update
      setUser((prev) => ({
        ...prev,
        name: form.name,
        role: form.role,
      }));

      setShowSuccess(true);
    } catch (err) {
      console.error("Gagal menyimpan profil:", err);
      toast.error(err.response?.data?.errors || "Gagal memperbarui data profil.");
    } finally {
      setLoading(false);
    }
  };

  // ── 4. UPLOAD FOTO PROFIL OTOMATIS (PATCH PROFILEPICTURE) ──
  const handleAvatarChange = async (e) => {
    const fileMentah = e.target.files[0];
    if (!fileMentah) return;

    // 🛠️ TRICK INSTANT PREVIEW: Bikin URL lokal sementara dari file gambar
    const localPreviewUrl = URL.createObjectURL(fileMentah);

    // Langsung ganti gambar di layar secara lokal biar kelihatan instan berubah
    setForm(prev => ({ ...prev, avatarUrl: localPreviewUrl }));

    const formData = new FormData();
    formData.append("fileGambarOtomatis", fileMentah);

    const toastId = toast.loading("Mengunggah foto profil baru...");
    try {
      const response = await api.patch("/user/admin/edit/profilepicture", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // Ambil URL Cloudinary asli yang dikembalikan oleh backend
      const newAvatarUrl = response.data?.data || response.data;

      // Update state dengan URL Cloudinary asli agar permanen
      setForm(prev => ({ ...prev, avatarUrl: newAvatarUrl }));
      setProfile(prev => ({ ...prev, avatarUrl: newAvatarUrl }));
      setUser(prev => ({ ...prev, avatarUrl: newAvatarUrl }));

      toast.success("Foto profil berhasil diperbarui!", { id: toastId });
    } catch (err) {
      console.error("Gagal upload avatar:", err);
      toast.error("Ukuran file terlalu besar atau format salah", { id: toastId });

      // Fallback: Jika backend gagal/error, kembalikan ke foto profil kosong/lama agar tidak salah tampilan
      window.location.reload();
    }
  };

  // Tampilkan loading screen sementara saat React sedang menjemput data lama dari backend
  if (fetching) {
    return (
      <div style={{ background: "#f0f0f0", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 className="animate-spin text-[#FFA000]" size={36} />
      </div>
    );
  }

  return (
    <div
      data-testid="profil-page"
      style={{ background: "#f0f0f0", minHeight: "100vh", position: "relative" }}
    >
      {/* ── MODAL SUKSES ── */}
      {showSuccess && (
        <div
          onClick={() => setShowSuccess(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff", borderRadius: 20, padding: "52px 48px 44px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 24,
              minWidth: 320, boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
            }}
          >
            <div style={{ position: "relative", width: 100, height: 100 }}>
              <svg viewBox="0 0 100 100" width="100" height="100">
                <circle cx="50" cy="50" r="46" fill="#f0fdf4" stroke="#22c55e" strokeWidth="3.5" />
                <polyline
                  points="28,52 44,68 72,36" fill="none" stroke="#22c55e" strokeWidth="5"
                  strokeLinecap="round" strokeLinejoin="round"
                  style={{ strokeDasharray: 60, strokeDashoffset: 0, animation: "drawCheck 0.4s ease forwards" }}
                />
              </svg>
            </div>

            <p style={{ fontSize: 17, fontWeight: 800, color: "#1a1a1a", letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>
              Perubahan Berhasil
            </p>

            <button
              onClick={() => setShowSuccess(false)}
              style={{
                marginTop: 4, background: "#FFA000", color: "#fff", border: "none", borderRadius: 10,
                padding: "11px 40px", fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: "0.04em",
              }}
            >
              Tutup
            </button>
          </div>
          <style>{`@keyframes drawCheck { from { stroke-dashoffset: 60; } to { stroke-dashoffset: 0; } }`}</style>
        </div>
      )}

      {/* ── HEADER ── */}
      <div style={{ background: "#f0f0f0", padding: "40px 48px 28px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "28px" }}>

          {/* Avatar box */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ width: 108, height: 108, borderRadius: 14, overflow: "hidden", background: "#1c2b38" }}>
              {form.avatarUrl ? (
                <img src={form.avatarUrl} alt="Avatar Admin" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <svg viewBox="0 0 108 108" width="108" height="108" xmlns="http://www.w3.org/2000/svg">
                  <rect width="108" height="108" fill="#1c2b38" />
                  <ellipse cx="54" cy="96" rx="34" ry="22" fill="#5d8ea6" />
                  <rect x="20" y="74" width="68" height="34" fill="#5d8ea6" />
                  <rect x="46" y="62" width="16" height="14" fill="#e8a87c" />
                  <circle cx="54" cy="50" r="22" fill="#e8a87c" />
                  <path d="M32 44 Q34 22 54 20 Q74 22 76 44 Q70 30 54 30 Q38 30 32 44Z" fill="#6b3a2a" />
                  <polygon points="46,74 38,108 54,82" fill="#4a7a94" />
                  <polygon points="62,74 70,108 54,82" fill="#4a7a94" />
                </svg>
              )}
            </div>

            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" style={{ display: "none" }} />

            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: "absolute", bottom: -10, right: -10, width: 36, height: 36, borderRadius: 10,
                background: "#FFA000", border: "none", cursor: "pointer", display: "flex",
                alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
              }}
            >
              <Pencil size={15} color="#fff" strokeWidth={2.5} />
            </button>
          </div>

          {/* Name + role */}
          <div style={{ paddingTop: 4 }}>
            <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#aaa", fontWeight: 600, margin: "0 0 4px" }}>
              {form.role === "ROLE_ADMIN" || form.role === "ADMIN" ? "System Administrator" : form.role || "System Administrator"}
            </p>
            <h1 style={{ fontSize: 48, fontWeight: 900, color: "#1a1a1a", margin: "0 0 6px", lineHeight: 1.05 }}>
              {form.name || "Zuhri"}
            </h1>
            <p style={{ fontSize: 15, color: "#888", margin: 0 }}>
              Head of Operations & Logistics Analytics
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#ddd" }} />

      {/* ── INFORMASI PROFIL INPUT FIELDS ── */}
      <div style={{ padding: "36px 48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="7" r="4" fill="#FFA000" />
            <path d="M2 17c0-4 3.582-6 8-6s8 2 8 6" stroke="#FFA000" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </svg>
          <span style={{ fontSize: 17, fontWeight: 800, color: "#1a1a1a" }}>
            Informasi Profil
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 48, rowGap: 0 }}>
          <ProfileField label="Nama Lengkap" testId="profile-name" value={form.name} onChange={(v) => set("name", v)} />
          <ProfileField label="Alamat Email" testId="profile-email" value={form.email} onChange={(v) => set("email", v)} />

          {/* Properti disinkronkan ke noTelepon agar input nomor telepon aman dan tidak hilang sendiri */}
          <ProfileField label="Nomor Telepon" testId="profile-phone" value={form.noTelepon} onChange={(v) => set("noTelepon", v)} />

          <ProfileField label="Jabatan / Role" testId="profile-role" value={form.role} onChange={(v) => set("role", v)} disabled={true} />
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={loading}
            data-testid="save-profile-btn"
            style={{ background: "#FFA000", color: "#fff", border: "none", borderRadius: 8 }}
            className="h-11 px-8 text-sm font-semibold"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, value, onChange, testId, disabled = false }) {
  return (
    <div style={{ paddingBottom: 28 }}>
      <p style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "#999", fontWeight: 700, margin: "0 0 8px" }}>
        {label}
      </p>
      <input
        data-testid={testId}
        value={value || ""}
        onChange={(e) => !disabled && onChange(e.target.value)}
        disabled={disabled}
        style={{
          width: "100%",
          fontSize: 15,
          fontWeight: 700,
          color: disabled ? "#999" : "#1a1a1a",
          background: "transparent",
          border: "none",
          borderBottom: "1.5px solid #ddd",
          outline: "none",
          padding: "0 0 10px",
          boxSizing: "border-box",
          cursor: disabled ? "not-allowed" : "text"
        }}
      />
    </div>
  );
}