import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../lib/api"; // 🌟 Pastikan path helper axios/api kamu sudah benar
import { Button } from "../components/ui/button";
import { Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Profil() {
  const { user, setUser } = useAuth();

  // State lokal pengelolaan formulir data profil
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: ""
  });

  const [pageLoading, setPageLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const setFieldValue = (key, value) => setForm({ ...form, [key]: value });

  // ── 1. AMBIL DATA PROFIL DARI BACKEND SAAT HALAMAN DIBUKA ──
  useEffect(() => {
    const fetchUserProfileData = async () => {
      setPageLoading(true);
      try {
        const token = localStorage.getItem("mpl_token");
        if (!token) return;

        const response = await api.get("/user/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const resData = response.data?.data || response.data;

        if (resData) {
          // Petakan data dari backend DTO ke state formulir React
          setForm({
            name: resData.username || resData.name || user?.name || "",
            email: resData.email || "",
            phone: resData.userProfile?.noTelepon || resData.phone || "",
            role: resData.role || user?.role || ""
          });
        }
      } catch (err) {
        console.error("Gagal menjemput data profil dari database:", err);
        toast.error("Gagal menyinkronkan data profil dari server");
      } finally {
        setPageLoading(false);
      }
    };

    fetchUserProfileData();
  }, [user]);

  // ── 2. KIRIM PERUBAHAN DATA FORMULIR KE BACKEND ──
  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const token = localStorage.getItem("mpl_token");

      // Susun payload sesuai struktur entitas data User/UserProfile Spring Boot kamu
      const payload = {
        username: form.name,
        email: form.email,
        userProfile: {
          noTelepon: form.phone,
          jabatan: form.role
        }
      };

      await api.patch("/user/edit/profile", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 3. Sinkronisasikan ke AuthContext global agar nama di Navbar otomatis berubah
      setUser((prev) => ({
        ...prev,
        name: form.name,
        role: form.role,
      }));

      // Tampilkan modal pop-up sukses
      setShowSuccess(true);
      toast.success("Profil Anda berhasil diperbarui");
    } catch (err) {
      console.error("Gagal menyimpan update profil:", err);
      toast.error(err.response?.data?.errors || "Gagal menyimpan perubahan ke database");
    } finally {
      setSaveLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f0f0]">
        <Loader2 className="w-8 h-8 animate-spin text-[#FFA000] mb-2" />
        <p className="text-sm text-gray-500">Memuat berkas profil Anda...</p>
      </div>
    );
  }

  return (
    <div
      data-testid="profil-page"
      style={{ background: "#f0f0f0", minHeight: "100vh", position: "relative", paddingTop: "80px" }}
    >
      {/* ── MODAL SUKSES ── */}
      {showSuccess && (
        <div
          onClick={() => setShowSuccess(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "52px 48px 44px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
              minWidth: 320,
              boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
            }}
          >
            <div style={{ position: "relative", width: 100, height: 100 }}>
              <svg viewBox="0 0 100 100" width="100" height="100">
                <circle cx="50" cy="50" r="46" fill="#f0fdf4" stroke="#22c55e" strokeWidth="3.5" />
                <polyline
                  points="28,52 44,68 72,36"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    strokeDasharray: 60,
                    strokeDashoffset: 0,
                    animation: "drawCheck 0.4s ease forwards",
                  }}
                />
              </svg>
            </div>

            <p
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: "#1a1a1a",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              Perubahan Berhasil
            </p>

            <button
              onClick={() => setShowSuccess(false)}
              style={{
                marginTop: 4,
                background: "#FFA000",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "11px 40px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "0.04em",
              }}
            >
              Tutup
            </button>
          </div>

          <style>{`
            @keyframes drawCheck {
              from { stroke-dashoffset: 60; }
              to   { stroke-dashoffset: 0; }
            }
          `}</style>
        </div>
      )}

      {/* ── HEADER KARTU PROFIL ── */}
      <div style={{ background: "#f0f0f0", padding: "40px 48px 28px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "28px" }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div
              style={{
                width: 108,
                height: 108,
                borderRadius: 14,
                overflow: "hidden",
                background: "#1c2b38",
              }}
            >
              <svg viewBox="0 0 108 108" width="108" height="108" xmlns="http://www.w3.org/2000/svg">
                <rect width="108" height="108" fill="#1c2b38" />
                <ellipse cx="54" cy="96" rx="34" ry="22" fill="#5d8ea6" />
                <rect x="20" y="74" width="68" height="34" rx="0" fill="#5d8ea6" />
                <rect x="46" y="62" width="16" height="14" fill="#e8a87c" />
                <circle cx="54" cy="50" r="22" fill="#e8a87c" />
                <path d="M32 44 Q34 22 54 20 Q74 22 76 44 Q70 30 54 30 Q38 30 32 44Z" fill="#6b3a2a" />
                <polygon points="46,74 38,108 54,82" fill="#4a7a94" />
                <polygon points="62,74 70,108 54,82" fill="#4a7a94" />
              </svg>
            </div>
            <button
              style={{
                position: "absolute",
                bottom: -10,
                right: -10,
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#FFA000",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
              }}
            >
              <Pencil size={15} color="#fff" strokeWidth={2.5} />
            </button>
          </div>

          <div style={{ paddingTop: 4 }}>
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#999",
                fontWeight: 600,
                margin: "0 0 4px",
              }}
            >
              Akun Anggota Mandiri Perkasa
            </p>
            <h1
              style={{
                fontSize: 48,
                fontWeight: 900,
                color: "#1a1a1a",
                margin: "0 0 6px",
                lineHeight: 1.05,
              }}
            >
              {form.name ? form.name.split(" ")[0] : "Pengguna"}
            </h1>
            <p style={{ fontSize: 15, color: "#666", margin: 0, fontWeight: 500 }}>
              {form.role || "Mitra Pengiriman MPL"}
            </p>
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: "#ddd", margin: "0 48px" }} />

      {/* ── ISIAN DATA FORMULIR INPUT ── */}
      <div style={{ padding: "36px 48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="7" r="4" fill="#FFA000" />
            <path d="M2 17c0-4 3.582-6 8-6s8 2 8 6" stroke="#FFA000" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </svg>
          <span style={{ fontSize: 17, fontWeight: 800, color: "#1a1a1a" }}>
            Informasi Profil Utama
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: 48,
            rowGap: 0,
          }}
        >
          <ProfileField label="Nama Lengkap" testId="profile-name" value={form.name} onChange={(v) => setFieldValue("name", v)} />
          <ProfileField label="Alamat Email" testId="profile-email" value={form.email} onChange={(v) => setFieldValue("email", v)} />
          <ProfileField label="Nomor Telepon" testId="profile-phone" value={form.phone} onChange={(v) => setFieldValue("phone", v)} />
          <ProfileField label="Jabatan / Bidang Kerja" testId="profile-role" value={form.role} onChange={(v) => setFieldValue("role", v)} />
        </div>

        <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={handleSave}
            disabled={saveLoading}
            data-testid="save-profile-btn"
            style={{
              background: "#FFA000",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: saveLoading ? "not-allowed" : "pointer"
            }}
            className="h-11 px-8 text-sm font-semibold flex items-center gap-2"
          >
            {saveLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {saveLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, value, onChange, testId }) {
  return (
    <div style={{ paddingBottom: 28 }}>
      <p
        style={{
          fontSize: 10,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "#999",
          fontWeight: 700,
          margin: "0 0 8px",
        }}
      >
        {label}
      </p>
      <input
        data-testid={testId}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          fontSize: 15,
          fontWeight: 700,
          color: "#1a1a1a",
          background: "transparent",
          border: "none",
          borderBottom: "1.5px solid #ddd",
          outline: "none",
          padding: "0 0 10px",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}