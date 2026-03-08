import React, { useState } from 'react';
import { QuoteSettings } from '../types';
import { Type, Palette, Sparkles, Shapes } from 'lucide-react';
import './Controls.css';
import { ContentControls } from './controls/ContentControls';
import { TextControls } from './controls/TextControls';
import { SignatureControls } from './controls/SignatureControls';
import { BackgroundControls } from './controls/BackgroundControls';
import { EffectsControls } from './controls/EffectsControls';
import { TemplatesSection } from './controls/TemplatesSection';
import { ShapeControls } from './controls/ShapeControls';

interface ControlsProps {
  settings: QuoteSettings;
  onSettingsChange: (settings: QuoteSettings) => void;
}

export const Controls: React.FC<ControlsProps> = ({ settings, onSettingsChange }) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'content' | 'style' | 'shapes'>('content');

  const updateSettings = (newSettings: Partial<QuoteSettings>) => {
    onSettingsChange({ ...settings, ...newSettings });
  };

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
          <button
            className={`tab ${activeTab === 'templates' ? 'active' : ''}`}
            onClick={() => setActiveTab('templates')}
          >
            <Sparkles size={16} />
            <span>Templates</span>
          </button>
          <button
            className={`tab ${activeTab === 'shapes' ? 'active' : ''}`}
            onClick={() => setActiveTab('shapes')}
          >
            <Shapes size={16} />
            <span>Shapes</span>
          </button>
        </div>
      </div>

      <div className="panels-container">
        {/* Content Tab */}
        <div className={`tab-panel ${activeTab === 'content' ? 'active' : ''}`}>
          <ContentControls settings={settings} onUpdate={updateSettings} />
        </div>

        {/* Style Tab */}
        <div className={`tab-panel ${activeTab === 'style' ? 'active' : ''}`}>
          <TextControls settings={settings} onUpdate={updateSettings} />
          <SignatureControls settings={settings} onUpdate={updateSettings} />
          <BackgroundControls settings={settings} onUpdate={updateSettings} />
          <EffectsControls settings={settings} onUpdate={updateSettings} />
        </div>

        {/* Templates Tab */}
        <div className={`tab-panel ${activeTab === 'templates' ? 'active' : ''}`}>
          <TemplatesSection settings={settings} onApply={updateSettings} />
        </div>

        {/* Shapes Tab */}
        <div className={`tab-panel ${activeTab === 'shapes' ? 'active' : ''}`}>
          <ShapeControls settings={settings} onUpdate={updateSettings} />
        </div>
      </div>
    </div>
  );
};
