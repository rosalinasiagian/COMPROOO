import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import { X } from "lucide-react";
import { toast } from "sonner";

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
          <circle
            cx="50" cy="50" r="46"
            fill="#f0fdf4" stroke="#22c55e" strokeWidth="3.5"
            className="pop-circle"
          />
          <polyline
            points="28,52 44,68 72,36"
            fill="none"
            stroke="#22c55e"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="check-line"
          />
        </svg>

        <div style={{
          fontSize: 17, fontWeight: 800,
          color: "#111827", letterSpacing: 1,
          textAlign: "center",
        }}>
          INVOICE BERHASIL TERKIRIM
        </div>
        
        <div style={{
          fontSize: 11, fontWeight: 600,
          color: "#9CA3AF", letterSpacing: 0.5,
          textAlign: "center", marginTop: -16, marginBottom: 8,
          textTransform: "uppercase"
        }}>
          Shelter akan menghubungi anda atau anda bisa menghubungi shelter
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

export default function UpInvoice() {
  const { id } = useParams();
  const { orders = [], setInvoiceUploaded } = useData();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const order = orders.find((o) => String(o.id) === String(id));

  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!order) {
    return (
      <div style={{ fontFamily: "'Manrope', sans-serif", padding: 40 }}>
        <p style={{ color: "#6B7280" }}>Pesanan tidak ditemukan.</p>
        <button
          onClick={() => navigate("/status-pengiriman")}
          style={{
            marginTop: 16, background: "#FFA000", color: "#fff", border: "none",
            borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer",
          }}
        >
          Kembali
        </button>
      </div>
    );
  }

  const handleFile = (f) => {
    if (!f) return;
    const validType = f.type === "application/pdf" || f.type === "image/png";
    if (!validType) { toast.error("File harus PDF atau PNG"); return; }
    setFile(f);
  };

  const handleSubmit = async () => {
    if (!file) { toast.error("Pilih file terlebih dahulu"); return; }
    try {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 800));
      setInvoiceUploaded(order.id);
      setSuccess(true);
    } catch {
      toast.error("Gagal upload invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      <SuccessModal open={success} onClose={() => navigate("/status-pengiriman")} />

      {/* ── MAIN PAGE ── */}
      <div style={{ fontFamily: "'Manrope', sans-serif", background: "#F8F9FB", minHeight: "100vh", padding: "40px 40px" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <span
            onClick={() => navigate("/status-pengiriman")}
            style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.8, cursor: "pointer" }}
          >
            Status Pesanan
          </span>
          <span style={{ color: "#9CA3AF", fontSize: 13 }}>›</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#FFA000", textTransform: "uppercase", letterSpacing: 0.8 }}>
            Pesanan {order.id}
          </span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 30, fontWeight: 800, color: "#111827", margin: 0 }}>Invoice</h1>
        <h2 style={{ fontSize: 30, fontWeight: 800, color: "#FFA000", margin: "4px 0 0" }}>#{order.id}</h2>
        <p style={{ fontSize: 13, color: "#9CA3AF", margin: "10px 0 28px" }}>Kirim invoice ke customer</p>

        {/* Card */}
        <div style={{
          background: "#fff", borderRadius: 16, border: "1px solid #F0F0F0",
          boxShadow: "0 1px 6px rgba(0,0,0,0.04)", padding: "32px",
          maxWidth: 900,
        }}>
          {/* Card Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Kirim Invoice</div>
              <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>Tambahkan dokumen disini</div>
            </div>
            <button
              onClick={() => navigate("/status-pengiriman")}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 4 }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Upload Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]); }}
            style={{
              border: "2px dashed #FFA000",
              borderRadius: 12,
              padding: "56px 24px",
              textAlign: "center",
              cursor: "pointer",
              background: dragOver ? "rgba(254,243,199,0.5)" : "#fff",
              transition: "background 0.2s",
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
                    style={{ fontSize: 12, color: "#EF4444", background: "none", border: "none", cursor: "pointer" }}
                  >
                    Hapus file
                  </button>
                </>
              ) : (
                <>
                  <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>Seret file Anda untuk memulai pengunggahan</p>
                  <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>ATAU</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    style={{
                      border: "1px solid #FFA000", color: "#FFA000", background: "#fff",
                      fontSize: 13, fontWeight: 600, padding: "6px 20px", borderRadius: 8,
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                    onMouseEnter={(e) => e.target.style.background = "#FEF3C7"}
                    onMouseLeave={(e) => e.target.style.background = "#fff"}
                  >
                    Telusuri file
                  </button>
                </>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png"
                hidden
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </div>
          </div>

          <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 10, marginBottom: 0 }}>
            Hanya mendukung file .pdf, .png.
          </p>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
            <button
              onClick={() => navigate("/status-pengiriman")}
              style={{
                border: "1px solid #E5E7EB", background: "#fff", color: "#374151",
                borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Kembali
            </button>
            <button
              onClick={handleSubmit}
              disabled={!file || loading}
              style={{
                background: "#FFA000",
                color: "#fff", border: "none", borderRadius: 8,
                padding: "10px 32px", fontSize: 14, fontWeight: 700,
                cursor: !file || loading ? "not-allowed" : "pointer",
                opacity: !file || loading ? 0.5 : 1,
                fontFamily: "inherit",
              }}
            >
              {loading ? "Mengirim..." : "Kirim"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}