import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';
import { MapPin, MessageSquare, Mail, ArrowRight, Clock, ShieldCheck, Send } from 'lucide-react';

const HubungiKami = () => {
  const formRef = useRef();
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  // ⚙️ GANTI nilai-nilai ini setelah daftar EmailJS
  const EMAILJS_SERVICE_ID  = 'service_nh4xf73';   // dari EmailJS > Email Services
  const EMAILJS_TEMPLATE_ID = 'template_r58fq8b';  // dari EmailJS > Email Templates
  const EMAILJS_PUBLIC_KEY  = 'UUYrIn7jMh3K5Lx0M';   // dari EmailJS > Account > General

  const handleSend = (e) => {
    e.preventDefault();
    setStatus('sending');
    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formRef.current, EMAILJS_PUBLIC_KEY)
      .then(() => {
        setStatus('idle');
        toast.success('Pesan berhasil dikirim! Kami akan menghubungi Anda dalam 1x24 jam.');
        formRef.current.reset();
      })
      .catch(() => {
        setStatus('idle');
        toast.error('Gagal mengirim pesan. Silakan coba lagi.');
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold font-['Manrope',_sans-serif] text-gray-900 mb-2">
              Hubungi Tim
            </h1>
            <h1 className="text-4xl sm:text-5xl font-bold font-['Manrope',_sans-serif] text-[#F5BC00] mb-6">
              Ekspert Kami
            </h1>
            <p className="font-['Inter',_sans-serif] text-gray-600 mb-8 max-w-lg">
              Kami siap membantu mengoptimalkan rantai pasokan Anda. Dari
              pertanyaan teknis hingga kemitraan strategis, mari bicarakan solusi
              logistik Anda hari ini.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 bg-[#F5BC00] hover:bg-[#F5BC00] text-white font-['Manrope',_sans-serif] font-medium py-3 px-6 rounded-md transition-colors"
              >
                Mulai Kirim Sekarang <ArrowRight size={18} />
              </button>

            </div>
          </div>
          
          <div className="relative">
            {/* Placeholder untuk gambar truk sesuai desain */}
            <img 
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070" 
              alt="Armada Logistik" 
              className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
            />
            {/* Badge Kuning */}
            <div className="absolute -bottom-6 -left-6 bg-[#F5BC00] text-white p-6 rounded-xl shadow-xl w-48 font-['Manrope',_sans-serif]">
              <h3 className="text-3xl font-bold mb-1">100%</h3>
              <p className="font-['Inter',_sans-serif] text-sm font-medium">AMAN & TERJAMIN</p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Alamat */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-[#F5BC00] mb-6">
              <MapPin size={24} />
            </div>
            <h3 className="font-['Manrope',_sans-serif] text-lg font-bold text-gray-900 mb-3">Alamat Kantor</h3>
            <p className="font-['Inter',_sans-serif] text-gray-500 text-sm mb-6 min-h-[40px]">
              bds II Jln.nuri, Blk. J1 No.18, sungai nangka,<br />Kecamatan Balikpapan Selatan, Kota Balikpapan, Kalimantan Timur 76115
            </p>
            <a href="https://maps.app.goo.gl/1KCAvMMquMir8iEm7" target="_blank" rel="noreferrer" className="font-['Manrope',_sans-serif] text-[#F5BC00] text-sm font-medium flex items-center gap-1 hover:text-[#F5BC00]">
              Lihat di Peta <ArrowRight size={14} />
            </a>
          </div>

          {/* Card WhatsApp */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-[#F5BC00] mb-6">
              <MessageSquare size={24} />
            </div>
            <h3 className="font-['Manrope',_sans-serif] text-lg font-bold text-gray-900 mb-3">WhatsApp Kantor</h3>
            <p className="font-['Inter',_sans-serif] text-gray-500 text-sm mb-6 min-h-[40px]">
              Respon cepat untuk pertanyaan operasional dan armada.
            </p>
            <p className="font-['Inter',_sans-serif] font-bold text-gray-900">+62 811-4055-966</p>
          </div>

          {/* Card Email */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-[#F5BC00] mb-6">
              <Mail size={24} />
            </div>
            <h3 className="font-['Manrope',_sans-serif] text-lg font-bold text-gray-900 mb-3">Email Kantor</h3>
            <p className="font-['Inter',_sans-serif] text-gray-500 text-sm mb-6 min-h-[40px]">
              Kirimkan proposal atau dokumen resmi perusahaan Anda.
            </p>
            <p className="font-['Inter',_sans-serif] font-bold text-gray-900">cvmandiriperkasalogis@gmail.com</p>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="w-full h-[350px] bg-gray-200 relative overflow-hidden my-8 rounded-2xl mx-auto max-w-7xl shadow-sm border border-gray-100">
        <iframe
          src="https://maps.google.com/maps?q=-4.0412583,122.4623785+(AKSAR+GARAGE)&t=&z=17&ie=UTF8&iwloc=&output=embed"
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Lokasi Kami"
        ></iframe>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form Info */}
          <div>
            <h2 className="font-['Manrope',_sans-serif] text-3xl font-bold text-gray-900 mb-4">Kirim Pesan Langsung</h2>
            <p className="font-['Inter',_sans-serif] text-gray-600 mb-10">
              Gunakan formulir ini untuk konsultasi khusus mengenai kebutuhan logistik CV Mandiri Perkasa Logis. Tim admin kami akan merespon dalam 1x24 jam kerja.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-gray-700">
                <Clock className="text-[#F5BC00]" size={24} />
                <span className="font-['Inter',_sans-serif] font-medium">Senin - Jumat: 08:00 - 17:00</span>
              </div>
              <div className="flex items-center gap-4 text-gray-700">
                <ShieldCheck className="text-[#F5BC00]" size={24} />
                <span className="font-['Inter',_sans-serif] font-medium">Data Anda dienkripsi secara aman</span>
              </div>
            </div>
          </div>

          {/* The Form */}
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
            <form ref={formRef} onSubmit={handleSend} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-['Inter',_sans-serif] block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Nama Lengkap</label>
                  <input 
                    type="text"
                    name="from_name"
                    required
                    placeholder="John Doe" 
                    className="font-['Inter',_sans-serif] w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F5BC00] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="font-['Inter',_sans-serif] block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email Aktif</label>
                  <input 
                    type="email"
                    name="from_email"
                    required
                    placeholder="name@company.com" 
                    className="font-['Inter',_sans-serif] w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F5BC00] focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="font-['Inter',_sans-serif] block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Subjek</label>
                <input 
                  type="text"
                  name="subject"
                  required
                  placeholder="Penawaran Kerja Sama" 
                  className="font-['Inter',_sans-serif] w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F5BC00] focus:border-transparent"
                />
              </div>

              <div>
                <label className="font-['Inter',_sans-serif] block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pesan Anda</label>
                <textarea 
                  rows="4"
                  name="message"
                  required
                  placeholder="Tuliskan detail kebutuhan Anda..." 
                  className="font-['Inter',_sans-serif] w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F5BC00] focus:border-transparent resize-none"
                ></textarea>
              </div>



              <button 
                type="submit" 
                disabled={status === 'sending'}
                className="w-full flex items-center justify-center gap-2 bg-[#F5BC00] hover:opacity-90 disabled:opacity-60 text-white font-['Manrope',_sans-serif] font-medium py-3.5 px-6 rounded-lg transition-all"
              >
                {status === 'sending' ? 'Mengirim...' : (<>Kirim Pesan <Send size={20} /></>)}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HubungiKami;