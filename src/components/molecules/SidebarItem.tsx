import React from 'react';
import Icon from '../atoms/Icon';
import Text from '../atoms/Text';
import styles from './SidebarItem.module.scss';

interface SidebarItemProps {
  icon: string;
  label: string;
  isActive?: boolean;
  isCollapsed?: boolean; // Nova prop
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
    <div
      className={`${styles.sidebarItem} ${isActive ? styles.active : ''} ${isCollapsed ? styles.collapsed : ''}`}
      onClick={onClick}
    >
      <div className={styles.iconContainer}>
        <Icon name={icon} className={styles.icon} />
      </div>
      {!isCollapsed && (
        <Text size="medium" weight="semibold" className={styles.label}>
          {label}
        </Text>
      )}
    </div>
  );
};
