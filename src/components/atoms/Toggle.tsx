// src/components/atoms/Toggle.tsx
import React from 'react';
import styles from './Toggle.module.scss';
import { motion } from 'framer-motion'; // Adicionar AnimatePresence se quisermos animar algo mais, mas para o thumb o layout é suficiente

interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean; // Adicionar prop disabled
}

const Toggle: React.FC<ToggleProps> = ({
  isOn,
  onToggle,
  className = '',
  ariaLabel = 'Toggle',
  disabled = false, // Default para false
}) => {
  const spring = {
    type: "spring",
    stiffness: 700,
    damping: 35 // Aumentar um pouco o damping para menos oscilação, mas manter a vivacidade
  };

  return (
    <motion.button
      onClick={!disabled ? onToggle : undefined} // Só permite toggle se não estiver desabilitado
      className={`${styles.toggle} ${isOn ? styles.on : styles.off} ${className} ${disabled ? styles.disabled : ''}`}
      aria-pressed={isOn}
      aria-label={ariaLabel}
      type="button"
      disabled={disabled} // Passar disabled para o elemento button
      // Animação sutil no clique, se não estiver desabilitado
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ duration: 0.1 }} // Transição rápida para o tap
      // A cor de fundo já transita bem com CSS, não precisa de Framer Motion aqui
    >
      {/* O motion.span com 'layout' animará a posição do thumb */}
      <motion.span
        className={styles.toggleThumb}
        layout // Importante para animar a mudança de posição baseada na classe pai (.on ou .off)
        transition={spring} // Usa a transição spring definida acima
      />
    </motion.button>
  );
};

export default Toggle;