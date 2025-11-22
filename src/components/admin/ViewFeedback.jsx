// src/components/admin/ViewFeedback.jsx
import React, { useState, useEffect } from 'react';
import { getAllFeedback, deleteFeedback } from '../../services/api';
import Pagination from '../common/Pagination';
import { HiOutlineTrash } from 'react-icons/hi';
import Modal from '../common/Modal';

function ViewFeedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [expandedId, setExpandedId] = useState(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchFeedback = async (page) => {
    try {
      setLoading(true);
      const data = await getAllFeedback(page);
      setFeedbackList(data.feedback);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback(currentPage);
  }, [currentPage]);

  const handleToggleDetail = (id) => {
    setExpandedId(prevId => (prevId === id ? null : id));
  };

  const openDeleteModal = (id) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await deleteFeedback(itemToDelete);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      fetchFeedback(currentPage); 
    } catch (err) {
      setError(err.toString());
      setIsDeleteModalOpen(false);
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading feedback...</p>;
  if (error) return <p className="text-center text-accent-red">{error}</p>;

  return (
    <>
      <div className="space-y-6">
        {feedbackList.length === 0 && (
          <p className="text-center text-gray-500">Belum ada saran atau kritik yang masuk.</p>
        )}
        {feedbackList.map((item) => (
          <div key={item._id} className="p-5 bg-neum-bg rounded-xl shadow-neum-in">
            <p className={`text-gray-700 whitespace-pre-wrap ${expandedId === item._id ? '' : 'line-clamp-3'}`}>
              {item.message}
            </p>
            
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => handleToggleDetail(item._id)}
                className="text-sm font-medium text-accent-blue hover:underline"
              >
                {expandedId === item._id ? 'Sembunyikan' : 'Lihat Detail'}
              </button>
              <button
                onClick={() => openDeleteModal(item._id)}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-accent-red"
              >
                <HiOutlineTrash className="text-base" />
                <span>Hapus</span>
              </button>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500 border-t border-gray-300/50 pt-3 mt-4">
              <span className="font-medium">
                Pengirim: {item.isAnonymous 
                  ? <span className="italic text-gray-400">Anonim</span> 
                  : <span className="text-gray-700">{item.userId?.namaAsli || 'User Dihapus'}</span>
                }
              </span>
              <span className="text-xs">
                {new Date(item.createdAt).toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        ))}
      </div>

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
        <p className="text-gray-700">Anda yakin ingin menghapus saran ini?</p>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 bg-neum-bg text-gray-700 font-semibold rounded-lg shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Batal
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-accent-red text-white font-semibold rounded-lg shadow-md hover:bg-red-700"
            onClick={handleDeleteConfirm}
          >
            Hapus
          </button>
        </div>
      </Modal>
    </>
  );
}

export default ViewFeedback;