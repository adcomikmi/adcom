// backend/routes/materi.routes.js
import express from 'express';
import { 
  createMateriTugas, 
  getAllMateriTugas, 
  downloadMateriFile,
  getMateriById,
  updateMateri,
  deleteMateri
} from '../controllers/materi.controller.js';
import { protect, adminOnly, getMemberStatus } from '../middleware/checkAuth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .post(protect, adminOnly, upload.array('fileMateri', 10), createMateriTugas)
  .get(getMemberStatus, getAllMateriTugas);

// Ubah parameter menjadi fileId
router.route('/download/:fileId')
  .get(downloadMateriFile);

router.route('/:materiId')
  .get(protect, adminOnly, getMateriById)
  .put(protect, adminOnly, upload.array('fileMateri', 10), updateMateri)
  .delete(protect, adminOnly, deleteMateri);

export default router;