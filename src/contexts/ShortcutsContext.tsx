import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { KeyboardShortcut, ShortcutsContextType } from '../types';

const ShortcutsContext = createContext<ShortcutsContextType | undefined>(undefined);

export const ShortcutsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>([]);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  const registerShortcut = useCallback((shortcut: KeyboardShortcut) => {
    setShortcuts((prevShortcuts) => {
      // Check if shortcut with this ID already exists
      const existingIndex = prevShortcuts.findIndex((s) => s.id === shortcut.id);
      if (existingIndex !== -1) {
        // Replace existing shortcut
        const newShortcuts = [...prevShortcuts];
        newShortcuts[existingIndex] = shortcut;
        return newShortcuts;
      }
      // Add new shortcut
      return [...prevShortcuts, shortcut];
    });
  }, []);

  const unregisterShortcut = useCallback((id: string) => {
    setShortcuts((prevShortcuts) => prevShortcuts.filter((shortcut) => shortcut.id !== id));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if shortcut is triggered in an input, textarea, or select
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        // Allow Ctrl+Z, Ctrl+Y in text controls
        if (
          !(
            (event.ctrlKey && (event.key === 'z' || event.key === 'y')) ||
            // Toggle shortcut help modal
            (event.ctrlKey && event.key === '/')
          )
        ) {
          return;
        }
      }

      // Toggle shortcut help modal with Ctrl+/
      if (event.ctrlKey && event.key === '/') {
        event.preventDefault();
        setShowShortcutsModal((prev) => !prev);
        return;
      }

      // Find matching shortcut
      const matchingShortcut = shortcuts.find(
        (shortcut) =>
          shortcut.key.toLowerCase() === event.key.toLowerCase() &&
          !!shortcut.ctrlKey === event.ctrlKey &&
          !!shortcut.shiftKey === event.shiftKey &&
          !!shortcut.altKey === event.altKey &&
          !!shortcut.metaKey === event.metaKey
      );

      if (matchingShortcut) {
        event.preventDefault();
        matchingShortcut.action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);

  // Register built-in shortcuts
  useEffect(() => {
    registerShortcut({
      id: 'toggle-shortcuts-modal',
      label: 'Show keyboard shortcuts',
      key: '/',
      ctrlKey: true,
      action: () => setShowShortcutsModal((prev) => !prev),
      category: 'general',
      description: 'Show or hide keyboard shortcuts help',
    });
  }, [registerShortcut]);

  return (
    <ShortcutsContext.Provider
      value={{ shortcuts, registerShortcut, unregisterShortcut, showShortcutsModal, setShowShortcutsModal }}
    >
      {children}
    </ShortcutsContext.Provider>
  );
};

export const useShortcuts = (): ShortcutsContextType => {
  const context = useContext(ShortcutsContext);
  if (!context) {
    throw new Error('useShortcuts must be used within a ShortcutsProvider');
  }
  return context;
}; 