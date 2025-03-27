import React, { useState } from 'react';
import { QuoteSettings } from '../types';
import { ColorPicker } from './ColorPicker';
import { Layers, PlusCircle, X, Move, RotateCcw } from 'lucide-react';

interface GradientBackgroundControlsProps {
  settings: QuoteSettings;
  onSettingsChange: (settings: Partial<QuoteSettings>) => void;
}

export const GradientBackgroundControls: React.FC<GradientBackgroundControlsProps> = ({ 
  settings, 
  onSettingsChange 
}) => {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const handleGradientTypeChange = (type: 'solid' | 'linear' | 'radial') => {
    if (type === 'solid') {
      onSettingsChange({ backgroundGradient: undefined });
    } else {
      const colors = settings.backgroundGradient?.colors || ['#4158D0', '#C850C0'];
      onSettingsChange({
        backgroundGradient: {
          type,
          colors,
          angle: type === 'linear' ? 45 : undefined,
          position: type === 'radial' ? 'center' : undefined
        }
      });
    }
  };

  const handleGradientColorChange = (index: number, color: string) => {
    if (!settings.backgroundGradient) return;
    
    const colors = [...(settings.backgroundGradient.colors || ['#4158D0', '#C850C0'])];
    colors[index] = color;
    
    onSettingsChange({
      backgroundGradient: {
        ...settings.backgroundGradient,
        colors
      }
    });
  };

  const handleGradientAngleChange = (angle: number) => {
    if (!settings.backgroundGradient) return;
    
    onSettingsChange({
      backgroundGradient: {
        ...settings.backgroundGradient,
        angle
      }
    });
  };

  const handleGradientPositionChange = (position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => {
    if (!settings.backgroundGradient) return;
    
    onSettingsChange({
      backgroundGradient: {
        ...settings.backgroundGradient,
        position
      }
    });
  };

  const addGradientStop = () => {
    if (!settings.backgroundGradient) return;
    
    const colors = settings.backgroundGradient.colors || [];
    if (colors.length >= 5) return; // Limit to 5 color stops
    
    // Generate a new color based on blending existing colors
    const newColor = colors.length > 1 
      ? blendColors(colors[0], colors[colors.length - 1])
      : '#FFFFFF';
      
    const stops = settings.backgroundGradient.stops || [];
    const newStops = [...stops, { offset: 0.5, color: newColor }];
    
    onSettingsChange({
      backgroundGradient: {
        ...settings.backgroundGradient,
        colors: [...colors, newColor],
        stops: newStops
      }
    });
  };
  
  const removeGradientStop = (index: number) => {
    if (!settings.backgroundGradient || index < 2) return; // Keep at least 2 colors
    
    const colors = [...settings.backgroundGradient.colors];
    colors.splice(index, 1);
    
    const stops = settings.backgroundGradient.stops 
      ? [...settings.backgroundGradient.stops]
      : undefined;
      
    if (stops) {
      stops.splice(index, 1);
    }
    
    onSettingsChange({
      backgroundGradient: {
        ...settings.backgroundGradient,
        colors,
        stops
      }
    });
  };
  
  const updateStopOffset = (index: number, offset: number) => {
    if (!settings.backgroundGradient || !settings.backgroundGradient.stops) return;
    
    const stops = [...settings.backgroundGradient.stops];
    stops[index] = { ...stops[index], offset };
    
    onSettingsChange({
      backgroundGradient: {
        ...settings.backgroundGradient,
        stops
      }
    });
  };
  
  // Helper function to blend two colors
  const blendColors = (color1: string, color2: string): string => {
    // Convert hex to RGB
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);
    
    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);
    
    // Blend colors (simple average)
    const r = Math.floor((r1 + r2) / 2);
    const g = Math.floor((g1 + g2) / 2);
    const b = Math.floor((b1 + b2) / 2);
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Gradient presets
  const gradientPresets = [
    { colors: ['#4158D0', '#C850C0'], name: 'Purple Dream' },
    { colors: ['#0093E9', '#80D0C7'], name: 'Aqua Blue' },
    { colors: ['#FF9A8B', '#FF6A88'], name: 'Sunset' },
    { colors: ['#FEE140', '#FA709A'], name: 'Sunshine' },
    { colors: ['#8EC5FC', '#E0C3FC'], name: 'Lavender' },
    { colors: ['#D9AFD9', '#97D9E1'], name: 'Cotton Candy' },
    { colors: ['#85FFBD', '#FFFB7D'], name: 'Mint Lime' },
    { colors: ['#FF3CAC', '#784BA0'], name: 'Cosmic Fusion' }
  ];

  const applyGradientPreset = (colors: string[]) => {
    onSettingsChange({
      backgroundGradient: {
        type: settings.backgroundGradient?.type || 'linear',
        colors,
        angle: settings.backgroundGradient?.angle || 45
      }
    });
  };

  return (
    <div className="gradient-background-controls">
      <div className="gradient-type-selection mb-4">
        <label className="control-label mb-2">Background Type</label>
        <div className="flex space-x-2">
          <button
            className={`gradient-type-btn p-2 border rounded flex-1 flex flex-col items-center
              ${!settings.backgroundGradient ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'}`}
            onClick={() => handleGradientTypeChange('solid')}
          >
            <div className="w-10 h-10 mb-1 rounded"
              style={{ backgroundColor: settings.backgroundColor }}
            ></div>
            <span className="text-xs">Solid</span>
          </button>
          
          <button
            className={`gradient-type-btn p-2 border rounded flex-1 flex flex-col items-center
              ${settings.backgroundGradient?.type === 'linear' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'}`}
            onClick={() => handleGradientTypeChange('linear')}
          >
            <div className="w-10 h-10 mb-1 rounded"
              style={{ 
                background: `linear-gradient(45deg, ${(settings.backgroundGradient?.colors || ['#4158D0', '#C850C0']).join(', ')})` 
              }}
            ></div>
            <span className="text-xs">Linear</span>
          </button>
          
          <button
            className={`gradient-type-btn p-2 border rounded flex-1 flex flex-col items-center
              ${settings.backgroundGradient?.type === 'radial' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'}`}
            onClick={() => handleGradientTypeChange('radial')}
          >
            <div className="w-10 h-10 mb-1 rounded"
              style={{ 
                background: `radial-gradient(circle, ${(settings.backgroundGradient?.colors || ['#4158D0', '#C850C0']).join(', ')})` 
              }}
            ></div>
            <span className="text-xs">Radial</span>
          </button>
        </div>
      </div>
      
      {settings.backgroundGradient && (
        <>
          <div className="gradient-presets mb-4">
            <label className="control-label mb-2">Gradient Presets</label>
            <div className="grid grid-cols-4 gap-2">
              {gradientPresets.map((preset, index) => (
                <button
                  key={index}
                  className="gradient-preset-btn p-1 border rounded"
                  onClick={() => applyGradientPreset(preset.colors)}
                  title={preset.name}
                >
                  <div className="w-full h-8 rounded"
                    style={{ 
                      background: `linear-gradient(45deg, ${preset.colors.join(', ')})` 
                    }}
                  ></div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="gradient-color-controls mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="control-label">Gradient Colors</label>
              {(settings.backgroundGradient.colors?.length || 0) < 5 && (
                <button
                  className="add-color-btn text-blue-500 flex items-center text-xs"
                  onClick={addGradientStop}
                >
                  <PlusCircle size={14} className="mr-1" />
                  Add Color
                </button>
              )}
            </div>
            
            {settings.backgroundGradient.colors?.map((color, index) => (
              <div key={index} className="gradient-color-item flex items-center mb-2">
                <ColorPicker
                  color={color}
                  onChange={(newColor) => handleGradientColorChange(index, newColor)}
                />
                {index >= 2 && (
                  <button
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => removeGradientStop(index)}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {settings.backgroundGradient.type === 'linear' && (
            <div className="control-group mb-4">
              <div className="flex justify-between items-center">
                <label className="control-label">Angle</label>
                <div className="flex items-center">
                  <button
                    className="mr-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => handleGradientAngleChange(45)}
                    title="Reset to default (45°)"
                  >
                    <RotateCcw size={14} />
                  </button>
                  <span className="text-sm opacity-80">{settings.backgroundGradient.angle || 0}°</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="5"
                value={settings.backgroundGradient.angle || 0}
                onChange={(e) => handleGradientAngleChange(parseInt(e.target.value))}
                className="w-full slider"
              />
              <div className="angle-presets flex justify-between mt-2">
                {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                  <button
                    key={angle}
                    className={`angle-preset-btn w-7 h-7 rounded-full border flex items-center justify-center text-xs
                      ${(settings.backgroundGradient?.angle || 0) === angle ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'}`}
                    onClick={() => handleGradientAngleChange(angle)}
                  >
                    {angle}°
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {settings.backgroundGradient.type === 'radial' && (
            <div className="control-group mb-4">
              <label className="control-label mb-2">Position</label>
              <div className="position-controls grid grid-cols-3 gap-2">
                {['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'].map((pos, index) => {
                  // Skip middle column in first and last row to create a 5-position grid
                  if ((index === 1 || index === 3) && pos !== 'center') {
                    return (
                      <React.Fragment key={pos}>
                        {index === 1 && <div></div>}
                        <button
                          className={`position-btn w-full h-8 border rounded flex items-center justify-center
                            ${settings.backgroundGradient?.position === pos ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'}`}
                          onClick={() => handleGradientPositionChange(pos as any)}
                        >
                          <Move size={14} />
                        </button>
                      </React.Fragment>
                    );
                  }
                  return (
                    <button
                      key={pos}
                      className={`position-btn w-full h-8 border rounded flex items-center justify-center
                        ${settings.backgroundGradient?.position === pos ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'}`}
                      onClick={() => handleGradientPositionChange(pos as any)}
                    >
                      <Move size={14} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Advanced options toggle */}
          <div className="advanced-options mb-2">
            <button
              className="text-sm flex items-center text-blue-500"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            >
              <span className="mr-1">{showAdvancedOptions ? '−' : '+'}</span>
              Advanced Options
            </button>
          </div>
          
          {showAdvancedOptions && (
            <div className="advanced-gradient-options bg-gray-50 dark:bg-gray-800 p-3 rounded mb-4">
              <p className="text-xs text-gray-500 mb-2">
                Coming soon: Multi-color gradient stops with custom positions.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
