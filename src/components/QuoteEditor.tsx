import React, { useState } from 'react';
import { Controls } from './Controls';
import { QuoteCanvas } from './QuoteCanvas';
import { ExportButton } from './ExportButton';
import { QuoteSettings } from '../types';

export const QuoteEditor: React.FC = () => {
  const [settings, setSettings] = useState<QuoteSettings>({
    // ... initial settings (move from App.tsx)
  } as QuoteSettings);

  const handleExport = async (resolution: number) => {
    // ... export logic (move from App.tsx)
  };

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden">
      <div className="p-4">
        <Controls settings={settings} onSettingsChange={setSettings} />
        <QuoteCanvas settings={settings} />
        <div className="mt-3">
          <ExportButton settings={settings} onExport={handleExport} />
        </div>
      </div>
    </div>
  );
};