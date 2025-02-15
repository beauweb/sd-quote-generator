import React from 'react';
import { Controls } from './Controls';
import { QuoteCanvas } from './QuoteCanvas';
import { ExportButton } from './ExportButton';
import { useHistory } from '../hooks/useHistory';
import { QuoteSettings } from '../types';
import { Undo2, Redo2 } from 'lucide-react';

export const QuoteEditor: React.FC = () => {
  const {
    state: settings,
    setState: setSettings,
    undo,
    redo,
    canUndo,
    canRedo
  } = useHistory<QuoteSettings>({
    // ... initial settings (move from App.tsx)
  });

  const handleExport = async (resolution: number) => {
    // ... export logic (move from App.tsx)
  };

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden">
      <div className="p-4">
        <div className="flex gap-2 mb-4">
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
        </div>
        
        <Controls settings={settings} onSettingsChange={setSettings} />
        <QuoteCanvas settings={settings} />
        <div className="mt-3">
          <ExportButton settings={settings} onExport={handleExport} />
        </div>
      </div>
    </div>
  );
}; 