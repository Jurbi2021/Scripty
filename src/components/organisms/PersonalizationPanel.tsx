import React from 'react';
import styles from './PersonalizationPanel.module.scss'; //
import { motion } from 'framer-motion'
// Importar o átomo Button se for usar para os botões de ação
// import Button from '../atoms/Button';

const PersonalizationPanel: React.FC = () => {

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i:number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" }
    })
  };

  return (
    <div className={styles.personalizationContainer}>
      <motion.div
        className={styles.settingsSection}
        custom={0}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h2>Configurações do Scripty</h2>
        {/* Placeholder para settings toggles */}
        <div className={styles.settingItem}>Funcionalidade 1 (Toggle)</div>
        {/* ... mais itens ... */}
        <motion.button
            className={styles.confirmButton} //
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.98 }}
        >
            Confirmar Alterações
        </motion.button>
      </motion.div>

      <motion.div
        className={styles.themeSection}
        custom={1}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h2>Tema do Scripty</h2>
        {/* Placeholder para theme options */}
        <div className={styles.themeOption}>Personalizar Tema Central</div>
        <div className={styles.themeOption}>Personalizar Tema Editor</div>
        <div className={styles.themeOption}>Personalizar Modo Escuro</div>
        <div className={styles.themeOption}>Personalizar Cards - Métrica de Texto</div>
        <motion.button
            className={styles.confirmButton} //
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.98 }}
        >
            Confirmar Alterações
        </motion.button>
        <motion.button
            className={`${styles.resetButton} ${styles.confirmButton}`} //
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.98 }}
        >
            Resetar Alterações de Tema
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PersonalizationPanel;
