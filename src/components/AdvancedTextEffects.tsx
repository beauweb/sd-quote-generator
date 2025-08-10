import React, { useState } from 'react';
import { QuoteSettings } from '../types';

interface AdvancedTextEffectsProps {
  settings: QuoteSettings;
  onSettingsChange: (settings: QuoteSettings) => void;
}

export const AdvancedTextEffects: React.FC<AdvancedTextEffectsProps> = ({
  settings,
  onSettingsChange,
}) => {
  const [activeTab, setActiveTab] = useState<'path' | 'animation' | 'fitting'>('path');

  const updateSettings = (newSettings: Partial<QuoteSettings>) => {
    onSettingsChange({ ...settings, ...newSettings });
  };

  const updateTextPath = (property: keyof NonNullable<QuoteSettings['textPath']>, value: any) => {
    const textPath = {
      ...(settings.textPath || { enabled: false, radius: 200, angle: 0, direction: 'clockwise' as const }),
      [property]: value,
    };
    updateSettings({ textPath });
  };

  const toggleTextPath = () => {
    const textPath = settings.textPath ? { ...settings.textPath, enabled: !settings.textPath.enabled } : {
      enabled: true,
      radius: 200,
      angle: 0,
      direction: 'clockwise' as const,
    };
    updateSettings({ textPath });
  };

  return (
    <div className="control-section">
      <div className="section-header">
        <div className="section-title">Advanced Text Effects</div>
      </div>
      
      <div className="section-content">
        {/* Tab Navigation */}
        <div className="tabs-container mb-4">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'path' ? 'active' : ''}`}
              onClick={() => setActiveTab('path')}
            >
              <span>Text Path</span>
            </button>
            <button
              className={`tab ${activeTab === 'animation' ? 'active' : ''}`}
              onClick={() => setActiveTab('animation')}
            >
              <span>Animation</span>
            </button>
            <button
              className={`tab ${activeTab === 'fitting' ? 'active' : ''}`}
              onClick={() => setActiveTab('fitting')}
            >
              <span>Smart Fitting</span>
            </button>
          </div>
        </div>

        {/* Text Path Controls */}
        {activeTab === 'path' && (
          <div className="tab-panel active">
            <div className="control-group">
              <label className="control-label">
                <input
                  type="checkbox"
                  checked={settings.textPath?.enabled || false}
                  onChange={toggleTextPath}
                  className="checkbox"
                />
                Enable Text Path
              </label>
            </div>

            {settings.textPath?.enabled && (
              <>
                <div className="control-group">
                  <label className="control-label">
                    Path Radius: {settings.textPath.radius}px
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="10"
                    value={settings.textPath.radius}
                    onChange={(e) => updateTextPath('radius', parseInt(e.target.value))}
                    className="slider"
                  />
                </div>

                <div className="control-group">
                  <label className="control-label">
                    Start Angle: {settings.textPath.angle}°
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="15"
                    value={settings.textPath.angle}
                    onChange={(e) => updateTextPath('angle', parseInt(e.target.value))}
                    className="slider"
                  />
                </div>

                <div className="control-group">
                  <label className="control-label">Direction</label>
                  <select
                    className="select-input"
                    value={settings.textPath.direction}
                    onChange={(e) => updateTextPath('direction', e.target.value)}
                  >
                    <option value="clockwise">Clockwise</option>
                    <option value="counterclockwise">Counter-clockwise</option>
                  </select>
                </div>
              </>
            )}
          </div>
        )}

        {/* Animation Controls */}
        {activeTab === 'animation' && (
          <div className="tab-panel active">
            <div className="control-group">
              <label className="control-label">Text Animation</label>
              <select className="select-input">
                <option value="none">None</option>
                <option value="fade-in">Fade In</option>
                <option value="slide-up">Slide Up</option>
                <option value="slide-down">Slide Down</option>
                <option value="scale-in">Scale In</option>
                <option value="bounce">Bounce</option>
                <option value="typewriter">Typewriter</option>
              </select>
            </div>

            <div className="control-group">
              <label className="control-label">
                Animation Duration: 1.0s
              </label>
              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                defaultValue="1.0"
                className="slider"
              />
            </div>

            <div className="control-group">
              <label className="control-label">Easing</label>
              <select className="select-input">
                <option value="ease">Ease</option>
                <option value="ease-in">Ease In</option>
                <option value="ease-out">Ease Out</option>
                <option value="ease-in-out">Ease In Out</option>
                <option value="linear">Linear</option>
                <option value="bounce">Bounce</option>
              </select>
            </div>

            <div className="control-group">
              <label className="control-label">
                <input type="checkbox" className="checkbox" />
                Loop Animation
              </label>
            </div>
          </div>
        )}

        {/* Smart Fitting Controls */}
        {activeTab === 'fitting' && (
          <div className="tab-panel active">
            <div className="control-group">
              <label className="control-label">
                <input type="checkbox" className="checkbox" />
                Auto-fit Text to Container
              </label>
            </div>

            <div className="control-group">
              <label className="control-label">Minimum Font Size</label>
              <input
                type="number"
                min="8"
                max="200"
                defaultValue="12"
                className="text-input"
              />
            </div>

            <div className="control-group">
              <label className="control-label">Maximum Font Size</label>
              <input
                type="number"
                min="12"
                max="500"
                defaultValue="72"
                className="text-input"
              />
            </div>

            <div className="control-group">
              <label className="control-label">Text Overflow</label>
              <select className="select-input">
                <option value="ellipsis">Show Ellipsis (...)</option>
                <option value="truncate">Truncate</option>
                <option value="wrap">Wrap to Next Line</option>
                <option value="scale">Scale Down</option>
              </select>
            </div>

            <div className="control-group">
              <label className="control-label">
                <input type="checkbox" className="checkbox" />
                Maintain Aspect Ratio
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 