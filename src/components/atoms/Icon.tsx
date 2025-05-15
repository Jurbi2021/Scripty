import React from 'react';
import { FaPen, FaCode, FaSearch, FaCog, FaQuestionCircle } from 'react-icons/fa';
import styles from './Icon.module.scss';
import { BsArrowBarLeft, BsArrowRight } from 'react-icons/bs';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

const iconMap: { [key: string]: React.ElementType } = {
  editor: FaPen,
  style: FaCode,
  seo: FaSearch,
  personalize: FaCog,
  help: FaQuestionCircle,
  arrow: BsArrowRight,
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