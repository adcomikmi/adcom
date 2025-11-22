// backend/controllers/feedback.controller.js
import Feedback from '../models/Feedback.model.js';

export const createFeedback = async (req, res) => {
  const { message, isAnonymous } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Pesan tidak boleh kosong' });
  }

  try {
    const feedback = await Feedback.create({
      message,
      isAnonymous: isAnonymous || false,
      userId: req.user._id,
    });
    res.status(201).json({ message: 'Saran & Kritik berhasil dikirim. Terima kasih!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error saat mengirim feedback' });
  }
};

export const getAllFeedback = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5; 
    const skip = (page - 1) * limit;

    const totalItems = await Feedback.countDocuments();
    
    const feedback = await Feedback.find({})
      .populate('userId', 'namaAsli nim')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    
    res.status(200).json({
      feedback,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error saat mengambil feedback' });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback tidak ditemukan' });
    }

    await feedback.deleteOne();
    res.status(200).json({ message: 'Feedback berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Server error saat menghapus feedback' });
  }
};