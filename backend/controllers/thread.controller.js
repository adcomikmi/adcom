// backend/controllers/thread.controller.js
import Thread from '../models/Thread.model.js';
import Reply from '../models/Reply.model.js';

export const createThread = async (req, res) => {
  const { judul, konten } = req.body;
  if (!judul || !konten) {
    return res.status(400).json({ message: 'Judul dan konten wajib diisi' });
  }
  try {
    const authorModel = req.user.role === 'admin' ? 'Admin' : 'User';
    const thread = await Thread.create({
      judul,
      konten,
      author: req.user._id,
      authorModel: authorModel,
    });
    res.status(201).json(thread);
  } catch (error) {
    res.status(500).json({ message: 'Server error saat membuat thread' });
  }
};

export const getAllThreads = async (req, res) => {
  try {
    const threads = await Thread.find({})
      .populate('author', 'namaAsli nim nama email')
      .sort({ createdAt: -1 });
    res.status(200).json(threads);
  } catch (error) {
    res.status(500).json({ message: 'Server error saat mengambil data threads' });
  }
};

export const getThreadById = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.threadId)
      .populate('author', 'namaAsli nim nama email');
    if (!thread) {
      return res.status(404).json({ message: 'Thread tidak ditemukan' });
    }
    const replies = await Reply.find({ threadId: req.params.threadId })
      .populate('author', 'namaAsli nim nama email')
      .sort({ createdAt: 'asc' });
    res.status(200).json({ thread, replies });
  } catch (error) {
    res.status(500).json({ message: 'Server error saat mengambil data thread' });
  }
};

export const postReply = async (req, res) => {
  const { konten } = req.body;
  if (!konten) {
    return res.status(400).json({ message: 'Konten balasan wajib diisi' });
  }
  try {
    const authorModel = req.user.role === 'admin' ? 'Admin' : 'User';
    const reply = await Reply.create({
      konten,
      threadId: req.params.threadId,
      author: req.user._id,
      authorModel: authorModel,
    });
    const populatedReply = await reply.populate('author', 'namaAsli nim nama email');
    res.status(201).json(populatedReply);
  } catch (error) {
    res.status(500).json({ message: 'Server error saat membuat balasan' });
  }
};

export const toggleLikeThread = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.threadId);
    if (!thread) {
      return res.status(404).json({ message: 'Thread tidak ditemukan' });
    }
    const userId = req.user._id;
    const hasLiked = thread.likes.includes(userId);
    if (hasLiked) {
      thread.likes.pull(userId);
    } else {
      thread.likes.push(userId);
    }
    await thread.save();
    res.status(200).json(thread);
  } catch (error) {
    res.status(500).json({ message: 'Server error saat like thread' });
  }
};

export const updateThread = async (req, res) => {
  const { judul, konten } = req.body;
  try {
    const thread = await Thread.findById(req.params.threadId);
    if (!thread) {
      return res.status(404).json({ message: 'Thread tidak ditemukan' });
    }

    if (thread.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Akses ditolak: Anda bukan pemilik thread ini' });
    }

    thread.judul = judul || thread.judul;
    thread.konten = konten || thread.konten;
    thread.updatedAt = Date.now();
    
    const updatedThread = await thread.save();
    res.status(200).json(updatedThread);
  } catch (error) {
    res.status(500).json({ message: 'Server error saat update thread' });
  }
};

export const deleteThread = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.threadId);
    if (!thread) {
      return res.status(404).json({ message: 'Thread tidak ditemukan' });
    }

    if (thread.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Akses ditolak: Anda bukan pemilik thread ini' });
    }

    await Reply.deleteMany({ threadId: req.params.threadId });
    await thread.deleteOne();

    res.status(200).json({ message: 'Thread dan semua balasan berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Server error saat menghapus thread' });
  }
};