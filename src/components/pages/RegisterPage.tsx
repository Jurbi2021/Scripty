// src/components/pages/RegisterPage.tsx
import React from 'react';
// Reutilizando os estilos da LoginPage para manter a consistência visual
import styles from './LoginPage.module.scss'; 
import RegisterForm from '../organisms/RegisterForm'; // O formulário que criaremos a seguir
import { motion } from 'framer-motion';

const RegisterPage: React.FC = () => {
  return (
    <div className={styles.loginPageContainer}>
      <motion.div
        className={styles.loginPanel}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className={styles.logoContainer}>
          <h1 className={styles.logoText}>Criar Conta no Scripty</h1>
          <p className={styles.logoSubtitle}>Comece a analisar e refinar seus textos agora mesmo.</p>
        </div>
        <RegisterForm />
      </motion.div>
    </div>
  );
};

export default RegisterPage;