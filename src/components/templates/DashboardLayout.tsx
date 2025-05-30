// src/components/templates/DashboardLayout.tsx
import React from 'react';
import Sidebar from '../organisms/Sidebar';
import Header from '../organisms/Header';
import styles from './DashboardLayout.module.scss';
import { useNavigate } from 'react-router-dom'; // Para navegação baseada em rotas

// Definir o tipo View, pode ser importado de um arquivo compartilhado se usado em múltiplos lugares
type View = 'metrics' | 'style' | 'seo' | 'personalization' | 'help';

interface DashboardLayoutProps {
  children: React.ReactNode;
  // Adicionar initialView se a Sidebar precisar saber qual item destacar
  // com base na rota atual. Isso pode ser mais complexo e envolver useLocation.
  currentViewForSidebar?: View; // Opcional: para destacar item na Sidebar
  headerTitle?: string; // Título para o Header
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, currentViewForSidebar, headerTitle }) => {
  const navigate = useNavigate();

  const handleNavigate = (view: View) => {
    // Mapear 'view' para rotas reais
    switch (view) {
      case 'metrics':
        navigate('/editor/metrics');
        break;
      case 'style':
        navigate('/editor/style');
        break;
      case 'seo':
        navigate('/editor/seo');
        break;
      case 'personalization':
        navigate('/personalization');
        break;
      case 'help':
        navigate('/help');
        break;
      default:
        navigate('/'); // Rota padrão
    }
  };
  
  const handleNavigateToHelp = () => {
    handleNavigate('help');
  };

  return (
    <div className={styles.layout}>
      {/* A Sidebar aqui usará a navegação baseada em rotas.
        O 'initialView' pode ser determinado a partir da rota atual (useLocation)
        para destacar o item correto.
      */}
      <Sidebar onNavigate={handleNavigate} initialView={currentViewForSidebar} />
      <div className={styles.main}>
        <Header 
          title={headerTitle || "Scripty"} // Título padrão se não fornecido
          onHelpButtonClick={handleNavigateToHelp}
        />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;