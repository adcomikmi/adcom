// backend/middleware/checkAuth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import Admin from '../models/Admin.model.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        req.user = await Admin.findById(decoded.id);
      }
      
      if (!req.user) {
         return res.status(401).json({ message: 'User tidak ditemukan' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token tidak valid, otorisasi gagal' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Tidak ada token, otorisasi gagal' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Akses ditolak, khusus admin' });
  }
};

export const getMemberStatus = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role === 'member') {
        req.user = await User.findById(decoded.id).select('-password');
      }
    } catch (error) {
    }
  }
  next();
};