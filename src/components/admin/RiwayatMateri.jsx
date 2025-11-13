// src/components/admin/RiwayatMateri.jsx
import React, { useState, useEffect } from 'react';
import { getMateriTugas, deleteMateri } from '../../services/api';
import Pagination from '../common/Pagination';
import Modal from '../common/Modal';
import EditMateriModal from './EditMateriModal';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';

function RiwayatMateri({ refreshKey }) {
  const [materiList, setMateriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMateri, setSelectedMateri] = useState(null);

  const fetchMateri = async (page) => {
    try {
      setLoading(true);
      const data = await getMateriTugas(page);
      setMateriList(data.materi);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMateri(currentPage);
  }, [currentPage, refreshKey]);

  const openDeleteModal = (materi) => {
    setSelectedMateri(materi);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMateri) return;
    try {
      await deleteMateri(selectedMateri._id);
      setIsDeleteModalOpen(false);
      setSelectedMateri(null);
      fetchMateri(currentPage); 
    } catch (err) {
      setError(err.toString());
      setIsDeleteModalOpen(false);
    }
  };

  const openEditModal = (materi) => {
    setSelectedMateri(materi);
    setIsEditModalOpen(true);
  };

  const handleEditSave = () => {
    fetchMateri(currentPage); 
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
        Riwayat Konten
      </h2>
      
      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-accent-red">{error}</p>}

      {!loading && !error && (
        <div className="space-y-4">
          {materiList.map((materi) => (
            <div key={materi._id} className="p-4 bg-neum-bg rounded-lg shadow-neum-in flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-800">{materi.judul}</h3>
                <span className={`text-xs font-medium ${materi.tipe === 'tugas' ? 'text-accent-red' : 'text-accent-blue'}`}>
                  {materi.tipe.toUpperCase()}
                </span>
              </div>
              <div className="flex space-x-3">
                <button onClick={() => openEditModal(materi)} className="text-gray-600 hover:text-accent-yellow">
                  <HiOutlinePencil className="h-5 w-5" />
                </button>
                <button onClick={() => openDeleteModal(materi)} className="text-gray-600 hover:text-accent-red">
                  <HiOutlineTrash className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <Modal 
        isOpen={isDeleteModalOpen} 
        closeModal={() => setIsDeleteModalOpen(false)} 
        title="Konfirmasi Hapus"
      >
        <p className="text-gray-700">Anda yakin ingin menghapus materi ini? Semua file dan data submission terkait akan dihapus permanen.</p>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 bg-neum-bg text-gray-700 font-semibold rounded-lg shadow-neum-out"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Batal
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-accent-red text-white font-semibold rounded-lg shadow-md"
            onClick={handleDeleteConfirm}
          >
            Hapus
          </button>
        </div>
      </Modal>

      {selectedMateri && (
        <EditMateriModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          materi={selectedMateri}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}

export default RiwayatMateri;