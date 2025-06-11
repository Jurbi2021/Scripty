// src/components/atoms/Input.tsx
import React, { ReactNode } from 'react';
import styles from './Input.module.scss';
import Text from './Text'; // Assumindo que você tem um átomo Text

interface InputProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'email' | 'password';
  icon?: ReactNode; // <<< NOVA PROP para o ícone
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  id,
  value,
  onChange,
  type = 'text',
  icon, // <<< NOVA PROP
  required = false,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`${styles.inputContainer} ${className}`}>
      <Text as="label" htmlFor={id} className={styles.label}>
        {label}
      </Text>
      <div className={styles.fieldWrapper}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`${styles.inputField} ${icon ? styles.withIcon : ''}`}
          placeholder=" " // Placeholder vazio para o truque de label flutuante (opcional)
        />
      </div>
    </div>
  );
};

export default Input;