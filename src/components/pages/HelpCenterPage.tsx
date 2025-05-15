import React from 'react';
import HelpCenterLayout from '../templates/HelpCenterLayout';
import Toggle from '../atoms/Toggle';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './HelpCenterPage.module.scss';

const HelpCenterPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <HelpCenterLayout>
      <div className={styles.page}>
        <h1>Central de Ajuda</h1>
        <Toggle
          isOn={theme === 'dark'}
          onToggle={toggleTheme}
        />
        <p>Aqui você encontra ajuda para usar o Scripty.</p>
      </div>
    </HelpCenterLayout>
  );
};

export default HelpCenterPage;