// src/pages/member/Dashboard.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="flex justify-center py-12 px-4">
      <div className="p-6 md:p-8 bg-neum-bg rounded-xl shadow-neum-out w-full max-w-3xl overflow-hidden border-t-4 border-accent-blue">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-4">
          Dashboard Anggota
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          Selamat datang, <span className="font-semibold">{user?.namaAsli}</span>!
        </p>
        <p className="text-base text-gray-500 mt-2">NIM: {user?.nim}</p>
      </div>
    </div>
  );
}

export default Dashboard;