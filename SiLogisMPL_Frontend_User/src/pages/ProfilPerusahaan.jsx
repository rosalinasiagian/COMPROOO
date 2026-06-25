import { useData } from "../contexts/DataContext";
import { Loader2, Lock } from "lucide-react";

const SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "siapa-kami", label: "Siapa Kami" },
  { id: "visi-misi", label: "Visi & Misi" },
  { id: "nilai", label: "Nilai" },
  { id: "layanan", label: "Layanan" },
  { id: "kendaraan", label: "Kendaraan" },
];

export default function ProfilPerusahaan() {
  const { company, companyLoading } = useData();

  const headline1 = company.headline1 || "MANDIRI";
  const headline2 = company.headline2 || "PERKASA";
  const headline3 = company.headline3 || "LOGIS";
  const tagline = company.tagline || "Solusi logistik terpercaya untuk pengiriman dalam kota maupun luar kota.";
  const stat1 = company.stat1 || "2+";
  const statLabel1 = company.statLabel1 || "Tahun Berdiri";
  const stat2 = company.stat2 || "971+";
  const statLabel2 = company.statLabel2 || "Unit Armada";
  const badgeText = company.badgeText || "100% Tepat Waktu";
  const heroImg = company.imgUrl || "";
  const heroAlt = company.altText || "Armada Logistik";

  const paragrafUtama = company.paragrafUtama || "-";
  const paragrafLanjutan = company.paragrafLanjutan || "-";

  const judulVisi = company.judulVisi || "Komitmen Kami";
  const judulMisi = company.judulMisi || "Misi Perusahaan";
  const poinVisi = Array.isArray(company.poinVisi) ? company.poinVisi : [];
  const poinMisi = Array.isArray(company.poinMisi) ? company.poinMisi : [];

  const nilaiItems = Array.isArray(company.nilai) ? company.nilai : [];
  const layananItems = Array.isArray(company.layanan) ? company.layanan : [];
  const kendaraanItems = Array.isArray(company.kendaraan) ? company.kendaraan : [];

  return (
    <div className="-m-8 flex flex-col min-h-screen bg-[#FDFDF9]">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-gray-200/70 bg-white shrink-0 z-10">
        <div className="flex items-center gap-3">
          <span className="text-[14px] text-gray-500">Company Profile</span>
          <span className="mx-1 text-gray-300">/</span>
          <span className="font-semibold text-gray-900 text-[14px]">Pratinjau</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
          <Lock className="w-3 h-3" />
          <span>Hanya dapat diedit dari Panel Admin</span>
        </div>
      </header>

      {companyLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#FFA000]" />
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar navigasi section */}
          <aside className="w-[200px] border-r border-gray-200/70 bg-[#FDFDF9] shrink-0 p-6 overflow-y-auto">
            <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-4">Sections</h3>
            <div className="space-y-1">
              {SECTIONS.map((sec) => (
                <a
                  key={sec.id}
                  href={`#section-${sec.id}`}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-[13px] font-medium text-gray-500 hover:bg-gray-50 border border-transparent transition-colors"
                >
                  <span>{sec.label}</span>
                </a>
              ))}
            </div>
          </aside>

          {/* Konten view-only */}
          <div className="flex-1 overflow-y-auto bg-[#F4F4F0] p-8 space-y-8">

            {/* HERO */}
            <section id="section-hero" className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[15px] font-bold text-gray-900">Hero Banner</h2>
                <span className="text-[11px] font-semibold text-[#E69000] bg-[#FEF9E6] px-2.5 py-1 rounded-md">Above the Fold</span>
              </div>
              <div className="space-y-4">
                <Row label="Headline 1" value={headline1} />
                <Row label="Headline 2" value={headline2} />
                <Row label="Headline 3 (Aksen)" value={headline3} />
                <Row label="Tagline" value={tagline} />
                <Row label={`Statistik 1`} value={`${stat1} — ${statLabel1}`} />
                <Row label={`Statistik 2`} value={`${stat2} — ${statLabel2}`} />
                <Row label="Badge" value={badgeText} />
                {heroImg && (
                  <div>
                    <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Gambar Hero</div>
                    <img src={heroImg} alt={heroAlt} className="w-full max-h-52 object-cover rounded-lg border border-gray-100" />
                    <div className="text-xs text-gray-400 mt-1">{heroAlt}</div>
                  </div>
                )}
              </div>
            </section>

            {/* SIAPA KAMI */}
            <section id="section-siapa-kami" className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-[15px] font-bold text-gray-900 mb-6">Siapa Kami</h2>
              <div className="space-y-4">
                <Row label="Paragraf Utama" value={paragrafUtama} multiline />
                <Row label="Paragraf Lanjutan" value={paragrafLanjutan} multiline />
                {Array.isArray(company.infoKilat) && company.infoKilat.length > 0 && (
                  <div>
                    <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Info Kilat</div>
                    <div className="grid grid-cols-2 gap-3">
                      {company.infoKilat.map((info, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                          <div className="font-semibold text-[13px] text-gray-800">{info.judul}</div>
                          <div className="text-[12px] text-gray-500 mt-0.5">{info.deskripsi}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* VISI MISI */}
            <section id="section-visi-misi" className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-[15px] font-bold text-gray-900 mb-6">Visi & Misi</h2>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-[11px] font-semibold text-[#E69000] uppercase tracking-wider mb-2">Visi</div>
                  <div className="font-bold text-gray-900 mb-3">{judulVisi}</div>
                  <ul className="space-y-2">
                    {poinVisi.length > 0 ? poinVisi.map((p, i) => (
                      <li key={i} className="flex gap-2 text-[13px] text-gray-600">
                        <span className="text-[#FFA000] mt-0.5">→</span> {p}
                      </li>
                    )) : <li className="text-[13px] text-gray-400 italic">Belum diisi</li>}
                  </ul>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-[#E69000] uppercase tracking-wider mb-2">Misi</div>
                  <div className="font-bold text-gray-900 mb-3">{judulMisi}</div>
                  <ul className="space-y-2">
                    {poinMisi.length > 0 ? poinMisi.map((p, i) => (
                      <li key={i} className="flex gap-2 text-[13px] text-gray-600">
                        <span className="text-[#FFA000] mt-0.5">→</span> {p}
                      </li>
                    )) : <li className="text-[13px] text-gray-400 italic">Belum diisi</li>}
                  </ul>
                </div>
              </div>
            </section>

            {/* NILAI */}
            <section id="section-nilai" className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-[15px] font-bold text-gray-900 mb-6">
                {company.judulSeksiNilai || "Nilai-Nilai Perusahaan"}
              </h2>
              {nilaiItems.length > 0 ? (
                <div className="grid grid-cols-2 gap-6">
                  {nilaiItems.map((n, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl font-black text-[#FFA000]">{n.nomor || String(i+1).padStart(2,'0')}</span>
                        <span className="font-bold text-gray-900 text-[14px]">{n.nama}</span>
                      </div>
                      <p className="text-[12px] text-gray-500 leading-relaxed">{n.deskripsi}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-gray-400 italic">Belum diisi oleh admin.</p>
              )}
            </section>

            {/* LAYANAN */}
            <section id="section-layanan" className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-[15px] font-bold text-gray-900 mb-2">
                {company.judulSeksiLayanan || "Layanan Unggulan"}
              </h2>
              {company.subJudulSeksiLayanan && (
                <p className="text-[13px] text-gray-500 mb-6">{company.subJudulSeksiLayanan}</p>
              )}
              {layananItems.length > 0 ? (
                <div className="space-y-3">
                  {layananItems.map((l, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <span className="w-7 h-7 rounded-full bg-[#FEF3C7] text-[#FFA000] flex items-center justify-center font-bold text-[12px]">
                        {i + 1}
                      </span>
                      <span className="font-semibold text-[13px] text-gray-800">{l.nama}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-gray-400 italic">Belum diisi oleh admin.</p>
              )}
            </section>

            {/* KENDARAAN */}
            <section id="section-kendaraan" className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-[15px] font-bold text-gray-900 mb-6">
                {company.judulSeksiKendaraan || "Kendaraan Kami"}
              </h2>
              {kendaraanItems.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {kendaraanItems.map((k, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-100 text-center">
                      <div className="font-bold text-[14px] text-gray-900">{k.jenis}</div>
                      <div className="text-[12px] text-[#FFA000] font-semibold mt-1">{k.kapasitas}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{k.status || k.tipe}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-gray-400 italic">Belum diisi oleh admin.</p>
              )}
            </section>

          </div>
        </div>
      )}
    </div>
  );
}

// Helper komponen baris label-value
function Row({ label, value, multiline }) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</div>
      {multiline ? (
        <p className="text-[13px] text-gray-700 leading-relaxed bg-gray-50 rounded-md px-3 py-2 border border-gray-100">
          {value || <span className="italic text-gray-300">Belum diisi</span>}
        </p>
      ) : (
        <div className="text-[13px] text-gray-800 font-medium">{value || <span className="italic text-gray-300">Belum diisi</span>}</div>
      )}
    </div>
  );
}