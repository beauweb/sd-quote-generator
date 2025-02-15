import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Modal } from './Modal';
import { QuoteCanvas } from './QuoteCanvas';
import { QuoteSettings } from '../types';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
  settings: QuoteSettings;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, label, settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(color.replace('#', ''));
  const [previewSettings, setPreviewSettings] = useState(settings);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace('#', '');
    setInputValue(value);
    
    if (/^[0-9A-Fa-f]{6}$/.test(value)) {
      const newColor = '#' + value;
      onChange(newColor);
      updatePreviewSettings(newColor);
    }
  };

  const updatePreviewSettings = (newColor: string) => {
    switch(label) {
      case 'Background Color':
        setPreviewSettings({ ...settings, backgroundColor: newColor });
        break;
      case 'Text Color':
        setPreviewSettings({ ...settings, textColor: newColor });
        break;
      case 'Signature Color':
        setPreviewSettings({ ...settings, signatureColor: newColor });
        break;
    }
  };

  React.useEffect(() => {
    setInputValue(color.replace('#', ''));
    setPreviewSettings(settings);
  }, [color, settings]);

  const handleBlur = () => {
    if (/^[0-9A-Fa-f]{6}$/.test(inputValue)) {
      onChange('#' + inputValue);
    } else {
      setInputValue(color.replace('#', ''));
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-200 mb-2">{label}</label>
      <div className="flex space-x-2">
        <button
          onClick={() => setIsOpen(true)}
          className="w-10 h-10 rounded-lg border border-dark-600 overflow-hidden"
          style={{ backgroundColor: color }}
        />
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">#</span>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            maxLength={6}
            className="w-full px-3 py-2 pl-7 rounded-lg bg-dark-800 border border-dark-700 text-white text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            placeholder="000000"
          />
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Choose {label.toLowerCase()}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <HexColorPicker 
                color={color} 
                onChange={(newColor) => {
                  onChange(newColor);
                  setInputValue(newColor.replace('#', ''));
                  updatePreviewSettings(newColor);
                }} 
              />
            </div>
            <div className="bg-dark-800 rounded-lg p-4">
              <div className="w-full aspect-square">
                <QuoteCanvas settings={previewSettings} canvasSize={200} />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};