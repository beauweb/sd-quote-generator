import { useState, useCallback, useRef } from 'react';

interface EditorState<T> {
  data: T;
  cursorPosition?: {
    start: number;
    end: number;
  };
}

export function useHistory<T>(initialState: T) {
  const [index, setIndex] = useState(0);
  const historyRef = useRef<EditorState<T>[]>([{ data: initialState }]);
  const [, setForceUpdate] = useState(0);

  const setState = useCallback((
    action: T | ((prev: T) => T),
    cursorPosition?: { start: number; end: number }
  ) => {
    const newState = action instanceof Function 
      ? action(historyRef.current[index].data) 
      : action;
    
    // Only add to history if state is different
    if (JSON.stringify(newState) !== JSON.stringify(historyRef.current[index].data)) {
      historyRef.current = historyRef.current.slice(0, index + 1);
      historyRef.current.push({ 
        data: newState, 
        cursorPosition 
      });
      setIndex(historyRef.current.length - 1);
      setForceUpdate(prev => prev + 1);
    }
  }, [index]);

  const undo = useCallback(() => {
    if (index > 0) {
      setIndex(prev => prev - 1);
      setForceUpdate(prev => prev + 1);
      return historyRef.current[index - 1].cursorPosition;
    }
  }, [index]);

  const redo = useCallback(() => {
    if (index < historyRef.current.length - 1) {
      setIndex(prev => prev + 1);
      setForceUpdate(prev => prev + 1);
      return historyRef.current[index + 1].cursorPosition;
    }
  }, [index]);

  return {
    state: historyRef.current[index].data,
    setState,
    undo,
    redo,
    canUndo: index > 0,
    canRedo: index < historyRef.current.length - 1,
    resetHistory: (newInitialState: T) => {
      historyRef.current = [{ data: newInitialState }];
      setIndex(0);
      setForceUpdate(prev => prev + 1);
    }
  };
} 