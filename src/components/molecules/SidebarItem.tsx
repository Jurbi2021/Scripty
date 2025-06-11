// src/components/molecules/SidebarItem.tsx
import React from 'react';
import Icon from '../atoms/Icon'; // Usando o átomo Icon centralizado
import Text from '../atoms/Text';
import styles from './SidebarItem.module.scss';
import { motion, AnimatePresence } from 'framer-motion';

// Remover o mapa de ícones local daqui, pois a lógica está centralizada no átomo Icon.tsx

interface SidebarItemProps {
  icon: string;
  label: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
  className?: string;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  isActive = false,
  isCollapsed = false,
  onClick,
  className = ''
}) => {
  const labelVariants = {
    collapsed: { opacity: 0, width: 0, marginLeft: 0, transition: { duration: 0.15, ease: "easeIn" } },
    expanded: { opacity: 1, width: 'auto', marginLeft: '0.8rem', transition: { duration: 0.25, delay: 0.1, ease: "circOut" } }
  };

  return (
    <motion.div
      className={`${styles.sidebarItem} ${isActive ? styles.active : ''} ${isCollapsed ? styles.collapsed : ''} ${className}`}
      onClick={onClick}
      // <<< MUDANÇA #2: REMOVIDO o whileHover daqui >>>
      // Deixamos o .module.scss cuidar do hover para evitar conflitos.
      // O SCSS já tem uma regra &:hover:not(.active) que é mais confiável para este caso de uso.
      transition={{ duration: 0.15, ease: "easeOut" }}
      layout
    >
      <div className={styles.iconContainer}>
        {/* <<< MUDANÇA #1: Adicionada a prop 'size' para controlar o tamanho do ícone >>> */}
        <Icon name={icon} className={styles.icon} size={18} />
      </div>
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.span
            className={styles.label}
            key={label}
            variants={labelVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
          >
            <Text size="medium" weight="semibold">
              {label}
            </Text>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
};