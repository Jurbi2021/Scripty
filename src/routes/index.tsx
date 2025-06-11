// src/routes/index.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Importar as Páginas e o novo ProtectedRoute
import EditorMetricsPage from '../components/pages/EditorMetricsPage';
import EditorStylePage from '../components/pages/EditorStylePage';
import EditorSEOPage from '../components/pages/EditorSEOPage';
import HelpCenterPage from '../components/pages/HelpCenterPage';
import PersonalizationPage from '../components/pages/PersonalizationPage';
import LoginPage from '../components/pages/LoginPage';
import RegisterPage from '../components/pages/RegisterPage';
import ProtectedRoute from './ProtectedRoute'; 

const pageVariants = {
  initial: {
    opacity: 0,
    x: "-5vw", 
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: "5vw", 
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4
};

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        {/* --- ROTAS PÚBLICAS --- */}
        {/* Qualquer pessoa pode aceder a estas rotas */}
        <Route
          path="/login"
          element={
            <motion.div 
              style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} 
            >
              <LoginPage />
            </motion.div>
          }
        />
        <Route
          path="/register"
          element={
            <motion.div
              style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            >
              <RegisterPage />
            </motion.div>
            }
        />
        
        {/* --- ROTAS PROTEGIDAS --- */}
        {/* O <ProtectedRoute /> atuará como um "gatekeeper" para todas as rotas aninhadas abaixo dele */}
        <Route element={<ProtectedRoute />}>
          {/* Todas as rotas que precisam de autenticação vêm aqui dentro */}
          
          <Route
            path="/"
            element={ <motion.div style={{ width: '100%', height: '100%' }} variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition} > <EditorMetricsPage /> </motion.div> }
          />
          <Route
            path="/editor/metrics"
            element={ <motion.div style={{ width: '100%', height: '100%' }} variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition} > <EditorMetricsPage /> </motion.div> }
          />
          <Route
            path="/editor/style"
            element={ <motion.div style={{ width: '100%', height: '100%' }} variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition} > <EditorStylePage /> </motion.div> }
          />
          <Route
            path="/editor/seo"
            element={ <motion.div style={{ width: '100%', height: '100%' }} variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition} > <EditorSEOPage /> </motion.div> }
          />
          <Route
            path="/personalization"
            element={ <motion.div style={{ width: '100%', height: '100%' }} variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition} > <PersonalizationPage /> </motion.div> }
          />
           <Route
            path="/help"
            element={ <motion.div style={{ width: '100%', height: '100%' }} variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition} > <HelpCenterPage /> </motion.div> }
          />
        </Route>

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