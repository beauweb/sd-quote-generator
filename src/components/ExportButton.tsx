import React, { useState } from 'react';
import { QuoteSettings } from '../types';
import { Download, Loader } from 'lucide-react';
import { PulseCard } from './ui/PulseCard';

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
      <div className="grid grid-cols-3 gap-3">
        {resolutions.map((res) => {
          const isLoading = exportingSize === res.size;
          
          return (
            <PulseCard
              key={res.size}
              onClick={() => handleExport(res.size)}
              disabled={exportingSize !== null}
              icon={isLoading ? <Loader className="animate-spin" /> : <Download />}
              title={isLoading ? "Downloading..." : res.label}
              description={res.description}
              variant={res.label === "HD" ? "blue" : res.label === "2K" ? "purple" : "amber"}
              size="sm"
              glowEffect={true}
              interactive={true}
              showGridLines={true}
              hoverScale={1.03}
              isActive={isLoading}
            />
          );
        })}
      </div>
    </div>
  );
}; 