import React, { useState, useEffect } from 'react';
import {
  Check, X, ArrowRight, Lightbulb, MapPin,
  Package, ClipboardList, Bell, User as UserIcon,
  Star, MessageSquare, Phone, Info, FileText,
  Truck, Archive, Clock, Download, PlusCircle
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '../lib/api';

const Pesanan = ({ onComplete, onBack }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const location = useLocation();

  const [formData, setFormData] = useState({
    jenisPaket: '', beratEstimasi: '', totalPaket: '', catatan: '',
    pengirimNama: '', pengirimAlamat: '', pengirimPIC: '', pengirimTelp: '',
    penerimaNama: '', penerimaAlamat: '', penerimaPIC: '', penerimaTelp: '',
    kendaraan: location.state?.kendaraan || '', agreed: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const nextStep = (targetStep) => {
    setStep(targetStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const prevStep = (targetStep) => {
    setStep(targetStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!formData.agreed) {
      toast.error('Anda harus menyetujui syarat dan ketentuan yang berlaku.');
      return;
    }
    
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('mpl_token');
      if (!token) {
        toast.error('Sesi Anda telah habis, silakan login kembali.');
        navigate('/masuk');
        return;
      }

      const payload = {
        jenisPaket: formData.jenisPaket,
        totalBerat: parseFloat(formData.beratEstimasi) || 0,
        totalPaket: parseInt(formData.totalPaket) || 0,
        namaPengirim: formData.pengirimNama,
        alamatAsal: formData.pengirimAlamat,
        picPengirim: formData.pengirimPIC,
        nomorTeleponPengirim: formData.pengirimTelp,
        namaPenerima: formData.penerimaNama,
        alamatTujuan: formData.penerimaAlamat,
        picPenerima: formData.penerimaPIC,
        nomorTeleponPenerima: formData.penerimaTelp,
        jenisKendaraan: formData.kendaraan,
        tipe: "Reguler",
        kapasitas: 50,
        catatanTambahan: formData.catatan
      };

      const response = await api.post('/order/create', payload, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200 || response.status === 201) {
        toast.success('Pesanan berhasil dibuat!');
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      const errorMessage = error.response?.data?.errors || error.response?.data?.message || "Gagal membuat pesanan, silakan cek kembali data Anda.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 p-8">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowRight className="w-4 h-4 rotate-180" /> Kembali ke Manifest
        </button>
      )}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">DETAIL BARANG</h1>
        <p className="text-gray-500">
          Lengkapi informasi spesifik mengenai muatan Anda untuk kalkulasi logistik yang akurat dan penanganan yang aman.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-[#F5BC00]">
          <label className="block text-xs font-bold text-yellow-500 mb-4 tracking-wider">
            JENIS PAKET
          </label>
          <input
            type="text"
            name="jenisPaket"
            value={formData.jenisPaket}
            onChange={handleInputChange}
            placeholder="Contoh : Ban"
            className="w-full bg-gray-200 text-gray-800 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-[#F5BC00]"
          />
        </div>

        <div className="bg-[#f8f9fa] p-6 rounded-2xl border border-gray-100 flex flex-col justify-center focus-within:border-[#F5BC00] transition-colors duration-200">
          <label className="block text-xs font-bold text-gray-500 mb-2 tracking-wider">
            TOTAL BERAT ESTIMASI
          </label>
          <div className="flex items-end gap-2 mb-2">
            <input
              name="beratEstimasi"
              type="number"
              step="0.1"
              min="0"
              placeholder="0.00"
              value={formData.beratEstimasi}
              onChange={handleInputChange}
              className="text-5xl font-bold text-gray-900 bg-transparent border-b-2 border-transparent focus:border-b-gray-400 w-44 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="textxl font-bold text-gray-400 mb-1">KG</span>
          </div>
          <div className="w-12 h-1 bg-[#F5BC00] mt-2"></div>
        </div>

        <div className="bg-[#f8f9fa] p-6 rounded-2xl border border-gray-100 flex flex-col justify-center focus-within:border-[#F5BC00] transition-colors duration-200">
          <label className="block text-xs font-bold text-gray-500 mb-2 tracking-wider">
            TOTAL PAKET
          </label>
          <div className="flex items-end gap-2 mb-2">
            <input
              name="totalPaket"
              type="number"
              min="0"
              placeholder="0"
              value={formData.totalPaket}
              onChange={handleInputChange}
              className="text-5xl font-bold text-gray-900 bg-transparent border-b-2 border-transparent focus:border-b-gray-400 w-44 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div className="w-12 h-1 bg-[#F5BC00] mt-2"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="relative h-64 rounded-2xl overflow-hidden bg-gray-800">
          <img
            src="/images/hd_warehouse_bg_v2.png"
            alt="Warehouse"
            className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale"
          />
          <div className="absolute bottom-0 left-0 p-8">
            <p className="text-white text-xl font-semibold leading-snug">
              Pastikan kemasan sesuai standar keamanan industri.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <label className="block text-xs font-bold text-yellow-500 mb-4 tracking-wider">
            CATATAN TAMBAHAN / INSTRUKSI KHUSUS
          </label>
          <textarea
            name="catatan"
            value={formData.catatan}
            onChange={handleInputChange}
            placeholder="Contoh: Barang mudah pecah, jangan ditumpuk, atau instruksi handling lainnya..."
            className="w-full h-40 bg-gray-200 text-gray-800 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#F5BC00]"
          ></textarea>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 pt-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-gray-900"
        >
          <X className="w-4 h-4" /> BATALKAN PESANAN
        </button>
        <button
          onClick={() => nextStep(2)}
          className="bg-[#F5BC00] hover:bg-[#F5BC00]/90 text-white font-semibold py-4 px-8 rounded-lg shadow-md transition-all"
        >
          LANJUT KE PENGIRIMAN
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500 p-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Informasi Pengiriman</h1>
        <p className="text-gray-500">
          Tentukan titik jemput dan tujuan serta kontak operasional di lapangan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-[#F5BC00] rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-900 tracking-wide">
                ALAMAT ASAL (TITIK JEMPUT)
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 tracking-wider">
                  NAMA PENGIRIM / GUDANG
                </label>
                <input
                  type="text"
                  name="pengirimNama"
                  value={formData.pengirimNama}
                  onChange={handleInputChange}
                  placeholder="Contoh: Warehouse Jakarta Timur"
                  className="w-full bg-[#E5E7EB] text-gray-800 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-[#F5BC00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 tracking-wider">
                  ALAMAT LENGKAP
                </label>
                <textarea
                  name="pengirimAlamat"
                  value={formData.pengirimAlamat}
                  onChange={handleInputChange}
                  placeholder="Masukkan alamat detail dan instruksi khusus..."
                  className="w-full h-24 bg-[#E5E7EB] text-gray-800 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#F5BC00]"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 tracking-wider">
                    PIC PENGIRIM
                  </label>
                  <input
                    type="text"
                    name="pengirimPIC"
                    value={formData.pengirimPIC}
                    onChange={handleInputChange}
                    placeholder="Nama kontak"
                    className="w-full bg-[#E5E7EB] text-gray-800 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-[#F5BC00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 tracking-wider">
                    NOMOR TELEPON PENGIRIM
                  </label>
                  <input
                    type="tel"
                    name="pengirimTelp"
                    value={formData.pengirimTelp}
                    onChange={handleInputChange}
                    placeholder="+62 812..."
                    className="w-full bg-[#E5E7EB] text-gray-800 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-[#F5BC00]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-gray-900 rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-900 tracking-wide">
                ALAMAT TUJUAN (DESTINASI)
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 tracking-wider">
                  NAMA PENERIMA / PERUSAHAAN
                </label>
                <input
                  type="text"
                  name="penerimaNama"
                  value={formData.penerimaNama}
                  onChange={handleInputChange}
                  placeholder="Contoh: PT Mitra Sejahtera"
                  className="w-full bg-[#E5E7EB] text-gray-800 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-[#F5BC00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 tracking-wider">
                  ALAMAT LENGKAP
                </label>
                <textarea
                  name="penerimaAlamat"
                  value={formData.penerimaAlamat}
                  onChange={handleInputChange}
                  placeholder="Masukkan alamat detail tujuan..."
                  className="w-full h-24 bg-[#E5E7EB] text-gray-800 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#F5BC00]"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 tracking-wider">
                    PIC PENERIMA
                  </label>
                  <input
                    type="text"
                    name="penerimaPIC"
                    value={formData.penerimaPIC}
                    onChange={handleInputChange}
                    placeholder="Nama kontak"
                    className="w-full bg-[#E5E7EB] text-gray-800 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-[#F5BC00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 tracking-wider">
                    NOMOR TELEPON PENERIMA
                  </label>
                  <input
                    type="tel"
                    name="penerimaTelp"
                    value={formData.penerimaTelp}
                    onChange={handleInputChange}
                    placeholder="+62 856..."
                    className="w-full bg-[#E5E7EB] text-gray-800 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-[#F5BC00]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#FEF9C3] p-6 rounded-2xl border border-yellow-100">
            <div className="flex gap-3">
              <Lightbulb className="w-6 h-6 text-yellow-600 shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Tips Pengiriman</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Pastikan nomor telepon PIC aktif untuk mempermudah komunikasi driver saat penjemputan barang.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => nextStep(3)}
            className="w-full flex items-center justify-center gap-2 bg-[#F5BC00] hover:bg-[#F5BC00]/90 text-white font-bold py-4 px-6 rounded-xl shadow-md transition-all"
          >
            Lanjut ke Pilih Kendaraan <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => prevStep(1)}
            className="w-full flex items-center justify-center text-sm font-bold text-gray-900 hover:text-yellow-600 transition-colors"
          >
            Kembali ke Detail Barang
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => {
    const defaultArmadas = [
      { id: 'Pickup', name: 'Pickup', badge: 'PERKOTAAN', badgeColor: 'bg-blue-100 text-blue-600', capacity: '720 Kg', img: '/images/pickup-truck.jpg' },
      { id: 'Truck', name: 'Truck', badge: 'MENENGAH', badgeColor: 'bg-yellow-100 text-yellow-700', capacity: '4.000 Kg', img: '/images/isuzu-truck.jpg' },
      { id: 'Fuso', name: 'Fuso', badge: 'BERAT', badgeColor: 'bg-red-100 text-red-600', capacity: '8.000 Kg', img: '/images/fuso-truck.jpg' },
    ];

    const armadas = kendaraanData.length > 0 
      ? kendaraanData.map((k, i) => ({
          id: k.jenis,
          name: k.jenis,
          badge: k.status || 'TERSEDIA',
          badgeColor: defaultArmadas[i % defaultArmadas.length].badgeColor,
          capacity: `${k.kapasitas} Kg`,
          img: k.img || defaultArmadas[i % defaultArmadas.length].img
        }))
      : defaultArmadas;

    const handleSelectArmada = (id) => {
      setFormData((prev) => ({ ...prev, kendaraan: id }));
    };

    return (
      <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500 p-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Pilih Armada Pengiriman</h1>
          <p className="text-gray-500">Sesuaikan kapasitas kendaraan dengan muatan logistik Anda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {armadas.map((armada) => {
            const isSelected = formData.kendaraan === armada.id;
            return (
              <div
                key={armada.id}
                className={`bg-white rounded-3xl p-6 shadow-sm border transition-all cursor-pointer ${isSelected ? 'border-l-4 border-[#F5BC00]' : 'border-gray-100 hover:border-gray-200'}`}
                onClick={() => handleSelectArmada(armada.id)}
              >
                <div className="h-40 bg-gray-100 rounded-2xl mb-6 overflow-hidden">
                  <img src={armada.img} alt={armada.name} className="w-full h-full object-cover" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">{armada.name}</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider mb-6 ${armada.badgeColor}`}>
                  {armada.badge}
                </span>

                <div className="flex items-center gap-2 mb-6">
                  <div className="w-4 h-4 bg-yellow-100 flex items-center justify-center rounded">
                    <div className="w-2 h-2 bg-[#F5BC00] rounded-sm"></div>
                  </div>
                  <p className="text-sm font-medium text-gray-600">
                    Kapasitas: <span className="font-bold text-gray-900">{armada.capacity}</span>
                  </p>
                </div>

                <button
                  type="button"
                  className={`w-full py-3 px-4 rounded-xl font-bold transition-all ${isSelected ? 'bg-[#F5BC00] text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                >
                  {isSelected ? 'TERPILIH' : 'Pilih Kendaraan'}
                </button>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border-t-4 border-[#F5BC00] p-6 mb-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">KENDARAAN TERPILIH</p>
            <h3 className="text-2xl font-bold text-gray-900">{formData.kendaraan || '-'}</h3>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button onClick={() => prevStep(2)} className="flex-1 sm:flex-none px-6 py-3 text-sm font-bold text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">Kembali</button>
            <button
              onClick={() => nextStep(4)}
              disabled={!formData.kendaraan}
              className="flex-1 sm:flex-none bg-[#F5BC00] hover:bg-[#F5BC00]/90 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Lanjut ke Tinjauan
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-500 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Ringkasan Pengiriman</h1>
        <p className="text-gray-500">Mohon periksa kembali seluruh informasi di bawah ini sebelum mengonfirmasi pesanan logistik Anda. Pastikan detail armada dan rute sudah sesuai.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border-l-4 border-[#F5BC00] mb-6 relative">
        <div className="absolute top-8 right-8 bg-[#F5BC00] text-white text-xs font-bold px-3 py-1.5 rounded uppercase">
          Manifest ID: #{formData.orderNumber || "LOG-DEMO"}
        </div>

        <h3 className="text-xs font-bold text-gray-400 tracking-widest mb-6">INFORMASI PELANGGAN</h3>
        <div className="grid grid-cols-2 gap-8 mb-10 border-b border-gray-100 pb-10">
          <div>
            <p className="text-xs font-bold text-gray-500 mb-1 tracking-wider uppercase">Nama Pengirim / Gudang</p>
            <p className="text-lg font-bold text-gray-900 mb-4">{formData.pengirimNama || '-'}</p>
            <p className="text-xs font-bold text-gray-500 mb-1 tracking-wider uppercase">PIC Pengirim</p>
            <p className="font-bold text-gray-900 mb-4">{formData.pengirimPIC || '-'}</p>
            <p className="text-xs font-bold text-gray-500 mb-1 tracking-wider uppercase">Nomor Telepon Pengirim</p>
            <p className="font-bold text-gray-900">{formData.pengirimTelp || '-'}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 mb-1 tracking-wider uppercase">Nama Penerima / Gudang</p>
            <p className="text-lg font-bold text-gray-900 mb-4">{formData.penerimaNama || '-'}</p>
            <p className="text-xs font-bold text-gray-500 mb-1 tracking-wider uppercase">PIC Penerima</p>
            <p className="font-bold text-gray-900 mb-4">{formData.penerimaPIC || '-'}</p>
            <p className="text-xs font-bold text-gray-500 mb-1 tracking-wider uppercase">Nomor Telepon Penerima</p>
            <p className="font-bold text-gray-900">{formData.penerimaTelp || '-'}</p>
          </div>
        </div>

        <h3 className="text-xs font-bold text-gray-400 tracking-widest mb-4">INFORMASI MUATAN</h3>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Paket Logistik</h2>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#F8F9FA] p-5 rounded-2xl">
            <p className="text-xs font-bold text-gray-500 mb-1 tracking-wider">TOTAL BERAT</p>
            <p className="text-xl font-bold text-gray-900">{formData.beratEstimasi || '0'} <span className="text-sm font-normal">KG</span></p>
          </div>
          <div className="bg-[#F8F9FA] p-5 rounded-2xl">
            <p className="text-xs font-bold text-gray-500 mb-1 tracking-wider">JENIS PAKET</p>
            <p className="text-xl font-bold text-gray-900">{formData.jenisPaket || '-'}</p>
          </div>
          <div className="bg-[#F8F9FA] p-5 rounded-2xl">
            <p className="text-xs font-bold text-gray-500 mb-1 tracking-wider">TOTAL PAKET</p>
            <p className="text-xl font-bold text-gray-900">{formData.totalPaket || '0'} <span className="text-sm font-normal">PAKET</span></p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gray-200 rounded-xl overflow-hidden shrink-0">
            <img src="/images/isuzu-truck.jpg" alt="Kendaraan" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{formData.kendaraan || 'Belum Dipilih'}</h3>
            <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <span className="w-3 h-3 bg-[#F5BC00] inline-block rounded-sm"></span> Armada Pilihan
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <h3 className="text-[14px] font-bold text-gray-600 tracking-widest mb-8 uppercase">RUTE PENGIRIMAN</h3>
          <div className="relative pl-10">
            <div className="absolute left-[11px] top-6 bottom-10 w-[2px] border-l-[2px] border-dashed border-gray-300"></div>

            <div className="mb-10 relative">
              <div className="absolute -left-[40px] top-1 w-6 h-6 border-[3px] border-[#F5BC00] bg-white rounded-full flex items-center justify-center z-10">
                <div className="w-2 h-2 bg-[#F5BC00] rounded-full"></div>
              </div>
              <p className="text-xs font-bold text-[#F5BC00] mb-2 tracking-wider uppercase">TITIK MUAT — JAKARTA UTARA</p>
              <h4 className="text-xl font-bold text-gray-900 mb-1">{formData.pengirimNama || 'Kawasan Industri Pulogadung'}</h4>
              <p className="text-base text-gray-500">{formData.pengirimAlamat || 'Blok C No. 12, Pergudangan Logistics, Jakarta 13920'}</p>
            </div>

            <div className="relative">
              <div className="absolute -left-[42px] top-1 w-7 h-7 bg-[#F5BC00] text-white flex items-center justify-center rounded-full z-10">
                <MapPin className="w-4 h-4 text-white" fill="white" />
              </div>
              <p className="text-xs font-bold text-[#F5BC00] mb-2 tracking-wider uppercase">TITIK BONGKAR — SURABAYA</p>
              <h4 className="text-xl font-bold text-gray-900 mb-1">{formData.penerimaNama || 'Margomulyo Permai'}</h4>
              <p className="text-base text-gray-500">{formData.penerimaAlamat || 'Jl. Greges Jaya II, Pergudangan B-14, Surabaya 60183'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm flex flex-col">
          <div className="border border-gray-100 rounded-2xl p-6 flex items-start gap-4 mb-10 flex-1">
            <input
              type="checkbox"
              name="agreed"
              checked={formData.agreed}
              onChange={handleInputChange}
              className="mt-1 w-5 h-5 text-[#F5BC00] rounded focus:ring-[#F5BC00] border-gray-300 cursor-pointer transition-colors"
            />
            <p className="text-[15px] text-gray-500 leading-relaxed font-medium">
              Saya menyatakan bahwa seluruh informasi di atas adalah benar dan saya menyetujui <br className="hidden sm:block" />
              <span className="text-[#F5BC00] font-bold cursor-pointer">Syarat & Ketentuan</span> pengiriman LogisticsLedger.
            </p>
          </div>

          <div className="flex gap-4 h-[140px]">
            <button onClick={() => prevStep(3)} className="flex-1 bg-white border border-gray-200 text-gray-900 text-[17px] font-bold rounded-2xl hover:bg-gray-50 transition-colors flex items-center justify-center">Kembali</button>
            <button
              onClick={handleSubmit}
              disabled={!formData.agreed || isSubmitting}
              className="flex-1 bg-[#F5BC00] hover:bg-[#F5BC00]/90 text-white font-bold rounded-2xl shadow-lg shadow-[#F5BC00]/20 transition-all flex flex-col items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-[17px] leading-tight">
                {isSubmitting ? "MEMPROSES..." : "KONFIRMASI"}
              </span>
              {!isSubmitting && <span className="text-[17px] leading-tight">BUAT PESANAN</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F5F7F9] py-0 w-full">
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-12 max-w-md w-full mx-4 text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full border-4 border-green-500 flex items-center justify-center bg-green-50">
              <Check className="w-12 h-12 text-green-500" strokeWidth={3} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Pesanan Berhasil di Buat</h2>
            <p className="text-gray-500 mb-8">Tunggu Verifikasi Admin</p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                setFormData({
                  jenisPaket: '', beratEstimasi: '', totalPaket: '', catatan: '',
                  pengirimNama: '', pengirimAlamat: '', pengirimPIC: '', pengirimTelp: '',
                  penerimaNama: '', penerimaAlamat: '', penerimaPIC: '', penerimaTelp: '',
                  kendaraan: '', agreed: false,
                });
                setStep(1);
                if (onComplete) onComplete();
              }}
              className="text-gray-400 hover:text-gray-600 text-sm font-semibold"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ProgressBar = ({ currentStep, statusPengiriman }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm mb-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-[40px] right-[40px] top-5 h-2 bg-gray-200 rounded-full z-0"></div>
        <div
          className="absolute left-[40px] top-5 h-2 bg-[#F5BC00] rounded-full z-0 transition-all duration-500"
          style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? 'calc(50% - 20px)' : '100%' }}
        ></div>

        {[
          { step: 1, label: 'VERIFIKASI' },
          { step: 2, label: statusPengiriman ? statusPengiriman.toUpperCase().replace('-', ' ') : 'PENGANTARAN' },
          { step: 3, label: 'SELESAI' },
        ].map((item) => {
          const isCompleted = currentStep > item.step;
          const isActive = currentStep === item.step;
          return (
            <div key={item.step} className="relative z-10 flex flex-col items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors
                ${isCompleted || isActive ? 'bg-[#F5BC00] text-white' : 'bg-gray-200 text-gray-500'}`}>
                {isCompleted ? <Check className="w-5 h-5" /> : item.step}
              </div>
              <span className={`text-xs font-bold tracking-wider ${isActive ? 'text-[#F5BC00]' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PesananBerlangsungList = ({ orders, onReviewComplete, initialSelectedOrderId }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (initialSelectedOrderId && orders && orders.length > 0) {
      const found = orders.find(o => o.id === initialSelectedOrderId);
      if (found) {
        setSelectedOrder(found);
      }
    }
  }, [initialSelectedOrderId, orders]);

  if (!orders || orders.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center animate-in fade-in py-20">
        <Package className="w-32 h-32 text-gray-200 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tidak ada pesanan berlangsung</h2>
        <p className="text-gray-500">Silahkan buat pesanan baru.</p>
      </div>
    );
  }

  if (selectedOrder) {
    return (
      <div className="animate-in fade-in slide-in-from-right-8 duration-300">
        <button
          onClick={() => setSelectedOrder(null)}
          className="text-sm font-bold text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-6 transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" /> Kembali ke Daftar Pesanan
        </button>
        <PesananBerlangsung
          order={selectedOrder}
          onReviewComplete={() => {
            setSelectedOrder(null);
            if (onReviewComplete) onReviewComplete();
          }}
        />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pesanan Berlangsung</h1>
        <p className="text-gray-500">Pantau status pesanan logistik Anda yang sedang diproses.</p>
      </div>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition-shadow">
            <div className="w-full">
              <div className="flex gap-4 items-center mb-4">
                <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded text-sm">#{order?.orderNumber || "MPL-DEMO"}</span>
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#F5BC00] bg-[#F5BC00]/10 px-2 py-1 rounded">
                  {order?.status === 'PENDING' ? 'VERIFIKASI' : order?.status === 'ONGOING' || order?.status === 'ACCEPT' ? (order?.statusPengiriman || 'DIPROSES') : (order?.status === 'COMPLETED' || order?.status === 'SELESAI' || order?.status === 'Tiba di Tujuan') ? 'MENUNGGU ULASAN' : order?.status}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Pengirim</p>
                  <p className="font-bold text-gray-900">{order?.namaPengirim}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Penerima</p>
                  <p className="font-bold text-gray-900">{order?.namaPenerima}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Kendaraan</p>
                  <p className="font-bold text-gray-900 flex items-center gap-1"><Truck className="w-3 h-3 text-[#F5BC00]" /> {order?.jenisKendaraan}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Total</p>
                  <p className="font-bold text-gray-900">{order?.totalBerat} Kg</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedOrder(order)}
              className="w-full md:w-auto px-6 py-3 bg-[#F5BC00] hover:bg-[#E5A900] text-white font-bold rounded-xl transition-colors whitespace-nowrap flex items-center justify-center gap-2"
            >
              Lihat Detail <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const PesananBerlangsung = ({ order, onReviewComplete }) => {
  let statusStep = 1;
  if (order?.status === 'PENDING') statusStep = 1;
  else if (order?.status === 'ONGOING' || order?.status === 'ACCEPT' || order?.status === 'Diproses') statusStep = 2;
  else statusStep = 3;

  const [showReviewSuccess, setShowReviewSuccess] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (!rating) {
      toast.error("Silakan berikan rating terlebih dahulu");
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await api.post(`/user/create/ulasan/${order.id}`, { rating, komentar: reviewText });
      const reviewed = JSON.parse(localStorage.getItem('reviewedOrders') || '[]');
      if (!reviewed.includes(order.id)) {
        reviewed.push(order.id);
        localStorage.setItem('reviewedOrders', JSON.stringify(reviewed));
      }
      setShowReviewSuccess(true);
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengirim ulasan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 relative">
      <ProgressBar currentStep={statusStep} statusPengiriman={order?.statusPengiriman} />

      <div className="max-w-4xl mx-auto space-y-6">
        {statusStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-gray-400 mb-1 uppercase">Manifest ID</p>
                    <h2 className="text-2xl font-bold text-gray-900">{order?.orderNumber || "MPL-DEMO"}</h2>
                  </div>
                  <div className="bg-[#F5BC00]/10 text-[#F5BC00] border border-[#F5BC00]/20 px-4 py-2 rounded-full text-sm font-bold w-max">
                    Menunggu Verifikasi Admin
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-gray-400 mb-1 uppercase">Detail Barang</p>
                    <p className="font-bold text-gray-900 text-lg">{order?.jenisPaket || "Barang"}</p>
                    <p className="text-sm text-gray-500 mt-2">Total Berat: {order?.totalBerat} Kg | {order?.totalPaket} Paket</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-gray-400 mb-1 uppercase">Tujuan Pengiriman</p>
                    <p className="font-bold text-gray-900 text-lg">{order?.namaPenerima}</p>
                    <p className="text-sm text-gray-500 mt-2">{order?.alamatTujuan}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#F8F9FA] p-6 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-900 text-lg">Informasi Pesanan</h3>
                  <Info className="w-5 h-5 text-[#F5BC00]" />
                </div>
                <div className="space-y-5">
                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-gray-500 mb-1 uppercase">Waktu Pemesanan</p>
                    <p className="font-bold text-gray-900 text-sm">05 Sep 2024, 08:22 WIB</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-gray-500 mb-1 uppercase">Metode Layanan</p>
                    <p className="font-bold text-gray-900 text-sm">Door-to-Door (Express)</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-gray-500 mb-1 uppercase">Status Saat Ini</p>
                    <p className="font-bold text-[#F5BC00] text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#F5BC00]"></span> Verifikasi Admin
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 border-2 border-dashed border-[#F5BC00] bg-white p-10 rounded-2xl text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-[#F5BC00]/10 rounded-full flex items-center justify-center mb-6">
                  <ClipboardList className="w-8 h-8 text-[#F5BC00]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Pesanan Sedang Diverifikasi</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
                  Tim admin kami sedang meninjau detail pesanan dan manifest pengiriman Anda. Instruksi pembayaran akan muncul secara otomatis di halaman ini setelah proses verifikasi selesai.
                </p>
                <p className="text-sm font-bold text-[#F5BC00] flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Estimasi 15-30 Menit
                </p>
              </div>

              <div className="bg-[#DCEFFE] p-4 rounded-xl flex flex-col w-fit h-fit">
                <h3 className="font-bold text-gray-900 text-base mb-1">Butuh Bantuan?</h3>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed max-w-[280px]">
                  Hubungi tim operasional kami jika Anda memiliki pertanyaan mengenai pesanan ini.
                </p>
                <a href="https://wa.me/628114055966?text=Halo%20Admin,%20saya%20butuh%20bantuan%20terkait%20pesanan%20saya." target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-gray-900 flex items-center gap-2 w-max hover:text-blue-700 transition-colors">
                  Buka Pusat Bantuan <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </a>
              </div>
            </div>
          </div>
        )}

        {statusStep === 2 && (
          <>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#F5BC00]/30">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Detail Pengiriman</h3>
                <Truck className="w-6 h-6 text-[#F5BC00]" />
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold tracking-wider text-gray-400 mb-1">MANIFEST ID</p>
                  <p className="font-bold text-gray-900">{order?.orderNumber || "MPL-DEMO"}</p>
                </div>
                <div>
                  <p className="text-xs font-bold tracking-wider text-gray-400 mb-1">STATUS PENGIRIMAN</p>
                  <div className="inline-block bg-[#F5BC00]/10 text-[#F5BC00] border border-[#F5BC00]/20 px-3 py-1 rounded text-sm font-bold">
                    {order?.statusPengiriman || "Diproses"}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold tracking-wider text-gray-400 mb-1">TITIK AWAL</p>
                  <p className="font-bold text-gray-900">{order?.alamatAsal}</p>
                </div>
                <div>
                  <p className="text-xs font-bold tracking-wider text-gray-400 mb-1">TUJUAN</p>
                  <p className="font-bold text-gray-900">{order?.namaPenerima} - Samarinda</p>
                </div>
                <div>
                  <p className="text-xs font-bold tracking-wider text-gray-400 mb-1">MUATAN</p>
                  <p className="font-bold text-gray-900">{order?.jenisPaket} ({order?.totalBerat} Kg)</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#F5BC00]">
                <p className="text-[11px] font-bold tracking-wider text-gray-600 mb-5 uppercase">Informasi Pengantar</p>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-[72px] h-[72px] bg-[#EFEFEF] rounded-2xl flex items-center justify-center shrink-0">
                    <UserIcon className="w-8 h-8 text-gray-700" />
                  </div>
                  <div className="flex flex-col gap-3 flex-1">
                    <div className="flex gap-10">
                      <div>
                        <p className="text-[11px] font-bold tracking-wider text-gray-500 mb-1 uppercase">Nama Driver</p>
                        <p className="text-xl font-bold text-gray-900">{order?.namaDriver || "Belum Ditugaskan"}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold tracking-wider text-gray-500 mb-1 uppercase">Plat Nomor</p>
                        <p className="text-xl font-bold text-gray-900">{order?.platNomorKendaraan || "-"}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <a
                        href={order?.nomorTeleponDriver ? `tel:${order.nomorTeleponDriver}` : "#"}
                        onClick={(e) => !order?.nomorTeleponDriver && e.preventDefault()}
                        className="bg-[#F5BC00] hover:bg-[#F5BC00]/90 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Phone className="w-4 h-4" /> Hubungi Driver
                      </a>
                      <a
                        href={order?.nomorTeleponDriver ? `https://wa.me/${order.nomorTeleponDriver}` : "#"}
                        target={order?.nomorTeleponDriver ? "_blank" : undefined}
                        rel="noreferrer"
                        onClick={(e) => !order?.nomorTeleponDriver && e.preventDefault()}
                        className="border border-gray-300 hover:bg-gray-50 text-gray-900 font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" /> Kirim Pesan
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#DCEFFE] p-7 lg:p-8 rounded-2xl flex flex-col h-fit">
                <h3 className="font-bold text-gray-900 text-lg mb-3">Butuh Bantuan?</h3>
                <p className="text-[15px] text-slate-700 mb-8 leading-relaxed">Ada kendala dalam penerimaan barang? Tim operasional kami siap membantu.</p>
                <a href="https://wa.me/628114055966?text=Halo%20Admin,%20saya%20butuh%20bantuan%20terkait%20pesanan%20saya." target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-gray-900 flex items-center gap-2 w-max hover:text-blue-700 transition-colors">
                  Buka Pusat Bantuan <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </a>
              </div>
            </div>
          </>
        )}

        {statusStep === 3 && (
          <>


            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#F5BC00]/30">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-xs font-bold tracking-wider text-gray-400 mb-1">MANIFEST ID</p>
                  <h2 className="text-2xl font-bold text-gray-900">{order?.orderNumber || "MPL-DEMO"}</h2>
                </div>
                <div className="bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-bold">Selesai & Terkirim</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs font-bold tracking-wider text-gray-400 mb-1">DETAIL BARANG</p>
                  <p className="font-bold text-gray-900">{order?.jenisPaket}</p>
                  <p className="text-sm text-gray-500 mt-1">Total Berat: {order?.totalBerat} Kg | {order?.totalPaket} Paket</p>
                </div>
                <div>
                  <p className="text-xs font-bold tracking-wider text-gray-400 mb-1">TUJUAN PENGIRIMAN</p>
                  <p className="font-bold text-gray-900">{order?.namaPenerima}</p>
                  <p className="text-sm text-gray-500 mt-1">{order?.alamatTujuan}</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-8 rounded-2xl">
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 text-orange-400 fill-orange-400" />
                <h3 className="font-bold text-gray-900 text-lg">Beri Ulasan Layanan</h3>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <p className="text-center font-bold text-gray-900 mb-4">Bagaimana pengalaman pengiriman Anda?</p>
                <div className="flex justify-center gap-2 mb-6" onMouseLeave={() => setHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-8 h-8 cursor-pointer transition-transform hover:scale-110 ${star <= (hoverRating || rating) ? 'text-[#F5BC00] fill-[#F5BC00]' : 'text-gray-300'}`}
                      onMouseEnter={() => setHoverRating(star)}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tuliskan feedback Anda untuk membantu kami meningkatkan layanan..."
                  className="w-full h-24 bg-gray-50 border border-gray-200 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#F5BC00] mb-4"
                ></textarea>
                <button
                  onClick={handleSubmitReview}
                  disabled={isSubmitting}
                  className="w-full bg-[#F5BC00] hover:bg-[#F5BC00]/90 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl transition-colors"
                >
                  {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
                </button>
              </div>
            </div>

            {showReviewSuccess && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-white rounded-3xl p-12 max-w-md w-full mx-4 text-center shadow-2xl animate-in zoom-in-95 duration-300">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full border-4 border-green-500 flex items-center justify-center bg-green-50">
                    <Check className="w-12 h-12 text-green-500" strokeWidth={3} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Ulasan Berhasil di Buat</h2>
                  <p className="text-gray-500 mb-8">Terima kasih atas ulasan anda</p>
                  <button
                    onClick={() => {
                      setShowReviewSuccess(false);
                      if (onReviewComplete) onReviewComplete();
                    }}
                    className="text-gray-400 hover:text-gray-600 text-sm font-semibold"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const HistoryPesananList = ({ orders }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  if (!orders || orders.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center animate-in fade-in py-20">
        <Package className="w-32 h-32 text-gray-200 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Tidak Ditemukan</h2>
        <p className="text-gray-500">Belum ada riwayat pesanan.</p>
      </div>
    );
  }

  if (selectedOrder) {
    return (
      <div className="animate-in fade-in slide-in-from-right-8 duration-300">
        <button
          onClick={() => setSelectedOrder(null)}
          className="text-sm font-bold text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-6 transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" /> Kembali ke Daftar Riwayat
        </button>
        <HistoryPesanan order={selectedOrder} />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Riwayat Pesanan Saya</h1>
        <p className="text-gray-500">Kelola dan pantau seluruh pengiriman logistik Anda dengan mudah.</p>
      </div>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition-shadow">
            <div className="w-full">
              <div className="flex gap-4 items-center mb-4">
                <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded text-sm">#{order?.orderNumber || "MPL-DEMO"}</span>
                <span className="text-[11px] font-bold tracking-wider uppercase text-green-600 bg-green-100 px-2 py-1 rounded">
                  SELESAI
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Pengirim</p>
                  <p className="font-bold text-gray-900">{order?.namaPengirim}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Penerima</p>
                  <p className="font-bold text-gray-900">{order?.namaPenerima}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Kendaraan</p>
                  <p className="font-bold text-gray-900 flex items-center gap-1"><Truck className="w-3 h-3 text-green-600" /> {order?.jenisKendaraan}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Total</p>
                  <p className="font-bold text-gray-900">{order?.totalBerat} Kg</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedOrder(order)}
              className="w-full md:w-auto px-6 py-3 border-2 border-gray-200 text-gray-700 hover:border-[#F5BC00] hover:text-[#F5BC00] font-bold rounded-xl transition-colors whitespace-nowrap flex items-center justify-center gap-2"
            >
              Lihat Detail <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const HistoryPesanan = ({ order }) => {
  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="mb-10 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Detail Pesanan Saya</h1>
          <p className="text-xs font-bold text-gray-400 tracking-wider mt-2">HISTORY PESANAN &gt; Order #{order?.orderNumber || "MPL-DEMO"}</p>
        </div>
        <button onClick={() => {
          if (order?.urlInvoice) {
            window.open(order.urlInvoice, '_blank');
          } else {
            toast.error("Invoice belum diterbitkan untuk pesanan ini.");
          }
        }} className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-[#F5BC00] hover:text-[#F5BC00] text-gray-700 font-bold py-2.5 px-5 rounded-xl transition-colors shrink-0">
          <Download className="w-4 h-4" /> Download Invoice
        </button>
      </div>

      <ProgressBar currentStep={3} />

      <div className="bg-white rounded-3xl p-8 shadow-sm border-l-4 border-[#F5BC00] mb-6 relative">
        <div className="absolute top-8 right-8 bg-[#F5BC00] text-white text-[10px] font-bold px-3 py-1 rounded uppercase">
          MANIFEST ID: #{order?.orderNumber || "LOG-DEMO"}
        </div>

        <h3 className="text-xs font-bold text-gray-400 tracking-widest mb-6">INFORMASI PELANGGAN</h3>
        <div className="grid grid-cols-2 gap-8 mb-10 border-b border-gray-100 pb-10">
          <div>
            <p className="text-[10px] font-bold text-gray-500 mb-1 tracking-wider uppercase">Nama Pengirim / Gudang</p>
            <p className="text-lg font-bold text-gray-900 mb-4">{order?.namaPengirim}</p>
            <p className="text-[10px] font-bold text-gray-500 mb-1 tracking-wider uppercase">PIC Pengirim</p>
            <p className="font-bold text-gray-900 mb-4">{order?.picPengirim}</p>
            <p className="text-[10px] font-bold text-gray-500 mb-1 tracking-wider uppercase">Nomor Telepon Pengirim</p>
            <p className="font-bold text-gray-900">{order?.nomorTeleponPengirim}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-500 mb-1 tracking-wider uppercase">Nama Penerima / Gudang</p>
            <p className="text-lg font-bold text-gray-900 mb-4">{order?.namaPenerima}</p>
            <p className="text-[10px] font-bold text-gray-500 mb-1 tracking-wider uppercase">PIC Penerima</p>
            <p className="font-bold text-gray-900 mb-4">{order?.picPenerima}</p>
            <p className="text-[10px] font-bold text-gray-500 mb-1 tracking-wider uppercase">Nomor Telepon Penerima</p>
            <p className="font-bold text-gray-900">{order?.nomorTeleponPenerima}</p>
          </div>
        </div>

        <h3 className="text-xs font-bold text-gray-400 tracking-widest mb-4">INFORMASI MUATAN</h3>
        <h2 className="text-xl font-bold text-gray-900 mb-6">{order?.jenisPaket}</h2>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#F8F9FA] p-5 rounded-2xl">
            <p className="text-[10px] font-bold text-gray-500 mb-1 tracking-wider">TOTAL BERAT</p>
            <p className="text-xl font-bold text-gray-900">{order?.totalBerat} <span className="text-sm font-normal">KG</span></p>
          </div>
          <div className="bg-[#F8F9FA] p-5 rounded-2xl">
            <p className="text-[10px] font-bold text-gray-500 mb-1 tracking-wider">JENIS PAKET</p>
            <p className="text-xl font-bold text-gray-900">{order?.jenisPaket}</p>
          </div>
          <div className="bg-[#F8F9FA] p-5 rounded-2xl">
            <p className="text-[10px] font-bold text-gray-500 mb-1 tracking-wider">TOTAL PAKET</p>
            <p className="text-xl font-bold text-gray-900">{order?.totalPaket} <span className="text-sm font-normal">PAKET</span></p>
          </div>
        </div>

        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-gray-200 rounded-xl overflow-hidden shrink-0">
            <img src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop" alt="Truck" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{order?.jenisKendaraan}</h3>
            <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <span className="w-3 h-3 bg-[#F5BC00] inline-block rounded-sm"></span> Kapasitas: <span className="font-bold text-gray-900">{order?.kapasitas} Kg</span>
            </p>
          </div>
        </div>

        <div className="bg-[#F8F9FA] rounded-2xl p-6">
          <h3 className="text-[13px] font-bold text-gray-600 tracking-widest mb-6 uppercase">RUTE PENGIRIMAN</h3>
          <div className="relative pl-8">
            <div className="absolute left-[9px] top-4 bottom-6 w-[2px] border-l-[2px] border-dashed border-gray-300"></div>
            <div className="mb-8 relative">
              <div className="absolute -left-[32px] top-1 w-5 h-5 bg-white border-[3px] border-[#F5BC00] rounded-full flex items-center justify-center z-10">
                <div className="w-1.5 h-1.5 bg-[#F5BC00] rounded-full"></div>
              </div>
              <p className="text-[10px] font-bold text-[#F5BC00] mb-1 tracking-wider uppercase">TITIK MUAT</p>
              <h4 className="text-sm font-bold text-gray-900 mb-0.5">{order?.alamatAsal}</h4>
            </div>
            <div className="relative">
              <div className="absolute -left-[34px] top-1 w-6 h-6 bg-[#F5BC00] text-white flex items-center justify-center rounded-full z-10">
                <MapPin className="w-3.5 h-3.5 text-white" fill="white" strokeWidth={2} />
              </div>
              <p className="text-[10px] font-bold text-[#F5BC00] mb-1 tracking-wider uppercase">TITIK BONGKAR</p>
              <h4 className="text-sm font-bold text-gray-900 mb-0.5">{order?.alamatTujuan}</h4>
            </div>
          </div>
        </div>

        {order?.ulasan && (
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 tracking-widest mb-4 uppercase">Ulasan Anda</h3>
            <div className="bg-[#FAFAFA] border border-gray-100 rounded-xl p-6 relative">
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className={`w-5 h-5 ${star <= order.ulasan.rating ? 'text-[#FFA000] fill-[#FFA000]' : 'text-gray-300'}`} />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">{order.ulasan.komentar}</p>

              {order.ulasan.balasan && (
                <div className="bg-[#F8F9FB] rounded-xl p-4 mt-4 border-l-4 border-blue-500">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    <span className="font-bold text-gray-900 text-sm">Balasan Admin SiLogis</span>
                  </div>
                  <p className="text-sm text-gray-600">{order.ulasan.balasan}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('loading');
  const location = useLocation();

  const fetchUserOrders = async () => {
    setOrdersLoading(true);
    try {
      const token = localStorage.getItem('mpl_token');
      if (!token) {
        setActiveMenu('buat_pesanan');
        return;
      }

      const response = await api.get('/order/view', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      let ulasanOrderIds = [];
      try {
        const ulasanRes = await api.get('/view/ulasan', { headers: { 'Authorization': `Bearer ${token}` } });
        const ulasanData = ulasanRes.data?.data || [];
        ulasanOrderIds = ulasanData.map(u => u.id); // Karena Ulasan ID = Order ID (MapsId)
      } catch (e) {
        console.error("Gagal mengambil data ulasan", e);
      }

      const resData = response.data?.data;

      const enrichOrder = (o) => ({
        ...o,
        ulasanExist: Boolean(o.ulasan) || ulasanOrderIds.includes(o.id)
      });

      if (Array.isArray(resData)) {
        // Enrik dan Urutkan Descending, prioritaskan yang bukan PENDING
        const enriched = resData.map(enrichOrder).sort((a, b) => {
          if (a.status !== "PENDING" && b.status === "PENDING") return -1;
          if (a.status === "PENDING" && b.status !== "PENDING") return 1;
          return b.id - a.id;
        });
        
        // HAPUS DUPLIKAT SPAM (Identik pada menit yang sama)
        const seen = new Set();
        const deduplicated = [];
        for (const o of enriched) {
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
        setOrders([enrichOrder(resData)]);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Gagal memuat list order manifest:", err);
      toast.error("Gagal mengambil data pesanan dari server");
      setOrders([]);
    } finally {
      setOrdersLoading(false);
      const targetMenu = location.state?.action === 'buat_pesanan' ? 'buat_pesanan' : 'berlangsung';
      setActiveMenu(targetMenu);
      
      // Clear state so it doesn't stay 'buat_pesanan' if we navigate back internally
      if (location.state?.action === 'buat_pesanan') {
        window.history.replaceState({}, document.title)
      }
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  if (activeMenu === 'loading' || ordersLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#F9FAFB]">
        <div className="w-8 h-8 border-4 border-[#F5BC00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const localReviewed = JSON.parse(localStorage.getItem('reviewedOrders') || '[]');

  // Filter Kategori Tab Berlangsung (Kecuali yang sudah ada ulasan)
  const activeManifestOrders = orders.filter(o => {
    const hasUlasan = Boolean(o.ulasanExist) || localReviewed.includes(o.id);
    const isCompletedStatus = o?.status === "DONE" || o?.status === "SELESAI" || o?.status === "COMPLETED" || o?.status === "Tiba di Tujuan" || o?.status === "ARRIVED";
    
    if (isCompletedStatus) {
      // Jika status pesanan sudah selesai/tiba, TAHAN di pesanan berlangsung jika belum ada ulasan
      return !hasUlasan;
    }
    // Jika belum selesai (Masih pending/ongoing), selalu tampil di pesanan berlangsung
    return true;
  });

  // Filter Kategori Tab History (Hanya yang sudah selesai DAN sudah diulas)
  const historyOrders = orders.filter(o => {
    const hasUlasan = Boolean(o.ulasanExist) || localReviewed.includes(o.id);
    const isCompletedStatus = o?.status === "DONE" || o?.status === "SELESAI" || o?.status === "COMPLETED" || o?.status === "Tiba di Tujuan" || o?.status === "ARRIVED";
    
    // Hanya masuk history jika sudah selesai DAN sudah diulas
    return isCompletedStatus && hasUlasan;
  });

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F5F7F9] flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');
        h1, h2, h3, h4, h5, h6 { font-family: 'Manrope', sans-serif !important; }
      `}</style>

      {activeMenu === 'buat_pesanan' ? (
        <main className="flex-1 w-full">
          <Pesanan
            onComplete={() => window.location.reload()}
            onBack={() => setActiveMenu('berlangsung')}
          />
        </main>
      ) : (
        <div className="flex flex-1 mx-auto w-full animate-in fade-in duration-700">
          {/* Sidebar Navigasi */}
          <aside className="w-80 bg-[#F9FAFB] border-r border-gray-200 hidden md:flex flex-col shrink-0 z-10 pt-4">
            <div className="p-8 pb-8">
              <h2 className="text-[28px] leading-tight font-bold text-gray-900 mb-2 font-['Manrope',_sans-serif]">Order Manifest</h2>
              <p className="text-[13px] font-medium text-gray-500 uppercase tracking-wide">Step-by-step logistics entry</p>
            </div>

            <nav className="flex flex-col gap-2 pr-6">
              <button
                onClick={() => {
                  setActiveMenu('berlangsung');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-5 w-full py-5 pl-8 pr-4 text-[15px] font-bold transition-all uppercase tracking-wide ${activeMenu === 'berlangsung'
                  ? 'bg-white text-[#F5BC00] shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-r-2xl border-l-[8px] border-[#F5BC00]'
                  : 'text-gray-400 hover:text-gray-600 border-l-[8px] border-transparent'
                  }`}
              >
                <Archive className="w-7 h-7" strokeWidth={2} /> PESANAN BERLANGSUNG ({activeManifestOrders.length})
              </button>

              <button
                onClick={() => {
                  setActiveMenu('history');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-5 w-full py-5 pl-8 pr-4 text-[15px] font-bold transition-all uppercase tracking-wide ${activeMenu === 'history'
                  ? 'bg-white text-[#F5BC00] shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-r-2xl border-l-[8px] border-[#F5BC00]'
                  : 'text-gray-400 hover:text-gray-600 border-l-[8px] border-transparent'
                  }`}
              >
                <ClipboardList className="w-7 h-7" strokeWidth={2} /> HISTORY PESANAN ({historyOrders.length})
              </button>

              <div className="mt-8 px-8">
                <button
                  onClick={() => setActiveMenu('buat_pesanan')}
                  className="w-full flex items-center justify-center gap-2 bg-[#F5BC00] hover:bg-[#E5A900] text-white font-bold py-3 rounded-xl transition-colors shadow-md"
                >
                  <PlusCircle className="w-5 h-5" /> BUAT PESANAN BARU
                </button>
              </div>
            </nav>
          </aside>

          {/* Panel Konten Dinamis */}
          <main className="flex-1 bg-[#F5F7F9]">
            {activeMenu === 'berlangsung' && (
              <div className="p-8">
                <PesananBerlangsungList
                  orders={activeManifestOrders}
                  onReviewComplete={fetchUserOrders}
                  initialSelectedOrderId={location.state?.selectedOrderId}
                />
              </div>
            )}
            {activeMenu === 'history' && (
              <div className="p-8">
                <HistoryPesananList orders={historyOrders} />
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}