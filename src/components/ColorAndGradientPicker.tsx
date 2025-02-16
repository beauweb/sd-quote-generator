import React from 'react';
import { ColorPicker } from './ColorPicker';
import { QuoteSettings } from '../types';

interface ColorAndGradientPickerProps {
  settings: QuoteSettings;
  onSettingsChange: (updates: Partial<QuoteSettings>) => void;
}

export const ColorAndGradientPicker: React.FC<ColorAndGradientPickerProps> = ({
  settings,
  onSettingsChange
}) => {
  const handleGradientTypeChange = (type: 'solid' | 'linear' | 'radial') => {
    if (type === 'solid') {
      onSettingsChange({
        backgroundColor: settings.backgroundColor,
        backgroundGradient: undefined
      });
    } else {
      onSettingsChange({
        backgroundColor: settings.backgroundColor,
        backgroundGradient: {
          type,
          colors: [settings.backgroundColor, settings.backgroundColor],
          angle: 90
        }
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => handleGradientTypeChange('solid')}
          className={`px-3 py-1.5 rounded-lg ${
            !settings.backgroundGradient
              ? 'bg-primary text-white'
              : 'bg-surface-light text-gray-200 hover:bg-opacity-80'
          } transition-colors`}
        >
          Solid
        </button>
        <button
          onClick={() => handleGradientTypeChange('linear')}
          className={`px-3 py-1.5 rounded-lg ${
            settings.backgroundGradient?.type === 'linear'
              ? 'bg-primary text-white'
              : 'bg-surface-light text-gray-200 hover:bg-opacity-80'
          } transition-colors`}
        >
          Linear
        </button>
        <button
          onClick={() => handleGradientTypeChange('radial')}
          className={`px-3 py-1.5 rounded-lg ${
            settings.backgroundGradient?.type === 'radial'
              ? 'bg-primary text-white'
              : 'bg-surface-light text-gray-200 hover:bg-opacity-80'
          } transition-colors`}
        >
          Radial
        </button>
      </div>

      {!settings.backgroundGradient ? (
        <ColorPicker
          label="Background Color"
          color={settings.backgroundColor}
          onChange={(color) => onSettingsChange({ backgroundColor: color })}
          settings={settings}
        />
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <ColorPicker
              label="Color 1"
              color={settings.backgroundGradient.colors[0]}
              onChange={(color) => {
                onSettingsChange({
                  backgroundGradient: {
                    ...settings.backgroundGradient,
                    colors: [color, settings.backgroundGradient.colors[1]]
                  }
                });
              }}
              settings={settings}
            />
            <ColorPicker
              label="Color 2"
              color={settings.backgroundGradient.colors[1]}
              onChange={(color) => {
                onSettingsChange({
                  backgroundGradient: {
                    ...settings.backgroundGradient,
                    colors: [settings.backgroundGradient.colors[0], color]
                  }
                });
              }}
              settings={settings}
            />
          </div>

          {settings.backgroundGradient.type === 'linear' && (
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Angle: {settings.backgroundGradient.angle || 0}°
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={settings.backgroundGradient.angle || 0}
                onChange={(e) =>
                  onSettingsChange({
                    backgroundGradient: {
                      ...settings.backgroundGradient,
                      angle: parseInt(e.target.value)
                    }
                  })
                }
                className="w-full accent-purple-600"
              />
            </div>
          )}

          <div
            className="w-full h-12 rounded-lg mt-2"
            style={{
              background:
                settings.backgroundGradient.type === 'linear'
                  ? `linear-gradient(${settings.backgroundGradient.angle || 0}deg, ${
                      settings.backgroundGradient.colors[0]
                    }, ${settings.backgroundGradient.colors[1]})`
                  : `radial-gradient(circle, ${settings.backgroundGradient.colors[0]}, ${
                      settings.backgroundGradient.colors[1]
                    })`
            }}
          />
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-surface-light">
        <ColorPicker
          label="Text Color"
          color={settings.textColor}
          onChange={(color) => onSettingsChange({ textColor: color })}
          settings={settings}
        />
      </div>
    </div>
  );
};