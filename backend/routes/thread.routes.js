// backend/routes/thread.routes.js
import express from 'express';
import { 
  createThread, 
  getAllThreads, 
  getThreadById,
  postReply,
  toggleLikeThread,
  updateThread,
  deleteThread
} from '../controllers/thread.controller.js';
import { protect } from '../middleware/checkAuth.js';

const router = express.Router();

router.route('/')
  .post(protect, createThread)
  .get(protect, getAllThreads);

router.route('/:threadId')
  .get(protect, getThreadById)
  .put(protect, updateThread)
  .delete(protect, deleteThread);

router.route('/:threadId/reply')
  .post(protect, postReply);

router.route('/:threadId/like')
  .put(protect, toggleLikeThread);

export default router;