// src/components/atoms/Toast.tsx - Corrigido
import React from 'react'; // remover useEffect daqui
import { motion } from 'framer-motion';
import styles from './Toast.module.scss';

export interface ToastProps {
  message: string;
  // A prop 'show' não é mais necessária aqui, pois é controlada pelo AnimatePresence no Header
  onDismiss: () => void;
  type?: 'success' | 'error';
}

const Toast: React.FC<ToastProps> = ({ message, onDismiss, type = 'success' }) => {
  
  return (
    <motion.div 
      className={`${styles.toast} ${type === 'error' ? styles.toastError : styles.toastSuccess}`}
      initial={{ opacity: 0, y: 20, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: 20, x: '-50%' }}
      style={{ position: 'fixed', bottom: '30px', left: '50%', zIndex: 2000 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {message}
      <button onClick={onDismiss} className={styles.toastClose}>×</button>
    </motion.div>
  );
};

export default Toast;