import React from 'react';
import { QuoteSettings } from '../../types';
import { RichTextEditor } from '../RichTextEditor';

interface ContentControlsProps {
  settings: QuoteSettings;
  onUpdate: (settings: Partial<QuoteSettings>) => void;
}

export const ContentControls: React.FC<ContentControlsProps> = ({ settings, onUpdate }) => {
  return (
    <div className="control-section">
      <div className="section-content">
        <div className="control-group">
          <div className="control-header">
            <label className="control-label">Title</label>
            <div className="toggle-container">
              <input
                type="checkbox"
                id="title-visible"
                className="toggle-checkbox"
                checked={settings.titleVisible}
                onChange={(e) => onUpdate({ titleVisible: e.target.checked })}
              />
              <label htmlFor="title-visible" className="toggle-label">
                <span className="toggle-text">Show</span>
              </label>
            </div>
          </div>
          <input
            type="text"
            className="text-input"
            value={settings.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Enter quote title..."
            disabled={!settings.titleVisible}
          />
        </div>

        <div className="divider" />

        <div className="control-group">
          <label className="control-label">Quote Text</label>
          <RichTextEditor
            value={settings.quoteText}
            onChange={(html) => onUpdate({ quoteText: html })}
            placeholder="Enter your quote text here...&#10;Use Enter for line breaks"
          />
        </div>

        <div className="divider" />

        <div className="control-group">
          <div className="control-header">
            <label className="control-label">Author</label>
            <div className="toggle-container">
              <input
                type="checkbox"
                id="signature-visible"
                className="toggle-checkbox"
                checked={settings.signatureVisible}
                onChange={(e) => onUpdate({ signatureVisible: e.target.checked })}
              />
              <label htmlFor="signature-visible" className="toggle-label">
                <span className="toggle-text">Show</span>
              </label>
            </div>
          </div>
          <input
            type="text"
            className="text-input"
            value={settings.signatureText}
            onChange={(e) => onUpdate({ signatureText: e.target.value })}
            placeholder="Ankahi Baat"
            disabled={!settings.signatureVisible}
          />
          <div className="control-note">
            <small style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>
              💡 Author color automatically adjusts for optimal visibility
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};
