// src/components/atoms/Toast.tsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Toast.module.scss'; // Estilos específicos para o Toast

export interface ToastProps { // Exportar a interface para que possa ser usada em outros lugares se necessário
  message: string;
  show: boolean;
  onDismiss: () => void;
  type?: 'success' | 'error';
}

const Toast: React.FC<ToastProps> = ({ message, show, onDismiss, type = 'success' }) => {
  // O useEffect para auto-dismiss foi mantido, mas a lógica principal de timeout está
  // na função displayToast do Header.tsx. Este useEffect pode ser simplificado ou
  // ajustado se o Toast precisar de mais autonomia para se fechar.
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    // Se precisar que o Toast se feche sozinho APÓS um tempo a partir do momento em que é exibido,
    // e não apenas controlado externamente pelo `show` prop:
    // if (show) {
    //   timerId = setTimeout(() => {
    //     onDismiss();
    //   }, 5000); // Ex: 5 segundos, idealmente seria uma prop `duration`
    // }
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [show, onDismiss /*, duration */]); // Adicione duration se o timeout for interno

  if (!show) { // Se show for false, não renderiza nada (AnimatePresence no Header cuida da animação de saída)
    return null;
  }

  return (
    <motion.div 
      className={`${styles.toast} ${type === 'error' ? styles.toastError : styles.toastSuccess}`}
      initial={{ opacity: 0, y: 20, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      // exit é tratado pelo AnimatePresence no Header
      style={{ position: 'fixed', bottom: '20px', left: '50%', zIndex: 2000 }} // Estilos de posicionamento
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {message}
      <button onClick={onDismiss} className={styles.toastClose}>×</button>
    </motion.div>
  );
};

export default Toast;