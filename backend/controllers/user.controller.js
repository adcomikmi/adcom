// backend/controllers/user.controller.js
import User from '../models/User.model.js';
import csv from 'csv-parser';
import { Readable } from 'stream';

export const addMember = async (req, res) => {
  const { nim, namaAsli } = req.body;

  if (!nim || !namaAsli) {
    return res.status(400).json({ message: 'NIM dan Nama Asli wajib diisi' });
  }

  try {
    const userExists = await User.findOne({ nim });
    if (userExists) {
      return res.status(400).json({ message: 'NIM sudah terdaftar' });
    }

    const user = await User.create({
      nim,
      namaAsli,
      password: nim,
    });

    res.status(201).json({ _id: user._id, nim: user.nim, namaAsli: user.namaAsli });
  } catch (error) {
    res.status(500).json({ message: 'Server error saat menambah anggota' });
  }
};

export const addBulkMembers = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'File CSV tidak ditemukan' });
  }

  const results = [];
  const readableStream = new Readable();
  readableStream.push(req.file.buffer);
  readableStream.push(null);

  readableStream
    .pipe(csv({ mapHeaders: ({ header }) => header.trim() }))
    .on('data', (data) => {
      if (data.NIM && data.NamaAsli) {
        results.push({
          nim: data.NIM.trim(),
          namaAsli: data.NamaAsli.trim(),
          password: data.NIM.trim(),
        });
      }
    })
    .on('end', async () => {
      if (results.length === 0) {
        return res.status(400).json({ message: 'Format CSV salah. Butuh kolom NIM dan NamaAsli' });
      }
      
      try {
        const users = await User.insertMany(results, { ordered: false });
        res.status(201).json({ message: `${users.length} anggota berhasil ditambahkan.` });
      } catch (error) {
        res.status(500).json({ 
          message: `Error: ${error.writeErrors?.length || 0} anggota gagal ditambahkan (kemungkinan NIM duplikat).`,
          details: error.writeErrors 
        });
      }
    });
};

export const changePassword = async (req, res) => {
  const { newPassword } = req.body;
  const userId = req.user._id;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'Password minimal 6 karakter' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    user.password = newPassword;
    user.isFirstLogin = false;
    await user.save();

    res.status(200).json({ message: 'Password berhasil diubah. Silakan login kembali.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error saat mengubah password' });
  }
};

export const getAllMembers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error saat mengambil data anggota' });
  }
};