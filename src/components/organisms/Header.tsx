// src/components/organisms/Header.tsx
import React from 'react';
import styles from './Header.module.scss'; //
import { useEditor } from '../../contexts/EditorContext'; //
import { FaLightbulb, FaQuestionCircle, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackButtonClick?: () => void;
  onHelpButtonClick?: () => void;
  showFocusModeButton?: boolean; // Nova prop para controlar a visibilidade do botão
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackButtonClick,
  onHelpButtonClick,
  showFocusModeButton = true, // Por padrão, o botão é visível
}) => {
  const { isFocusMode, toggleFocusMode } = useEditor();
  const focusButtonText = isFocusMode ? "Desativar Foco" : "Modo Foco";

  const buttonVariants = {
    rest: { scale: 1, opacity: 0.9 },
    hover: { scale: 1.05, opacity: 1, transition: { duration: 0.2 } },
    tap: { scale: 0.95 }
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        {showBackButton && (
          <motion.button
            className={`${styles.button} ${styles.iconButton}`}
            onClick={onBackButtonClick}
            variants={buttonVariants} initial="rest" whileHover="hover" whileTap="tap"
            aria-label="Voltar"
          >
            <FaArrowLeft />
          </motion.button>
        )}
        {title && <h1 className={styles.title}>{title}</h1>}
        {!title && !showBackButton && <div className={styles.logoPlaceholder}></div>}
      </div>
      <div className={styles.rightSection}>
        {/* Renderiza o botão de Modo Foco apenas se showFocusModeButton for true */}
        {showFocusModeButton && (
          <motion.button
            className={`${styles.button} ${styles.focusButton} ${isFocusMode ? styles.focusActive : ''}`}
            onClick={toggleFocusMode}
            variants={buttonVariants} initial="rest" whileHover="hover" whileTap="tap"
          >
            <FaLightbulb className={styles.buttonIcon} />
            {focusButtonText}
          </motion.button>
        )}

        {onHelpButtonClick && (
            <motion.button
              className={`${styles.button} ${styles.iconButton}`}
              onClick={onHelpButtonClick}
              variants={buttonVariants} initial="rest" whileHover="hover" whileTap="tap"
              aria-label="Ajuda"
            >
                <FaQuestionCircle />
            </motion.button>
        )}
      </div>
    </header>
  );
};

export default Header;