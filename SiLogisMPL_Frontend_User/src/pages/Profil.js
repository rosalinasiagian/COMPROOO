import React, { useState, useRef, useEffect } from 'react';
import {
  Package, CheckCircle2, Star, Edit, MapPin,
  Upload, Info, TrendingUp, Check, X, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

const Profil = () => {
  const { user, setUser } = useAuth();
  const [profileImg, setProfileImg] = useState(null);
  const fileInputRef = useRef(null);

  // State untuk data formulir (Diselaraskan dengan model gambar backend kamu)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    noTelepon: '',
    perusahaan: '',
    jabatan: '',
    npwpPerusahaan: '',
    industri: '',
    // Properti alamat dipecah lokal untuk kebutuhan input field form
    alamat: '',
    kota: '',
    provinsi: '',
    kodePos: ''
  });

  // State menampung data statistik riwayat dari database
  const [stats, setStats] = useState({
    totalPesanan: 0,
    berhasilTerkirim: 0,
    successRate: '0%',
    tahunGabung: '2026'
  });

  const [pageLoading, setPageLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Pemisahan inisial nama untuk avatar fallback
  const nameParts = (formData.username || user?.name || 'MPL').trim().split(' ');
  const initials = (nameParts[0]?.[0] || '') + (nameParts[1]?.[0] || '');

  // ── 1. LOAD DATA PROFIL & HISTORI ORDER DARI BACKEND ──
  useEffect(() => {
    const fetchCompleteProfileData = async () => {
      setPageLoading(true);
      try {
        const token = localStorage.getItem('mpl_token');
        if (!token) return;

        // Ambil Data Profil User
        const profileRes = await api.get('/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const profileData = profileRes.data?.data || profileRes.data;

        // Ambil Data Orders untuk kalkulasi statistik ril (Gambar 1)
        const ordersRes = await api.get('/order/view', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const ordersData = ordersRes.data?.data || [];

        if (profileData) {
          // Ekstrak objek alamat pertama dari List<Map<String, String>> Alamat
          const alamatList = profileData.Alamat || profileData.userProfile?.Alamat || [];
          const alamatUtama = Array.isArray(alamatList) && alamatList.length > 0 ? alamatList[0] : {};

          setFormData({
            username: profileData.username || profileData.name || '',
            email: profileData.email || '',
            noTelepon: profileData.noTelepon || profileData.userProfile?.noTelepon || '',
            perusahaan: profileData.perusahaan || profileData.userProfile?.perusahaan || '',
            jabatan: profileData.jabatan || profileData.userProfile?.jabatan || '',
            npwpPerusahaan: profileData.npwpPerusahaan || profileData.userProfile?.npwpPerusahaan || '',
            industri: profileData.industri || profileData.userProfile?.industri || '',
            alamat: alamatUtama.alamat || '',
            kota: alamatUtama.kota || '',
            provinsi: alamatUtama.provinsi || '',
            kodePos: alamatUtama.kodePos || ''
          });

          if (profileData.userProfile?.urlProfilePicture) {
            setProfileImg(profileData.userProfile.urlProfilePicture);
          }
        }

        // Kalkulasi data statistik dinamis (Menjawab gambar 1)
        if (Array.isArray(ordersData) && ordersData.length > 0) {
          // HAPUS DUPLIKAT SPAM LINTAS STATUS
          const sortedOrders = [...ordersData].sort((a, b) => {
            if (a.status !== "PENDING" && b.status === "PENDING") return -1;
            if (a.status === "PENDING" && b.status !== "PENDING") return 1;
            return b.id - a.id;
          });
          
          const seen = new Set();
          const deduplicatedOrders = [];
          for (const o of sortedOrders) {
            const parts = (o.orderNumber || "").split("-");
            const datePart = parts[1] || "";
            const timeMinute = parts[2] ? parts[2].substring(0, 4) : ""; // HHMM
            const fingerprint = `${o.namaPengirim}|${o.namaPenerima}|${o.totalBerat}|${o.jenisKendaraan}|${datePart}|${timeMinute}`;
            
            if (!seen.has(fingerprint)) {
              seen.add(fingerprint);
              deduplicatedOrders.push(o);
            }
          }

          const total = deduplicatedOrders.length;
          const sukses = deduplicatedOrders.filter(o => o.status === 'DONE' || o.status === 'COMPLETED' || o.status === 'SELESAI' || o.statusPengiriman === 'Tiba-di-Tujuan').length;
          const rate = total > 0 ? ((sukses / total) * 100).toFixed(1) + '%' : '0%';

          setStats({
            totalPesanan: total,
            berhasilTerkirim: sukses,
            successRate: rate,
            tahunGabung: '2026' // Bisa disesuaikan dengan field createdAt user jika ada
          });
        }

      } catch (err) {
        console.error("Gagal sinkronisasi data profil:", err);
        toast.error("Gagal memuat profil terintegrasi");
      } finally {
        setPageLoading(false);
      }
    };

    fetchCompleteProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setProfileImg(reader.result);
      reader.readAsDataURL(file);

      const token = localStorage.getItem('mpl_token');
      const uploadPayload = new FormData();
      uploadPayload.append('file', file);

      try {
        await api.post('/user/edit/profilepicture', uploadPayload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Foto profil berhasil divalidasi');
      } catch (err) {
        toast.error('Gagal menyimpan foto ke server');
      }
    }
  };

  // ── 2. SAVE PERUBAHAN DATA (SESUAI STRUKTUR GAMBAR 2) ──
  const saveProfileChanges = async () => {
    try {
      const token = localStorage.getItem('mpl_token');

      // Membangun payload beraliansi List<Map<String, String>> Alamat
      const payload = {
        username: formData.username,
        email: formData.email,
        noTelepon: formData.noTelepon,
        perusahaan: formData.perusahaan,
        jabatan: formData.jabatan,
        npwpPerusahaan: formData.npwpPerusahaan,
        industri: formData.industri,
        // Alamat dibungkus ke dalam format array list map sesuai kemauan backend Java kamu
        Alamat: [
          {
            alamat: formData.alamat,
            kota: formData.kota,
            provinsi: formData.provinsi,
            kodePos: formData.kodePos
          }
        ]
      };

      await api.patch('/user/edit/profile', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (setUser) {
        setUser(prev => ({ ...prev, name: formData.username }));
      }

      setIsEditing(false);
      toast.success('Pembaruan data manifest profil berhasil disimpan');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.errors || 'Gagal menyimpan perubahan');
    }
  };

  const renderField = (label, name, value, isFieldEditing, colSpan = 1) => (
    <div className={colSpan === 4 ? "md:col-span-4" : colSpan === 2 ? "md:col-span-2" : "md:col-span-1"}>
      <label className="block text-xs font-semibold text-gray-500 mb-2">{label}</label>
      {isFieldEditing ? (
        <input
          type="text"
          name={name}
          value={value || ''}
          onChange={handleInputChange}
          className="w-full bg-white text-gray-900 text-sm p-3.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#F5BC00] transition-colors shadow-sm"
        />
      ) : (
        <div className="w-full bg-[#F5F5F0] text-gray-700 text-sm p-3.5 rounded-lg border border-transparent min-h-[50px] flex items-center">
          {value || <span className="text-gray-400 italic">Belum diisi</span>}
        </div>
      )}
    </div>
  );

  if (pageLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAFB]">
        <Loader2 className="w-8 h-8 animate-spin text-[#F5BC00] mb-2" />
        <p className="text-sm text-gray-500 font-medium">Menyinkronkan ekosistem profil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F9FAFB] pb-12 font-['Inter',_sans-serif] pt-20">

      {/* Header Title */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 font-['Manrope',_sans-serif] tracking-tight">
          Profil Saya
        </h1>
        <p className="text-sm text-gray-500 mt-1.5 font-medium">
          Pantau statistik aktivitas dan kelola informasi personal Anda.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* ── CARD STATISTIK DARI GAMBAR 1 (SUDAH DINAMIS) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 border-t-4 border-t-[#F5BC00]">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-[#F5BC00] mb-4">
              <Package size={20} />
            </div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Total Pesanan</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900 font-['Manrope',_sans-serif]">{stats.totalPesanan}</span>
              <span className="text-sm text-gray-500 mb-1">pesanan</span>
            </div>
            <p className="text-xs font-semibold text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp size={16} strokeWidth={3} /> Aktivitas Berjalan
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 border-t-4 border-t-[#F5BC00]">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-[#F5BC00] mb-4">
              <CheckCircle2 size={20} />
            </div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Berhasil Terkirim</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900 font-['Manrope',_sans-serif]">{stats.berhasilTerkirim}</span>
              <span className="text-sm text-gray-500 mb-1">kiriman</span>
            </div>
            <p className="text-xs font-semibold text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp size={16} strokeWidth={3} /> {stats.successRate} success rate
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 border-t-4 border-t-[#F5BC00]">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-[#F5BC00] mb-4">
              <Star size={20} />
            </div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Bergabung Sejak</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900 font-['Manrope',_sans-serif]">{stats.tahunGabung}</span>
            </div>
            <p className="text-xs font-semibold text-gray-500 mt-2">
              Mitra Resmi Mandiri Perkasa
            </p>
          </div>
        </div>

        {/* Profile Identity Card */}
        <div className="bg-[#F6F5EE] rounded-xl p-8 border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-[#F5BC00] flex items-center justify-center text-white text-3xl font-bold overflow-hidden shadow-md border-4 border-white">
                {profileImg ? <img src={profileImg} alt="Profile" className="w-full h-full object-cover" /> : initials.toUpperCase()}
              </div>
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-[#F6F5EE] rounded-full"></div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 font-['Manrope',_sans-serif] mb-1">
                {formData.username}
              </h2>
              <p className="text-sm text-gray-600 font-medium">{formData.jabatan || 'Mitra'} • {formData.perusahaan || 'Mandiri Perkasa'}</p>
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/jpeg, image/png" className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors mb-2">
              <Upload size={16} /> Ganti Foto
            </button>
            <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">JPG, PNG maks 2MB</p>
          </div>
        </div>

        {/* ── SEKSI INPUT DATA (SESUAI VARIABEL GAMBAR 2) ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="flex items-center gap-2 font-bold text-gray-900 font-['Manrope',_sans-serif]">
              <Info className="text-gray-400" size={20} /> Informasi Pribadi & Perusahaan
            </h3>
            
            {isEditing ? (
              <div className="flex items-center gap-2">
                <button onClick={() => setIsEditing(false)} className="flex items-center gap-1 bg-white border border-gray-300 text-gray-600 text-xs font-bold py-1.5 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <X size={14} /> Batal
                </button>
                <button onClick={saveProfileChanges} className="flex items-center gap-1 bg-[#F5BC00] hover:bg-[#e0a800] transition-colors text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-sm">
                  <Check size={14} /> Simpan Semua Perubahan
                </button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-[#F5BC00] hover:bg-[#e0a800] transition-colors text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-sm">
                <Edit size={14} /> Edit Profil & Alamat
              </button>
            )}
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {renderField('Nama Pengguna / Lengkap', 'username', formData.username, isEditing)}
              {renderField('No. HP / WhatsApp', 'noTelepon', formData.noTelepon, isEditing)}
              {renderField('Email Akun', 'email', formData.email, false)}
              {renderField('Nama Perusahaan', 'perusahaan', formData.perusahaan, isEditing)}
              {renderField('Jabatan / Posisi', 'jabatan', formData.jabatan, isEditing)}
              {renderField('NPWP Perusahaan', 'npwpPerusahaan', formData.npwpPerusahaan, isEditing)}
              {renderField('Sektor Industri', 'industri', formData.industri, isEditing)}
            </div>
          </div>
        </div>

        {/* Seksi Alamat (Map List Matching) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="p-6 border-b border-gray-100">
            <h3 className="flex items-center gap-2 font-bold text-gray-900 font-['Manrope',_sans-serif]">
              <MapPin className="text-gray-400" size={20} /> Alamat Pengiriman Distribusi
            </h3>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-6">
              {renderField('Alamat Operasional Lengkap', 'alamat', formData.alamat, isEditing, 4)}
              {renderField('Kota / Kabupaten', 'kota', formData.kota, isEditing, 2)}
              {renderField('Provinsi', 'provinsi', formData.provinsi, isEditing, 1)}
              {renderField('Kode Pos', 'kodePos', formData.kodePos, isEditing, 1)}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profil;