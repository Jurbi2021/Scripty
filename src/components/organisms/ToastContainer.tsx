// src/components/organisms/ToastContainer.tsx
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast from '../atoms/Toast';
import { useToast } from '../../contexts/ToastContext';
import styles from './ToastContainer.module.scss';

const ToastContainer: React.FC = () => {
  const { toasts, hideToast } = useToast();

  return (
    <div className={styles.toastContainer}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onDismiss={() => hideToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
