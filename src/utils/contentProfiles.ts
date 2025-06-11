// src/utils/contentProfiles.ts
// Definição de perfis de conteúdo e seus limiares específicos

export interface ThresholdConfig {
  // StyleAnalysis thresholds
  passiveVoicePercent: number;
  adverbPercent: number;
  complexSentencePercent: number;
  repetitionGlobalPercent: number;
  complexWordCountThreshold: number;      // Mínimo de palavras para considerar uma frase complexa
  complexSyllableAvgThreshold: number;  // Média de sílabas para complexidade
  complexConjunctionThreshold: number;    // Contagem de conjunções para complexidade
  repetitionWindowSize: number;           // Janela de palavras para análise de repetição próxima
  repetitionThresholdWindow: number;      // Quantas vezes uma palavra precisa de se repetir na janela
  shannonIndexLow: number;                // Limiar inferior para diversidade léxica
  shannonIndexHigh: number;               // Limiar superior para diversidade léxica

  // AdvancedMetrics thresholds
  readabilityJurbiXMin: number; // Mínimo para "Bom"
  readabilityJurbiXTarget: number; // Mínimo para "Excelente"
  fleschKincaidMin: number; // Mínimo para "Bom"
  gunningFogMax: number; // Máximo para "Bom"
  smogMax: number; // Máximo para "Bom"
  colemanLiauMax: number; // Limiar para o Coleman-Liau

  // Clarity and conciseness
  clarityScoreMin: number; // Mínimo para "Bom"
  verbosePhrasesMax: number; // Máximo para "Bom"
  
  // Formality
  formalityMin: number; // Mínimo para "Adequado"
  formalityMax: number; // Máximo para "Adequado"
  
  // Text length
  minWords: number;
  optimalMinWords: number;
  optimalMaxWords: number;
  maxWords: number;

  redundancyPercentMaxRegular: number; // Limite para "Regular" (ex: 50%)
  redundancyPercentMaxBom: number;     // Limite para "Bom" (ex: 30%)
}

export interface ContentProfile {
  id: string;
  name: string;
  description: string;
  thresholds: ThresholdConfig;
  icon?: string; // Nome do ícone (opcional)
}


// Perfil padrão (valores médios)
const defaultThresholds: ThresholdConfig = {
  passiveVoicePercent: 5,
  adverbPercent: 4,
  complexSentencePercent: 15,
  repetitionGlobalPercent: 1.5,
  shannonIndexLow: 2.5,  // Nome corrigido de shannonIndexLowThreshold
  shannonIndexHigh: 3.5, // Nome corrigido de shannonIndexHighThreshold

  complexWordCountThreshold: 20,
  complexSyllableAvgThreshold: 1.8,
  complexConjunctionThreshold: 3,
  repetitionWindowSize: 100,
  repetitionThresholdWindow: 3,
  
  readabilityJurbiXMin: 65,
  readabilityJurbiXTarget: 80,
  fleschKincaidMin: 60,
  gunningFogMax: 10,
  smogMax: 12,
  colemanLiauMax: 12,

  redundancyPercentMaxRegular: 50,
  redundancyPercentMaxBom: 30,
  
  clarityScoreMin: 60, // Novo
  verbosePhrasesMax: 3,  // Novo
  formalityMin: -10,     // Novo
  formalityMax: 10,      // Novo
  
  minWords: 300,
  optimalMinWords: 500,
  optimalMaxWords: 2000,
  maxWords: 2500
};

// Perfis de conteúdo disponíveis
export const contentProfiles: ContentProfile[] = [
  {
    id: 'default',
    name: 'Geral',
    description: 'Configuração padrão para a maioria dos textos',
    thresholds: { ...defaultThresholds },
    icon: 'FaFileAlt'
  },
  {
    id: 'blog',
    name: 'Blog',
    description: 'Otimizado para posts de blog e conteúdo web informal',
    thresholds: {
      ...defaultThresholds,
      passiveVoicePercent: 3, // Menos voz passiva para blogs
      adverbPercent: 3, // Menos advérbios para blogs
      complexSentencePercent: 10, // Frases mais simples para blogs
      
      readabilityJurbiXMin: 70, // Mais legível
      fleschKincaidMin: 70, // Mais legível
      gunningFogMax: 8, // Mais simples
      smogMax: 10, // Mais simples
      
      formalityMin: -30, // Permite mais informalidade
      formalityMax: 0, // Limite superior de formalidade mais baixo
      
      minWords: 300,
      optimalMinWords: 500,
      optimalMaxWords: 1500, // Posts de blog geralmente são mais curtos
      maxWords: 2000
    },
    icon: 'FaBlog'
  },
  {
    id: 'formal_report',
    name: 'Relatório Formal',
    description: 'Para documentos acadêmicos, relatórios técnicos e conteúdo formal',
    thresholds: {
      ...defaultThresholds,
      passiveVoicePercent: 10, // Mais tolerante à voz passiva
      adverbPercent: 5, // Mais tolerante a advérbios
      complexSentencePercent: 20, // Mais tolerante a frases complexas
      
      readabilityJurbiXMin: 55, // Pode ser mais complexo
      fleschKincaidMin: 40, // Pode ser mais complexo
      gunningFogMax: 14, // Pode ser mais complexo
      smogMax: 16, // Pode ser mais complexo
      
      formalityMin: 10, // Exige mais formalidade
      formalityMax: 50, // Limite superior de formalidade mais alto
      
      minWords: 500,
      optimalMinWords: 1000,
      optimalMaxWords: 3000, // Relatórios formais geralmente são mais longos
      maxWords: 5000
    },
    icon: 'FaFileContract'
  },
  {
    id: 'social_media',
    name: 'Redes Sociais',
    description: 'Para posts curtos em redes sociais e mensagens diretas',
    thresholds: {
      ...defaultThresholds,
      passiveVoicePercent: 2, // Quase nada de voz passiva
      adverbPercent: 3, // Poucos advérbios
      complexSentencePercent: 5, // Frases muito simples
      
      readabilityJurbiXMin: 75, // Muito legível
      fleschKincaidMin: 80, // Muito legível
      gunningFogMax: 6, // Muito simples
      smogMax: 8, // Muito simples
      
      formalityMin: -50, // Muito informal
      formalityMax: -10, // Limite superior de formalidade muito baixo
      
      minWords: 10,
      optimalMinWords: 20,
      optimalMaxWords: 280, // Limite do Twitter como referência
      maxWords: 500
    },
    icon: 'FaHashtag'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Para textos persuasivos, anúncios e copy',
    thresholds: {
      ...defaultThresholds,
      passiveVoicePercent: 2, // Quase nada de voz passiva
      adverbPercent: 5, // Tolerante a advérbios para ênfase
      complexSentencePercent: 8, // Frases relativamente simples
      
      readabilityJurbiXMin: 70, // Bastante legível
      fleschKincaidMin: 70, // Bastante legível
      gunningFogMax: 8, // Bastante simples
      smogMax: 10, // Bastante simples
      
      formalityMin: -20, // Permite informalidade moderada
      formalityMax: 10, // Permite alguma formalidade
      
      minWords: 50,
      optimalMinWords: 100,
      optimalMaxWords: 500, // Textos de marketing geralmente são concisos
      maxWords: 1000
    },
    icon: 'FaBullhorn'
  }
];

// Função para obter um perfil pelo ID
export const getProfileById = (id: string): ContentProfile => {
  const profile = contentProfiles.find(p => p.id === id);
  return profile || contentProfiles[0]; // Retorna o perfil padrão se não encontrar
};

// Função para aplicar limiares personalizados a um perfil existente
export const createCustomProfile = (
  basedOn: string,
  customThresholds: Partial<ThresholdConfig>
): ContentProfile => {
  const baseProfile = getProfileById(basedOn);
  return {
    id: 'custom',
    name: 'Personalizado',
    description: `Baseado em ${baseProfile.name} com ajustes personalizados`,
    thresholds: {
      ...baseProfile.thresholds,
      ...customThresholds
    },
    icon: 'FaWrench'
  };
};
