// src/contexts/EditorContext.tsx
import { createContext, useState, useContext, ReactNode } from 'react';

interface EditorContextProps {
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  text: string;
  setText: (text: string) => void;
}

const EditorContext = createContext<EditorContextProps | undefined>(undefined);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [text, setText] = useState('');

  const toggleFocusMode = () => setIsFocusMode((prev) => !prev);

  return (
    <EditorContext.Provider value={{ isFocusMode, toggleFocusMode, text, setText }}>
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