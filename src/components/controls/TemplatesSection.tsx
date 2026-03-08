import React, { useState } from 'react';
import { QuoteSettings } from '../../types';
import { GLASS_TEMPLATES, GlassTemplate } from '../../config/templates';
import { Sparkles } from 'lucide-react';
import './TemplatesSection.css';

interface TemplatesSectionProps {
  settings: QuoteSettings;
  onApply: (templateSettings: Partial<QuoteSettings>) => void;
}

export const TemplatesSection: React.FC<TemplatesSectionProps> = ({ onApply }) => {
  const [filter, setFilter] = useState<'all' | 'dark' | 'light'>('all');
  const [activeId, setActiveId] = useState<string | null>(null);

  const filtered = GLASS_TEMPLATES.filter(t => filter === 'all' || t.preview.mode === filter);

  const handleApply = (template: GlassTemplate) => {
    setActiveId(template.id);
    onApply(template.settings);
  };

  return (
    <div className="templates-section">
      <div className="templates-header">
        <div className="templates-title">
          <Sparkles size={16} />
          <span>Templates</span>
        </div>
        <div className="templates-filter">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >All</button>
          <button
            className={`filter-btn ${filter === 'dark' ? 'active' : ''}`}
            onClick={() => setFilter('dark')}
          >🌙 Dark</button>
          <button
            className={`filter-btn ${filter === 'light' ? 'active' : ''}`}
            onClick={() => setFilter('light')}
          >☀️ Light</button>
        </div>
      </div>
      <div className="templates-grid">
        {filtered.map(template => (
          <button
            key={template.id}
            className={`template-card ${activeId === template.id ? 'template-active' : ''}`}
            onClick={() => handleApply(template)}
            title={template.name}
          >
            <div
              className="template-preview"
              style={{ background: template.preview.bg }}
            >
              <div className="template-glass">
                <div
                  className="template-quote-line"
                  style={{ backgroundColor: template.preview.textColor }}
                />
                <div
                  className="template-quote-line short"
                  style={{ backgroundColor: template.preview.textColor }}
                />
                <div
                  className="template-accent-dot"
                  style={{ backgroundColor: template.preview.accentColor }}
                />
              </div>
            </div>
            <span className="template-name">{template.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
