// src/components/molecules/Card.tsx
import React from 'react';
import Text from '../atoms/Text';
import styles from './Card.module.scss';
import { motion, MotionProps } from 'framer-motion'; // Importar motion e MotionProps

// Props para o componente Card, incluindo props do Framer Motion
type CardProps = React.HTMLAttributes<HTMLDivElement> & MotionProps & {
  title?: string;
  children: React.ReactNode;
  className?: string;
  // Para animação de entrada escalonada, se o card estiver numa lista
  initialDelay?: number;
};

const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  initialDelay = 0, // Delay padrão de 0 para a animação de entrada
  ...rest // Captura outras props HTML e MotionProps
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: initialDelay, // Aplica o delay passado como prop
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const hoverTransition = {
    type: "spring" as const,
    stiffness: 300,
    damping: 20
  };

  return (
    <motion.div
      className={`${styles.card} ${className}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      // O hover do CSS já é bom, mas se quiser usar Framer Motion para mais controle:
      whileHover={{ 
        y: -4, // Um pouco mais de elevação
        boxShadow: "0 8px 16px rgba(0,0,0,0.07), 0 15px 25px rgba(0,0,0,0.07)" // Sombra um pouco mais pronunciada no hover
      }}
      transition={hoverTransition} // Aplica a transição spring para o hover
      {...rest} // Passa quaisquer outras props (incluindo HTML attributes como id, etc.)
    >
      {title && (
        <Text size="large" weight="semibold" className={styles.title} as="h3">
          {title}
        </Text>
      )}
      <div className={styles.content}>{children}</div>
    </motion.div>
  );
};

export default Card;