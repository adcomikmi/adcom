// backend/routes/reply.routes.js
import express from 'express';
import { 
  toggleLikeReply,
  updateReply,
  deleteReply,
  postNestedReply
} from '../controllers/reply.controller.js';
import { protect } from '../middleware/checkAuth.js';

const router = express.Router();

router.route('/:replyId')
  .put(protect, updateReply)
  .delete(protect, deleteReply);

router.route('/:replyId/like')
  .put(protect, toggleLikeReply);

router.route('/:parentReplyId/reply')
  .post(protect, postNestedReply);

export default router;