// src/components/templates/MainLayout.tsx
import React from 'react';
import styles from './MainLayout.module.scss';
import Sidebar from '../organisms/Sidebar';
import Header from '../organisms/Header';

type View = 'metrics' | 'style' | 'seo' | 'accessibility' | 'personalization' | 'help';

interface MainLayoutProps {
  children: React.ReactNode;
  onNavigate: (view: View) => void;
  initialView?: View;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, onNavigate, initialView }) => {
  
  const handleNavigateToHelp = () => {
    onNavigate('help');
  };

  let headerTitle = "Scripty Editor";
  if (initialView) {
    if (initialView === 'metrics') headerTitle = "Editor Principal";
    else if (initialView === 'style') headerTitle = "Análise de Estilo";
    else if (initialView === 'seo') headerTitle = "Análise de SEO";
    else if (initialView === 'accessibility') headerTitle = "Análise de Acessibilidade";
    else if (initialView === 'personalization') headerTitle = "Personalização";
    else if (initialView === 'help') headerTitle = "Central de Ajuda";
  }

  return (
    <div className={styles.layout}>
      <Sidebar onNavigate={onNavigate} initialView={initialView} />
      <div className={styles.mainContent}>
        <Header
          title={headerTitle}
          onHelpButtonClick={handleNavigateToHelp}
        />
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;