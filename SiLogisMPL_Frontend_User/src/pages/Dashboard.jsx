import { useNavigate } from "react-router-dom";
import { ClipboardList, Truck } from "lucide-react";
import { useData } from "../contexts/DataContext";
import { Button } from "../components/ui/button";

export default function Dashboard() {
  const { orders } = useData();
  const navigate = useNavigate();

  const pending = orders.filter((o) => !o.verified).length;
  const ongoing = 156;
  const recent = orders.slice(0, 3);

  return (
    <div className="max-w-[1200px]" data-testid="dashboard-page">
      {/* Stat cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="mpl-card p-7 relative overflow-hidden" data-testid="stat-pending">
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-[#FFA000]" />
            </div>
            <span className="text-[10px] font-bold tracking-wider text-[#FFA000] bg-[#FEF3C7] px-2.5 py-1 rounded">PRIORITAS</span>
          </div>
          <div className="mt-6">
            <div className="text-5xl font-extrabold text-gray-900">{pending}</div>
            <div className="text-[11px] tracking-[0.18em] uppercase text-gray-400 mt-2 font-semibold">Pesanan Tertunda</div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFA000]" />
            Menunggu verifikasi admin
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FFA000]" />
        </div>

        <div className="bg-[#0f1115] rounded-2xl p-7 text-white relative overflow-hidden" data-testid="stat-ongoing">
          <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center">
            <Truck className="w-5 h-5 text-[#FFA000]" />
          </div>
          <div className="mt-6">
            <div className="text-5xl font-extrabold">{ongoing}</div>
            <div className="text-[11px] tracking-[0.18em] uppercase text-gray-400 mt-2 font-semibold">Pengiriman Berjalan</div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Distribusi aktif nasional
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mpl-card p-8" data-testid="recent-orders">
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-xl font-bold text-gray-900">Pesanan Terbaru</h2>
          <button
            onClick={() => navigate("/pesanan")}
            data-testid="lihat-semua-btn"
            className="text-[11px] font-bold tracking-wider text-[#875200] border-b border-[#875200] pb-0.5"
          >
            LIHAT SEMUA
          </button>
        </div>

        <div className="grid grid-cols-[1.3fr_1.5fr_1.5fr_1fr_120px] gap-4 pb-3 border-b border-gray-100 mpl-table-header">
        <div className="text-center">ID Pesanan</div>
        <div className="text-center">Tujuan</div>
        <div className="text-center">Nama Pelanggan</div>
        <div className="text-center">No Telephone</div>
        <div className="text-center">Tindakan</div>
      </div>

        <div className="divide-y divide-gray-100">
        {recent.map((o) => (
          <div key={o.id} className="grid grid-cols-[1.3fr_1.5fr_1.5fr_1fr_120px] gap-4 py-5 items-center" data-testid={`order-row-${o.id}`}>
            <div className="text-left pl-4">
              <div className="font-bold text-gray-900">#{o.id}</div>
              <div className="text-xs text-gray-400 mt-0.5">{o.cargoType} • {o.weight}</div>
            </div>
            <div className="text-left pl-10">
              <div className="text-sm text-gray-900">{o.destination}</div>
              <div className="text-xs text-gray-400 mt-0.5">{o.destLabel}</div>
            </div>
            <div className="flex items-center gap-3 pl-4">
              <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-[11px] font-bold ${o.avatarColor}`}>
                {o.initials}
              </div>
              <div className="text-sm text-gray-900 leading-tight">{o.customer}</div>
            </div>
            <div className="text-sm text-gray-700 text-center">{o.phone}</div>
            <div className="text-center">
              <Button
              onClick={() => navigate(`/pesanan/${o.id}/verifikasi`)}
              data-testid={`verifikasi-btn-${o.id}`}
              className="h-9 px-5 text-[11px] tracking-wider text-white rounded-md"
              style={{ backgroundColor: '#FFA000' }}
            >
              VERIFIKASI
            </Button>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}