import React, { useState, useRef } from 'react';
import { QuoteSettings } from '../types';
import { Image, Upload, X, Move, ZoomIn, Repeat, Palette } from 'lucide-react';

interface BackgroundImageControlsProps {
  settings: QuoteSettings;
  onSettingsChange: (settings: QuoteSettings) => void;
}

export const BackgroundImageControls: React.FC<BackgroundImageControlsProps> = ({
  settings,
  onSettingsChange,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateSettings = (newSettings: Partial<QuoteSettings>) => {
    onSettingsChange({ ...settings, ...newSettings });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const url = e.target?.result as string;
      updateSettings({
        backgroundImage: {
          url,
          opacity: 0.5,
          position: 'center',
          size: 'cover',
          repeat: 'no-repeat',
          blendMode: 'normal',
        },
      });
      setIsUploading(false);
    };

    reader.onerror = () => {
      setIsUploading(false);
      alert('Error reading image file');
    };

    reader.readAsDataURL(file);
  };

  const removeBackgroundImage = () => {
    updateSettings({ backgroundImage: undefined });
  };

  const updateBackgroundImage = (property: keyof NonNullable<QuoteSettings['backgroundImage']>, value: any) => {
    if (!settings.backgroundImage) return;
    
    updateSettings({
      backgroundImage: {
        ...settings.backgroundImage,
        [property]: value,
      },
    });
  };

  const positionOptions = [
    { value: 'center', label: 'Center' },
    { value: 'top', label: 'Top' },
    { value: 'bottom', label: 'Bottom' },
    { value: 'left', label: 'Left' },
    { value: 'right', label: 'Right' },
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-right', label: 'Bottom Right' },
  ];

  const sizeOptions = [
    { value: 'cover', label: 'Cover' },
    { value: 'contain', label: 'Contain' },
    { value: 'auto', label: 'Auto' },
    { value: '100%', label: '100%' },
    { value: '200%', label: '200%' },
    { value: '50%', label: '50%' },
  ];

  const repeatOptions = [
    { value: 'no-repeat', label: 'No Repeat' },
    { value: 'repeat', label: 'Repeat' },
    { value: 'repeat-x', label: 'Repeat X' },
    { value: 'repeat-y', label: 'Repeat Y' },
  ];

  const blendModeOptions = [
    { value: 'normal', label: 'Normal' },
    { value: 'multiply', label: 'Multiply' },
    { value: 'screen', label: 'Screen' },
    { value: 'overlay', label: 'Overlay' },
    { value: 'darken', label: 'Darken' },
    { value: 'lighten', label: 'Lighten' },
    { value: 'color-dodge', label: 'Color Dodge' },
    { value: 'color-burn', label: 'Color Burn' },
    { value: 'hard-light', label: 'Hard Light' },
    { value: 'soft-light', label: 'Soft Light' },
    { value: 'difference', label: 'Difference' },
    { value: 'exclusion', label: 'Exclusion' },
    { value: 'hue', label: 'Hue' },
    { value: 'saturation', label: 'Saturation' },
    { value: 'color', label: 'Color' },
    { value: 'luminosity', label: 'Luminosity' },
  ];

  return (
    <div className="control-section">
      <div className="section-header">
        <div className="section-title">
          <Image size={16} />
          Background Image
        </div>
      </div>
      
      <div className="section-content">
        {!settings.backgroundImage ? (
          <div className="upload-area">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <button
              className="upload-button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload size={20} />
              {isUploading ? 'Uploading...' : 'Upload Image'}
            </button>
            <p className="upload-hint">
              Supports JPG, PNG, GIF, WebP (Max 10MB)
            </p>
          </div>
        ) : (
          <div className="background-image-controls">
            {/* Image Preview */}
            <div className="image-preview">
              <img
                src={settings.backgroundImage.url}
                alt="Background"
                className="preview-image"
              />
              <button
                className="remove-image"
                onClick={removeBackgroundImage}
                title="Remove background image"
              >
                <X size={16} />
              </button>
            </div>

            {/* Opacity Control */}
            <div className="control-group">
              <label className="control-label">
                Opacity: {Math.round(settings.backgroundImage.opacity * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={settings.backgroundImage.opacity}
                onChange={(e) => updateBackgroundImage('opacity', parseFloat(e.target.value))}
                className="slider"
              />
            </div>

            {/* Position Control */}
            <div className="control-group">
              <label className="control-label">
                <Move size={14} />
                Position
              </label>
              <select
                className="select-input"
                value={settings.backgroundImage.position}
                onChange={(e) => updateBackgroundImage('position', e.target.value)}
              >
                {positionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Size Control */}
            <div className="control-group">
              <label className="control-label">
                <ZoomIn size={14} />
                Size
              </label>
              <select
                className="select-input"
                value={settings.backgroundImage.size}
                onChange={(e) => updateBackgroundImage('size', e.target.value)}
              >
                {sizeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Repeat Control */}
            <div className="control-group">
              <label className="control-label">
                <Repeat size={14} />
                Repeat
              </label>
              <select
                className="select-input"
                value={settings.backgroundImage.repeat}
                onChange={(e) => updateBackgroundImage('repeat', e.target.value)}
              >
                {repeatOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Blend Mode Control */}
            <div className="control-group">
              <label className="control-label">
                <Palette size={14} />
                Blend Mode
              </label>
              <select
                className="select-input"
                value={settings.backgroundImage.blendMode}
                onChange={(e) => updateBackgroundImage('blendMode', e.target.value)}
              >
                {blendModeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 