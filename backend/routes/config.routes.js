// backend/routes/config.routes.js
import express from 'express';
import { getHomeConfig, updateHomeConfig } from '../controllers/config.controller.js';
import { protect, adminOnly } from '../middleware/checkAuth.js';
import { uploadImage } from '../config/cloudinary.config.js';

const router = express.Router();

router.route('/home')
  .get(getHomeConfig)
  .put(
    protect, 
    adminOnly, 
    uploadImage.fields([
      { name: 'newHeroImages', maxCount: 5 },
      { name: 'newLogoImage', maxCount: 1 }
    ]), 
    updateHomeConfig
  );

export default router;