import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { QuoteSettings } from '../types';
import { renderQuoteToCanvas } from '../utils/canvasRenderer';

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

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Set canvas size with proper scaling for retina displays
    const scale = window.devicePixelRatio || 1;
    canvas.width = canvasSize * scale;
    canvas.height = canvasSize * scale;

    // Apply scale transformation and save the context state
    ctx.save();
    ctx.scale(scale, scale);

    // Use shared rendering function
    renderQuoteToCanvas(ctx, settings, canvasSize);

    // Restore the context state
    ctx.restore();
  }, [settings, canvasSize]);

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