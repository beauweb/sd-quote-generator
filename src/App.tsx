import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { QuoteCanvas } from './components/QuoteCanvas';
import { Controls } from './components/Controls';
import { QuoteSettings } from './types';
import WebFont from 'webfontloader';
import html2canvas from 'html2canvas';
import { ExportButton } from './components/ExportButton';
import { useHistory } from './hooks/useHistory';
import { Undo2, Redo2, RotateCcw } from 'lucide-react'; // Import icons
import { ThemeProvider } from './contexts/ThemeContext';
import { QuoteEditor } from './components/QuoteEditor';
import { Sidebar } from './components/Sidebar';
import { FAB } from './components/FAB';
import { theme } from './theme';
import { MenuIcon, GridIcon, ListIcon, SunIcon, MoonIcon, PlusIcon } from './icons';

function App() {
  const {
    state: settings,
    setState: setSettings,
    undo,
    redo,
    canUndo,
    canRedo
  } = useHistory<QuoteSettings>({
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
  });

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isGridView, setIsGridView] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    WebFont.load({
      google: {
        families: [
          // English Serif Fonts
          'Playfair Display:400,700',
          'Lora:400,700',
          'Merriweather:400,700',
          'Crimson Text:400,700',
          'Libre Baskerville:400,700',
          'PT Serif:400,700',
          'Noto Serif:400,700',
          // English Sans-Serif Fonts
          'Montserrat:400,700',
          'Roboto:400,700',
          'Open Sans:400,700',
          'Poppins:400,700',
          'Inter:400,700',
          'Source Sans Pro:400,700',
          'Nunito:400,700',
          // Gujarati Fonts
          'Noto Sans Gujarati:400,700',
          'Rasa:400,700',
          'Hind Vadodara:400,700',
          // Hindi/Devanagari Fonts
          'Noto Sans Devanagari:400,700',
          'Hind:400,700',
          'Mukta:400,700',
          'Tiro Devanagari Hindi:400,700'
        ]
      },
      active: () => {
        setSettings(prev => ({ ...prev }));
      }
    });
    document.documentElement.classList.add('dark');
  }, []);

  // Add keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) { // Support both Windows/Linux and Mac
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              if (canRedo) redo();
            } else {
              if (canUndo) undo();
            }
            break;
          case 'y':
            e.preventDefault();
            if (canRedo) redo();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undo, redo]);

  // Theme setup
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleExport = async (resolution: number) => {
    const quoteElement = document.querySelector('.quote-container canvas');
    if (!quoteElement) return;

    try {
      // Create a temporary container
      const tempContainer = document.createElement('div');
      document.body.appendChild(tempContainer);

      // Render the quote canvas at the desired resolution
      ReactDOM.render(
        <QuoteCanvas settings={settings} canvasSize={resolution} />,
        tempContainer
      );

      // Wait for the canvas to render
      await new Promise(resolve => setTimeout(resolve, 100));

      // Get the rendered canvas
      const renderedCanvas = tempContainer.querySelector('canvas');
      if (!renderedCanvas) throw new Error('Canvas not found');

      // Create download link
      const link = document.createElement('a');
      link.download = `sd-quote-${resolution}x${resolution}.png`;
      link.href = renderedCanvas.toDataURL('image/png');
      link.click();

      // Clean up
      document.body.removeChild(tempContainer);
    } catch (error) {
      console.error('Error exporting image:', error);
    }
  };

  const initialSettings: QuoteSettings = {
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
    signatureText: '#SDdiary',
    signatureAlignment: 'center',
    quoteText: "I'm selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you can't handle me at my worst, then you sure as hell don't deserve me at my best",
    textStyle: {
      bold: false,
      italic: false,
      underline: false
    },
    signatureFontFamily: 'Poppins',
  };

  const handleReset = () => {
    setSettings(initialSettings);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-background text-text-primary py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              SD Quotes Creator
            </h1>
            <p className="mt-1 text-gray-400 text-sm">
              <em>Design and share stunning multilingual quote images effortlessly!</em>
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Preview Section - Move to top on mobile, left on desktop */}
            <div className="lg:sticky lg:top-4 order-1 lg:order-none">
              <div className="bg-surface p-4 rounded-lg shadow-xl border border-border">
                <QuoteCanvas settings={settings} />
                <div className="mt-3">
                  <ExportButton settings={settings} onExport={handleExport} />
                </div>
              </div>
            </div>

            {/* Controls Section */}
            <div>
              {/* History and Reset Controls */}
              <div className="flex items-center gap-2 mb-4 bg-surface p-2 rounded-lg border border-border">
                <button
                  onClick={undo}
                  disabled={!canUndo}
                  className={`p-2 rounded-lg ${
                    canUndo 
                      ? 'bg-primary hover:bg-opacity-90' 
                      : 'bg-surface-light text-disabled cursor-not-allowed'
                  } transition-colors`}
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 size={20} />
                </button>
                <button
                  onClick={redo}
                  disabled={!canRedo}
                  className={`p-2 rounded-lg ${
                    canRedo 
                      ? 'bg-primary hover:bg-opacity-90' 
                      : 'bg-surface-light text-disabled cursor-not-allowed'
                  } transition-colors`}
                  title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
                >
                  <Redo2 size={20} />
                </button>

                <div className="flex-1" /> {/* Spacer */}

                <button
                  onClick={handleReset}
                  className="p-2 rounded-lg bg-error hover:bg-opacity-90 transition-colors"
                  title="Reset to default settings"
                >
                  <RotateCcw size={20} />
                </button>
              </div>
              
              <Controls settings={settings} onSettingsChange={setSettings} />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;