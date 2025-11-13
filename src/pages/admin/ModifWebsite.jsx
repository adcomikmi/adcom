// src/pages/admin/ModifWebsite.jsx
import React, { useState, useEffect } from 'react';
import { getHomeConfig, updateHomeConfig } from '../../services/api';
import { HiPaperClip, HiX, HiOutlineInformationCircle, HiPlus, HiTrash } from 'react-icons/hi';

function ModifWebsite() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  const [config, setConfig] = useState(null);
  
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroImages, setHeroImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [logoImage, setLogoImage] = useState(null);
  const [newLogoFile, setNewLogoFile] = useState(null);
  
  const [aboutVisi, setAboutVisi] = useState('');
  const [aboutMisi, setAboutMisi] = useState([]);
  const [aboutFeatures, setAboutFeatures] = useState([]);
  const [instagramUrl, setInstagramUrl] = useState('');

  const [adminWelcomeMessage, setAdminWelcomeMessage] = useState('');

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const data = await getHomeConfig();
        setConfig(data);
        
        setHeroTitle(data.heroTitle);
        setHeroSubtitle(data.heroSubtitle);
        setHeroImages(data.heroImages || []);
        setLogoImage(data.logoImage || null);
        
        setAboutVisi(data.aboutVisi);
        setAboutMisi(data.aboutMisi || []);
        setAboutFeatures(data.aboutFeatures || []);
        setInstagramUrl(data.instagramUrl);

        setAdminWelcomeMessage(data.adminWelcomeMessage || '');
        
      } catch (err) {
        setMessage({ type: 'error', text: err.toString() });
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleHeroImageChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (heroImages.length + newImageFiles.length + files.length > 5) {
        setMessage({ type: 'error', text: 'Maksimal 5 gambar hero.' });
        return;
      }
      setNewImageFiles(prev => [...prev, ...files]);
    }
  };

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewLogoFile(e.target.files[0]);
      setLogoImage(null);
    }
  };

  const removeExistingHero = (public_id) => setHeroImages(prev => prev.filter(img => img.public_id !== public_id));
  const removeNewHero = (index) => setNewImageFiles(prev => prev.filter((_, i) => i !== index));
  const removeLogo = () => { setNewLogoFile(null); setLogoImage(null); };

  const handleFeatureChange = (index, field, value) => {
    const updatedFeatures = aboutFeatures.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setAboutFeatures(updatedFeatures);
  };
  
  const handleMisiChange = (index, value) => {
    const updatedMisi = [...aboutMisi];
    updatedMisi[index] = value;
    setAboutMisi(updatedMisi);
  };

  const addMisi = () => setAboutMisi([...aboutMisi, '']);
  const removeMisi = (index) => setAboutMisi(aboutMisi.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    
    const formData = new FormData();
    
    formData.append('heroTitle', heroTitle);
    formData.append('heroSubtitle', heroSubtitle);
    formData.append('existingImages', JSON.stringify(heroImages));
    newImageFiles.forEach(file => formData.append('newHeroImages', file));

    if (newLogoFile) {
      formData.append('newLogoImage', newLogoFile);
    } else if (logoImage) {
      formData.append('existingLogoPublicId', logoImage.public_id);
    }
    
    formData.append('aboutVisi', aboutVisi);
    formData.append('instagramUrl', instagramUrl);
    formData.append('aboutMisi', JSON.stringify(aboutMisi.filter(Boolean)));
    formData.append('aboutFeatures', JSON.stringify(aboutFeatures));

    formData.append('adminWelcomeMessage', adminWelcomeMessage);

    try {
      const updatedConfig = await updateHomeConfig(formData);
      setConfig(updatedConfig);
      
      setHeroTitle(updatedConfig.heroTitle);
      setHeroSubtitle(updatedConfig.heroSubtitle);
      setHeroImages(updatedConfig.heroImages || []);
      setLogoImage(updatedConfig.logoImage || null);
      setAboutVisi(updatedConfig.aboutVisi);
      setAboutMisi(updatedConfig.aboutMisi || []);
      setAboutFeatures(updatedConfig.aboutFeatures || []);
      setInstagramUrl(updatedConfig.instagramUrl);
      setAdminWelcomeMessage(updatedConfig.adminWelcomeMessage || '');

      setNewImageFiles([]);
      setNewLogoFile(null);
      setMessage({ type: 'success', text: 'Perubahan berhasil disimpan!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.toString() });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center pt-20">Loading...</p>;

  const getTabClass = (tabName) => `px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tabName ? 'shadow-neum-out text-accent-blue' : 'text-gray-600'}`;

  const getLogoPreview = () => (newLogoFile ? URL.createObjectURL(newLogoFile) : logoImage?.url);

  return (
    <div className="flex justify-center py-12 px-4">
      <div className="p-6 md:p-8 bg-neum-bg rounded-xl shadow-neum-out w-full max-w-3xl overflow-hidden border-t-4 border-accent-blue">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-8 text-center">
          Modifikasi Website
        </h1>
        
        <div className="mb-6">
          <div className="flex flex-wrap space-x-2 p-2 bg-neum-bg rounded-lg shadow-neum-in w-fit">
            <button onClick={() => setActiveTab('home')} className={getTabClass('home')}>Halaman Home</button>
            <button onClick={() => setActiveTab('tentang')} className={getTabClass('tentang')}>Halaman Tentang</button>
            <button onClick={() => setActiveTab('adminHome')} className={getTabClass('adminHome')}>Admin Home</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {activeTab === 'home' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="logoImage" className="block text-sm font-medium text-gray-700 mb-2">Logo Website</label>
                <input
                  type="file" id="logoImage" onChange={handleLogoChange} accept="image/*"
                  className="w-full file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold
                             file:bg-neum-bg file:text-gray-700 file:shadow-neum-out file:hover:shadow-neum-out-hover"
                />
                <div className="flex items-center text-xs text-gray-500 mt-2 p-2 bg-neum-bg shadow-neum-in rounded-lg">
                  <HiOutlineInformationCircle className="h-5 w-5 mr-2 text-accent-blue flex-shrink-0" />
                  <span>Rekomendasi: Rasio aspek <strong>1:1</strong> (persegi).</span>
                </div>
              </div>
              {getLogoPreview() && (
                <div className="p-3 bg-neum-bg rounded-lg shadow-neum-in space-y-2 w-fit">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span className="flex items-center truncate"><HiPaperClip className="mr-2" /> {newLogoFile?.name || logoImage?.public_id}</span>
                    <button type="button" onClick={removeLogo} className="text-accent-red hover:text-red-700 ml-4"><HiX /></button>
                  </div>
                  <img src={getLogoPreview()} alt="Logo Preview" className="w-24 h-24 object-cover rounded-lg" />
                </div>
              )}
              
              <hr className="my-6 border-gray-300/50" />
              
              <div>
                <label htmlFor="heroTitle" className="block text-sm font-medium text-gray-700 mb-2">Judul Hero</label>
                <input
                  type="text" id="heroTitle" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-neum-bg rounded-lg shadow-neum-in focus:outline-none focus:ring-2 focus:ring-accent-blue"
                />
              </div>
              <div>
                <label htmlFor="heroSubtitle" className="block text-sm font-medium text-gray-700 mb-2">Subjudul Hero</label>
                <textarea
                  id="heroSubtitle" rows="3" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="w-full px-4 py-3 bg-neum-bg rounded-lg shadow-neum-in focus:outline-none focus:ring-2 focus:ring-accent-blue"
                ></textarea>
              </div>
              <div>
                <label htmlFor="heroImage" className="block text-sm font-medium text-gray-700 mb-2">Gambar Hero (Maks 5)</label>
                <input
                  type="file" id="heroImage" onChange={handleHeroImageChange} accept="image/*" multiple
                  className="w-full file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold
                             file:bg-neum-bg file:text-gray-700 file:shadow-neum-out file:hover:shadow-neum-out-hover"
                  disabled={heroImages.length + newImageFiles.length >= 5}
                />
                <div className="flex items-center text-xs text-gray-500 mt-2 p-2 bg-neum-bg shadow-neum-in rounded-lg">
                  <HiOutlineInformationCircle className="h-5 w-5 mr-2 text-accent-blue flex-shrink-0" />
                  <span>Rekomendasi: Rasio aspek <strong>16:9</strong>.</span>
                </div>
              </div>
              
              {(heroImages.length > 0 || newImageFiles.length > 0) && (
                <div className="p-3 bg-neum-bg rounded-lg shadow-neum-in space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Daftar Gambar Hero:</h4>
                  {heroImages.map((img) => (
                    <div key={img.public_id} className="flex justify-between items-center text-sm text-gray-600">
                      <span className="flex items-center truncate"><HiPaperClip className="mr-2" /> {img.public_id}</span>
                      <button type="button" onClick={() => removeExistingHero(img.public_id)} className="text-accent-red hover:text-red-700">
                        <HiX />
                      </button>
                    </div>
                  ))}
                  {newImageFiles.map((file, index) => (
                    <div key={index} className="flex justify-between items-center text-sm text-gray-600">
                      <span className="flex items-center truncate"><HiPaperClip className="mr-2" /> {file.name} (Baru)</span>
                      <button type="button" onClick={() => removeNewHero(index)} className="text-accent-red hover:text-red-700">
                        <HiX />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'tentang' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="instagramUrl" className="block text-sm font-medium text-gray-700 mb-2">Link Instagram (Tombol Daftar)</label>
                <input
                  type="url" id="instagramUrl" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-neum-bg rounded-lg shadow-neum-in focus:outline-none focus:ring-2 focus:ring-accent-blue"
                />
              </div>
              <div>
                <label htmlFor="aboutVisi" className="block text-sm font-medium text-gray-700 mb-2">Visi Kami</label>
                <textarea
                  id="aboutVisi" rows="3" value={aboutVisi} onChange={(e) => setAboutVisi(e.target.value)}
                  className="w-full px-4 py-3 bg-neum-bg rounded-lg shadow-neum-in focus:outline-none focus:ring-2 focus:ring-accent-blue"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Misi Kami (Poin-poin)</label>
                <div className="p-3 bg-neum-bg rounded-lg shadow-neum-in space-y-2">
                  {aboutMisi.map((misi, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text" value={misi} onChange={(e) => handleMisiChange(index, e.target.value)}
                        className="w-full px-3 py-2 bg-neum-bg rounded-lg shadow-neum-in focus:outline-none"
                      />
                      <button type="button" onClick={() => removeMisi(index)} className="text-accent-red hover:text-red-700">
                        <HiTrash />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={addMisi} className="text-sm font-medium text-accent-blue hover:underline">
                    <HiPlus className="inline h-4 w-4 mr-1" /> Tambah Poin Misi
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">3 Fitur Unggulan</label>
                <div className="p-3 bg-neum-bg rounded-lg shadow-neum-in space-y-4">
                  {aboutFeatures.slice(0, 3).map((feature, index) => (
                    <div key={index} className="space-y-2 p-2 border border-gray-300/50 rounded-lg">
                      <h4 className="font-semibold text-gray-700">Box {index + 1}</h4>
                      <input
                        type="text" value={feature.icon} onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                        placeholder="Nama Ikon (cth: HiOutlineCode)"
                        className="w-full px-3 py-2 bg-neum-bg rounded-lg shadow-neum-in focus:outline-none"
                      />
                      <input
                        type="text" value={feature.title} onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                        placeholder="Judul Fitur"
                        className="w-full px-3 py-2 bg-neum-bg rounded-lg shadow-neum-in focus:outline-none"
                      />
                      <textarea
                        rows="2" value={feature.description} onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                        placeholder="Deskripsi Fitur"
                        className="w-full px-3 py-2 bg-neum-bg rounded-lg shadow-neum-in focus:outline-none"
                      ></textarea>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'adminHome' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="adminWelcome" className="block text-sm font-medium text-gray-700 mb-2">
                  Pesan Selamat Datang (Admin Dashboard)
                </label>
                <textarea
                  id="adminWelcome"
                  rows="10"
                  value={adminWelcomeMessage}
                  onChange={(e) => setAdminWelcomeMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-neum-bg rounded-lg shadow-neum-in focus:outline-none focus:ring-2 focus:ring-accent-blue"
                ></textarea>
                <div className="flex items-center text-xs text-gray-500 mt-2 p-2 bg-neum-bg shadow-neum-in rounded-lg">
                  <HiOutlineInformationCircle className="h-5 w-5 mr-2 text-accent-blue flex-shrink-0" />
                  <span>Anda bisa menggunakan format Markdown (cth: `## Judul`, `* list`) di sini.</span>
                </div>
              </div>
            </div>
          )}

          <hr className="my-6 border-gray-300/50" />
          <button
            type="submit" disabled={saving}
            className="w-full py-3 px-4 bg-neum-bg text-accent-green font-semibold rounded-lg shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active transition-all duration-150 disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
          
          {message && (
            <p className={`text-center ${message.type === 'success' ? 'text-accent-green' : 'text-accent-red'}`}>
              {message.text}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default ModifWebsite;