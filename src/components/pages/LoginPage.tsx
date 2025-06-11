// src/components/pages/LoginPage.tsx
import React from 'react';
import styles from './LoginPage.module.scss';
import LoginForm from '../organisms/LoginForm'; // O formulário que criaremos a seguir
import { motion } from 'framer-motion';

const LoginPage: React.FC = () => {
  return (
    <div className={styles.loginPageContainer}>
      <motion.div
        className={styles.loginPanel}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className={styles.logoContainer}>
          {/* Você pode adicionar o seu logo aqui */}
          <h1 className={styles.logoText}>Scripty</h1>
          <p className={styles.logoSubtitle}>Análise e Refinamento de Texto com IA</p>
        </div>
        <LoginForm />
      </motion.div>
    </div>
  );
};

export default LoginPage;