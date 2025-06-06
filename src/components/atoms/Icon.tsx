import React from 'react';
import { FaEdit, FaCode, FaSearch, FaCog, FaQuestionCircle, FaSignOutAlt, FaChevronRight, FaUser, FaPenFancy, FaChevronLeft } from 'react-icons/fa';
import styles from './Icon.module.scss';
import { BsArrowBarLeft, BsArrowRight } from 'react-icons/bs';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

const iconMap: { [key: string]: React.ElementType } = {
  // Chaves para as views da sidebar
  metrics: FaEdit, // Usando FaPen em vez de FaEdit para consistência com o que você tinha no Icon.tsx
  style: FaPenFancy,   // Você usou FaPenFancy na Sidebar, vamos manter essa. Se preferir FaCode, troque aqui.
  seo: FaSearch,
  personalization: FaCog,
  
  // Chaves para o footer da sidebar
  help: FaQuestionCircle,
  logout: FaSignOutAlt,
  user: FaUser, // Adicionado um ícone de usuário genérico que pode ser útil
  
  // Outros ícones
  arrowLeft: FaChevronLeft, // Renomeado para clareza
  arrowRight: FaChevronRight, // Renomeado para clareza
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