import React from 'react';
import { FaEdit, FaSearch, FaCog, FaQuestionCircle, FaSignOutAlt, FaChevronRight, FaUser, FaPenFancy, FaChevronLeft } from 'react-icons/fa';
import styles from './Icon.module.scss';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

// Este mapa é a nossa "única fonte de verdade" para os ícones
const iconMap: { [key: string]: React.ElementType } = {
  // Chaves para as views da sidebar
  metrics: FaEdit,
  style: FaPenFancy,   // Usando FaPenFancy como discutido
  seo: FaSearch,
  personalization: FaCog,
  
  // Chaves para o footer da sidebar
  help: FaQuestionCircle,
  logout: FaSignOutAlt,
  user: FaUser,
  
  // Chaves para outros ícones
  arrowLeft: FaChevronLeft,
  arrowRight: FaChevronRight,
};

const Icon: React.FC<IconProps> = ({ name, size = 24, color = 'inherit', className = '' }) => {
  const IconComponent = iconMap[name] || FaQuestionCircle;
  return (
    <IconComponent
      className={`${styles.icon} ${className}`}
      style={{ fontSize: size, color }}
    />
  );
};

export default Icon;