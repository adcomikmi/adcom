// backend/routes/chatTemplate.routes.js
import express from 'express';
import { getAllTemplates, createTemplate, updateTemplate, deleteTemplate } from '../controllers/chatTemplate.controller.js';
import { protect, adminOnly } from '../middleware/checkAuth.js';

const router = express.Router();

router.route('/')
  .get(protect, adminOnly, getAllTemplates)
  .post(protect, adminOnly, createTemplate);

router.route('/:templateId')
  .put(protect, adminOnly, updateTemplate)
  .delete(protect, adminOnly, deleteTemplate);

export default router;