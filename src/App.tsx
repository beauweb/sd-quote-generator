import { useState, useEffect, useCallback, useRef } from 'react';
import { QuoteCanvas, QuoteCanvasHandle } from './components/QuoteCanvas';
import { Controls } from './components/Controls';
import { QuoteSettings } from './types';
import WebFont from 'webfontloader';
import { ExportButton } from './components/ExportButton';
import { RotateCcw } from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';
import { theme } from './theme';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ShortcutsProvider } from './contexts/ShortcutsContext';
import ShortcutsModal from './components/ShortcutsModal';
import { useShortcuts } from './contexts/ShortcutsContext';
import { renderQuoteToCanvas, preloadFonts } from './utils/canvasRenderer';
import { getGoogleFontFamilies } from './config/fonts';
import './styles/animations.css';

// Default settings - defined once to avoid duplication
const DEFAULT_SETTINGS: QuoteSettings = {
  id: 'default',
  name: 'Default Template',
  backgroundColor: '#ffff00',
  textColor: '#000000',
  fontSize: 50,
  fontFamily: 'Poppins',
  textAlignment: 'center',
  padding: 100,
  signatureSize: 50,
  signatureColor: '#000000',
  signatureText: 'Ankahi Baat',
  signatureAlignment: 'center',
  signatureVisible: true,
  title: 'Quote Title',
  titleVisible: true, // Show title by default
  quoteText: "I'm selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you can't handle me at my worst, then you sure as hell don't deserve me at my best",
  textStyle: {
    bold: false,
    italic: false,
    underline: false
  },
  signatureFontFamily: 'Poppins',
  titleFontFamily: 'Poppins',
};

// Wrapper component to register shortcuts inside the provider context
const AppContent: React.FC = () => {
  const [settings, setSettings] = useState<QuoteSettings>(DEFAULT_SETTINGS);

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

  const [isResetting, setIsResetting] = useState(false);

  // Define our handlers before using them in the useEffect
  const handleReset = useCallback(() => {
    setIsResetting(true);
    setSettings(DEFAULT_SETTINGS);
    setTimeout(() => setIsResetting(false), 800);
  }, [setSettings]);

  // Export function - uses shared canvas renderer
  const handleExport = useCallback(async (resolution: number) => {
    try {
      // Create a high-resolution canvas for the export
      const exportCanvas = document.createElement('canvas');

      // Set the exact dimensions based on the requested resolution
      exportCanvas.width = exportCanvas.height = resolution;

      // Get the export canvas context with high-quality settings
      const ctx = exportCanvas.getContext('2d', { alpha: true });
      if (!ctx) {
        throw new Error("Could not get export canvas context");
      }

      // Determine the scale factor for the high-resolution export
      const scaleFactor = resolution / 1080;

      // Preload fonts to ensure they're available for rendering
      await preloadFonts(settings, Math.round(settings.fontSize * scaleFactor), Math.round(settings.signatureSize * scaleFactor));

      // Use shared rendering function
      renderQuoteToCanvas(ctx, settings, resolution, scaleFactor);

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

  // Handle updating settings with basic history
  const handleSettingsChange = useCallback((newSettings: QuoteSettings) => {
    setSettings(newSettings);
  }, [setSettings]);

  // Register keyboard shortcuts
  useEffect(() => {
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
  }, [registerShortcut, handleReset, handleExport, toggleBold, toggleItalic, alignCenter, alignLeft, alignRight]);

  // Load web fonts
  useEffect(() => {
    WebFont.load({
      google: {
        families: getGoogleFontFamilies()
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
                        <div className="flex-1" />
                        <button
                          onClick={handleReset}
                          className={`relative group p-[10px] rounded-xl bg-gradient-to-br from-rose-500/10 to-purple-500/10 border border-rose-500/20 hover:border-rose-500/50 transition-all duration-300 shadow-sm ${isResetting ? 'animate-[loadingPulse_1.5s_infinite] border-rose-500/80 shadow-[0_0_20px_rgba(244,63,94,0.4)]' : 'hover:shadow-[0_0_15px_rgba(244,63,94,0.2)]'}`}
                          title="Reset to default settings (Ctrl+Shift+R)"
                          aria-label="Reset to default settings"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <RotateCcw size={20} className="relative z-10 text-rose-400 group-hover:text-rose-300 transition-transform duration-500 group-hover:-rotate-180 group-active:scale-90" />
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