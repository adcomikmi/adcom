// backend/controllers/auth.controller.js

import User from '../models/User.model.js';
import Admin from '../models/Admin.model.js';
import jwt from 'jsonwebtoken';

const generateToken = (id, role, isFirstLogin) => {
  return jwt.sign({ id, role, isFirstLogin }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

export const loginUser = async (req, res) => {
  const { nim, password } = req.body;
  try {
    if (!nim || !password) {
      return res.status(400).json({ message: 'NIM dan password harus diisi' });
    }
    const user = await User.findOne({ nim });
    if (!user) {
      return res.status(401).json({ message: 'NIM tidak terdaftar' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Password salah' });
    }

    const token = generateToken(user._id, user.role, user.isFirstLogin);
    
    res.status(200).json({
      _id: user._id,
      namaAsli: user.namaAsli,
      nim: user.nim,
      photoUrl: user.photoUrl,
      isFirstLogin: user.isFirstLogin,
      role: user.role,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const googleCallback = (req, res) => {
  // 1. Buat token
  const token = generateToken(req.user._id, req.user.role, false);
  
  // 2. Siapkan data user
  const userData = {
    _id: req.user._id,
    nama: req.user.nama,
    email: req.user.email,
    role: req.user.role,
    token: token,
  };
  
  const userDataString = JSON.stringify(userData);
  
  res.send(`
    <script>
      if (window.opener) {
        window.opener.postMessage(${userDataString}, '*');
        window.close();
      } else {
        // Fallback jika popup diblokir atau dibuka di tab baru
        window.location.href = '${process.env.CLIENT_URL || "/"}';
      }
    </script>
  `);
};
