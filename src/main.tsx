// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ThemeProvider } from './contexts/ThemeContext';
import { EditorProvider } from './contexts/EditorContext';
import { ContentProfileProvider } from './contexts/ContentProfileContext';
import { ToastProvider } from './contexts/ToastContext'; // Adicionar esta importação
import ToastContainer from './components/organisms/ToastContainer'; // Adicionar esta importação

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ContentProfileProvider>
        <EditorProvider>
          <ToastProvider> {/* Adicionar ToastProvider aqui */}
            <App />
            <ToastContainer /> {/* Adicionar ToastContainer aqui */}
          </ToastProvider>
        </EditorProvider>
      </ContentProfileProvider>
    </ThemeProvider>
  </StrictMode>,
);
