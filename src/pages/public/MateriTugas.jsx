// src/pages/public/MateriTugas.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { getMateriTugas } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import SubmitTugasModal from '../../components/member/SubmitTugasModal';
import { HiDownload, HiChevronDown, HiChevronUp, HiCheckCircle } from 'react-icons/hi';
import { formatDistanceToNow, isPast, isToday } from 'date-fns';
import { id } from 'date-fns/locale';

function MateriTugas() {
  const { user } = useAuth();
  const [materiList, setMateriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedMateri, setSelectedMateri] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchMateri = useCallback(async (page) => {
    try {
      setLoading(true);
      const data = await getMateriTugas(page);
      setMateriList(data.materi);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setError(null);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMateri(currentPage);
  }, [currentPage, refreshKey, fetchMateri]);

  const openModal = (materi) => { setSelectedMateri(materi); setIsModalOpen(true); };
  const closeModal = () => setIsModalOpen(false);
  const closeSubmitModal = () => setIsSubmitModalOpen(false);
  const closeConfirmModal = () => setIsConfirmModalOpen(false);

  const openSubmitModal = (materi) => {
    setSelectedMateri(materi);
    setIsSubmitModalOpen(true);
  };

  const openConfirmModal = (materi) => {
    setSelectedMateri(materi);
    setIsConfirmModalOpen(true);
  };
  
  const handleConfirmResubmit = () => {
    closeConfirmModal();
    openSubmitModal(selectedMateri);
  };
  
  const handleSubmitSuccess = () => {
    setRefreshKey(oldKey => oldKey + 1);
  };

  const getAksenWarna = (tipe, deadline, isSubmitted) => {
    if (tipe === 'materi') return 'border-accent-blue';
    if (tipe === 'tugas') {
      if (isSubmitted) return 'border-accent-green';
      if (deadline && isPast(new Date(deadline))) return 'border-gray-400';
      return 'border-accent-red';
    }
    return 'border-gray-300';
  };

  const getBgWarna = (tipe, deadline, isSubmitted) => {
    if (tipe === 'materi') return 'bg-accent-blue';
    if (tipe === 'tugas') {
      if (isSubmitted) return 'bg-accent-green';
      if (deadline && isPast(new Date(deadline))) return 'bg-gray-400';
      return 'bg-accent-red';
    }
    return 'bg-gray-300';
  };

  const Countdown = ({ deadline }) => {
    if (!deadline) return null;
    const deadlineDate = new Date(deadline);
    if (isPast(deadlineDate)) {
      return <span className="text-gray-500 font-medium">Telah Berakhir</span>;
    }
    if (isToday(deadlineDate)) {
      return <span className="text-accent-red font-bold animate-pulse">Berakhir Hari Ini!</span>;
    }
    return (
      <span className="text-accent-yellow font-medium">
        Berakhir dalam {formatDistanceToNow(deadlineDate, { addSuffix: true, locale: id })}
      </span>
    );
  };

  const DownloadButtons = ({ files }) => {
    const [showFiles, setShowFiles] = useState(false);

    if (!files || files.length === 0) return null;

    return (
      <div className="mt-4 pt-4 border-t border-gray-300/50">
        <button 
          onClick={() => setShowFiles(!showFiles)}
          className="flex justify-between items-center w-full text-sm font-semibold text-gray-700 mb-2"
        >
          <span>Lihat {files.length} File Lampiran</span>
          {showFiles ? <HiChevronUp className="h-5 w-5"/> : <HiChevronDown className="h-5 w-5"/>}
        </button>
        
        {showFiles && (
          <div className="space-y-2 pl-2">
            {files.map((file, index) => (
              <a
                key={index}
                href={file.path}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center w-fit px-4 py-2 bg-neum-bg text-accent-blue font-medium rounded-lg shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active text-sm"
              >
                <HiDownload className="mr-2" />
                {file.originalName}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  };

  const TugasButton = ({ materi }) => {
    if (materi.tipe !== 'tugas' || !user || user.role !== 'member') {
      return null;
    }

    const isDeadlinePast = materi.deadline && isPast(new Date(materi.deadline));

    if (materi.isSubmitted) {
      return (
        <button 
          onClick={() => openConfirmModal(materi)}
          disabled={isDeadlinePast}
          className="flex items-center justify-center w-full mt-4 px-4 py-2 bg-neum-bg text-accent-green font-semibold rounded-lg shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active text-sm disabled:text-gray-500 disabled:shadow-neum-in disabled:hover:shadow-neum-in"
        >
          <HiCheckCircle className="mr-2" />
          {isDeadlinePast ? 'Tugas Terkirim (Deadline Lewat)' : 'Tugas Terkirim (Kirim Ulang)'}
        </button>
      );
    }

    if (isDeadlinePast) {
      return (
        <button 
          disabled
          className="w-full mt-4 px-4 py-2 bg-neum-bg text-gray-500 font-medium rounded-lg shadow-neum-in text-sm"
        >
          Deadline Terlewat
        </button>
      );
    }

    return (
      <button
        onClick={() => openSubmitModal(materi)}
        className="w-full mt-4 px-4 py-2 bg-neum-bg text-accent-red font-semibold rounded-lg shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active text-sm animate-pulse"
      >
        Kirim Tugas
      </button>
    );
  };

  return (
    <div className="flex justify-center py-12 px-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-700 mb-8 text-center">
          Informasi Materi & Tugas
        </h1>
        
        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="text-center text-accent-red">{error}</p>}

        {!loading && !error && (
          <div className="space-y-6">
            {materiList.length > 0 ? (
              materiList.map((materi) => (
                <div 
                  key={materi._id} 
                  className={`p-6 bg-neum-bg rounded-xl shadow-neum-out overflow-hidden border-t-4 ${getAksenWarna(materi.tipe, materi.deadline, materi.isSubmitted)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h2 
                      onClick={() => openModal(materi)} 
                      className="text-xl font-semibold text-gray-800 cursor-pointer hover:underline"
                    >
                      {materi.judul}
                    </h2>
                    <span 
                      className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getBgWarna(materi.tipe, materi.deadline, materi.isSubmitted)}`}
                    >
                      {materi.tipe === 'tugas' ? 'Tugas' : 'Materi'}
                    </span>
                  </div>
                  <p 
                    onClick={() => openModal(materi)} 
                    className="text-gray-600 mb-4 truncate cursor-pointer"
                  >
                    {materi.deskripsi}
                  </p>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <Countdown deadline={materi.deadline} />
                    <span className="text-xs">
                      Di-post: {new Date(materi.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  
                  <DownloadButtons files={materi.files} />
                  
                  <TugasButton materi={materi} />
                  
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">Belum ada materi atau tugas.</p>
            )}
          </div>
        )}
        
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {selectedMateri && (
        <Modal 
          isOpen={isModalOpen} 
          closeModal={closeModal} 
          title={selectedMateri.judul}
        >
          <p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap">{selectedMateri.deskripsi}</p>
          <DownloadButtons files={selectedMateri.files} />
        </Modal>
      )}

      {selectedMateri && (
        <SubmitTugasModal
          isOpen={isSubmitModalOpen}
          onClose={closeSubmitModal}
          tugas={selectedMateri}
          onSubmitSuccess={handleSubmitSuccess}
        />
      )}

      {selectedMateri && (
        <Modal 
          isOpen={isConfirmModalOpen} 
          closeModal={closeConfirmModal} 
          title="Ganti Jawaban?"
        >
          <p className="text-gray-700">Yakin ingin menganti jawaban? File jawaban Anda yang lama akan dihapus dan diganti dengan yang baru.</p>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 bg-neum-bg text-gray-700 font-semibold rounded-lg shadow-neum-out"
              onClick={closeConfirmModal}
            >
              Batal
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-accent-red text-white font-semibold rounded-lg shadow-md"
              onClick={handleConfirmResubmit}
            >
              Ya, Ganti Jawaban
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default MateriTugas;