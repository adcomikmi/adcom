// backend/controllers/submission.controller.js
import Submission from '../models/Submission.model.js';
import MateriTugas from '../models/MateriTugas.model.js';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = `https://` + process.env.SUPABASE_PROJECT_ID + `.supabase.co`;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME;

export const submitTugas = async (req, res) => {
  const { tugasId } = req.params;
  const files = req.files;
  const userId = req.user._id;

  if (!files || files.length === 0) {
    return res.status(400).json({ message: 'Anda harus mengupload setidaknya satu file' });
  }

  try {
    const tugas = await MateriTugas.findById(tugasId);
    if (!tugas) {
      return res.status(404).json({ message: 'Tugas tidak ditemukan' });
    }
    if (tugas.deadline && new Date(tugas.deadline) < new Date()) {
      return res.status(400).json({ message: 'Deadline telah terlewat' });
    }
    
    const uploadPromises = files.map(async (file) => {
      const fileName = `submissions/${tugasId}/${userId}/${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file.buffer, { contentType: file.mimetype });
      if (error) { throw new Error(`Gagal upload file: ${file.originalname}`); }
      return { originalName: file.originalname, path: fileName };
    });
    const uploadedFiles = await Promise.all(uploadPromises);

    let existingSubmission = await Submission.findOne({ tugasId, userId });

    if (existingSubmission) {
      const oldFilePaths = existingSubmission.files.map(f => f.path);
      if (oldFilePaths.length > 0) {
        await supabase.storage.from(BUCKET_NAME).remove(oldFilePaths);
      }
      existingSubmission.files = uploadedFiles;
      existingSubmission.submittedAt = new Date();
      await existingSubmission.save();
      res.status(200).json(existingSubmission);
    } else {
      const newSubmission = await Submission.create({
        tugasId,
        userId,
        files: uploadedFiles,
      });
      res.status(201).json(newSubmission);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error saat submit tugas', error: error.message });
  }
};

export const getAllSubmissions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const totalItems = await Submission.countDocuments();
    const submissions = await Submission.find({})
      .populate('userId', 'namaAsli nim')
      .populate('tugasId', 'judul')
      .sort({ submittedAt: -1 })
      .limit(limit)
      .skip(skip);
    res.status(200).json({
      submissions,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error saat mengambil submissions' });
  }
};

export const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.submissionId)
      .populate('userId', 'namaAsli nim')
      .populate('tugasId', 'judul');
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission tidak ditemukan' });
    }
    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Server error saat mengambil detail submission' });
  }
};

export const downloadSubmissionFile = async (req, res) => {
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