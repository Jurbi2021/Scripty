// src/components/atoms/Toggle.tsx
import React from 'react';
import styles from './Toggle.module.scss'; // Importar styles module

interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
  className?: string;
  // Adicionar aria-label para acessibilidade
  ariaLabel?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  isOn,
  onToggle,
  className = '',
  ariaLabel = 'Toggle' // Default aria-label
}) => {
  return (
    <button
      onClick={onToggle}
      className={`${styles.toggle} ${isOn ? styles.on : styles.off} ${className}`} // Usar classes do module
      aria-pressed={isOn}
      aria-label={ariaLabel} // Adicionado aria-label
      type="button" // Adicionar type para botões
    >
      <span className={styles.toggleThumb} />
    </button>
  );
};

export default Toggle;