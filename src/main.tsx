// src/main.tsx
import { StrictMode } from 'react'; //
import { createRoot } from 'react-dom/client'; //
import './index.css'; // // Certifique-se que App.css ou Global.scss seja importado em App.tsx ou aqui, se necessário.
import App from './App.tsx'; //
import { ThemeProvider } from './contexts/ThemeContext'; // Importar ThemeProvider
import { EditorProvider } from './contexts/EditorContext'; // Importar EditorProvider

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <EditorProvider>
        <App />
      </EditorProvider>
    </ThemeProvider>
  </StrictMode>,
);