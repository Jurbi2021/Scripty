// src/App.tsx
import React, { useState } from 'react';
import './App.css'; //
import MainLayout from './components/templates/MainLayout';
import EditorWithMetrics from './components/organisms/EditorWithMetrics';
import EditorWithStyle from './components/organisms/EditorWithStyle';
import EditorWithSEO from './components/organisms/EditorWithSEO';
import PersonalizationPageContent from './components/pages/PersonalizationPage'; // Exemplo se quiser integrar
import HelpCenterPageContent from './components/pages/HelpCenterPage';     // Exemplo se quiser integrar

import { motion, AnimatePresence } from 'framer-motion';
import { EditorProvider } from './contexts/EditorContext'; // Verifique se já está no main.tsx
import { ThemeProvider } from './contexts/ThemeContext';   // Verifique se já está no main.tsx


type View = 'metrics' | 'style' | 'seo' | 'personalization' | 'help';

// Se ThemeProvider e EditorProvider já estão no main.tsx, não precisa deles aqui.
// Caso contrário, envolva o App com eles. Assumindo que estão no main.tsx por agora.

function App() {
  const [currentView, setCurrentView] = useState<View>('metrics'); //

  const handleNavigate = (view: View) => { //
    // Implementar lógica para outras views se desejar
    if (view === 'metrics' || view === 'style' || view === 'seo' || view === 'personalization' || view === 'help') {
      setCurrentView(view);
    } else {
      console.warn(`Navigation to view "${view}" is not fully implemented yet.`);
    }
  };

  const pageVariants = {
    initial: {
      opacity: 0,
      x: "-5vw", // Entra da esquerda
    },
    in: {
      opacity: 1,
      x: 0,
    },
    out: {
      opacity: 0,
      x: "5vw", // Sai para a direita
    }
  };

  const pageTransition = {
    type: "tween", // Ou "spring"
    ease: "anticipate", // Um easing suave
    duration: 0.4
  };

  const renderPage = () => {
    let pageComponent;
    switch (currentView) {
      case 'metrics':
        pageComponent = <EditorWithMetrics />;
        break;
      case 'style':
        pageComponent = <EditorWithStyle />;
        break;
      case 'seo':
        pageComponent = <EditorWithSEO />;
        break;
      // case 'personalization': // Estas páginas usam DashboardLayout/HelpCenterLayout.
      //   pageComponent = <PersonalizationPageContent />; // O componente de conteúdo, não a página inteira com layout.
      //   break;                                       // Ou você precisaria ajustar o MainLayout para lidar com elas.
      // case 'help':
      //   pageComponent = <HelpCenterPageContent />;
      //   break;
      default:
        pageComponent = <EditorWithMetrics />;
    }
    // Envolver o componente da página com motion.div para a animação
    return (
      <motion.div
        key={currentView} // Importante para AnimatePresence saber qual filho mudou
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        style={{ width: '100%', height: '100%' }} // Garantir que o motion.div ocupe o espaço
      >
        {pageComponent}
      </motion.div>
    );
  };

  return (
    // Se ThemeProvider e EditorProvider não estiverem no main.tsx, adicione-os aqui:
    // <ThemeProvider>
    //   <EditorProvider>
        <MainLayout onNavigate={handleNavigate} initialView={currentView}>
          <AnimatePresence mode="wait"> {/* mode="wait" garante que uma página saia antes da outra entrar */}
            {renderPage()}
          </AnimatePresence>
        </MainLayout>
    //   </EditorProvider>
    // </ThemeProvider>
  );
}

export default App;