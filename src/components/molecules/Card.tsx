import React from 'react';
import Text from '../atoms/Text';
import styles from './Card.module.scss';

interface CardProps {
  title: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className={styles.card}>
      <Text size="large" weight="semibold">{title}</Text>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Card;