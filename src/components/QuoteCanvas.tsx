import React, { useRef, useState } from 'react';
import { QuoteSettings } from '../types';
import * as htmlToImage from 'html-to-image';
import { Download, ChevronDown, ChevronUp } from 'lucide-react';

interface QuoteCanvasProps {
  settings: QuoteSettings;
}

type ExportQuality = {
  name: string;
  width: number;
  height: number;
  label: string;
};

const exportQualities: ExportQuality[] = [
  { name: 'normal', width: 1080, height: 1080, label: 'Normal Quality (1080×1080)' },
  { name: 'hd', width: 1920, height: 1920, label: 'HD Quality (1920×1920)' },
  { name: '4k', width: 4096, height: 4096, label: '4K Quality (4096×4096)' }
];

export const QuoteCanvas: React.FC<QuoteCanvasProps> = ({ settings }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [showQualityOptions, setShowQualityOptions] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<ExportQuality>(exportQualities[0]);

  const exportImage = async (quality: ExportQuality) => {
    if (!canvasRef.current) return;
    
    try {
      await document.fonts.ready;
      
      const scale = quality.width / 1080;
      
      const dataUrl = await htmlToImage.toPng(canvasRef.current, {
        width: quality.width,
        height: quality.height,
        quality: 1.0,
        pixelRatio: scale,
        skipAutoScale: true,
        fontEmbedCSS: document.querySelector('style')?.innerHTML || '',
        backgroundColor: settings.backgroundColor,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: '1080px',
          height: '1080px',
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale'
        }
      });
      
      const link = document.createElement('a');
      link.download = `quote-${quality.name}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      setShowQualityOptions(false);
    } catch (error) {
      console.error('Error exporting image:', error);
    }
  };

  const getSignaturePosition = () => {
    switch (settings.signatureAlignment) {
      case 'left':
        return 'left-8';
      case 'center':
        return 'left-1/2 -translate-x-1/2';
      case 'right':
        return 'right-8';
      default:
        return 'right-8';
    }
  };

  return (
    <div className="space-y-4">
      <div
        ref={canvasRef}
        className="relative w-full aspect-square"
        style={{ 
          backgroundColor: settings.backgroundColor,
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale'
        }}
      >
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ padding: `${settings.padding}px` }}
        >
          <div 
            className="w-full h-full flex items-center justify-center"
          >
            <div
              className="max-w-full max-h-full overflow-hidden"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: settings.textAlignment === 'left' ? 'flex-start' : 
                          settings.textAlignment === 'right' ? 'flex-end' : 'center',
                justifyContent: 'center'
              }}
            >
              <p
                className="whitespace-pre-wrap break-words"
                style={{
                  color: settings.textColor,
                  fontSize: `${settings.fontSize}px`,
                  fontFamily: `${settings.fontFamily}, system-ui, -apple-system, sans-serif`,
                  textAlign: settings.textAlignment,
                  lineHeight: '1.5',
                  fontWeight: settings.textStyle.bold ? 'bold' : 'normal',
                  fontStyle: settings.textStyle.italic ? 'italic' : 'normal',
                  textDecoration: settings.textStyle.underline ? 'underline' : 'none',
                  letterSpacing: '0.01em',
                  wordSpacing: settings.textAlignment === 'justify' ? '0.05em' : '0.02em',
                  maxWidth: '100%',
                  margin: 0,
                  padding: 0,
                  textJustify: settings.textAlignment === 'justify' ? 'inter-word' : undefined,
                  hyphens: settings.textAlignment === 'justify' ? 'auto' : 'none',
                  WebkitHyphens: settings.textAlignment === 'justify' ? 'auto' : 'none'
                }}
              >
                {settings.quoteText}
              </p>
            </div>
          </div>
        </div>
        <div
          className={`absolute bottom-8 ${getSignaturePosition()}`}
          style={{
            color: settings.signatureColor,
            fontSize: `${settings.signatureSize}px`,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: 500,
            letterSpacing: '0.02em',
            textRendering: 'geometricPrecision'
          }}
        >
          {settings.signatureText}
        </div>
      </div>
      
      <div className="relative">
        <button
          onClick={() => setShowQualityOptions(!showQualityOptions)}
          className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Download size={20} />
          <span>Export as {selectedQuality.label}</span>
          {showQualityOptions ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {showQualityOptions && (
          <div className="absolute bottom-full mb-2 w-full bg-dark-900 rounded-lg shadow-xl border border-dark-700 overflow-hidden">
            {exportQualities.map((quality) => (
              <button
                key={quality.name}
                onClick={() => {
                  setSelectedQuality(quality);
                  exportImage(quality);
                }}
                className="w-full px-4 py-3 text-left text-white hover:bg-dark-800 transition-colors flex items-center space-x-2"
              >
                <Download size={16} />
                <span>{quality.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};