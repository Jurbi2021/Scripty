// src/components/atoms/Text.tsx
import React, { ReactNode } from 'react'; //

interface TextProps {
  children: ReactNode;
  size?: 'small' | 'medium' | 'large';
  weight?: 'normal' | 'bold' | 'semibold';
  color?: string; // Permite cor customizada, mas prefira variáveis CSS
  className?: string;
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; // Adicionar 'as' prop
}

const sizeClasses = {
  small: 'text-sm', //
  medium: 'text-base', //
  large: 'text-lg', //
};

const weightClasses = {
  normal: 'font-normal', //
  semibold: 'font-semibold', //
  bold: 'font-bold', //
};

const Text: React.FC<TextProps> = ({
  children,
  size = 'medium',
  weight = 'normal',
  color, // Removido 'inherit' como default para forçar decisão ou usar CSS var
  className = '',
  as: Component = 'p', // Default para 'p', mas permite outras tags
}) => {
  const style = color ? { color } : {};
  return (
    <Component
      className={`${sizeClasses[size]} ${weightClasses[weight]} ${className}`}
      style={style}
    >
      {children}
    </Component>
  );
};

export default Text;