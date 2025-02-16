import React, { useState } from 'react';
import { ColorPicker } from './ColorPicker';
import { QuoteSettings } from '../types';

interface GradientPickerProps {
  gradient: {
    type: 'solid' | 'linear' | 'radial';
    colors: string[];
    angle?: number;
  };
  onChange: (gradient: any) => void;
  settings: QuoteSettings;
}

export const GradientPicker: React.FC<GradientPickerProps> = ({
  gradient,
  onChange,
  settings
}) => {
  const handleTypeChange = (type: 'solid' | 'linear' | 'radial') => {
    onChange({
      ...gradient,
      type
    });
  };

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...gradient.colors];
    newColors[index] = color;
    onChange({
      ...gradient,
      colors: newColors
    });
  };

  const handleAngleChange = (angle: number) => {
    onChange({
      ...gradient,
      angle
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          onClick={() => handleTypeChange('solid')}
          className={`px-3 py-1.5 rounded-lg ${
            gradient.type === 'solid'
              ? 'bg-primary text-white'
              : 'bg-surface-light text-gray-200 hover:bg-opacity-80'
          } transition-colors`}
        >
          Solid
        </button>
        <button
          onClick={() => handleTypeChange('linear')}
          className={`px-3 py-1.5 rounded-lg ${
            gradient.type === 'linear'
              ? 'bg-primary text-white'
              : 'bg-surface-light text-gray-200 hover:bg-opacity-80'
          } transition-colors`}
        >
          Linear
        </button>
        <button
          onClick={() => handleTypeChange('radial')}
          className={`px-3 py-1.5 rounded-lg ${
            gradient.type === 'radial'
              ? 'bg-primary text-white'
              : 'bg-surface-light text-gray-200 hover:bg-opacity-80'
          } transition-colors`}
        >
          Radial
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ColorPicker
          label="Color 1"
          color={gradient.colors[0]}
          onChange={(color) => handleColorChange(0, color)}
          settings={settings}
        />
        {gradient.type !== 'solid' && (
          <ColorPicker
            label="Color 2"
            color={gradient.colors[1]}
            onChange={(color) => handleColorChange(1, color)}
            settings={settings}
          />
        )}
      </div>

      {gradient.type === 'linear' && (
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Angle: {gradient.angle}°
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={gradient.angle}
            onChange={(e) => handleAngleChange(parseInt(e.target.value))}
            className="w-full accent-purple-600"
          />
        </div>
      )}

      <div
        className="w-full h-12 rounded-lg mt-2"
        style={{
          background:
            gradient.type === 'solid'
              ? gradient.colors[0]
              : gradient.type === 'linear'
              ? `linear-gradient(${gradient.angle}deg, ${gradient.colors[0]}, ${gradient.colors[1]})`
              : `radial-gradient(circle, ${gradient.colors[0]}, ${gradient.colors[1]})`
        }}
      />
    </div>
  );
};