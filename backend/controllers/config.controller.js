// backend/controllers/config.controller.js
import SiteConfig from '../models/SiteConfig.model.js';
import { cloudinary } from '../config/cloudinary.config.js';

const getConfig = async () => {
  let config = await SiteConfig.findOne();
  if (!config) {
    config = await SiteConfig.create({});
  }
  return config;
};

export const getHomeConfig = async (req, res) => {
  try {
    const config = await getConfig();
    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateHomeConfig = async (req, res) => {
  const { 
    heroTitle, heroSubtitle, existingImages, existingLogoPublicId,
    aboutVisi, aboutMisi, aboutFeatures, instagramUrl,
    adminWelcomeMessage
  } = req.body;
  
  const newHeroFiles = req.files?.newHeroImages || [];
  const newLogoFile = req.files?.newLogoImage ? req.files.newLogoImage[0] : null;
  
  try {
    const config = await getConfig();

    config.heroTitle = heroTitle || config.heroTitle;
    config.heroSubtitle = heroSubtitle || config.heroSubtitle;

    let finalImages = existingImages ? JSON.parse(existingImages) : [];
    const existingPublicIds = finalImages.map(img => img.public_id);
    const imagesToDelete = config.heroImages.filter(
      img => !existingPublicIds.includes(img.public_id)
    );
    if (imagesToDelete.length > 0) {
      await Promise.all(imagesToDelete.map(img => cloudinary.uploader.destroy(img.public_id)));
    }
    if (newHeroFiles.length > 0) {
      finalImages.push(...newHeroFiles.map(file => ({
        public_id: file.filename,
        url: file.path
      })));
    }
    config.heroImages = finalImages.slice(0, 5);

    if (newLogoFile) {
      if (config.logoImage?.public_id) {
        await cloudinary.uploader.destroy(config.logoImage.public_id);
      }
      config.logoImage = { public_id: newLogoFile.filename, url: newLogoFile.path };
    } else if (!existingLogoPublicId) {
      if (config.logoImage?.public_id) {
        await cloudinary.uploader.destroy(config.logoImage.public_id);
      }
      config.logoImage = null;
    }

    config.aboutVisi = aboutVisi || config.aboutVisi;
    config.instagramUrl = instagramUrl || config.instagramUrl;
    if (aboutMisi) {
      config.aboutMisi = JSON.parse(aboutMisi);
    }
    if (aboutFeatures) {
      config.aboutFeatures = JSON.parse(aboutFeatures);
    }
    
    config.adminWelcomeMessage = adminWelcomeMessage || config.adminWelcomeMessage;

    const updatedConfig = await config.save();
    res.status(200).json(updatedConfig);

  } catch (error) {
    res.status(500).json({ message: 'Gagal update config', error: error.message });
  }
};