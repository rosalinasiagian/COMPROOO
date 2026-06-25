import { useState, useRef, useEffect, createContext, useContext } from "react";
import { api } from "../lib/api";

const CompanyFormContext = createContext(null);
const useCompanyForm = () => useContext(CompanyFormContext);
import { toast } from "sonner";
import { UploadCloud, Trash2, Check } from "lucide-react";

const SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "siapa-kami", label: "Siapa Kami" },
  { id: "visi-misi", label: "Visi & Misi" },
  { id: "nilai", label: "Nilai" },
  { id: "layanan", label: "Layanan" },
  { id: "kendaraan", label: "Kendaraan" },
  { id: "ulasan", label: "Ulasan" },
];

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

export default function ProfilPerusahaan() {
  const [activeSection, setActiveSection] = useState("hero");
  const contentRef = useRef(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  // ── 1. INITIAL STATE DIBUAT KOSONG (TIDAK STATIS) ──
  const [heroForm, setHeroForm] = useState({
    headline1: "",
    headline2: "",
    headline3: "",
    tagline: "",
    ctaText: "",
    stat1: "",
    statLabel1: "",
    stat2: "",
    statLabel2: "",
    badgeText: "",
    imgUrl: "",
    altText: ""
  });

  const [siapaKamiForm, setSiapaKamiForm] = useState({
    judulSeksi: "",
    paragrafUtama: "",
    paragrafLanjutan: "",
    infoKilat: []
  });

  const [visiMisiForm, setVisiMisiForm] = useState({
    visi: {
      nomor: "",
      judul: "",
      poins: []
    },
    misi: {
      nomor: "",
      judul: "",
      poins: []
    }
  });

  const [nilaiForm, setNilaiForm] = useState({
    judulSeksi: "",
    items: []
  });

  const [layananForm, setLayananForm] = useState({
    judulSeksi: "",
    subJudul: "",
    deskripsiSampingKanan: "",
    items: []
  });

  const [kendaraanForm, setKendaraanForm] = useState({
    judulSeksi: "",
    deskripsiPengantar: "",
    teksTombol: "",
    items: []
  });

  const [ulasanForm, setUlasanForm] = useState({
    teksBadge: "",
    judulSeksi: "",
    deskripsi: "",
    items: []
  });

  // ── 2. AUTO-LOAD DATA DARI BACKEND (JIKA NULL TETAP KOSONG) ──
  useEffect(() => {
    const fetchCurrentProfile = async () => {
      try {
        const response = await api.get('/user/admin/companyprofile');
        const data = response.data?.data || response.data;

        // Jika data dari Backend ditemukan (tidak null)
        if (data) {
          setHeroForm({
            headline1: data.headlineBaris1 || "",
            headline2: data.headlineBaris2 || "",
            headline3: data.headlineBaris3 || "",
            tagline: data.tagline || "",
            ctaText: data.teksTombolCTA || "",
            stat1: data.angkaStatistik1 || "",
            statLabel1: data.labelStatistik1 || "",
            stat2: data.angkaStatistik2 || "",
            statLabel2: data.labelStatistik2 || "",
            badgeText: data.teksBadge || "",
            imgUrl: data.urlGambar || "",
            altText: data.altText || ""
          });

          setSiapaKamiForm({
            judulSeksi: data.judulSeksiSiapaKami || "",
            paragrafUtama: data.paragrafUtama || "",
            paragrafLanjutan: data.paragrafLanjutan || "",
            // Mengambil info kilat pendukung jika ada di struktur data BE kamu
            infoKilat: data.infoKilat && data.infoKilat.length > 0 
              ? data.infoKilat.map((info, idx) => ({
                  id: idx + 1,
                  judul: info.judul || "",
                  deskripsi: info.deskripsi || ""
                }))
              : [
                  { id: 1, judul: "Berdiri Sejak", deskripsi: "2024" },
                  { id: 2, judul: "Kantor Pusat", deskripsi: "Kota Kendari, Sulawesi" }
                ]
          });

          setVisiMisiForm({
            visi: {
              nomor: data.noVisi ? String(data.noVisi) : "",
              judul: data.judulVisi || "",
              poins: data.poinVisi ? data.poinVisi.map((text, idx) => ({ id: idx + 1, text })) : []
            },
            misi: {
              nomor: data.noMisi ? String(data.noMisi) : "",
              judul: data.judulMisi || "",
              poins: data.poinMisi ? data.poinMisi.map((text, idx) => ({ id: idx + 1, text })) : []
            }
          });

          if (data.nilai && data.nilai.length > 0) {
            setNilaiForm({
              judulSeksi: data.judulSeksiNilai || "",
              items: data.nilai.map((n, idx) => ({
                id: idx + 1,
                nomor: n.nomor ? String(n.nomor) : "",
                nama: n.nama || "",
                icon: n.ikon || "",
                warna: n.warnaBadge || "",
                desc: n.deskripsi || ""
              }))
            });
          } else {
            setNilaiForm({
              judulSeksi: data.judulSeksiNilai || "Nilai-Nilai Perusahaan",
              items: [
                { id: 1, nomor: "01", nama: "Kepercayaan", icon: "ti-shield-check", warna: "yellow", desc: "Membangun hubungan jangka panjang atas dasar kejujuran, transparansi, dan konsistensi dalam setiap janji layanan." },
                { id: 2, nomor: "02", nama: "Presisi", icon: "ti-target", warna: "yellow", desc: "Setiap pengiriman dieksekusi dengan ketepatan waktu dan akurasi data yang tak kompromi – presisi adalah standar kami." },
                { id: 3, nomor: "03", nama: "Kolaborasi", icon: "ti-users", warna: "yellow", desc: "Bermitra erat dengan klien, pengemudi, dan mitra industri untuk menciptakan solusi logistik yang saling menguntungkan." },
                { id: 4, nomor: "04", nama: "Inovasi", icon: "ti-bulb", warna: "yellow", desc: "Terus berinovasi melalui adopsi teknologi terkini, proses yang lebih cerdas, dan pengembangan SDM berkelanjutan." }
              ]
            });
          }

          if (data.layanan && data.layanan.length > 0) {
            setLayananForm({
              judulSeksi: data.judulSeksiLayanan || "",
              subJudul: data.subJudulSeksiLayanan || "",
              deskripsiSampingKanan: data.deskripsiSampingKanan || "",
              items: data.layanan.map((l, idx) => ({
                id: idx + 1,
                idAsli: l.id || "",
                nama: l.nama || "",
                icon: l.ikon || "",
                desc: l.deskripsi || ""
              }))
            });
          } else {
            setLayananForm({
              judulSeksi: data.judulSeksiLayanan || "Layanan Unggulan",
              subJudul: data.subJudulSeksiLayanan || "Solusi Pengiriman Terintegrasi",
              deskripsiSampingKanan: data.deskripsiSampingKanan || "Kami menyediakan berbagai jenis angkutan yang disesuaikan dengan kebutuhan volume dan jarak tempuh Anda.",
              items: [
                { id: 1, idAsli: "L01", nama: "Angkutan Berat", icon: "ti-truck", desc: "Transportasi kargo skala besar dengan armada heavy-duty yang dirawat rutin untuk performa maksimal." },
                { id: 2, idAsli: "L02", nama: "Dalam Kota", icon: "ti-map-pin", desc: "Pengiriman cepat dan efisien untuk area urban dengan rute optimal guna menghindari kemacetan." },
                { id: 3, idAsli: "L03", nama: "Gudang", icon: "ti-building-warehouse", desc: "Fasilitas penyimpanan sementara yang aman dengan sistem manajemen inventori yang presisi." }
              ]
            });
          }

          if (data.kendaraan && data.kendaraan.length > 0) {
            setKendaraanForm({
              judulSeksi: data.judulSeksiKendaraan || "",
              deskripsiPengantar: data.deskripsiPengantar || "",
              teksTombol: data.teksTombolLihatSemua || "",
              items: data.kendaraan.map((k, idx) => ({
                id: idx + 1,
                jenis: k.jenis || "",
                kapasitas: k.kapasitas || "",
                tipe: k.status || "",
                img: k.img || ""
              }))
            });
          } else {
            setKendaraanForm({
              judulSeksi: data.judulSeksiKendaraan || "Kendaraan Kami",
              deskripsiPengantar: data.deskripsiPengantar || "Aset kami dipelihara dengan presisi bedah, memastikan kargo Anda bergerak dalam unit transportasi standar tertinggi yang tersedia di industri.",
              teksTombol: data.teksTombolLihatSemua || "LIHAT SEMUA",
              items: [
                { id: 1, jenis: "Pickup", kapasitas: "720 KG", tipe: "MULTI-AXLE", img: "/images/pickup-truck.jpg" },
                { id: 2, jenis: "Truck", kapasitas: "4.000 KG", tipe: "BOX TERTUTUP", img: "/images/isuzu-truck.jpg" },
                { id: 3, jenis: "Fuso", kapasitas: "8.000 KG", tipe: "TERMOSTAT", img: "/images/fuso-truck.jpg" }
              ]
            });
          }

          if (data.ulasan && data.ulasan.length > 0) {
            setUlasanForm({
              teksBadge: data.teksBadgeUlasan || "",
              judulSeksi: data.judulSeksiUlasan || "",
              deskripsi: data.deskripsiUlasan || "",
              items: data.ulasan.map((u, idx) => ({
                id: idx + 1,
                stars: u.stars || 5,
                text: u.text || "",
                name: u.name || "",
                role: u.role || "",
                avatar: u.avatar || ""
              }))
            });
          } else {
            setUlasanForm({
              teksBadge: data.teksBadgeUlasan || "Bukti Kepercayaan",
              judulSeksi: data.judulSeksiUlasan || "Apa Kata Mereka?",
              deskripsi: data.deskripsiUlasan || "Ribuan mitra industri telah mengandalkan efisiensi LOGIS-CORE untuk rantai pasokan mereka. Inilah pengalaman mereka.",
              items: [
                { id: 1, stars: 5, text: '"Sistem tracking yang sangat akurat. LOGIS-CORE membantu kami menekan biaya operasional distribusi hingga 20% dalam 6 bulan pertama."', name: 'Budi Santoso', role: 'Manajer Logistik, PT Maju Jaya', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face' },
                { id: 2, stars: 5, text: '"Layanan armada yang sangat terawat dan pengemudi yang profesional. Sangat merekomendasikan untuk pengiriman barang industri berat."', name: 'Siti Aminah', role: 'Direktur Operasional, Global Tech', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face' },
                { id: 3, stars: 5, text: '"Integrasi API mereka sangat mulus dengan sistem inventori kami. Transparansi data yang diberikan benar-benar luar biasa."', name: 'Andi Wijaya', role: 'CTO, E-Logistics Indonesia', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face' }
              ]
            });
          }
        }
      } catch (error) {
        console.error("Gagal menjemput data profil perusahaan dari database:", error);
        toast.error("Gagal menyinkronkan data dari server.");
      }
    };

    fetchCurrentProfile();
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeSection]);

  const handleSectionChange = (id) => {
    setActiveSection(id);
  };

  // ── KONVERSI STRUKTUR FORM KE PAYLOAD SINGLE JSON UNTUK @RequestPart ──
  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const fd = new FormData();

      const jsonPayload = {
        username: "raka_riesta",
        email: "raka@email.com",
        noTelepon: "081234567890",
        headlineBaris1: heroForm.headline1,
        headlineBaris2: heroForm.headline2,
        headlineBaris3: heroForm.headline3,
        tagline: heroForm.tagline,
        teksTombolCTA: heroForm.ctaText,
        angkaStatistik1: heroForm.stat1,
        labelStatistik1: heroForm.statLabel1,
        angkaStatistik2: heroForm.stat2,
        labelStatistik2: heroForm.statLabel2,
        teksBadge: heroForm.badgeText,
        urlGambar: heroForm.imgUrl,
        altText: heroForm.altText || "Gambar Perusahaan",

        judulSeksiSiapaKami: siapaKamiForm.judulSeksi,
        paragrafUtama: siapaKamiForm.paragrafUtama,
        paragrafLanjutan: siapaKamiForm.paragrafLanjutan,

        judulVisi: visiMisiForm.visi.judul,
        judulMisi: visiMisiForm.misi.judul,
        noVisi: 1,
        noMisi: 2,
        poinVisi: visiMisiForm.visi.poins.map(p => p.text),
        poinMisi: visiMisiForm.misi.poins.map(p => p.text),

        judulSeksiNilai: nilaiForm.judulSeksi,
        nilai: nilaiForm.items.map(n => ({
          nomor: parseInt(n.nomor) || 1,
          nama: n.nama,
          ikon: n.icon,
          warnaBadge: n.warna,
          deskripsi: n.desc
        })),

        judulSeksiLayanan: layananForm.judulSeksi,
        subJudulSeksiLayanan: layananForm.subJudul,
        deskripsiSampingKanan: layananForm.deskripsiSampingKanan,
        layanan: layananForm.items.map((l, i) => ({
          id: l.idAsli || "L" + String(i + 1).padStart(2, '0'),
          nama: l.nama,
          ikon: l.icon,
          deskripsi: l.desc,
          tarifEst: "Mulai Rp 5.000/Kg",
          estimasi: "2-3 Hari Kerja"
        })),

        judulSeksiKendaraan: kendaraanForm.judulSeksi,
        deskripsiPengantar: kendaraanForm.deskripsiPengantar,
        teksTombolLihatSemua: kendaraanForm.teksTombol,
        kendaraan: kendaraanForm.items.map(k => ({
          jenis: k.jenis,
          kapasitas: k.kapasitas,
          status: k.tipe,
          img: k.img
        })),

        teksBadgeUlasan: ulasanForm.teksBadge,
        judulSeksiUlasan: ulasanForm.judulSeksi,
        deskripsiUlasan: ulasanForm.deskripsi,
        ulasan: ulasanForm.items.map(u => ({
          stars: parseInt(u.stars) || 5,
          text: u.text,
          name: u.name,
          role: u.role,
          avatar: u.avatar
        })),

        infoKilat: siapaKamiForm.infoKilat.map(info => ({
          judul: info.judul,
          deskripsi: info.deskripsi
        })).filter(item => item.judul || item.deskripsi)
      };

      const jsonBlob = new Blob([JSON.stringify(jsonPayload)], { type: "application/json" });
      fd.append("companyProfile", jsonBlob);

      if (imageFile) {
        fd.append("fileGambar", imageFile);
      }

      await api.patch('/user/admin/edit/companyprofile', fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 2500);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.errors || "Gagal mengunggah berkas");
    } finally {
      setIsPublishing(false);
    }
  };

  const activeLabel = SECTIONS.find(s => s.id === activeSection)?.label || "";

  return (
    <CompanyFormContext.Provider value={{ heroForm, setHeroForm, siapaKamiForm, setSiapaKamiForm, visiMisiForm, setVisiMisiForm, nilaiForm, setNilaiForm, layananForm, setLayananForm, kendaraanForm, setKendaraanForm, ulasanForm, setUlasanForm, imageFile, setImageFile }}>
      <div className="-m-8 flex flex-col h-screen overflow-hidden bg-[#FDFDF9]">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-5 border-b border-gray-200/70 bg-white shrink-0 z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center text-[14px]">
              <span className="text-gray-500">Company Profile</span>
              <span className="mx-2 text-gray-300">/</span>
              <span className="font-semibold text-gray-900">{activeLabel}</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex flex-1 overflow-hidden relative">

          {/* Inner Sidebar (Sections) */}
          <aside className="w-[200px] border-r border-gray-200/70 bg-[#FDFDF9] shrink-0 p-6 overflow-y-auto z-10">
            <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-4">Sections</h3>
            <div className="space-y-1">
              {SECTIONS.map((sec) => {
                const isActive = sec.id === activeSection;
                return (
                  <button
                    key={sec.id}
                    onClick={() => handleSectionChange(sec.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-[13px] font-medium transition-colors ${isActive
                      ? "bg-white text-gray-900 border border-[#FFA000] shadow-sm"
                      : "text-gray-500 hover:bg-gray-50 border border-transparent"
                      }`}
                  >
                    <span>{sec.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#FFA000]"></span>}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main Form Content */}
          <div ref={contentRef} className="flex-1 overflow-y-auto bg-[#F4F4F0] p-8 pb-32">
            <div className="max-w-[1100px] mx-auto space-y-8">
              {activeSection === "hero" && <HeroForm />}
              {activeSection === "siapa-kami" && <SiapaKamiForm />}
              {activeSection === "visi-misi" && <VisiMisiForm />}
              {activeSection === "nilai" && <NilaiForm />}
              {activeSection === "layanan" && <LayananForm />}
              {activeSection === "kendaraan" && <KendaraanForm />}
              {activeSection === "ulasan" && <UlasanForm />}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="absolute bottom-0 left-[200px] right-0 flex items-center justify-end px-8 py-4 border-t border-gray-200/70 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="px-6 py-2 text-[13px] font-semibold text-white bg-[#E69000] hover:bg-[#CC8000] rounded-md transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPublishing ? "Memproses..." : "Publish Perubahan"}
              </button>
            </div>
          </div>

        </div>

        <SuccessModal open={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
      </div>
    </CompanyFormContext.Provider>
  );
}

function HeroForm() {
  const fileInputRef = useRef(null);
  const { heroForm: form, setHeroForm: setForm, imageFile, setImageFile } = useCompanyForm();

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      handleChange("imgUrl", file.name);
      toast.success(`Gambar ${file.name} dipilih!`);
    }
  };

  return (
    <>
      {/* Teks Hero Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[15px] font-bold text-gray-900">Teks Hero Banner</h2>
          <span className="text-[11px] font-semibold text-[#E69000] bg-[#FEF9E6] px-2.5 py-1 rounded-md">Above the Fold</span>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Headline Baris 1</label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
                value={form.headline1}
                onChange={(e) => handleChange("headline1", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Headline Baris 2</label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
                value={form.headline2}
                onChange={(e) => handleChange("headline2", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Headline Baris 3 (Warna Aksen)</label>
            <input
              type="text"
              className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
              value={form.headline3}
              onChange={(e) => handleChange("headline3", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Tagline / Deskripsi Singkat</label>
            <textarea
              rows={3}
              className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000] resize-none"
              value={form.tagline}
              onChange={(e) => handleChange("tagline", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Teks Tombol CTA</label>
            <input
              type="text"
              className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
              value={form.ctaText}
              onChange={(e) => handleChange("ctaText", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Statistik Hero */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-[15px] font-bold text-gray-900 mb-6">Statistik Hero</h2>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Angka Statistik 1</label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[14px] font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
                value={form.stat1}
                onChange={(e) => handleChange("stat1", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Label Statistik 1</label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[14px] font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
                value={form.statLabel1}
                onChange={(e) => handleChange("statLabel1", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Angka Statistik 2</label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[14px] font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
                value={form.stat2}
                onChange={(e) => handleChange("stat2", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Label Statistik 2</label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[14px] font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
                value={form.statLabel2}
                onChange={(e) => handleChange("statLabel2", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Teks Badge (misal: 100% TEPAT WAKTU)</label>
            <input
              type="text"
              className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
              value={form.badgeText}
              onChange={(e) => handleChange("badgeText", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Gambar Hero */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-[15px] font-bold text-gray-900 mb-6">Gambar Hero</h2>

        <div className="space-y-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer flex flex-col items-center justify-center py-12"
          >
            <UploadCloud className="w-8 h-8 text-gray-400 mb-3" />
            <span className="text-[13px] font-medium text-gray-600">{imageFile ? `Aset Aktif: ${imageFile.name}` : "Klik untuk upload gambar"}</span>
            <span className="text-[11px] text-gray-400 mt-1">PNG, JPG atau WEBP — maks 2MB — Rekomendasi 1200 x 800px</span>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Atau masukkan URL gambar</label>
            <input
              type="text"
              className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
              value={form.imgUrl}
              onChange={(e) => {
                handleChange("imgUrl", e.target.value);
                setImageFile(null); // hapus pilihan file jika user input URL manual
              }}
              placeholder="https://example.com/gambar.jpg"
            />
          </div>
        </div>
      </div>
    </>
  );
}

function SiapaKamiForm() {
  const { siapaKamiForm: form, setSiapaKamiForm: setForm } = useCompanyForm();

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleInfoChange = (idx, key, val) => {
    const newItems = [...form.infoKilat];
    newItems[idx][key] = val;
    setForm(prev => ({ ...prev, infoKilat: newItems }));
  };

  const handleAddInfo = () => {
    setForm(prev => {
      const newId = prev.infoKilat.length > 0 ? Math.max(...prev.infoKilat.map(p => p.id)) + 1 : 1;
      return {
        ...prev,
        infoKilat: [...prev.infoKilat, { id: newId, judul: "", deskripsi: "" }]
      };
    });
  };

  const handleRemoveInfo = (id) => {
    setForm(prev => ({
      ...prev,
      infoKilat: prev.infoKilat.filter(p => p.id !== id)
    }));
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-[15px] font-bold text-gray-900 mb-6">Siapa Kami</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Judul</label>
            <input
              type="text"
              className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
              value={form.judulSeksi}
              onChange={(e) => handleChange("judulSeksi", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Paragraf Utama</label>
            <textarea
              rows={4}
              className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000] resize-none"
              value={form.paragrafUtama}
              onChange={(e) => handleChange("paragrafUtama", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Paragraf Lanjutan</label>
            <textarea
              rows={3}
              className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000] resize-none"
              value={form.paragrafLanjutan}
              onChange={(e) => handleChange("paragrafLanjutan", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-[15px] font-bold text-gray-900 mb-6">Daftar Info Kilat</h2>

        <div className="space-y-6">
          {form.infoKilat.map((item, idx) => (
            <div key={item.id} className="relative p-6 border border-gray-100 rounded-xl bg-gray-50/40 space-y-4 group transition-colors hover:border-[#FFA000]/30">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleRemoveInfo(item.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  title="Hapus Info"
                >
                  <Trash2 className="w-[18px] h-[18px]" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 pr-10">
                <div>
                  <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Label</label>
                  <input
                    type="text"
                    className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
                    value={item.judul}
                    onChange={(e) => handleInfoChange(idx, "judul", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Value</label>
                  <input
                    type="text"
                    className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
                    value={item.deskripsi}
                    onChange={(e) => handleInfoChange(idx, "deskripsi", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddInfo}
          className="flex items-center gap-2 mt-8 px-5 py-2 text-[13px] font-semibold text-[#E69000] border border-[#E69000] hover:bg-[#E69000] hover:text-white rounded-md transition-colors shadow-sm"
        >
          <span className="text-lg">+</span> Tambah Info
        </button>
      </div>
    </>
  );
}

function VisiMisiForm() {
  const [activeTab, setActiveTab] = useState("visi");
  const { visiMisiForm: form, setVisiMisiForm: setForm } = useCompanyForm();

  const currentData = activeTab === "visi" ? form.visi : form.misi;

  const handleChange = (key, value) => {
    setForm(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [key]: value }
    }));
  };

  const handlePoinChange = (id, newText) => {
    setForm(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        poins: prev[activeTab].poins.map(p => p.id === id ? { ...p, text: newText } : p)
      }
    }));
  };

  const handleAddPoin = () => {
    setForm(prev => {
      const activePoins = prev[activeTab].poins;
      const newId = activePoins.length > 0 ? Math.max(...activePoins.map(p => p.id)) + 1 : 1;
      return {
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          poins: [...activePoins, { id: newId, text: "" }]
        }
      };
    });
  };

  const handleRemovePoin = (id) => {
    setForm(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        poins: prev[activeTab].poins.filter(p => p.id !== id)
      }
    }));
  };

  const labelSufix = activeTab === "visi" ? "Visi" : "Misi";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <h2 className="text-[15px] font-bold text-gray-900 mb-6">Visi & Misi</h2>

      <div className="flex items-center gap-6 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("visi")}
          className={`pb-3 text-[13px] transition-colors ${activeTab === "visi"
            ? "font-semibold text-[#E69000] border-b-2 border-[#E69000]"
            : "font-medium text-gray-400 hover:text-gray-600"
            }`}
        >
          Visi
        </button>
        <button
          onClick={() => setActiveTab("misi")}
          className={`pb-3 text-[13px] transition-colors ${activeTab === "misi"
            ? "font-semibold text-[#E69000] border-b-2 border-[#E69000]"
            : "font-medium text-gray-400 hover:text-gray-600"
            }`}
        >
          Misi
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Judul {labelSufix}</label>
            <input
              type="text"
              className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
              value={currentData.judul}
              onChange={(e) => handleChange("judul", e.target.value)}
            />
          </div>
        </div>

        <div className="pt-2">
          <h3 className="text-[12px] font-medium text-gray-400 mb-4">Poin-poin {labelSufix}</h3>
          <div className="space-y-4">
            {currentData.poins.map((poin, index) => (
              <div key={poin.id} className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-[12px] font-medium text-gray-400 mb-1.5">
                    Poin {labelSufix} {index + 1}
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
                    value={poin.text}
                    onChange={(e) => handlePoinChange(poin.id, e.target.value)}
                    placeholder={`Masukkan poin ${labelSufix.toLowerCase()}...`}
                  />
                </div>
                <button
                  onClick={() => handleRemovePoin(poin.id)}
                  className="p-2 mb-[1px] text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  title="Hapus Poin"
                >
                  <Trash2 className="w-[18px] h-[18px]" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleAddPoin}
          className="flex items-center gap-2 mt-4 px-5 py-2 text-[13px] font-semibold text-[#E69000] border border-[#E69000] hover:bg-[#E69000] hover:text-white rounded-md transition-colors shadow-sm"
        >
          <span className="text-lg">+</span> Tambah Poin
        </button>
      </div>
    </div>
  );
}

function NilaiForm() {
  const { nilaiForm: form, setNilaiForm: setForm } = useCompanyForm();

  const handleTitleChange = (val) => setForm(prev => ({ ...prev, judulSeksi: val }));

  const handleItemChange = (idx, key, val) => {
    const newItems = [...form.items];
    newItems[idx][key] = val;
    setForm(prev => ({ ...prev, items: newItems }));
  };

  const handleAddNilai = () => {
    setForm(prev => {
      const newId = prev.items.length > 0 ? Math.max(...prev.items.map(p => p.id)) + 1 : 1;
      return {
        ...prev,
        items: [...prev.items, { id: newId, nomor: "", nama: "", icon: "", warna: "", desc: "" }]
      };
    });
  };

  const handleRemoveNilai = (id) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.filter(p => p.id !== id)
    }));
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-[15px] font-bold text-gray-900 mb-6">Nilai-Nilai Perusahaan</h2>
        <div>
          <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Judul Seksi</label>
          <input
            type="text"
            className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
            value={form.judulSeksi}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-[15px] font-bold text-gray-300 mb-6">Daftar Nilai</h2>

        <div className="space-y-10">
          {form.items.map((item, idx) => (
            <div key={item.id} className="relative p-6 border border-gray-100 rounded-xl bg-gray-50/40 space-y-4 group transition-colors hover:border-[#FFA000]/30">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleRemoveNilai(item.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  title="Hapus Nilai"
                >
                  <Trash2 className="w-[18px] h-[18px]" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 pr-10">
                <div>
                  <label className="block text-[12px] font-medium text-gray-400 mb-1.5">Nomor</label>
                  <input
                    type="text"
                    className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
                    value={item.nomor}
                    onChange={(e) => handleItemChange(idx, "nomor", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-400 mb-1.5">Nama Nilai</label>
                  <input
                    type="text"
                    className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
                    value={item.nama}
                    onChange={(e) => handleItemChange(idx, "nama", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pr-10">
                <div>
                  <label className="block text-[12px] font-medium text-gray-400 mb-1.5">Ikon (Tabler class)</label>
                  <input
                    type="text"
                    className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
                    value={item.icon}
                    onChange={(e) => handleItemChange(idx, "icon", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-400 mb-1.5">Warna Badge</label>
                  <input
                    type="text"
                    className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
                    value={item.warna}
                    onChange={(e) => handleItemChange(idx, "warna", e.target.value)}
                  />
                </div>
              </div>
              <div className="pr-10">
                <label className="block text-[12px] font-medium text-gray-400 mb-1.5">Deskripsi</label>
                <textarea
                  rows={2}
                  className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000] resize-none"
                  value={item.desc}
                  onChange={(e) => handleItemChange(idx, "desc", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddNilai}
          className="flex items-center gap-2 mt-8 px-5 py-2 text-[13px] font-semibold text-[#E69000] border border-[#E69000] hover:bg-[#E69000] hover:text-white rounded-md transition-colors shadow-sm"
        >
          <span className="text-lg">+</span> Tambah Nilai
        </button>
      </div>
    </>
  );
}

function LayananForm() {
  const { layananForm: form, setLayananForm: setForm } = useCompanyForm();

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleItemChange = (idx, key, val) => {
    const newItems = [...form.items];
    newItems[idx][key] = val;
    setForm(prev => ({ ...prev, items: newItems }));
  };

  const handleAddLayanan = () => {
    setForm(prev => {
      const newId = prev.items.length > 0 ? Math.max(...prev.items.map(p => p.id)) + 1 : 1;
      return {
        ...prev,
        items: [...prev.items, { id: newId, idAsli: "", nama: "", icon: "", desc: "" }]
      };
    });
  };

  const handleRemoveLayanan = (id) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.filter(p => p.id !== id)
    }));
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-[15px] font-bold text-gray-900 mb-6 text-gray-300">Header Seksi Layanan</h2>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-gray-400 mb-1.5">Judul Seksi</label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
                value={form.judulSeksi}
                onChange={(e) => handleChange("judulSeksi", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-gray-400 mb-1.5">Sub-judul</label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
                value={form.subJudul}
                onChange={(e) => handleChange("subJudul", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-gray-400 mb-1.5">Deskripsi Samping Kanan</label>
            <textarea
              rows={2}
              className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000] resize-none"
              value={form.deskripsiSampingKanan}
              onChange={(e) => handleChange("deskripsiSampingKanan", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-[15px] font-bold text-gray-300 mb-6">Daftar Layanan</h2>

        <div className="space-y-10">
          {form.items.map((item, idx) => (
            <div key={item.id} className="relative p-6 border border-gray-100 rounded-xl bg-gray-50/40 space-y-4 group transition-colors hover:border-[#FFA000]/30">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleRemoveLayanan(item.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  title="Hapus Layanan"
                >
                  <Trash2 className="w-[18px] h-[18px]" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 pr-10">
                <div>
                  <label className="block text-[12px] font-medium text-gray-400 mb-1.5">Nama Layanan</label>
                  <input
                    type="text"
                    className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
                    value={item.nama}
                    onChange={(e) => handleItemChange(idx, "nama", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-400 mb-1.5">Ikon (Tabler class)</label>
                  <input
                    type="text"
                    className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
                    value={item.icon}
                    onChange={(e) => handleItemChange(idx, "icon", e.target.value)}
                  />
                </div>
              </div>
              <div className="pr-10">
                <label className="block text-[12px] font-medium text-gray-400 mb-1.5">Deskripsi Layanan</label>
                <textarea
                  rows={2}
                  className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000] resize-none"
                  value={item.desc}
                  onChange={(e) => handleItemChange(idx, "desc", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddLayanan}
          className="flex items-center gap-2 mt-8 px-5 py-2 text-[13px] font-semibold text-[#E69000] border border-[#E69000] hover:bg-[#E69000] hover:text-white rounded-md transition-colors shadow-sm"
        >
          <span className="text-lg">+</span> Tambah Layanan
        </button>
      </div>
    </>
  );
}

function KendaraanForm() {
  const { kendaraanForm: form, setKendaraanForm: setForm } = useCompanyForm();

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleItemChange = (idx, key, val) => {
    const newItems = [...form.items];
    newItems[idx][key] = val;
    setForm(prev => ({ ...prev, items: newItems }));
  };

  const handleAddKendaraan = () => {
    setForm(prev => {
      const newId = prev.items.length > 0 ? Math.max(...prev.items.map(p => p.id)) + 1 : 1;
      return {
        ...prev,
        items: [...prev.items, { id: newId, jenis: "", kapasitas: "", tipe: "", img: "" }]
      };
    });
  };

  const handleRemoveKendaraan = (id) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.filter(p => p.id !== id)
    }));
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-[15px] font-bold text-gray-900 mb-6 text-gray-300">Header Seksi Kendaraan</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-[12px] font-medium text-gray-400 mb-1.5">Judul Seksi</label>
            <input
              type="text"
              className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
              value={form.judulSeksi}
              onChange={(e) => handleChange("judulSeksi", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-gray-400 mb-1.5">Deskripsi Pengantar</label>
            <textarea
              rows={2}
              className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000] resize-none"
              value={form.deskripsiPengantar}
              onChange={(e) => handleChange("deskripsiPengantar", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-gray-400 mb-1.5">Teks Tombol "Lihat Semua"</label>
            <input
              type="text"
              className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
              value={form.teksTombol}
              onChange={(e) => handleChange("teksTombol", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-[15px] font-bold text-gray-300 mb-6">Daftar Kendaraan</h2>

        <div className="space-y-6">
          {form.items.map((item, idx) => (
            <div key={item.id} className="relative p-6 border border-gray-100 rounded-xl bg-gray-50/40 space-y-4 group transition-colors hover:border-[#FFA000]/30">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleRemoveKendaraan(item.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  title="Hapus Kendaraan"
                >
                  <Trash2 className="w-[18px] h-[18px]" />
                </button>
              </div>

              <div className="grid grid-cols-12 gap-4 pr-10">
                <div className="col-span-5">
                  <label className="block text-[12px] font-medium text-gray-400 mb-1.5">Jenis Kendaraan</label>
                  <input
                    type="text"
                    className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
                    value={item.jenis}
                    onChange={(e) => handleItemChange(idx, "jenis", e.target.value)}
                  />
                </div>
                <div className="col-span-4">
                  <label className="block text-[12px] font-medium text-gray-400 mb-1.5">Kapasitas</label>
                  <input
                    type="text"
                    className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
                    value={item.kapasitas}
                    onChange={(e) => handleItemChange(idx, "kapasitas", e.target.value)}
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-[12px] font-medium text-gray-400 mb-1.5">Tipe Bak</label>
                  <input
                    type="text"
                    className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
                    value={item.tipe}
                    onChange={(e) => handleItemChange(idx, "tipe", e.target.value)}
                  />
                </div>
              </div>
              <div className="pr-10">
                <label className="block text-[12px] font-medium text-gray-400 mb-1.5">URL Foto Kendaraan</label>
                <input
                  type="text"
                  className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
                  value={item.img}
                  onChange={(e) => handleItemChange(idx, "img", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddKendaraan}
          className="flex items-center gap-2 mt-8 px-5 py-2 text-[13px] font-semibold text-[#E69000] border border-[#E69000] hover:bg-[#E69000] hover:text-white rounded-md transition-colors shadow-sm"
        >
          <span className="text-lg">+</span> Tambah Kendaraan
        </button>
      </div>
    </>
  );
}

function UlasanForm() {
  const { ulasanForm: form, setUlasanForm: setForm } = useCompanyForm();

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-[15px] font-bold text-gray-900 mb-6 text-gray-300">Header Seksi Ulasan</h2>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-gray-400 mb-1.5">Teks Badge</label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
                value={form.teksBadge}
                onChange={(e) => handleChange("teksBadge", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-gray-400 mb-1.5">Judul Seksi</label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000]"
                value={form.judulSeksi}
                onChange={(e) => handleChange("judulSeksi", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-gray-400 mb-1.5">Deskripsi Pengantar</label>
            <textarea
              rows={2}
              className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFA000] resize-none"
              value={form.deskripsi}
              onChange={(e) => handleChange("deskripsi", e.target.value)}
            />
          </div>
        </div>
      </div>

    </>
  );
}