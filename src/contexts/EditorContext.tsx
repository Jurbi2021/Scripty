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

import { loadPreferences, savePreferences } from '../services/preferencesService';


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

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  // Estados
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [text, setText] = useState('');
  const [preferences, setPreferences] = useState<ScriptyPreferences>(defaultScriptyPreferences);

  const [advancedMetrics, setAdvancedMetrics] = useState<AdvancedMetricsData>(getEmptyAdvancedMetrics());
  const [styleAnalysis, setStyleAnalysis] = useState<StyleAnalysisData>(getEmptyStyleAnalysis());
  const [seoAnalysis, setSeoAnalysis] = useState<SeoAnalysisResult | null>(null); 

  // Efeito para persistir preferências no localStorage

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => { // A função de callback agora é async
      if (user) {
        // Usuário fez login
        console.log("Usuário logado:", user.email);
        setCurrentUser(user);
        // Carregar as preferências do Firestore para este usuário
        const userPreferences = await loadPreferences(user.uid);
        setPreferences(userPreferences);
      } else {
        // Usuário fez logout
        console.log("Nenhum usuário logado.");
        setCurrentUser(null);
        // Resetar as preferências para o padrão quando deslogar
        setPreferences(defaultScriptyPreferences);
      }
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []); // Array de dependências vazio, roda apenas uma vez

  // Efeito para observar o estado de autenticação do Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setAuthLoading(false);
      console.log("Estado de autenticação mudou. Usuário atual:", user?.email);
    });
    return unsubscribe; // Limpeza ao desmontar
  }, []);

   useEffect(() => {
    // Só tenta salvar se houver um usuário logado
    if (!currentUser || authLoading) {
      return;
    }

    // Usar um debounce (atraso) para evitar salvar no banco de dados a cada pequena mudança.
    // Ele só salvará 1.5 segundos após a última alteração nas preferências.
    const debounceSave = setTimeout(() => {
      console.log("Debounce finalizado. Salvando preferências no Firestore...");
      savePreferences(currentUser.uid, preferences);
    }, 1500); // 1.5 segundos

    // Função de limpeza: se 'preferences' mudar novamente antes do timeout, cancela o save anterior.
    return () => clearTimeout(debounceSave);

  }, [preferences, currentUser, authLoading]); // Observa mudanças nestas variáveis

  
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
  const resetPreferences = () => {
    // Agora, resetar significa voltar para os padrões, o que acionará o save no Firestore.
    setPreferences(defaultScriptyPreferences);
  };

  const setAdvancedMetricsData = (data: AdvancedMetricsData) => setAdvancedMetrics(data);
  const setStyleAnalysisData = (data: StyleAnalysisData) => setStyleAnalysis(data);
  const setSeoAnalysisData = (data: SeoAnalysisResult | null) => setSeoAnalysis(data);

  const resetAdvancedMetricsData = () => setAdvancedMetrics(getEmptyAdvancedMetrics());
  const resetStyleAnalysisData = () => setStyleAnalysis(getEmptyStyleAnalysis());
  const resetSeoAnalysisData = () => setSeoAnalysis(null);

  return (
    <EditorContext.Provider value={{
      currentUser, authLoading, isFocusMode, toggleFocusMode, text, setText, preferences,
      updatePreferences, resetPreferences, advancedMetrics, styleAnalysis, seoAnalysis,
      setAdvancedMetricsData, setStyleAnalysisData, setSeoAnalysisData,
      resetAdvancedMetricsData, resetStyleAnalysisData, resetSeoAnalysisData
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