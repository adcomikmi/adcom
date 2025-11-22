// backend/controllers/materi.controller.js
import MateriTugas from '../models/MateriTugas.model.js';
import Submission from '../models/Submission.model.js';
import { google } from 'googleapis';
import path from 'path';
import { Readable } from 'stream';

// --- KONFIGURASI GOOGLE DRIVE ---
// Pastikan file 'google-drive.json' sudah ada di folder backend/config/
const KEYFILEPATH = path.join(process.cwd(), 'backend', 'config', 'google-drive.json');
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const FOLDER_ID = '1An2f8YiRF83OO4G35Y5fEjdeqCH41esC'; // ID Folder yang Anda berikan

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

// Fungsi Upload ke Google Drive
const uploadToDrive = async (fileBuffer, fileName, mimeType) => {
  const bufferStream = new Readable();
  bufferStream.push(fileBuffer);
  bufferStream.push(null);

  const response = await drive.files.create({
    requestBody: {
      name: fileName, // Nama file baru
      parents: [FOLDER_ID], // Upload ke folder khusus
    },
    media: {
      mimeType: mimeType,
      body: bufferStream,
    },
    fields: 'id, name, webViewLink, webContentLink',
  });

  // Ubah permission jadi Public agar bisa didownload siapa saja
  await drive.permissions.create({
    fileId: response.data.id,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  return response.data;
};

// --- 1. CREATE (Upload Materi) ---
export const createMateriTugas = async (req, res) => {
  const { judul, deskripsi, tipe, deadline } = req.body;
  const files = req.files;

  if (!judul || !deskripsi || !tipe) {
    return res.status(400).json({ message: 'Judul, deskripsi, dan tipe wajib diisi' });
  }

  let uploadedFiles = [];

  if (files && files.length > 0) {
    try {
      const uploadPromises = files.map(async (file) => {
        // LOGIKA RENAME: [Tipe]-[Judul].[ext]
        // Ganti spasi dengan strip, hapus karakter aneh
        const cleanJudul = judul.replace(/[^a-zA-Z0-9]/g, '-'); 
        const cleanTipe = tipe.replace(/[^a-zA-Z0-9]/g, '-');
        const ext = path.extname(file.originalname);
        
        // Contoh hasil: Materi-Belajar-React-Dasar.pdf
        const finalFileName = `${cleanTipe}-${cleanJudul}${ext}`;

        // Upload
        const driveData = await uploadToDrive(file.buffer, finalFileName, file.mimetype);

        return {
          originalName: finalFileName,
          // Gunakan webViewLink untuk preview atau webContentLink untuk auto-download
          path: driveData.webViewLink, 
          driveId: driveData.id 
        };
      });

      uploadedFiles = await Promise.all(uploadPromises);
    } catch (uploadError) {
      console.error("Upload Error:", uploadError);
      return res.status(500).json({ message: 'Gagal upload ke Google Drive', error: uploadError.message });
    }
  }

  try {
    const materi = await MateriTugas.create({
      judul, deskripsi, tipe,
      deadline: tipe === 'tugas' ? deadline : null,
      createdBy: req.user._id,
      files: uploadedFiles,
    });
    res.status(201).json(materi);
  } catch (error) {
    res.status(500).json({ message: 'Server error saat membuat materi' });
  }
};

// --- 2. GET ALL ---
export const getAllMateriTugas = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    const totalItems = await MateriTugas.countDocuments();
    
    const materiData = await MateriTugas.find({})
      .populate('createdBy', 'nama')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean(); 

    let submissionsMap = new Map();
    if (req.user && req.user.role === 'member') {
      const tugasIds = materiData.filter(m => m.tipe === 'tugas').map(m => m._id);
      const submissions = await Submission.find({
        userId: req.user._id,
        tugasId: { $in: tugasIds }
      }).select('tugasId');
      
      submissions.forEach(sub => {
        submissionsMap.set(sub.tugasId.toString(), true);
      });
    }

    const materiWithStatus = materiData.map(materi => ({
      ...materi,
      isSubmitted: materi.tipe === 'tugas' ? submissionsMap.get(materi._id.toString()) || false : undefined,
    }));

    res.status(200).json({
      materi: materiWithStatus,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error saat mengambil materi' });
  }
};

// --- 3. DOWNLOAD (Redirect ke Drive) ---
export const downloadMateriFile = async (req, res) => {
  // Karena frontend akan langsung menggunakan link dari database,
  // endpoint ini hanya sebagai fallback.
  res.status(200).json({ message: "Silakan gunakan link langsung." });
};

// --- 4. GET BY ID ---
export const getMateriById = async (req, res) => {
  try {
    const materi = await MateriTugas.findById(req.params.materiId);
    if (!materi) {
      return res.status(404).json({ message: 'Materi tidak ditemukan' });
    }
    res.status(200).json(materi);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// --- 5. UPDATE ---
export const updateMateri = async (req, res) => {
    // Fitur update file di Drive dimatikan sementara untuk penyederhanaan
    // Hanya update data teks di DB
    const { judul, deskripsi, tipe, deadline, existingFiles } = req.body;
    try {
      const materi = await MateriTugas.findById(req.params.materiId);
      if (!materi) return res.status(404).json({ message: 'Materi tidak ditemukan' });

      // Update Text Data
      materi.judul = judul || materi.judul;
      materi.deskripsi = deskripsi || materi.deskripsi;
      materi.tipe = tipe || materi.tipe;
      materi.deadline = deadline;
      
      // Jika ada file baru yang diupload lewat form edit, logika upload sama dengan create
      // (Untuk saat ini kita skip bagian upload file baru di edit agar tidak error)
      
      const savedMateri = await materi.save();
      res.status(200).json(savedMateri);
    } catch (error) {
      res.status(500).json({ message: 'Gagal update materi' });
    }
};

// --- 6. DELETE ---
export const deleteMateri = async (req, res) => {
  try {
    const materi = await MateriTugas.findById(req.params.materiId);
    if (!materi) {
      return res.status(404).json({ message: 'Materi tidak ditemukan' });
    }
    
    // Hapus data submission dan materi dari DB
    // File di Drive tidak dihapus otomatis (agar aman)
    await Submission.deleteMany({ tugasId: materi._id });
    await materi.deleteOne();

    res.status(200).json({ message: 'Materi berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Server error saat menghapus materi' });
  }
};