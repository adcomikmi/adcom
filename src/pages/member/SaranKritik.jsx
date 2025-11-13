// src/pages/member/SaranKritik.jsx
import React, { useState } from 'react';
import { createFeedback } from '../../services/api';

function SaranKritik() {
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await createFeedback({ message, isAnonymous });
      setSuccess(data.message);
      setMessage('');
      setIsAnonymous(false);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center py-12 px-4">
      <div className="p-6 md:p-8 bg-neum-bg rounded-xl shadow-neum-out w-full max-w-2xl overflow-hidden border-t-4 border-accent-green">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-8 text-center">
          Kirim Saran & Kritik
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Pesan Anda
            </label>
            <textarea
              id="message"
              rows="6"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis saran atau kritik Anda untuk ADCOM di sini..."
              required
              className="w-full px-4 py-3 bg-neum-bg rounded-lg shadow-neum-in focus:outline-none focus:ring-2 focus:ring-accent-green"
            ></textarea>
          </div>
          
          <div className="flex items-center">
            {/* PERBAIKAN DI SINI: Mengganti shadow-neum-in dengan border agar terlihat jelas */}
            <input
              id="isAnonymous"
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="h-5 w-5 rounded border-2 border-gray-400 text-accent-green focus:ring-accent-green cursor-pointer bg-white"
            />
            <label htmlFor="isAnonymous" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer select-none">
              Kirim sebagai Anonim (sembunyikan nama Anda)
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-neum-bg text-accent-green font-semibold rounded-lg shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active transition-all duration-150 disabled:opacity-50"
          >
            {loading ? 'Mengirim...' : 'Kirim Pesan'}
          </button>

          {success && <p className="text-accent-green text-center">{success}</p>}
          {error && <p className="text-accent-red text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default SaranKritik;
