// src/services/preferencesService.ts

import { db } from './firebase'; // Importa a instância do Firestore
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ScriptyPreferences, defaultScriptyPreferences } from '../utils/preferences';

// O nome da "coleção" (como uma tabela) onde guardaremos as preferências no Firestore
const PREFERENCES_COLLECTION = 'userPreferences';

/**
 * Carrega as preferências de um usuário do Firestore.
 * Se o usuário ainda não tiver preferências salvas, retorna as preferências padrão.
 * @param userId O ID do usuário do Firebase (user.uid).
 * @returns Uma promessa que resolve para o objeto de preferências do usuário.
 */
export const loadPreferences = async (userId: string): Promise<ScriptyPreferences> => {
  if (!userId) {
    console.error("loadPreferences foi chamado sem um userId.");
    return defaultScriptyPreferences;
  }

  // Cria uma referência para o documento específico deste usuário
  const docRef = doc(db, PREFERENCES_COLLECTION, userId);

  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Se o documento existe, retorna os seus dados.
      console.log(`Preferências carregadas do Firestore para o usuário: ${userId}`);
      const loadedData = docSnap.data() as ScriptyPreferences;
      
      // Faz um "merge" com os padrões para garantir que novas chaves de preferência
      // que você adicionou ao `defaultScriptyPreferences` sejam aplicadas a usuários antigos.
      return {
        ...defaultScriptyPreferences,
        ...loadedData,
        // Merge profundo para objetos aninhados
        toolbar: { ...defaultScriptyPreferences.toolbar, ...(loadedData.toolbar || {}) },
        advancedMetrics: { ...defaultScriptyPreferences.advancedMetrics, ...(loadedData.advancedMetrics || {}) },
        styleAnalysis: { ...defaultScriptyPreferences.styleAnalysis, ...(loadedData.styleAnalysis || {}) },
        seoAnalysis: { ...defaultScriptyPreferences.seoAnalysis, ...(loadedData.seoAnalysis || {}) },
        aiPromptSettings: { ...defaultScriptyPreferences.aiPromptSettings, ...(loadedData.aiPromptSettings || {}) },
      };

    } else {
      // Se o documento não existe (ex: usuário novo), retorna as preferências padrão.
      console.log(`Nenhuma preferência encontrada para o usuário: ${userId}. Usando padrões.`);
      return defaultScriptyPreferences;
    }
  } catch (error) {
    console.error("Erro ao carregar preferências do Firestore:", error);
    // Em caso de erro, retorna as preferências padrão como um fallback seguro.
    return defaultScriptyPreferences;
  }
};

/**
 * Salva (ou sobrescreve) as preferências de um usuário no Firestore.
 * @param userId O ID do usuário do Firebase (user.uid).
 * @param preferences O objeto de preferências a ser salvo.
 */
export const savePreferences = async (userId: string, preferences: ScriptyPreferences): Promise<void> => {
  if (!userId) {
    console.error("savePreferences foi chamado sem um userId.");
    return;
  }

  // Cria uma referência para o documento específico deste usuário
  const docRef = doc(db, PREFERENCES_COLLECTION, userId);

  try {
    // Usa setDoc para criar ou sobrescrever completamente o documento com as novas preferências.
    // O { merge: true } é uma opção para fundir campos em vez de sobrescrever o documento inteiro,
    // mas para preferências, geralmente queremos salvar o objeto completo.
    await setDoc(docRef, preferences);
    console.log(`Preferências salvas no Firestore para o usuário: ${userId}`);
  } catch (error) {
    console.error("Erro ao salvar preferências no Firestore:", error);
  }
};