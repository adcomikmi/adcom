// src/pages/public/Tentang.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { getHomeConfig } from '../../services/api';
import {
  HiOutlineEye,
  HiOutlineUsers,
  HiOutlinePresentationChartLine,
  HiOutlineLightningBolt,
  HiOutlineCode,
} from 'react-icons/hi';

const ICON_MAP = {
  HiOutlineCode,
  HiOutlineUsers,
  HiOutlinePresentationChartLine,
  HiOutlineLightningBolt,
};

function Tentang() {
  const [loading, setLoading] = useState(true);
  const [cfg, setCfg] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getHomeConfig();
        setCfg(data);
      } catch (e) {
        setErr(e?.toString?.() || 'Gagal memuat data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const features = useMemo(() => {
    const arr = Array.isArray(cfg?.aboutFeatures) ? cfg.aboutFeatures.slice(0, 3) : [];
    while (arr.length < 3) arr.push({ icon: 'HiOutlineCode', title: 'Fitur', description: '—' });
    return arr;
  }, [cfg]);

  if (loading) return <p className="text-center pt-20">Memuat...</p>;
  if (err) return <p className="text-center pt-20 text-accent-red">{err}</p>;

  const visi = cfg?.aboutVisi ||
    'Menjadi komunitas developer terdepan yang inovatif, kolaboratif, dan berdampak positif bagi lingkungan akademik dan industri.';
  const misi = Array.isArray(cfg?.aboutMisi) && cfg.aboutMisi.length > 0
    ? cfg.aboutMisi
    : [
        'Mengadakan pelatihan dan workshop rutin.',
        'Membangun proyek kolaboratif untuk portofolio.',
        'Menciptakan ruang diskusi yang aktif dan suportif.',
      ];
  const instagramUrl = cfg?.instagramUrl || 'https://www.instagram.com/adcom_official/';

  return (
    <div className="flex justify-center py-12 px-4">
      <div className="p-6 md:p-8 bg-neum-bg rounded-xl shadow-neum-out w-full max-w-4xl overflow-hidden border-t-4 border-accent-blue">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-6">
          Tentang ADCOM IKMI
        </h1>
        <p className="text-lg text-gray-600 text-center mb-12">
          Kami adalah komunitas developer yang bersemangat untuk belajar, berbagi, dan berinovasi dalam dunia teknologi, khususnya Android.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="p-6 bg-neum-bg rounded-xl shadow-neum-in">
            <div className="flex items-center space-x-4 mb-3">
              <HiOutlineEye className="h-10 w-10 text-accent-blue" />
              <h2 className="text-2xl font-semibold text-gray-700">Visi Kami</h2>
            </div>
            <p className="text-gray-600">{visi}</p>
          </div>

          <div className="p-6 bg-neum-bg rounded-xl shadow-neum-in">
            <div className="flex items-center space-x-4 mb-3">
              <HiOutlineLightningBolt className="h-10 w-10 text-accent-green" />
              <h2 className="text-2xl font-semibold text-gray-700">Misi Kami</h2>
            </div>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {misi.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Apa yang Kami Lakukan?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((f, idx) => {
            const Icon = ICON_MAP[f?.icon] || HiOutlineCode;
            return (
              <div key={idx} className="p-6 bg-neum-bg rounded-lg shadow-neum-out text-center">
                <Icon className="h-12 w-12 text-accent-red mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700">{f?.title || 'Fitur'}</h3>
                <p className="text-gray-600 text-sm mt-1">{f?.description || '—'}</p>
              </div>
            );
          })}
        </div>

        <div className="p-8 bg-neum-bg rounded-xl shadow-neum-in text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Tertarik Bergabung?</h2>
          <p className="text-lg text-gray-600 mb-6">
            Ikuti kami di Instagram untuk informasi pendaftaran terbaru dan lihat keseruan aktivitas kami!
          </p>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-neum-bg text-accent-blue font-semibold rounded-lg shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active transition-all duration-150"
          >
            Daftar (via Instagram)
          </a>
        </div>
      </div>
    </div>
  );
}

export default Tentang;