import React from 'react';
import { ColorAndGradientPicker } from './ColorAndGradientPicker';
import { QuoteSettings } from '../types';

interface ColorSectionProps {
  settings: QuoteSettings;
  onSettingsChange: (settings: Partial<QuoteSettings>) => void;
}

export const ColorSection: React.FC<ColorSectionProps> = ({
  settings,
  onSettingsChange
}) => {
  return (
    <div className="bg-surface p-4 rounded-lg border border-border">
      <h3 className="text-lg font-medium text-white mb-4">Colors</h3>
      <ColorAndGradientPicker
        settings={settings}
        onSettingsChange={onSettingsChange}
      />
    </div>
  );
};