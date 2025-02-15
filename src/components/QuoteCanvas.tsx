import React, { useEffect, useRef } from 'react';
import { QuoteSettings } from '../types';

interface QuoteCanvasProps {
  settings: QuoteSettings;
  canvasSize?: number;
}

export const QuoteCanvas: React.FC<QuoteCanvasProps> = ({ 
  settings,
  canvasSize = 1080
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Set canvas size with proper scaling for retina displays
    const scale = window.devicePixelRatio || 1;
    canvas.width = canvasSize * scale;
    canvas.height = canvasSize * scale;
    ctx.scale(scale, scale);

    // Clear canvas with solid background
    ctx.fillStyle = settings.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set text properties
    const fontSize = (settings.fontSize * canvasSize) / 1080;
    const padding = (settings.padding * canvasSize) / 1080;
    
    const fontWeight = settings.textStyle.bold ? 'bold' : 'normal';
    const fontStyle = settings.textStyle.italic ? 'italic' : 'normal';
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${settings.fontFamily}`;
    ctx.fillStyle = settings.textColor;
    ctx.textAlign = settings.textAlignment as CanvasTextAlign;

    // Enhanced word wrap function with justify support
    const wrapText = (text: string, maxWidth: number) => {
      const words = text.split(' ');
      const lines: { text: string; words: string[] }[] = [];
      let currentLine = words[0];
      let currentWords = [words[0]];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
        
        if (width < maxWidth) {
          currentLine += " " + word;
          currentWords.push(word);
        } else {
          lines.push({ text: currentLine, words: currentWords });
          currentLine = word;
          currentWords = [word];
        }
      }
      lines.push({ text: currentLine, words: currentWords });
      return lines;
    };

    // Draw quote text with justified alignment
    const maxWidth = canvas.width - (padding * 2);
    const lines = wrapText(settings.quoteText, maxWidth);
    const lineHeight = fontSize * 1.2;
    
    let y = (canvas.height - (lines.length * lineHeight)) / 2;
    
    lines.forEach(line => {
      if (settings.textAlignment === 'justify' && line.words.length > 1) {
        // Calculate spacing for justified text
        const totalSpacing = maxWidth - ctx.measureText(line.text.replace(/\s/g, '')).width;
        const spaceBetween = totalSpacing / (line.words.length - 1);
        
        let x = padding;
        line.words.forEach((word, index) => {
          ctx.fillText(word, x, y);
          x += ctx.measureText(word).width + spaceBetween;
        });
      } else {
        let x;
        switch(settings.textAlignment) {
          case 'left':
            x = padding;
            break;
          case 'right':
            x = canvas.width - padding;
            break;
          default:
            x = canvas.width / 2;
        }
        ctx.fillText(line.text, x, y);
      }
      y += lineHeight;
    });

    // Draw signature with proper alignment and font
    const signatureSize = (settings.signatureSize * canvasSize) / 1080;
    ctx.font = `${signatureSize}px ${settings.signatureFontFamily || settings.fontFamily}`;
    ctx.fillStyle = settings.signatureColor;
    ctx.textAlign = settings.signatureAlignment as CanvasTextAlign;
    
    let signatureX;
    switch(settings.signatureAlignment) {
      case 'left':
        signatureX = padding;
        break;
      case 'right':
        signatureX = canvas.width - padding;
        break;
      default:
        signatureX = canvas.width / 2;
    }
    
    ctx.fillText(settings.signatureText, signatureX, canvas.height - padding);
  }, [settings, canvasSize]);

  return (
    <div className="quote-container">
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: 'auto',
          maxWidth: '1080px',
          display: 'block',
          margin: '0 auto',
          backgroundColor: settings.backgroundColor,
        }}
      />
    </div>
  );
};