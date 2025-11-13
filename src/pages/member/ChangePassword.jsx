// src/pages/member/ChangePassword.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { changePassword } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { HiEye, HiEyeOff } from "react-icons/hi";

function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw1, setShowPw1] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [mounted, setMounted] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const data = await changePassword(password);
      setMessage(
        (data.message || "Password berhasil diperbarui.") +
          " Anda akan di-logout otomatis."
      );
      setTimeout(() => {
        logout();
        window.location.href = "/login";
      }, 3000);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-neum-bg flex items-center justify-center overflow-hidden p-4">
      <motion.div
        className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(40% 40% at 50% 50%, rgba(234,67,53,0.25), transparent)",
        }}
        animate={{ x: [0, 25, -10, 0], y: [0, -10, 10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(40% 40% at 50% 50%, rgba(24,119,242,0.18), transparent)",
        }}
        animate={{ x: [0, -20, 15, 0], y: [0, 15, -10, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className={[
          "w-full max-w-md rounded-2xl bg-neum-bg shadow-neum-out overflow-hidden",
          "border-t-4 border-accent-red",
          "transition-all duration-500 ease-out transform",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        ].join(" ")}
      >
        <div className="p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 text-gray-700">
            Ganti Password Baru
          </h2>
          <p className="text-center text-sm text-gray-600 mb-6">
            Ini adalah login pertama Anda. Harap ganti password Anda.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password Baru
              </label>
              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type={showPw1 ? "text" : "password"}
                  id="new-password"
                  name="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pr-12 px-4 py-3 bg-neum-bg rounded-xl shadow-neum-in focus:outline-none focus:ring-2 focus:ring-accent-red transition"
                  placeholder="Masukkan password baru"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  aria-label={showPw1 ? "Sembunyikan password" : "Tampilkan password"}
                  onClick={() => setShowPw1((s) => !s)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition"
                >
                  {showPw1 ? <HiEyeOff size={22} /> : <HiEye size={22} />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirm-new-password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Konfirmasi Password Baru
              </label>
              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type={showPw2 ? "text" : "password"}
                  id="confirm-new-password"
                  name="confirm-new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pr-12 px-4 py-3 bg-neum-bg rounded-xl shadow-neum-in focus:outline-none focus:ring-2 focus:ring-accent-red transition"
                  placeholder="Ulangi password baru"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  aria-label={showPw2 ? "Sembunyikan password" : "Tampilkan password"}
                  onClick={() => setShowPw2((s) => !s)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition"
                >
                  {showPw2 ? <HiEyeOff size={22} /> : <HiEye size={22} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-neum-bg text-accent-red font-semibold rounded-xl shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active transition-all duration-200 disabled:opacity-50 disabled:text-gray-500"
            >
              {loading ? "Menyimpan…" : "Simpan Password"}
            </motion.button>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-accent-red text-sm text-center"
              >
                {error}
              </motion.p>
            )}
            {message && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-accent-green text-sm text-center"
              >
                {message}
              </motion.p>
            )}
          </form>
        </div>

        <div className="px-8 py-4 bg-white/30 backdrop-blur-sm">
          <p className="text-[11px] text-gray-500 text-center">
            Tips: gunakan ikon mata untuk memastikan password yang Anda ketik
            sudah benar.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default ChangePassword;