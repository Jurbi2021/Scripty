// src/components/molecules/ContentProfileSelector.tsx
import React from 'react';
import { useContentProfile } from '../../contexts/ContentProfileContext';
import styles from './ContentProfileSelector.module.scss';
import { FaFileAlt, FaBlog, FaFileContract, FaHashtag, FaBullhorn, FaWrench } from 'react-icons/fa';
import CustomSelect, { SelectOption } from '../atoms/CustomSelect/CustomSelect';


// Mapeamento de nomes de ícones para componentes de ícones
const iconMap: { [key: string]: React.ReactNode } = {
  FaFileAlt: <FaFileAlt />,
  FaBlog: <FaBlog />,
  FaFileContract: <FaFileContract />,
  FaHashtag: <FaHashtag />,
  FaBullhorn: <FaBullhorn />,
  FaWrench: <FaWrench />
};

interface ContentProfileSelectorProps {
  className?: string;
  compact?: boolean; 
}

const ContentProfileSelector: React.FC<ContentProfileSelectorProps> = ({ 
  className = '', 
  compact = false 
}) => {
  const { currentProfile, setProfileById, availableProfiles } = useContentProfile();

  // Mapear os perfis disponíveis para o formato que o CustomSelect espera
  const profileOptions: SelectOption[] = availableProfiles.map(profile => ({
    value: profile.id,
    label: profile.name,
  }));

  // Renderização do seletor em modo compacto
  if (compact) {
    return (
      <div className={`${styles.compactSelector} ${className}`}>
        {/* <<< SUBSTITUÍDO o <select> pelo <CustomSelect> >>> */}
        <CustomSelect
          value={currentProfile.id}
          onValueChange={setProfileById}
          options={profileOptions}
          placeholder="Selecione um Perfil"
        />
      </div>
    );
  }

  // Renderização do seletor completo (com cards)
  return (
    <div className={`${styles.profileSelector} ${className}`}>
      <h3 className={styles.selectorTitle}>Perfil de Conteúdo</h3>
      <p className={styles.selectorDescription}>
        Selecione o tipo de conteúdo para ajustar automaticamente os critérios de análise
      </p>
      
      <div className={styles.profileCards}>
        {availableProfiles.map(profile => (
          <div 
            key={profile.id}
            className={`${styles.profileCard} ${currentProfile.id === profile.id ? styles.selected : ''}`}
            onClick={() => setProfileById(profile.id)}
          >
            <div className={styles.profileIcon}>
              {profile.icon && iconMap[profile.icon] ? iconMap[profile.icon] : <FaFileAlt />}
            </div>
            <div className={styles.profileInfo}>
              <h4>{profile.name}</h4>
              <p>{profile.description}</p>
            </div>
            <div className={styles.selectionIndicator}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentProfileSelector;
