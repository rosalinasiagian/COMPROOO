import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Truck, Loader2 } from "lucide-react";
import { api } from "../lib/api"; // 🌟 Pastikan path axios/api helper kamu sudah benar
import { toast } from "sonner";
import { Button } from "../components/ui/button";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const navigate = useNavigate();

  // ── 1. AMBIL DATA LANGSUNG DARI API BACKEND SECARA MANDIRI ──
  useEffect(() => {
    const fetchAdminDashboardData = async () => {
      setOrdersLoading(true);
      try {
        const token = localStorage.getItem('mpl_token');
        if (!token) {
          toast.error("Sesi habis, silakan login kembali");
          navigate("/masuk");
          return;
        }

        // Ambil data order dari endpoint backend (Ganti rute jika admin memiliki endpoint khusus)
        const response = await api.get('/order/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Bongkar pembungkus data standard response JSON (response.data.data)
        const resData = response.data?.data;

        if (Array.isArray(resData)) {
          const sorted = resData.sort((a, b) => {
            if (a.status !== "PENDING" && b.status === "PENDING") return -1;
            if (a.status === "PENDING" && b.status !== "PENDING") return 1;
            return b.id - a.id;
          });
          
          // HAPUS DUPLIKAT SPAM (Identik pada menit yang sama)
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
          
          setOrders(deduplicated);
        } else if (resData && typeof resData === 'object') {
          // Antisipasi jika data tunggal, dibungkus menjadi array []
          setOrders([resData]);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Gagal memuat data dashboard admin:", err);
        toast.error("Gagal menyinkronkan data terbaru dari server");
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchAdminDashboardData();
  }, [navigate]);

  // ── 2. HITUNG STATISTIK SECARA DINAMIS BERDASARKAN HASIL DATA API ──
  const pending = orders.filter((o) => o?.status === "PENDING" || o?.status === "WAITING").length;

  const ongoing = orders.filter(
    (o) =>
      o?.status === "ACCEPT" ||
      o?.status === "ON_PROCESS" ||
      o?.status === "ONGOING" ||
      o?.statusPengiriman === "Dalam Perjalanan" ||
      o?.status === "Diproses"
  ).length;

  // ── 3. AMBIL 3 DATA PESANAN PALING TERBARU (DIBALIK DARI YANG TERAKHIR MASUK) ──
  const recent = Array.isArray(orders) ? [...orders].reverse().slice(0, 3) : [];

  const getInitials = (name) => {
    if (!name) return "PL";
    const words = name.trim().split(" ");
    return words.length > 1
      ? (words[0][0] + words[1][0]).toUpperCase()
      : words[0].slice(0, 2).toUpperCase();
  };

  const getAvatarBg = (id) => {
    const colors = ["bg-blue-100 text-blue-600", "bg-purple-100 text-purple-600", "bg-emerald-100 text-emerald-600", "bg-rose-100 text-rose-600"];
    const numericId = parseInt(id) || 0;
    return colors[numericId % colors.length];
  };

  return (
    <div className="max-w-[1200px]" data-testid="dashboard-page">
      {/* ── SEKSI STATISTIK UTAMA ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

        {/* Card Pesanan Tertunda */}
        <div className="bg-white rounded-2xl border border-gray-100 p-7 relative overflow-hidden shadow-sm" data-testid="stat-pending">
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-[#FFA000]" />
            </div>
            <span className="text-[10px] font-bold tracking-wider text-[#FFA000] bg-[#FEF3C7] px-2.5 py-1 rounded">PRIORITAS</span>
          </div>
          <div className="mt-6">
            <div className="text-5xl font-extrabold text-gray-900">
              {ordersLoading ? <Loader2 className="w-8 h-8 animate-spin text-gray-300" /> : pending}
            </div>
            <div className="text-[11px] tracking-[0.18em] uppercase text-gray-400 mt-2 font-semibold">Pesanan Tertunda</div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFA000]" />
            Menunggu verifikasi admin
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FFA000]" />
        </div>

        {/* Card Pengiriman Berjalan */}
        <div className="bg-[#0f1115] rounded-2xl p-7 text-white relative overflow-hidden shadow-sm" data-testid="stat-ongoing">
          <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center">
            <Truck className="w-5 h-5 text-[#FFA000]" />
          </div>
          <div className="mt-6">
            <div className="text-5xl font-extrabold">
              {ordersLoading ? <Loader2 className="w-8 h-8 animate-spin text-gray-500" /> : ongoing}
            </div>
            <div className="text-[11px] tracking-[0.18em] uppercase text-gray-400 mt-2 font-semibold">Pengiriman Berjalan</div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Distribusi aktif nasional
          </div>
        </div>
      </div>

      {/* ── SEKSI ANTREAN TABEL PESANAN MASUK TERBARU ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm" data-testid="recent-orders">
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-xl font-bold text-gray-900">Pesanan Terbaru</h2>
          <button onClick={() => navigate("/pesanan")} data-testid="lihat-semua-btn" className="text-[11px] font-bold tracking-wider text-[#875200] border-b border-[#875200] pb-0.5">
            LIHAT SEMUA
          </button>
        </div>

        {ordersLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[1.3fr_1.5fr_1.5fr_1fr_120px] gap-4 pb-3 border-b border-gray-100 text-[13px] font-bold text-gray-400 uppercase tracking-wider">
              <div className="text-left pl-4">ID Pesanan / Unit</div>
              <div className="text-left pl-10">Tujuan</div>
              <div className="text-left pl-4">Nama Pelanggan</div>
              <div className="text-center">No Telepon</div>
              <div className="text-center">Tindakan</div>
            </div>

            <div className="divide-y divide-gray-100">
              {recent.length === 0 ? (
                <div className="text-center text-gray-400 text-sm py-10">Belum ada antrean pesanan masuk</div>
              ) : (
                recent.map((o) => {
                  const namaPelanggan = o?.namaPengirim || o?.namaPenerima || "Pelanggan Umum";
                  const nomorTelepon = o?.nomorTeleponPengirim || o?.nomorTeleponPenerima || "-";
                  const kodeManifest = o?.orderNumber || o?.id;

                  return (
                    <div key={o.id} className="grid grid-cols-[1.3fr_1.5fr_1.5fr_1fr_120px] gap-4 py-5 items-center hover:bg-gray-50/50 transition-colors" data-testid={`order-row-${o.id}`}>
                      <div className="text-left pl-4">
                        <div className="font-bold text-gray-900">#{kodeManifest}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{o?.jenisKendaraan || "CDE Box"} • {o?.jenisPaket || "General Cargo"}</div>
                      </div>
                      <div className="text-left pl-10">
                        <div className="text-sm text-gray-900 line-clamp-1">{o?.alamatTujuan || "Alamat Belum Dispesifikasi"}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{o?.alamatAsal ? `Dari: ${o.alamatAsal}` : "Rute Domestik"}</div>
                      </div>
                      <div className="flex items-center gap-3 pl-4">
                        <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-[11px] font-bold ${getAvatarBg(o.id)}`}>
                          {getInitials(namaPelanggan)}
                        </div>
                        <div className="text-sm text-gray-900 font-medium leading-tight line-clamp-1">{namaPelanggan}</div>
                      </div>
                      <div className="text-sm text-gray-700 text-center font-mono">{nomorTelepon}</div>
                      <div className="text-center">
                        {o?.status === "PENDING" ? (
                          <Button
                            onClick={() => navigate(`/pesanan/${o.id}/verifikasi`)}
                            data-testid={`verifikasi-btn-${o.id}`}
                            className="h-9 px-5 text-[11px] font-bold tracking-wider text-white rounded-md hover:bg-[#E69000] transition-colors"
                            style={{ backgroundColor: '#FFA000' }}
                          >
                            VERIFIKASI
                          </Button>
                        ) : (
                          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded">
                            {o?.status === "ACCEPT" || o?.status === "ON_PROCESS" || o?.status === "ONGOING" || o?.status === "Diproses"
                              ? "ONGOING"
                              : o?.status}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}