import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { User } from "lucide-react";
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
          VERIFIKASI BERHASIL
        </div>
        
        <div style={{
          fontSize: 12, fontWeight: 600,
          color: "#9CA3AF", letterSpacing: 1,
          textAlign: "center", marginTop: -16, marginBottom: 8,
          textTransform: "uppercase"
        }}>
          Silahkan melihat riwayat di status pengiriman
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
          LIHAT STATUS PENGIRIMAN
        </button>
      </div>
    </div>
  );
}

export default function DetailVerifikasi() {
  const { id } = useParams();
  const { orders, verifyOrder } = useData();
  const navigate = useNavigate();
  const order = orders.find((o) => o.id === id);

  const [agree, setAgree] = useState(false);
  const [driver, setDriver] = useState({ name: "", plate: "" });
  const [showSuccess, setShowSuccess] = useState(false);

  if (!order) {
    return (
      <div className="max-w-[1100px]">
        <p className="text-gray-500">Pesanan tidak ditemukan.</p>
        <Button onClick={() => navigate("/pesanan")} className="mt-4">Kembali</Button>
      </div>
    );
  }

  const handleVerify = () => {
    if (!agree) return toast.error("Centang persetujuan terlebih dahulu");
    if (!driver.name || !driver.plate) return toast.error("Lengkapi info pengantar");
    verifyOrder(order.id, driver);
    setShowSuccess(true);
  };

  return (
    <div className="max-w-[1100px]" data-testid="detail-verifikasi-page">
      <h1 className="text-3xl font-extrabold text-gray-900">Detail Pesanan</h1>
      <h2 className="text-3xl font-extrabold mt-1" style={{ color: "#FFA000" }}>#{order.id}</h2>
      <div className="mt-2 text-[11px] tracking-wider uppercase text-gray-500">
        Data Pesanan <span className="text-gray-300 mx-1">›</span>
        <span className="font-semibold" style={{ color: "#FFA000" }}>Pesanan MP-{order.manifestId}</span>
      </div>
      <p className="text-sm text-gray-600 mt-3 mb-7">Periksa kelengkapan data sebelum membuat invoice</p>

      {/* Info Card */}
      <div className="mpl-card p-7 relative overflow-hidden" style={{ border: "0.5px solid ..." }}>
      {/* Border kiri dengan rounded top */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 8,
          backgroundColor: "#FFA000",
          borderRadius: "12px 0 0 12px",
        }}
      />
      <span
        className="absolute right-7 top-7 text-[10px] font-bold tracking-wider text-white px-2.5 py-1 rounded"
        style={{ backgroundColor: "#FFA000" }}
      >
        MANIFEST ID: #{order.manifestId}
      </span>
        <div className="text-[11px] tracking-[0.15em] uppercase text-gray-400 font-semibold mb-4">Informasi Pelanggan</div>

        <div className="grid grid-cols-2 gap-x-12 gap-y-4">
          <Field label="Nama Pengirim / Gudang" value={order.sender.name} bold />
          <Field label="Nama Penerima / Gudang" value={order.receiver.name} bold />
          <Field label="PIC Pengirim" value={order.sender.pic} bold />
          <Field label="PIC Penerima" value={order.receiver.pic} bold />
          <Field label="Nomor Telepon Pengirim" value={order.sender.phone} bold />
          <Field label="Nomor Telepon Penerima" value={order.receiver.phone} bold />
        </div>

        <div className="mt-7 pt-6 border-t border-gray-100">
          <div className="text-[11px] tracking-[0.15em] uppercase text-gray-400 font-semibold mb-2">Informasi Muatan</div>
          <div className="text-2xl font-bold text-gray-900 mb-5">{order.cargo.title}</div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Stat label="Total Berat" value={order.cargo.weight} unit="KG" />
            <Stat label="Jenis Paket" value={order.cargo.packageType} unit="" />
            <Stat label="Total Paket" value={order.cargo.totalPackage} unit="PAKET" />
          </div>
          <div className="flex items-center gap-4">
            <img src={order.vehicle.image} alt={order.vehicle.type} className="w-28 h-20 rounded-lg object-cover bg-gray-100" />
            <div>
              <div className="text-lg font-bold text-gray-900">{order.vehicle.type}</div>
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <span style={{ color: "#FFA000" }}>⬡</span> Kapasitas:{" "}
                <span className="font-semibold text-gray-700">{order.vehicle.capacity}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Route + Approval side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Rute Pengiriman */}
        <div className="mpl-card p-7">
          <div className="text-[11px] tracking-[0.15em] uppercase text-gray-400 font-semibold mb-4">Rute Pengiriman</div>
          <div className="space-y-5">
            <RoutePoint type="muat" city={order.route.pickup.city} name={order.route.pickup.name} address={order.route.pickup.address} />
            <RoutePoint type="bongkar" city={order.route.dropoff.city} name={order.route.dropoff.name} address={order.route.dropoff.address} />
          </div>
        </div>

        {/* Approval + Tombol */}
        <div className="mpl-card p-7 flex flex-col justify-between">
          <div
            className="flex items-start gap-3 cursor-pointer"
            onClick={() => setAgree((prev) => !prev)}
          >
            <Checkbox
              id="agree-checkbox"
              checked={agree}
              onCheckedChange={(val) => setAgree(!!val)}
              data-testid="agree-checkbox"
              className="mt-0.5 pointer-events-none"
            />
            <span className="text-sm text-gray-600 select-none">
              Saya menyatakan bahwa seluruh informasi di atas adalah benar dan saya menyetujui{" "}
              <span className="font-semibold" style={{ color: "#FFA000" }}>Syarat &amp; Ketentuan</span>{" "}
              pengiriman LogisticsLedger.
            </span>
          </div>

          <div className="flex items-center justify-end gap-4 mt-8">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              data-testid="back-btn"
              className="h-12 px-6 bg-white text-gray-800 border border-gray-200 hover:bg-gray-50"
            >
              Kembali
            </Button>
            <Button
              type="button"
              onClick={handleVerify}
              data-testid="verifikasi-pesanan-btn"
              className="h-12 px-6 text-[11px] tracking-wider text-white font-bold rounded-lg leading-tight"
              style={{ backgroundColor: "#FFA000", border: "none" }}
            >
              VERIFIKASI<br />PESANAN
            </Button>
          </div>
        </div>
      </div>

      {/* Informasi Pengantar — full width below */}
      <div className="mpl-card p-7 mt-6">
        <div className="text-[11px] tracking-[0.15em] uppercase text-gray-400 font-semibold mb-4">Informasi Pengantar</div>
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            <User className="w-7 h-7 text-gray-400" />
          </div>
          <div className="flex-1 space-y-3 max-w-xs">
            <div>
              <label className="text-[10px] tracking-wider uppercase text-gray-400 font-semibold">Nama Driver</label>
              <Input
                data-testid="driver-name"
                placeholder="cth: Budi"
                value={driver.name}
                onChange={(e) => setDriver((prev) => ({ ...prev, name: e.target.value }))}
                className="mt-1 bg-gray-50 border-gray-100"
              />
            </div>
            <div>
              <label className="text-[10px] tracking-wider uppercase text-gray-400 font-semibold">Plat Nomor</label>
              <Input
                data-testid="driver-plate"
                placeholder="cth: BK 4511 IA"
                value={driver.plate}
                onChange={(e) => setDriver((prev) => ({ ...prev, plate: e.target.value }))}
                className="mt-1 bg-gray-50 border-gray-100"
              />
            </div>
          </div>
        </div>
      </div>

      <SuccessModal open={showSuccess} onClose={() => navigate("/status-pengiriman")} />
    </div>
  );
}

function Field({ label, value, bold }) {
  return (
    <div>
      <div className="text-[10px] tracking-[0.15em] uppercase text-gray-400 font-semibold">{label}</div>
      <div className={`mt-1 text-gray-900 ${bold ? "font-bold text-[15px]" : ""}`}>{value}</div>
    </div>
  );
}

function Stat({ label, value, unit }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="text-[10px] tracking-[0.15em] uppercase text-gray-400 font-semibold">{label}</div>
      <div className="mt-2 text-gray-900 flex items-baseline gap-1">
        <span className="text-xl font-bold">{value}</span>
        {unit && <span className="text-xs text-gray-500">{unit}</span>}
      </div>
    </div>
  );
}

function RoutePoint({ type, city, name, address }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center pt-1">
        <div className="w-3.5 h-3.5 rounded-full border-[3px] bg-white" style={{ borderColor: "#FFA000" }} />
        {type === "muat" && <div className="w-px flex-1 border-l-2 border-dashed border-gray-300 mt-1" />}
      </div>
      <div className="flex-1 pb-1">
        <div className="text-[10px] tracking-[0.15em] uppercase font-bold" style={{ color: "#FFA000" }}>
          Titik {type === "muat" ? "Muat" : "Bongkar"} — {city}
        </div>
        <div className="text-[15px] font-bold text-gray-900 mt-1">{name}</div>
        <div className="text-xs text-gray-500 mt-0.5">{address}</div>
      </div>
    </div>
  );
}