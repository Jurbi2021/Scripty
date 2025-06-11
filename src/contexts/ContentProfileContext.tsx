// src/contexts/ContentProfileContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ContentProfile, ThresholdConfig, contentProfiles, getProfileById } from '../utils/contentProfiles';

interface ContentProfileContextType {
  currentProfile: ContentProfile;
  setProfileById: (id: string) => void;
  availableProfiles: ContentProfile[];
  thresholds: ThresholdConfig;
}

// Criar o contexto com um valor padrão
const ContentProfileContext = createContext<ContentProfileContextType>({
  currentProfile: contentProfiles[0],
  setProfileById: () => {},
  availableProfiles: contentProfiles,
  thresholds: contentProfiles[0].thresholds,
});

// Hook personalizado para usar o contexto
export const useContentProfile = () => useContext(ContentProfileContext);

interface ContentProfileProviderProps {
  children: ReactNode;
  initialProfileId?: string;
}

// Componente Provider
export const ContentProfileProvider: React.FC<ContentProfileProviderProps> = ({ 
  children, 
  initialProfileId = 'default' 
}) => {
  const [currentProfile, setCurrentProfile] = useState<ContentProfile>(
    getProfileById(initialProfileId)
  );

  // Função para alterar o perfil atual
  const setProfileById = (id: string) => {
    const profile = getProfileById(id);
    setCurrentProfile(profile);
    
    // Opcional: Salvar a preferência do usuário no localStorage
    try {
      localStorage.setItem('scripty-content-profile', id);
    } catch (error) {
      console.error('Erro ao salvar preferência de perfil:', error);
    }
  };

  // Carregar perfil salvo ao iniciar
  useEffect(() => {
    try {
      const savedProfileId = localStorage.getItem('scripty-content-profile');
      if (savedProfileId) {
        setProfileById(savedProfileId);
      }
    } catch (error) {
      console.error('Erro ao carregar preferência de perfil:', error);
    }
  }, []);

  const value = {
    currentProfile,
    setProfileById,
    availableProfiles: contentProfiles,
    thresholds: currentProfile.thresholds,
  };

  return (
    <ContentProfileContext.Provider value={value}>
      {children}
    </ContentProfileContext.Provider>
  );
};

export default ContentProfileContext;
