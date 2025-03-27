import React from 'react';
import { QuoteSettings, TextShadowEffect } from '../types';
import { Droplet, Sun, Moon } from 'lucide-react';
import { ColorPicker } from './ColorPicker';

interface TextShadowControlsProps {
  settings: QuoteSettings;
  onSettingsChange: (settings: Partial<QuoteSettings>) => void;
}

export const TextShadowControls: React.FC<TextShadowControlsProps> = ({ 
  settings, 
  onSettingsChange 
}) => {
  const handleTextShadowChange = (property: keyof TextShadowEffect, value: number | string | boolean) => {
    const textShadow: TextShadowEffect = { 
      ...(settings.textShadow || { 
        enabled: true, 
        color: '#000000', 
        blur: 5, 
        offsetX: 0, 
        offsetY: 0,
        intensity: 1,
        style: 'normal'
      }), 
      [property]: value,
      enabled: true
    };
    
    onSettingsChange({ textShadow });
  };

  const handleShadowStyleChange = (style: 'normal' | 'multiple' | 'glow') => {
    let updatedShadow: TextShadowEffect;
    
    switch (style) {
      case 'normal':
        updatedShadow = {
          ...(settings.textShadow || {}),
          style: 'normal',
          enabled: true,
          blur: 5,
          offsetX: 2,
          offsetY: 2,
          intensity: 1
        };
        break;
      case 'multiple':
        updatedShadow = {
          ...(settings.textShadow || {}),
          style: 'multiple',
          enabled: true,
          blur: 1,
          offsetX: 1,
          offsetY: 1,
          intensity: 2
        };
        break;
      case 'glow':
        updatedShadow = {
          ...(settings.textShadow || {}),
          style: 'glow',
          enabled: true,
          blur: 15,
          offsetX: 0,
          offsetY: 0,
          intensity: 1.5
        };
        break;
      default:
        updatedShadow = {
          ...(settings.textShadow || {}),
          style: 'normal',
          enabled: true
        };
    }
    
    onSettingsChange({ textShadow: updatedShadow });
  };
  
  const shadowEnabled = settings.textShadow?.enabled || false;
  const shadowStyle = settings.textShadow?.style || 'normal';

  return (
    <div className="text-shadow-controls">
      <div className="flex justify-between items-center mb-3">
        <label className="control-label">Text Shadow</label>
        <label className="switch-container">
          <input
            type="checkbox"
            checked={shadowEnabled}
            onChange={(e) => handleTextShadowChange('enabled', e.target.checked)}
          />
          <span className="switch"></span>
        </label>
      </div>
      
      {shadowEnabled && (
        <>
          <div className="control-group mb-4">
            <label className="control-label mb-2">Shadow Style</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                className={`shadow-style-btn p-2 border rounded flex flex-col items-center justify-center
                  ${shadowStyle === 'normal' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'}`}
                onClick={() => handleShadowStyleChange('normal')}
              >
                <Droplet size={16} className="mb-1" />
                <span className="text-xs">Normal</span>
              </button>
              <button
                className={`shadow-style-btn p-2 border rounded flex flex-col items-center justify-center
                  ${shadowStyle === 'multiple' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'}`}
                onClick={() => handleShadowStyleChange('multiple')}
              >
                <Droplet size={16} className="mb-1" />
                <span className="text-xs">Multiple</span>
              </button>
              <button
                className={`shadow-style-btn p-2 border rounded flex flex-col items-center justify-center
                  ${shadowStyle === 'glow' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'}`}
                onClick={() => handleShadowStyleChange('glow')}
              >
                <Sun size={16} className="mb-1" />
                <span className="text-xs">Glow</span>
              </button>
            </div>
          </div>
          
          <div className="control-group mb-3">
            <label className="control-label mb-2">Shadow Color</label>
            <ColorPicker 
              color={settings.textShadow?.color || '#000000'} 
              onChange={(color) => handleTextShadowChange('color', color)}
            />
          </div>
          
          <div className="control-group mb-3">
            <div className="flex justify-between items-center">
              <label className="control-label">Blur</label>
              <span className="text-sm opacity-80">{settings.textShadow?.blur || 0}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={settings.textShadow?.blur || 0}
              onChange={(e) => handleTextShadowChange('blur', parseInt(e.target.value))}
              className="w-full slider"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="control-group">
              <div className="flex justify-between items-center">
                <label className="control-label">Offset X</label>
                <span className="text-sm opacity-80">{settings.textShadow?.offsetX || 0}px</span>
              </div>
              <input
                type="range"
                min="-20"
                max="20"
                step="1"
                value={settings.textShadow?.offsetX || 0}
                onChange={(e) => handleTextShadowChange('offsetX', parseInt(e.target.value))}
                className="w-full slider"
              />
            </div>
            
            <div className="control-group">
              <div className="flex justify-between items-center">
                <label className="control-label">Offset Y</label>
                <span className="text-sm opacity-80">{settings.textShadow?.offsetY || 0}px</span>
              </div>
              <input
                type="range"
                min="-20"
                max="20"
                step="1"
                value={settings.textShadow?.offsetY || 0}
                onChange={(e) => handleTextShadowChange('offsetY', parseInt(e.target.value))}
                className="w-full slider"
              />
            </div>
          </div>
          
          <div className="control-group">
            <div className="flex justify-between items-center">
              <label className="control-label">Intensity</label>
              <span className="text-sm opacity-80">{settings.textShadow?.intensity || 1}x</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={settings.textShadow?.intensity || 1}
              onChange={(e) => handleTextShadowChange('intensity', parseFloat(e.target.value))}
              className="w-full slider"
            />
          </div>
        </>
      )}
    </div>
  );
};
