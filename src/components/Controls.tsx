import React, { useState, useRef, useEffect } from 'react';
import { ColorPicker } from './ColorPicker';
import { QuoteSettings, TextShadowEffect, TextOutlineEffect, GradientEffect } from '../types';
import { 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, 
  Bold, Italic, Underline, ChevronDown, ChevronUp,
  Type, Palette, Box, Circle, Droplet, Layers
} from 'lucide-react';
import './Controls.css';

interface ControlsProps {
  settings: QuoteSettings;
  onSettingsChange: (settings: QuoteSettings) => void;
}

export const Controls: React.FC<ControlsProps> = ({ settings, onSettingsChange }) => {
  const [isTextOpen, setIsTextOpen] = useState(true);
  const [isSignatureOpen, setIsSignatureOpen] = useState(false);
  const [isEffectsOpen, setIsEffectsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'style' | 'effects' | 'signature'>('text');
  const [fontSize, setFontSize] = useState(settings.fontSize);
  
  const fonts = [
    { name: 'Arial', value: 'Arial' },
    { name: 'Helvetica', value: 'Helvetica' },
    { name: 'Times New Roman', value: 'Times New Roman' },
    { name: 'Courier New', value: 'Courier New' },
    { name: 'Georgia', value: 'Georgia' },
    { name: 'Verdana', value: 'Verdana' },
    { name: 'Roboto', value: 'Roboto' },
    { name: 'Open Sans', value: 'Open Sans' },
    { name: 'Lato', value: 'Lato' },
    { name: 'Montserrat', value: 'Montserrat' },
    { name: 'Noto Serif', value: 'Noto Serif' },
    { name: 'Playfair Display', value: 'Playfair Display' },
    { name: 'Merriweather', value: 'Merriweather' },
    { name: 'PT Serif', value: 'PT Serif' },
    { name: 'Libre Baskerville', value: 'Libre Baskerville' },
    { name: 'Crimson Text', value: 'Crimson Text' },
    { name: 'Source Sans Pro', value: 'Source Sans Pro' },
    { name: 'Nunito', value: 'Nunito' },
    { name: 'Inter', value: 'Inter' },
    { name: 'Poppins', value: 'Poppins' },
    { name: 'Noto Sans Devanagari', value: 'Noto Sans Devanagari' },
    { name: 'Hind', value: 'Hind' },
    { name: 'Mukta', value: 'Mukta' },
    { name: 'Noto Sans Gujarati', value: 'Noto Sans Gujarati' },
    { name: 'Rasa', value: 'Rasa' },
    { name: 'Baloo 2', value: 'Baloo 2' },
    { name: 'Tiro Devanagari Hindi', value: 'Tiro Devanagari Hindi' },
    { name: 'Tiro Gujarati', value: 'Tiro Gujarati' },
  ];

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState<{ start: number; end: number }>({
    start: 0,
    end: 0
  });

  const defaultTextShadow: TextShadowEffect = {
    enabled: true,
    color: '#000000',
    blur: 4,
    offsetX: 2,
    offsetY: 2
  };

  const defaultTextOutline: TextOutlineEffect = {
    enabled: true,
    color: '#000000',
    width: 2
  };

  const defaultTextGradient: GradientEffect = {
    enabled: true,
    type: 'linear',
    colors: ['#ff0000', '#0000ff'],
    angle: 0
  };

  const defaultTextPath = {
    enabled: false,
    radius: 200,
    angle: 0,
    direction: 'clockwise' as const
  };

  const updateSettings = (updates: Partial<QuoteSettings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  const textAlignmentButtons = (
    current: 'left' | 'center' | 'right' | 'justify',
    onChange: (alignment: 'left' | 'center' | 'right' | 'justify') => void
  ) => (
    <div className="flex space-x-2 mt-1">
      <button
        onClick={() => onChange('left')}
        className={`p-2 rounded ${
          current === 'left'
            ? 'bg-purple-600 text-white'
            : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
        }`}
      >
        <AlignLeft size={20} />
      </button>
      <button
        onClick={() => onChange('center')}
        className={`p-2 rounded ${
          current === 'center'
            ? 'bg-purple-600 text-white'
            : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
        }`}
      >
        <AlignCenter size={20} />
      </button>
      <button
        onClick={() => onChange('right')}
        className={`p-2 rounded ${
          current === 'right'
            ? 'bg-purple-600 text-white'
            : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
        }`}
      >
        <AlignRight size={20} />
      </button>
      <button
        onClick={() => onChange('justify')}
        className={`p-2 rounded ${
          current === 'justify'
            ? 'bg-purple-600 text-white'
            : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
        }`}
      >
        <AlignJustify size={20} />
      </button>
    </div>
  );

  const signatureAlignmentButtons = (
    current: 'left' | 'center' | 'right',
    onChange: (alignment: 'left' | 'center' | 'right') => void
  ) => (
    <div className="flex space-x-2 mt-1">
      <button
        onClick={() => onChange('left')}
        className={`p-2 rounded ${
          current === 'left'
            ? 'bg-purple-600 text-white'
            : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
        }`}
      >
        <AlignLeft size={20} />
      </button>
      <button
        onClick={() => onChange('center')}
        className={`p-2 rounded ${
          current === 'center'
            ? 'bg-purple-600 text-white'
            : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
        }`}
      >
        <AlignCenter size={20} />
      </button>
      <button
        onClick={() => onChange('right')}
        className={`p-2 rounded ${
          current === 'right'
            ? 'bg-purple-600 text-white'
            : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
        }`}
      >
        <AlignRight size={20} />
      </button>
    </div>
  );

  const textStyleButtons = () => (
    <div className="flex gap-2 p-2 bg-dark-800 rounded-lg mb-2">
      <button
        onClick={() => updateSettings({
          textStyle: { ...settings.textStyle, bold: !settings.textStyle.bold }
        })}
        className={`p-2 rounded-md ${
          settings.textStyle.bold
            ? 'bg-purple-600 text-white shadow-inner'
            : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
        }`}
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => updateSettings({
          textStyle: { ...settings.textStyle, italic: !settings.textStyle.italic }
        })}
        className={`p-2 rounded-md ${
          settings.textStyle.italic
            ? 'bg-purple-600 text-white shadow-inner'
            : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
        }`}
      >
        <Italic size={18} />
      </button>
    </div>
  );

  // Add line height and letter spacing controls
  const renderTypographyControls = () => (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-200">
          Line Height: {settings.lineHeight || 1.2}
        </label>
        <input
          type="range"
          min="1"
          max="3"
          step="0.1"
          value={settings.lineHeight || 1.2}
          onChange={(e) => updateSettings({ lineHeight: parseFloat(e.target.value) })}
          className="w-full accent-purple-600 transition-all hover:accent-purple-500"
          title={`Adjust line height (${settings.lineHeight || 1.2})`}
        />
      </div>
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-200">
          Letter Spacing: {settings.letterSpacing || 0}px
        </label>
        <input
          type="range"
          min="-2"
          max="10"
          value={settings.letterSpacing || 0}
          onChange={(e) => updateSettings({ letterSpacing: parseInt(e.target.value) })}
          className="w-full accent-purple-600 transition-all hover:accent-purple-500"
          title={`Adjust letter spacing (${settings.letterSpacing || 0}px)`}
        />
      </div>
    </div>
  );

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const newPosition = {
      start: e.target.selectionStart || 0,
      end: e.target.selectionEnd || 0
    };
    setCursorPosition(newPosition);
    updateSettings({ quoteText: newValue });
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart || 0;
      const end = textarea.selectionEnd || 0;
      const currentText = settings.quoteText;
      
      const newText = currentText.substring(0, start) + 
                     text + 
                     currentText.substring(end);
      
      const newPosition = {
        start: start + text.length,
        end: start + text.length
      };

      updateSettings({ quoteText: newText });
      
      // Restore cursor position after state update
      requestAnimationFrame(() => {
        if (textarea) {
          textarea.selectionStart = newPosition.start;
          textarea.selectionEnd = newPosition.end;
          textarea.focus();
        }
      });
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  // Add text effects controls
  const renderTextEffectsControls = () => (
    <div className="space-y-4">
      {/* Text Shadow */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-200">Text Shadow</label>
          <input
            type="checkbox"
            checked={settings.textShadow?.enabled || false}
            onChange={(e) => updateSettings({
              textShadow: {
                ...defaultTextShadow,
                ...(settings.textShadow || {}),
                enabled: e.target.checked
              }
            })}
            className="toggle"
          />
        </div>
        {settings.textShadow?.enabled && (
          <div className="grid grid-cols-2 gap-2">
            <ColorPicker
              label="Shadow Color"
              color={settings.textShadow.color}
              onChange={(color) => updateSettings({
                textShadow: {
                  ...defaultTextShadow,
                  ...(settings.textShadow || {}),
                  color
                }
              })}
              settings={settings}
            />
            <div>
              <label className="block text-sm text-gray-300">Blur: {settings.textShadow.blur}px</label>
              <input
                type="range"
                min="0"
                max="20"
                value={settings.textShadow.blur}
                onChange={(e) => updateSettings({
                  textShadow: {
                    ...defaultTextShadow,
                    ...(settings.textShadow || {}),
                    blur: parseInt(e.target.value)
                  }
                })}
                className="w-full accent-purple-600"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300">Offset X: {settings.textShadow.offsetX}px</label>
              <input
                type="range"
                min="-20"
                max="20"
                value={settings.textShadow.offsetX}
                onChange={(e) => updateSettings({
                  textShadow: {
                    ...defaultTextShadow,
                    ...(settings.textShadow || {}),
                    offsetX: parseInt(e.target.value)
                  }
                })}
                className="w-full accent-purple-600"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300">Offset Y: {settings.textShadow.offsetY}px</label>
              <input
                type="range"
                min="-20"
                max="20"
                value={settings.textShadow.offsetY}
                onChange={(e) => updateSettings({
                  textShadow: {
                    ...defaultTextShadow,
                    ...(settings.textShadow || {}),
                    offsetY: parseInt(e.target.value)
                  }
                })}
                className="w-full accent-purple-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* Text Outline */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-200">Text Outline</label>
          <input
            type="checkbox"
            checked={settings.textOutline?.enabled || false}
            onChange={(e) => updateSettings({
              textOutline: {
                ...defaultTextOutline,
                ...(settings.textOutline || {}),
                enabled: e.target.checked
              }
            })}
            className="toggle"
          />
        </div>
        {settings.textOutline?.enabled && (
          <div className="grid grid-cols-2 gap-2">
            <ColorPicker
              label="Outline Color"
              color={settings.textOutline.color}
              onChange={(color) => updateSettings({
                textOutline: {
                  ...defaultTextOutline,
                  ...(settings.textOutline || {}),
                  color
                }
              })}
              settings={settings}
            />
            <div>
              <label className="block text-sm text-gray-300">Width: {settings.textOutline.width}px</label>
              <input
                type="range"
                min="1"
                max="10"
                value={settings.textOutline.width}
                onChange={(e) => updateSettings({
                  textOutline: {
                    ...defaultTextOutline,
                    ...(settings.textOutline || {}),
                    width: parseInt(e.target.value)
                  }
                })}
                className="w-full accent-purple-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* Text Gradient */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-200">Text Gradient</label>
          <input
            type="checkbox"
            checked={settings.textGradient?.enabled || false}
            onChange={(e) => {
              const updatedGradient = {
                ...defaultTextGradient,
                ...(settings.textGradient || {}),
                enabled: e.target.checked
              };
              updateSettings({ textGradient: updatedGradient });
            }}
            className="toggle"
          />
        </div>
        {settings.textGradient?.enabled && (
          <div className="section-content">
            <div className="control-grid">
              <div className="control-row">
                <div className="control-group">
                  <label className="control-label">Gradient Type</label>
                  <div className="gradient-type-buttons">
                    <button
                      onClick={() => {
                        const gradientSettings = settings.textGradient || defaultTextGradient;
                        updateSettings({
                          textGradient: {
                            ...gradientSettings,
                            type: 'linear'
                          }
                        });
                      }}
                      className={`gradient-type-button ${(settings.textGradient?.type || 'linear') === 'linear' ? 'active' : ''}`}
                    >
                      Linear
                    </button>
                    <button
                      onClick={() => {
                        const gradientSettings = settings.textGradient || defaultTextGradient;
                        updateSettings({
                          textGradient: {
                            ...gradientSettings,
                            type: 'radial'
                          }
                        });
                      }}
                      className={`gradient-type-button ${(settings.textGradient?.type || 'linear') === 'radial' ? 'active' : ''}`}
                    >
                      Radial
                    </button>
                  </div>
                </div>
              </div>
              <div className="control-row">
                <div className="control-group">
                  <label className="control-label">Color 1</label>
                  <ColorPicker
                    label="Color 1"
                    color={settings.textGradient?.colors?.[0] || '#ff0000'}
                    onChange={(color) => {
                      const gradientSettings = settings.textGradient || defaultTextGradient;
                      const colors = gradientSettings.colors || ['#ff0000', '#0000ff'];
                      updateSettings({
                        textGradient: {
                          ...gradientSettings,
                          colors: [color, colors[1]]
                        }
                      });
                    }}
                    settings={settings}
                  />
                </div>
                <div className="control-group">
                  <label className="control-label">Color 2</label>
                  <ColorPicker
                    label="Color 2"
                    color={settings.textGradient?.colors?.[1] || '#0000ff'}
                    onChange={(color) => {
                      const gradientSettings = settings.textGradient || defaultTextGradient;
                      const colors = gradientSettings.colors || ['#ff0000', '#0000ff'];
                      updateSettings({
                        textGradient: {
                          ...gradientSettings,
                          colors: [colors[0], color]
                        }
                      });
                    }}
                    settings={settings}
                  />
                </div>
              </div>
              {(settings.textGradient?.type || 'linear') === 'linear' && (
                <div className="control-row">
                  <div className="control-group">
                    <label className="control-label">Angle</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={settings.textGradient?.angle || 0}
                        onChange={(e) => {
                          const gradientSettings = settings.textGradient || defaultTextGradient;
                          updateSettings({
                            textGradient: {
                              ...gradientSettings,
                              angle: parseInt(e.target.value)
                            }
                          });
                        }}
                        className="slider"
                      />
                      <span className="control-value">{settings.textGradient?.angle || 0}°</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Text Path */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-200">Curved Text</label>
          <input
            type="checkbox"
            checked={settings.textPath?.enabled || false}
            onChange={(e) => updateSettings({
              textPath: {
                ...defaultTextPath,
                ...(settings.textPath || {}),
                enabled: e.target.checked
              }
            })}
            className="toggle"
          />
        </div>
        {settings.textPath?.enabled && (
          <div className="space-y-2">
            <div>
              <label className="block text-sm text-gray-300">Radius: {settings.textPath.radius}px</label>
              <input
                type="range"
                min="100"
                max="500"
                value={settings.textPath.radius}
                onChange={(e) => {
                  if (!settings.textPath) return;
                  updateSettings({
                    textPath: {
                      ...defaultTextPath,
                      ...settings.textPath,
                      radius: parseInt(e.target.value)
                    }
                  });
                }}
                className="w-full accent-purple-600"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300">Angle: {settings.textPath.angle}°</label>
              <input
                type="range"
                min="0"
                max="360"
                value={settings.textPath.angle}
                onChange={(e) => {
                  if (!settings.textPath) return;
                  updateSettings({
                    textPath: {
                      ...defaultTextPath,
                      ...settings.textPath,
                      angle: parseInt(e.target.value)
                    }
                  });
                }}
                className="w-full accent-purple-600"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (!settings.textPath) return;
                  updateSettings({
                    textPath: {
                      ...defaultTextPath,
                      ...settings.textPath,
                      direction: 'clockwise'
                    }
                  });
                }}
                className={`p-2 rounded ${
                  settings.textPath.direction === 'clockwise'
                    ? 'bg-purple-600 text-white'
                    : 'bg-dark-800 text-gray-300'
                }`}
              >
                Clockwise
              </button>
              <button
                onClick={() => {
                  if (!settings.textPath) return;
                  updateSettings({
                    textPath: {
                      ...defaultTextPath,
                      ...settings.textPath,
                      direction: 'counterclockwise'
                    }
                  });
                }}
                className={`p-2 rounded ${
                  settings.textPath.direction === 'counterclockwise'
                    ? 'bg-purple-600 text-white'
                    : 'bg-dark-800 text-gray-300'
                }`}
              >
                Counter-clockwise
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="controls-container">
      <div className="tabs-container">
        <div className="tabs">
          <button
            onClick={() => setActiveTab('text')}
            className={`tab ${activeTab === 'text' ? 'active' : ''}`}
          >
            <Type size={18} />
            <span>Text</span>
          </button>
          <button
            onClick={() => setActiveTab('style')}
            className={`tab ${activeTab === 'style' ? 'active' : ''}`}
          >
            <Palette size={18} />
            <span>Style</span>
          </button>
          <button
            onClick={() => setActiveTab('effects')}
            className={`tab ${activeTab === 'effects' ? 'active' : ''}`}
          >
            <Layers size={18} />
            <span>Effects</span>
          </button>
          <button
            onClick={() => setActiveTab('signature')}
            className={`tab ${activeTab === 'signature' ? 'active' : ''}`}
          >
            <Box size={18} />
            <span>Signature</span>
          </button>
        </div>
      </div>

      <div className="panels-container">
        {/* Text Panel */}
        <div className={`tab-panel ${activeTab === 'text' ? 'active' : ''}`}>
          <div className="control-section">
            <div className="section-content">
              <div className="control-grid">
                <div className="control-group">
                  <textarea
                    ref={textareaRef}
                    className="textarea"
                    value={settings.quoteText}
                    onChange={handleTextChange}
                    onKeyDown={(e) => e.ctrlKey && e.key === 'v' && (e.preventDefault(), handlePaste())}
                    placeholder="Enter your quote here..."
                  />
                </div>
                <div className="control-row">
                  <div className="control-group">
                    <label className="control-label">Text Style</label>
                    <div className="button-group">
                      <button
                        onClick={() => updateSettings({
                          textStyle: { ...settings.textStyle, bold: !settings.textStyle.bold }
                        })}
                        className={`icon-button ${settings.textStyle.bold ? 'active' : ''}`}
                      >
                        <Bold size={18} />
                      </button>
                      <button
                        onClick={() => updateSettings({
                          textStyle: { ...settings.textStyle, italic: !settings.textStyle.italic }
                        })}
                        className={`icon-button ${settings.textStyle.italic ? 'active' : ''}`}
                      >
                        <Italic size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="control-group">
                    <label className="control-label">Text Alignment</label>
                    <div className="button-group">
                      <button
                        onClick={() => updateSettings({ textAlignment: 'left' })}
                        className={`icon-button ${settings.textAlignment === 'left' ? 'active' : ''}`}
                      >
                        <AlignLeft size={18} />
                      </button>
                      <button
                        onClick={() => updateSettings({ textAlignment: 'center' })}
                        className={`icon-button ${settings.textAlignment === 'center' ? 'active' : ''}`}
                      >
                        <AlignCenter size={18} />
                      </button>
                      <button
                        onClick={() => updateSettings({ textAlignment: 'right' })}
                        className={`icon-button ${settings.textAlignment === 'right' ? 'active' : ''}`}
                      >
                        <AlignRight size={18} />
                      </button>
                      <button
                        onClick={() => updateSettings({ textAlignment: 'justify' })}
                        className={`icon-button ${settings.textAlignment === 'justify' ? 'active' : ''}`}
                      >
                        <AlignJustify size={18} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="control-row">
                  <div className="control-group">
                    <label className="control-label">Line Height</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={settings.lineHeight || 1.2}
                        onChange={(e) => updateSettings({ lineHeight: parseFloat(e.target.value) })}
                        className="slider"
                      />
                      <span className="control-value">{settings.lineHeight || 1.2}</span>
                    </div>
                  </div>
                  <div className="control-group">
                    <label className="control-label">Letter Spacing</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="-2"
                        max="10"
                        value={settings.letterSpacing || 0}
                        onChange={(e) => updateSettings({ letterSpacing: parseInt(e.target.value) })}
                        className="slider"
                      />
                      <span className="control-value">{settings.letterSpacing || 0}px</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Style Panel */}
        <div className={`tab-panel ${activeTab === 'style' ? 'active' : ''}`}>
          <div className="control-section">
            <div className="section-content">
              <div className="control-grid">
                <div className="control-row">
                  <div className="control-group">
                    <label className="control-label">Font Family</label>
                    <select
                      className="select-input"
                      value={settings.fontFamily}
                      onChange={(e) => updateSettings({ fontFamily: e.target.value })}
                    >
                      {fonts.map((font) => (
                        <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                          {font.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="control-group">
                    <label className="control-label">Font Size</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={settings.fontSize}
                        onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
                        className="slider"
                      />
                      <span className="control-value">{settings.fontSize}px</span>
                    </div>
                  </div>
                </div>
                <div className="control-row">
                  <div className="control-group">
                    <label className="control-label">Text Color</label>
                    <ColorPicker
                      label="Text Color"
                      color={settings.textColor}
                      onChange={(color) => updateSettings({ textColor: color })}
                      settings={settings}
                    />
                  </div>
                  <div className="control-group">
                    <label className="control-label">Background</label>
                    <ColorPicker
                      label="Background"
                      color={settings.backgroundColor}
                      onChange={(color) => updateSettings({ backgroundColor: color })}
                      settings={settings}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Effects Panel */}
        <div className={`tab-panel ${activeTab === 'effects' ? 'active' : ''}`}>
          {/* Text Shadow Section */}
          <div className="control-section">
            <div className="section-header">
              <span className="section-title">Text Shadow</span>
              <input
                type="checkbox"
                checked={settings.textShadow?.enabled || false}
                onChange={(e) => updateSettings({
                  textShadow: {
                    ...defaultTextShadow,
                    ...(settings.textShadow || {}),
                    enabled: e.target.checked
                  }
                })}
                className="toggle"
              />
            </div>
            {settings.textShadow?.enabled && (
              <div className="section-content">
                <div className="control-grid">
                  <div className="control-row">
                    <div className="control-group">
                      <label className="control-label">Shadow Color</label>
                      <ColorPicker
                        label="Shadow Color"
                        color={settings.textShadow.color}
                        onChange={(color) => updateSettings({
                          textShadow: {
                            ...defaultTextShadow,
                            ...(settings.textShadow || {}),
                            color
                          }
                        })}
                        settings={settings}
                      />
                    </div>
                    <div className="control-group">
                      <label className="control-label">Blur</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="20"
                          value={settings.textShadow.blur}
                          onChange={(e) => updateSettings({
                            textShadow: {
                              ...defaultTextShadow,
                              ...(settings.textShadow || {}),
                              blur: parseInt(e.target.value)
                            }
                          })}
                          className="slider"
                        />
                        <span className="control-value">{settings.textShadow.blur}px</span>
                      </div>
                    </div>
                  </div>
                  <div className="control-row">
                    <div className="control-group">
                      <label className="control-label">Offset X</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="-20"
                          max="20"
                          value={settings.textShadow.offsetX}
                          onChange={(e) => updateSettings({
                            textShadow: {
                              ...defaultTextShadow,
                              ...(settings.textShadow || {}),
                              offsetX: parseInt(e.target.value)
                            }
                          })}
                          className="slider"
                        />
                        <span className="control-value">{settings.textShadow.offsetX}px</span>
                      </div>
                    </div>
                    <div className="control-group">
                      <label className="control-label">Offset Y</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="-20"
                          max="20"
                          value={settings.textShadow.offsetY}
                          onChange={(e) => updateSettings({
                            textShadow: {
                              ...defaultTextShadow,
                              ...(settings.textShadow || {}),
                              offsetY: parseInt(e.target.value)
                            }
                          })}
                          className="slider"
                        />
                        <span className="control-value">{settings.textShadow.offsetY}px</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Text Outline Section */}
          <div className="control-section">
            <div className="section-header">
              <span className="section-title">Text Outline</span>
              <input
                type="checkbox"
                checked={settings.textOutline?.enabled || false}
                onChange={(e) => updateSettings({
                  textOutline: {
                    ...defaultTextOutline,
                    ...(settings.textOutline || {}),
                    enabled: e.target.checked
                  }
                })}
                className="toggle"
              />
            </div>
            {settings.textOutline?.enabled && (
              <div className="section-content">
                <div className="control-grid">
                  <div className="control-row">
                    <div className="control-group">
                      <label className="control-label">Outline Color</label>
                      <ColorPicker
                        label="Outline Color"
                        color={settings.textOutline.color}
                        onChange={(color) => updateSettings({
                          textOutline: {
                            ...defaultTextOutline,
                            ...(settings.textOutline || {}),
                            color
                          }
                        })}
                        settings={settings}
                      />
                    </div>
                    <div className="control-group">
                      <label className="control-label">Width</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={settings.textOutline.width}
                          onChange={(e) => updateSettings({
                            textOutline: {
                              ...defaultTextOutline,
                              ...(settings.textOutline || {}),
                              width: parseInt(e.target.value)
                            }
                          })}
                          className="slider"
                        />
                        <span className="control-value">{settings.textOutline.width}px</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Text Gradient Section */}
          <div className="control-section">
            <div className="section-header">
              <span className="section-title">Text Gradient</span>
              <input
                type="checkbox"
                checked={settings.textGradient?.enabled || false}
                onChange={(e) => {
                  const updatedGradient = {
                    ...defaultTextGradient,
                    ...(settings.textGradient || {}),
                    enabled: e.target.checked
                  };
                  updateSettings({ textGradient: updatedGradient });
                }}
                className="toggle"
              />
            </div>
            {settings.textGradient?.enabled && (
              <div className="section-content">
                <div className="control-grid">
                  <div className="control-row">
                    <div className="control-group">
                      <label className="control-label">Gradient Type</label>
                      <div className="gradient-type-buttons">
                        <button
                          onClick={() => {
                            const gradientSettings = settings.textGradient || defaultTextGradient;
                            updateSettings({
                              textGradient: {
                                ...gradientSettings,
                                type: 'linear'
                              }
                            });
                          }}
                          className={`gradient-type-button ${(settings.textGradient?.type || 'linear') === 'linear' ? 'active' : ''}`}
                        >
                          Linear
                        </button>
                        <button
                          onClick={() => {
                            const gradientSettings = settings.textGradient || defaultTextGradient;
                            updateSettings({
                              textGradient: {
                                ...gradientSettings,
                                type: 'radial'
                              }
                            });
                          }}
                          className={`gradient-type-button ${(settings.textGradient?.type || 'linear') === 'radial' ? 'active' : ''}`}
                        >
                          Radial
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="control-row">
                    <div className="control-group">
                      <label className="control-label">Color 1</label>
                      <ColorPicker
                        label="Color 1"
                        color={settings.textGradient?.colors?.[0] || '#ff0000'}
                        onChange={(color) => {
                          const gradientSettings = settings.textGradient || defaultTextGradient;
                          const colors = gradientSettings.colors || ['#ff0000', '#0000ff'];
                          updateSettings({
                            textGradient: {
                              ...gradientSettings,
                              colors: [color, colors[1]]
                            }
                          });
                        }}
                        settings={settings}
                      />
                    </div>
                    <div className="control-group">
                      <label className="control-label">Color 2</label>
                      <ColorPicker
                        label="Color 2"
                        color={settings.textGradient?.colors?.[1] || '#0000ff'}
                        onChange={(color) => {
                          const gradientSettings = settings.textGradient || defaultTextGradient;
                          const colors = gradientSettings.colors || ['#ff0000', '#0000ff'];
                          updateSettings({
                            textGradient: {
                              ...gradientSettings,
                              colors: [colors[0], color]
                            }
                          });
                        }}
                        settings={settings}
                      />
                    </div>
                  </div>
                  {(settings.textGradient?.type || 'linear') === 'linear' && (
                    <div className="control-row">
                      <div className="control-group">
                        <label className="control-label">Angle</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="360"
                            value={settings.textGradient?.angle || 0}
                            onChange={(e) => {
                              const gradientSettings = settings.textGradient || defaultTextGradient;
                              updateSettings({
                                textGradient: {
                                  ...gradientSettings,
                                  angle: parseInt(e.target.value)
                                }
                              });
                            }}
                            className="slider"
                          />
                          <span className="control-value">{settings.textGradient?.angle || 0}°</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Signature Panel */}
        <div className={`tab-panel ${activeTab === 'signature' ? 'active' : ''}`}>
          <div className="control-section">
            <div className="section-content">
              <div className="control-grid">
                <div className="control-row">
                  <div className="control-group">
                    <label className="control-label">Signature Text</label>
                    <input
                      type="text"
                      value={settings.signatureText}
                      onChange={(e) => updateSettings({ signatureText: e.target.value })}
                      className="text-input"
                      placeholder="Enter signature text..."
                    />
                  </div>
                </div>
                <div className="control-row">
                  <div className="control-group">
                    <label className="control-label">Font Family</label>
                    <select
                      className="select-input"
                      value={settings.signatureFontFamily || settings.fontFamily}
                      onChange={(e) => updateSettings({ signatureFontFamily: e.target.value })}
                    >
                      {fonts.map((font) => (
                        <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                          {font.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="control-group">
                    <label className="control-label">Size</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={settings.signatureSize}
                        onChange={(e) => updateSettings({ signatureSize: parseInt(e.target.value) })}
                        className="slider"
                      />
                      <span className="control-value">{settings.signatureSize}px</span>
                    </div>
                  </div>
                </div>
                <div className="control-row">
                  <div className="control-group">
                    <label className="control-label">Color</label>
                    <ColorPicker
                      label="Color"
                      color={settings.signatureColor}
                      onChange={(color) => updateSettings({ signatureColor: color })}
                      settings={settings}
                    />
                  </div>
                  <div className="control-group">
                    <label className="control-label">Alignment</label>
                    <div className="button-group">
                      <button
                        onClick={() => updateSettings({ signatureAlignment: 'left' })}
                        className={`icon-button ${settings.signatureAlignment === 'left' ? 'active' : ''}`}
                      >
                        <AlignLeft size={18} />
                      </button>
                      <button
                        onClick={() => updateSettings({ signatureAlignment: 'center' })}
                        className={`icon-button ${settings.signatureAlignment === 'center' ? 'active' : ''}`}
                      >
                        <AlignCenter size={18} />
                      </button>
                      <button
                        onClick={() => updateSettings({ signatureAlignment: 'right' })}
                        className={`icon-button ${settings.signatureAlignment === 'right' ? 'active' : ''}`}
                      >
                        <AlignRight size={18} />
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
                        min="20"
                        max="200"
                        value={settings.signatureBottomMargin || 100}
                        onChange={(e) => updateSettings({ signatureBottomMargin: parseInt(e.target.value) })}
                        className="slider"
                      />
                      <span className="control-value">{settings.signatureBottomMargin || 100}px</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};