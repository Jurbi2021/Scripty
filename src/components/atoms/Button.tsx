// src/components/atoms/Button.tsx
import React from 'react';
import { motion } from 'framer-motion' // Adicionado Framer Motion
import styles from './Button.module.scss';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  className = '',
}) => {
  return (
    <motion.button
      className={`${styles.button} ${styles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      whileHover={!disabled ? { scale: 1.03, y: -2, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" } : {}} // Efeito de elevação e sombra no hover
      whileTap={!disabled ? { scale: 0.97, y: 0 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }} // Transição mais elástica
    >
      {children}
    </motion.button>
  );
};

export default Button;