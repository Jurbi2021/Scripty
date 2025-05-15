// src/components/atoms/Toggle.tsx
import React from 'react';

interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
  className?: string;
}

const Toggle: React.FC<ToggleProps> = ({ isOn, onToggle, className = '' }) => {
  return (
    <button
      onClick={onToggle}
      className={`toggle ${isOn ? 'on' : 'off'} ${className}`}
      aria-pressed={isOn}
    >
      <span className="toggle-thumb" />
    </button>
  );
};

export default Toggle;
