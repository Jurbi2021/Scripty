// src/components/atoms/Text.tsx
import React, { ReactNode, CSSProperties } from 'react'; // Adicionar CSSProperties

interface TextProps {
  children: ReactNode;
  size?: 'small' | 'medium' | 'large';
  weight?: 'normal' | 'bold' | 'semibold';
  color?: string;
  className?: string;
  // <<< MUDANÇA AQUI: Adicionadas as novas tags permitidas >>>
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label' | 'dt' | 'dd';
  style?: CSSProperties; // <<< ADICIONADA A PROP 'style'
  htmlFor?: string; // Para usar com as="label"
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
  color,
  className = '',
  as: Component = 'p',
  style, // <<< ADICIONADO
  htmlFor // <<< ADICIONADO
}) => {
  const inlineStyle = color ? { ...style, color } : style;
  
  // Adiciona a prop 'htmlFor' apenas se o componente for um 'label'
  const componentProps: { [key: string]: any } = {
    className: `${sizeClasses[size]} ${weightClasses[weight]} ${className}`,
    style: inlineStyle,
  };

  if (Component === 'label' && htmlFor) {
    componentProps.htmlFor = htmlFor;
  }

  return (
    <Component {...componentProps}>
      {children}
    </Component>
  );
};

export default Text;