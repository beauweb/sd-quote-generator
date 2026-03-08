import React from 'react';
import { QuoteSettings } from '../../types';
import { Square, Circle, LayoutTemplate, BoxSelect, Columns, Diamond, Hexagon, Image as ImageIcon, Heart, Star, Cloud, Ticket } from 'lucide-react';
import './ShapeControls.css';

interface ShapeControlsProps {
  settings: QuoteSettings;
  onUpdate: (settings: Partial<QuoteSettings>) => void;
}

const SHAPES = [
  { id: 'square', name: 'Square', icon: Square },
  { id: 'rounded', name: 'Rounded', icon: BoxSelect },
  { id: 'circle', name: 'Circle', icon: Circle },
  { id: 'polaroid', name: 'Polaroid', icon: ImageIcon },
  { id: 'arch', name: 'Arch Window', icon: Columns },
  { id: 'octagon', name: 'Octagon', icon: Hexagon },
  { id: 'diamond', name: 'Diamond', icon: Diamond },
  { id: 'scalloped', name: 'Postage Stamp', icon: LayoutTemplate },
  { id: 'heart', name: 'Heart', icon: Heart },
  { id: 'star', name: 'Star', icon: Star },
  { id: 'blob', name: 'Blob', icon: Cloud },
  { id: 'ticket', name: 'Ticket', icon: Ticket },
] as const;

export const ShapeControls: React.FC<ShapeControlsProps> = ({ settings, onUpdate }) => {
  const currentShape = settings.frameStyle || 'square';

  return (
    <div className="control-section">
      <div className="section-header">
        <div className="section-title">Canvas Shape</div>
      </div>
      <div className="section-content">
        <p className="text-xs text-white/50 mb-4">
          Select a frame shape for your quote image. (Areas outside the shape will be transparent when exported).
        </p>
        <div className="shapes-grid">
          {SHAPES.map((shape) => {
            const Icon = shape.icon;
            const isActive = currentShape === shape.id;
            return (
              <button
                key={shape.id}
                className={`shape-card ${isActive ? 'active' : ''}`}
                onClick={() => onUpdate({ frameStyle: shape.id as any })}
              >
                <div className="shape-icon-wrapper">
                  <Icon size={24} />
                </div>
                <span className="shape-name">{shape.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
