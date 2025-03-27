import React from 'react';
import { QuoteSettings, ImageFilter, OverlayEffect } from '../types';
import { Image, Sliders, Layers } from 'lucide-react';
import { ColorPicker } from './ColorPicker';

interface ImageFiltersControlsProps {
  settings: QuoteSettings;
  onSettingsChange: (settings: Partial<QuoteSettings>) => void;
}

export const ImageFiltersControls: React.FC<ImageFiltersControlsProps> = ({ 
  settings, 
  onSettingsChange 
}) => {
  const updateImageFilter = (property: keyof ImageFilter, value: number) => {
    const imageFilter: ImageFilter = { 
      ...(settings.imageFilter || {}), 
      [property]: value
    };
    
    onSettingsChange({ imageFilter });
  };

  const updateOverlay = (property: keyof OverlayEffect, value: any) => {
    const overlay: OverlayEffect = { 
      ...(settings.overlay || { type: 'color', opacity: 0.2, color: '#000000' }), 
      [property]: value
    };
    
    onSettingsChange({ overlay });
  };

  const resetFilters = () => {
    onSettingsChange({ imageFilter: undefined });
  };

  const defaultFilter = {
    blur: 0,
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    sepia: 0,
    hueRotate: 0,
    saturate: 100,
    invert: 0
  };

  const filters = [
    { id: 'none', name: 'None', filter: undefined },
    { id: 'grayscale', name: 'Grayscale', filter: { ...defaultFilter, grayscale: 100 } },
    { id: 'sepia', name: 'Sepia', filter: { ...defaultFilter, sepia: 80 } },
    { id: 'vintage', name: 'Vintage', filter: { ...defaultFilter, sepia: 50, contrast: 120, saturate: 110 } },
    { id: 'dramatic', name: 'Dramatic', filter: { ...defaultFilter, contrast: 150, saturate: 120 } },
    { id: 'cool', name: 'Cool', filter: { ...defaultFilter, hueRotate: 180, saturate: 80 } },
    { id: 'warm', name: 'Warm', filter: { ...defaultFilter, hueRotate: 30, saturate: 120 } },
    { id: 'sharp', name: 'Sharp', filter: { ...defaultFilter, contrast: 140, brightness: 110 } }
  ];

  const presetFilterActive = (filterId: string): boolean => {
    if (filterId === 'none' && !settings.imageFilter) return true;
    if (!settings.imageFilter) return false;
    
    // Find the preset filter that matches the current settings
    const preset = filters.find(f => f.id === filterId)?.filter;
    if (!preset) return false;
    
    // Check if all properties match the preset
    const current = settings.imageFilter;
    return (
      (preset.grayscale === current.grayscale) &&
      (preset.sepia === current.sepia) &&
      (preset.contrast === current.contrast) &&
      (preset.saturate === current.saturate) &&
      (preset.hueRotate === current.hueRotate) &&
      (preset.brightness === current.brightness)
    );
  };

  const applyPresetFilter = (filterId: string) => {
    const preset = filters.find(f => f.id === filterId)?.filter;
    onSettingsChange({ imageFilter: preset });
  };

  return (
    <div className="image-filters-controls">
      <div className="mb-4">
        <label className="control-label mb-3">Filter Presets</label>
        <div className="grid grid-cols-4 gap-2">
          {filters.map(filter => (
            <button
              key={filter.id}
              className={`filter-preset-btn p-2 text-xs border rounded
                ${presetFilterActive(filter.id) ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'}`}
              onClick={() => applyPresetFilter(filter.id)}
            >
              {filter.name}
            </button>
          ))}
        </div>
      </div>

      {settings.imageFilter && (
        <>
          <div className="control-group mb-3">
            <div className="flex justify-between items-center">
              <label className="control-label">Brightness</label>
              <span className="text-sm opacity-80">{settings.imageFilter.brightness || 100}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={settings.imageFilter.brightness || 100}
              onChange={(e) => updateImageFilter('brightness', parseInt(e.target.value))}
              className="w-full slider"
            />
          </div>

          <div className="control-group mb-3">
            <div className="flex justify-between items-center">
              <label className="control-label">Contrast</label>
              <span className="text-sm opacity-80">{settings.imageFilter.contrast || 100}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={settings.imageFilter.contrast || 100}
              onChange={(e) => updateImageFilter('contrast', parseInt(e.target.value))}
              className="w-full slider"
            />
          </div>

          <div className="control-group mb-3">
            <div className="flex justify-between items-center">
              <label className="control-label">Saturation</label>
              <span className="text-sm opacity-80">{settings.imageFilter.saturate || 100}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={settings.imageFilter.saturate || 100}
              onChange={(e) => updateImageFilter('saturate', parseInt(e.target.value))}
              className="w-full slider"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="control-group">
              <div className="flex justify-between items-center">
                <label className="control-label">Grayscale</label>
                <span className="text-sm opacity-80">{settings.imageFilter.grayscale || 0}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={settings.imageFilter.grayscale || 0}
                onChange={(e) => updateImageFilter('grayscale', parseInt(e.target.value))}
                className="w-full slider"
              />
            </div>
            
            <div className="control-group">
              <div className="flex justify-between items-center">
                <label className="control-label">Sepia</label>
                <span className="text-sm opacity-80">{settings.imageFilter.sepia || 0}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={settings.imageFilter.sepia || 0}
                onChange={(e) => updateImageFilter('sepia', parseInt(e.target.value))}
                className="w-full slider"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="control-group">
              <div className="flex justify-between items-center">
                <label className="control-label">Blur</label>
                <span className="text-sm opacity-80">{settings.imageFilter.blur || 0}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={settings.imageFilter.blur || 0}
                onChange={(e) => updateImageFilter('blur', parseFloat(e.target.value))}
                className="w-full slider"
              />
            </div>
            
            <div className="control-group">
              <div className="flex justify-between items-center">
                <label className="control-label">Hue Rotate</label>
                <span className="text-sm opacity-80">{settings.imageFilter.hueRotate || 0}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="5"
                value={settings.imageFilter.hueRotate || 0}
                onChange={(e) => updateImageFilter('hueRotate', parseInt(e.target.value))}
                className="w-full slider"
              />
            </div>
          </div>

          <button
            className="reset-btn w-full py-1 px-2 border border-gray-300 dark:border-gray-700 rounded text-sm mb-4"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </>
      )}

      <div className="divider mb-4"></div>

      <div className="overlay-controls">
        <div className="flex justify-between items-center mb-3">
          <label className="control-label">Color Overlay</label>
          <label className="switch-container">
            <input
              type="checkbox"
              checked={!!settings.overlay}
              onChange={(e) => onSettingsChange({ overlay: e.target.checked ? { type: 'color', opacity: 0.2, color: '#000000' } : undefined })}
            />
            <span className="switch"></span>
          </label>
        </div>

        {settings.overlay && (
          <>
            <div className="control-group mb-3">
              <label className="control-label mb-2">Overlay Color</label>
              <ColorPicker 
                color={settings.overlay.color || '#000000'} 
                onChange={(color) => updateOverlay('color', color)}
              />
            </div>

            <div className="control-group mb-3">
              <div className="flex justify-between items-center">
                <label className="control-label">Opacity</label>
                <span className="text-sm opacity-80">{Math.round((settings.overlay.opacity || 0) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.overlay.opacity || 0}
                onChange={(e) => updateOverlay('opacity', parseFloat(e.target.value))}
                className="w-full slider"
              />
            </div>

            <div className="control-group mb-3">
              <label className="control-label mb-2">Blend Mode</label>
              <select
                className="select-input w-full"
                value={settings.overlay.blendMode || 'normal'}
                onChange={(e) => updateOverlay('blendMode', e.target.value)}
              >
                <option value="normal">Normal</option>
                <option value="multiply">Multiply</option>
                <option value="screen">Screen</option>
                <option value="overlay">Overlay</option>
                <option value="darken">Darken</option>
                <option value="lighten">Lighten</option>
                <option value="color-dodge">Color Dodge</option>
                <option value="color-burn">Color Burn</option>
                <option value="hard-light">Hard Light</option>
                <option value="soft-light">Soft Light</option>
                <option value="difference">Difference</option>
                <option value="exclusion">Exclusion</option>
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
