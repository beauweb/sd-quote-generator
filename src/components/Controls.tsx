import React, { useState, useRef, useEffect } from 'react';
import { ColorPicker } from './ColorPicker';
import { QuoteSettings } from '../types';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Bold, Italic, Underline, ChevronDown, ChevronUp } from 'lucide-react';

interface ControlsProps {
  settings: QuoteSettings;
  onSettingsChange: (settings: QuoteSettings) => void;
}

export const Controls: React.FC<ControlsProps> = ({ settings, onSettingsChange }) => {
  const [isSignatureOpen, setIsSignatureOpen] = useState(false);
  const fonts = [
    // English Serif Fonts
    { name: 'Playfair Display', value: 'Playfair Display' },
    { name: 'Lora', value: 'Lora' },
    { name: 'Merriweather', value: 'Merriweather' },
    { name: 'Crimson Text', value: 'Crimson Text' },
    { name: 'Libre Baskerville', value: 'Libre Baskerville' },
    { name: 'PT Serif', value: 'PT Serif' },
    { name: 'Noto Serif', value: 'Noto Serif' },
    // English Sans-Serif Fonts
    { name: 'Montserrat', value: 'Montserrat' },
    { name: 'Roboto', value: 'Roboto' },
    { name: 'Open Sans', value: 'Open Sans' },
    { name: 'Poppins', value: 'Poppins' },
    { name: 'Inter', value: 'Inter' },
    { name: 'Source Sans Pro', value: 'Source Sans Pro' },
    { name: 'Nunito', value: 'Nunito' },
    // System Fonts
    { name: 'Arial', value: 'Arial' },
    { name: 'Times New Roman', value: 'Times New Roman' },
    { name: 'Helvetica', value: 'Helvetica' },
    // Gujarati Fonts
    { name: 'Noto Sans Gujarati', value: 'Noto Sans Gujarati' },
    { name: 'Rasa', value: 'Rasa' },
    { name: 'Hind Vadodara', value: 'Hind Vadodara' },
    // Hindi/Devanagari Fonts
    { name: 'Noto Sans Devanagari', value: 'Noto Sans Devanagari' },
    { name: 'Hind', value: 'Hind' },
    { name: 'Mukta', value: 'Mukta' },
    { name: 'Tiro Devanagari Hindi', value: 'Tiro Devanagari Hindi' }
  ];

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState<{ start: number; end: number }>({
    start: 0,
    end: 0
  });

  const updateSettings = (updates: Partial<QuoteSettings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  const textAlignmentButtons = (
    current: 'left' | 'center' | 'right' | 'justify',
    onChange: (alignment: 'left' | 'center' | 'right' | 'justify') => void
  ) => (
    <div className="flex space-x-2 mt-1">
      <button
        onClick={() => onChange('left')}
        className={`p-2 rounded ${
          current === 'left'
            ? 'bg-purple-600 text-white'
            : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
        }`}
      >
        <AlignLeft size={20} />
      </button>
      <button
        onClick={() => onChange('center')}
        className={`p-2 rounded ${
          current === 'center'
            ? 'bg-purple-600 text-white'
            : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
        }`}
      >
        <AlignCenter size={20} />
      </button>
      <button
        onClick={() => onChange('right')}
        className={`p-2 rounded ${
          current === 'right'
            ? 'bg-purple-600 text-white'
            : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
        }`}
      >
        <AlignRight size={20} />
      </button>
      <button
        onClick={() => onChange('justify')}
        className={`p-2 rounded ${
          current === 'justify'
            ? 'bg-purple-600 text-white'
            : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
        }`}
      >
        <AlignJustify size={20} />
      </button>
    </div>
  );

  const signatureAlignmentButtons = (
    current: 'left' | 'center' | 'right',
    onChange: (alignment: 'left' | 'center' | 'right') => void
  ) => (
    <div className="flex space-x-2 mt-1">
      <button
        onClick={() => onChange('left')}
        className={`p-2 rounded ${
          current === 'left'
            ? 'bg-purple-600 text-white'
            : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
        }`}
      >
        <AlignLeft size={20} />
      </button>
      <button
        onClick={() => onChange('center')}
        className={`p-2 rounded ${
          current === 'center'
            ? 'bg-purple-600 text-white'
            : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
        }`}
      >
        <AlignCenter size={20} />
      </button>
      <button
        onClick={() => onChange('right')}
        className={`p-2 rounded ${
          current === 'right'
            ? 'bg-purple-600 text-white'
            : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
        }`}
      >
        <AlignRight size={20} />
      </button>
    </div>
  );

  const textStyleButtons = () => (
    <div className="flex gap-2 p-2 bg-dark-800 rounded-lg mb-2">
      <button
        onClick={() => updateSettings({
          textStyle: { ...settings.textStyle, bold: !settings.textStyle.bold }
        })}
        className={`p-2 rounded-md ${
          settings.textStyle.bold
            ? 'bg-purple-600 text-white shadow-inner'
            : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
        }`}
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => updateSettings({
          textStyle: { ...settings.textStyle, italic: !settings.textStyle.italic }
        })}
        className={`p-2 rounded-md ${
          settings.textStyle.italic
            ? 'bg-purple-600 text-white shadow-inner'
            : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
        }`}
      >
        <Italic size={18} />
      </button>
    </div>
  );

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const newPosition = {
      start: e.target.selectionStart || 0,
      end: e.target.selectionEnd || 0
    };
    setCursorPosition(newPosition);
    onSettingsChange({ ...settings, quoteText: newValue }, newPosition);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart || 0;
      const end = textarea.selectionEnd || 0;
      const currentText = settings.quoteText;
      
      const newText = currentText.substring(0, start) + 
                     text + 
                     currentText.substring(end);
      
      const newPosition = {
        start: start + text.length,
        end: start + text.length
      };

      onSettingsChange({ ...settings, quoteText: newText }, newPosition);
      
      // Restore cursor position after state update
      requestAnimationFrame(() => {
        if (textarea) {
          textarea.selectionStart = newPosition.start;
          textarea.selectionEnd = newPosition.end;
          textarea.focus();
        }
      });
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  // Restore cursor position after undo/redo
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea && cursorPosition) {
      textarea.selectionStart = cursorPosition.start;
      textarea.selectionEnd = cursorPosition.end;
    }
  }, [settings.quoteText, cursorPosition]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'v') {
      e.preventDefault();
      handlePaste();
    }
  };

  return (
    <div className="space-y-4">
      {/* Quote Text Section */}
      <div className="bg-surface p-4 rounded-lg border border-border">
        <div className="space-y-3">
          <div className="relative group">
            <textarea
              ref={textareaRef}
              className="w-full h-24 px-3 py-2 bg-surface-light rounded-lg border border-border text-white resize-none"
              value={settings.quoteText}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter your quote here..."
            />
            <button
              onClick={handlePaste}
              className="absolute top-2 right-2 p-1.5 rounded-md bg-surface hover:bg-surface-light text-text-secondary hover:text-white transition-colors opacity-0 group-hover:opacity-100"
              title="Paste from clipboard (Ctrl+V)"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                className="w-4 h-4"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                />
              </svg>
            </button>
          </div>
          {textStyleButtons()}
        </div>

        <div className="mt-3 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Font Family
            </label>
            <select
              className="w-full px-3 py-1.5 bg-dark-800 rounded-lg border border-dark-700 text-white"
              value={settings.fontFamily}
              onChange={(e) => updateSettings({ fontFamily: e.target.value })}
            >
              {fonts.map((font) => (
                <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Font Size: {settings.fontSize}px
              </label>
              <input
                type="range"
                min="20"
                max="100"
                value={settings.fontSize}
                onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
                className="w-full accent-purple-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Padding: {settings.padding}px
              </label>
              <input
                type="range"
                min="20"
                max="200"
                value={settings.padding}
                onChange={(e) => updateSettings({ padding: parseInt(e.target.value) })}
                className="w-full accent-purple-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Text Alignment
            </label>
            {textAlignmentButtons(settings.textAlignment, (alignment) =>
              updateSettings({ textAlignment: alignment })
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ColorPicker
              label="Background Color"
              color={settings.backgroundColor}
              onChange={(color) => updateSettings({ backgroundColor: color })}
              settings={settings}
            />
            <ColorPicker
              label="Text Color"
              color={settings.textColor}
              onChange={(color) => updateSettings({ textColor: color })}
              settings={settings}
            />
          </div>
        </div>
      </div>

      {/* Signature Section with Hover Dropdown */}
      <div 
        className="bg-surface rounded-lg border border-border overflow-hidden group"
        onMouseEnter={() => setIsSignatureOpen(true)}
        onMouseLeave={() => setIsSignatureOpen(false)}
      >
        <button
          className="w-full px-4 py-3 flex items-center justify-between text-gray-200 hover:bg-dark-800 transition-colors"
        >
          <span className="font-medium">Signature Settings</span>
          <ChevronUp 
            className={`w-5 h-5 transform transition-transform duration-300 ${
              isSignatureOpen ? 'rotate-0' : 'rotate-180'
            }`}
          />
        </button>

        <div 
          className={`transition-all duration-300 ease-in-out ${
            isSignatureOpen 
              ? 'max-h-[500px] opacity-100' 
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className="p-4 border-t border-dark-700 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Signature Text
                </label>
                <input
                  type="text"
                  value={settings.signatureText}
                  onChange={(e) => updateSettings({ signatureText: e.target.value })}
                  className="w-full px-3 py-1.5 bg-dark-800 rounded-lg border border-dark-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Signature Font
                </label>
                <select
                  className="w-full px-3 py-1.5 bg-dark-800 rounded-lg border border-dark-700 text-white"
                  value={settings.signatureFontFamily || settings.fontFamily}
                  onChange={(e) => updateSettings({ signatureFontFamily: e.target.value })}
                >
                  {fonts.map((font) => (
                    <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Signature Size: {settings.signatureSize}px
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={settings.signatureSize}
                  onChange={(e) => updateSettings({ signatureSize: parseInt(e.target.value) })}
                  className="w-full accent-purple-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Signature Alignment
                </label>
                {signatureAlignmentButtons(settings.signatureAlignment, (alignment) =>
                  updateSettings({ signatureAlignment: alignment })
                )}
              </div>
            </div>

            <ColorPicker
              label="Signature Color"
              color={settings.signatureColor}
              onChange={(color) => updateSettings({ signatureColor: color })}
              settings={settings}
            />
          </div>
        </div>
      </div>
    </div>
  );
};