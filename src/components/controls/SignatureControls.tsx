import React from 'react';
import { QuoteSettings } from '../../types';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { FONTS, FONT_CATEGORY_LABELS } from '../../config/fonts';

interface SignatureControlsProps {
  settings: QuoteSettings;
  onUpdate: (settings: Partial<QuoteSettings>) => void;
}

export const SignatureControls: React.FC<SignatureControlsProps> = ({ settings, onUpdate }) => {
  const fontsByCategory = Object.entries(
    FONTS.reduce((acc, font) => {
      if (!acc[font.category]) acc[font.category] = [];
      acc[font.category].push(font);
      return acc;
    }, {} as Record<string, typeof FONTS>)
  );

  return (
    <div className="control-section">
      <div className="section-header">
        <div className="section-title">Signature Styling</div>
      </div>
      <div className="section-content">
        <div className="control-row">
          <div className="control-group">
            <label className="control-label">Signature Size</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                className="slider"
                min="16"
                max="80"
                value={settings.signatureSize}
                onChange={(e) => onUpdate({ signatureSize: parseInt(e.target.value) })}
              />
              <span className="control-value">{settings.signatureSize}px</span>
            </div>
          </div>
        </div>

        <div className="control-row">
          <div className="control-group">
            <label className="control-label">Signature Font Family</label>
            <select
              className="select-input"
              value={settings.signatureFontFamily || settings.fontFamily}
              onChange={(e) => onUpdate({ signatureFontFamily: e.target.value })}
              style={{ fontFamily: settings.signatureFontFamily || settings.fontFamily }}
            >
              {fontsByCategory.map(([category, fonts]) => (
                <optgroup key={category} label={FONT_CATEGORY_LABELS[category] || category}>
                  {fonts.map(font => (
                    <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                      {font.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        <div className="control-row">
          <div className="control-group">
            <label className="control-label">Signature Alignment</label>
            <div className="button-group">
              <button
                className={`btn-icon ${settings.signatureAlignment === 'left' ? 'active' : ''}`}
                onClick={() => onUpdate({ signatureAlignment: 'left' })}
                title="Align Left"
              >
                <AlignLeft size={16} />
              </button>
              <button
                className={`btn-icon ${settings.signatureAlignment === 'center' ? 'active' : ''}`}
                onClick={() => onUpdate({ signatureAlignment: 'center' })}
                title="Align Center"
              >
                <AlignCenter size={16} />
              </button>
              <button
                className={`btn-icon ${settings.signatureAlignment === 'right' ? 'active' : ''}`}
                onClick={() => onUpdate({ signatureAlignment: 'right' })}
                title="Align Right"
              >
                <AlignRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="control-row">
          <div className="control-group">
            <label className="control-label">Bottom Margin</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                className="slider"
                min="20"
                max="200"
                value={settings.signatureBottomMargin || 100}
                onChange={(e) => onUpdate({ signatureBottomMargin: parseInt(e.target.value) })}
              />
              <span className="control-value">{settings.signatureBottomMargin || 100}px</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
