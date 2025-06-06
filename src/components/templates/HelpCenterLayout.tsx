// src/components/templates/HelpCenterLayout.tsx
import React from 'react';
import Header from '../organisms/Header';
import styles from './HelpCenterLayout.module.scss'; //
import { useNavigate } from 'react-router-dom';

interface HelpCenterLayoutProps {
  children: React.ReactNode;
  tableOfContents?: TableOfContentsItem[];
}

const HelpCenterLayout: React.FC<HelpCenterLayoutProps> = ({ children, tableOfContents }) => {
  const navigate = useNavigate();

  const handleNavigateBack = () => {
    navigate('/');
  };

  const handleTocClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Recriando a definição do componente Text localmente se não for importado
  const Text: React.FC<{children: React.ReactNode, as?: any, size?:string, weight?:string, className?:string}> = ({children, as: Component = 'p', className=""}) => (
      <Component className={className}>{children}</Component>
  );

  return (
    <div className={styles.helpLayout}>
      <Header 
        title="Central de Ajuda"
        showBackButton={true}
        onBackButtonClick={handleNavigateBack}
        showFocusModeButton={false} // <<< MUDANÇA APLICADA AQUI
      />
      <div className={styles.contentWrapper}>
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
        <main className={styles.mainContentArea}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default HelpCenterLayout;