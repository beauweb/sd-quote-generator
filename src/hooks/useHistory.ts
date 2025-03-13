import { useState, useCallback, useRef } from 'react';

interface UseHistoryOptions {
  maxHistorySize?: number;
}

const DEFAULT_OPTIONS: UseHistoryOptions = {
  maxHistorySize: 50
};

export function useHistory<T>(
  initialState: T, 
  options: UseHistoryOptions = DEFAULT_OPTIONS
) {
  const [index, setIndex] = useState(0);
  const historyRef = useRef<T[]>([initialState]);
  const [, setForceUpdate] = useState(0);
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  const setState = useCallback((
    action: T | ((prev: T) => T)
  ) => {
    const newState = action instanceof Function 
      ? action(historyRef.current[index]) 
      : action;
    
    // Only add to history if state is different
    if (JSON.stringify(newState) !== JSON.stringify(historyRef.current[index])) {
      // Remove any states after current index (discarding alternate future)
      historyRef.current = historyRef.current.slice(0, index + 1);
      
      // Add new state
      historyRef.current.push(newState);
      
      // Trim history if needed
      if (mergedOptions.maxHistorySize && historyRef.current.length > mergedOptions.maxHistorySize) {
        // Keep only the most recent MAX_HISTORY_SIZE states
        historyRef.current = historyRef.current.slice(-mergedOptions.maxHistorySize);
      }
      
      // Update index to point to the new state
      setIndex(historyRef.current.length - 1);
      setForceUpdate(prev => prev + 1);
    }
  }, [index, mergedOptions.maxHistorySize]);

  const undo = useCallback(() => {
    if (index > 0) {
      setIndex(prev => prev - 1);
      setForceUpdate(prev => prev + 1);
    }
  }, [index]);

  const redo = useCallback(() => {
    if (index < historyRef.current.length - 1) {
      setIndex(prev => prev + 1);
      setForceUpdate(prev => prev + 1);
    }
  }, [index]);

  return {
    state: historyRef.current[index],
    setState,
    undo,
    redo,
    canUndo: index > 0,
    canRedo: index < historyRef.current.length - 1
  };
} 