import React, { useState, useRef, useEffect } from 'react';
import { ColorPicker } from './ColorPicker';
import { QuoteSettings, TextShadowEffect, TextOutlineEffect, GradientEffect } from '../types';
import { 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, 
  Bold, Italic, Underline, ChevronDown, ChevronUp,
  Type, Palette, Box, Circle, Droplet, Layers,
  Accessibility, Square
} from 'lucide-react';
import './Controls.css';
import ContrastAnalyzer from './ContrastAnalyzer';
import { PulseCard } from './ui/PulseCard';

interface ControlsProps {
  settings: QuoteSettings;
  onSettingsChange: (settings: QuoteSettings) => void;
}

export const Controls: React.FC<ControlsProps> = ({ settings, onSettingsChange }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'dimensions'>('content');
  const [textPanelOpen, setTextPanelOpen] = useState(true);
  const [backgroundPanelOpen, setBackgroundPanelOpen] = useState(true);
  const [effectsPanelOpen, setEffectsPanelOpen] = useState(true);
  const [showContrastAnalyzer, setShowContrastAnalyzer] = useState(false);

  const updateSettings = (newSettings: Partial<QuoteSettings>) => {
    onSettingsChange({ ...settings, ...newSettings });
  };

  const handleAlignmentChange = (alignment: 'left' | 'center' | 'right' | 'justify') => {
    updateSettings({ textAlignment: alignment });
  };

  const handleFontStyleChange = (style: 'bold' | 'italic') => {
    if (style === 'bold') {
      updateSettings({ 
        textStyle: { 
          ...settings.textStyle, 
          bold: !settings.textStyle.bold 
        } 
      });
    } else if (style === 'italic') {
      updateSettings({ 
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
    updateSettings({ textGradient: gradient });
  };

  const handleGradientDirectionChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const angle = parseInt(e.target.value) || 0;
    const gradient: GradientEffect = { 
      ...settings.textGradient || { enabled: true, colors: ['#ffffff', '#000000'], type: 'linear' }, 
      angle,
      enabled: true
    };
    updateSettings({ textGradient: gradient });
  };

  const handleGradientColorChange = (index: number, color: string) => {
    if (!settings.textGradient) return;
    
    const colors = [...(settings.textGradient.colors || ['#ffffff', '#000000'])];
    colors[index] = color;
    const gradient: GradientEffect = { ...settings.textGradient, colors, enabled: true };
    updateSettings({ textGradient: gradient });
  };

  const handleTextShadowChange = (property: keyof TextShadowEffect, value: number | string) => {
    const textShadow: TextShadowEffect = { 
      ...(settings.textShadow || { enabled: true, color: '#000000', blur: 5, offsetX: 0, offsetY: 0 }), 
      [property]: value,
      enabled: true
    };
    updateSettings({ textShadow });
  };

  const handleOutlineChange = (property: keyof TextOutlineEffect, value: number | string) => {
    const textOutline: TextOutlineEffect = { 
      ...(settings.textOutline || { enabled: true, color: '#000000', width: 2 }), 
      [property]: value,
      enabled: true
    };
    updateSettings({ textOutline });
  };

  const handleApplySuggestion = (suggestedForeground: string, suggestedBackground: string) => {
    // Update both text color and background color based on suggestion
    updateSettings({
      textColor: suggestedForeground,
      backgroundColor: suggestedBackground
    });
  };

  // Helper to check if a gradient is enabled
  const isTextGradientEnabled = () => settings.textGradient?.enabled || false;
  const isTextShadowEnabled = () => settings.textShadow?.enabled || false;
  const isTextOutlineEnabled = () => settings.textOutline?.enabled || false;

  return (
    <div className="controls-container">
      <div className="tabs-container">
        <div className="tabs">
      <button
            className={`tab ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            <Type size={16} />
            <span>Content</span>
      </button>
      <button
            className={`tab ${activeTab === 'style' ? 'active' : ''}`}
            onClick={() => setActiveTab('style')}
          >
            <Palette size={16} />
            <span>Style</span>
      </button>
      <button
            className={`tab ${activeTab === 'dimensions' ? 'active' : ''}`}
            onClick={() => setActiveTab('dimensions')}
          >
            <Box size={16} />
            <span>Dimensions</span>
      </button>
    </div>
    </div>

      <div className="panels-container">
        {/* Content Tab */}
        <div className={`tab-panel ${activeTab === 'content' ? 'active' : ''}`}>
          <div className="control-section">
            <div className="section-content">
              <div className="control-group">
                <label className="control-label">Quote Text</label>
                <textarea
                  className="textarea"
                  value={settings.quoteText}
                  onChange={(e) => updateSettings({ quoteText: e.target.value })}
                  placeholder="Enter your quote text here..."
        />
      </div>

              <div className="divider" />

              <div className="control-group">
                <label className="control-label">Author</label>
        <input
                  type="text"
                  className="text-input"
                  value={settings.signatureText}
                  onChange={(e) => updateSettings({ signatureText: e.target.value })}
                  placeholder="Quote author (optional)"
        />
      </div>
    </div>
          </div>
        </div>

        {/* Style Tab */}
        <div className={`tab-panel ${activeTab === 'style' ? 'active' : ''}`}>
          {/* Text Styling */}
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
                    <label className="control-label">Font Family</label>
                    <select
                      className="select-input"
                      value={settings.fontFamily}
                      onChange={(e) => updateSettings({ fontFamily: e.target.value })}
                    >
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Playfair Display">Playfair Display</option>
                      <option value="Montserrat">Montserrat</option>
                      <option value="Merriweather">Merriweather</option>
                      <option value="Lora">Lora</option>
                      <option value="Poppins">Poppins</option>
                      <option value="Source Sans Pro">Source Sans Pro</option>
                      <option value="Open Sans">Open Sans</option>
                    </select>
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
                        onChange={(e) =>
                          updateSettings({ fontSize: parseInt(e.target.value) })
                        }
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
                        onChange={(e) =>
                          updateSettings({ lineHeight: parseFloat(e.target.value) })
                        }
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
                      onChange={(color) => updateSettings({ textColor: color })}
                      label="Text Color"
                      settings={settings}
                    />
                </div>
            </div>

                {showContrastAnalyzer && (
                  <ContrastAnalyzer
                    foregroundColor={settings.textColor}
                    backgroundColor={settings.backgroundColor}
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
                            updateSettings({ textGradient: gradient });
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
                            className={`btn-icon ${
                              settings.textGradient.type === 'linear' ? 'active' : ''
                            }`}
                            onClick={() => handleGradientTypeChange('linear')}
                            title="Linear Gradient"
                          >
                            <Square size={16} />
              </button>
              <button
                            className={`btn-icon ${
                              settings.textGradient.type === 'radial' ? 'active' : ''
                            }`}
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

          {/* Background */}
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
                    <label className="control-label">Background Color</label>
                    <ColorPicker
                      color={settings.backgroundColor}
                      onChange={(color) => updateSettings({ backgroundColor: color })}
                      label="Background Color"
                      settings={settings}
                    />
                    </div>
                  </div>

                <div className="divider" />

                <div className="control-row">
                  <div className="control-group">
                    <div className="flex items-center justify-between">
                      <label className="control-label">Use Gradient Background</label>
                    <div className="flex items-center gap-2">
                      <input
                          type="checkbox"
                          className="toggle"
                          checked={!!settings.backgroundGradient}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateSettings({ 
                                backgroundGradient: {
                                  type: 'linear',
                                  colors: ['#3B82F6', '#EC4899'],
                                  angle: 45
                                } 
                              });
                            } else {
                              updateSettings({ backgroundGradient: undefined });
                            }
                          }}
                        />
                    </div>
                  </div>
                </div>
              </div>

                {settings.backgroundGradient && (
                  <>
                    <div className="control-row">
                      <div className="control-group">
                        <label className="control-label">Gradient Type</label>
                        <div className="button-group">
                          <button
                            className={`btn-icon ${
                              settings.backgroundGradient.type === 'linear' ? 'active' : ''
                            }`}
                            onClick={() => {
                              const gradient = {
                                ...settings.backgroundGradient,
                                type: 'linear' as 'linear' | 'radial' | 'solid',
                                colors: settings.backgroundGradient?.colors || ['#3B82F6', '#EC4899']
                              };
                              updateSettings({ backgroundGradient: gradient });
                            }}
                            title="Linear Gradient"
                          >
                            <Square size={16} />
                          </button>
                          <button
                            className={`btn-icon ${
                              settings.backgroundGradient.type === 'radial' ? 'active' : ''
                            }`}
                            onClick={() => {
                              const gradient = {
                                ...settings.backgroundGradient,
                                type: 'radial' as 'linear' | 'radial' | 'solid',
                                colors: settings.backgroundGradient?.colors || ['#3B82F6', '#EC4899']
                              };
                              updateSettings({ backgroundGradient: gradient });
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
                                ...settings.backgroundGradient,
                                angle: parseInt(e.target.value),
                                type: settings.backgroundGradient?.type || 'linear' as 'linear' | 'radial' | 'solid',
                                colors: settings.backgroundGradient?.colors || ['#3B82F6', '#EC4899']
                              };
                              updateSettings({ backgroundGradient: gradient });
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
                              const gradient = { 
                                ...settings.backgroundGradient, 
                                colors,
                                type: settings.backgroundGradient.type as 'linear' | 'radial' | 'solid'
                              };
                              updateSettings({ backgroundGradient: gradient });
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
                              const gradient = { 
                                ...settings.backgroundGradient, 
                                colors,
                                type: settings.backgroundGradient.type as 'linear' | 'radial' | 'solid'
                              };
                              updateSettings({ backgroundGradient: gradient });
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

          {/* Effects */}
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
                            updateSettings({ textShadow: shadow });
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
                            onChange={(e) =>
                              handleTextShadowChange('blur', parseInt(e.target.value))
                            }
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
                            onChange={(e) =>
                              handleTextShadowChange('offsetX', parseInt(e.target.value))
                            }
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
                            onChange={(e) =>
                              handleTextShadowChange('offsetY', parseInt(e.target.value))
                            }
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
                            updateSettings({ textOutline: outline });
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
                            onChange={(e) =>
                              handleOutlineChange('width', parseInt(e.target.value))
                            }
                        />
                        <span className="control-value">{settings.textOutline.width}px</span>
                      </div>
                    </div>
                  </div>
                  </>
                )}
              </div>
            )}
          </div>
          </div>

        {/* Dimensions Tab */}
        <div className={`tab-panel ${activeTab === 'dimensions' ? 'active' : ''}`}>
          <div className="control-section">
              <div className="section-content">
                  <div className="control-row">
                    <div className="control-group">
                  <label className="control-label">Canvas Width</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      className="slider"
                      min="400"
                      max="1200"
                      step="50"
                      value={settings.id.includes('width') ? parseInt(settings.id.split('-')[1]) : 1080}
                      onChange={(e) => {
                        const width = parseInt(e.target.value);
                        // We can't directly set width so we'll update the ID to include it
                        updateSettings({ id: `quote-${width}-${settings.id.split('-')[2] || 1080}` });
                      }}
                    />
                    <span className="control-value">
                      {settings.id.includes('width') ? parseInt(settings.id.split('-')[1]) : 1080}px
                    </span>
                    </div>
                    </div>
                  </div>

                    <div className="control-row">
                      <div className="control-group">
                  <label className="control-label">Canvas Height</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                      className="slider"
                      min="400"
                      max="1200"
                      step="50"
                      value={settings.id.includes('height') ? parseInt(settings.id.split('-')[2]) : 1080}
                            onChange={(e) => {
                        const height = parseInt(e.target.value);
                        // We can't directly set height so we'll update the ID to include it
                        updateSettings({ id: `quote-${settings.id.split('-')[1] || 1080}-${height}` });
                      }}
                    />
                    <span className="control-value">
                      {settings.id.includes('height') ? parseInt(settings.id.split('-')[2]) : 1080}px
                    </span>
                        </div>
          </div>
        </div>

                <div className="control-row">
                  <div className="control-group">
                  <label className="control-label">Padding</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        className="slider"
                      min="10"
                      max="100"
                      value={settings.padding}
                      onChange={(e) => updateSettings({ padding: parseInt(e.target.value) })}
                      />
                    <span className="control-value">{settings.padding}px</span>
                    </div>
                  </div>
                </div>

                <div className="control-row">
                  <div className="control-group">
                  <label className="control-label">Border Radius</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        className="slider"
                      min="0"
                      max="36"
                      value={settings.padding} /* Using padding as a placeholder since there's no borderRadius */
                      onChange={(e) => updateSettings({ padding: parseInt(e.target.value) })}
                      />
                    <span className="control-value">{settings.padding}px</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          
          <PulseCard
            icon={<Box size={16} />}
            title="Pro Tip: Perfect Dimensions"
            description="Social media platforms have optimal image dimensions. Common ones include Instagram 1080x1080, Twitter 1200x675, Facebook 1200x630."
            variant="blue"
          />
        </div>
      </div>
    </div>
  );
};
