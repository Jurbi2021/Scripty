// src/components/templates/DashboardLayout.tsx
import React from 'react';
import Sidebar from '../organisms/Sidebar';
import Header from '../organisms/Header';
import styles from './DashboardLayout.module.scss'; //
import { useNavigate, useLocation } from 'react-router-dom';
import { useEditor } from '../../contexts/EditorContext'; // Importar o hook do contexto

type View = 'metrics' | 'style' | 'seo' | 'personalization' | 'help';

interface DashboardLayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
}

const getActiveViewFromPathname = (pathname: string): View => {
  if (pathname.startsWith('/editor/style')) return 'style';
  if (pathname.startsWith('/editor/seo')) return 'seo';
  if (pathname.startsWith('/personalization')) return 'personalization';
  if (pathname.startsWith('/help')) return 'help';
  if (pathname.startsWith('/editor/metrics') || pathname === '/') return 'metrics';
  return 'metrics';
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, headerTitle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isFocusMode } = useEditor(); // Obter o estado do Modo Foco

  const currentViewForSidebar = getActiveViewFromPathname(location.pathname);

  const handleNavigate = (view: View) => {
    // ... (lógica de navegação existente)
    switch (view) {
      case 'metrics': navigate('/editor/metrics'); break;
      case 'style': navigate('/editor/style'); break;
      case 'seo': navigate('/editor/seo'); break;
      case 'personalization': navigate('/personalization'); break;
      case 'help': navigate('/help'); break;
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

  return (
    // Adiciona uma classe condicional ao layout principal quando o Modo Foco está ativo
    <div className={`${styles.layout} ${isFocusMode ? styles.focusModeActive : ''}`}>
      {!isFocusMode && ( // Renderiza a Sidebar apenas se o Modo Foco NÃO estiver ativo
        <Sidebar
          onNavigate={handleNavigate}
          initialView={currentViewForSidebar}
        />
      )}
      <div className={styles.main}> {/* Esta área pode precisar se expandir */}
        <Header
          title={pageSpecificHeaderTitle}
          onHelpButtonClick={handleNavigateToHelp}
          // Poderíamos passar isFocusMode para o Header se quisermos que ele também mude
        />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;