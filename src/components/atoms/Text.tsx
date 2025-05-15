// src/components/atoms/Text.tsx
import React, { ReactNode } from 'react';

interface TextProps {
  children: ReactNode;
  size?: 'small' | 'medium' | 'large';
  weight?: 'normal' | 'bold' | 'semibold';
  color?: string;
  className?: string;
}

const sizeClasses = {
  small: 'text-sm',
  medium: 'text-base',
  large: 'text-lg',
};

const weightClasses = {
  normal: 'font-normal',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const Text: React.FC<TextProps> = ({
  children,
  size = 'medium',
  weight = 'normal',
  color = 'inherit',
  className = '',
}) => {
  return (
    <p
      className={`${sizeClasses[size]} ${weightClasses[weight]} ${className}`}
      style={{ color }}
    >
      {children}
    </p>
  );
};

export default Text;
