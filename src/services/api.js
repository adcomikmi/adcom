// src/services/api.js
import axios from 'axios';

// Gunakan /api secara langsung agar diproxy oleh Vite/Vercel
const BASE = '/api';

const api = axios.create({
  baseURL: BASE,
});

api.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

export const login = async (nim, password) => {
  try {
    const { data } = await api.post('/auth/login', { nim, password });
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Terjadi kesalahan';
  }
};

export const loginAdmin = async (email, password) => {
  try {
    const { data } = await api.post('/auth/login-admin', { email, password });
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Terjadi kesalahan';
  }
};

export const getMateriTugas = async (page = 1) => {
  try {
    const { data } = await api.get('/materi', {
      params: { page }
    });
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Gagal mengambil materi';
  }
};

export const createMateriTugas = async (formData) => {
  try {
    const { data } = await api.post('/materi', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error)
    {
    throw error.response?.data?.message || 'Gagal membuat materi';
  }
};

export const addMember = async (memberData) => {
  try {
    const { data } = await api.post('/users/add', memberData);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Gagal menambah anggota';
  }
};

export const addBulkMembers = async (formData) => {
  try {
    const { data } = await api.post('/users/add-bulk', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Gagal upload CSV';
  }
};

export const changePassword = async (newPassword) => {
  try {
    const { data } = await api.post('/users/change-password', { newPassword });
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Gagal ganti password';
  }
};

export const getMembers = async () => {
  try {
    const { data } = await api.get('/users');
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Gagal mengambil data anggota';
  }
};

export const getAllThreads = async () => {
  try {
    const { data } = await api.get('/threads');
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Gagal mengambil threads';
  }
};

export const createThread = async (threadData) => {
  try {
    const { data } = await api.post('/threads', threadData);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Gagal membuat thread';
  }
};

export const getThreadById = async (threadId) => {
  try {
    const { data } = await api.get(`/threads/${threadId}`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Gagal mengambil detail thread';
  }
};

export const postReply = async (threadId, konten) => {
  try {
    const { data } = await api.post(`/threads/${threadId}/reply`, { konten });
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Gagal mengirim balasan';
  }
};

export const toggleLikeThread = async (threadId) => {
  try {
    const { data } = await api.put(`/threads/${threadId}/like`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Gagal like thread';
  }
};

export const toggleLikeReply = async (replyId) => {
  try {
    const { data } = await api.put(`/replies/${replyId}/like`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Gagal like balasan';
  }
};

export const updateThread = async (threadId, data) => {
  try {
    const { data: updatedData } = await api.put(`/threads/${threadId}`, data);
    return updatedData;
  } catch (error) {
    throw error.response?.data?.message || 'Gagal update thread';
  }
};

export const deleteThread = async (threadId) => {
  try {
    const { data } = await api.delete(`/threads/${threadId}`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Gagal hapus thread';
  }
};

export const updateReply = async (replyId, data) => {
  try {
    const { data: updatedData } = await api.put(`/replies/${replyId}`, data);
    return updatedData;
  } catch (error) {
    throw error.response?.data?.message || 'Gagal update balasan';
  }
};

export const deleteReply = async (replyId) => {
  try {
    const { data } = await api.delete(`/replies/${replyId}`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Gagal hapus balasan';
  }
};

export const postNestedReply = async (parentReplyId, konten) => {
  try {
    const { data } = await api.post(`/replies/${parentReplyId}/reply`, { konten });
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Gagal mengirim balasan bersarang';
  }
};

export const createFeedback = async (feedbackData) => {
  try {
    const { data } = await api.post('/feedback', feedbackData);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Gagal mengirim feedback';
  }
};

export const getAllFeedback = async (page = 1) => {
  try {
    const { data } = await api.get('/feedback', {
      params: { page }
    });
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Gagal mengambil feedback';
  }
};

export const deleteFeedback = async (feedbackId) => {
  try {
    const { data } = await api.delete(`/feedback/${feedbackId}`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Gagal menghapus feedback';
  }
};

export const getMateriById = async (materiId) => {
  try {
    const { data } = await api.get(`/materi/${materiId}`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Gagal mengambil detail materi';
  }
};

export const updateMateri = async (materiId, formData) => {
  try {
    const { data } = await api.put(`/materi/${materiId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Gagal update materi';
  }
};

export const deleteMateri = async (materiId) => {
  try {
    const { data } = await api.delete(`/materi/${materiId}`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Gagal hapus materi';
  }
};

export const downloadMateriFile = async (file) => {
  // file sekarang adalah object dari array files di MongoDB
  // berisi { originalName, googleFileId, ... }
  try {
    // Panggil endpoint backend
    const response = await api.get(`/materi/download/${file.googleFileId}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
     if (error.response && error.response.data instanceof Blob) {
      const errorText = await error.response.data.text();
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.message || 'Gagal download file');
    } else {
      throw error;
    }
  }
};

export const submitTugas = async (tugasId, formData) => {
  try {
    const { data } = await api.post(`/submissions/${tugasId}/submit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Gagal submit tugas';
  }
};

export const getAllSubmissions = async (page = 1) => {
  try {
    const { data } = await api.get('/submissions', {
      params: { page }
    });
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Gagal mengambil data submission';
  }
};

export const getSubmissionById = async (submissionId) => {
  try {
    const { data } = await api.get(`/submissions/${submissionId}`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Gagal mengambil detail submission';
  }
};

export const downloadSubmissionFile = async (filePath, originalName) => {
  try {
    const response = await api.get(`/submissions/download/${filePath}`, {
      params: { name: originalName },
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data instanceof Blob) {
      const errorText = await error.response.data.text();
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.message || 'Gagal download file');
    } else {
      throw error;
    }
  }
};

export const getHomeConfig = async () => {
  try {
    const { data } = await api.get('/config/home');
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Gagal mengambil config';
  }
};

export const updateHomeConfig = async (formData) => {
  try {
    const { data } = await api.put('/config/home', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Gagal update config';
  }
};

export const getAllChatTemplates = async () => {
  try {
    const { data } = await api.get('/chat-templates');
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Gagal mengambil template';
  }
};

export const createChatTemplate = async (templateData) => {
  try {
    const { data } = await api.post('/chat-templates', templateData);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Gagal menyimpan template';
  }
};

export const updateChatTemplate = async (templateId, templateData) => {
  try {
    const { data } = await api.put(`/chat-templates/${templateId}`, templateData);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Gagal update template';
  }
};

export const deleteChatTemplate = async (templateId) => {
  try {
    const { data } = await api.delete(`/chat-templates/${templateId}`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Gagal hapus template';
  }
};

export default api;