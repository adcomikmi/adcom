// backend/controllers/reply.controller.js
import Reply from '../models/Reply.model.js';

export const toggleLikeReply = async (req, res) => {
  try {
    const reply = await Reply.findById(req.params.replyId);
    if (!reply) {
      return res.status(404).json({ message: 'Balasan tidak ditemukan' });
    }

    const userId = req.user._id;
    const hasLiked = reply.likes.includes(userId);

    if (hasLiked) {
      reply.likes.pull(userId);
    } else {
      reply.likes.push(userId);
    }

    await reply.save();
    res.status(200).json(reply);
  } catch (error) {
    res.status(500).json({ message: 'Server error saat like balasan' });
  }
};

export const updateReply = async (req, res) => {
  const { konten } = req.body;
  try {
    const reply = await Reply.findById(req.params.replyId);
    if (!reply) {
      return res.status(404).json({ message: 'Balasan tidak ditemukan' });
    }

    if (reply.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Akses ditolak: Anda bukan pemilik balasan ini' });
    }

    reply.konten = konten || reply.konten;
    reply.updatedAt = Date.now();
    
    const updatedReply = await reply.save();
    res.status(200).json(updatedReply);
  } catch (error) {
    res.status(500).json({ message: 'Server error saat update balasan' });
  }
};

export const deleteReply = async (req, res) => {
  try {
    const reply = await Reply.findById(req.params.replyId);
    if (!reply) {
      return res.status(404).json({ message: 'Balasan tidak ditemukan' });
    }

    if (reply.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Akses ditolak: Anda bukan pemilik balasan ini' });
    }

    await reply.deleteOne();
    res.status(200).json({ message: 'Balasan berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Server error saat menghapus balasan' });
  }
};

export const postNestedReply = async (req, res) => {
  const { konten } = req.body;
  const { parentReplyId } = req.params;

  if (!konten) {
    return res.status(400).json({ message: 'Konten balasan wajib diisi' });
  }

  try {
    const parentReply = await Reply.findById(parentReplyId);
    if (!parentReply) {
      return res.status(404).json({ message: 'Balasan induk tidak ditemukan' });
    }

    const authorModel = req.user.role === 'admin' ? 'Admin' : 'User';

    const reply = await Reply.create({
      konten,
      threadId: parentReply.threadId,
      parentReplyId: parentReplyId,
      author: req.user._id,
      authorModel: authorModel,
    });
    
    const populatedReply = await reply.populate('author', 'namaAsli nim nama email');

    res.status(201).json(populatedReply);
  } catch (error) {
    res.status(500).json({ message: 'Server error saat membuat balasan bersarang' });
  }
};