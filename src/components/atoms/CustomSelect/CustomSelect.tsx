// src/components/atoms/CustomSelect.tsx
import React from 'react';
import * as Select from '@radix-ui/react-select';
import { FaCheck, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import styles from './CustomSelect.module.scss';
import { motion, AnimatePresence } from 'framer-motion';

// Definir a estrutura de cada opção que o nosso seletor receberá
export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode; // 'icon' é opcional
}


interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ 
  options, 
  value, 
  onValueChange, 
  placeholder, 
  className = '' 
}) => {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger className={`${styles.selectTrigger} ${className}`}>
        <Select.Value placeholder={placeholder || 'Selecione uma opção...'} />
        <Select.Icon className={styles.selectIcon}>
          <FaChevronDown />
        </Select.Icon>
      </Select.Trigger>

      <AnimatePresence>
        <Select.Portal>
          <Select.Content 
            className={styles.selectContent} 
            position="popper" 
            sideOffset={5}
            // Evita que o foco seja roubado, útil em modais
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <Select.ScrollUpButton className={styles.selectScrollButton}>
                <FaChevronUp />
              </Select.ScrollUpButton>

              <Select.Viewport className={styles.selectViewport}>
                {options.map(option => (
                  <Select.Item key={option.value} value={option.value} className={styles.selectItem}>
                    <Select.ItemIndicator className={styles.selectItemIndicator}>
                      <FaCheck />
                    </Select.ItemIndicator>
                    <div className={styles.itemContentWrapper}>
                      {option.icon && <span className={styles.optionIcon}>{option.icon}</span>}
                      <Select.ItemText>{option.label}</Select.ItemText>
                      </div>
                  </Select.Item>
                ))}
              </Select.Viewport>
              
              <Select.ScrollDownButton className={styles.selectScrollButton}>
                <FaChevronDown />
              </Select.ScrollDownButton>
            </motion.div>
          </Select.Content>
        </Select.Portal>
      </AnimatePresence>
    </Select.Root>
  );
};

export default CustomSelect;