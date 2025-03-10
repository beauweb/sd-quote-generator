import React, { useState, useRef, useEffect } from 'react';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { QuoteSettings } from '../types';
import './ColorPicker.css';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
  settings: QuoteSettings;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ label, color, onChange, settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close the picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Only close if clicking outside both the button and popover
      if (isOpen && 
          buttonRef.current && 
          !buttonRef.current.contains(e.target as Node) &&
          popoverRef.current && 
          !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Validate color
  const validHexColor = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const safeColor = validHexColor.test(color) ? color : '#000000';

  return (
    <div className="color-picker-container">
      <div className="color-picker-input-row">
        <button
          ref={buttonRef}
          className="color-picker-swatch"
          style={{ backgroundColor: safeColor }}
          onClick={() => setIsOpen(true)}
          aria-label={`Select ${label.toLowerCase()} color`}
        />
        <HexColorInput
          color={safeColor}
          onChange={onChange}
          prefixed
          className="color-picker-input"
        />
      </div>
      
      {isOpen && (
        <div className="color-picker-modal-overlay">
          <div 
            className="color-picker-modal"
            ref={popoverRef}
          >
            <div className="color-picker-modal-header">
              <span>{label}</span>
              <button 
                className="color-picker-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close color picker"
              >
                ✕
              </button>
            </div>
            <div className="color-picker-modal-body">
              <HexColorPicker color={safeColor} onChange={onChange} />
              <div className="color-picker-inputs">
                <div className="color-preview" style={{ backgroundColor: safeColor }}></div>
                <HexColorInput
                  color={safeColor}
                  onChange={onChange}
                  prefixed
                  className="color-picker-hex-input"
                  aria-label="Hex color value"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};