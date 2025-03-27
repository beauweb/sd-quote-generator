import React, { useState } from 'react';
import { ExportOptions as ExportOptionsType, SocialMediaPreset, QuoteSettings } from '../types';
import { Download, Loader, ImageIcon, File, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';
import { PulseCard } from './ui/PulseCard';

interface ExportOptionsProps {
  // settings may be used in future enhancements
  settings?: QuoteSettings;
  onExport: (options: ExportOptionsType) => Promise<void>;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({ 
  settings = {} as QuoteSettings, 
  onExport 
}) => {
  const [exportingFormat, setExportingFormat] = useState<string | null>(null);
  const [exportingPreset, setExportingPreset] = useState<string | null>(null);
  const [showCustomSize, setShowCustomSize] = useState(false);
  const [customWidth, setCustomWidth] = useState(settings.canvasSize || 1080);
  const [customHeight, setCustomHeight] = useState(settings.canvasSize || 1080);
  const [activeTab, setActiveTab] = useState<'formats' | 'presets'>('formats');

  // Export formats
  const formats = [
    { id: 'png', label: 'PNG', description: 'High quality, transparent', icon: <ImageIcon size={18} /> },
    { id: 'jpeg', label: 'JPEG', description: 'Smaller file size', icon: <ImageIcon size={18} /> },
    { id: 'svg', label: 'SVG', description: 'Vector format', icon: <File size={18} /> }
  ];

  // Social media presets
  const presets: SocialMediaPreset[] = [
    { id: 'instagram-square', name: 'Instagram Square', width: 1080, height: 1080, description: '1:1 square', icon: 'instagram' },
    { id: 'instagram-portrait', name: 'Instagram Portrait', width: 1080, height: 1350, description: '4:5 ratio', icon: 'instagram' },
    { id: 'instagram-story', name: 'Instagram Story', width: 1080, height: 1920, description: '9:16 ratio', icon: 'instagram' },
    { id: 'facebook-post', name: 'Facebook Post', width: 1200, height: 630, description: 'Standard post', icon: 'facebook' },
    { id: 'twitter-post', name: 'Twitter Post', width: 1200, height: 675, description: '16:9 ratio', icon: 'twitter' },
    { id: 'linkedin-post', name: 'LinkedIn Post', width: 1200, height: 627, description: 'Standard post', icon: 'linkedin' }
  ];

  const handleExportFormat = async (format: string) => {
    if (exportingFormat !== null) return; // Prevent multiple exports at once
    
    try {
      setExportingFormat(format);
      await onExport({
        format: format as 'png' | 'jpeg' | 'svg',
        width: 1080,
        height: 1080,
        quality: format === 'jpeg' ? 0.9 : undefined,
        transparent: format === 'png',
        includeBackground: true
      });
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      // Small delay to ensure the download has started
      setTimeout(() => {
        setExportingFormat(null);
      }, 1000);
    }
  };

  const handleExportPreset = async (preset: SocialMediaPreset) => {
    if (exportingPreset !== null) return; // Prevent multiple exports at once
    
    try {
      setExportingPreset(preset.id);
      await onExport({
        format: 'png', // Default to PNG for social media presets
        width: preset.width,
        height: preset.height,
        transparent: false,
        includeBackground: true
      });
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      // Small delay to ensure the download has started
      setTimeout(() => {
        setExportingPreset(null);
      }, 1000);
    }
  };

  const handleCustomExport = async () => {
    if (exportingPreset !== null || exportingFormat !== null) return;
    
    try {
      setExportingPreset('custom');
      await onExport({
        format: 'png',
        width: customWidth,
        height: customHeight,
        transparent: false,
        includeBackground: true
      });
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setTimeout(() => {
        setExportingPreset(null);
      }, 1000);
    }
  };

  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case 'instagram': return <Instagram size={18} />;
      case 'facebook': return <Facebook size={18} />;
      case 'twitter': return <Twitter size={18} />;
      case 'linkedin': return <Linkedin size={18} />;
      default: return <ImageIcon size={18} />;
    }
  };

  return (
    <div className="export-options-container">
      <div className="tabs-container mb-4">
        <div className="tabs flex">
          <button
            className={`tab flex-1 py-2 ${activeTab === 'formats' ? 'active' : ''}`}
            onClick={() => setActiveTab('formats')}
          >
            <File size={16} className="mr-2" />
            <span>File Formats</span>
          </button>
          <button
            className={`tab flex-1 py-2 ${activeTab === 'presets' ? 'active' : ''}`}
            onClick={() => setActiveTab('presets')}
          >
            <Instagram size={16} className="mr-2" />
            <span>Social Media</span>
          </button>
        </div>
      </div>

      {activeTab === 'formats' && (
        <div className="formats-container">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {formats.map((format) => {
              const isLoading = exportingFormat === format.id;
              
              return (
                <PulseCard
                  key={format.id}
                  onClick={() => handleExportFormat(format.id)}
                  disabled={exportingFormat !== null || exportingPreset !== null}
                  icon={isLoading ? <Loader className="animate-spin" /> : format.icon}
                  title={isLoading ? "Downloading..." : format.label}
                  description={format.description}
                  variant={format.id === "png" ? "blue" : format.id === "jpeg" ? "purple" : "amber"}
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
          
          <div className="custom-size-container">
            <div className="flex items-center mb-3">
              <button 
                className={`text-sm flex items-center ${showCustomSize ? 'text-blue-500' : 'text-gray-500'}`}
                onClick={() => setShowCustomSize(!showCustomSize)}
              >
                <span className="mr-2">{showCustomSize ? '−' : '+'}</span>
                Custom Size
              </button>
            </div>
            
            {showCustomSize && (
              <div className="custom-size-inputs bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                <div className="flex gap-2 mb-3">
                  <div className="flex-1">
                    <label className="block text-xs mb-1">Width (px)</label>
                    <input 
                      type="number"
                      min="100"
                      max="10000"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(parseInt(e.target.value) || 1080)}
                      className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs mb-1">Height (px)</label>
                    <input 
                      type="number"
                      min="100"
                      max="10000"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(parseInt(e.target.value) || 1080)}
                      className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
                <button
                  onClick={handleCustomExport}
                  disabled={exportingPreset !== null || exportingFormat !== null}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded py-2 flex items-center justify-center"
                >
                  {exportingPreset === 'custom' ? (
                    <Loader className="animate-spin mr-2" size={16} />
                  ) : (
                    <Download size={16} className="mr-2" />
                  )}
                  Export Custom Size
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'presets' && (
        <div className="presets-container">
          <div className="grid grid-cols-2 gap-3">
            {presets.map((preset) => {
              const isLoading = exportingPreset === preset.id;
              
              return (
                <PulseCard
                  key={preset.id}
                  onClick={() => handleExportPreset(preset)}
                  disabled={exportingPreset !== null || exportingFormat !== null}
                  icon={isLoading ? <Loader className="animate-spin" /> : getSocialIcon(preset.icon || '')}
                  title={isLoading ? "Downloading..." : preset.name}
                  description={`${preset.width}×${preset.height} - ${preset.description}`}
                  variant={preset.icon === "instagram" ? "purple" : preset.icon === "facebook" ? "blue" : 
                          preset.icon === "twitter" ? "blue" : preset.icon === "linkedin" ? "blue" : "purple"}
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
      )}
    </div>
  );
};
