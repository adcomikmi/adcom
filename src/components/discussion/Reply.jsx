// src/components/discussion/Reply.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { HiOutlineHeart, HiHeart, HiOutlinePencil, HiOutlineTrash, HiOutlineChatAlt } from 'react-icons/hi';
import { postNestedReply } from '../../services/api';

const MAX_NESTING_LEVEL = 3;
const REPLIES_BATCH_SIZE = 5;

function Reply({ reply, onLike, onEdit, onDelete, onReplySuccess, nestingLevel = 0 }) {
  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [replyKonten, setReplyKonten] = useState('');
  const [loadingReply, setLoadingReply] = useState(false);
  
  const [showChildren, setShowChildren] = useState(false);
  const [visibleCount, setVisibleCount] = useState(REPLIES_BATCH_SIZE);

  const getAuthorName = (author) => {
    if (!author) return 'Anggota Dihapus';
    return author.namaAsli || author.nama || 'Anggota ADCOM';
  };
  
  const hasLiked = (likes) => likes.includes(user?._id);
  const isAuthor = (item) => item.author._id === user?._id;

  const handlePostReply = async (e) => {
    e.preventDefault();
    setLoadingReply(true);
    try {
      await postNestedReply(reply._id, replyKonten);
      setReplyKonten('');
      setIsReplying(false);
      onReplySuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReply(false);
    }
  };

  const displayedChildren = reply.children.slice(0, visibleCount);
  const hasMoreChildren = reply.children.length > visibleCount;

  const handleToggleChildren = () => {
    if (showChildren) {
      setShowChildren(false);
      setVisibleCount(REPLIES_BATCH_SIZE);
    } else {
      setShowChildren(true);
    }
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + REPLIES_BATCH_SIZE);
  };

  return (
    <div className={`flex flex-col ${nestingLevel > 0 ? 'mt-4' : ''}`}>
      <div className="p-4 bg-neum-bg rounded-xl shadow-neum-in">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{getAuthorName(reply.author)}</span>
          <span className="text-xs text-gray-500">
            {new Date(reply.createdAt).toLocaleDateString('id-ID')}
          </span>
        </div>
        <p className="text-gray-700 whitespace-pre-wrap mb-4">{reply.konten}</p>
        <div className="flex justify-end items-center space-x-3">
          {isAuthor(reply) && (
            <>
              <button onClick={() => onEdit(reply)} className="flex items-center space-x-1 text-sm text-gray-600 hover:text-accent-yellow">
                <HiOutlinePencil className="text-base" />
              </button>
              <button onClick={() => onDelete(reply)} className="flex items-center space-x-1 text-sm text-gray-600 hover:text-accent-red">
                <HiOutlineTrash className="text-base" />
              </button>
            </>
          )}
          <button onClick={() => onLike(reply._id)} className="flex items-center space-x-1 text-sm text-gray-600 hover:text-accent-red">
            {hasLiked(reply.likes) ? <HiHeart className="text-accent-red text-lg" /> : <HiOutlineHeart className="text-lg" />}
            <span>{reply.likes.length}</span>
          </button>
          <button onClick={() => setIsReplying(!isReplying)} className="flex items-center space-x-1 text-sm text-gray-600 hover:text-accent-blue">
            <HiOutlineChatAlt className="text-lg" />
            <span>Balas</span>
          </button>
        </div>
      </div>

      {isReplying && (
        <form onSubmit={handlePostReply} className={`mt-4 ${nestingLevel < MAX_NESTING_LEVEL ? 'ml-4 md:ml-8' : 'ml-0'} p-4 bg-neum-bg rounded-xl shadow-neum-out`}>
          <textarea
            rows="3"
            value={replyKonten}
            onChange={(e) => setReplyKonten(e.target.value)}
            placeholder={`Membalas ${getAuthorName(reply.author)}...`}
            required
            className="w-full px-4 py-3 bg-neum-bg rounded-lg shadow-neum-in focus:outline-none focus:ring-2 focus:ring-accent-blue"
          />
          <button
            type="submit"
            disabled={loadingReply}
            className="mt-2 px-4 py-2 bg-neum-bg text-accent-blue font-semibold rounded-lg shadow-neum-out hover:shadow-neum-out-hover active:shadow-neum-in-active"
          >
            {loadingReply ? 'Mengirim...' : 'Kirim'}
          </button>
        </form>
      )}

      {reply.children && reply.children.length > 0 && (
        <div className={`mt-2 ${nestingLevel < MAX_NESTING_LEVEL ? 'ml-4 md:ml-8' : 'ml-0'}`}>
          {!showChildren ? (
            <button onClick={handleToggleChildren} className="text-sm font-medium text-accent-blue hover:underline">
              Lihat {reply.children.length} Balasan
            </button>
          ) : (
            <div className={`pt-4 ${nestingLevel < MAX_NESTING_LEVEL ? 'pl-4 border-l-2 border-gray-300/50' : ''} space-y-6`}>
              {displayedChildren.map(childReply => (
                <Reply
                  key={childReply._id}
                  reply={childReply}
                  onLike={onLike}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onReplySuccess={onReplySuccess}
                  nestingLevel={nestingLevel + 1}
                />
              ))}
              {hasMoreChildren && (
                <button onClick={handleLoadMore} className="text-sm font-medium text-accent-blue hover:underline">
                  Lihat {reply.children.length - visibleCount} balasan lagi
                </button>
              )}
              <button onClick={handleToggleChildren} className="text-sm font-medium text-gray-600 hover:underline ml-4">
                Sembunyikan Balasan
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Reply;