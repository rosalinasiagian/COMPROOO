import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import { Button } from "../components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 4;

export default function DataPesanan() {
  const { orders } = useData();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const start = (page - 1) * PAGE_SIZE;
  const items = orders.slice(start, start + PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));

  return (
    <div className="max-w-[1200px]" data-testid="data-pesanan-page">
      <h1 className="text-3xl font-extrabold text-gray-900">Data Pemesanan</h1>
      <p className="text-sm text-gray-500 mt-1 mb-8">Semua Pesanan Masuk</p>

      <div className="mpl-card overflow-hidden">
        <div className="grid grid-cols-[1fr_1.3fr_1fr_1fr_120px] gap-4 px-7 py-4 mpl-table-header bg-gray-50/60">
          <div>ID Pesanan</div>
          <div>Nama Pelanggan</div>
          <div>Tanggal</div>
          <div>No Telephone</div>
          <div className="text-right">Aksi</div>
        </div>

        <div className="divide-y divide-gray-100">
          {items.map((o) => (
            <div key={o.id} className="grid grid-cols-[1fr_1.3fr_1fr_1fr_120px] gap-4 px-7 py-5 items-center" data-testid={`pesanan-row-${o.id}`}>
              <div className="font-bold text-gray-900">#{o.id}</div>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold ${o.avatarColor}`}>
                  {o.initials}
                </div>
                <span className="text-sm text-gray-900">{o.customer}</span>
              </div>
              <div className="text-sm text-gray-700">{o.date}</div>
              <div className="text-sm text-gray-700">{o.phone}</div>
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
          ))}
        </div>

        <div className="flex items-center justify-between px-7 py-4 bg-gray-50/60 border-t border-gray-100">
          <div className="text-[11px] tracking-wider uppercase text-gray-400">
            Menampilkan {start + 1}-{Math.min(start + PAGE_SIZE, orders.length)} dari {orders.length} transaksi
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              data-testid="page-prev"
              className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center disabled:opacity-40 hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              data-testid="page-next"
              className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center disabled:opacity-40 hover:bg-white"
            >
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}