// src/pages/admin/UploadMateri.jsx
import React, { useState } from 'react';
import { createMateriTugas } from '../../services/api';
import { HiPaperClip, HiX } from 'react-icons/hi';
import RiwayatMateri from '../../components/admin/RiwayatMateri';

function UploadMateri() {
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [tipe, setTipe] = useState('materi');
  const [deadline, setDeadline] = useState('');
  const [files, setFiles] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files)]);
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => { setIsDragging(false); };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      setFiles(prevFiles => [...prevFiles, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('deskripsi', deskripsi);
    formData.append('tipe', tipe);
    
    if (tipe === 'tugas') formData.append('deadline', deadline);
    
    if (files.length > 0) {
      files.forEach(file => {
        formData.append('fileMateri', file);
      });
    }

    try {
      await createMateriTugas(formData);
      setMessage('Materi/Tugas berhasil di-upload!');
      setJudul('');
      setDeskripsi('');
      setTipe('materi');
      setDeadline('');
      setFiles([]);
      e.target.reset();
      setRefreshKey(oldKey => oldKey + 1); 
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center py-12 px-4">
      <div className="p-6 md:p-8 bg-neum-bg rounded-xl shadow-neum-out w-full max-w-3xl overflow-hidden border-t-4 border-accent-green">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-8 text-center">
          Upload Materi atau Tugas Baru
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label htmlFor="judul" className="block text-sm font-medium text-gray-700 mb-2">Judul</label>
            <input
              type="text" id="judul" value={judul} onChange={(e) => setJudul(e.target.value)} required
              className="w-full px-4 py-3 bg-neum-bg rounded-lg shadow-neum-in focus:outline-none focus:ring-2 focus:ring-accent-green"
            />
          </div>

          <div>
            <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
            <textarea
              id="deskripsi" rows="4" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} required
              className="w-full px-4 py-3 bg-neum-bg rounded-lg shadow-neum-in focus:outline-none focus:ring-2 focus:ring-accent-green"
            ></textarea>
          </div>

          <div>
            <label htmlFor="tipe" className="block text-sm font-medium text-gray-700 mb-2">Tipe Konten</label>
            <select
              id="tipe" value={tipe} onChange={(e) => setTipe(e.target.value)}
              className="w-full px-4 py-3 bg-neum-bg rounded-lg shadow-neum-in focus:outline-none appearance-none focus:ring-2 focus:ring-accent-green"
            >
              <option value="materi">Materi</option>
              <option value="tugas">Tugas</option>
            </select>
          </div>

          {tipe === 'tugas' && (
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
              <input
                type="date" id="deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-3 bg-neum-bg rounded-lg shadow-neum-in focus:outline-none focus:ring-2 focus:ring-accent-green"
              />
            </div>
          )}

          <div>
            <label 
              htmlFor="fileMateri" 
              className={`flex flex-col items-center justify-center w-full h-32 px-4 py-3 bg-neum-bg rounded-lg shadow-neum-in cursor-pointer
                          ${isDragging ? 'shadow-neum-out' : ''}`}
              onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
            >
              <p className="text-gray-500 text-sm">Drag & drop file di sini</p>
              <p className="text-gray-400 text-xs">atau klik untuk pilih file (Bisa lebih dari satu)</p>
              <input
                type="file" id="fileMateri" multiple onChange={handleFileChange}
                className="opacity-0 w-0 h-0"
              />
            </label>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">File yang dipilih:</h4>
              <div className="p-4 bg-neum-bg rounded-lg shadow-neum-in space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex justify-between items-center text-sm text-gray-600">
                    <span className="flex items-center truncate"><HiPaperClip className="mr-2" /> {file.name}</span>
                    <button type="button" onClick={() => removeFile(index)} className="text-accent-red hover:text-red-700">
                      <HiX />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full py-3 px-4 bg-neum-bg text-accent-green font-semibold rounded-lg shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active transition-all duration-150 disabled:opacity-50"
          >
            {loading ? 'Mengupload...' : 'Upload Konten'}
          </button>

          {message && <p className="text-accent-green text-center">{message}</p>}
          {error && <p className="text-accent-red text-center">{error}</p>}
        </form>

        <hr className="my-12 border-gray-300/50" />
        
        <RiwayatMateri refreshKey={refreshKey} />

      </div>
    </div>
  );
}

export default UploadMateri;