// src/components/templates/DashboardLayout.tsx
import React, { useState, useEffect } from 'react'; // <<< MUDANÇA AQUI: Adicionado useState e useEffect
import Sidebar from '../organisms/Sidebar';
import Header from '../organisms/Header';
import styles from './DashboardLayout.module.scss';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEditor } from '../../contexts/EditorContext';
import WelcomeModal from '../organisms/WelcomeModal'; // Importar o modal de boas-vindas

type View = 'metrics' | 'style' | 'seo' | 'accessibility' | 'personalization' | 'help';

interface DashboardLayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
}

const getActiveViewFromPathname = (pathname: string): View => {
  if (pathname.startsWith('/editor/style')) return 'style';
  if (pathname.startsWith('/editor/seo')) return 'seo';
  if (pathname.startsWith('/editor/accessibility')) return 'accessibility';
  if (pathname.startsWith('/personalization')) return 'personalization';
  if (pathname.startsWith('/help')) return 'help';
  if (pathname.startsWith('/editor/metrics') || pathname === '/') return 'metrics';
  return 'metrics'; // Fallback
};

const WELCOME_MODAL_SEEN_KEY = 'scriptyWelcomeModalSeen';

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, headerTitle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isFocusMode } = useEditor();

  // --- LÓGICA PARA O MODAL DE BOAS-VINDAS ---
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);

  useEffect(() => {
    const hasSeenModal = localStorage.getItem(WELCOME_MODAL_SEEN_KEY);
    if (!hasSeenModal) {
      setIsWelcomeModalOpen(true);
    }
  }, []); // Roda apenas uma vez na montagem

  const handleCloseWelcomeModal = () => {
    setIsWelcomeModalOpen(false);
    localStorage.setItem(WELCOME_MODAL_SEEN_KEY, 'true');
  };
  // ------------------------------------------

  const currentViewForSidebar = getActiveViewFromPathname(location.pathname);

  const handleNavigate = (view: View) => {
    switch (view) {
      case 'metrics': navigate('/editor/metrics'); break;
      case 'style': navigate('/editor/style'); break;
      case 'seo': navigate('/editor/seo'); break;
      case 'accessibility': navigate('/editor/accessibility'); break;
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
      case 'accessibility': pageSpecificHeaderTitle = "Análise de Acessibilidade"; break;
      case 'personalization': pageSpecificHeaderTitle = "Personalização"; break;
      default: pageSpecificHeaderTitle = "Scripty";
    }
  }

  const isEditorPage = location.pathname.startsWith('/editor/') || location.pathname === '/';

  return (
    <div className={`${styles.layout} ${isFocusMode && isEditorPage ? styles.focusModeActive : ''}`}>
      {!(isFocusMode && isEditorPage) && (
        <Sidebar
          onNavigate={handleNavigate}
          initialView={currentViewForSidebar}
        />
      )}
      <div className={styles.main}>
        <Header
          title={pageSpecificHeaderTitle}
          onHelpButtonClick={handleNavigateToHelp}
          showFocusModeButton={isEditorPage}
          showAIPromptButton={isEditorPage}
        />
        <main className={styles.content}>{children}</main>
      </div>

      <WelcomeModal isOpen={isWelcomeModalOpen} onClose={handleCloseWelcomeModal} />
    </div>
  );
};

export default DashboardLayout;