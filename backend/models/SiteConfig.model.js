// backend/models/SiteConfig.model.js
import { Schema, model } from 'mongoose';

const heroImageSchema = new Schema({
  public_id: { type: String, required: true },
  url: { type: String, required: true },
});

const featureSchema = new Schema({
  icon: { type: String, default: 'HiOutlineCode' },
  title: { type: String, default: 'Fitur' },
  description: { type: String, default: 'Deskripsi fitur...' },
});

const configSchema = new Schema({
  heroTitle: {
    type: String,
    default: 'Selamat Datang di ADCOM IKMI',
  },
  heroSubtitle: {
    type: String,
    default: 'Komunitas Android Developer terbaik di kampus.',
  },
  heroImages: {
    type: [heroImageSchema],
    validate: [v => v.length <= 5, 'Tidak boleh lebih dari 5 gambar hero.'],
    default: []
  },
  logoImage: {
    public_id: String,
    url: String,
  },
  aboutVisi: { 
    type: String, 
    default: 'Menjadi komunitas developer terdepan yang inovatif, kolaboratif, dan berdampak positif bagi lingkungan akademik dan industri.' 
  },
  aboutMisi: { 
    type: [String], 
    default: [
      'Mengadakan pelatihan dan workshop rutin.',
      'Membangun proyek kolaboratif untuk portofolio.',
      'Menciptakan ruang diskusi yang aktif dan suportif.'
    ] 
  },
  aboutFeatures: {
    type: [featureSchema],
    default: [
      { icon: 'HiOutlineCode', title: 'Ngoding Bareng', description: 'Sesi coding bersama memecahkan masalah.' },
      { icon: 'HiOutlinePresentationChartLine', title: 'Workshop', description: 'Belajar teknologi baru dari para ahli.' },
      { icon: 'HiOutlineUsers', title: 'Membangun Relasi', description: 'Bertemu teman baru dan mentor.' },
    ]
  },
  instagramUrl: {
    type: String,
    default: 'https://www.instagram.com/adcom_official/'
  },
  adminWelcomeMessage: {
    type: String,
    default: '## Selamat Datang di Admin Panel!\n\nDi sini Anda bisa mengelola seluruh konten website ADCOM.\n\n* **Upload Materi:** Untuk menambah materi & tugas baru.\n* **Data Informasi:** Untuk mengelola anggota dan melihat feedback.\n* **Modif Website:** Untuk mengubah tampilan halaman ini.'
  }
});

const SiteConfig = model('SiteConfig', configSchema);
export default SiteConfig;