import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api"; // 🛠️ Pastikan path import helper api ini sudah sesuai
import { Button } from "../components/ui/button";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";

const PAGE_SIZE = 4;

// Fungsi Helper: Membuat inisial nama secara otomatis (misal: "Doni Sihombing" -> "DS")
const getInitials = (name) => {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Fungsi Helper: Memberikan warna latar belakang avatar secara acak
const getAvatarColor = (id) => {
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-purple-100 text-purple-700",
    "bg-pink-100 text-pink-700",
    "bg-indigo-100 text-indigo-700",
    "bg-orange-100 text-orange-700"
  ];
  return colors[id % colors.length] || colors[0];
};

export default function DataPesanan() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // FETCH DATA LANGSUNG LEWAT api.get('/order')
  useEffect(() => {
    const fetchAllOrders = async () => {
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
          
          // 🛠️ FILTER DATA: Hanya masukkan pesanan yang statusnya 'PENDING'
          const pendingOrders = deduplicated.filter(order => order.status === "PENDING");
          setOrders(pendingOrders);
        }
      } catch (error) {
        console.error("Gagal mengambil seluruh data pesanan masuk:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  const start = (page - 1) * PAGE_SIZE;
  const items = orders.slice(start, start + PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));

  // 1. Tampilan Loading State
  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center" data-testid="data-pesanan-loading">
        <div className="w-9 h-9 border-4 border-[#FFA000] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-semibold text-gray-500">Memuat data pesanan dari server...</p>
      </div>
    );
  }

  // 2. Tampilan Empty State (Jika tidak ada pesanan berstatus PENDING di PostgreSQL)
  if (orders.length === 0) {
    return (
      <div className="max-w-[1200px] py-16 text-center bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center mx-auto mt-10">
        <Package className="w-20 h-20 text-gray-200 mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Semua Pesanan Sudah Diverifikasi</h2>
        <p className="text-gray-400 text-sm mt-1">Tidak ada antrean manifest pengiriman baru saat ini.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px]" data-testid="data-pesanan-page">
      <h1 className="text-3xl font-extrabold text-gray-900">Data Pemesanan</h1>
      <p className="text-sm text-gray-500 mt-1 mb-8">Menampilkan pesanan masuk yang memerlukan verifikasi</p>

      <div className="mpl-card overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* Header Tabel */}
        <div className="grid grid-cols-[0.8fr_1.5fr_1.2fr_1fr_120px] gap-4 px-7 py-4 mpl-table-header bg-gray-50/60 font-bold text-xs tracking-wider text-gray-400 uppercase border-b border-gray-100">
          <div>ID Pesanan</div>
          <div>Nama Pelanggan / Perusahaan</div>
          <div>Muatan & Armada</div>
          <div>No. Telephone</div>
          <div className="text-right">Aksi</div>
        </div>

        {/* List Baris Transaksi */}
        <div className="divide-y divide-gray-100">
          {items.map((o) => {
            const customerName = o.namaPengirim || o.picPengirim || "Anonim";
            const initials = getInitials(customerName);
            const avatarColor = getAvatarColor(o.id);

            return (
              <div key={o.id} className="grid grid-cols-[0.8fr_1.5fr_1.2fr_1fr_120px] gap-4 px-7 py-5 items-center hover:bg-gray-50/40 transition-colors" data-testid={`pesanan-row-${o.id}`}>
                <div className="font-bold text-gray-900">#{o.id}</div>

                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${avatarColor}`}>
                    {initials}
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-sm font-semibold text-gray-900 truncate">{customerName}</span>
                    {o.picPengirim && <span className="text-[11px] text-gray-400 truncate">PIC: {o.picPengirim}</span>}
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm text-gray-800 font-medium">{o.jenisPaket || "Logistik"} ({o.totalBerat || 0} Kg)</span>
                  <span className="text-[11px] text-gray-400 uppercase font-bold tracking-tight">{o.jenisKendaraan || "Truck"}</span>
                </div>

                <div className="text-sm text-gray-700 font-medium">{o.nomorTeleponPengirim || "-"}</div>

                <div className="text-right">
                  <Button
                    onClick={() => navigate(`/pesanan/${o.id}/verifikasi`)}
                    data-testid={`verifikasi-row-${o.id}`}
                    className="h-9 px-5 text-[11px] tracking-wider font-bold text-white rounded-md hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: "#FFA000", border: "none" }}
                  >
                    VERIFIKASI
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigasi / Pagination */}
        <div className="flex items-center justify-between px-7 py-4 bg-gray-50/60 border-t border-gray-100">
          <div className="text-[11px] tracking-wider uppercase text-gray-400 font-medium">
            Menampilkan {start + 1}-{Math.min(start + PAGE_SIZE, orders.length)} dari {orders.length} antrean
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              data-testid="page-prev"
              className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center disabled:opacity-40 hover:bg-white bg-transparent transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              data-testid="page-next"
              className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center disabled:opacity-40 hover:bg-white bg-transparent transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}