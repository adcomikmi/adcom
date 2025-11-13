// backend/routes/feedback.routes.js
import express from 'express';
import { createFeedback, getAllFeedback, deleteFeedback } from '../controllers/feedback.controller.js';
import { protect, adminOnly } from '../middleware/checkAuth.js';

const router = express.Router();

router.route('/')
  .post(protect, createFeedback)
  .get(protect, adminOnly, getAllFeedback);

router.route('/:feedbackId')
  .delete(protect, adminOnly, deleteFeedback);

export default router;