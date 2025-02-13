import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Modal } from './Modal';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-dark-200">{label}</label>
      <div className="flex space-x-2">
        <button
          onClick={() => setIsOpen(true)}
          className="w-10 h-10 rounded border border-dark-600"
          style={{ backgroundColor: color }}
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-md bg-dark-900 border-dark-700 text-white placeholder-dark-400 focus:border-purple-500 focus:ring-purple-500"
        />
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Choose {label.toLowerCase()}</h3>
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      </Modal>
    </div>
  );
};