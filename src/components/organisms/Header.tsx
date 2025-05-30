// src/components/organisms/Header.tsx
import React from 'react';
import styles from './Header.module.scss'; //
import { useEditor } from '../../contexts/EditorContext'; // Corrigido e caminho verificado
import { useTheme } from '../../contexts/ThemeContext'; // Para saber o tema atual para os botões, se necessário
import { FaLightbulb, FaQuestionCircle, FaArrowLeft } from 'react-icons/fa' // Ícones para os botões
import { motion } from 'framer-motion'

interface HeaderProps {
  title?: string; // Título opcional para o header
  showBackButton?: boolean; // Controlar visibilidade do botão voltar
  onBackButtonClick?: () => void;
  onHelpButtonClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false, //
  onBackButtonClick,
  onHelpButtonClick,
}) => {
  const { isFocusMode, toggleFocusMode } = useEditor();
  const { theme } = useTheme(); // Para estilizar ícones/botões com base no tema se necessário

  // Determinar qual texto/ícone mostrar para o botão de foco
  const focusButtonText = isFocusMode ? "Desativar Foco" : "Modo Foco";
  // const FocusIcon = isFocusMode ? FaLightbulbSlash : FaLightbulb; // Exemplo se quiser trocar ícone

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
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            aria-label="Voltar"
          >
            <FaArrowLeft />
          </motion.button>
        )}
        {title && <h1 className={styles.title}>{title}</h1>}
        {!title && !showBackButton && <div className={styles.logoPlaceholder}></div> /* Espaço reservado para logo se não houver título nem botão voltar */}
      </div>
      <div className={styles.rightSection}>
        <motion.button
          className={`${styles.button} ${styles.focusButton} ${isFocusMode ? styles.focusActive : ''}`}
          onClick={toggleFocusMode}
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
        >
          <FaLightbulb className={styles.buttonIcon} />
          {focusButtonText}
        </motion.button>

        {onHelpButtonClick && (
            <motion.button
            className={`${styles.button} ${styles.iconButton}`}
            onClick={onHelpButtonClick}
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
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