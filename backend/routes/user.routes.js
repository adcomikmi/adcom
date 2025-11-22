// backend/routes/user.routes.js
import express from 'express';
import { protect, adminOnly } from '../middleware/checkAuth.js';
import upload from '../middleware/upload.js';
import { addMember, addBulkMembers, changePassword, getAllMembers } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', protect, adminOnly, getAllMembers);
router.post('/add', protect, adminOnly, addMember);
router.post('/add-bulk', protect, adminOnly, upload.single('fileCSV'), addBulkMembers);

router.post('/change-password', protect, changePassword);

export default router;