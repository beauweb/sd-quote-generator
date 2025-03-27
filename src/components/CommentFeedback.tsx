import React, { useState, useEffect } from 'react';
import { CommentFeedback as CommentFeedbackType } from '../types';
import { MessageSquare, Star, Send, Trash2, Edit2 } from 'lucide-react';

interface CommentFeedbackProps {
  templateId: string;
  comments: CommentFeedbackType[];
  onAddComment: (comment: Omit<CommentFeedbackType, 'id' | 'createdAt'>) => void;
  onDeleteComment: (commentId: string) => void;
  onEditComment: (commentId: string, text: string, rating?: number) => void;
}

export const CommentFeedback: React.FC<CommentFeedbackProps> = ({
  templateId,
  comments,
  onAddComment,
  onDeleteComment,
  onEditComment
}) => {
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editRating, setEditRating] = useState<number>(5);

  const filteredComments = comments.filter(comment => comment.templateId === templateId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    onAddComment({
      userId: 'current-user', // Should be replaced with actual user ID in a real app
      templateId,
      text: newComment.trim(),
      rating
    });

    setNewComment('');
    setRating(5);
  };

  const handleEditSubmit = (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    if (!editText.trim()) return;

    onEditComment(commentId, editText.trim(), editRating);
    setEditingComment(null);
  };

  const startEditing = (comment: CommentFeedbackType) => {
    setEditingComment(comment.id);
    setEditText(comment.text);
    setEditRating(comment.rating || 5);
  };

  return (
    <div className="comment-feedback">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <MessageSquare size={18} className="mr-2" />
        Comments & Feedback
      </h3>

      <form onSubmit={handleSubmit} className="comment-form bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-5">
        <div className="rating-container mb-3">
          <label className="block text-sm mb-2">Rating</label>
          <div className="star-rating flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-btn ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                onClick={() => setRating(star)}
                aria-label={`Rate ${star} stars`}
              >
                <Star
                  size={20}
                  fill={star <= rating ? 'currentColor' : 'none'}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-sm mb-2">Your Comment</label>
          <textarea
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment or feedback..."
            required
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
          disabled={!newComment.trim()}
        >
          <Send size={16} className="mr-2" />
          Submit Feedback
        </button>
      </form>

      <div className="comments-list">
        {filteredComments.length > 0 ? (
          <div className="space-y-4">
            {filteredComments.map((comment) => (
              <div key={comment.id} className="comment bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                {editingComment === comment.id ? (
                  <form onSubmit={(e) => handleEditSubmit(e, comment.id)} className="edit-form">
                    <div className="rating-container mb-3">
                      <label className="block text-sm mb-2">Rating</label>
                      <div className="star-rating flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={`star-btn ${star <= editRating ? 'text-yellow-400' : 'text-gray-300'}`}
                            onClick={() => setEditRating(star)}
                            aria-label={`Rate ${star} stars`}
                          >
                            <Star
                              size={20}
                              fill={star <= editRating ? 'currentColor' : 'none'}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <textarea
                      className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 mb-3"
                      rows={3}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      required
                    />

                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                      >
                        <Send size={14} className="mr-1" />
                        Save
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                        onClick={() => setEditingComment(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-2">
                      <div className="user-info">
                        <div className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="star-rating flex">
                        {comment.rating && [1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={star <= (comment.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}
                            fill={star <= (comment.rating || 0) ? 'currentColor' : 'none'}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-sm mb-3">{comment.text}</p>

                    <div className="actions flex justify-end space-x-2">
                      <button
                        className="p-1 text-gray-500 hover:text-blue-500"
                        onClick={() => startEditing(comment)}
                        aria-label="Edit comment"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className="p-1 text-gray-500 hover:text-red-500"
                        onClick={() => onDeleteComment(comment.id)}
                        aria-label="Delete comment"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-comments text-center py-8">
            <MessageSquare size={32} className="mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500">No comments yet. Be the first to provide feedback!</p>
          </div>
        )}
      </div>
    </div>
  );
};
