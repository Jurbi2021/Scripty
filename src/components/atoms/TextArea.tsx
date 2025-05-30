// src/components/atoms/TextArea.tsx (Exemplo, se você criar)
import React from 'react';
import styles from './TextArea.module.scss';

interface TextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
  disabled?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  placeholder,
  className = '',
  rows = 10, // Default rows
  disabled = false,
}) => {
  return (
    <textarea
      className={`${styles.textArea} ${className}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
    />
  );
};

export default TextArea;