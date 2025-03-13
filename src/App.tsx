import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { QuoteCanvas } from './components/QuoteCanvas';
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

  const initialSettings: QuoteSettings = {
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
  };

  const [isDarkMode, setIsDarkMode] = useState(true);
  const { registerShortcut } = useShortcuts();

  // Define our handlers before using them in the useEffect
  const handleReset = useCallback(() => {
    setSettings(initialSettings);
  }, [initialSettings, setSettings]);

  // Export function
  const handleExport = useCallback(async (resolution: number) => {
    try {
      // Find the actual canvas element within the container
      const canvasContainer = document.querySelector('.quote-canvas');
      if (!canvasContainer) {
        throw new Error("Quote canvas container not found");
      }

      // Get the actual canvas element
      const originalCanvas = canvasContainer.querySelector('canvas');
      if (!originalCanvas) {
        throw new Error("Canvas element not found inside container");
      }

      // Create a new canvas for export at the requested resolution
      const exportCanvas = document.createElement('canvas');
      let exportWidth, exportHeight;
      
      // Set dimensions based on resolution
      if (resolution === 1920) { // HD
        exportWidth = exportHeight = 1920;
      } else if (resolution === 2560) { // 2K
        exportWidth = exportHeight = 2560;
      } else if (resolution === 4096) { // 4K
        exportWidth = exportHeight = 4096;
      } else {
        exportWidth = exportHeight = 1080;
      }
      
      exportCanvas.width = exportWidth;
      exportCanvas.height = exportHeight;
      
      const exportCtx = exportCanvas.getContext('2d', { alpha: false });
      if (!exportCtx) {
        throw new Error("Could not get export canvas context");
      }
      
      // Make sure we use crisp rendering settings
      exportCtx.imageSmoothingEnabled = false;
      
      // Fill with background color first
      exportCtx.fillStyle = settings.backgroundColor;
      exportCtx.fillRect(0, 0, exportWidth, exportHeight);
      
      // Calculate scale to resize from original to target size
      const scale = exportWidth / originalCanvas.width;
      
      // Re-render the quote at high resolution instead of scaling up the low-res version
      // This will redraw all text and graphics at the target resolution for maximum sharpness
      await renderQuoteToCanvas(exportCtx, settings, exportWidth, exportHeight);
      
      // Get high-quality data URL
      const dataUrl = exportCanvas.toDataURL('image/png', 1.0);
      
      // Create a downloadable link
      const link = document.createElement('a');
      link.download = `quote-${resolution}px-${Date.now()}.png`;
      link.href = dataUrl;
      
      // Append to document, click, and remove
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }, [settings]);

  // Helper function to render the quote to a canvas context at a specific size
  const renderQuoteToCanvas = async (
    ctx: CanvasRenderingContext2D,
    settings: QuoteSettings,
    width: number,
    height: number
  ): Promise<void> => {
    // Create background gradient or solid color
    if (settings.backgroundGradient) {
      let gradient;
      if (settings.backgroundGradient.type === 'linear') {
        const angle = settings.backgroundGradient.angle || 0;
        const radian = (angle - 90) * (Math.PI / 180);
        const length = Math.abs(width * Math.cos(radian)) + Math.abs(height * Math.sin(radian));
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
      gradient.addColorStop(0, settings.backgroundGradient.colors[0]);
      gradient.addColorStop(1, settings.backgroundGradient.colors[1]);
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = settings.backgroundColor;
    }
    ctx.fillRect(0, 0, width, height);

    // Draw pattern overlay if selected
    if (settings.pattern) {
      ctx.globalAlpha = 0.1; // 10% opacity
      const patternSize = 20 * (width / 1080);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = Math.max(1, width / 1080);

      switch (settings.pattern) {
        case 'dots':
          for (let x = patternSize; x < width; x += patternSize * 2) {
            for (let y = patternSize; y < height; y += patternSize * 2) {
              ctx.beginPath();
              ctx.arc(x, y, Math.max(1, width / 1080), 0, Math.PI * 2);
              ctx.fill();
            }
          }
          break;

        case 'lines':
          for (let y = patternSize; y < height; y += patternSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
          }
          break;

        case 'waves':
          const amplitude = 5 * (width / 1080);
          const frequency = 0.02;
          for (let y = patternSize; y < height; y += patternSize * 2) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            for (let x = 0; x < width; x++) {
              ctx.lineTo(x, y + Math.sin(x * frequency) * amplitude);
            }
            ctx.stroke();
          }
          break;
      }
      ctx.globalAlpha = 1;
    }

    // Set text properties
    const fontSize = (settings.fontSize * width) / 1080;
    const padding = (settings.padding * width) / 1080;
    
    const fontWeight = settings.textStyle.bold ? 'bold' : 'normal';
    const fontStyle = settings.textStyle.italic ? 'italic' : 'normal';
    
    // Wait for the font to load (important for accurate text rendering)
    await document.fonts.load(`${fontStyle} ${fontWeight} ${fontSize}px ${settings.fontFamily}`);
    
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${settings.fontFamily}`;
    
    // Apply text styling
    if (settings.textGradient && settings.textGradient.enabled) {
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, settings.textGradient.colors[0]);
      gradient.addColorStop(1, settings.textGradient.colors[1]);
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = settings.textColor;
    }
    
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

    // Apply text shadow if enabled
    if (settings.textShadow && settings.textShadow.enabled) {
      const { color, blur, offsetX, offsetY } = settings.textShadow;
      ctx.shadowColor = color;
      ctx.shadowBlur = blur * (width / 1080);
      ctx.shadowOffsetX = offsetX * (width / 1080);
      ctx.shadowOffsetY = offsetY * (width / 1080);
    }

    // Draw quote text with justified alignment
    const maxWidth = width - (padding * 2);
    const lines = wrapText(settings.quoteText, maxWidth);
    const lineHeight = fontSize * (settings.lineHeight || 1.2);
    
    // Calculate the starting y position based on the number of lines
    let y = (height - (lines.length * lineHeight)) / 2;
    
    // Draw text normally (we'll skip curved text implementation for simplicity)
    lines.forEach(line => {
      if (settings.textAlignment === 'justify' && line.words.length > 1) {
        // Calculate spacing for justified text
        const totalSpacing = maxWidth - ctx.measureText(line.text.replace(/\s/g, '')).width;
        const spaceBetween = totalSpacing / (line.words.length - 1);
        
        let x = padding;
        line.words.forEach((word, index) => {
          // Draw the word
          ctx.fillText(word, x, y);
          
          // Apply text outline if enabled
          if (settings.textOutline && settings.textOutline.enabled) {
            ctx.lineWidth = settings.textOutline.width * (width / 1080);
            ctx.strokeStyle = settings.textOutline.color;
            ctx.strokeText(word, x, y);
          }
          
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
            x = width - padding;
            break;
          default:
            x = width / 2;
        }
        
        // Draw the line of text
        ctx.fillText(line.text, x, y);
        
        // Apply text outline if enabled
        if (settings.textOutline && settings.textOutline.enabled) {
          ctx.lineWidth = settings.textOutline.width * (width / 1080);
          ctx.strokeStyle = settings.textOutline.color;
          ctx.strokeText(line.text, x, y);
        }
      }
      y += lineHeight;
    });

    // Reset shadow settings before drawing signature
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Draw signature
    const signatureSize = Math.round((settings.signatureSize * width) / 1080);
    const bottomMargin = Math.round((settings.signatureBottomMargin || 100) * width / 1080);
    
    // Wait for signature font to load
    await document.fonts.load(`${signatureSize}px ${settings.signatureFontFamily || settings.fontFamily}`);
    
    ctx.font = `${signatureSize}px ${settings.signatureFontFamily || settings.fontFamily}`;
    ctx.fillStyle = settings.signatureColor;
    ctx.textAlign = settings.signatureAlignment as CanvasTextAlign;
    
    // Calculate signature position
    let signatureX;
    switch(settings.signatureAlignment) {
      case 'left':
        signatureX = Math.round(padding);
        break;
      case 'right':
        signatureX = Math.round(width - padding);
        break;
      default:
        signatureX = Math.round(width / 2);
    }
    
    // Position signature
    const signatureY = Math.round(height - bottomMargin);
    ctx.fillText(settings.signatureText, signatureX, signatureY);
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
      action: () => {
        setSettings({
          ...settings,
          textStyle: { ...settings.textStyle, bold: !settings.textStyle.bold }
        });
      },
      category: 'text',
      description: 'Toggle bold text styling',
    });

    // Toggle italic
    registerShortcut({
      id: 'toggle-italic',
      label: 'Toggle Italic',
      key: 'i',
      ctrlKey: true,
      action: () => {
        setSettings({
          ...settings,
          textStyle: { ...settings.textStyle, italic: !settings.textStyle.italic }
        });
      },
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
      action: () => {
        setSettings({
          ...settings,
          textAlignment: 'center'
        });
      },
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
      action: () => {
        setSettings({
          ...settings,
          textAlignment: 'left'
        });
      },
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
      action: () => {
        setSettings({
          ...settings,
          textAlignment: 'right'
        });
      },
      category: 'text',
      description: 'Right align the text',
    });
  }, [registerShortcut, canUndo, canRedo, undo, redo, settings, setSettings, handleReset, handleExport]);

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
              <div className="lg:h-full overflow-auto">
                <div className="bg-[rgb(12_12_12/0.8)] backdrop-blur-md p-6 rounded-lg shadow-lg border border-dark-700">
                  <QuoteCanvas settings={settings} />
                  <div className="mt-4">
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