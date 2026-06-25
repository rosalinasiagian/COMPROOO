import React, { useState, useEffect } from 'react';
import { Star, Trash2, Reply, Loader2 } from 'lucide-react';
import { api } from "../lib/api.js";
import { toast } from "sonner";

export default function Ulasan() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // ── 1. GET DATA ULASAN DARI BACKEND ──
  const fetchReviews = async () => {
    try {
      const response = await api.get("/user/admin/view/ulasan");
      const data = response.data?.data || response.data;

      if (Array.isArray(data)) {
        setReviews(data);
      } else if (data?.content && Array.isArray(data.content)) {
        // Handle jika backend menggunakan Pageable / Pagination
        setReviews(data.content);
      }
    } catch (err) {
      console.error("Gagal mengambil daftar ulasan:", err);
      toast.error("Gagal memuat ulasan dari server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // ── 2. HAPUS ULASAN (DELETE BY ID) ──
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus ulasan ini?')) {
      try {
        await api.delete(`/user/admin/delete/ulasan/${id}`);
        setReviews(reviews.filter(r => r.id !== id));
        toast.success("Ulasan berhasil dihapus");
      } catch (err) {
        console.error("Gagal menghapus ulasan:", err);
        toast.error(err.response?.data?.errors || "Gagal menghapus ulasan");
      }
    }
  };

  const handleReplyClick = (id) => {
    setReplyingId(id);
    const review = reviews.find(r => r.id === id);
    setReplyText(review.balasan || review.reply || '');
  };

  // ── 3. SIMPAN/KIRIM BALASAN (POST BY ID) ──
  const handleSaveReply = async (id) => {
    if (!replyText.trim()) {
      toast.error("Balasan tidak boleh kosong");
      return;
    }

    setActionLoading(true);
    try {
      // Backend menerima payload balasan (bisa berupa teks mentah atau objek, sesuaikan dengan RequestBody)
      // Di sini kita kirim data objek text / request parameter sesuai standarmu
      await api.post(`/user/admin/reply/ulasan/${id}`, {
        balasan: replyText
      });

      // Update state secara lokal agar UI sinkron instan
      setReviews(reviews.map(r => r.id === id ? { ...r, balasan: replyText } : r));
      setReplyingId(null);
      setReplyText('');
      toast.success("Balasan ulasan berhasil disimpan");
    } catch (err) {
      console.error("Gagal membalas ulasan:", err);
      toast.error(err.response?.data?.errors || "Gagal menyimpan balasan");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FFA000] mb-2" />
        <p className="text-sm text-gray-500">Memuat daftar ulasan pelanggan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manajemen Ulasan</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Daftar Ulasan Pelanggan</h2>
        </div>

        <div className="p-6 space-y-6">
          {reviews.length === 0 ? (
            <p className="text-center text-gray-500 py-10">Belum ada ulasan dari pelanggan.</p>
          ) : (
            reviews.map(review => {
              // Menyelaraskan penamaan variabel jika backend mengembalikan nama field berbeda
              const namaUser = review?.user?.username || review.name || review.username || "Pelanggan Anonim";
              const jabatanUser = review?.user?.role || review.role || review.jabatan || "Pengguna Jasa";
              const isiUlasan = review.text || review.isiUlasan || review.komentar;
              const tanggalUlasan = review.date || review.createdAt || review.tanggal || "Baru saja";
              const jumlahBintang = review.stars || review.rating || 5;
              const balasan = review.reply || review.balasan;

              return (
                <div key={review.id} className="border border-gray-100 rounded-xl p-6 relative bg-[#FAFAFA]">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{namaUser}</h3>
                      <p className="text-xs text-gray-500">{jabatanUser} • {tanggalUlasan}</p>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className={`w-5 h-5 ${star <= jumlahBintang ? 'text-[#FFA000] fill-[#FFA000]' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-6 leading-relaxed">{isiUlasan}</p>

                  {/* Tampilan Box Balasan Admin */}
                  {balasan && replyingId !== review.id && (
                    <div className="bg-white border-l-4 border-[#FFA000] p-4 rounded-r-xl mb-4 ml-4 shadow-sm">
                      <p className="text-xs font-bold text-gray-500 mb-1">Balasan Anda:</p>
                      <p className="text-sm text-gray-800">{balasan}</p>
                    </div>
                  )}

                  {/* Form Input Balasan / Edit Balasan */}
                  {replyingId === review.id ? (
                    <div className="space-y-3 mb-4 mt-4 ml-4 bg-white p-4 rounded border border-gray-200 shadow-sm">
                      <label className="text-xs font-bold text-gray-500 block">Balas Ulasan</label>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Tulis kalimat balasan resmi dari manajemen perusahaan..."
                        className="w-full border border-gray-200 rounded p-3 text-sm focus:outline-none focus:border-[#FFA000] resize-none"
                        rows="3"
                        disabled={actionLoading}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveReply(review.id)}
                          disabled={actionLoading}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-bold transition-colors disabled:opacity-50"
                        >
                          {actionLoading ? "Menyimpan..." : "Simpan Balasan"}
                        </button>
                        <button
                          onClick={() => setReplyingId(null)}
                          disabled={actionLoading}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-bold transition-colors"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {/* Tombol Aksi Kendali Balas & Hapus */}
                  {replyingId !== review.id && (
                    <div className="flex items-center gap-4 pt-4 mt-4 border-t border-gray-200/60">
                      <button onClick={() => handleReplyClick(review.id)} className="flex items-center gap-1.5 text-xs font-bold text-green-600 hover:text-green-700 transition-colors">
                        <Reply className="w-4 h-4" /> {balasan ? "Edit Balasan" : "Balas"}
                      </button>
                      <button onClick={() => handleDelete(review.id)} className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition-colors">
                        <Trash2 className="w-4 h-4" /> Hapus
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}