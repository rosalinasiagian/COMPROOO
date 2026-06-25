import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { Loader2 } from "lucide-react";
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

        <div style={{ fontSize: 17, fontWeight: 800, color: "#111827", letterSpacing: 1, textAlign: "center" }}>
          PERUBAHAN BERHASIL
        </div>

        <button
          onClick={onClose}
          style={{
            background: "#FFA000", color: "#fff",
            border: "none", borderRadius: 8,
            padding: "10px 32px", fontSize: 14,
            fontWeight: 700, cursor: "pointer", width: "100%"
          }}
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

// ✅ 1. Struktur status menggunakan pasangan Label (untuk UI) dan Value (untuk API URL)
const DELIVERY_STATUSES = [
  { label: "Diproses", value: "Diproses" },
  { label: "Barang Diambil", value: "Barang-Diambil" },
  { label: "Dalam Perjalanan", value: "Dalam-Perjalanan" },
  { label: "Tiba di Tujuan", value: "Tiba-di-Tujuan" }
];

const PAGE_SIZE = 4;

const getInitials = (name) => {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// 🛠️ 2. PERBAIKAN DROPDOWN COMPONENT (Menerima value dan mengembalikan value ke parent)
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

  // Cari objek status saat ini berdasarkan value database/state untuk menampilkan label di tombol
  const currentStatusObj = DELIVERY_STATUSES.find(s => s.value === value) || DELIVERY_STATUSES[0];
  const words = currentStatusObj.label.split(" ");

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        ref={btnRef}
        type="button"
        onClick={handleOpen}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "6px 14px", height: 48, minWidth: 130, borderRadius: 6,
          background: "#F3F4F6", border: "1px solid #E5E7EB", fontSize: 12,
          fontWeight: 600, color: "#374151", cursor: "pointer", lineHeight: 1.4,
          textAlign: "center", fontFamily: "inherit",
        }}
      >
        {words.length > 1 ? (
          <>
            <span>{words.slice(0, Math.ceil(words.length / 2)).join(" ")}</span>
            <span>{words.slice(Math.ceil(words.length / 2)).join(" ")}</span>
          </>
        ) : (
          <span>{currentStatusObj.label}</span>
        )}
      </button>

      {open && (
        <div style={{
          position: "fixed", top: dropPos.top, left: dropPos.left,
          minWidth: Math.max(dropPos.width, 172), zIndex: 9999,
          background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8,
          boxShadow: "0 4px 16px rgba(0,0,0,0.10)", overflow: "hidden",
        }}>
          {DELIVERY_STATUSES.map((item) => (
            <button
              key={item.value}
              type="button"
              // 🛠️ Kirim item.value (yang ada tanda hubung, bebas spasi) saat diklik
              onClick={() => { onChange(item.value); setOpen(false); }}
              style={{
                display: "block", width: "100%", textAlign: "left", padding: "10px 16px",
                fontSize: 13, color: "#111827",
                background: item.value === value ? "#FEF3C7" : "transparent",
                border: "none", cursor: "pointer", fontFamily: "inherit",
              }}
              onMouseEnter={(e) => { if (item.value !== value) e.target.style.background = "#F9FAFB"; }}
              onMouseLeave={(e) => { if (item.value !== value) e.target.style.background = "transparent"; }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StatusPengiriman() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localStatuses, setLocalStatuses] = useState({});
  const [page, setPage] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchActiveDeliveries = async () => {
    setLoading(true);
    try {
      const response = await api.get('/order/');
      const result = response.data?.data || response.data;
      if (Array.isArray(result)) {
        // HAPUS DUPLIKAT SPAM LINTAS STATUS
        const sorted = [...result].sort((a, b) => {
          if (a.status !== "PENDING" && b.status === "PENDING") return -1;
          if (a.status === "PENDING" && b.status !== "PENDING") return 1;
          return b.id - a.id;
        });
        
        const seen = new Set();
        const deduplicated = [];
        for (const o of sorted) {
          const parts = (o.orderNumber || "").split("-");
          const datePart = parts[1] || "";
          const timeMinute = parts[2] ? parts[2].substring(0, 4) : ""; // HHMM
          const fingerprint = `${o.namaPengirim}|${o.namaPenerima}|${o.totalBerat}|${o.jenisKendaraan}|${datePart}|${timeMinute}`;
          
          if (!seen.has(fingerprint)) {
            seen.add(fingerprint);
            deduplicated.push(o);
          }
        }
        
        // FILTER DATA ONGOING
        const activeDeliveries = deduplicated.filter(o => o.status === "ONGOING");
        setOrders(activeDeliveries);
      }
    } catch (error) {
      console.error("Gagal mengambil status logistik:", error);
      toast.error("Gagal sinkronisasi data dari server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveDeliveries();
  }, []);

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));

  const items = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return orders.slice(start, start + PAGE_SIZE);
  }, [orders, page]);

  const startIndex = (page - 1) * PAGE_SIZE;

  const handleStatusChange = (id, statusValue) => {
    // Menyimpan value yang aman (contoh: "Barang-Diambil") ke dalam state penampung perubahan
    setLocalStatuses((prev) => ({ ...prev, [id]: statusValue }));
  };

  // 🛠️ 3. FUNGSI SAVE: Mengirimkan data value bersih ke PatchMapping Spring Boot
  const handleSave = async () => {
    setSaving(true);
    try {
      // Object.entries mengekstrak [id, statusValue]
      await Promise.all(
        Object.entries(localStatuses).map(([id, statusValue]) =>
          // URL final di browser akan tereksekusi rapi: /order/1/pengiriman/Barang-Diambil
          api.patch(`/order/${id}/pengiriman/${statusValue}`)
        )
      );

      setLocalStatuses({});
      toast.success("Seluruh status pengiriman berhasil diperbarui!");
      setShowSuccess(true);
      fetchActiveDeliveries();
    } catch (err) {
      console.error("Gagal menyimpan perubahan status pengiriman:", err);
      toast.error("Gagal memperbarui status ke database Spring Boot.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div style={{ fontFamily: "'Inter', sans-serif", background: "#F8F9FB", minHeight: "100vh" }}>
        <main style={{ padding: "40px 40px" }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: 0, fontFamily: "Manrope" }}>
            Status Pengiriman
          </h1>
          <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 4, marginBottom: 28 }}>
            Perbaharui Status Pengiriman Lapangan Armada Proyek
          </p>

          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #F0F0F0", boxShadow: "0 1px 6px rgba(0,0,0,0.04)", overflow: "hidden" }}>
            {/* Table Header */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 1fr 1.8fr", gap: 16, padding: "14px 28px", background: "#FAFAFA", borderBottom: "1px solid #F0F0F0" }}>
              {["ID PESANAN", "NAMA PELANGGAN", "ARMADA FLIT", "PERBAHARUI STATUS"].map((h) => (
                <div key={h} style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: 0.8, textAlign: "center" }}>{h}</div>
              ))}
            </div>

            {loading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px" }}>
                <Loader2 style={{ width: 24, height: 24, color: "#FFA000", animation: "spin 1s linear infinite" }} />
              </div>
            ) : (
              <div>
                {items.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "50px", color: "#9CA3AF", fontSize: 14, fontWeight: 500 }}>
                    Tidak ada pesanan aktif dalam pengantaran lapangan saat ini.
                  </div>
                ) : (
                  items.map((o, i) => {
                    const customerName = o.namaPengirim || o.picPengirim || "Pelanggan";
                    const initials = getInitials(customerName);
                    // Ambil status pengiriman lokal, jika belum diubah ambil dari database, jika null set default "Diproses"
                    const currentStatus = localStatuses[o.id] ?? o.statusPengiriman ?? "Diproses";

                    return (
                      <div key={o.id} style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 1fr 1.8fr", gap: 16, padding: "18px 28px", alignItems: "center", borderBottom: i < items.length - 1 ? "1px solid #F9FAFB" : "none" }}>

                        {/* ID Pesanan */}
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#111827", textAlign: "center" }}>#{o.id}</div>

                        {/* Profil Pelanggan */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 16 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 8, background: "#FFA000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>
                            {initials}
                          </div>
                          <span style={{ fontSize: 13, color: "#111827", fontWeight: 600 }}>{customerName}</span>
                        </div>

                        {/* Info Armada */}
                        <div style={{ fontSize: 13, color: "#4B5563", fontWeight: 700, textAlign: "center" }}>
                          {o.jenisKendaraan || "Truck"}
                        </div>

                        {/* Dropdown Aksi */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
                          <button
                            onClick={() => navigate(`/invoice/${o.id}`)}
                            style={{
                              background: o.urlInvoice ? "#10B981" : "#FFA000", color: "#fff", border: "none",
                              borderRadius: 6, padding: "6px 14px", height: 48, fontSize: 11, fontWeight: 700,
                              cursor: "pointer", lineHeight: 1.3, textAlign: "center", minWidth: 90,
                            }}
                          >
                            {o.urlInvoice ? <>Invoice<br />Ready</> : <>Upload<br />Invoice</>}
                          </button>

                          <StatusDropdown
                            value={currentStatus}
                            onChange={(s) => handleStatusChange(o.id, s)}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Pagination Footer */}
            <div style={{ display: "flex", alignItems: "center", justifyValue: "space-between", padding: "12px 28px", background: "#FAFAFA", borderTop: "1px solid #F0F0F0", justifyContent: "space-between" }}>
              <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>
                MENAMPILKAN {startIndex + 1}-{Math.min(startIndex + PAGE_SIZE, orders.length)} DARI {orders.length} MANIFEST BERJALAN
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  { label: "<", action: () => setPage((p) => Math.max(1, p - 1)), disabled: page === 1 },
                  { label: ">", action: () => setPage((p) => Math.min(totalPages, p + 1)), disabled: page === totalPages },
                ].map((btn) => (
                  <button key={btn.label} onClick={btn.action} disabled={btn.disabled} style={{ width: 30, height: 30, border: "1px solid #E5E7EB", borderRadius: 6, background: "#fff", fontSize: 13, color: "#374151", cursor: btn.disabled ? "not-allowed" : "pointer", opacity: btn.disabled ? 0.4 : 1, fontFamily: "inherit" }}>{btn.label}</button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || Object.keys(localStatuses).length === 0}
            style={{
              marginTop: 24, background: "#FFA000", color: "#fff", border: "none",
              borderRadius: 8, padding: "12px 28px", fontSize: 14, fontWeight: 700,
              cursor: saving || Object.keys(localStatuses).length === 0 ? "not-allowed" : "pointer",
              opacity: Object.keys(localStatuses).length === 0 ? 0.5 : 1, transition: "opacity 0.2s"
            }}
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </main>
      </div>

      <SuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} />
    </>
  );
}