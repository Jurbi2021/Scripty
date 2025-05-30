// src/components/organisms/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import styles from './Sidebar.module.scss';
import { FaChevronLeft, FaChevronRight, FaEdit, FaPenFancy, FaSearch, FaCog, FaQuestionCircle, FaSun, FaMoon } from 'react-icons/fa';
import { SidebarItem } from '../molecules/SidebarItem'; // Verifique se o caminho está correto para sua molécula
import { useTheme } from '../../contexts/ThemeContext'; // Verifique se o caminho está correto
import { motion, AnimatePresence } from 'framer-motion';

type View = 'metrics' | 'style' | 'seo' | 'personalization' | 'help'; //

interface SidebarProps {
  onNavigate: (view: View) => void; //
  initialView?: View; //
}

const menuItems: { view: View; icon: React.ElementType; label: string }[] = [ //
  { view: 'metrics', icon: FaEdit, label: 'Editor de Texto' }, //
  { view: 'style', icon: FaPenFancy, label: 'Análise de Estilo' }, //
  { view: 'seo', icon: FaSearch, label: 'Análise de SEO' }, //
  { view: 'personalization', icon: FaCog, label: 'Personalizar' }, //
];

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, initialView = 'metrics' }) => {
  const [isExpanded, setIsExpanded] = useState(true); //
  const [activeView, setActiveView] = useState<View>(initialView); //
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    setActiveView(initialView);
  }, [initialView]);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded); //
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleItemClick = (view: View) => {
    setActiveView(view); //
    onNavigate(view); //
  };

  const sidebarVariants = {
    expanded: { width: 240, transition: { duration: 0.3, ease: "easeInOut" } },
    collapsed: { width: 70, transition: { duration: 0.3, ease: "easeInOut" } }
  };

  const iconButtonVariants = {
      rest: { scale: 1, color: isDarkMode ? 'var(--text-secondary-dark)' : 'var(--text-secondary-light)' },
      hover: { scale: 1.1, color: 'var(--action-highlight-dark)', transition: { duration: 0.2 } },
      tap: { scale: 0.95 }
  };

  return (
    <motion.aside
      className={`${styles.sidebar} ${isExpanded ? styles.expanded : styles.collapsed}`}
      variants={sidebarVariants}
      initial={false} // Não animar na montagem inicial
      animate={isExpanded ? "expanded" : "collapsed"}
    >
      <div className={styles.logoSection}>
        <AnimatePresence>
          {isExpanded && (
            <motion.span
              className={styles.logoText}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20, transition: {duration: 0.15} }}
              transition={{ duration: 0.25, delay: 0.1 }}
            >
              Scripty
            </motion.span>
          )}
        </AnimatePresence>
        <motion.button
            onClick={handleToggleExpand}
            className={styles.toggleButton}
            aria-label={isExpanded ? 'Recolher sidebar' : 'Expandir sidebar'}
            variants={iconButtonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
        >
          {isExpanded ? <FaChevronLeft /> : <FaChevronRight />}
        </motion.button>
      </div>

      <nav className={styles.menu}>
        <ul>
          {menuItems.map((item) => (
            // Usar a molécula SidebarItem aqui, passando as props necessárias
            // Se você não criou SidebarItem como uma molécula separada, mantenha o código original
            // e aplique as sugestões de animação/estilo diretamente no <li> e <button>
            <li key={item.view}> {/* O motion.div da SidebarItem já tem a key */}
                 <SidebarItem
                    icon={item.view} // Ajustar se o nome do ícone na SidebarItem for diferente
                    label={item.label}
                    isActive={activeView === item.view}
                    isCollapsed={!isExpanded}
                    onClick={() => handleItemClick(item.view)}
                 />
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.footer}>
        {/* Envolver os itens do footer em motion.div se quiser animá-los com AnimatePresence */}
        {/* quando a sidebar expande/recolhe. Similar ao SidebarItem. */}
        <SidebarItem
            icon="help"
            label="Central de Ajuda"
            isActive={activeView === 'help'}
            isCollapsed={!isExpanded}
            onClick={() => handleItemClick('help')}
        />

        <div className={`${styles.themeToggle} ${!isExpanded ? styles.themeToggleCollapsed : ''}`}>
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                className={styles.label}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: {duration: 0.1} }}
                transition={{ duration: 0.2, delay: 0.1}}
              >
                {isDarkMode ? 'Modo Escuro' : 'Modo Claro'}
              </motion.span>
            )}
          </AnimatePresence>
          <motion.button
            onClick={handleThemeToggle}
            className={styles.toggleThemeButton}
            aria-label="Mudar tema"
            variants={iconButtonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            animate={{ rotate: isDarkMode ? 0 : 180 }} // Animação de rotação
            transition={{ duration: 0.3 }}
          >
            {/* Animar a troca de ícone */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isDarkMode ? 'moon' : 'sun'}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isDarkMode ? <FaMoon /> : <FaSun />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;