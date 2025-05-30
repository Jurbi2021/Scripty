// src/components/molecules/Card.tsx
import React from 'react';
import Text from '../atoms/Text';
import styles from './Card.module.scss';

interface CardProps {
  title?: string; // Título agora é opcional
  children: React.ReactNode;
  className?: string; // Permitir classes customizadas
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`${styles.card} ${className}`}>
      {title && (
        <Text size="large" weight="semibold" className={styles.title} as="h3"> {/* Usar tag semântica e classe para título */}
          {title}
        </Text>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Card;