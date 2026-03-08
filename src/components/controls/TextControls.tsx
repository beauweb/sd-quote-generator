import React, { useState } from 'react';
import { ColorPicker } from '../ColorPicker';
import { QuoteSettings, GradientEffect } from '../../types';
import {
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Bold, Italic, ChevronDown, ChevronUp,
  Square, Circle, Accessibility
} from 'lucide-react';
import ContrastAnalyzer from '../ContrastAnalyzer';
import { FONTS, FONT_CATEGORY_LABELS } from '../../config/fonts';

interface TextControlsProps {
  settings: QuoteSettings;
  onUpdate: (settings: Partial<QuoteSettings>) => void;
}

export const TextControls: React.FC<TextControlsProps> = ({ settings, onUpdate }) => {
  const [textPanelOpen, setTextPanelOpen] = useState(true);
  const [showContrastAnalyzer, setShowContrastAnalyzer] = useState(false);

  const handleAlignmentChange = (alignment: 'left' | 'center' | 'right' | 'justify') => {
    onUpdate({ textAlignment: alignment });
  };

  const handleFontStyleChange = (style: 'bold' | 'italic') => {
    if (style === 'bold') {
      onUpdate({
        textStyle: {
          ...settings.textStyle,
          bold: !settings.textStyle.bold
        }
      });
    } else if (style === 'italic') {
      onUpdate({
        textStyle: {
          ...settings.textStyle,
          italic: !settings.textStyle.italic
        }
      });
    }
  };

  const handleGradientTypeChange = (type: 'linear' | 'radial') => {
    const gradient: GradientEffect = {
      ...settings.textGradient || { enabled: true, colors: ['#ffffff', '#000000'] },
      type,
      enabled: true
    };
    onUpdate({ textGradient: gradient });
  };

  const handleGradientDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const angle = parseInt(e.target.value) || 0;
    const gradient: GradientEffect = {
      ...settings.textGradient || { enabled: true, colors: ['#ffffff', '#000000'], type: 'linear' },
      angle,
      enabled: true
    };
    onUpdate({ textGradient: gradient });
  };

  const handleGradientColorChange = (index: number, color: string) => {
    if (!settings.textGradient) return;
    const colors = [...(settings.textGradient.colors || ['#ffffff', '#000000'])];
    colors[index] = color;
    const gradient: GradientEffect = { ...settings.textGradient, colors, enabled: true };
    onUpdate({ textGradient: gradient });
  };

  const handleApplySuggestion = (suggestedForeground: string, suggestedBackground: string) => {
    onUpdate({
      textColor: suggestedForeground,
      backgroundColor: suggestedBackground
    });
  };

  const getEffectiveBackgroundColor = () => {
    if (settings.backgroundGradient) {
      return settings.backgroundGradient.colors[0];
    }
    return settings.backgroundColor;
  };

  const isTextGradientEnabled = () => settings.textGradient?.enabled || false;

  // Group fonts by category for optgroups
  const fontsByCategory = Object.entries(
    FONTS.reduce((acc, font) => {
      if (!acc[font.category]) acc[font.category] = [];
      acc[font.category].push(font);
      return acc;
    }, {} as Record<string, typeof FONTS>)
  );

  const renderFontSelect = (value: string, onChange: (val: string) => void, id?: string) => (
    <select
      className="select-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      id={id}
      style={{ fontFamily: value }}
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
  );

  return (
    <div className="control-section">
      <div className="section-header">
        <div className="section-title">Text Styling</div>
        <button
          className="section-toggle"
          onClick={() => setTextPanelOpen(!textPanelOpen)}
        >
          {textPanelOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      {textPanelOpen && (
        <div className="section-content">
          <div className="control-row">
            <div className="control-group">
              <label className="control-label">Quote Font</label>
              {renderFontSelect(settings.fontFamily, (val) => onUpdate({ fontFamily: val }))}
            </div>
          </div>

          <div className="control-row">
            <div className="control-group">
              <label className="control-label">Title Font</label>
              {renderFontSelect(
                settings.titleFontFamily || settings.fontFamily,
                (val) => onUpdate({ titleFontFamily: val }),
                'title-font-select'
              )}
            </div>
          </div>

          <div className="control-row">
            <div className="control-group">
              <label className="control-label">Font Size</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  className="slider"
                  min="16"
                  max="120"
                  value={settings.fontSize}
                  onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) })}
                />
                <span className="control-value">{settings.fontSize}px</span>
              </div>
            </div>
          </div>

          <div className="control-row">
            <div className="control-group">
              <label className="control-label">Line Height</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  className="slider"
                  min="1"
                  max="2"
                  step="0.1"
                  value={settings.lineHeight || 1.2}
                  onChange={(e) => onUpdate({ lineHeight: parseFloat(e.target.value) })}
                />
                <span className="control-value">{settings.lineHeight || 1.2}</span>
              </div>
            </div>
          </div>

          <div className="control-row">
            <div className="control-group">
              <label className="control-label">Text Alignment</label>
              <div className="button-group">
                <button
                  className={`btn-icon ${settings.textAlignment === 'left' ? 'active' : ''}`}
                  onClick={() => handleAlignmentChange('left')}
                  title="Align Left"
                >
                  <AlignLeft size={16} />
                </button>
                <button
                  className={`btn-icon ${settings.textAlignment === 'center' ? 'active' : ''}`}
                  onClick={() => handleAlignmentChange('center')}
                  title="Align Center"
                >
                  <AlignCenter size={16} />
                </button>
                <button
                  className={`btn-icon ${settings.textAlignment === 'right' ? 'active' : ''}`}
                  onClick={() => handleAlignmentChange('right')}
                  title="Align Right"
                >
                  <AlignRight size={16} />
                </button>
                <button
                  className={`btn-icon ${settings.textAlignment === 'justify' ? 'active' : ''}`}
                  onClick={() => handleAlignmentChange('justify')}
                  title="Justify"
                >
                  <AlignJustify size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="control-row">
            <div className="control-group">
              <label className="control-label">Font Style</label>
              <div className="button-group">
                <button
                  className={`btn-icon ${settings.textStyle.bold ? 'active' : ''}`}
                  onClick={() => handleFontStyleChange('bold')}
                  title="Bold"
                >
                  <Bold size={16} />
                </button>
                <button
                  className={`btn-icon ${settings.textStyle.italic ? 'active' : ''}`}
                  onClick={() => handleFontStyleChange('italic')}
                  title="Italic"
                >
                  <Italic size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="control-row">
            <div className="control-group">
              <div className="flex items-center justify-between">
                <label className="control-label">Text Color</label>
                <button
                  className="text-sm text-gray-400 hover:text-white"
                  onClick={() => setShowContrastAnalyzer(!showContrastAnalyzer)}
                >
                  <div className="flex items-center gap-2">
                    <Accessibility size={14} />
                    {showContrastAnalyzer ? 'Hide Analyzer' : 'Check Contrast'}
                  </div>
                </button>
              </div>
              <ColorPicker
                color={settings.textColor}
                onChange={(color) => onUpdate({ textColor: color })}
                label="Text Color"
                settings={settings}
              />
            </div>
          </div>

          {showContrastAnalyzer && (
            <ContrastAnalyzer
              foregroundColor={settings.textColor}
              backgroundColor={getEffectiveBackgroundColor()}
              fontSize={settings.fontSize}
              isBold={settings.textStyle.bold}
              onApplySuggestion={handleApplySuggestion}
            />
          )}

          <div className="divider" />

          <div className="control-row">
            <div className="control-group">
              <div className="flex items-center justify-between">
                <label className="control-label">Use Gradient</label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={isTextGradientEnabled()}
                    onChange={(e) => {
                      const enabled = e.target.checked;
                      const gradient: GradientEffect = {
                        ...(settings.textGradient || { type: 'linear', colors: ['#ffffff', '#000000'] }),
                        enabled
                      };
                      onUpdate({ textGradient: gradient });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {isTextGradientEnabled() && settings.textGradient && (
            <>
              <div className="control-row">
                <div className="control-group">
                  <label className="control-label">Gradient Type</label>
                  <div className="button-group">
                    <button
                      className={`btn-icon ${settings.textGradient.type === 'linear' ? 'active' : ''}`}
                      onClick={() => handleGradientTypeChange('linear')}
                      title="Linear Gradient"
                    >
                      <Square size={16} />
                    </button>
                    <button
                      className={`btn-icon ${settings.textGradient.type === 'radial' ? 'active' : ''}`}
                      onClick={() => handleGradientTypeChange('radial')}
                      title="Radial Gradient"
                    >
                      <Circle size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {settings.textGradient.type === 'linear' && (
                <div className="control-row">
                  <div className="control-group">
                    <label className="control-label">Angle</label>
                    <select
                      className="select-input"
                      value={settings.textGradient.angle || 0}
                      onChange={handleGradientDirectionChange}
                    >
                      <option value="0">0° (Left to Right)</option>
                      <option value="90">90° (Bottom to Top)</option>
                      <option value="180">180° (Right to Left)</option>
                      <option value="270">270° (Top to Bottom)</option>
                      <option value="45">45° (Bottom Left to Top Right)</option>
                      <option value="135">135° (Bottom Right to Top Left)</option>
                      <option value="225">225° (Top Right to Bottom Left)</option>
                      <option value="315">315° (Top Left to Bottom Right)</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="control-row">
                <div className="control-group">
                  <label className="control-label">Color Stops</label>
                  <div className="flex items-center gap-2">
                    <ColorPicker
                      color={settings.textGradient.colors[0] || '#ffffff'}
                      onChange={(color) => handleGradientColorChange(0, color)}
                      label="Start Color"
                      settings={settings}
                    />
                    <ColorPicker
                      color={settings.textGradient.colors[1] || '#000000'}
                      onChange={(color) => handleGradientColorChange(1, color)}
                      label="End Color"
                      settings={settings}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
