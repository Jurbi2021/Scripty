// src/components/templates/HelpCenterLayout.tsx
import React from 'react';
import Header from '../organisms/Header';
import styles from './HelpCenterLayout.module.scss';
import { useNavigate } from 'react-router-dom';

// Interface para os itens do sumário
export interface TableOfContentsItem {
  id: string;
  title: string;
  level?: number; // Para indentação, se necessário
}

interface HelpCenterLayoutProps {
  children: React.ReactNode;
  tableOfContents?: TableOfContentsItem[]; // Opcional, para passar os itens do sumário
}

const HelpCenterLayout: React.FC<HelpCenterLayoutProps> = ({ children, tableOfContents }) => {
  const navigate = useNavigate();

  const handleNavigateBack = () => {
    navigate('/'); // Navega para a página inicial (EditorMetricsPage)
  };

  const handleTocClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Opcional: atualizar a URL com o hash sem recarregar a página
      // window.history.pushState(null, "", `#${id}`);
    }
  };

  return (
    <div className={styles.helpLayout}> {/* Classe principal do layout */}
      <Header
        title="Central de Ajuda"
        showBackButton={true}
        onBackButtonClick={handleNavigateBack}
      />
      <div className={styles.contentWrapper}> {/* Wrapper para sumário e conteúdo */}
        {tableOfContents && tableOfContents.length > 0 && (
          <aside className={styles.tableOfContents}>
            <nav>
              <Text as="h3" size="medium" weight="semibold" className={styles.tocTitle}>Nesta Página</Text>
              <ul>
                {tableOfContents.map((item) => (
                  <li key={item.id} className={item.level === 2 ? styles.tocItemLevel2 : styles.tocItem}>
                    <a href={`#${item.id}`} onClick={(e) => handleTocClick(e, item.id)}>
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}
        <main className={styles.mainContentArea}> {/* Conteúdo principal da ajuda */}
          {children}
        </main>
      </div>
    </div>
  );
};

// Adicionar um componente Text simples se não quiser importar o átomo global aqui,
// ou certifique-se que o Text atom global é importado corretamente.
// Para simplificar, vou assumir que você tem um componente Text acessível ou o ajustará.
// Exemplo de Text simples (se não for importar o átomo):
const Text: React.FC<{children: React.ReactNode, as?: any, size?:string, weight?:string, className?:string}> = ({children, as: Component = 'p', className=""}) => (
    <Component className={className}>{children}</Component>
)


export default HelpCenterLayout;