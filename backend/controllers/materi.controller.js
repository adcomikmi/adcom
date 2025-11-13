// backend/controllers/materi.controller.js
import MateriTugas from '../models/MateriTugas.model.js';
import Submission from '../models/Submission.model.js';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = `https://` + process.env.SUPABASE_PROJECT_ID + `.supabase.co`;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
        const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
        const { data, error } = await supabase.storage
          .from(process.env.SUPABASE_BUCKET_NAME)
          .upload(fileName, file.buffer, { contentType: file.mimetype });
        if (error) { throw new Error(`Gagal upload file: ${file.originalname}`); }
        return { originalName: file.originalname, path: fileName };
      });
      uploadedFiles = await Promise.all(uploadPromises);
    } catch (uploadError) {
      return res.status(500).json({ message: uploadError.message || 'Gagal upload file ke Supabase' });
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

export const downloadMateriFile = async (req, res) => {
  try {
    const path = req.params[0];
    const { name } = req.query; 

    if (!path || !name) {
      return res.status(400).json({ message: 'Parameter file tidak lengkap' });
    }

    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET_NAME)
      .download(path);

    if (error) {
      throw error;
    }
    
    res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
    res.setHeader('Content-Type', data.type);

    const buffer = Buffer.from(await data.arrayBuffer());
    res.send(buffer);

  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ message: 'File tidak ditemukan di storage' });
    }
    res.status(500).json({ message: 'Gagal download file' });
  }
};


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

export const updateMateri = async (req, res) => {
  const { judul, deskripsi, tipe, deadline, existingFiles } = req.body;
  const newFiles = req.files;
  
  try {
    const materi = await MateriTugas.findById(req.params.materiId);
    if (!materi) {
      return res.status(404).json({ message: 'Materi tidak ditemukan' });
    }

    let updatedFiles = existingFiles ? JSON.parse(existingFiles) : [];

    const filesToKeep = updatedFiles.map(f => f.path);
    materi.files.forEach(async (file) => {
      if (!filesToKeep.includes(file.path)) {
        await supabase.storage.from(process.env.SUPABASE_BUCKET_NAME).remove([file.path]);
      }
    });

    if (newFiles && newFiles.length > 0) {
      const uploadPromises = newFiles.map(async (file) => {
        const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
        await supabase.storage.from(process.env.SUPABASE_BUCKET_NAME)
          .upload(fileName, file.buffer, { contentType: file.mimetype });
        return { originalName: file.originalname, path: fileName };
      });
      const newlyUploadedFiles = await Promise.all(uploadPromises);
      updatedFiles = [...updatedFiles, ...newlyUploadedFiles];
    }

    materi.judul = judul || materi.judul;
    materi.deskripsi = deskripsi || materi.deskripsi;
    materi.tipe = tipe || materi.tipe;
    materi.deadline = deadline;
    materi.files = updatedFiles;
    
    const savedMateri = await materi.save();
    res.status(200).json(savedMateri);

  } catch (error) {
    res.status(500).json({ message: 'Server error saat update materi', error: error.message });
  }
};

export const deleteMateri = async (req, res) => {
  try {
    const materi = await MateriTugas.findById(req.params.materiId);
    if (!materi) {
      return res.status(404).json({ message: 'Materi tidak ditemukan' });
    }

    if (materi.files && materi.files.length > 0) {
      const filePaths = materi.files.map(f => f.path);
      await supabase.storage.from(process.env.SUPABASE_BUCKET_NAME).remove(filePaths);
    }
    
    await Submission.deleteMany({ tugasId: materi._id });
    await materi.deleteOne();

    res.status(200).json({ message: 'Materi dan data terkait berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Server error saat menghapus materi' });
  }
};