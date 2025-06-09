// src/contexts/EditorContext.tsx
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
// Importar os tipos e valores padrão
import { ScriptyPreferences, defaultScriptyPreferences } from '../utils/preferences'; 

// Importar os tipos de dados das análises e as funções de estado inicial vazio
import { AdvancedMetricsData, getEmptyAdvancedMetrics } from '../utils/AdvancedMetrics';
import { StyleAnalysisData, getEmptyStyleAnalysis } from '../utils/StyleAnalysis';
import { SeoAnalysisResult } from '../utils/SeoAnalysis';

// Importar tipos e instância de autenticação do Firebase
import { auth } from '../services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface EditorContextProps {
  // Autenticação
  currentUser: User | null;
  authLoading: boolean;

  // Editor
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  text: string;
  setText: (text: string) => void;

  // Preferências
  preferences: ScriptyPreferences;
  updatePreferences: (newPrefs: Partial<ScriptyPreferences>) => void;
  resetPreferences: () => void;
  
  // Dados de Análise
  advancedMetrics: AdvancedMetricsData;
  styleAnalysis: StyleAnalysisData;
  seoAnalysis: SeoAnalysisResult | null;
  setAdvancedMetricsData: (data: AdvancedMetricsData) => void;
  setStyleAnalysisData: (data: StyleAnalysisData) => void;
  setSeoAnalysisData: (data: SeoAnalysisResult | null) => void;

  // Funções de Reset para Análises (para evitar acúmulo de dados entre abas)
  resetAdvancedMetricsData: () => void;
  resetStyleAnalysisData: () => void;
  resetSeoAnalysisData: () => void;
}

const EditorContext = createContext<EditorContextProps | undefined>(undefined);

const LOCAL_STORAGE_PREFERENCES_KEY = 'scriptyPreferences';

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  // Estados
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [text, setText] = useState('');
  const [preferences, setPreferences] = useState<ScriptyPreferences>(() => {
    const storedPrefs = localStorage.getItem(LOCAL_STORAGE_PREFERENCES_KEY);
    // Lógica robusta para carregar as preferências, mesclando com os padrões
    let loadedPrefs = defaultScriptyPreferences;
    if (storedPrefs) {
      try {
        const parsedStoredPrefs = JSON.parse(storedPrefs);
        loadedPrefs = {
          ...defaultScriptyPreferences,
          ...parsedStoredPrefs,
          toolbar: { ...defaultScriptyPreferences.toolbar, ...(parsedStoredPrefs.toolbar || {}) },
          advancedMetrics: { ...defaultScriptyPreferences.advancedMetrics, ...(parsedStoredPrefs.advancedMetrics || {}) },
          styleAnalysis: { ...defaultScriptyPreferences.styleAnalysis, ...(parsedStoredPrefs.styleAnalysis || {}) },
          seoAnalysis: { ...defaultScriptyPreferences.seoAnalysis, ...(parsedStoredPrefs.seoAnalysis || {}) },
          aiPromptSettings: { ...defaultScriptyPreferences.aiPromptSettings, ...(parsedStoredPrefs.aiPromptSettings || {}) },
        };
      } catch (error) {
        console.error("Erro ao parsear preferências do localStorage, usando padrões:", error);
      }
    }
    return loadedPrefs;
  });

  const [advancedMetrics, setAdvancedMetrics] = useState<AdvancedMetricsData>(getEmptyAdvancedMetrics());
  const [styleAnalysis, setStyleAnalysis] = useState<StyleAnalysisData>(getEmptyStyleAnalysis());
  const [seoAnalysis, setSeoAnalysis] = useState<SeoAnalysisResult | null>(null); 

  // Efeito para persistir preferências no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error("Erro ao salvar preferências no localStorage:", error);
    }
  }, [preferences]);

  // Efeito para observar o estado de autenticação do Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setAuthLoading(false);
      console.log("Estado de autenticação mudou. Usuário atual:", user?.email);
    });
    return unsubscribe; // Limpeza ao desmontar
  }, []);

  // Funções
  const toggleFocusMode = () => setIsFocusMode((prev) => !prev);
  
  const updatePreferences = (newPrefs: Partial<ScriptyPreferences>) => {
    setPreferences(prev => {
      const updatedState = { ...prev, ...newPrefs };
      if (newPrefs.toolbar) updatedState.toolbar = { ...prev.toolbar, ...newPrefs.toolbar };
      if (newPrefs.advancedMetrics) updatedState.advancedMetrics = { ...prev.advancedMetrics, ...newPrefs.advancedMetrics };
      if (newPrefs.styleAnalysis) updatedState.styleAnalysis = { ...prev.styleAnalysis, ...newPrefs.styleAnalysis };
      if (newPrefs.seoAnalysis) updatedState.seoAnalysis = { ...prev.seoAnalysis, ...newPrefs.seoAnalysis };
      if (newPrefs.aiPromptSettings) updatedState.aiPromptSettings = { ...prev.aiPromptSettings, ...newPrefs.aiPromptSettings };
      return updatedState;
    });
  };

  const resetPreferences = () => setPreferences(defaultScriptyPreferences);

  const setAdvancedMetricsData = (data: AdvancedMetricsData) => setAdvancedMetrics(data);
  const setStyleAnalysisData = (data: StyleAnalysisData) => setStyleAnalysis(data);
  const setSeoAnalysisData = (data: SeoAnalysisResult | null) => setSeoAnalysis(data);

  const resetAdvancedMetricsData = () => setAdvancedMetrics(getEmptyAdvancedMetrics());
  const resetStyleAnalysisData = () => setStyleAnalysis(getEmptyStyleAnalysis());
  const resetSeoAnalysisData = () => setSeoAnalysis(null);

  return (
    <EditorContext.Provider value={{
      currentUser,
      authLoading,
      isFocusMode,
      toggleFocusMode,
      text,
      setText,
      preferences,
      updatePreferences,
      resetPreferences,
      advancedMetrics,
      styleAnalysis,
      seoAnalysis,
      setAdvancedMetricsData,
      setStyleAnalysisData,
      setSeoAnalysisData,
      resetAdvancedMetricsData,
      resetStyleAnalysisData,
      resetSeoAnalysisData
    }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = (): EditorContextProps => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor deve ser usado dentro de um EditorProvider');
  }
  return context;
};