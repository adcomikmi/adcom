// src/components/admin/AddMember.jsx
import React, { useState } from 'react';
import { addMember, addBulkMembers } from '../../services/api';
import { HiPaperClip, HiX } from 'react-icons/hi';

function AddMember() {
  const [nim, setNim] = useState('');
  const [namaAsli, setNamaAsli] = useState('');
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [loadingManual, setLoadingManual] = useState(false);
  const [loadingBulk, setLoadingBulk] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setLoadingManual(true);
    setMessage(null);
    setError(null);
    try {
      await addMember({ nim, namaAsli });
      setMessage(`Anggota ${namaAsli} berhasil ditambahkan!`);
      setNim('');
      setNamaAsli('');
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoadingManual(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setFile(e.dataTransfer.files[0]);
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Pilih file CSV terlebih dahulu');
      return;
    }
    setLoadingBulk(true);
    setMessage(null);
    setError(null);
    
    const formData = new FormData();
    formData.append('fileCSV', file);

    try {
      const data = await addBulkMembers(formData);
      setMessage(data.message);
      setFile(null);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoadingBulk(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="p-6 bg-neum-bg rounded-lg shadow-neum-in">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Tambah Satu-satu</h3>
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label htmlFor="nim" className="block text-sm font-medium text-gray-700 mb-2">NIM</label>
            <input
              type="text"
              id="nim"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              required
              className="w-full px-4 py-3 bg-neum-bg rounded-lg shadow-neum-in focus:outline-none focus:ring-2 focus:ring-accent-yellow"
            />
          </div>
          <div>
            <label htmlFor="namaAsli" className="block text-sm font-medium text-gray-700 mb-2">Nama Asli</label>
            <input
              type="text"
              id="namaAsli"
              value={namaAsli}
              onChange={(e) => setNamaAsli(e.target.value)}
              required
              className="w-full px-4 py-3 bg-neum-bg rounded-lg shadow-neum-in focus:outline-none focus:ring-2 focus:ring-accent-yellow"
            />
          </div>
          <button type="submit" disabled={loadingManual} className="w-full py-3 px-4 bg-neum-bg text-accent-yellow font-semibold rounded-lg shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active transition-all duration-150 disabled:opacity-50">
            {loadingManual ? 'Menyimpan...' : 'Tambah Anggota'}
          </button>
        </form>
      </div>

      <div className="p-6 bg-neum-bg rounded-lg shadow-neum-in">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Upload via CSV</h3>
        <form onSubmit={handleFileSubmit} className="space-y-4">
          <label 
            htmlFor="fileCSV" 
            className={`flex flex-col items-center justify-center w-full h-32 px-4 py-3 bg-neum-bg rounded-lg shadow-neum-in cursor-pointer
                        ${isDragging ? 'shadow-neum-out' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <p className="text-gray-500 text-sm">Drag & drop file CSV</p>
            <p className="text-gray-400 text-xs">(Kolom: NIM, NamaAsli)</p>
            {file && <p className="text-accent-green text-sm mt-2">{file.name}</p>}
            <input
              type="file"
              id="fileCSV"
              accept=".csv"
              onChange={handleFileChange}
              required
              className="opacity-0 w-0 h-0"
            />
          </label>
          <button type="submit" disabled={loadingBulk || !file} className="w-full py-3 px-4 bg-neum-bg text-accent-yellow font-semibold rounded-lg shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active transition-all duration-150 disabled:opacity-50">
            {loadingBulk ? 'Mengupload...' : 'Upload File'}
          </button>
        </form>
      </div>

      {message && <p className="text-accent-green text-center md:col-span-2">{message}</p>}
      {error && <p className="text-accent-red text-center md:col-span-2">{error}</p>}
    </div>
  );
}

export default AddMember;