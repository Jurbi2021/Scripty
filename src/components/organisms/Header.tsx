import React from 'react';
import styles from './Header.module.scss';

interface HeaderProps {
  // Props can be added later, e.g., for dynamic titles or button actions
}

const Header: React.FC<HeaderProps> = () => {
  // Determine which buttons to show based on context (e.g., current page)
  // For now, showing placeholders based on wireframes
  const showFocusButton = true; // Example logic
  const showBackButton = false; // Example logic

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        {/* Placeholder for Logo or dynamic title based on context */}
        {/* <img src="/path/to/logo.png" alt="Scripty Logo" className={styles.logo} /> */}
        {/* <span className={styles.title}>Editor Scripty</span> */}
      </div>
      <div className={styles.rightSection}>
        {showFocusButton && (
          <button className={`${styles.button} ${styles.focusButton}`}>
            Ativar/Desativar Modo Foco
          </button>
        )}
        {showBackButton && (
          <button className={`${styles.button} ${styles.backButton}`}>
            Voltar para o editor
          </button>
        )}
        <button className={`${styles.button} ${styles.helpButton}`}>
          Abrir Ajuda
        </button>
      </div>
    </header>
  );
};

export default Header;

