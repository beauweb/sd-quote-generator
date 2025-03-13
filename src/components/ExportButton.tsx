import React, { useState } from 'react';
import { QuoteSettings } from '../types';
import { Download, Loader } from 'lucide-react';

interface ExportButtonProps {
  settings: QuoteSettings;
  onExport: (resolution: number) => Promise<void>;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ settings, onExport }) => {
  const [exportingSize, setExportingSize] = useState<number | null>(null);

  const resolutions = [
    { label: 'HD', size: 1920, description: '1920×1920' },
    { label: '2K', size: 2560, description: '2560×2560' },
    { label: '4K', size: 4096, description: '4096×4096' }
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
    <div>
      <h3 className="text-white text-lg font-medium mb-2">Export Image</h3>
      <div className="grid grid-cols-3 gap-3">
        {resolutions.map((res) => {
          const isLoading = exportingSize === res.size;
          
          return (
            <button
              key={res.size}
              onClick={() => handleExport(res.size)}
              disabled={exportingSize !== null}
              className={`
                bg-dark-800 hover:bg-dark-700 
                text-white px-4 py-3 rounded-lg 
                flex flex-col items-center justify-center 
                transition-colors 
                disabled:opacity-70 
                ${isLoading ? 'bg-dark-700' : ''}
              `}
            >
              <div className="flex items-center gap-2">
                {isLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
                <span>{isLoading ? "Downloading..." : res.label}</span>
              </div>
              <span className="text-xs text-gray-400 mt-1">{res.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}; 