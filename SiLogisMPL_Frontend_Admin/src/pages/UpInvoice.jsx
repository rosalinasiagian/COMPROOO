import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api"; // Memakai instance axios terpusat
import { X } from "lucide-react";
import { toast } from "sonner";

// ── KOMPONEN MODAL SUKSES ──
function SuccessModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <style>{`
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes drawCheck {
          from { stroke-dashoffset: 60; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes popCircle {
          0%   { transform: scale(0.7); opacity: 0; }
          70%  { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
        .check-line {
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          animation: drawCheck 0.4s ease 0.25s forwards;
        }
        .pop-circle {
          animation: popCircle 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        .modal-box {
          animation: fadeScaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-box"
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "52px 48px 44px",
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: 24,
          minWidth: 360,
          boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
        }}
      >
        <svg viewBox="0 0 100 100" width="100" height="100" style={{ overflow: "visible" }}>
          <circle cx="50" cy="50" r="46" fill="#f0fdf4" stroke="#22c55e" strokeWidth="3.5" className="pop-circle" />
          <polyline points="28,52 44,68 72,36" fill="none" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="check-line" />
        </svg>

        <div style={{ fontSize: 17, fontWeight: 800, color: "#111827", letterSpacing: 1, textAlign: "center" }}>
          INVOICE BERHASIL TERKIRIM
        </div>


        <button
          onClick={onClose}
          style={{
            background: "#FFA000", color: "#fff",
            border: "none", borderRadius: 8,
            padding: "12px 32px", fontSize: 13,
            fontWeight: 700, cursor: "pointer",
            width: "100%", letterSpacing: 0.5
          }}
        >
          KEMBALI KE STATUS PESANAN
        </button>
      </div>
    </div>
  );
}

// ── KOMPONEN UTAMA PAGE UPINVOICE ──
export default function UpInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  // State manajemen data lokal & API
  const [orderExists, setOrderExists] = useState(true);
  const [fetchingOrder, setFetchingOrder] = useState(true);
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Verifikasi apakah ID Order tersebut valid & ada di dalam database backend
  useEffect(() => {
    const verifyTargetOrder = async () => {
      try {
        const response = await api.get(`/order/${id}`);
        const result = response.data?.data || response.data;
        if (Array.isArray(result)) {
          const isFound = result.some(o => String(o.id) === String(id));
          setOrderExists(isFound);
        }
      } catch (error) {
        console.error("Gagal memverifikasi manifes tujuan:", error);
      } finally {
        setFetchingOrder(false);
      }
    };
    verifyTargetOrder();
  }, [id]);

  // Handler validasi tipe berkas saat dipilih/di-drop
  const handleFile = (f) => {
    if (!f) return;
    const validType = f.type === "application/pdf" || f.type === "image/png" || f.type === "image/jpeg";
    if (!validType) {
      toast.error("Format file harus berupa PDF, PNG, atau JPEG");
      return;
    }
    setFile(f);
  };

  // Fungsi submit form-data (Multipart) langsung ke endpoint backend Spring Boot
  const handleSubmit = async () => {
    if (!file) {
      toast.error("Pilih berkas file invoice terlebih dahulu");
      return;
    }

    try {
      setLoading(true);

      // Membungkus file biner ke dalam objek konstruktor FormData JavaScript
      const formDataPayload = new FormData();
      // 'file' disesuaikan dengan key parameter @RequestParam("file") MultipartFile di Spring Boot kamu
      formDataPayload.append("file", file);

      // Eksekusi POST request ke endpoint /order/invoice/{id}
      const response = await api.post(`/order/invoice/${id}`, formDataPayload, {
        headers: {
          "Content-Type": "multipart/form-data" // Memberitahu axios untuk menyusun boundary data berkas
        }
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Dokumen invoice sukses diunggah!");
        setSuccess(true);
      }
    } catch (error) {
      console.error("Gagal mengunggah file invoice:", error);
      const errTxt = error.response?.data?.message || "Terjadi kesalahan internal server saat proses unggah.";
      toast.error(errTxt);
    } finally {
      setLoading(false);
    }
  };

  // Tampilan Loading Spinner sewaktu memverifikasi manifes ID Order ke server
  if (fetchingOrder) {
    return (
      <div style={{ fontFamily: "'Manrope', sans-serif", padding: 40, textAlign: "center" }}>
        <p style={{ color: "#6B7280", fontWeight: 600 }}>Memverifikasi manifes logistik...</p>
      </div>
    );
  }

  // Tampilan Error jika ID Order di URL parameter tidak terdaftar di DB
  if (!orderExists) {
    return (
      <div style={{ fontFamily: "'Manrope', sans-serif", padding: 40 }}>
        <p style={{ color: "#EF4444", fontWeight: 700 }}>Pesanan ID #{id} tidak ditemukan di sistem database.</p>
        <button
          onClick={() => navigate("/status-pengiriman")}
          style={{
            marginTop: 16, background: "#FFA000", color: "#fff", border: "none",
            borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer",
          }}
        >
          Kembali ke Monitoring
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Modal Sukses */}
      <SuccessModal open={success} onClose={() => navigate("/status-pengiriman")} />

      <div style={{ fontFamily: "'Manrope', sans-serif", background: "#F8F9FB", minHeight: "100vh", padding: "40px 40px" }}>

        {/* Jalur Breadcrumb Navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <span
            onClick={() => navigate("/status-pengiriman")}
            style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.8, cursor: "pointer" }}
          >
            Status Pesanan
          </span>
          <span style={{ color: "#9CA3AF", fontSize: 13 }}>›</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#FFA000", textTransform: "uppercase", letterSpacing: 0.8 }}>
            Pesanan {id}
          </span>
        </div>

        {/* Judul Utama Halaman */}
        <h1 style={{ fontSize: 30, fontWeight: 800, color: "#111827", margin: 0 }}>Invoice</h1>
        <h2 style={{ fontSize: 30, fontWeight: 800, color: "#FFA000", margin: "4px 0 0" }}>#{id}</h2>
        <p style={{ fontSize: 13, color: "#9CA3AF", margin: "10px 0 28px" }}>Kirim berkas tagihan digital resmi kepada pihak pelanggan</p>

        {/* Panel Form Pengunggahan */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F0F0F0", boxShadow: "0 1px 6px rgba(0,0,0,0.04)", padding: "32px", maxWidth: 900 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Kirim Dokumen Pembayaran</div>
              <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>Seret atau unggah file penagihan di bawah ini</div>
            </div>
            <button
              onClick={() => navigate("/status-pengiriman")}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 4 }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Zona Deteksi Drag & Drop File */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]); }}
            style={{
              border: "2px dashed #FFA000", borderRadius: 12, padding: "56px 24px",
              textAlign: "center", cursor: "pointer",
              background: dragOver ? "rgba(254,243,199,0.5)" : "#fff", transition: "background 0.2s",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="16" width="44" height="30" rx="4" fill="#FFA000" />
                <path d="M4 20C4 17.8 5.8 16 8 16H22L26 12H44C46.2 12 48 13.8 48 16V20H4Z" fill="#D97706" />
                <circle cx="26" cy="31" r="9" fill="white" />
                <path d="M26 27L26 35M26 27L23 30M26 27L29 30" stroke="#FFA000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              {file ? (
                <>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{file.name}</div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    style={{ fontSize: 12, color: "#EF4444", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}
                  >
                    Ganti Berkas Dokumen
                  </button>
                </>
              ) : (
                <>
                  <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>Seret dokumen berkas Anda ke area ini untuk memulai</p>
                  <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>ATAU</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    style={{
                      border: "1px solid #FFA000", color: "#FFA000", background: "#fff",
                      fontSize: 13, fontWeight: 600, padding: "6px 20px", borderRadius: 8,
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    Telusuri File Lokal
                  </button>
                </>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                hidden
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </div>
          </div>

          <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 10, marginBottom: 0 }}>
            Ekstensi berkas yang didukung sistem: .pdf, .png, .jpg (Maksimal kapasitas standar 10MB)
          </p>

          {/* Tombol Aksi Kontrol */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
            <button
              onClick={() => navigate("/status-pengiriman")}
              style={{ border: "1px solid #E5E7EB", background: "#fff", color: "#374151", borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={!file || loading}
              style={{
                background: "#FFA000", color: "#fff", border: "none", borderRadius: 8,
                padding: "10px 32px", fontSize: 14, fontWeight: 700,
                cursor: !file || loading ? "not-allowed" : "pointer",
                opacity: !file || loading ? 0.5 : 1, fontFamily: "inherit",
              }}
            >
              {loading ? "Mengirim ke PostgreSQL..." : "Unggah Invoice"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}