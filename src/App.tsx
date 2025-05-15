// src/App.tsx
import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { EditorProvider } from './contexts/EditorContext';
import Routes from './routes';

const App: React.FC = () => (
  <ThemeProvider>
    <EditorProvider>
      <Routes />
    </EditorProvider>
  </ThemeProvider>
);

export default App;