// src/components/admin/ViewSubmissions.jsx

import React, { useState, useEffect } from 'react';
import { getAllSubmissions, getSubmissionById } from '../../services/api';
import Pagination from '../common/Pagination';
import Modal from '../common/Modal';
import { HiDownload } from 'react-icons/hi';

function ViewSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async (page) => {
      try {
        setLoading(true);
        const data = await getAllSubmissions(page);
        setSubmissions(data.submissions);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions(currentPage);
  }, [currentPage]);

  const handleRowClick = async (submissionId) => {
    setIsModalOpen(true);
    setLoadingModal(true);
    try {
      const data = await getSubmissionById(submissionId);
      setSelectedSub(data);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoadingModal(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSub(null);
    setError(null); 
  };

  if (loading) return <p className="text-center text-gray-600">Loading data...</p>;
  if (error && !isModalOpen) return <p className="text-center text-accent-red">{error}</p>;

  return (
    <>
      <div className="overflow-x-auto bg-neum-bg rounded-lg shadow-neum-in p-4">
        <table className="min-w-full divide-y divide-gray-300/50">
          <thead className="bg-neum-bg">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-700">Nama Anggota</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700">Tugas</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-700">Waktu Kirim</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300/50 bg-neum-bg">
            {submissions.map((sub) => (
              <tr 
                key={sub._id} 
                onClick={() => handleRowClick(sub._id)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-800">{sub.userId?.namaAsli || 'User Dihapus'}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">{sub.tugasId?.judul || 'Tugas Dihapus'}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
                  {new Date(sub.submittedAt).toLocaleString('id-ID')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <Modal isOpen={isModalOpen} closeModal={closeModal} title="Detail Submission">
        {loadingModal && <p>Loading detail...</p>}
        {error && <p className="text-accent-red text-center mb-4">{error}</p>}
        {selectedSub && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Anggota</h4>
              <p className="text-lg font-semibold text-gray-800">{selectedSub.userId?.namaAsli} ({selectedSub.userId?.nim})</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Tugas</h4>
              <p className="text-lg font-semibold text-gray-800">{selectedSub.tugasId?.judul}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500">File Terkirim:</h4>
              {selectedSub.files.map((file, index) => (
                <a
                  key={index}
                  href={file.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center w-fit px-4 py-2 bg-neum-bg text-accent-blue font-medium rounded-lg shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active text-sm"
                >
                  <HiDownload className="mr-2" />
                  {file.originalName || 'Download File'}
                </a>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export default ViewSubmissions;