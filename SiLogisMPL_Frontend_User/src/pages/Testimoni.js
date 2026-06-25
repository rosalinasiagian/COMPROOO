import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimoni = () => {
  const testimonials = [
    {
      name: 'Budi Santoso',
      company: 'PT. Maju Jaya',
      position: 'CEO',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 5,
      text: 'Mandiri Perkasa sangat profesional dalam menangani pengiriman kami. Barang selalu sampai tepat waktu dan dalam kondisi sempurna. Highly recommended!',
    },
    {
      name: 'Siti Nurhaliza',
      company: 'CV. Sejahtera Abadi',
      position: 'Operations Manager',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 5,
      text: 'Tracking system yang real-time sangat membantu kami dalam monitoring pengiriman. Tim customer service juga sangat responsif dan helpful.',
    },
    {
      name: 'Ahmad Wijaya',
      company: 'UD. Berkah Logistik',
      position: 'Owner',
      image: 'https://randomuser.me/api/portraits/men/46.jpg',
      rating: 5,
      text: 'Sudah 3 tahun menggunakan jasa Mandiri Perkasa dan tidak pernah kecewa. Armada yang lengkap dan harga yang kompetitif.',
    },
    {
      name: 'Linda Kusuma',
      company: 'PT. GlobalIndo',
      position: 'Logistics Director',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      rating: 5,
      text: 'Pelayanan yang memuaskan dari awal hingga akhir. Proses claim asuransi juga sangat mudah dan cepat. Partner terpercaya untuk bisnis kami.',
    },
    {
      name: 'Hendra Gunawan',
      company: 'Toko Elektronik Jaya',
      position: 'Owner',
      image: 'https://randomuser.me/api/portraits/men/52.jpg',
      rating: 4,
      text: 'Pengiriman cepat dan aman. Packaging juga rapi sehingga barang elektronik kami terlindungi dengan baik. Terima kasih Mandiri Perkasa!',
    },
    {
      name: 'Dewi Anggraini',
      company: 'PT. Cahaya Mandiri',
      position: 'Supply Chain Manager',
      image: 'https://randomuser.me/api/portraits/women/72.jpg',
      rating: 5,
      text: 'Sistem warehousing yang modern dan rapi. Inventory management yang akurat membantu efisiensi operasional kami. Sangat puas!',
    },
  ];

  const stats = [
    { number: '5000+', label: 'Klien Puas' },
    { number: '98%', label: 'Rating Kepuasan' },
    { number: '50K+', label: 'Pengiriman Sukses' },
    { number: '4.9/5', label: 'Review Score' },
  ];

  return (
    <div className="min-h-screen bg-gray-50" data-testid="testimoni-page">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0A2647] to-[#144272] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 font-['Manrope',_sans-serif]" data-testid="testimoni-title">
            Testimoni Klien
          </h1>
          <p className="text-lg text-gray-200 max-w-3xl mx-auto font-['Inter',_sans-serif]">
            Kepercayaan klien adalah prioritas utama kami. Lihat apa kata mereka tentang layanan kami.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center" data-testid={`stat-${index}`}>
                <div className="text-4xl font-bold text-[#F5BC00] mb-2 font-['Manrope',_sans-serif]">{stat.number}</div>
                <div className="text-gray-600 font-['Inter',_sans-serif]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
                data-testid={`testimonial-${index}`}
              >
                <div className="flex items-center mb-6">
                  <Quote className="h-8 w-8 text-[#F5BC00] opacity-50" />
                </div>
                
                {/* Rating */}
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating
                          ? 'text-[#F5BC00] fill-[#F5BC00]'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 mb-6 italic font-['Inter',_sans-serif]">"{testimonial.text}"</p>

                {/* Author Info */}
                <div className="flex items-center pt-6 border-t border-gray-200">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-[#0A2647] font-['Manrope',_sans-serif]">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 font-['Inter',_sans-serif]">{testimonial.position}</p>
                    <p className="text-sm text-gray-500 font-['Inter',_sans-serif]">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#0A2647] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-['Manrope',_sans-serif]">
            Bergabunglah dengan Ribuan Klien Puas Kami
          </h2>
          <p className="text-lg text-gray-200 mb-8 font-['Inter',_sans-serif]">
            Dapatkan pengalaman layanan logistik terbaik untuk bisnis Anda
          </p>
          <button
            onClick={() => window.location.href = '/pesanan#form-penawaran'}
            className="px-10 py-4 bg-[#F5BC00] text-[#0A2647] text-lg font-bold hover:bg-[#F5BC00] transition-colors shadow-lg font-['Manrope',_sans-serif]"
            data-testid="cta-quote-button"
          >
            Minta Penawaran
          </button>
        </div>
      </section>
    </div>
  );
};

export default Testimoni;