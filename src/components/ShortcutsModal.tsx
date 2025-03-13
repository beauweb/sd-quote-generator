import React from 'react';
import { useShortcuts } from '../contexts/ShortcutsContext';
import { KeyboardShortcut } from '../types';
import { X } from 'lucide-react';

const ShortcutsModal: React.FC = () => {
  const { shortcuts, showShortcutsModal, setShowShortcutsModal } = useShortcuts();

  if (!showShortcutsModal) return null;

  const categories = Array.from(new Set(shortcuts.map((s) => s.category)));

  const formatShortcut = (shortcut: KeyboardShortcut) => {
    const parts = [];
    if (shortcut.ctrlKey) parts.push('Ctrl');
    if (shortcut.shiftKey) parts.push('Shift');
    if (shortcut.altKey) parts.push('Alt');
    if (shortcut.metaKey) parts.push('Meta');
    
    // Format the key for better readability
    let key = shortcut.key;
    if (key === ' ') key = 'Space';
    if (key === 'ArrowUp') key = '↑';
    if (key === 'ArrowDown') key = '↓';
    if (key === 'ArrowLeft') key = '←';
    if (key === 'ArrowRight') key = '→';
    
    parts.push(key.length === 1 ? key.toUpperCase() : key);
    
    return parts.join(' + ');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-dark-800 rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b border-dark-600">
          <h2 className="text-xl font-semibold text-white">Keyboard Shortcuts</h2>
          <button 
            onClick={() => setShowShortcutsModal(false)}
            className="p-1 rounded-full hover:bg-dark-700 text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <p className="text-gray-300 mb-4">
            Enhance your workflow with these keyboard shortcuts. Press <kbd className="px-2 py-1 bg-dark-700 rounded text-xs">Ctrl + /</kbd> to show/hide this help.
          </p>
          
          {categories.map((category) => (
            <div key={category} className="mb-6">
              <h3 className="text-purple-400 uppercase text-sm font-semibold mb-2">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h3>
              <div className="bg-dark-700 rounded-lg overflow-hidden">
                <table className="w-full">
                  <tbody>
                    {shortcuts
                      .filter((s) => s.category === category)
                      .map((shortcut) => (
                        <tr key={shortcut.id} className="border-b border-dark-600 last:border-b-0">
                          <td className="py-2 px-4 text-white">{shortcut.label}</td>
                          <td className="py-2 px-4 text-right">
                            <kbd className="px-2 py-1 bg-dark-900 rounded text-xs font-mono">
                              {formatShortcut(shortcut)}
                            </kbd>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShortcutsModal; 