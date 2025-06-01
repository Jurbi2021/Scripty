// src/contexts/EditorContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { ScriptyPreferences, defaultScriptyPreferences } from '../utils/preferences';

interface EditorContextProps {
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  text: string;
  setText: (text: string) => void;
  preferences: ScriptyPreferences;
  updatePreferences: (newPreferences: Partial<ScriptyPreferences>) => void; // Para atualizações parciais
  resetPreferences: () => void;
}

const EditorContext = createContext<EditorContextProps | undefined>(undefined);

const LOCAL_STORAGE_PREFERENCES_KEY = 'scriptyPreferences';

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [text, setText] = useState('');
  const [preferences, setPreferences] = useState<ScriptyPreferences>(() => {
    const storedPrefs = localStorage.getItem(LOCAL_STORAGE_PREFERENCES_KEY);
    return storedPrefs ? JSON.parse(storedPrefs) : defaultScriptyPreferences;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFERENCES_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const toggleFocusMode = () => setIsFocusMode((prev) => !prev);

  const updatePreferences = (newPrefs: Partial<ScriptyPreferences>) => {
    setPreferences(prev => ({
      ...prev,
      ...newPrefs,
      // Para objetos aninhados, pode ser necessário um merge mais profundo
      // Exemplo para toolbar:
      toolbar: newPrefs.toolbar ? { ...prev.toolbar, ...newPrefs.toolbar } : prev.toolbar,
      advancedMetrics: newPrefs.advancedMetrics ? { ...prev.advancedMetrics, ...newPrefs.advancedMetrics } : prev.advancedMetrics,
      styleAnalysis: newPrefs.styleAnalysis ? { ...prev.styleAnalysis, ...newPrefs.styleAnalysis } : prev.styleAnalysis,
      seoAnalysis: newPrefs.seoAnalysis ? { ...prev.seoAnalysis, ...newPrefs.seoAnalysis } : prev.seoAnalysis,
    }));
  };

  const resetPreferences = () => {
    setPreferences(defaultScriptyPreferences);
  };

  return (
    <EditorContext.Provider value={{
      isFocusMode,
      toggleFocusMode,
      text,
      setText,
      preferences,
      updatePreferences,
      resetPreferences
    }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = (): EditorContextProps => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor deve ser usado dentro de um EditorProvider');
  }
  return context;
};