import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { QuoteCanvas, QuoteCanvasHandle } from './components/QuoteCanvas';
import { Controls } from './components/Controls';
import { QuoteSettings } from './types';
import WebFont from 'webfontloader';
import html2canvas from 'html2canvas';
import { ExportButton } from './components/ExportButton';
import { useHistory } from './hooks/useHistory';
import { Undo2, Redo2, RotateCcw } from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';
import { QuoteEditor } from './components/QuoteEditor';
import { Sidebar } from './components/Sidebar';
import { FAB } from './components/FAB';
import { theme } from './theme';
import { MenuIcon, GridIcon, ListIcon, SunIcon, MoonIcon, PlusIcon } from './icons';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ShortcutsProvider } from './contexts/ShortcutsContext';
import ShortcutsModal from './components/ShortcutsModal';
import { useShortcuts } from './contexts/ShortcutsContext';
import './styles/animations.css';

// Wrapper component to register shortcuts inside the provider context
const AppContent: React.FC = () => {
  const {
    state: settings,
    setState: setSettings,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistory<QuoteSettings>({
    id: 'default',
    name: 'Default Template',
    backgroundColor: '#ffff00', // Yellow background
    textColor: '#000000', // Black text
    fontSize: 50, // Set initial font size to 50px
    fontFamily: 'Poppins', // Default Poppins font
    textAlignment: 'center' as const, // Default center alignment for text
    padding: 100,
    signatureSize: 50, // Ensure this is at least 20px
    signatureColor: '#000000', // Black signature color
    signatureText: '#SDdiary',
    signatureAlignment: 'center' as const, // Default center alignment for signature
    quoteText: "I'm selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you can't handle me at my worst, then you sure as hell don't deserve me at my best",
    textStyle: {
      bold: false,
      italic: false,
      underline: false
    },
    signatureFontFamily: 'Poppins', // Add initial signature font
  });

  // Move initialSettings outside the component to prevent recreation on every render
  const initialSettings = useMemo((): QuoteSettings => ({
    id: 'default',
    name: 'Default Template',
    backgroundColor: '#ffff00', // Yellow background
    textColor: '#000000', // Black text
    fontSize: 50, // Set initial font size to 50px
    fontFamily: 'Poppins', // Default Poppins font
    textAlignment: 'center', // Default center alignment for text
    padding: 100,
    signatureSize: 50, // Ensure this is at least 20px
    signatureColor: '#000000', // Black signature color
    signatureText: '#SDdiary',
    signatureAlignment: 'center', // Default center alignment for signature
    quoteText: "I'm selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you can't handle me at my worst, then you sure as hell don't deserve me at my best",
    textStyle: {
      bold: false,
      italic: false,
      underline: false
    },
    signatureFontFamily: 'Poppins', // Add initial signature font
  }), []);

  const [isDarkMode, setIsDarkMode] = useState(true);
  const { registerShortcut } = useShortcuts();

  // Add ref to QuoteCanvas
  const quoteCanvasRef = useRef<QuoteCanvasHandle>(null);

  // Create stable callback functions for shortcuts that need to access settings
  const toggleBold = useCallback(() => {
    setSettings(prevSettings => ({
      ...prevSettings,
      textStyle: { ...prevSettings.textStyle, bold: !prevSettings.textStyle.bold }
    }));
  }, [setSettings]);

  const toggleItalic = useCallback(() => {
    setSettings(prevSettings => ({
      ...prevSettings,
      textStyle: { ...prevSettings.textStyle, italic: !prevSettings.textStyle.italic }
    }));
  }, [setSettings]);

  const alignCenter = useCallback(() => {
    setSettings(prevSettings => ({
      ...prevSettings,
      textAlignment: 'center'
    }));
  }, [setSettings]);

  const alignLeft = useCallback(() => {
    setSettings(prevSettings => ({
      ...prevSettings,
      textAlignment: 'left'
    }));
  }, [setSettings]);

  const alignRight = useCallback(() => {
    setSettings(prevSettings => ({
      ...prevSettings,
      textAlignment: 'right'
    }));
  }, [setSettings]);

  // Define our handlers before using them in the useEffect
  const handleReset = useCallback(() => {
    setSettings(initialSettings);
  }, [initialSettings, setSettings]);

  // Export function
  const handleExport = useCallback(async (resolution: number) => {
    try {
      // Get the original canvas reference to match its appearance exactly
      const originalCanvas = quoteCanvasRef.current?.getCanvasElement();
      if (!originalCanvas) {
        throw new Error("Canvas element not found");
      }

      // Create a high-resolution canvas for the export
      const exportCanvas = document.createElement('canvas');
      
      // Set the exact dimensions based on the requested resolution
      if (resolution === 1920) { // HD
        exportCanvas.width = exportCanvas.height = 1920;
      } else if (resolution === 2560) { // 2K
        exportCanvas.width = exportCanvas.height = 2560;
      } else if (resolution === 4096) { // 4K
        exportCanvas.width = exportCanvas.height = 4096;
      } else {
        exportCanvas.width = exportCanvas.height = 1080;
      }
      
      // Get the export canvas context with high-quality settings
      const ctx = exportCanvas.getContext('2d', { alpha: false });
      if (!ctx) {
        throw new Error("Could not get export canvas context");
      }
      
      // Ensure we're using the highest quality rendering
      ctx.imageSmoothingEnabled = false; // Disable smoothing for sharper text
      
      // Determine the scale factor for the high-resolution export
      const scaleFactor = exportCanvas.width / 1080;
      
      // Fill the background first (solid color or gradient)
      if (settings.backgroundGradient) {
        let gradient;
        if (settings.backgroundGradient.type === 'linear') {
          const angle = settings.backgroundGradient.angle || 0;
          const radian = (angle - 90) * (Math.PI / 180);
          const centerX = exportCanvas.width / 2;
          const centerY = exportCanvas.height / 2;
          const length = Math.max(exportCanvas.width, exportCanvas.height) * 1.5;
          const startX = centerX - length / 2 * Math.cos(radian);
          const startY = centerY - length / 2 * Math.sin(radian);
          const endX = centerX + length / 2 * Math.cos(radian);
          const endY = centerY + length / 2 * Math.sin(radian);
          gradient = ctx.createLinearGradient(startX, startY, endX, endY);
        } else {
          gradient = ctx.createRadialGradient(
            exportCanvas.width / 2, exportCanvas.height / 2, 0,
            exportCanvas.width / 2, exportCanvas.height / 2, exportCanvas.width / 2
          );
        }
        gradient.addColorStop(0, settings.backgroundGradient.colors[0]);
        gradient.addColorStop(1, settings.backgroundGradient.colors[1]);
        ctx.fillStyle = gradient;
            } else {
        ctx.fillStyle = settings.backgroundColor;
      }
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
      
      // Draw pattern overlay if selected
      if (settings.pattern) {
        ctx.globalAlpha = 0.1; // 10% opacity
        const patternSize = Math.round(20 * scaleFactor);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.max(1, 1 * scaleFactor);

        switch (settings.pattern) {
          case 'dots':
            for (let x = patternSize; x < exportCanvas.width; x += patternSize * 2) {
              for (let y = patternSize; y < exportCanvas.height; y += patternSize * 2) {
                ctx.beginPath();
                ctx.arc(x, y, Math.max(1, 1 * scaleFactor), 0, Math.PI * 2);
                ctx.fill();
              }
            }
            break;

          case 'lines':
            for (let y = patternSize; y < exportCanvas.height; y += patternSize) {
              ctx.beginPath();
              ctx.moveTo(0, y);
              ctx.lineTo(exportCanvas.width, y);
              ctx.stroke();
            }
            break;

          case 'waves':
            const amplitude = 5 * scaleFactor;
            const frequency = 0.02 / scaleFactor; // Adjust frequency to scale
            for (let y = patternSize; y < exportCanvas.height; y += patternSize * 2) {
              ctx.beginPath();
              ctx.moveTo(0, y);
              for (let x = 0; x < exportCanvas.width; x++) {
                ctx.lineTo(x, y + Math.sin(x * frequency) * amplitude);
              }
              ctx.stroke();
            }
            break;
        }
        ctx.globalAlpha = 1;
      }
      
      // Scale font and padding proportionally to the resolution
      const fontSize = Math.round(settings.fontSize * scaleFactor);
      const padding = Math.round(settings.padding * scaleFactor);
      
      // Set text properties
      const fontWeight = settings.textStyle.bold ? 'bold' : 'normal';
      const fontStyle = settings.textStyle.italic ? 'italic' : 'normal';
      
      // Preload fonts to ensure they're available for rendering
      await Promise.all([
        document.fonts.load(`${fontStyle} ${fontWeight} ${fontSize}px ${settings.fontFamily}`),
        document.fonts.load(`${Math.round(settings.signatureSize * scaleFactor)}px ${settings.signatureFontFamily || settings.fontFamily}`)
      ]).catch(e => {
        console.warn('Font loading warning:', e);
      });
      
      ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${settings.fontFamily}`;
      
      // Apply text color or gradient
      if (settings.textGradient && settings.textGradient.enabled) {
        const textGradient = ctx.createLinearGradient(0, 0, exportCanvas.width, 0);
        textGradient.addColorStop(0, settings.textGradient.colors[0]);
        textGradient.addColorStop(1, settings.textGradient.colors[1]);
        ctx.fillStyle = textGradient;
      } else {
        ctx.fillStyle = settings.textColor;
      }
      
      ctx.textAlign = settings.textAlignment as CanvasTextAlign;
      
      // Word wrap function - adapted to high resolution
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
      
      // Configure text shadow if enabled - CRITICAL for matching preview appearance
      if (settings.textShadow && settings.textShadow.enabled) {
        // Important: The shadow needs to be precisely scaled to match the preview
        ctx.shadowColor = settings.textShadow.color; 
        // Use exact scale factor for blur - this is crucial for matching the preview
        ctx.shadowBlur = Math.round(settings.textShadow.blur * scaleFactor);
        ctx.shadowOffsetX = Math.round(settings.textShadow.offsetX * scaleFactor);
        ctx.shadowOffsetY = Math.round(settings.textShadow.offsetY * scaleFactor);
      } else {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }
      
      // Configure text outline if enabled
      if (settings.textOutline && settings.textOutline.enabled) {
        // Use exact outline width for visual match
        ctx.lineWidth = Math.max(1, Math.round(settings.textOutline.width * scaleFactor));
        ctx.strokeStyle = settings.textOutline.color;
        ctx.lineJoin = 'round'; // Use round joins for smoother outlines
        ctx.miterLimit = 2;
      }
      
      // Draw the quote text
      const maxWidth = exportCanvas.width - (padding * 2);
      const lines = wrapText(settings.quoteText, maxWidth);
      const lineHeight = fontSize * (settings.lineHeight || 1.2);
      
      // Calculate starting y position
      let y = (exportCanvas.height - (lines.length * lineHeight)) / 2;
      
      // Draw text with all effects applied
      lines.forEach(line => {
        if (settings.textAlignment === 'justify' && line.words.length > 1) {
          // Handle justified text
          const totalSpacing = maxWidth - ctx.measureText(line.text.replace(/\s/g, '')).width;
          const spaceBetween = totalSpacing / (line.words.length - 1);
          
          let x = padding;
          line.words.forEach((word, index) => {
            // For each word, draw with correct effects order
            if (settings.textOutline && settings.textOutline.enabled) {
              // Draw outline first (underneath fill)
              ctx.strokeText(word, x, y);
            }
            
            // Then draw the fill text on top
            ctx.fillText(word, x, y);
            
            // Move to next word position
            x += ctx.measureText(word).width + spaceBetween;
          });
        } else {
          // Handle normal aligned text
          let x;
          switch(settings.textAlignment) {
            case 'left':
              x = padding;
              break;
            case 'right':
              x = exportCanvas.width - padding;
              break;
            default:
              x = exportCanvas.width / 2;
          }
          
          // Apply effects in the correct order to match preview
          if (settings.textOutline && settings.textOutline.enabled) {
            // Draw outline first (underneath fill)
            ctx.strokeText(line.text, x, y);
          }
          
          // Draw fill text on top
          ctx.fillText(line.text, x, y);
        }
        y += lineHeight;
      });
      
      // Reset shadow for the signature
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // Draw signature
      const signatureSize = Math.round(settings.signatureSize * scaleFactor);
      const bottomMargin = Math.round((settings.signatureBottomMargin || 100) * scaleFactor);
      
      ctx.font = `${signatureSize}px ${settings.signatureFontFamily || settings.fontFamily}`;
      ctx.fillStyle = settings.signatureColor;
      ctx.textAlign = settings.signatureAlignment as CanvasTextAlign;
      
      // Calculate the signature position
      let signatureX;
      switch(settings.signatureAlignment) {
        case 'left':
          signatureX = padding;
          break;
        case 'right':
          signatureX = exportCanvas.width - padding;
          break;
        default:
          signatureX = exportCanvas.width / 2;
      }
      
      // Draw the signature text
      const signatureY = exportCanvas.height - bottomMargin;
      ctx.fillText(settings.signatureText, signatureX, signatureY);
      
      // Get the high-resolution image data with maximum quality
      const dataUrl = exportCanvas.toDataURL('image/png', 1.0);
      
      // Create the download link
      const link = document.createElement('a');
      link.download = `quote-${resolution}px-${Date.now()}.png`;
      link.href = dataUrl;
      
      // Trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }, [settings]);

  // Helper function to render the canvas content
  const renderCanvas = (
    canvas: HTMLCanvasElement,
    settings: QuoteSettings,
    size: number
  ) => {
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    
    // Apply the settings to render the canvas
    // This code should match exactly what's in QuoteCanvas component
    // (This rendering logic would ideally be extracted to a shared function)
    
    // Background
    ctx.fillStyle = settings.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Apply all the text effects, gradients, etc.
    // ...rendering code...
  };

  // Handle updating settings with basic history
  const handleSettingsChange = useCallback((newSettings: QuoteSettings) => {
    setSettings(newSettings);
  }, [setSettings]);

  // Register keyboard shortcuts
  useEffect(() => {
    // Undo shortcut
    registerShortcut({
      id: 'undo',
      label: 'Undo',
      key: 'z',
      ctrlKey: true,
      action: () => {
        if (canUndo) undo();
      },
      category: 'general',
      description: 'Undo the last action',
    });

    // Redo shortcut (Ctrl+Y)
    registerShortcut({
      id: 'redo-y',
      label: 'Redo',
      key: 'y',
      ctrlKey: true,
      action: () => {
        if (canRedo) redo();
      },
      category: 'general',
      description: 'Redo the last undone action',
    });

    // Redo shortcut (Ctrl+Shift+Z)
    registerShortcut({
      id: 'redo-shift-z',
      label: 'Redo (alternative)',
      key: 'z',
      ctrlKey: true,
      shiftKey: true,
      action: () => {
        if (canRedo) redo();
      },
      category: 'general',
      description: 'Redo the last undone action',
    });

    // Reset shortcut
    registerShortcut({
      id: 'reset',
      label: 'Reset to Default',
      key: 'r',
      ctrlKey: true,
      shiftKey: true,
      action: handleReset,
      category: 'general',
      description: 'Reset all settings to default values',
    });

    // Export shortcut (HD)
    registerShortcut({
      id: 'export-hd',
      label: 'Export HD Image',
      key: 'e',
      ctrlKey: true,
      action: () => handleExport(1920),
      category: 'export',
      description: 'Export the quote as an HD image',
    });

    // Export shortcut (2K)
    registerShortcut({
      id: 'export-2k',
      label: 'Export 2K Image',
      key: 'e',
      ctrlKey: true,
      shiftKey: true,
      action: () => handleExport(2560),
      category: 'export',
      description: 'Export the quote as a 2K image',
    });

    // Export shortcut (4K)
    registerShortcut({
      id: 'export-4k',
      label: 'Export 4K Image',
      key: 'e',
      ctrlKey: true,
      altKey: true,
      action: () => handleExport(4096),
      category: 'export',
      description: 'Export the quote as a 4K image',
    });

    // Toggle bold
    registerShortcut({
      id: 'toggle-bold',
      label: 'Toggle Bold',
      key: 'b',
      ctrlKey: true,
      action: toggleBold,
      category: 'text',
      description: 'Toggle bold text styling',
    });

    // Toggle italic
    registerShortcut({
      id: 'toggle-italic',
      label: 'Toggle Italic',
      key: 'i',
      ctrlKey: true,
      action: toggleItalic,
      category: 'text',
      description: 'Toggle italic text styling',
    });

    // Align text center
    registerShortcut({
      id: 'align-center',
      label: 'Center Align',
      key: 'e',
      ctrlKey: true,
      shiftKey: true,
      action: alignCenter,
      category: 'text',
      description: 'Center align the text',
    });

    // Align text left
    registerShortcut({
      id: 'align-left',
      label: 'Left Align',
      key: 'l',
      ctrlKey: true,
      shiftKey: true,
      action: alignLeft,
      category: 'text',
      description: 'Left align the text',
    });

    // Align text right
    registerShortcut({
      id: 'align-right',
      label: 'Right Align',
      key: 'r',
      ctrlKey: true,
      shiftKey: true,
      action: alignRight,
      category: 'text',
      description: 'Right align the text',
    });
  }, [registerShortcut, canUndo, canRedo, undo, redo, handleReset, handleExport, toggleBold, toggleItalic, alignCenter, alignLeft, alignRight]);

  // Theme setup
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Load web fonts
  useEffect(() => {
    WebFont.load({
      google: {
        families: [
          'Poppins:400,700',
          'Playfair Display:400,700',
          'Montserrat:400,700',
          'Roboto:400,700',
          'Open Sans:400,700',
          'Noto Sans:400,700'
        ]
      }
    });
  }, []);

  return (
      <div className="min-h-screen h-screen flex flex-col overflow-hidden bg-background text-text-primary">
        <Header />
        <main className="flex-1 overflow-hidden py-6">
          <div className="h-full max-w-7xl mx-auto px-4 overflow-hidden">
            <div className="h-full overflow-hidden">
              <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Preview Section */}
                <div className="lg:h-full overflow-hidden flex flex-col preview-section">
                  <div className="bg-[rgb(12_12_12/0.8)] backdrop-blur-md p-6 rounded-lg shadow-lg border border-dark-700 flex-1 flex flex-col min-h-0">
                    <div className="flex-1 min-h-0 flex items-center justify-center">
                      <QuoteCanvas ref={quoteCanvasRef} settings={settings} />
                    </div>
                    <div className="mt-4 flex-shrink-0">
                      <ExportButton settings={settings} onExport={handleExport} />
                    </div>
                  </div>
                </div>

                {/* Controls Section */}
                <div className="lg:h-full overflow-auto">
                  <div className="h-full space-y-6">
                    <div className="bg-surface/80 backdrop-blur-md p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-2 mb-4">
                        <button
                          onClick={undo}
                          disabled={!canUndo}
                          className={`p-2 rounded-lg ${canUndo ? 'bg-primary hover:bg-opacity-90' : 'bg-surface-light text-disabled cursor-not-allowed'} transition-colors`}
                          title="Undo (Ctrl+Z)"
                        aria-label="Undo last action"
                        >
                          <Undo2 size={20} />
                        </button>
                        <button
                          onClick={redo}
                          disabled={!canRedo}
                          className={`p-2 rounded-lg ${canRedo ? 'bg-primary hover:bg-opacity-90' : 'bg-surface-light text-disabled cursor-not-allowed'} transition-colors`}
                          title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
                        aria-label="Redo last undone action"
                        >
                          <Redo2 size={20} />
                        </button>
                        <div className="flex-1" />
                        <button
                          onClick={handleReset}
                          className="p-2 rounded-lg bg-error hover:bg-opacity-90 transition-colors"
                        title="Reset to default settings (Ctrl+Shift+R)"
                        aria-label="Reset to default settings"
                        >
                          <RotateCcw size={20} />
                        </button>
                      </div>
                    <Controls settings={settings} onSettingsChange={handleSettingsChange} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      <ShortcutsModal />
      </div>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ShortcutsProvider>
        <AppContent />
      </ShortcutsProvider>
    </ThemeProvider>
  );
}

export default App;