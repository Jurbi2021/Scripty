import React from 'react';
import styles from './PersonalizationPanel.module.scss';

const PersonalizationPanel: React.FC = () => {
  return (
    <div className={styles.personalizationContainer}>
      <div className={styles.settingsSection}>
        <h2>Configurações do Scripty</h2>
        {/* Placeholder for settings toggles */}
        <div className={styles.settingItem}>Funcionalidade 1 (Toggle)</div>
        <div className={styles.settingItem}>Funcionalidade 2</div>
        <div className={styles.settingItem}>Funcionalidade 3</div>
        <div className={styles.settingItem}>Funcionalidade 4</div>
        <div className={styles.settingItem}>Funcionalidade 5</div>
        <div className={styles.settingItem}>Funcionalidade 6</div>
        <div className={styles.settingItem}>Funcionalidade 7</div>
        <div className={styles.settingItem}>Funcionalidade 8</div>
        <button className={styles.confirmButton}>Confirmar Alterações</button>
      </div>
      <div className={styles.themeSection}>
        <h2>Tema do Scripty</h2>
        {/* Placeholder for theme options */}
        <div className={styles.themeOption}>Personalizar Tema Central</div>
        <div className={styles.themeOption}>Personalizar Tema Editor</div>
        <div className={styles.themeOption}>Personalizar Modo Escuro</div>
        <div className={styles.themeOption}>Personalizar Cards - Métrica de Texto</div>
        <button className={styles.confirmButton}>Confirmar Alterações</button>
        <button className={`${styles.resetButton} ${styles.confirmButton}`}>Resetar Alterações de Tema</button>
      </div>
    </div>
  );
};

export default PersonalizationPanel;

