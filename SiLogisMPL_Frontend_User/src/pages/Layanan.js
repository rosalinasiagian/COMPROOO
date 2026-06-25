import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { api } from '../lib/api';

const Layanan = () => {
  const navigate = useNavigate();
  const [kendaraanData, setKendaraanData] = useState([]);

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const response = await api.get("/user/companyprofile");
        const resData = response.data?.data || response.data;
        const profileData = resData?.companyProfile || resData;
        if (profileData && Array.isArray(profileData.kendaraan)) {
          setKendaraanData(profileData.kendaraan);
        }
      } catch (err) {
        console.error("Gagal menjemput data profil publik:", err);
      }
    };
    fetchCompanyProfile();
  }, []);

  const defaultKendaraan = [
    {
      badge: '',
      badgeColor: 'bg-[#107398]',
      image: '/images/pickup-truck.jpg', 
      title: 'Pickup',
      desc: 'Cocok untuk pengiriman barang kecil hingga sedang. Umumnya digunakan untuk pengiriman dalam kota.',
      contohMuatan: 'Paket, Ban, Oli dalam jumlah sedikit'
    },
    {
      badge: '',
      badgeColor: 'bg-[#8B5A2B]',
      image: '/images/isuzu-truck.jpg', 
      title: 'Truck',
      desc: 'Cocok untuk barang lebih banyak dan lebih besar. Bisa digunakan untuk pengiriman dalam kota maupun luar kota.',
      contohMuatan: 'Barang toko, Stok gudang, Barang logistik'
    },
    {
      badge: '',
      badgeColor: 'bg-[#222222]',
      image: '/images/fuso-truck.jpg', 
      title: 'Fuso',
      desc: 'Cocok untuk barang sangat banyak atau berat. Biasanya digunakan untuk pengiriman jarak jauh atau antar kota.',
      contohMuatan: 'Barang dalam jumlah besar, Kebutuhan industri'
    }
  ];

  const kendaraan = kendaraanData.length > 0 
    ? kendaraanData.map((k, i) => ({
        badge: k.status || '',
        badgeColor: defaultKendaraan[i % defaultKendaraan.length].badgeColor,
        image: k.img || defaultKendaraan[i % defaultKendaraan.length].image,
        title: k.jenis,
        desc: `Kapasitas maksimal ${k.kapasitas} KG. Cocok untuk pengiriman Anda.`,
        contohMuatan: 'Kargo logistik, barang berat'
      }))
    : defaultKendaraan;

  return (
    <div className="w-full bg-white font-sans text-[#1A1A1A]">
      
      {/* ================= SECTION 1: HERO ================= */}
      <section className="max-w-[1200px] mx-auto px-6 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          
          <div className="flex-1 w-full">
            <span className="inline-block bg-[#FCECD9] text-[#B37031] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-5">
              Kekuatan & Presisi
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-extrabold leading-[1.1] tracking-tight mb-5">
              Layanan Pengiriman <br />
              <span className="text-[#F5BC00]">Barang Kami</span>
            </h1>

            <p className="text-gray-600 text-[15px] md:text-base leading-relaxed mb-8 max-w-[90%]">
              Kami menyediakan beberapa pilihan kendaraan untuk membantu pengiriman barang Anda. Silakan pilih sesuai dengan kebutuhan ukuran dan jumlah barang.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => navigate('/pesanan', { state: { action: 'buat_pesanan' } })}
                className="bg-[#F5BC00] hover:bg-[#F5BC00] text-white font-semibold py-3 px-6 rounded-md flex items-center gap-2 transition-colors"
              >
                Mulai Kirim Sekarang <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          </div>

          <div className="flex-1 w-full relative rounded-xl overflow-hidden shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop"
              alt="Armada"
              className="w-full h-[350px] md:h-[400px] object-cover bg-gray-200"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-6 left-6">
              <h3 className="text-white text-[40px] md:text-5xl font-bold leading-none mb-1">
                99.8%
              </h3>
              <p className="text-gray-300 text-[11px] font-medium tracking-[0.15em] uppercase">
                Tingkat Ketepatan Waktu
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ================= SECTION 2: KENDARAAN ================= */}
      <section className="max-w-[1200px] mx-auto px-6 pb-16">
        <h2 className="text-[28px] md:text-3xl font-bold mb-8">
          Pilihan Kendaraan
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {kendaraan.map((item, index) => (
            <div key={index} className="flex flex-col w-full">
              
              <div className="relative w-full h-[200px] rounded-xl overflow-hidden mb-5 bg-gray-100">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x600?text=Masukkan+Gambar+Asli+Disini'
                  }}
                />
                {item.badge && (
                  <div className={`absolute top-4 left-4 ${item.badgeColor} text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-sm`}>
                    {item.badge}
                  </div>
                )}
              </div>

              <h3 className="text-[22px] font-bold mb-3">{item.title}</h3>
              <p className="text-gray-600 text-[14px] leading-[1.6] mb-6 flex-grow">
                {item.desc}
              </p>

              <div className="bg-[#F6F6F6] p-4 rounded-lg mb-5">
                <p className="text-[#888888] text-[10px] font-bold tracking-widest uppercase mb-1.5">
                  Contoh Muatan
                </p>
                <p className="text-[#1A1A1A] text-[13px] font-semibold leading-snug">
                  {item.contohMuatan}
                </p>
              </div>

              <button 
                onClick={() => navigate('/pesanan', { state: { action: 'buat_pesanan', kendaraan: item.title } })}
                className="w-full bg-[#F5BC00] hover:bg-[#F5BC00] text-[#1A1A1A] font-semibold py-3.5 rounded-md transition-colors shadow-sm"
              >
                Pesan Sekarang
              </button>
              
            </div>
          ))}
        </div>
      </section>

      {/* ================= SECTION 3: STATISTIK PENGALAMAN ================= */}
      <section className="max-w-[1200px] mx-auto px-6 pb-24">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          
          {/* Kotak Kiri (Abu-abu) */}
          <div className="flex-1 bg-[#EBEBEB] rounded-xl p-10 md:p-12">
            <h3 className="text-[#F5BC00] text-[64px] md:text-[80px] font-bold leading-none mb-4">
              2+
            </h3>
            <h4 className="text-[22px] md:text-2xl font-bold text-[#1A1A1A] mb-4">
              Tahun Pengalaman
            </h4>
            <p className="text-gray-700 text-[15px] md:text-base leading-relaxed">
              Membangun kepercayaan melalui ribuan pengiriman sukses sejak 2024. Kami menguasai medan dan regulasi logistik nasional.
            </p>
          </div>

          {/* Kotak Kanan (Putih dengan Border) */}
          <div className="flex-1 bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-xl p-10 md:p-12 flex flex-col justify-center">
            
            {/* Baris Atas: Kepuasan Klien */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-8 mb-8 gap-4">
              <div>
                <p className="text-gray-500 text-[11px] font-bold tracking-[0.15em] uppercase mb-1.5">
                  Kepuasan Klien
                </p>
                <p className="text-[28px] md:text-[32px] font-bold text-[#1A1A1A] leading-tight">
                  Sangat Baik
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-[#F5BC00] text-[32px] md:text-[40px] font-bold leading-none">
                  4.9/5
                </p>
              </div>
            </div>

            {/* Baris Bawah: Area Jangkauan */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-gray-500 text-[11px] font-bold tracking-[0.15em] uppercase mb-1.5">
                  Area Jangkauan
                </p>
                <p className="text-[28px] md:text-[32px] font-bold text-[#1A1A1A] leading-tight">
                  Luar & Dalam
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-[#F5BC00] text-[32px] md:text-[40px] font-bold leading-none">
                  Provinsi
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default Layanan;