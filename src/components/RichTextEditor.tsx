import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Bold, Italic, Smile } from 'lucide-react';
import { EmojiPicker } from './EmojiPicker';
import './RichTextEditor.css';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const isInternalUpdate = useRef(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  // Sync external value to editor only when it changes externally (e.g. reset)
  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  // Check current selection formatting state
  const updateFormatState = useCallback(() => {
    setIsBold(document.queryCommandState('bold'));
    setIsItalic(document.queryCommandState('italic'));
  }, []);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isInternalUpdate.current = true;
      onChange(editorRef.current.innerHTML);
    }
    updateFormatState();
  }, [onChange, updateFormatState]);

  const execCommand = useCallback((command: string) => {
    document.execCommand(command, false);
    editorRef.current?.focus();
    handleInput();
  }, [handleInput]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b') {
        e.preventDefault();
        e.stopPropagation();
        execCommand('bold');
      } else if (e.key === 'i') {
        e.preventDefault();
        e.stopPropagation();
        execCommand('italic');
      }
    }
  }, [execCommand]);

  const handleEmojiSelect = useCallback((emoji: string) => {
    editorRef.current?.focus();

    // Restore selection then insert
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const textNode = document.createTextNode(emoji);
      range.insertNode(textNode);
      // Move cursor after emoji
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      document.execCommand('insertText', false, emoji);
    }

    handleInput();
    setShowEmojiPicker(false);
  }, [handleInput]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');

    if (html) {
      // Sanitize: only keep basic formatting tags
      const cleaned = sanitizeHtml(html);
      document.execCommand('insertHTML', false, cleaned);
    } else {
      document.execCommand('insertText', false, text);
    }
    handleInput();
  }, [handleInput]);

  // Close emoji picker on outside click
  useEffect(() => {
    if (!showEmojiPicker) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.rte-emoji-container')) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showEmojiPicker]);

  return (
    <div className="rich-text-editor">
      <div className="rte-toolbar">
        <button
          type="button"
          className={`rte-btn ${isBold ? 'rte-btn-active' : ''}`}
          onMouseDown={(e) => { e.preventDefault(); execCommand('bold'); }}
          title="Bold (Ctrl+B)"
          aria-label="Toggle bold"
        >
          <Bold size={14} />
        </button>
        <button
          type="button"
          className={`rte-btn ${isItalic ? 'rte-btn-active' : ''}`}
          onMouseDown={(e) => { e.preventDefault(); execCommand('italic'); }}
          title="Italic (Ctrl+I)"
          aria-label="Toggle italic"
        >
          <Italic size={14} />
        </button>
        <div className="rte-separator" />
        <div className="rte-emoji-container">
          <button
            type="button"
            className={`rte-btn ${showEmojiPicker ? 'rte-btn-active' : ''}`}
            onMouseDown={(e) => {
              e.preventDefault();
              setShowEmojiPicker(!showEmojiPicker);
            }}
            title="Insert Emoji"
            aria-label="Insert emoji"
          >
            <Smile size={14} />
          </button>
          {showEmojiPicker && (
            <EmojiPicker
              onSelect={handleEmojiSelect}
              onClose={() => setShowEmojiPicker(false)}
            />
          )}
        </div>
      </div>
      <div
        ref={editorRef}
        className="rte-content"
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onKeyUp={updateFormatState}
        onMouseUp={updateFormatState}
        onPaste={handlePaste}
        data-placeholder={placeholder || 'Enter your quote text here...\nUse Enter for line breaks'}
        suppressContentEditableWarning
      />
    </div>
  );
};

/**
 * Sanitize pasted HTML to only keep bold/italic tags and line breaks
 */
function sanitizeHtml(html: string): string {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return cleanNode(temp);
}

function cleanNode(node: Node): string {
  let result = '';

  for (const child of Array.from(node.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      result += child.textContent || '';
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as HTMLElement;
      const tag = el.tagName.toLowerCase();
      const inner = cleanNode(el);

      if (tag === 'b' || tag === 'strong') {
        result += `<b>${inner}</b>`;
      } else if (tag === 'i' || tag === 'em') {
        result += `<i>${inner}</i>`;
      } else if (tag === 'br') {
        result += '<br>';
      } else if (tag === 'div' || tag === 'p') {
        result += `<div>${inner}</div>`;
      } else {
        // Strip unknown tags, keep content
        result += inner;
      }
    }
  }

  return result;
}
