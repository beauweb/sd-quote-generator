import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { QuoteSettings } from '../types';
import './ColorPicker.css';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
  settings: QuoteSettings;
}

interface HSV {
  h: number;
  s: number;
  v: number;
}

// Predefined color palette
const COLOR_PALETTE = [
  '#ff0000', '#ff4500', '#ff8c00', '#ffa500', '#ffd700', '#ffff00', '#9acd32', '#32cd32',
  '#00ff00', '#00fa9a', '#00ffff', '#00bfff', '#0000ff', '#8a2be2', '#ff00ff', '#ff1493',
  '#000000', '#696969', '#808080', '#a9a9a9', '#c0c0c0', '#d3d3d3', '#dcdcdc', '#ffffff'
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ label, color, onChange, settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [currentColor, setCurrentColor] = useState(color);
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'saturation' | 'hue' | null>(null);
  
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const saturationRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);

  // Convert hex to HSV
  const hexToHsv = (hex: string): HSV => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return { h: 0, s: 0, v: 0 };
    
    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    let h = 0;
    if (diff === 0) h = 0;
    else if (max === r) h = ((g - b) / diff) % 6;
    else if (max === g) h = (b - r) / diff + 2;
    else if (max === b) h = (r - g) / diff + 4;

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    const s = max === 0 ? 0 : Math.round((diff / max) * 100);
    const v = Math.round(max * 100);

    return { h, s, v };
  };

  // Convert HSV to hex
  const hsvToHex = (hsv: HSV): string => {
    const { h, s, v } = hsv;
    const sDecimal = s / 100;
    const vDecimal = v / 100;

    const c = vDecimal * sDecimal;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = vDecimal - c;

    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) {
      r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
      r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
      r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
      r = x; g = 0; b = c;
    } else if (h >= 300 && h < 360) {
      r = c; g = 0; b = x;
    }

    const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
    const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
    const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`;
  };

  // Validate hex color
  const isValidHex = (hex: string) => /^#[0-9A-Fa-f]{6}$/.test(hex);
  const safeColor = isValidHex(currentColor) ? currentColor : '#000000';
  const hsv = hexToHsv(safeColor);

  // Calculate optimal position for the color picker
  const calculatePosition = useCallback((buttonElement: HTMLButtonElement) => {
    const rect = buttonElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const pickerWidth = 280;
    const pickerHeight = 320;
    const offset = 8;

    // Start with position below and aligned to the button
    let top = rect.bottom + offset;
    let left = rect.left;

    // If it would go below viewport, position above
    if (top + pickerHeight > viewportHeight) {
      top = rect.top - pickerHeight - offset;
    }

    // If it would go right of viewport, align to right edge
    if (left + pickerWidth > viewportWidth) {
      left = rect.right - pickerWidth;
    }

    // Ensure it doesn't go outside viewport
    if (left < 0) left = 8;
    if (top < 0) top = 8;

    return { top, left };
  }, []);

  // Handle opening the color picker
  const handleOpen = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const buttonElement = e.currentTarget;
    const newPosition = calculatePosition(buttonElement);
    setPosition(newPosition);
    setCurrentColor(color);
    setIsOpen(true);
  }, [calculatePosition, color]);

  // Handle closing the color picker
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setIsDragging(false);
    setDragType(null);
  }, []);

  // Handle saturation and value changes
  const handleSaturationChange = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!saturationRef.current) return;

    const rect = saturationRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    const newHsv = { ...hsv };
    newHsv.s = Math.round(x * 100);
    newHsv.v = Math.round((1 - y) * 100);

    const newColor = hsvToHex(newHsv);
    setCurrentColor(newColor);
    onChange(newColor);
  }, [hsv, onChange]);

  // Handle hue changes
  const handleHueChange = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!hueRef.current) return;

    const rect = hueRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    const newHsv = { ...hsv };
    newHsv.h = Math.round(x * 360);

    const newColor = hsvToHex(newHsv);
    setCurrentColor(newColor);
    onChange(newColor);
  }, [hsv, onChange]);

  // Mouse event handlers for smooth dragging
  const handleMouseDown = useCallback((e: React.MouseEvent, type: 'saturation' | 'hue') => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setDragType(type);
    
    const handler = type === 'saturation' ? handleSaturationChange : handleHueChange;
    handler(e);
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      handler(moveEvent);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDragType(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [handleSaturationChange, handleHueChange]);

  // Handle color selection from palette
  const handleColorSelect = useCallback((selectedColor: string) => {
    setCurrentColor(selectedColor);
    onChange(selectedColor);
  }, [onChange]);

  // Handle hex input change
  const handleHexChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isValidHex(value)) {
      setCurrentColor(value);
      onChange(value);
    }
  }, [onChange]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      
      if (isOpen && 
          buttonRef.current && 
          !buttonRef.current.contains(target) &&
          popoverRef.current && 
          !popoverRef.current.contains(target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, handleClose]);

  // Generate gradients
  const hueGradient = 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)';
  const saturationGradient = `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hsv.h}, 100%, 50%))`;

  // Render color picker popover using portal
  const renderColorPickerPopover = () => {
    if (!isOpen) return null;

    return createPortal(
      <div 
        className="color-picker-popover"
        ref={popoverRef}
        style={{
          position: 'fixed',
          top: `${position.top}px`,
          left: `${position.left}px`,
          zIndex: 100000,
        }}
      >
        <div className="color-picker-header">
          <span>{label}</span>
          <button 
            className="color-picker-close-btn"
            onClick={handleClose}
            aria-label="Close color picker"
            title="Close color picker"
          >
            ✕
          </button>
        </div>
        
        <div className="color-picker-content">
          {/* Saturation and Value picker */}
          <div 
            ref={saturationRef}
            className="color-picker-saturation"
            style={{ background: saturationGradient }}
            onMouseDown={(e) => handleMouseDown(e, 'saturation')}
          >
            <div 
              className="color-picker-saturation-pointer"
              style={{
                left: `${hsv.s}%`,
                top: `${100 - hsv.v}%`,
              }}
            />
          </div>

          {/* Hue slider */}
          <div 
            ref={hueRef}
            className="color-picker-hue"
            style={{ background: hueGradient }}
            onMouseDown={(e) => handleMouseDown(e, 'hue')}
          >
            <div 
              className="color-picker-hue-pointer"
              style={{ left: `${(hsv.h / 360) * 100}%` }}
            />
          </div>

          {/* Color Palette */}
          <div className="color-palette">
            <h4>Quick Colors</h4>
            <div className="color-grid">
              {COLOR_PALETTE.map((colorOption) => (
                <button
                  key={colorOption}
                  className={`color-option ${colorOption === safeColor ? 'selected' : ''}`}
                  style={{ backgroundColor: colorOption }}
                  onClick={() => handleColorSelect(colorOption)}
                  aria-label={`Select color ${colorOption}`}
                  title={colorOption}
                />
              ))}
            </div>
          </div>

          {/* Hex Input */}
          <div className="hex-input-section">
            <h4>Hex Color</h4>
            <input
              type="text"
              value={safeColor}
              onChange={handleHexChange}
              className="hex-input"
              placeholder="#000000"
              maxLength={7}
            />
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="color-picker-container">
      <div className="color-picker-input-row">
        <button
          ref={buttonRef}
          className="color-picker-swatch"
          style={{ backgroundColor: safeColor }}
          onClick={handleOpen}
          aria-label={`Select ${label.toLowerCase()} color`}
          title={`Click to select ${label.toLowerCase()} color`}
        />
        <input
          type="text"
          value={safeColor}
          onChange={handleHexChange}
          className="color-picker-input"
          maxLength={7}
          placeholder="#000000"
        />
      </div>

      {renderColorPickerPopover()}
    </div>
  );
};
