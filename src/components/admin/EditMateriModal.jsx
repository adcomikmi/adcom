// src/components/admin/EditMateriModal.jsx
import React, { useState, useEffect } from 'react';
import { updateMateri } from '../../services/api';
import Modal from '../common/Modal';
import { HiPaperClip, HiX } from 'react-icons/hi';

function EditMateriModal({ isOpen, onClose, materi, onSave }) {
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [tipe, setTipe] = useState('materi');
  const [deadline, setDeadline] = useState('');
  const [existingFiles, setExistingFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (materi) {
      setJudul(materi.judul);
      setDeskripsi(materi.deskripsi);
      setTipe(materi.tipe);
      setDeadline(materi.deadline ? new Date(materi.deadline).toISOString().split('T')[0] : '');
      setExistingFiles(materi.files || []);
      setNewFiles([]);
    }
  }, [materi]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setNewFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const removeExistingFile = (path) => {
    setExistingFiles(prev => prev.filter(f => f.path !== path));
  };

  const removeNewFile = (index) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('deskripsi', deskripsi);
    formData.append('tipe', tipe);
    formData.append('deadline', deadline);
    formData.append('existingFiles', JSON.stringify(existingFiles));
    
    newFiles.forEach(file => {
      formData.append('fileMateri', file);
    });

    try {
      await updateMateri(materi._id, formData);
      setLoading(false);
      onSave(); 
      onClose();
    } catch (err) {
      setError(err.toString());
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} closeModal={onClose} title="Edit Materi/Tugas">
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <div>
          <label htmlFor="edit-judul" className="block text-sm font-medium text-gray-700 mb-2">Judul</label>
          <input
            type="text" id="edit-judul" value={judul} onChange={(e) => setJudul(e.target.value)}
            className="w-full px-4 py-3 bg-neum-bg rounded-lg shadow-neum-in focus:outline-none focus:ring-2 focus:ring-accent-yellow"
          />
        </div>
        <div>
          <label htmlFor="edit-deskripsi" className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
          <textarea
            id="edit-deskripsi" rows="4" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)}
            className="w-full px-4 py-3 bg-neum-bg rounded-lg shadow-neum-in focus:outline-none focus:ring-2 focus:ring-accent-yellow"
          ></textarea>
        </div>
        <div>
          <label htmlFor="edit-tipe" className="block text-sm font-medium text-gray-700 mb-2">Tipe</label>
          <select
            id="edit-tipe" value={tipe} onChange={(e) => setTipe(e.target.value)}
            className="w-full px-4 py-3 bg-neum-bg rounded-lg shadow-neum-in focus:outline-none appearance-none focus:ring-2 focus:ring-accent-yellow"
          >
            <option value="materi">Materi</option>
            <option value="tugas">Tugas</option>
          </select>
        </div>
        {tipe === 'tugas' && (
          <div>
            <label htmlFor="edit-deadline" className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
            <input
              type="date" id="edit-deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-3 bg-neum-bg rounded-lg shadow-neum-in focus:outline-none focus:ring-2 focus:ring-accent-yellow"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">File yang Sudah Ada</label>
          {existingFiles.length > 0 ? (
            <div className="p-3 bg-neum-bg rounded-lg shadow-neum-in space-y-2">
              {existingFiles.map((file) => (
                <div key={file.path} className="flex justify-between items-center text-sm text-gray-600">
                  <span className="flex items-center truncate"><HiPaperClip className="mr-2" /> {file.originalName}</span>
                  <button type="button" onClick={() => removeExistingFile(file.path)} className="text-accent-red hover:text-red-700">
                    <HiX />
                  </button>
                </div>
              ))}
            </div>
          ) : <p className="text-xs text-gray-500 italic">Tidak ada file.</p>}
        </div>

        <div>
          <label htmlFor="edit-fileMateri" className="block text-sm font-medium text-gray-700 mb-2">Tambah File Baru</label>
          <input
            type="file" id="edit-fileMateri" multiple onChange={handleFileChange}
            className="w-full file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold
                       file:bg-neum-bg file:text-gray-700 file:shadow-neum-out file:hover:shadow-neum-out-hover"
          />
        </div>
        
        {newFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">File baru yang akan diupload:</h4>
            <div className="p-3 bg-neum-bg rounded-lg shadow-neum-in space-y-2">
              {newFiles.map((file, index) => (
                <div key={index} className="flex justify-between items-center text-sm text-gray-600">
                  <span className="flex items-center truncate"><HiPaperClip className="mr-2" /> {file.name}</span>
                  <button type="button" onClick={() => removeNewFile(index)} className="text-accent-red hover:text-red-700">
                    <HiX />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-neum-bg text-accent-green font-semibold rounded-lg shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active"
          >
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
        {error && <p className="text-accent-red text-center mt-2">{error}</p>}
      </form>
    </Modal>
  );
}

export default EditMateriModal;