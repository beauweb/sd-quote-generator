import React, { useState, useRef, useEffect } from 'react';
import { ColorPicker } from './ColorPicker';
import { QuoteSettings, TextShadowEffect, TextOutlineEffect, GradientEffect } from '../types';
import { 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, 
  Bold, Italic, Underline, ChevronDown, ChevronUp,
  Type, Palette, Circle, Droplet, Layers,
  Accessibility, Square, Eye
} from 'lucide-react';
import './Controls.css';
import ContrastAnalyzer from './ContrastAnalyzer';
import { PulseCard } from './ui/PulseCard';

interface ControlsProps {
  settings: QuoteSettings;
  onSettingsChange: (settings: QuoteSettings) => void;
}

export const Controls: React.FC<ControlsProps> = ({ settings, onSettingsChange }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'style'>('content');
  const [textPanelOpen, setTextPanelOpen] = useState(true);
  const [backgroundPanelOpen, setBackgroundPanelOpen] = useState(true);
  const [effectsPanelOpen, setEffectsPanelOpen] = useState(true);
  const [showContrastAnalyzer, setShowContrastAnalyzer] = useState(false);
  const [showTextContrast, setShowTextContrast] = useState(false);

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

  // Helper function to get the effective background color for contrast analysis
  const getEffectiveBackgroundColor = () => {
    if (settings.backgroundGradient) {
      // For gradients, use the first color as the primary background for contrast analysis
      return settings.backgroundGradient.colors[0];
    }
    return settings.backgroundColor;
  };

  // Helper function to get the effective signature color
  const getEffectiveSignatureColor = () => {
    // The signature color is auto-adjusted, but we can still analyze it
    // For now, we'll use the text color as a reference
    return settings.textColor;
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
    </div>
    </div>

      <div className="panels-container">
        {/* Content Tab */}
        <div className={`tab-panel ${activeTab === 'content' ? 'active' : ''}`}>
          <div className="control-section">
            <div className="section-content">
              <div className="control-group">
                <label className="control-label">Title</label>
                <input
                  type="text"
                  className="text-input"
                  value={settings.title}
                  onChange={(e) => updateSettings({ title: e.target.value })}
                  placeholder="Enter quote title..."
                />
              </div>

              <div className="divider" />

              <div className="control-group">
                <label className="control-label">Quote Text</label>
                <textarea
                  className="textarea"
                  value={settings.quoteText}
                  onChange={(e) => updateSettings({ quoteText: e.target.value })}
                  placeholder="Enter your quote text here...&#10;Use Enter key for line breaks"
        />
      </div>

              <div className="divider" />

              <div className="control-group">
                <div className="control-header">
                  <label className="control-label">Author</label>
                  <div className="toggle-container">
                    <input
                      type="checkbox"
                      id="signature-visible"
                      className="toggle-checkbox"
                      checked={settings.signatureVisible}
                      onChange={(e) => updateSettings({ signatureVisible: e.target.checked })}
                    />
                    <label htmlFor="signature-visible" className="toggle-label">
                      <span className="toggle-text">Show</span>
                    </label>
                  </div>
                </div>
                <input
                  type="text"
                  className="text-input"
                  value={settings.signatureText}
                  onChange={(e) => updateSettings({ signatureText: e.target.value })}
                  placeholder="Ankahi Baat"
                  disabled={!settings.signatureVisible}
                />
                <div className="control-note">
                  <small style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>
                    💡 Author color automatically adjusts for optimal visibility
                  </small>
                </div>
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

          {/* Signature Styling */}
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
                      onChange={(e) =>
                        updateSettings({ signatureSize: parseInt(e.target.value) })
                      }
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
                    onChange={(e) => updateSettings({ signatureFontFamily: e.target.value })}
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
                  <label className="control-label">Signature Alignment</label>
                  <div className="button-group">
                    <button
                      className={`btn-icon ${settings.signatureAlignment === 'left' ? 'active' : ''}`}
                      onClick={() => updateSettings({ signatureAlignment: 'left' })}
                      title="Align Left"
                    >
                      <AlignLeft size={16} />
                    </button>
                    <button
                      className={`btn-icon ${settings.signatureAlignment === 'center' ? 'active' : ''}`}
                      onClick={() => updateSettings({ signatureAlignment: 'center' })}
                      title="Align Center"
                    >
                      <AlignCenter size={16} />
                    </button>
                    <button
                      className={`btn-icon ${settings.signatureAlignment === 'right' ? 'active' : ''}`}
                      onClick={() => updateSettings({ signatureAlignment: 'right' })}
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
                      onChange={(e) =>
                        updateSettings({ signatureBottomMargin: parseInt(e.target.value) })
                      }
                    />
                    <span className="control-value">{settings.signatureBottomMargin || 100}px</span>
                  </div>
                </div>
              </div>
            </div>
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
                {/* Background Type Selection */}
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
                        <span className="text-sm text-gray-400">
                          {settings.backgroundGradient ? 'Gradient' : 'Solid Color'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Solid Color Background - Only show when gradient is disabled */}
                {!settings.backgroundGradient && (
                  <div className="control-row">
                    <div className="control-group">
                      <label className="control-label">Background Color</label>
                      <ColorPicker
                        color={settings.backgroundColor}
                        onChange={(color) => updateSettings({ backgroundColor: color })}
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

                {/* Background Contrast Analysis */}
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

                {/* Gradient Background Controls - Only show when gradient is enabled */}
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

                    {settings.backgroundGradient && settings.backgroundGradient.type === 'linear' && (
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

                {/* General Contrast Analysis */}
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
          </div>


      </div>
    </div>
  );
};
