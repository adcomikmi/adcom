// backend/routes/submission.routes.js
import express from 'express';
import { submitTugas, getAllSubmissions, getSubmissionById, downloadSubmissionFile } from '../controllers/submission.controller.js';
import { protect, adminOnly } from '../middleware/checkAuth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(protect, adminOnly, getAllSubmissions);

router.route('/:submissionId')
  .get(protect, adminOnly, getSubmissionById);

router.route('/:tugasId/submit')
  .post(protect, upload.array('submissionFiles', 10), submitTugas);

router.route('/download/*')
  .get(protect, adminOnly, downloadSubmissionFile);

export default router;