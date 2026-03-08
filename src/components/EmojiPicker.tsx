import React, { useState } from 'react';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const EMOJI_CATEGORIES: { label: string; emojis: string[] }[] = [
  {
    label: '😊',
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣',
      '😂', '🙂', '😊', '😇', '🥰', '😍', '🤩',
      '😘', '😗', '😚', '😙', '🥲', '😋', '😛',
      '😜', '🤪', '😝', '🤑', '🤗', '🤭', '😏',
      '😌', '😔', '😪', '🤤', '😴', '😷', '🤢',
    ],
  },
  {
    label: '❤️',
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤',
      '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓',
      '💗', '💖', '💘', '💝', '💟', '♥️', '🫶',
      '💪', '🤝', '👏', '🙏', '✌️', '🤞', '👍',
    ],
  },
  {
    label: '🌟',
    emojis: [
      '⭐', '🌟', '✨', '💫', '🔥', '💥', '🎯',
      '💡', '🎉', '🎊', '🏆', '🥇', '🎖️', '🏅',
      '👑', '💎', '🔮', '🧿', '🪬', '🌈', '☀️',
      '🌙', '🌸', '🌺', '🌻', '🌷', '🍀', '🦋',
    ],
  },
  {
    label: '📝',
    emojis: [
      '📝', '✍️', '📖', '📚', '💬', '💭', '🗣️',
      '👁️', '🧠', '🫀', '🎵', '🎶', '🎤', '🎧',
      '📱', '💻', '⌨️', '🖊️', '✏️', '📌', '📍',
      '🔖', '🏷️', '✅', '❌', '⚡', '🛡️', '🗝️',
    ],
  },
  {
    label: '☝️',
    emojis: [
      '👆', '👇', '👈', '👉', '☝️', '🫵', '👋',
      '🤚', '✋', '🖐️', '🤌', '🤏', '🫰', '🤙',
      '💅', '🙌', '🫶', '🤲', '🤜', '🤛', '✊',
      '🫡', '🫠', '🤫', '🫣', '🥺', '😤', '💯',
    ],
  },
];

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect, onClose: _onClose }) => {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="emoji-picker" onClick={(e) => e.stopPropagation()}>
      <div className="emoji-picker-header">
        {EMOJI_CATEGORIES.map((cat, idx) => (
          <button
            key={idx}
            type="button"
            className={`emoji-category-btn ${idx === activeCategory ? 'active' : ''}`}
            onClick={() => setActiveCategory(idx)}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="emoji-grid">
        {EMOJI_CATEGORIES[activeCategory].emojis.map((emoji, idx) => (
          <button
            key={idx}
            type="button"
            className="emoji-item"
            onClick={() => onSelect(emoji)}
            title={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};
