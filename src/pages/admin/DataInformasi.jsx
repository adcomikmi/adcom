// src/pages/admin/DataInformasi.jsx
import React, { useState } from 'react';
import AddMember from '../../components/admin/AddMember';
import ViewMembers from '../../components/admin/ViewMembers';
import ViewFeedback from '../../components/admin/ViewFeedback';
import ViewSubmissions from '../../components/admin/ViewSubmissions';

function DataInformasi() {
  const [activeTab, setActiveTab] = useState('addMember');

  const getTabClass = (tabName) => {
    return `px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${activeTab === tabName 
              ? 'shadow-neum-out text-accent-yellow' 
              : 'text-gray-600'
            }`;
  };

  return (
    <div className="flex justify-center py-12 px-4">
      <div className="p-6 md:p-8 bg-neum-bg rounded-xl shadow-neum-out w-full max-w-5xl overflow-hidden border-t-4 border-accent-yellow">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-8 text-center">
          Data Informasi
        </h1>
        
        <div className="mb-6">
          <div className="flex flex-wrap space-x-2 p-2 bg-neum-bg rounded-lg shadow-neum-in w-fit mx-auto md:mx-0">
            <button
              onClick={() => setActiveTab('addMember')}
              className={getTabClass('addMember')}
            >
              Tambah Anggota
            </button>
            <button
              onClick={() => setActiveTab('viewMembers')}
              className={getTabClass('viewMembers')}
            >
              Lihat Anggota
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={getTabClass('feedback')}
            >
              Saran & Kritik
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={getTabClass('submissions')}
            >
              Informasi Jawaban
            </button>
          </div>
        </div>
        
        {activeTab === 'addMember' && <AddMember />}
        {activeTab === 'viewMembers' && <ViewMembers />}
        {activeTab === 'feedback' && <ViewFeedback />}
        {activeTab === 'submissions' && <ViewSubmissions />}
        
      </div>
    </div>
  );
}

export default DataInformasi;