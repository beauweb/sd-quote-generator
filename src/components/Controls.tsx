import React from 'react';
import { ColorPicker } from './ColorPicker';
import { QuoteSettings } from '../types';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Bold, Italic, Underline } from 'lucide-react';

interface ControlsProps {
  settings: QuoteSettings;
  onSettingsChange: (settings: QuoteSettings) => void;
}

export const Controls: React.FC<ControlsProps> = ({ settings, onSettingsChange }) => {
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
    <div className="flex space-x-2 mb-2">
      <button
        onClick={() => updateSettings({ 
          textStyle: { 
            ...settings.textStyle, 
            bold: !settings.textStyle.bold 
          } 
        })}
        className={`p-2 rounded ${
          settings.textStyle.bold
            ? 'bg-purple-600 text-white'
            : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
        }`}
      >
        <Bold size={20} />
      </button>
      <button
        onClick={() => updateSettings({ 
          textStyle: { 
            ...settings.textStyle, 
            italic: !settings.textStyle.italic 
          } 
        })}
        className={`p-2 rounded ${
          settings.textStyle.italic
            ? 'bg-purple-600 text-white'
            : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
        }`}
      >
        <Italic size={20} />
      </button>
      <button
        onClick={() => updateSettings({ 
          textStyle: { 
            ...settings.textStyle, 
            underline: !settings.textStyle.underline 
          } 
        })}
        className={`p-2 rounded ${
          settings.textStyle.underline
            ? 'bg-purple-600 text-white'
            : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
        }`}
      >
        <Underline size={20} />
      </button>
    </div>
  );

  return (
    <div className="space-y-6 p-6 bg-dark-900 rounded-lg shadow-xl border border-dark-800">
      <div>
        <label className="block text-sm font-medium text-dark-200 mb-2">Quote Text</label>
        {textStyleButtons()}
        <textarea
          value={settings.quoteText}
          onChange={(e) => updateSettings({ quoteText: e.target.value })}
          className="mt-1 block w-full rounded-md bg-dark-800 border-dark-700 text-white placeholder-dark-400 focus:border-purple-500 focus:ring-purple-500 pl-[15px] py-[10px]"
          rows={8}
          style={{
            lineHeight: '1.5',
            fontFamily: settings.fontFamily,
            fontWeight: settings.textStyle.bold ? 'bold' : 'normal',
            fontStyle: settings.textStyle.italic ? 'italic' : 'normal',
            textDecoration: settings.textStyle.underline ? 'underline' : 'none',
            resize: 'none'
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-200">Font Family</label>
        <select
          value={settings.fontFamily}
          onChange={(e) => updateSettings({ fontFamily: e.target.value })}
          className="mt-1 block w-full rounded-md bg-dark-800 border-dark-700 text-white focus:border-purple-500 focus:ring-purple-500 p-[10px]"
          style={{ fontFamily: settings.fontFamily }}
        >
          {fonts.map((font) => (
            <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
              {font.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-200">Font Size: {settings.fontSize}px</label>
        <input
          type="range"
          min="5"
          max="100"
          value={settings.fontSize}
          onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
          className="mt-1 block w-full accent-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-200">Text Alignment</label>
        {textAlignmentButtons(settings.textAlignment, (alignment) =>
          updateSettings({ textAlignment: alignment })
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-200">Padding: {settings.padding}px</label>
        <input
          type="range"
          min="100"
          max="200"
          value={settings.padding}
          onChange={(e) => updateSettings({ padding: Number(e.target.value) })}
          className="mt-1 block w-full accent-purple-500"
        />
      </div>

      <ColorPicker
        color={settings.backgroundColor}
        onChange={(color) => updateSettings({ backgroundColor: color })}
        label="Background Color"
      />

      <ColorPicker
        color={settings.textColor}
        onChange={(color) => updateSettings({ textColor: color })}
        label="Text Color"
      />

      <div>
        <label className="block text-sm font-medium text-dark-200">Signature Text</label>
        <input
          type="text"
          value={settings.signatureText}
          onChange={(e) => updateSettings({ signatureText: e.target.value })}
          className="mt-1 block w-full rounded-md bg-dark-800 border-dark-700 text-white placeholder-dark-400 focus:border-purple-500 focus:ring-purple-500 p-[10px]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-200">Signature Size: {settings.signatureSize}px</label>
        <input
          type="range"
          min="5"
          max="48"
          value={settings.signatureSize}
          onChange={(e) => updateSettings({ signatureSize: Number(e.target.value) })}
          className="mt-1 block w-full accent-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-200">Signature Alignment</label>
        {signatureAlignmentButtons(settings.signatureAlignment, (alignment) =>
          updateSettings({ signatureAlignment: alignment })
        )}
      </div>

      <ColorPicker
        color={settings.signatureColor}
        onChange={(color) => updateSettings({ signatureColor: color })}
        label="Signature Color"
      />
    </div>
  );
};