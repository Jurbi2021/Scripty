import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SidebarItem } from '../molecules/SidebarItem';
import Button from '../atoms/Button';
import styles from './Sidebar.module.scss';
import Icon from '../atoms/Icon';

const Sidebar: React.FC = () => {
  // Inicializa o estado com o valor armazenado no localStorage ou true como padrão
  const [isExpanded, setIsExpanded] = useState(() => {
    const savedState = localStorage.getItem('sidebarExpanded');
    return savedState !== null ? JSON.parse(savedState) : true;
  });
  
  const location = useLocation();
  const navigate = useNavigate();

  // Salva o estado no localStorage sempre que ele mudar
  useEffect(() => {
    localStorage.setItem('sidebarExpanded', JSON.stringify(isExpanded));
  }, [isExpanded]);

  const menuItems = [
    { icon: 'editor', label: 'Editor de Texto', path: '/editor/metrics' },
    { icon: 'style', label: 'Análise de Estilo', path: '/editor/style' },
    { icon: 'seo', label: 'Análise de SEO', path: '/editor/seo' },
    { icon: 'personalize', label: 'Personalizar', path: '/personalization' },
    { icon: 'help', label: 'Central de Ajuda', path: '/help' },
  ];

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  return (
    <div className={`${styles.sidebar} ${isExpanded ? '' : styles.collapsed}`}>
      <Button onClick={toggleSidebar} className={styles.toggleButton}>
        <span className={`${styles.toggleArrow} ${isExpanded ? '' : styles.rotated}`}>
        <Icon name="arrow" />
        </span>
      </Button>
      <div className={styles.menu}>
        {menuItems.map((item) => (
          <SidebarItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            isActive={location.pathname === item.path}
            isCollapsed={!isExpanded}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
