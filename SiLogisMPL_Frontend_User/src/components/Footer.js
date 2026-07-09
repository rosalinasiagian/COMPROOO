import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Network, BarChart2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#111111] text-white font-sans">
      {/* Top accent bar */}
      <div className="h-1 bg-[#D4A017]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-10">

          {/* Logo + Deskripsi */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 border-2 border-[#D4A017] flex items-center justify-center text-[12px] font-bold text-[#D4A017] tracking-wider flex-shrink-0">
                MPL
              </div>
              <span className="text-lg font-bold tracking-widest text-[#D4A017]">
                MANDIRI PERKASA
              </span>
            </div>
            <p className="text-[11px] tracking-widest leading-relaxed text-[#888888] uppercase max-w-xs">
              MERINTIS PRESISI INDUSTRI DALAM RANTAI PASOK GLOBAL MELALUI TELEMETRI TINGKAT LANJUT DAN MANAJEMEN ARMADA.
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="text-[11px] tracking-[4px] text-[#D4A017] mb-6 font-bold uppercase">
              NAVIGASI
            </h4>
            <ul className="flex flex-col gap-4">
              {['BERANDA', 'LAYANAN', 'ARMADA'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="text-[11px] tracking-widest text-[#888888] hover:text-[#D4A017] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hukum */}
          <div>
            <h4 className="text-[11px] tracking-[4px] text-[#D4A017] mb-6 font-bold uppercase">
              HUKUM
            </h4>
            <ul className="flex flex-col gap-4">
              {['KEBIJAKAN PRIVASI', 'KETENTUAN LAYANAN', 'PELACAKAN KARGO', 'PORTAL MITRA'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-[11px] tracking-widest text-[#888888] hover:text-[#D4A017] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Operasional */}
          <div>
            <h4 className="text-[11px] tracking-[4px] text-[#D4A017] mb-6 font-bold uppercase">
              OPERASIONAL
            </h4>
            <p className="text-[11px] tracking-widest text-[#888888] leading-relaxed mb-2">
              MARKAS BESAR: KOTA KENDARI, SULAWESI.
            </p>
            <p className="text-[11px] tracking-widest text-[#888888] leading-relaxed mb-6">
              ARMADA: 200+ UNIT TERINTEGRASI IOT.
            </p>
            <div className="flex gap-5">
              <Globe size={22} color="#D4A017" strokeWidth={1.5} />
              <Network size={22} color="#D4A017" strokeWidth={1.5} />
              <BarChart2 size={22} color="#D4A017" strokeWidth={1.5} />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[10px] tracking-widest text-[#555555] text-center sm:text-left">
            © 2024 CV MANDIRI PERKASA LOGIS. HAK CIPTA DILINDUNGI UNDANG-UNDANG.
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-0.5 bg-[#D4A017]" />
            <span className="text-[10px] tracking-[3px] text-[#D4A017] font-bold">
              IRONCLAD STANDARD
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;