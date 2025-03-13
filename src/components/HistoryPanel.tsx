import React, { useState } from 'react';
import { Undo2, Redo2, Clock, XCircle } from 'lucide-react';
import { QuoteSettings } from '../types';

interface HistoryItemProps {
  description: string;
  timestamp: number;
  isCurrent: boolean;
  onClick: () => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ description, timestamp, isCurrent, onClick }) => {
  // Format time as hh:mm:ss
  const formattedTime = new Date(timestamp).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div 
      className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
        isCurrent 
          ? 'bg-purple-600 text-white' 
          : 'hover:bg-dark-700 bg-dark-800 text-gray-300'
      }`}
      onClick={onClick}
    >
      <Clock size={16} className="opacity-60" />
      <div className="flex-1 truncate">
        {description}
      </div>
      <div className="text-xs opacity-70">{formattedTime}</div>
    </div>
  );
};

interface HistoryPanelProps {
  getHistory: () => Array<{
    data: QuoteSettings;
    description: string;
    timestamp: number;
    current: boolean;
  }>;
  jumpToState: (index: number) => void;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  onClose: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
  getHistory,
  jumpToState,
  canUndo,
  canRedo,
  undo,
  redo,
  onClose
}) => {
  const history = getHistory();
  
  return (
    <div className="h-full flex flex-col bg-dark-900 rounded-lg shadow-lg overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-dark-800 border-b border-dark-700">
        <h3 className="text-white font-medium">History</h3>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-dark-700 text-gray-400 hover:text-white"
          aria-label="Close history panel"
        >
          <XCircle size={18} />
        </button>
      </div>
      
      <div className="flex gap-2 p-2 bg-dark-800 border-b border-dark-700">
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`p-2 rounded-lg flex-1 flex items-center justify-center gap-2 ${
            canUndo 
              ? 'bg-primary hover:bg-opacity-90 text-white' 
              : 'bg-dark-700 text-gray-500 cursor-not-allowed'
          }`}
          aria-label="Undo last action"
        >
          <Undo2 size={16} />
          <span>Undo</span>
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className={`p-2 rounded-lg flex-1 flex items-center justify-center gap-2 ${
            canRedo 
              ? 'bg-primary hover:bg-opacity-90 text-white' 
              : 'bg-dark-700 text-gray-500 cursor-not-allowed'
          }`}
          aria-label="Redo last undone action"
        >
          <span>Redo</span>
          <Redo2 size={16} />
        </button>
      </div>
      
      <div className="flex-1 overflow-auto p-2 space-y-1">
        {history.map((item, index) => (
          <HistoryItem
            key={index}
            description={item.description}
            timestamp={item.timestamp}
            isCurrent={item.current}
            onClick={() => jumpToState(index)}
          />
        ))}
      </div>
      
      <div className="p-2 bg-dark-800 border-t border-dark-700 text-xs text-gray-400">
        {history.length} states in history
      </div>
    </div>
  );
};

export default HistoryPanel; 