// backend/controllers/submission.controller.js
import Submission from '../models/Submission.model.js';
import MateriTugas from '../models/MateriTugas.model.js';
import { google } from 'googleapis';
import path from 'path';
import { Readable } from 'stream';

// Konfigurasi sama dengan MateriController
const KEYFILEPATH = path.join(process.cwd(), 'backend', 'config', 'google-drive.json');
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const FOLDER_ID = '1An2f8YiRF83OO4G35Y5fEjdeqCH41esC';

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

const uploadToDrive = async (fileBuffer, fileName, mimeType) => {
  const bufferStream = new Readable();
  bufferStream.push(fileBuffer);
  bufferStream.push(null);

  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [FOLDER_ID],
    },
    media: {
      mimeType: mimeType,
      body: bufferStream,
    },
    fields: 'id, name, webViewLink, webContentLink',
  });

  await drive.permissions.create({
    fileId: response.data.id,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  return response.data;
};

export const submitTugas = async (req, res) => {
  const { tugasId } = req.params;
  const files = req.files;
  const userId = req.user._id;

  if (!files || files.length === 0) {
    return res.status(400).json({ message: 'Anda harus mengupload setidaknya satu file' });
  }

  try {
    const tugas = await MateriTugas.findById(tugasId);
    if (!tugas) return res.status(404).json({ message: 'Tugas tidak ditemukan' });
    
    // Upload ke Drive
    const uploadPromises = files.map(async (file) => {
      // Format: Sub-[NIM]-[JudulTugas]
      const userNim = req.user.nim || 'NoNIM';
      const cleanJudul = tugas.judul.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 15);
      const ext = path.extname(file.originalname);

      const finalFileName = `Sub-${userNim}-${cleanJudul}${ext}`;

      const driveData = await uploadToDrive(file.buffer, finalFileName, file.mimetype);

      return {
        originalName: finalFileName,
        path: driveData.webViewLink, // Simpan Link Drive
        driveId: driveData.id 
      };
    });
    const uploadedFiles = await Promise.all(uploadPromises);

    let existingSubmission = await Submission.findOne({ tugasId, userId });

    if (existingSubmission) {
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
    if (!submission) return res.status(404).json({ message: 'Submission tidak ditemukan' });
    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const downloadSubmissionFile = async (req, res) => {
  res.status(200).json({ message: "Gunakan link langsung dari data." });
};