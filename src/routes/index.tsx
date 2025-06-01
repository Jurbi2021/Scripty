// src/routes/index.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import EditorMetricsPage from '../components/pages/EditorMetricsPage';
import EditorStylePage from '../components/pages/EditorStylePage';
import EditorSEOPage from '../components/pages/EditorSEOPage';
import HelpCenterPage from '../components/pages/HelpCenterPage';
import PersonalizationPage from '../components/pages/PersonalizationPage';

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
  type: "tween",
  ease: "anticipate",
  duration: 0.4
};

// Componente interno para usar useLocation
const AnimatedRoutes: React.FC = () => {
  const location = useLocation(); // Hook para obter a localização atual

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/editor/metrics"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              style={{ width: '100%', height: '100%' }}
            >
              <EditorMetricsPage />
            </motion.div>
          }
        />
        <Route
          path="/editor/style"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              style={{ width: '100%', height: '100%' }}
            >
              <EditorStylePage />
            </motion.div>
          }
        />
        <Route
          path="/editor/seo"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              style={{ width: '100%', height: '100%' }}
            >
              <EditorSEOPage />
            </motion.div>
          }
        />
        <Route
          path="/help"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              style={{ width: '100%', height: '100%' }}
            >
              <HelpCenterPage />
            </motion.div>
          }
        />
        <Route
          path="/personalization"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              style={{ width: '100%', height: '100%' }}
            >
              <PersonalizationPage />
            </motion.div>
          }
        />
        <Route
          path="/"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              style={{ width: '100%', height: '100%' }}
            >
              <EditorMetricsPage /> {/* Página padrão */}
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const AppRoutes: React.FC = () => (
  <Router>
    <AnimatedRoutes />
  </Router>
);

export default AppRoutes;