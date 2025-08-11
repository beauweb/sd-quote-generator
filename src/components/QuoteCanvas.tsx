import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { QuoteSettings, TextShadowEffect, TextOutlineEffect, GradientEffect } from '../types';
import { getSmartContrastColor } from '../utils/colorUtils';

interface QuoteCanvasProps {
  settings: QuoteSettings;
  canvasSize?: number;
}

// Add a handle type for imperative access from parent components
export interface QuoteCanvasHandle {
  getCanvasElement: () => HTMLCanvasElement | null;
}

export const QuoteCanvas = forwardRef<QuoteCanvasHandle, QuoteCanvasProps>(({ 
  settings,
  canvasSize = 1080
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Expose the canvas element to parent components
  useImperativeHandle(ref, () => ({
    getCanvasElement: () => canvasRef.current
  }));

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

    // IMPORTANT: Disable image smoothing for sharper text
    ctx.imageSmoothingEnabled = false;

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
    
    // Apply text gradient if enabled
    if (settings.textGradient && settings.textGradient.enabled) {
      applyTextGradient(ctx, settings.textGradient, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = settings.textColor;
    }
    
    ctx.textAlign = settings.textAlignment as CanvasTextAlign;

    // Apply text shadow if enabled
    if (settings.textShadow && settings.textShadow.enabled) {
      const { color, blur, offsetX, offsetY } = settings.textShadow;
      ctx.shadowColor = color;
      ctx.shadowBlur = blur;
      ctx.shadowOffsetX = offsetX;
      ctx.shadowOffsetY = offsetY;
    } else {
      // Reset shadow if not enabled
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    // Configure outline if enabled
    if (settings.textOutline && settings.textOutline.enabled) {
      ctx.lineWidth = settings.textOutline.width;
      ctx.strokeStyle = settings.textOutline.color;
      ctx.lineJoin = 'round'; // Use round joins for smoother outlines
      ctx.miterLimit = 2;
    }

    // Enhanced word wrap function with justify support and line break preservation
    const wrapText = (text: string, maxWidth: number) => {
      // First split by user line breaks
      const userLines = text.split('\n');
      const allLines: { text: string; words: string[] }[] = [];
      
      userLines.forEach(userLine => {
        if (userLine.trim() === '') {
          // Empty line from user
          allLines.push({ text: '', words: [] });
        } else {
          // Word wrap within this user line
          const words = userLine.split(' ');
          let currentLine = words[0];
          let currentWords = [words[0]];

          for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + " " + word).width;
            
            if (width < maxWidth) {
              currentLine += " " + word;
              currentWords.push(word);
            } else {
              allLines.push({ text: currentLine, words: currentWords });
              currentLine = word;
              currentWords = [word];
            }
          }
          allLines.push({ text: currentLine, words: currentWords });
        }
      });
      
      return allLines;
    };

    // Draw title and quote text
    const maxWidth = canvas.width - (padding * 2);
    const titleLines = settings.title ? wrapText(settings.title, maxWidth) : [];
    const quoteLines = wrapText(settings.quoteText, maxWidth);
    const lineHeight = fontSize * (settings.lineHeight || 1.2);
    const titleFontSize = Math.round(fontSize * 0.9); // Title is 90% of quote font size for better clarity
    const titleLineHeight = titleFontSize * (settings.lineHeight || 1.2);
    
    // Calculate total content height
    const totalContentHeight = (titleLines.length * titleLineHeight) + (quoteLines.length * lineHeight);
    
    // Calculate the starting y position for title
    let titleY = (canvas.height - totalContentHeight) / 2;
    
    // Draw title if it exists
    if (titleLines.length > 0) {
      ctx.save();
      
      // Build font string with bold and italic styles
      let fontStyle = '';
      if (settings.textStyle.italic) fontStyle += 'italic ';
      if (settings.textStyle.bold) fontStyle += 'bold ';
      
      ctx.font = `${fontStyle}${titleFontSize}px ${settings.fontFamily}`;
      ctx.fillStyle = settings.textColor;
      ctx.textAlign = settings.textAlignment as CanvasTextAlign;
      
      // Apply text effects to title
      if (settings.textShadow && settings.textShadow.enabled) {
        ctx.shadowColor = settings.textShadow.color;
        ctx.shadowBlur = settings.textShadow.blur;
        ctx.shadowOffsetX = settings.textShadow.offsetX;
        ctx.shadowOffsetY = settings.textShadow.offsetY;
      } else {
        // Add subtle default shadow to title for better readability
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
      }
      
      titleLines.forEach(line => {
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
        
        // Draw title outline if enabled
        if (settings.textOutline && settings.textOutline.enabled) {
          ctx.strokeText(line.text, x, titleY);
        }
        
        // Draw title fill
        ctx.fillText(line.text, x, titleY);
        titleY += titleLineHeight;
      });
      
      ctx.restore();
    }
    
    // Calculate the starting y position for quote text with better spacing
    let y = titleLines.length > 0 ? titleY + (titleLineHeight * 1.2) : (canvas.height - (quoteLines.length * lineHeight)) / 2;
    
    // Special case for curved text
    if (settings.textPath && settings.textPath.enabled) {
      drawCurvedText(ctx, settings, canvas, quoteLines);
    } else {
      // Draw text normally
      quoteLines.forEach(line => {
        if (settings.textAlignment === 'justify' && line.words.length > 1) {
          // Calculate spacing for justified text
          const totalSpacing = maxWidth - ctx.measureText(line.text.replace(/\s/g, '')).width;
          const spaceBetween = totalSpacing / (line.words.length - 1);
          
          let x = padding;
          line.words.forEach((word, index) => {
            // IMPORTANT: Draw outline first, then fill - this matches the export ordering
            if (settings.textOutline && settings.textOutline.enabled) {
              ctx.strokeText(word, x, y);
            }

            // Now draw the text fill
            ctx.fillText(word, x, y);
            
            // Move to the next word position
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
          
          // IMPORTANT: Draw outline first, then fill - this matches the export ordering
          if (settings.textOutline && settings.textOutline.enabled) {
            ctx.strokeText(line.text, x, y);
          }
          
          // Now draw the text fill
          ctx.fillText(line.text, x, y);
        }
        y += lineHeight;
      });
    }

    // Draw signature with proper alignment and font (only if visible)
    if (settings.signatureVisible && settings.signatureText.trim()) {
      const signatureSize = Math.round((settings.signatureSize * canvasSize) / 1080);
      const bottomMargin = Math.round((settings.signatureBottomMargin || 100) * canvasSize / 1080);
      
      // Build font string with bold and italic styles for signature
      let fontStyle = '';
      if (settings.textStyle.italic) fontStyle += 'italic ';
      if (settings.textStyle.bold) fontStyle += 'bold ';
      
      ctx.font = `${fontStyle}${signatureSize}px ${settings.signatureFontFamily || settings.fontFamily}`;
      
      // Auto-adjust signature color based on background for better visibility
      const backgroundColor = settings.backgroundGradient ? 
        settings.backgroundGradient.colors[0] : // Use first gradient color as fallback
        settings.backgroundColor;
      const autoSignatureColor = getSmartContrastColor(backgroundColor);
      ctx.fillStyle = autoSignatureColor;
      
      ctx.textAlign = settings.signatureAlignment as CanvasTextAlign;
      
      // Apply text effects to signature (same as title and quote text)
      if (settings.textShadow && settings.textShadow.enabled) {
        ctx.shadowColor = settings.textShadow.color;
        ctx.shadowBlur = settings.textShadow.blur;
        ctx.shadowOffsetX = settings.textShadow.offsetX;
        ctx.shadowOffsetY = settings.textShadow.offsetY;
      } else {
        // Add subtle default shadow to signature for better readability
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
      }
      
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
      
      // Draw signature outline if enabled
      if (settings.textOutline && settings.textOutline.enabled) {
        ctx.strokeText(settings.signatureText, signatureX, signatureY);
      }
      
      // Draw signature fill
      ctx.fillText(settings.signatureText, signatureX, signatureY);
    }
    
    // Restore the context state
    ctx.restore();
  }, [settings, canvasSize]);

  // Helper function to draw curved text
  const drawCurvedText = (
    ctx: CanvasRenderingContext2D, 
    settings: QuoteSettings, 
    canvas: HTMLCanvasElement, 
    lines: { text: string; words: string[] }[]
  ) => {
    if (!settings.textPath || !settings.textPath.enabled) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = settings.textPath.radius * (canvas.width / 1080);
    const direction = settings.textPath.direction === 'clockwise' ? 1 : -1;
    const baseAngle = (settings.textPath.angle * Math.PI) / 180;

    // Calculate total angle span for all text
    const totalTextLength = lines.reduce((acc, line) => acc + line.text.length, 0);
    const anglePerChar = (Math.PI / 2) / (totalTextLength * 0.8); // using 0.8 as a spacing factor
    
    let currentAngle = baseAngle - (direction * (lines[0].text.length * anglePerChar) / 2);
    
    lines.forEach(line => {
      const chars = Array.from(line.text);
      
      chars.forEach(char => {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(currentAngle);
        ctx.translate(0, -radius);
        ctx.rotate(Math.PI / 2); // Rotate each character to face outward
        
        drawTextWithEffects(ctx, char, 0, 0, settings);
        
        ctx.restore();
        currentAngle += direction * anglePerChar;
      });
      
      // Add space between lines
      currentAngle += direction * anglePerChar * 3;
    });
  };

  // Helper function to apply text gradient
  const applyTextGradient = (
    ctx: CanvasRenderingContext2D, 
    gradientSettings: GradientEffect, 
    width: number, 
    height: number
  ) => {
    if (!gradientSettings.enabled) return;
    
    let gradient;
    if (gradientSettings.type === 'linear') {
      const angle = gradientSettings.angle || 0;
      const radian = (angle - 90) * (Math.PI / 180);
      const length = Math.sqrt(width * width + height * height);
      const centerX = width / 2;
      const centerY = height / 2;
      const startX = centerX - length / 2 * Math.cos(radian);
      const startY = centerY - length / 2 * Math.sin(radian);
      const endX = centerX + length / 2 * Math.cos(radian);
      const endY = centerY + length / 2 * Math.sin(radian);
      
      gradient = ctx.createLinearGradient(startX, startY, endX, endY);
    } else {
      gradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, width / 2
      );
    }
    
    if (gradientSettings.colors.length >= 2) {
      gradient.addColorStop(0, gradientSettings.colors[0]);
      gradient.addColorStop(1, gradientSettings.colors[1]);
    } else if (gradientSettings.colors.length === 1) {
      gradient.addColorStop(0, gradientSettings.colors[0]);
      gradient.addColorStop(1, '#ffffff');
    }
    
    ctx.fillStyle = gradient;
  };

  // Helper function to draw text with outline if enabled
  const drawTextWithEffects = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    settings: QuoteSettings
  ) => {
    // Apply text outline if enabled
    if (settings.textOutline && settings.textOutline.enabled) {
      ctx.lineWidth = settings.textOutline.width;
      ctx.strokeStyle = settings.textOutline.color;
      ctx.strokeText(text, x, y);
    }
    
    // Draw the fill text
    ctx.fillText(text, x, y);
  };

  return (
    <div id="quote-canvas" className="quote-canvas relative w-full h-full flex items-center justify-center" style={{
      overflow: 'hidden',
      position: 'relative',
    }}>
      <canvas
        ref={canvasRef}
        style={{
          width: 'auto',
          height: 'auto',
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          display: 'block',
          transition: 'all 300ms ease-in-out'
        }}
      />
    </div>
  );
});