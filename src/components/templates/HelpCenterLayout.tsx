// src/components/templates/HelpCenterLayout.tsx
import React from 'react';
import Header from '../organisms/Header'; //
import styles from './HelpCenterLayout.module.scss'; //
import { useNavigate } from 'react-router-dom'; // Para navegação

interface HelpCenterLayoutProps {
  children: React.ReactNode;
}

const HelpCenterLayout: React.FC<HelpCenterLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  // Função para o botão "Voltar para o editor" ou similar que pode estar no Header
  const handleNavigateBack = () => {
    navigate('/'); // Ou para a última página de editor visitada, se você rastrear isso
  };

  return (
    <div className={styles.layout}>
      <Header 
        title="Central de Ajuda"
        showBackButton={true} // Exemplo: Mostrar um botão de voltar
        onBackButtonClick={handleNavigateBack}
        // onHelpButtonClick não faz sentido aqui, pois já estamos na ajuda
      />
      <main className={styles.content}>{children}</main>
    </div>
  );
};

export default HelpCenterLayout;