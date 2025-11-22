// src/pages/member/Diskusi.jsx
import React, { useState, useEffect } from 'react';
import { getAllThreads, createThread } from '../../services/api';
import Modal from '../../components/common/Modal';
import { Link } from 'react-router-dom';

function Diskusi() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [judul, setJudul] = useState('');
  const [konten, setKonten] = useState('');
  const [loadingModal, setLoadingModal] = useState(false);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const data = await getAllThreads();
      setThreads(data);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingModal(true);
    try {
      await createThread({ judul, konten });
      setJudul('');
      setKonten('');
      setIsModalOpen(false);
      fetchThreads(); 
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoadingModal(false);
    }
  };

  const getAuthorName = (author) => {
    if (!author) return 'Anggota Dihapus';
    return author.namaAsli || author.nama || 'Anggota ADCOM';
  };

  return (
    <div className="flex justify-center py-12 px-4">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-700 text-center md:text-left">
            Ruang Diskusi
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 md:mt-0 w-full md:w-auto px-4 py-3 bg-neum-bg text-accent-green font-semibold rounded-lg shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active transition-all"
          >
            Mulai Diskusi Baru
          </button>
        </div>
        
        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="text-center text-accent-red">{error}</p>}

        {!loading && !error && (
          <div className="space-y-6">
            {threads.length > 0 ? (
              threads.map((thread) => (
                <Link 
                  key={thread._id} 
                  to={`/diskusi/${thread._id}`}
                  className="block p-6 bg-neum-bg rounded-xl shadow-neum-out text-left transition-all hover:shadow-neum-out-hover active:shadow-neum-in-active overflow-hidden border-t-4 border-accent-yellow"
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{thread.judul}</h2>
                  <p className="text-gray-600 mb-4 truncate">{thread.konten}</p>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span className="font-medium text-gray-700">
                      Oleh: {getAuthorName(thread.author)}
                    </span>
                    <span className="text-xs">
                      Di-post: {new Date(thread.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-500">Belum ada diskusi. Jadilah yang pertama!</p>
            )}
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        closeModal={() => setIsModalOpen(false)} 
        title="Mulai Diskusi Baru"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="judul" className="block text-sm font-medium text-gray-700 mb-2">Judul</label>
            <input
              type="text"
              id="judul"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              required
              className="w-full px-4 py-3 bg-neum-bg rounded-lg shadow-neum-in focus:outline-none focus:ring-2 focus:ring-accent-green"
            />
          </div>
          <div>
            <label htmlFor="konten" className="block text-sm font-medium text-gray-700 mb-2">Pertanyaan / Topik</label>
            <textarea
              id="konten"
              rows="5"
              value={konten}
              onChange={(e) => setKonten(e.target.value)}
              required
              className="w-full px-4 py-3 bg-neum-bg rounded-lg shadow-neum-in focus:outline-none focus:ring-2 focus:ring-accent-green"
            ></textarea>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loadingModal}
              className="px-4 py-2 bg-neum-bg text-accent-green font-semibold rounded-lg shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active transition-all duration-150 disabled:opacity-50"
            >
              {loadingModal ? 'Mengirim...' : 'Kirim'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Diskusi;