// src/pages/Login.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { login as apiLogin } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { HiEye, HiEyeOff } from "react-icons/hi";

function Login() {
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await apiLogin(nim, password);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-neum-bg overflow-hidden">
      <motion.div
        className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(40% 40% at 50% 50%, rgba(24,119,242,0.25), transparent)",
        }}
        animate={{ x: [0, 20, -10, 0], y: [0, -10, 10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(40% 40% at 50% 50%, rgba(234,67,53,0.18), transparent)",
        }}
        animate={{ x: [0, -20, 10, 0], y: [0, 10, -10, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={[
          "w-full max-w-md rounded-2xl bg-neum-bg shadow-neum-out border-t-4 border-accent-blue overflow-hidden",
          "transition-all duration-500 ease-out transform",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        ].join(" ")}
      >
        <div className="p-8">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl font-bold text-center mb-6 text-gray-700"
          >
            Login Anggota ADCOM
          </motion.h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="nim"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                NIM
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                id="nim"
                name="username"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                required
                className="w-full px-4 py-3 bg-neum-bg rounded-xl shadow-neum-in focus:outline-none focus:ring-2 focus:ring-accent-blue transition"
                placeholder="Masukkan NIM"
                autoComplete="username"
                inputMode="numeric"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type={showPw ? "text" : "password"}
                  id="password"
                  name="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pr-12 px-4 py-3 bg-neum-bg rounded-xl shadow-neum-in focus:outline-none focus:ring-2 focus:ring-accent-blue transition"
                  placeholder="Masukkan password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  aria-label={showPw ? "Sembunyikan password" : "Tampilkan password"}
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition"
                >
                  {showPw ? <HiEyeOff size={22} /> : <HiEye size={22} />}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Ketuk ikon mata untuk melihat/sembunyikan password.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-neum-bg text-accent-blue font-semibold rounded-xl shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active transition-all duration-200 disabled:opacity-50 disabled:text-gray-500"
            >
              {loading ? "Memproses…" : "Login"}
            </motion.button>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm text-center mt-2"
              >
                {error}
              </motion.p>
            )}
          </form>
        </div>

        <div className="px-8 py-4 bg-white/30 backdrop-blur-sm">
          <p className="text-[11px] text-gray-500 text-center">
            Tips: Password akan Otomatis minta ganti saat pertama kali login akun
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;