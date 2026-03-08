import React, { useState } from 'react';
import { QuoteSettings } from '../types';
import { Download, Loader } from 'lucide-react';
import './ExportButton.css';

interface ExportButtonProps {
  settings: QuoteSettings;
  onExport: (resolution: number) => Promise<void>;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ onExport }) => {
  const [exportingSize, setExportingSize] = useState<number | null>(null);

  const resolutions = [
    { label: 'HD', size: 1920, description: '1920×1920', varClass: 'res-hd' },
    { label: '2K', size: 2560, description: '2560×2560', varClass: 'res-2k' },
    { label: '4K', size: 4096, description: '4096×4096', varClass: 'res-4k' }
  ];

  const handleExport = async (size: number) => {
    if (exportingSize !== null) return; // Prevent multiple exports at once
    
    try {
      setExportingSize(size);
      await onExport(size);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      // Small delay to ensure the download has started
      setTimeout(() => {
        setExportingSize(null);
      }, 1000);
    }
  };

  return (
    <div className="export-buttons-grid">
      {resolutions.map((res) => {
        const isLoading = exportingSize === res.size;
        
        return (
          <button
            key={res.size}
            className={`export-card ${res.varClass} ${isLoading ? 'is-loading' : ''}`}
            onClick={() => handleExport(res.size)}
            disabled={exportingSize !== null}
          >
            <div className="export-hover-glow" />
            <div className="export-icon-wrapper">
              {isLoading ? <Loader className="animate-spin" size={18} /> : <Download size={18} />}
            </div>
            <div className="export-content">
              <div className="export-title">{res.label}</div>
              <div className="export-desc">{res.description}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}; 