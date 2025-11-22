// src/pages/public/Home.jsx

import React, { useState, useEffect } from 'react';
import { getHomeConfig } from '../../services/api';
import { HiCode, HiUsers, HiChatAlt2 } from 'react-icons/hi';
// Tambahkan import Link di sini
import { Link } from 'react-router-dom';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

function Home() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getHomeConfig();
        setConfig(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto">
        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-24">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {config?.heroTitle || 'Selamat Datang di ADCOM'}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {config?.heroSubtitle || 'Komunitas developer.'}
            </p>
            <div className="flex space-x-4">
              {/* Tombol Mulai Belajar -> Mengarah ke /materi */}
              <Link 
                to="/materi" 
                className="px-6 py-3 bg-neum-bg text-accent-blue font-semibold rounded-lg shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active transition-all"
              >
                Mulai Belajar
              </Link>
              
              {/* Tombol Gabung -> Mengarah ke /tentang */}
              <Link 
                to="/tentang" 
                className="px-6 py-3 bg-neum-bg text-gray-700 font-semibold rounded-lg shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active transition-all"
              >
                Gabung
              </Link>
            </div>
          </div>
          
          <div className="w-full bg-neum-bg rounded-2xl shadow-neum-out p-4">
            {(config?.heroImages && config.heroImages.length > 0) ? (
              <Swiper
                modules={[Pagination, Navigation, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                className="w-full h-full rounded-xl"
              >
                {config.heroImages.map((image) => (
                  <SwiperSlide key={image.public_id}>
                    <div className="w-full aspect-video bg-neum-bg shadow-neum-in">
                      <img 
                        src={image.url} 
                        alt="Hero ADCOM" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="w-full aspect-video rounded-xl bg-neum-bg shadow-neum-in flex items-center justify-center text-gray-500">
                Gambar Hero
              </div>
            )}
          </div>
        </section>

        {/* --- Features Section (Tidak berubah) --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-neum-bg rounded-xl shadow-neum-out text-center">
            <HiCode className="h-12 w-12 text-accent-blue mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Materi Eksklusif</h3>
            <p className="text-gray-600">Dapatkan akses ke materi, tugas, dan studi kasus terbaru.</p>
          </div>
          <div className="p-8 bg-neum-bg rounded-xl shadow-neum-out text-center">
            <HiUsers className="h-12 w-12 text-accent-green mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Komunitas Solid</h3>
            <p className="text-gray-600">Terhubung dengan sesama anggota dan alumni.</p>
          </div>
          <div className="p-8 bg-neum-bg rounded-xl shadow-neum-out text-center">
            <HiChatAlt2 className="h-12 w-12 text-accent-yellow mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Diskusi Aktif</h3>
            <p className="text-gray-600">Tanyakan masalah, bagikan solusi di ruang diskusi.</p>
          </div>
        </section>

      </div>
    </div>
  );
}

export default Home;
