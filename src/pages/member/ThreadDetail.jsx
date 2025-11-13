// src/pages/member/ThreadDetail.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getThreadById, postReply, toggleLikeThread, toggleLikeReply, 
  updateThread, deleteThread, updateReply, deleteReply 
} from '../../services/api';
import { HiOutlineHeart, HiHeart, HiOutlinePencil, HiOutlineTrash, HiOutlineChatAlt } from 'react-icons/hi';
import Modal from '../../components/common/Modal';
import Reply from '../../components/discussion/Reply';

function ThreadDetail() {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [rootReplies, setRootReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [replyKonten, setReplyKonten] = useState('');
  const [loadingReply, setLoadingReply] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editKonten, setEditKonten] = useState('');

  const getAuthorName = (author) => {
    if (!author) return 'Anggota Dihapus';
    return author.namaAsli || author.nama || 'Anggota ADCOM';
  };
  
  const hasLiked = (likes) => likes.includes(user?._id);
  const isAuthor = (item) => item.author._id === user?._id;

  const buildReplyTree = (flatReplies) => {
    const replyMap = {};
    const tree = [];
    flatReplies.forEach(reply => {
      reply.children = [];
      replyMap[reply._id] = reply;
    });
    flatReplies.forEach(reply => {
      if (reply.parentReplyId) {
        if(replyMap[reply.parentReplyId]) {
          replyMap[reply.parentReplyId].children.push(reply);
        }
      } else {
        tree.push(reply);
      }
    });
    tree.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return tree;
  };

  const fetchThreadData = useCallback(async () => {
    try {
      const data = await getThreadById(threadId);
      setThread(data.thread);
      setReplies(data.replies);
      const nestedReplies = buildReplyTree(data.replies);
      setRootReplies(nestedReplies);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  }, [threadId]);

  useEffect(() => {
    setLoading(true);
    fetchThreadData();
  }, [fetchThreadData]);

  const handlePostReply = async (e) => {
    e.preventDefault();
    setLoadingReply(true);
    try {
      await postReply(threadId, replyKonten);
      setReplyKonten('');
      await fetchThreadData();
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoadingReply(false);
    }
  };

  const handleLikeThread = async () => {
    try {
      await toggleLikeThread(threadId);
      await fetchThreadData();
    } catch (err) { setError(err.toString()); }
  };

  const handleLikeReply = async (replyId) => {
    try {
      await toggleLikeReply(replyId);
      await fetchThreadData();
    } catch (err) { setError(err.toString()); }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setEditKonten(item.konten);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const isEditingThread = !editingItem.threadId;
    try {
      if (isEditingThread) {
        await updateThread(editingItem._id, { konten: editKonten, judul: editingItem.judul });
      } else {
        await updateReply(editingItem._id, { konten: editKonten });
      }
      setIsEditModalOpen(false);
      setEditingItem(null);
      await fetchThreadData();
    } catch (err) {
      setError(err.toString());
    }
  };

  const openDeleteModal = (item) => {
    setEditingItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const isDeletingThread = !editingItem.threadId;
    try {
      if (isDeletingThread) {
        await deleteThread(editingItem._id);
        navigate('/diskusi');
      } else {
        await deleteReply(editingItem._id);
      }
      setIsDeleteModalOpen(false);
      setEditingItem(null);
      await fetchThreadData();
    } catch (err) {
      setError(err.toString());
      setIsDeleteModalOpen(false);
    }
  };

  if (loading) return <p className="text-center text-gray-600 pt-32">Loading thread...</p>;
  if (error) return <p className="text-center text-accent-red pt-32">{error}</p>;
  if (!thread) return <p className="text-center text-gray-500 pt-32">Thread tidak ditemukan.</p>;

  return (
    <div className="flex justify-center py-12 px-4">
      <div className="w-full max-w-3xl">
        
        <div className="p-6 bg-neum-bg rounded-xl shadow-neum-out border-t-4 border-accent-blue">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Oleh: {getAuthorName(thread.author)}</span>
            <span className="text-xs text-gray-500">
              Di-post: {new Date(thread.createdAt).toLocaleDateString('id-ID')}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{thread.judul}</h1>
          <p className="text-gray-700 whitespace-pre-wrap mb-6">{thread.konten}</p>
          <div className="flex justify-end items-center space-x-4">
            {isAuthor(thread) && (
              <>
                <button onClick={() => openEditModal(thread)} className="flex items-center space-x-1 text-sm text-gray-600 hover:text-accent-yellow">
                  <HiOutlinePencil className="text-lg" /> <span>Edit</span>
                </button>
                <button onClick={() => openDeleteModal(thread)} className="flex items-center space-x-1 text-sm text-gray-600 hover:text-accent-red">
                  <HiOutlineTrash className="text-lg" /> <span>Hapus</span>
                </button>
              </>
            )}
            <button onClick={handleLikeThread} className="flex items-center space-x-1 text-sm text-gray-600 hover:text-accent-red">
              {hasLiked(thread.likes) ? <HiHeart className="text-accent-red text-xl" /> : <HiOutlineHeart className="text-xl" />}
              <span>{thread.likes.length} Suka</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-12 mb-6">
          <h2 className="text-2xl font-bold text-gray-700">Balasan</h2>
          <span className="px-3 py-1 bg-neum-bg shadow-neum-in rounded-full text-sm font-medium text-gray-700">
            {replies.length}
          </span>
        </div>
        
        <div className="space-y-6">
          {rootReplies.map(reply => (
            <Reply 
              key={reply._id}
              reply={reply}
              onLike={handleLikeReply}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
              onReplySuccess={fetchThreadData}
              nestingLevel={0}
            />
          ))}
          {rootReplies.length === 0 && (
            <p className="text-center text-gray-500">Belum ada balasan.</p>
          )}
        </div>

        <form onSubmit={handlePostReply} className="mt-8 p-6 bg-neum-bg rounded-xl shadow-neum-out">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Beri Balasan</h3>
          <textarea
            rows="4"
            value={replyKonten}
            onChange={(e) => setReplyKonten(e.target.value)}
            placeholder="Tulis balasan Anda di sini..."
            required
            className="w-full px-4 py-3 bg-neum-bg rounded-lg shadow-neum-in focus:outline-none focus:ring-2 focus:ring-accent-blue"
          />
          <button
            type="submit"
            disabled={loadingReply}
            className="mt-4 w-full md:w-auto px-4 py-2 bg-neum-bg text-accent-blue font-semibold rounded-lg shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active transition-all"
          >
            {loadingReply ? 'Mengirim...' : 'Kirim Balasan'}
          </button>
        </form>
      </div>

      <Modal 
        isOpen={isEditModalOpen} 
        closeModal={() => setIsEditModalOpen(false)} 
        title="Edit Postingan"
      >
        <form onSubmit={handleEditSubmit}>
          <textarea
            rows="5"
            value={editKonten}
            onChange={(e) => setEditKonten(e.target.value)}
            className="w-full px-4 py-3 bg-neum-bg rounded-lg shadow-neum-in focus:outline-none focus:ring-2 focus:ring-accent-yellow"
          />
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-neum-bg text-accent-green font-semibold rounded-lg shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isDeleteModalOpen} 
        closeModal={() => setIsDeleteModalOpen(false)} 
        title="Konfirmasi Hapus"
      >
        <p className="text-gray-700">Anda yakin ingin menghapus postingan ini? Tindakan ini tidak bisa dibatalkan.</p>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 bg-neum-bg text-gray-700 font-semibold rounded-lg shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Batal
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-accent-red text-white font-semibold rounded-lg shadow-md hover:bg-red-700"
            onClick={handleDeleteConfirm}
          >
            Hapus
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ThreadDetail;