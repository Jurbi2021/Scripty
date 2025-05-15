import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Toggle from '../atoms/Toggle';
import Text from '../atoms/Text';
import Button from '../atoms/Button';
import styles from './PersonalizationPanel.module.scss';

const PersonalizationPanel: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const handleConfirm = () => {
    alert('Configurações salvas!');
  };

  const handleReset = () => {
    alert('Configurações resetadas!');
  };

  return (
    <div className={styles.panel}>
      <Text size="large" weight="semibold">Configurações do Scripty</Text>
      <div className={styles.option}>
        <Text size="medium">Tema do Scripty</Text>
        <Toggle isOn={theme === 'dark'} onToggle={toggleTheme} />
      </div>
      <div className={styles.actions}>
        <Button onClick={handleConfirm}>Confirmar Alterações</Button>
        <Button onClick={handleReset} variant="secondary">Resetar Tema</Button>
      </div>
    </div>
  );
};

export default PersonalizationPanel;