import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Network, BarChart2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#111111', color: '#ffffff', fontFamily: 'sans-serif' }}>
      {/* Top accent bar */}
      <div style={{ height: '4px', backgroundColor: '#D4A017' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 40px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr 2fr', gap: '40px' }}>

          {/* Logo + Deskripsi */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                width: '48px', height: '48px',
                border: '2px solid #D4A017',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 'bold', color: '#D4A017', letterSpacing: '1px'
              }}>MPL</div>
              <span style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px', color: '#D4A017' }}>
                MANDIRI PERKASA
              </span>
            </div>
            <p style={{
              fontSize: '11px', letterSpacing: '1.5px', lineHeight: '1.8',
              color: '#888888', textTransform: 'uppercase', maxWidth: '280px'
            }}>
              MERINTIS PRESISI INDUSTRI DALAM RANTAI PASOK GLOBAL MELALUI TELEMETRI TINGKAT LANJUT DAN MANAJEMEN ARMADA.
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h4 style={{
              fontSize: '11px', letterSpacing: '4px', color: '#D4A017',
              marginBottom: '24px', fontWeight: 'bold'
            }}>NAVIGASI</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {['BERANDA', 'LAYANAN', 'ARMADA'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    style={{
                      fontSize: '11px', letterSpacing: '2px', color: '#888888',
                      textDecoration: 'none', transition: 'color 0.2s'
                    }}
                    onMouseEnter={e => e.target.style.color = '#D4A017'}
                    onMouseLeave={e => e.target.style.color = '#888888'}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hukum */}
          <div>
            <h4 style={{
              fontSize: '11px', letterSpacing: '4px', color: '#D4A017',
              marginBottom: '24px', fontWeight: 'bold'
            }}>HUKUM</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {['KEBIJAKAN PRIVASI', 'KETENTUAN LAYANAN', 'PELACAKAN KARGO', 'PORTAL MITRA'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    style={{
                      fontSize: '11px', letterSpacing: '2px', color: '#888888',
                      textDecoration: 'none', transition: 'color 0.2s'
                    }}
                    onMouseEnter={e => e.target.style.color = '#D4A017'}
                    onMouseLeave={e => e.target.style.color = '#888888'}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Operasional */}
          <div>
            <h4 style={{
              fontSize: '11px', letterSpacing: '4px', color: '#D4A017',
              marginBottom: '24px', fontWeight: 'bold'
            }}>OPERASIONAL</h4>
            <p style={{ fontSize: '11px', letterSpacing: '1.5px', color: '#888888', lineHeight: '1.8', marginBottom: '8px' }}>
              MARKAS BESAR: KOTA KENDARI, SULAWESI.
            </p>
            <p style={{ fontSize: '11px', letterSpacing: '1.5px', color: '#888888', lineHeight: '1.8', marginBottom: '24px' }}>
              ARMADA: 200+ UNIT TERINTEGRASI IOT.
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <Globe size={22} color="#D4A017" strokeWidth={1.5} />
              <Network size={22} color="#D4A017" strokeWidth={1.5} />
              <BarChart2 size={22} color="#D4A017" strokeWidth={1.5} />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid #2a2a2a',
        maxWidth: '1280px', margin: '0 auto',
        padding: '20px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <p style={{ fontSize: '10px', letterSpacing: '2px', color: '#555555' }}>
          © 2024 CV MANDIRI PERKASA LOGIS. HAK CIPTA DILINDUNGI UNDANG-UNDANG.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '2px', backgroundColor: '#D4A017' }} />
          <span style={{ fontSize: '10px', letterSpacing: '3px', color: '#D4A017', fontWeight: 'bold' }}>
            IRONCLAD STANDARD
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;