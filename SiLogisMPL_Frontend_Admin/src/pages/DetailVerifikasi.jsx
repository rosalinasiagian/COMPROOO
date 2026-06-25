import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { User, MapPin, Download } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api"; // 🛠️ Menembak Spring Boot admin controller via API helper

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

        <div style={{ fontSize: 17, fontWeight: 800, color: "#111827", letterSpacing: 1, textAlign: "center" }}>
          VERIFIKASI BERHASIL
        </div>

        <div style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", letterSpacing: 1, textAlign: "center", marginTop: -16, marginBottom: 8, textTransform: "uppercase" }}>
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
          LIHAT DAFTAR UTAMA
        </button>
      </div>
    </div>
  );
}

export default function DetailVerifikasi() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [agree, setAgree] = useState(false);
  const [driver, setDriver] = useState({ name: "", plate: "", phone: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🛠️ 1. Ambil data spesifik order berdasarkan ID langsung dari Backend saat komponen dimuat
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        // Menembak endpoint backend untuk mendapatkan detail order
        const response = await api.get(`/order/${id}`);

        // response.data.data langsung merujuk ke objek {} yang kamu kirim di atas
        const result = response.data?.data || response.data;

        console.log("Data objek dari backend:", result);

        if (result && typeof result === 'object') {
          // 🛠️ LANGSUNG SET ORDER: Tanpa perlu array .find() lagi karena datanya sudah tunggal dan tepat!
          setOrder(result);
        } else {
          setOrder(null);
        }
      } catch (error) {
        console.error("Gagal memuat detail verifikasi order:", error);
        toast.error("Gagal terhubung dengan server logistik.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  // 🛠️ 2. Hubungkan ke admin controller PatchMapping("/{id}/{status}") milikmu
  const handleVerify = async () => {
    if (!agree) return toast.error("Centang persetujuan terlebih dahulu");
    if (!driver.name || !driver.plate || !driver.phone) return toast.error("Lengkapi info pengantar (Driver, Plat & No WA)");
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const driverPayload = {
        namaDriver: driver.name,
        platNomorKendaraan: driver.plate,
        nomorTeleponDriver: driver.phone
      };
      
      await api.patch(`/order/${order.id}/ONGOING`, driverPayload);

      toast.success("Manifest sukses diverifikasi ke status ONGOING!");
      setShowSuccess(true);
    } catch (error) {
      console.error("Gagal melakukan verifikasi pesanan:", error);
      toast.error(error.response?.data?.errors || error.response?.data?.message || "Gagal memperbarui status verifikasi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#FFA000] border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm text-gray-500 font-medium">Memuat berkas pesanan...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-[1100px] py-10 text-center bg-white rounded-2xl border">
        <p className="text-gray-500 font-medium">Berkas manifest ID #{id} tidak terdaftar di sistem.</p>
        <Button onClick={() => navigate("/pesanan")} className="mt-4 bg-[#FFA000] hover:bg-[#FFA000]/90 text-white">Kembali</Button>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px]" data-testid="detail-verifikasi-page">
      <h1 className="text-3xl font-extrabold text-gray-900">Detail Pesanan</h1>
      <h2 className="text-3xl font-extrabold mt-1" style={{ color: "#FFA000" }}>#{order.id}</h2>
      <div className="mt-2 text-[11px] tracking-wider uppercase text-gray-500">
        Data Pesanan <span className="text-gray-300 mx-1">›</span>
        <span className="font-semibold" style={{ color: "#FFA000" }}>Pesanan MP-{order.id}</span>
      </div>
      <p className="text-sm text-gray-600 mt-3 mb-7">Periksa kelengkapan data sebelum membuat invoice</p>

      {/* 🛠️ 3. SINKRONISASI VISUAL: Menggunakan kolom real dari database PostgreSQL kamu */}
      <div className="mpl-card p-7 bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden mb-6">
        <div
          style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: 8,
            backgroundColor: "#FFA000", borderRadius: "12px 0 0 12px",
          }}
        />
        <span className="absolute right-7 top-7 text-[10px] font-bold tracking-wider text-white px-2.5 py-1 rounded-sm bg-[#FFA000]">
          STATUS: {order.status || "PENDING"}
        </span>

        <div className="text-[11px] tracking-[0.15em] uppercase text-gray-400 font-semibold mb-6">Informasi Pelanggan</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <Field label="Nama Pengirim / Gudang" value={order.namaPengirim || "-"} bold />
          <Field label="Nama Penerima / Gudang" value={order.namaPenerima || "-"} bold />
          <Field label="PIC Pengirim" value={order.picPengirim || "-"} bold />
          <Field label="PIC Penerima" value={order.picPenerima || "-"} bold />
          <Field label="Nomor Telepon Pengirim" value={order.nomorTeleponPengirim || "-"} bold />
          <Field label="Nomor Telepon Penerima" value={order.nomorTeleponPenerima || "-"} bold />
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="text-[11px] tracking-[0.15em] uppercase text-gray-400 font-semibold mb-3">Informasi Muatan</div>
          <div className="text-2xl font-bold text-gray-900 mb-5">{order.jenisPaket || "Paket Logistik"}</div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Stat label="Total Berat" value={order.totalBerat || 0} unit="KG" />
            <Stat label="Jenis Paket" value={order.jenisPaket || "-"} unit="" />
            <Stat label="Total Paket" value={order.totalPaket || 0} unit="PAKET" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-20 h-16 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-400 text-xs uppercase border">
              {order.jenisKendaraan || "Truck"}
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{order.jenisKendaraan || "Tipe Fleet Standar"}</div>
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <span style={{ color: "#FFA000" }}>⬡</span> Kategori: <span className="font-semibold text-gray-700">{order.tipe || "Reguler"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input Informasi Pengantar */}
      <div className="mpl-card p-7 bg-white rounded-2xl border border-gray-100 shadow-sm mt-6 mb-6">
        <div className="text-[11px] tracking-[0.15em] uppercase text-gray-400 font-semibold mb-4">Informasi Pengantar</div>
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            <User className="w-7 h-7 text-gray-400" />
          </div>
          <div className="flex-1 space-y-4 max-w-xs">
            <div>
              <label className="text-[10px] tracking-wider uppercase text-gray-400 font-semibold">Nama Driver</label>
              <Input
                data-testid="driver-name"
                placeholder="cth: Budi Santoso"
                value={driver.name}
                onChange={(e) => setDriver((prev) => ({ ...prev, name: e.target.value }))}
                className="mt-1 bg-gray-50 border-gray-100 focus:ring-1 focus:ring-[#FFA000]"
              />
            </div>
            <div>
              <label className="text-[10px] tracking-wider uppercase text-gray-400 font-semibold">Plat Nomor Kendaraan</label>
              <Input
                data-testid="driver-plate"
                placeholder="cth: B 9128 MPL"
                value={driver.plate}
                onChange={(e) => setDriver((prev) => ({ ...prev, plate: e.target.value }))}
                className="mt-1 bg-gray-50 border-gray-100 focus:ring-1 focus:ring-[#FFA000]"
              />
            </div>
            <div>
              <label className="text-[10px] tracking-wider uppercase text-gray-400 font-semibold">No. WhatsApp Driver</label>
              <Input
                data-testid="driver-phone"
                placeholder="cth: 628123456789"
                value={driver.phone}
                onChange={(e) => setDriver((prev) => ({ ...prev, phone: e.target.value }))}
                className="mt-1 bg-gray-50 border-gray-100 focus:ring-1 focus:ring-[#FFA000]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rute & Form Driver Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <div className="mpl-card p-7 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-[11px] tracking-[0.15em] uppercase text-gray-400 font-semibold mb-5">Rute Pengiriman</div>
          <div className="space-y-6">
            <RoutePoint type="muat" city="Titik Asal" name={order.namaPengirim || "Lokasi Pengirim"} address={order.alamatAsal} />
            <RoutePoint type="bongkar" city="Destinasi" name={order.namaPenerima || "Lokasi Penerima"} address={order.alamatTujuan} />
          </div>
        </div>

        <div className="mpl-card p-7 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-start gap-3 cursor-pointer" onClick={() => setAgree((prev) => !prev)}>
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
            <Button variant="outline" onClick={() => navigate(-1)} data-testid="back-btn" className="h-12 px-6 bg-white border text-gray-700">
              Kembali
            </Button>
            <Button
              type="button"
              onClick={handleVerify}
              disabled={isSubmitting || !agree}
              data-testid="verifikasi-pesanan-btn"
              className="h-12 px-6 text-[11px] tracking-wider text-white font-bold rounded-lg leading-tight disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#FFA000", border: "none" }}
            >
              {isSubmitting ? "MEMPROSES..." : <><span className="block">VERIFIKASI</span>PESANAN</>}
            </Button>
          </div>
        </div>
      </div>



      <SuccessModal open={showSuccess} onClose={() => navigate("/pesanan")} />
    </div>
  );
}

function Field({ label, value, bold }) {
  return (
    <div>
      <div className="text-[10px] tracking-[0.15em] uppercase text-gray-400 font-semibold">{label}</div>
      <div className={`mt-1 text-gray-900 ${bold ? "font-bold text-[15px]" : ""}`}>{value || "-"}</div>
    </div>
  );
}

function Stat({ label, value, unit }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100/50">
      <div className="text-[10px] tracking-[0.15em] uppercase text-gray-400 font-semibold">{label}</div>
      <div className="mt-2 text-gray-900 flex items-baseline gap-1">
        <span className="text-xl font-bold">{value}</span>
        {unit && <span className="text-xs text-gray-500 font-semibold">{unit}</span>}
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
          {city} — {type === "muat" ? "TITIK MUAT" : "TITIK BONGKAR"}
        </div>
        <div className="text-[15px] font-bold text-gray-900 mt-1">{name}</div>
        <div className="text-xs text-gray-500 mt-0.5">{address || "Alamat belum diinput lengkap."}</div>
      </div>
    </div>
  );
}