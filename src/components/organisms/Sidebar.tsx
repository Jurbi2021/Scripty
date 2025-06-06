// src/components/organisms/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import styles from './Sidebar.module.scss';
// Adicionar o ícone de logout
import { FaChevronLeft, FaChevronRight, FaEdit, FaPenFancy, FaSearch, FaCog, FaQuestionCircle, FaSun, FaMoon, FaSignOutAlt } from 'react-icons/fa'; 
import { SidebarItem } from '../molecules/SidebarItem';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

// --- Novas Importações para Autenticação ---
import { useEditor } from '../../contexts/EditorContext';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import Text from '../atoms/Text'; // Para exibir o email
// -----------------------------------------

// --- NOVO HOOK CUSTOMIZADO (pode ser colocado neste arquivo ou em um arquivo de hooks separado) ---
const useWindowSize = () => {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    const handleResize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return size;
};

type View = 'metrics' | 'style' | 'seo' | 'personalization' | 'help';

interface SidebarProps {
  onNavigate: (view: View) => void;
  initialView?: View;
}



const menuItems: { view: View; label: string }[] = [
  { view: 'metrics', label: 'Editor de Texto' },
  { view: 'style', label: 'Análise de Estilo' },
  { view: 'seo', label: 'Análise de SEO' },
  { view: 'personalization', label: 'Personalizar' },
  { view: 'help', label: 'Central de Ajuda' },
];

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, initialView = 'metrics' }) => {
  const [width] = useWindowSize(); // Obtém a largura da tela
  const [isExpanded, setIsExpanded] = useState(width > 992);
  useEffect(() => {
    if (width <= 992) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  }, [width]);
  const [activeView, setActiveView] = useState<View>(initialView);
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  

  // --- Novos Hooks para Autenticação ---
  const { currentUser } = useEditor();
  const navigate = useNavigate();
  // ------------------------------------

  useEffect(() => {
    setActiveView(initialView);
  }, [initialView]);

  // --- Nova Função de Logout ---
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Após o logout, o onAuthStateChanged no context cuidará de atualizar currentUser,
      // e o ProtectedRoute cuidará do redirecionamento.
      // Mas podemos redirecionar proativamente aqui para uma experiência mais rápida.
      navigate('/login');
      console.log("Logout bem-sucedido a partir da Sidebar!");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Aqui você poderia usar um toast de erro se quisesse
    }
  };
  // -----------------------------

  const handleToggleExpand = () => setIsExpanded(!isExpanded);
  const handleThemeToggle = () => toggleTheme();
  const handleItemClick = (view: View) => {
    setActiveView(view);
    onNavigate(view);
  };

  const sidebarVariants = {
    expanded: { width: 240, transition: { duration: 0.3, ease: "easeInOut" } },
    collapsed: { width: 70, transition: { duration: 0.3, ease: "easeInOut" } }
  };
  
  // Suas variantes de animação existentes
  const currentActionButtonColor = isDarkMode ? 'var(--action-highlight-dark)' : 'var(--action-highlight-light)';
  const dynamicIconButtonVariants = {
    rest: { scale: 1, color: isDarkMode ? 'var(--text-secondary-dark)' : 'var(--text-secondary-light)' },
    hover: { scale: 1.1, color: currentActionButtonColor, transition: { duration: 0.2 } },
    tap: { scale: 0.95 }
  };

  return (
    <motion.aside
      className={`${styles.sidebar} ${isExpanded ? styles.expanded : styles.collapsed}`}
      variants={sidebarVariants}
      initial={false}
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
              // Delay um pouco menor para o logo aparecer um pouco antes dos itens, ou sincronizado
              transition={{ duration: 0.25, delay: 0.05, ease: "circOut" }} // Ajuste no ease e delay
            >
              Scripty
            </motion.span>
          )}
        </AnimatePresence>
        <motion.button
            onClick={handleToggleExpand}
            className={styles.toggleButton}
            aria-label={isExpanded ? 'Recolher sidebar' : 'Expandir sidebar'}
            variants={dynamicIconButtonVariants} // Usar a variante dinâmica
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
            <li key={item.view}>
                 <SidebarItem
                    icon={item.view} label={item.label} isActive={activeView === item.view}
                    isCollapsed={!isExpanded} onClick={() => handleItemClick(item.view)}
                 />
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.footer}>
        <SidebarItem
            icon="help" label="Central de Ajuda" isActive={activeView === 'help'}
            isCollapsed={!isExpanded} onClick={() => handleItemClick('help')}
        />

        <div className={`${styles.themeToggle} ${!isExpanded ? styles.themeToggleCollapsed : ''}`}>
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                className={styles.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: {duration: 0.1} }}
                // Sincronizar com a animação do label dos SidebarItems
                transition={{ duration: 0.2, delay: isExpanded ? 0.15 : 0, ease: "circOut" }} // Ajuste no delay e ease
              >
                {isDarkMode ? 'Modo Escuro' : 'Modo Claro'}
              </motion.span>
            )}
          </AnimatePresence>
          <motion.button
            onClick={handleThemeToggle}
            className={styles.toggleThemeButton}
            aria-label="Mudar tema"
            variants={dynamicIconButtonVariants} // Usar a variante dinâmica
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            animate={{ rotate: isDarkMode ? 0 : 180 }}
            transition={{ duration: 0.3, ease: "anticipate" }} // Ease "anticipate" pode ser interessante aqui
          >
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

        {/* --- NOVA SEÇÃO DE USUÁRIO (aparece apenas se logado) --- */}
        {currentUser && (
          <div className={styles.userSection}>
             <SidebarItem
                icon="logout" // <<< Você precisará adicionar 'logout' ao seu átomo Icon.tsx
                label="Sair"
                isCollapsed={!isExpanded}
                onClick={handleLogout}
                className={styles.logoutItem} // Classe opcional para estilização
             />
             <AnimatePresence>
              {isExpanded && (
                <motion.div
                  className={styles.userEmail}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto', transition: { delay: 0.15 } }}
                  exit={{ opacity: 0, height: 0, transition: { duration: 0.1 } }}
                >
                  <Text size="small" weight="normal">{currentUser.email}</Text>
                </motion.div>
              )}
             </AnimatePresence>
          </div>
        )}
        {/* --- FIM DA SEÇÃO DE USUÁRIO --- */}

      </div>
    </motion.aside>
  );
};

export default Sidebar;