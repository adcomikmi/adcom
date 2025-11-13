// src/components/member/SubmitTugasModal.jsx
import React, { useState } from 'react';
import { submitTugas } from '../../services/api';
import Modal from '../common/Modal';
import { HiPaperClip, HiX } from 'react-icons/hi';

function SubmitTugasModal({ isOpen, onClose, tugas, onSubmitSuccess }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => { setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setError('Anda harus memilih setidaknya satu file');
      return;
    }
    setLoading(true);
    setError(null);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('submissionFiles', file);
    });

    try {
      await submitTugas(tugas._id, formData);
      setLoading(false);
      setFiles([]);
      onSubmitSuccess(); 
      onClose();
    } catch (err) {
      setError(err.toString());
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} closeModal={onClose} title={`Kirim Tugas: ${tugas.judul}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="submissionFiles" 
            className={`flex flex-col items-center justify-center w-full h-32 px-4 py-3 bg-neum-bg rounded-lg shadow-neum-in cursor-pointer
                        ${isDragging ? 'shadow-neum-out' : ''}`}
            onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
          >
            <p className="text-gray-500 text-sm">Drag & drop file di sini</p>
            <p className="text-gray-400 text-xs">atau klik (Bisa lebih dari satu)</p>
            <input
              type="file" id="submissionFiles" multiple onChange={handleFileChange}
              className="opacity-0 w-0 h-0"
            />
          </label>
        </div>
        
        {files.length > 0 && (
          <div className="p-3 bg-neum-bg rounded-lg shadow-neum-in space-y-2 max-h-32 overflow-y-auto">
            {files.map((file, index) => (
              <div key={index} className="flex justify-between items-center text-sm text-gray-600">
                <span className="flex items-center truncate"><HiPaperClip className="mr-2" /> {file.name}</span>
                <button type="button" onClick={() => removeFile(index)} className="text-accent-red hover:text-red-700">
                  <HiX />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-neum-bg text-accent-green font-semibold rounded-lg shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active"
          >
            {loading ? 'Mengirim...' : 'Kirim Tugas'}
          </button>
        </div>
        {error && <p className="text-accent-red text-center mt-2">{error}</p>}
      </form>
    </Modal>
  );
}

export default SubmitTugasModal;