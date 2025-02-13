import React, { useState, useEffect } from 'react';
import { QuoteCanvas } from './components/QuoteCanvas';
import { Controls } from './components/Controls';
import { QuoteSettings } from './types';
import WebFont from 'webfontloader';

function App() {
  const [settings, setSettings] = useState<QuoteSettings>({
    id: 'default',
    name: 'Default Template',
    backgroundColor: '#ffff00', // Yellow background
    textColor: '#000000', // Black text
    fontSize: 20, // Default font size 20px
    fontFamily: 'Poppins', // Default Poppins font
    textAlignment: 'center', // Default center alignment for text
    padding: 100,
    signatureSize: 20, // Default signature size 20px
    signatureColor: '#000000', // Black signature color
    signatureText: '#SDdiary',
    signatureAlignment: 'center', // Default center alignment for signature
    quoteText: 'Enter your quote here...',
    textStyle: {
      bold: false,
      italic: false,
      underline: false
    }
  });

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

  return (
    <div className="min-h-screen bg-dark-950 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Quote Image Generator
          </h1>
          <p className="mt-2 text-dark-300">Create stunning multilingual quote images</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Controls settings={settings} onSettingsChange={setSettings} />
          </div>
          
          <div className="space-y-6 lg:sticky lg:top-8">
            <div className="bg-dark-900 p-6 rounded-lg shadow-xl border border-dark-700">
              <QuoteCanvas settings={settings} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;