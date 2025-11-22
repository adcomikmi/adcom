// src/pages/admin/AdminLogin.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  const handleMessage = useCallback((event) => {
    // Pastikan domain ini sesuai dengan yang ada di env server CLIENT_URL
    if (event.origin === window.location.origin) {
      const data = event.data;
      if (data && data.token) {
        login(data);
        navigate('/admin');
      } else if (data && data.error) {
        setError(data.error);
      }
    }
  }, [login, navigate]);

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

  const openGoogleLogin = () => {
    const width = 600, height = 600;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);
    // Gunakan endpoint relatif karena sudah di-proxy
    const url = '/api/auth/google';
    window.open(
      url,
      'googleLogin',
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-neum-bg overflow-hidden">
      <motion.div
        className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(35% 35% at 50% 50%, rgba(24,119,242,0.25), transparent)' }}
        animate={{ x: [0, 20, -10, 0], y: [0, -10, 10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(35% 35% at 50% 50%, rgba(234,67,53,0.18), transparent)' }}
        animate={{ x: [0, -20, 10, 0], y: [0, 10, -10, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-[92%] max-w-md p-8 md:p-10 bg-neum-bg rounded-2xl shadow-neum-out border-t-4 border-accent-blue"
      >
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Login Admin
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Masuk untuk mengelola konten dan konfigurasi website.
          </p>
        </div>

        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ y: 0 }}
          onClick={openGoogleLogin}
          className="group w-full py-3 px-4 bg-neum-bg text-gray-800 font-semibold rounded-xl shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active transition-all duration-150 flex items-center justify-center gap-3"
        >
          <span>Login dengan Google</span>
        </motion.button>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-sm text-accent-red text-center"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

export default AdminLogin;