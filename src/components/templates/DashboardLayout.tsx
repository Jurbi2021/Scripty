// src/components/templates/DashboardLayout.tsx
import React from 'react';
import Sidebar from '../organisms/Sidebar';
import Header from '../organisms/Header';
import styles from './DashboardLayout.module.scss'; //
import { useNavigate, useLocation } from 'react-router-dom';
import { useEditor } from '../../contexts/EditorContext';

type View = 'metrics' | 'style' | 'seo' | 'personalization' | 'help';

interface DashboardLayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
}

const getActiveViewFromPathname = (pathname: string): View => {
  if (pathname.startsWith('/editor/style')) return 'style';
  if (pathname.startsWith('/editor/seo')) return 'seo';
  if (pathname.startsWith('/personalization')) return 'personalization';
  // A rota /help usa HelpCenterLayout, então não será tratada aqui para o DashboardLayout
  if (pathname.startsWith('/editor/metrics') || pathname === '/') return 'metrics';
  return 'metrics'; // Fallback
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, headerTitle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isFocusMode } = useEditor();

  const currentViewForSidebar = getActiveViewFromPathname(location.pathname);

  const handleNavigate = (view: View) => {
    switch (view) {
      case 'metrics': navigate('/editor/metrics'); break;
      case 'style': navigate('/editor/style'); break;
      case 'seo': navigate('/editor/seo'); break;
      case 'personalization': navigate('/personalization'); break;
      case 'help': navigate('/help'); break; // Sidebar ainda pode ter o link de Ajuda
      default: navigate('/');
    }
  };

  const handleNavigateToHelp = () => {
    handleNavigate('help');
  };

  let pageSpecificHeaderTitle = headerTitle;
  if (!pageSpecificHeaderTitle) {
    switch (currentViewForSidebar) {
      case 'metrics': pageSpecificHeaderTitle = "Editor Principal"; break;
      case 'style': pageSpecificHeaderTitle = "Análise de Estilo"; break;
      case 'seo': pageSpecificHeaderTitle = "Análise de SEO"; break;
      case 'personalization': pageSpecificHeaderTitle = "Personalização"; break;
      default: pageSpecificHeaderTitle = "Scripty";
    }
  }

  // Determina se a página atual é uma onde o Modo Foco é relevante e seu botão deve ser mostrado
  const isFocusModeRelevantPage = 
    location.pathname.startsWith('/editor/') || location.pathname === '/';

  return (
    // A classe focusModeActive só é aplicada se for uma página relevante para o modo foco
    <div className={`${styles.layout} ${isFocusMode && isFocusModeRelevantPage ? styles.focusModeActive : ''}`}>
      {/* A Sidebar é oculta se o modo foco estiver ativo E for uma página relevante para o modo foco */}
      {!(isFocusMode && isFocusModeRelevantPage) && (
        <Sidebar
          onNavigate={handleNavigate}
          initialView={currentViewForSidebar}
        />
      )}
      <div className={styles.main}>
        <Header
          title={pageSpecificHeaderTitle}
          onHelpButtonClick={handleNavigateToHelp}
          showFocusModeButton={isFocusModeRelevantPage} // Passa a prop condicionalmente
        />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;