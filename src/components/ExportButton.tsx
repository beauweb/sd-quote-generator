import React, { useState } from 'react';
import { QuoteSettings } from '../types';
import { Loader2, Download } from 'lucide-react';

interface ExportButtonProps {
  settings: QuoteSettings;
  onExport: (resolution: number) => Promise<void>;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ settings, onExport }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [currentResolution, setCurrentResolution] = useState<number | null>(null);

  const resolutions = [
    { label: 'HD', size: 1920, description: '1920×1920' },
    { label: '2K', size: 2560, description: '2560×2560' },
    { label: '4K', size: 4096, description: '4096×4096' }
  ];

  const handleExport = async (size: number) => {
    setIsExporting(true);
    setCurrentResolution(size);
    try {
      await onExport(size);
    } catch (error) {
      console.error('Export failed:', error);
      // You could add a toast notification here
    } finally {
      setIsExporting(false);
      setCurrentResolution(null);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {resolutions.map((res) => (
        <button
          key={res.size}
          onClick={() => handleExport(res.size)}
          disabled={isExporting}
          className={`
            relative group flex flex-col items-center justify-center
            px-4 py-3 rounded-lg font-medium
            ${isExporting && currentResolution === res.size
              ? 'bg-surface-light'
              : 'bg-surface hover:bg-surface-light'
            }
            text-white transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            border border-border hover:border-accent/20
          `}
        >
          {isExporting && currentResolution === res.size ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Exporting...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <Download className="w-5 h-5" />
                <span>{res.label}</span>
              </div>
              <span className="text-xs text-text-secondary mt-1">
                {res.description}
              </span>
            </>
          )}
        </button>
      ))}
    </div>
  );
}; 