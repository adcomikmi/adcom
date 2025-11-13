// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { getHomeConfig } from '../../services/api';
import ReactMarkdown from 'react-markdown';

function AdminDashboard() {
  const { user } = useAuth();
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

  return (
    <div className="flex justify-center py-12 px-4">
      <div className="p-6 md:p-8 bg-neum-bg rounded-xl shadow-neum-out w-full max-w-4xl overflow-hidden border-t-4 border-accent-red">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-4">
          Selamat Datang, Admin {user?.nama}!
        </h1>
        
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="prose prose-sm max-w-none text-gray-600 mb-8 p-4 bg-neum-bg rounded-lg shadow-neum-in">
            <ReactMarkdown>
              {config?.adminWelcomeMessage || 'Selamat datang di panel admin.'}
            </ReactMarkdown>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            to="/admin/informasi"
            className="p-6 bg-neum-bg rounded-lg shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active transition-all"
          >
            <h2 className="text-xl font-semibold text-gray-800">Buat Informasi</h2>
            <p className="text-gray-600 mt-2">Buat Informasi Kegiatan ADCOM Sekarang..</p>
          </Link>

          <Link 
            to="/admin/upload"
            className="p-6 bg-neum-bg rounded-lg shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active transition-all"
          >
            <h2 className="text-xl font-semibold text-gray-800">Upload Materi</h2>
            <p className="text-gray-600 mt-2">Buat materi atau tugas baru untuk anggota.</p>
          </Link>
          
          <Link 
            to="/admin/data"
            className="p-6 bg-neum-bg rounded-lg shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active transition-all"
          >
            <h2 className="text-xl font-semibold text-gray-800">Data Informasi</h2>
            <p className="text-gray-600 mt-2">Kelola anggota, lihat feedback, dan jawaban.</p>
          </Link>

          <Link 
            to="/admin/modif"
            className="p-6 bg-neum-bg rounded-lg shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active transition-all"
          >
            <h2 className="text-xl font-semibold text-gray-800">Modifikasi Website</h2>
            <p className="text-gray-600 mt-2">Ayo Modufikasi Website ADCOM sekarang..</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;