import React, { useState, useRef, useEffect } from 'react';
import { ColorPicker } from './ColorPicker';
import { QuoteSettings } from '../types';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Bold, Italic, Underline, ChevronDown, ChevronUp } from 'lucide-react';

interface ControlsProps {
  settings: QuoteSettings;
  onSettingsChange: (settings: QuoteSettings) => void;
}

export const Controls: React.FC<ControlsProps> = ({ settings, onSettingsChange }) => {
  const [isTextOpen, setIsTextOpen] = useState(true);
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
    <div className="h-full flex flex-col space-y-4 overflow-auto">
      {/* Quote Text Section */}
      <div className="bg-[rgb(12_12_12/0.8)] backdrop-blur-md p-4 rounded-lg border border-dark-700 shadow-lg">
        <button
          onClick={() => setIsTextOpen(!isTextOpen)}
          className="w-full flex items-center justify-between p-2 rounded-lg bg-dark-800 text-gray-200 hover:bg-dark-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 group"
          aria-expanded={isTextOpen}
          aria-controls="text-settings-panel"
          title="Toggle text settings"
        >
          <h3 className="text-lg font-medium group-hover:text-white transition-colors">Text Settings</h3>
          {isTextOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
    
        <div
          id="text-settings-panel"
          className={`mt-4 space-y-4 ${isTextOpen ? 'block' : 'hidden'}`}
          aria-hidden={!isTextOpen}
        >
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12">
              {textStyleButtons()}
            </div>
    
            <div className="col-span-12">
              <div className="relative group">
                <textarea
                  ref={textareaRef}
                  className="w-full h-20 px-3 py-2 bg-dark-800 rounded-lg border border-dark-700 text-white resize-none transition-all focus:border-purple-500 focus:ring-1 focus:ring-purple-500 overflow-hidden"
                  value={settings.quoteText}
                  onChange={handleTextChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your quote here..."
                />
                <button
                  onClick={handlePaste}
                  className="absolute top-2 right-2 p-1.5 rounded-md bg-dark-700 hover:bg-dark-600 text-gray-300 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
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
            </div>
    
            <div className="col-span-8">
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Font Family
              </label>
              <select
                className="w-full h-9 px-3 py-1 bg-dark-800 rounded-lg border border-dark-700 text-white transition-colors hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                value={settings.fontFamily}
                onChange={(e) => updateSettings({ fontFamily: e.target.value })}
                title="Select Font Family"
              >
                {fonts.map((font) => (
                  <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>
    
            <div className="col-span-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-200">
                  Font Size: {settings.fontSize}px
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={settings.fontSize}
                  onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
                  className="w-full accent-purple-600 transition-all hover:accent-purple-500"
                  title={`Adjust font size (${settings.fontSize}px)`}
                />
              </div>
            </div>
    
            <div className="col-span-4">
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Text Alignment
              </label>
              {textAlignmentButtons(settings.textAlignment, (alignment) =>
                updateSettings({ textAlignment: alignment })
              )}
            </div>
    
            <div className="col-span-4">
              <ColorPicker
                label="Background Color"
                color={settings.backgroundColor}
                onChange={(color) => updateSettings({ backgroundColor: color })}
                settings={settings}
              />
            </div>
    
            <div className="col-span-4">
              <ColorPicker
                label="Text Color"
                color={settings.textColor}
                onChange={(color) => updateSettings({ textColor: color })}
                settings={settings}
              />
            </div>
    
            <div className="col-span-12">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-200">
                  Padding: {settings.padding}px
                </label>
                <input
                  type="range"
                  min="20"
                  max="200"
                  value={settings.padding}
                  onChange={(e) => updateSettings({ padding: parseInt(e.target.value) })}
                  className="w-full accent-purple-600 transition-all hover:accent-purple-500"
                  title={`Adjust padding (${settings.padding}px)`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Section */}
      <div className="bg-[rgb(12_12_12/0.8)] backdrop-blur-md p-4 rounded-lg border border-dark-700 shadow-lg">
        <button
          onClick={() => setIsSignatureOpen(!isSignatureOpen)}
          className="w-full flex items-center justify-between p-2 rounded-lg bg-dark-800 text-gray-200 hover:bg-dark-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 group"
          aria-expanded={isSignatureOpen}
          aria-controls="signature-settings-panel"
          title="Toggle signature settings"
        >
          <h3 className="text-lg font-medium group-hover:text-white transition-colors">Signature Settings</h3>
          {isSignatureOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
    
        <div
          id="signature-settings-panel"
          className={`mt-4 ${isSignatureOpen ? 'block' : 'hidden'}`}
          aria-hidden={!isSignatureOpen}
        >
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-4">
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Signature Text
              </label>
              <input
                type="text"
                value={settings.signatureText}
                onChange={(e) => updateSettings({ signatureText: e.target.value })}
                className="w-full h-9 px-3 py-1 bg-dark-800 rounded-lg border border-dark-700 text-white transition-colors hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              />
            </div>
    
            <div className="col-span-4">
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Signature Font
              </label>
              <select
                className="w-full h-9 px-3 py-1 bg-dark-800 rounded-lg border border-dark-700 text-white transition-colors hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
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
    
            <div className="col-span-4">
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Size: {settings.signatureSize}px
              </label>
              <input
                type="range"
                min="20"
                max="100"
                value={settings.signatureSize}
                onChange={(e) => updateSettings({ signatureSize: parseInt(e.target.value) })}
                className="w-full accent-purple-600 transition-all hover:accent-purple-500"
              />
            </div>
    
            <div className="col-span-6">
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Alignment
              </label>
              {signatureAlignmentButtons(settings.signatureAlignment, (alignment) =>
                updateSettings({ signatureAlignment: alignment })
              )}
            </div>
    
            <div className="col-span-6">
              <ColorPicker
                label="Color"
                color={settings.signatureColor}
                onChange={(color) => updateSettings({ signatureColor: color })}
                settings={settings}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};