// src/components/molecules/SidebarItem.tsx
import React from 'react';
import Icon from '../atoms/Icon';
import Text from '../atoms/Text';
import styles from './SidebarItem.module.scss';
import { motion, AnimatePresence } from 'framer-motion'; // Adicionado Framer Motion

interface SidebarItemProps {
  icon: string;
  label: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  isActive = false,
  isCollapsed = false,
  onClick
}) => {
  return (
    <motion.div
      className={`${styles.sidebarItem} ${isActive ? styles.active : ''} ${isCollapsed ? styles.collapsed : ''}`}
      onClick={onClick}
      // O hover do background será tratado no SCSS para evitar conflito com o .active
      // Se quiser animação de scale no hover via Framer Motion:
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      layout // Adicionar para animar mudanças de layout
    >
      <div className={styles.iconContainer}>
        <Icon name={icon} className={styles.icon} />
      </div>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.span
            className={styles.label}
            initial={{ opacity: 0, width: 0, marginLeft: 0 }}
            animate={{ opacity: 1, width: 'auto', marginLeft: '0.8rem' }}
            exit={{ opacity: 0, width: 0, marginLeft: 0, transition: {duration: 0.15} }} // Transição de saída mais rápida
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <Text size="medium" weight="semibold" color={isActive && !isCollapsed ? (document.documentElement.getAttribute('data-theme') === 'light' ? '#ffffff' : '#FFFFFF') : undefined}>
              {label}
            </Text>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
};