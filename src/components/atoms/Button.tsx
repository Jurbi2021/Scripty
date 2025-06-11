// src/components/atoms/Button.tsx
import React from 'react';
import { motion, MotionProps } from 'framer-motion'; // Importar MotionProps
import styles from './Button.module.scss';

// Estender as props do HTMLButtonElement para incluir todas as props de botão nativas
// e adicionar as da Framer Motion que queremos expor ou usar.
type ButtonAtomProps = React.ButtonHTMLAttributes<HTMLButtonElement> & MotionProps & {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  // disabled já vem de HTMLButtonElement
  // type já vem de HTMLButtonElement
  // onClick já vem de HTMLButtonElement
  className?: string; // Manter className para personalização externa
};

const Button: React.FC<ButtonAtomProps> = ({
  children,
  variant = 'primary',
  disabled = false,
  type = 'button',
  className = '',
  onClick,
  ...rest // Captura outras props HTML e MotionProps
}) => {
  const motionProps = !disabled ? {
    whileHover: { scale: 1.03, y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
    whileTap: { scale: 0.97, y: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
    transition: { type: "spring" as const, stiffness: 380, damping: 15 } // Ajuste leve na rigidez/amortecimento
  } : {};

  return (
    <motion.button
      className={`${styles.button} ${styles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...motionProps} // Aplicar props de animação condicionalmente
      {...rest}       // Aplicar quaisquer outras props passadas
    >
      {children}
    </motion.button>
  );
};

export default Button;