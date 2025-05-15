import React from 'react';
import { useNavigate } from 'react-router-dom'; // Substitui useHistory por useNavigate
import { useEditor } from '../../contexts/EditorContext';
import Button from '../atoms/Button';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  const { isFocusMode, toggleFocusMode } = useEditor();
  const navigate = useNavigate(); // Substitui useHistory

  return (
    <header className={styles.header}>
      <div className={styles.logo}>Scripty</div>
      <div className={styles.actions}>
        <Button onClick={toggleFocusMode}>
          {isFocusMode ? 'Desativar Modo Foco' : 'Ativar Modo Foco'}
        </Button>
        <Button onClick={() => navigate('/help')} variant="secondary">
          Abrir Ajuda
        </Button>
      </div>
    </header>
  );
};

export default Header;