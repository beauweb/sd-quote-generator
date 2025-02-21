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
    
    // Apply scale transformation and save the context state
    ctx.save();
    ctx.scale(scale, scale);

    // Create background gradient or solid color
    if (settings.backgroundGradient) {
      let gradient;
      if (settings.backgroundGradient.type === 'linear') {
        const angle = settings.backgroundGradient.angle || 0;
        const radian = (angle - 90) * (Math.PI / 180);
        const length = Math.abs(canvas.width * Math.cos(radian)) + Math.abs(canvas.height * Math.sin(radian));
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const startX = centerX - length / 2 * Math.cos(radian);
        const startY = centerY - length / 2 * Math.sin(radian);
        const endX = centerX + length / 2 * Math.cos(radian);
        const endY = centerY + length / 2 * Math.sin(radian);
        gradient = ctx.createLinearGradient(startX, startY, endX, endY);
      } else {
        gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, canvas.width / 2
        );
      }
      gradient.addColorStop(0, settings.backgroundGradient.colors[0]);
      gradient.addColorStop(1, settings.backgroundGradient.colors[1]);
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = settings.backgroundColor;
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw pattern overlay if selected
    if (settings.pattern) {
      ctx.globalAlpha = 0.1; // 10% opacity
      const patternSize = 20;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;

      switch (settings.pattern) {
        case 'dots':
          for (let x = patternSize; x < canvas.width; x += patternSize * 2) {
            for (let y = patternSize; y < canvas.height; y += patternSize * 2) {
              ctx.beginPath();
              ctx.arc(x, y, 1, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          break;

        case 'lines':
          for (let y = patternSize; y < canvas.height; y += patternSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
          }
          break;

        case 'waves':
          const amplitude = 5;
          const frequency = 0.02;
          for (let y = patternSize; y < canvas.height; y += patternSize * 2) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            for (let x = 0; x < canvas.width; x++) {
              ctx.lineTo(x, y + Math.sin(x * frequency) * amplitude);
            }
            ctx.stroke();
          }
          break;
      }
      ctx.globalAlpha = 1;
    }

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
    const lineHeight = fontSize * (settings.lineHeight || 1.2);
    
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
    const signatureSize = Math.round((settings.signatureSize * canvasSize) / 1080);
    const bottomMargin = Math.round((settings.signatureBottomMargin || 100) * canvasSize / 1080);
    
    ctx.font = `${signatureSize}px ${settings.signatureFontFamily || settings.fontFamily}`;
    ctx.fillStyle = settings.signatureColor;
    ctx.textAlign = settings.signatureAlignment as CanvasTextAlign;
    
    // Calculate signature position with fixed bottom margin
    let signatureX;
    switch(settings.signatureAlignment) {
      case 'left':
        signatureX = Math.round(padding);
        break;
      case 'right':
        signatureX = Math.round(canvas.width - padding);
        break;
      default:
        signatureX = Math.round(canvas.width / 2);
    }
    
    // Position signature at specified distance from bottom with precise Y coordinate
    const signatureY = Math.round(canvas.height - bottomMargin);
    ctx.fillText(settings.signatureText, signatureX, signatureY);
    
    // Restore the context state
    ctx.restore();
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
          transition: 'all 300ms ease-in-out'
        }}
      />
    </div>
  );
};