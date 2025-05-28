import React, { useState } from 'react';
import styles from './Sidebar.module.scss';
import { FaChevronLeft, FaChevronRight, FaEdit, FaPenFancy, FaSearch, FaCog, FaQuestionCircle, FaSun, FaMoon } from 'react-icons/fa'; // Assuming Font Awesome icons

// Define the possible views that the sidebar can navigate to
type View = 'metrics' | 'style' | 'seo' | 'personalization' | 'help'; // Added help

interface SidebarProps {
  onNavigate: (view: View) => void; // Callback to notify App.tsx of navigation
  initialView?: View; // Optional initial view
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, initialView = 'metrics' }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeView, setActiveView] = useState<View>(initialView);
  const [isDarkMode, setIsDarkMode] = useState(true); // Assuming dark mode is default

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // TODO: Implement actual theme switching logic (e.g., adding/removing class on body)
    console.log('Theme toggled, dark mode:', !isDarkMode);
  };

  const handleItemClick = (view: View) => {
    setActiveView(view);
    onNavigate(view);
  };

  const menuItems: { view: View; icon: React.ElementType; label: string }[] = [
    { view: 'metrics', icon: FaEdit, label: 'Editor de Texto' },
    { view: 'style', icon: FaPenFancy, label: 'Análise de Estilo' },
    { view: 'seo', icon: FaSearch, label: 'Análise de SEO' }, // Placeholder
    { view: 'personalization', icon: FaCog, label: 'Personalizar' }, // Placeholder
  ];

  return (
    <aside className={`${styles.sidebar} ${isExpanded ? styles.expanded : styles.collapsed}`}>
      <div className={styles.logoSection}>
        {isExpanded && <span className={styles.logoText}>Scripty</span>}
        <button onClick={handleToggleExpand} className={styles.toggleButton} aria-label={isExpanded ? 'Recolher sidebar' : 'Expandir sidebar'}>
          {isExpanded ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
      </div>

      <nav className={styles.menu}>
        <ul>
          {menuItems.map((item) => (
            <li key={item.view} className={activeView === item.view ? styles.active : ''}>
              <button onClick={() => handleItemClick(item.view)}>
                <item.icon className={styles.icon} />
                {isExpanded && <span className={styles.label}>{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.footer}>
        <div className={`${styles.menuItem} ${activeView === 'help' ? styles.active : ''}`}>
           <button onClick={() => handleItemClick('help')}> {/* Placeholder for help */} 
            <FaQuestionCircle className={styles.icon} />
            {isExpanded && <span className={styles.label}>Central de Ajuda</span>}
          </button>
        </div>
        <div className={styles.themeToggle}>
          {isExpanded && <span className={styles.label}>{isDarkMode ? 'Modo Escuro' : 'Modo Claro'}</span>}
          <button onClick={handleToggleTheme} className={styles.toggleThemeButton} aria-label="Mudar tema">
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

