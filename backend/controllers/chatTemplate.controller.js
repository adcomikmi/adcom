// backend/controllers/chatTemplate.controller.js
import ChatTemplate from '../models/ChatTemplate.model.js';

export const getAllTemplates = async (req, res) => {
  try {
    const templates = await ChatTemplate.find({ createdBy: req.user._id }).sort({ name: 1 });
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createTemplate = async (req, res) => {
  const { name, content } = req.body;
  try {
    const newTemplate = await ChatTemplate.create({
      name,
      content,
      createdBy: req.user._id,
    });
    res.status(201).json(newTemplate);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTemplate = async (req, res) => {
  const { name, content } = req.body;
  try {
    const template = await ChatTemplate.findById(req.params.templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template tidak ditemukan' });
    }
    if (template.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Akses ditolak' });
    }
    template.name = name || template.name;
    template.content = content || template.content;
    await template.save();
    res.status(200).json(template);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTemplate = async (req, res) => {
  try {
    const template = await ChatTemplate.findById(req.params.templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template tidak ditemukan' });
    }
    if (template.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Akses ditolak' });
    }
    await template.deleteOne();
    res.status(200).json({ message: 'Template dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};