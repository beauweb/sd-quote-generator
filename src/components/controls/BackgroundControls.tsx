import React, { useState } from 'react';
import { ColorPicker } from '../ColorPicker';
import { QuoteSettings } from '../../types';
import { ChevronDown, ChevronUp, Square, Circle, Eye } from 'lucide-react';
import ContrastAnalyzer from '../ContrastAnalyzer';

interface BackgroundControlsProps {
  settings: QuoteSettings;
  onUpdate: (settings: Partial<QuoteSettings>) => void;
}

export const BackgroundControls: React.FC<BackgroundControlsProps> = ({ settings, onUpdate }) => {
  const [backgroundPanelOpen, setBackgroundPanelOpen] = useState(true);
  const [showTextContrast, setShowTextContrast] = useState(false);

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

  return (
    <div className="control-section">
      <div className="section-header">
        <div className="section-title">Background</div>
        <button
          className="section-toggle"
          onClick={() => setBackgroundPanelOpen(!backgroundPanelOpen)}
        >
          {backgroundPanelOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      {backgroundPanelOpen && (
        <div className="section-content">
          <div className="control-row">
            <div className="control-group">
              <div className="flex items-center justify-between">
                <label className="control-label">Background Type</label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={!!settings.backgroundGradient}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onUpdate({
                          backgroundGradient: {
                            type: 'linear',
                            colors: ['#3B82F6', '#EC4899'],
                            angle: 45
                          }
                        });
                      } else {
                        onUpdate({ backgroundGradient: undefined });
                      }
                    }}
                  />
                  <span className="text-sm text-gray-400">
                    {settings.backgroundGradient ? 'Gradient' : 'Solid Color'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {!settings.backgroundGradient && (
            <div className="control-row">
              <div className="control-group">
                <label className="control-label">Background Color</label>
                <ColorPicker
                  color={settings.backgroundColor}
                  onChange={(color) => onUpdate({ backgroundColor: color })}
                  label="Background Color"
                  settings={settings}
                />
                <div className="control-note">
                  <small style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>
                    Choose a solid color for your quote background
                  </small>
                </div>
              </div>
            </div>
          )}

          <div className="control-row">
            <div className="control-group">
              <div className="flex items-center justify-between">
                <label className="control-label">Background Contrast</label>
                <button
                  className="text-sm text-gray-400 hover:text-white"
                  onClick={() => setShowTextContrast(!showTextContrast)}
                >
                  <div className="flex items-center gap-2">
                    <Eye size={14} />
                    {showTextContrast ? 'Hide Analysis' : 'Check Contrast'}
                  </div>
                </button>
              </div>
              <div className="control-note">
                <small style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>
                  💡 Check how your text looks against this background
                </small>
              </div>
            </div>
          </div>

          {showTextContrast && (
            <ContrastAnalyzer
              foregroundColor={settings.textColor}
              backgroundColor={getEffectiveBackgroundColor()}
              fontSize={settings.fontSize}
              isBold={settings.textStyle.bold}
              onApplySuggestion={handleApplySuggestion}
            />
          )}

          {settings.backgroundGradient && (
            <>
              <div className="control-note" style={{ marginBottom: '16px' }}>
                <small style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>
                  Create beautiful gradient backgrounds with two colors
                </small>
              </div>
              <div className="control-row">
                <div className="control-group">
                  <label className="control-label">Gradient Type</label>
                  <div className="button-group">
                    <button
                      className={`btn-icon ${settings.backgroundGradient.type === 'linear' ? 'active' : ''}`}
                      onClick={() => {
                        const gradient = {
                          ...settings.backgroundGradient!,
                          type: 'linear' as const,
                          colors: settings.backgroundGradient?.colors || ['#3B82F6', '#EC4899']
                        };
                        onUpdate({ backgroundGradient: gradient });
                      }}
                      title="Linear Gradient"
                    >
                      <Square size={16} />
                    </button>
                    <button
                      className={`btn-icon ${settings.backgroundGradient.type === 'radial' ? 'active' : ''}`}
                      onClick={() => {
                        const gradient = {
                          ...settings.backgroundGradient!,
                          type: 'radial' as const,
                          colors: settings.backgroundGradient?.colors || ['#3B82F6', '#EC4899']
                        };
                        onUpdate({ backgroundGradient: gradient });
                      }}
                      title="Radial Gradient"
                    >
                      <Circle size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {settings.backgroundGradient.type === 'linear' && (
                <div className="control-row">
                  <div className="control-group">
                    <label className="control-label">Angle</label>
                    <select
                      className="select-input"
                      value={settings.backgroundGradient.angle || 0}
                      onChange={(e) => {
                        const gradient = {
                          ...settings.backgroundGradient!,
                          angle: parseInt(e.target.value),
                          colors: settings.backgroundGradient?.colors || ['#3B82F6', '#EC4899']
                        };
                        onUpdate({ backgroundGradient: gradient });
                      }}
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
                      color={settings.backgroundGradient.colors[0]}
                      onChange={(color) => {
                        if (!settings.backgroundGradient) return;
                        const colors = [...settings.backgroundGradient.colors];
                        colors[0] = color;
                        const gradient = { ...settings.backgroundGradient, colors };
                        onUpdate({ backgroundGradient: gradient });
                      }}
                      label="Start Color"
                      settings={settings}
                    />
                    <ColorPicker
                      color={settings.backgroundGradient.colors[1]}
                      onChange={(color) => {
                        if (!settings.backgroundGradient) return;
                        const colors = [...settings.backgroundGradient.colors];
                        colors[1] = color;
                        const gradient = { ...settings.backgroundGradient, colors };
                        onUpdate({ backgroundGradient: gradient });
                      }}
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
