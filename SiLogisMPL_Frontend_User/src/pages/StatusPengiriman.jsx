import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DELIVERY_STATUSES = ["Diproses", "Barang Diambil", "Dalam Perjalanan", "Tiba di Tujuan"];
const MOCK_ORDERS = [
  { id: "LGD-29402", customer: "PT. Samudera Raya", date: "12 Okt 2023, 14:20", deliveryStatus: "Dalam Perjalanan", initials: "PT", avatarBg: "#FFA000", avatarText: "#fff" },
  { id: "LGD-29405", customer: "Andi Maulana",       date: "12 Okt 2023, 15:45", deliveryStatus: "Dalam Perjalanan", initials: "AM", avatarBg: "#9CA3AF", avatarText: "#fff" },
  { id: "LGD-29408", customer: "Global Food Corp",   date: "12 Okt 2023, 19:10", deliveryStatus: "Dalam Perjalanan", initials: "GF", avatarBg: "#6EE7B7", avatarText: "#065F46" },
  { id: "LGD-29412", customer: "Eka Lestari",        date: "13 Okt 2023, 08:30", deliveryStatus: "Dalam Perjalanan", initials: "EL", avatarBg: "#FDE68A", avatarText: "#92400E" },
  { id: "LGD-29415", customer: "Budi Santoso",       date: "13 Okt 2023, 10:00", deliveryStatus: "Diproses",         initials: "BS", avatarBg: "#BFDBFE", avatarText: "#1E40AF" },
  { id: "LGD-29418", customer: "Sari Indah",         date: "13 Okt 2023, 11:30", deliveryStatus: "Barang Diambil",  initials: "SI", avatarBg: "#F9A8D4", avatarText: "#9D174D" },
];

const PAGE_SIZE = 4;

function StatusDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
    setOpen((v) => !v);
  };

  const words = value.split(" ");

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        ref={btnRef}
        onClick={handleOpen}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "6px 14px",
          height: 48,
          minWidth: 100,
          borderRadius: 6,
          background: "#F3F4F6",
          border: "1px solid #E5E7EB",
          fontSize: 12,
          fontWeight: 600,
          color: "#374151",
          cursor: "pointer",
          lineHeight: 1.4,
          textAlign: "center",
          fontFamily: "inherit",
        }}
      >
        {words.length > 1 ? (
          <>
            <span>{words.slice(0, Math.ceil(words.length / 2)).join(" ")}</span>
            <span>{words.slice(Math.ceil(words.length / 2)).join(" ")}</span>
          </>
        ) : (
          <span>{value}</span>
        )}
      </button>

      {open && (
        <div style={{
          position: "fixed",
          top: dropPos.top,
          left: dropPos.left,
          minWidth: Math.max(dropPos.width, 172),
          zIndex: 9999,
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 8,
          boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
          overflow: "hidden",
        }}>
          {DELIVERY_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => { onChange(s); setOpen(false); }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "10px 16px",
                fontSize: 13,
                color: "#111827",
                background: s === value ? "#FEF3C7" : "transparent",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => { if (s !== value) e.target.style.background = "#F9FAFB"; }}
              onMouseLeave={(e) => { if (s !== value) e.target.style.background = "transparent"; }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SuccessModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 999,
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
          minWidth: 320,
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
          PERUBAHAN BERHASIL
        </div>

        <button
          onClick={onClose}
          style={{
            background: "#FFA000", color: "#fff",
            border: "none", borderRadius: 8,
            padding: "10px 32px", fontSize: 14,
            fontWeight: 700, cursor: "pointer",
          }}
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

export default function StatusPengiriman() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [page, setPage] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));

  const items = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return orders.slice(start, start + PAGE_SIZE);
  }, [orders, page]);

  const startIndex = (page - 1) * PAGE_SIZE;

  const handleStatusChange = (id, status) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, deliveryStatus: status } : o));
  };

  const handleSave = () => setShowSuccess(true);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      <div style={{ fontFamily: "'Manrope', sans-serif", background: "#F8F9FB", minHeight: "100vh" }}>
        <main style={{ padding: "40px 40px" }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: 0 }}>
            Status Pengiriman
          </h1>
          <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 4, marginBottom: 28 }}>
            Perbaharui Status Pengiriman
          </p>

          <div style={{
            background: "#fff", borderRadius: 14,
            border: "1px solid #F0F0F0",
            boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
            overflow: "hidden",
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.4fr 1fr 1.8fr",
              gap: 16, padding: "14px 28px",
              background: "#FAFAFA", borderBottom: "1px solid #F0F0F0",
            }}>
              {["ID PESANAN", "NAMA PELANGGAN", "TANGGAL", "STATUS"].map((h) => (
                <div key={h} style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: 0.8, textAlign: "center" }}>{h}</div>
              ))}
            </div>

            <div>
              {items.map((o, i) => (
                <div key={o.id} style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.4fr 1fr 1.8fr",
                  gap: 16, padding: "18px 28px",
                  alignItems: "center",
                  borderBottom: i < items.length - 1 ? "1px solid #F9FAFB" : "none",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#111827", textAlign: "center" }}>#{o.id}</div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 16 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 8,
                      background: o.avatarBg, color: o.avatarText,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 800, flexShrink: 0,
                    }}>{o.initials}</div>
                    <span style={{ fontSize: 13, color: "#111827", fontWeight: 500 }}>{o.customer}</span>
                  </div>

                  <div style={{ fontSize: 13, color: "#6B7280", textAlign: "center" }}>{o.date}</div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <button
                    onClick={() => navigate(`/invoice/${o.id}`)}
                    style={{
                      background: "#FFA000", color: "#fff", border: "none",
                      borderRadius: 6, padding: "6px 14px", height: 48,
                      fontSize: 12, fontWeight: 700, cursor: "pointer",
                      whiteSpace: "normal", lineHeight: 1.3, textAlign: "center",
                      minWidth: 80,
                    }}>
                    Upload<br />Invoice
                  </button>

                  <StatusDropdown
                    value={o.deliveryStatus}
                    onChange={(s) => handleStatusChange(o.id, s)}
                  />
                </div>
                </div>
              ))}
            </div>

            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 28px", background: "#FAFAFA", borderTop: "1px solid #F0F0F0",
            }}>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>
                MENAMPILKAN {startIndex + 1}-{Math.min(startIndex + PAGE_SIZE, orders.length)} DARI {orders.length} TRANSAKSI
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  { label: "<", action: () => setPage((p) => Math.max(1, p - 1)), disabled: page === 1 },
                  { label: ">", action: () => setPage((p) => Math.min(totalPages, p + 1)), disabled: page === totalPages },
                ].map((btn) => (
                  <button key={btn.label} onClick={btn.action} disabled={btn.disabled} style={{
                    width: 30, height: 30, border: "1px solid #E5E7EB", borderRadius: 6,
                    background: "#fff", fontSize: 13, color: "#374151",
                    cursor: btn.disabled ? "not-allowed" : "pointer",
                    opacity: btn.disabled ? 0.4 : 1, fontFamily: "inherit",
                  }}>{btn.label}</button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            style={{
              marginTop: 24, background: "#FFA000", color: "#fff", border: "none",
              borderRadius: 8, padding: "12px 28px", fontSize: 14, fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Simpan Perubahan
          </button>
        </main>
      </div>

      <SuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} />
    </>
  );
}