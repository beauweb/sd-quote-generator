import React from 'react';
import { QuoteSettings } from '../types';
import { Type, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';

interface TextTransformControlsProps {
  settings: QuoteSettings;
  onSettingsChange: (settings: Partial<QuoteSettings>) => void;
}

export const TextTransformControls: React.FC<TextTransformControlsProps> = ({ 
  settings, 
  onSettingsChange 
}) => {
  const handleTextTransformChange = (transform: 'none' | 'uppercase' | 'lowercase' | 'capitalize') => {
    onSettingsChange({ textTransform: transform });
  };

  const handleLineHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lineHeight = parseFloat(e.target.value);
    onSettingsChange({ lineHeight });
  };

  return (
    <div className="text-transform-controls">
      <div className="control-group">
        <label className="control-label">Text Transform</label>
        <div className="flex space-x-2">
          <button
            className={`control-button ${settings.textTransform === 'none' ? 'active' : ''}`}
            onClick={() => handleTextTransformChange('none')}
            title="Normal text"
          >
            Aa
          </button>
          <button
            className={`control-button ${settings.textTransform === 'uppercase' ? 'active' : ''}`}
            onClick={() => handleTextTransformChange('uppercase')}
            title="UPPERCASE"
          >
            AA
          </button>
          <button
            className={`control-button ${settings.textTransform === 'lowercase' ? 'active' : ''}`}
            onClick={() => handleTextTransformChange('lowercase')}
            title="lowercase"
          >
            aa
          </button>
          <button
            className={`control-button ${settings.textTransform === 'capitalize' ? 'active' : ''}`}
            onClick={() => handleTextTransformChange('capitalize')}
            title="Capitalize"
          >
            Aa
          </button>
        </div>
      </div>

      <div className="control-group mt-4">
        <div className="flex justify-between items-center">
          <label className="control-label">Line Height</label>
          <span className="text-sm opacity-80">{settings.lineHeight || 1.2}</span>
        </div>
        <input
          type="range"
          min="0.8"
          max="3"
          step="0.1"
          value={settings.lineHeight || 1.2}
          onChange={handleLineHeightChange}
          className="w-full slider"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Tight</span>
          <span>Normal</span>
          <span>Loose</span>
        </div>
      </div>
    </div>
  );
};
