import React, { useState } from 'react';
import { ColorPicker } from '../ColorPicker';
import { QuoteSettings, TextShadowEffect, TextOutlineEffect } from '../../types';
import { ChevronDown, ChevronUp, Accessibility } from 'lucide-react';
import ContrastAnalyzer from '../ContrastAnalyzer';

interface EffectsControlsProps {
  settings: QuoteSettings;
  onUpdate: (settings: Partial<QuoteSettings>) => void;
}

export const EffectsControls: React.FC<EffectsControlsProps> = ({ settings, onUpdate }) => {
  const [effectsPanelOpen, setEffectsPanelOpen] = useState(true);
  const [showContrastAnalyzer, setShowContrastAnalyzer] = useState(false);

  const handleTextShadowChange = (property: keyof TextShadowEffect, value: number | string) => {
    const textShadow: TextShadowEffect = {
      ...(settings.textShadow || { enabled: true, color: '#000000', blur: 5, offsetX: 0, offsetY: 0 }),
      [property]: value,
      enabled: true
    };
    onUpdate({ textShadow });
  };

  const handleOutlineChange = (property: keyof TextOutlineEffect, value: number | string) => {
    const textOutline: TextOutlineEffect = {
      ...(settings.textOutline || { enabled: true, color: '#000000', width: 2 }),
      [property]: value,
      enabled: true
    };
    onUpdate({ textOutline });
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

  const isTextShadowEnabled = () => settings.textShadow?.enabled || false;
  const isTextOutlineEnabled = () => settings.textOutline?.enabled || false;

  return (
    <div className="control-section">
      <div className="section-header">
        <div className="section-title">Effects</div>
        <button
          className="section-toggle"
          onClick={() => setEffectsPanelOpen(!effectsPanelOpen)}
        >
          {effectsPanelOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      {effectsPanelOpen && (
        <div className="section-content">
          <div className="control-row">
            <div className="control-group">
              <div className="flex items-center justify-between">
                <label className="control-label">Use Text Shadow</label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={isTextShadowEnabled()}
                    onChange={(e) => {
                      const enabled = e.target.checked;
                      const shadow: TextShadowEffect = {
                        ...(settings.textShadow || { color: '#000000', blur: 5, offsetX: 0, offsetY: 0 }),
                        enabled
                      };
                      onUpdate({ textShadow: shadow });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {isTextShadowEnabled() && settings.textShadow && (
            <>
              <div className="control-row">
                <div className="control-group">
                  <label className="control-label">Shadow Color</label>
                  <ColorPicker
                    color={settings.textShadow.color}
                    onChange={(color) => handleTextShadowChange('color', color)}
                    label="Shadow Color"
                    settings={settings}
                  />
                </div>
              </div>

              <div className="control-row">
                <div className="control-group">
                  <label className="control-label">Blur Radius</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      className="slider"
                      min="0"
                      max="20"
                      value={settings.textShadow.blur}
                      onChange={(e) => handleTextShadowChange('blur', parseInt(e.target.value))}
                    />
                    <span className="control-value">{settings.textShadow.blur}px</span>
                  </div>
                </div>
              </div>

              <div className="control-row">
                <div className="control-group">
                  <label className="control-label">Horizontal Offset</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      className="slider"
                      min="-20"
                      max="20"
                      value={settings.textShadow.offsetX}
                      onChange={(e) => handleTextShadowChange('offsetX', parseInt(e.target.value))}
                    />
                    <span className="control-value">{settings.textShadow.offsetX}px</span>
                  </div>
                </div>
              </div>

              <div className="control-row">
                <div className="control-group">
                  <label className="control-label">Vertical Offset</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      className="slider"
                      min="-20"
                      max="20"
                      value={settings.textShadow.offsetY}
                      onChange={(e) => handleTextShadowChange('offsetY', parseInt(e.target.value))}
                    />
                    <span className="control-value">{settings.textShadow.offsetY}px</span>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="divider" />

          <div className="control-row">
            <div className="control-group">
              <div className="flex items-center justify-between">
                <label className="control-label">Use Text Outline</label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={isTextOutlineEnabled()}
                    onChange={(e) => {
                      const enabled = e.target.checked;
                      const outline: TextOutlineEffect = {
                        ...(settings.textOutline || { color: '#000000', width: 2 }),
                        enabled
                      };
                      onUpdate({ textOutline: outline });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {isTextOutlineEnabled() && settings.textOutline && (
            <>
              <div className="control-row">
                <div className="control-group">
                  <label className="control-label">Outline Color</label>
                  <ColorPicker
                    color={settings.textOutline.color}
                    onChange={(color) => handleOutlineChange('color', color)}
                    label="Outline Color"
                    settings={settings}
                  />
                </div>
              </div>

              <div className="control-row">
                <div className="control-group">
                  <label className="control-label">Outline Width</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      className="slider"
                      min="1"
                      max="10"
                      value={settings.textOutline.width}
                      onChange={(e) => handleOutlineChange('width', parseInt(e.target.value))}
                    />
                    <span className="control-value">{settings.textOutline.width}px</span>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="divider" />

          <div className="control-row">
            <div className="control-group">
              <div className="flex items-center justify-between">
                <label className="control-label">Overall Contrast Analysis</label>
                <button
                  className="text-sm text-gray-400 hover:text-white"
                  onClick={() => setShowContrastAnalyzer(!showContrastAnalyzer)}
                >
                  <div className="flex items-center gap-2">
                    <Accessibility size={14} />
                    {showContrastAnalyzer ? 'Hide Analysis' : 'Check Overall Contrast'}
                  </div>
                </button>
              </div>
              <div className="control-note">
                <small style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>
                  💡 Analyze contrast for main text against background
                </small>
              </div>
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
        </div>
      )}
    </div>
  );
};
