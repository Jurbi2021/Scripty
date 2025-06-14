// src/utils/preferences.ts

export type BasicMetricKey = 'words' | 'charsWithSpaces' | 'sentences' | 'paragraphs' | 'readingTime' | 'uniqueWords' | 'avgWordsPerSentence' | 'avgCharsPerWord' | 'charsNoSpaces';
export type ReadabilityIndexKey = 'jurbiX' | 'gunningFog' | 'fleschKincaidReadingEase' | 'smogIndex' | 'colemanLiauIndex' | 'gulpeaseIndex' ;
export type StyleMetricKey = 'passiveVoice' | 'adverbs' | 'complexSentences' | 'discourseConnectors' | 'lexicalDiversity';
export type SeoMetricKey = 'mainKeyword' | 'lsiResult' | 'seoReadability' | 'seoTextLength' | 'headingResult'; // Ajustar chaves conforme SeoAnalysisResult

export type DetailLevel = 'summary' | 'details_expanded' | 'details_collapsed';

export interface ToolbarPreferences {
  showToolbar: boolean;
  visibleMetrics: BasicMetricKey[];
}

export interface AdvancedMetricsPreferences {
  showLengthCard: boolean;
  showRedundancyCard: boolean;
  showSentimentCard: boolean;
  showReadabilityCarousel: boolean;
  showToneCard: boolean; // Adicionado
  showFormalityCard: boolean; // Adicionado
  showClarityCard: boolean; // Adicionado
  showConcisenessCard: boolean; // Adicionado
  visibleReadabilityIndices: ReadabilityIndexKey[];
}

export interface AIPromptSettings {
  generateComprehensivePrompt: boolean;
}

export interface StyleAnalysisPreferences {
  passiveVoice: { showCard: boolean; detailLevel: DetailLevel };
  adverbs: { showCard: boolean; detailLevel: DetailLevel };
  complexSentences: { showCard: boolean; detailLevel: DetailLevel };
  discourseConnectors: { showCard: boolean; detailLevel: DetailLevel };
  lexicalDiversity: { showCard: boolean; detailLevel: DetailLevel };
}

export interface SeoAnalysisPreferences {
  // Definir explicitamente cada chave
  mainKeyword: { showCard: boolean };
  lsiResult: { showCard: boolean };
  seoReadability: { showCard: boolean };
  seoTextLength: { showCard: boolean };
  headingResult: { showCard: boolean };
}

export interface ScriptyPreferences {
  toolbar: ToolbarPreferences;
  advancedMetrics: AdvancedMetricsPreferences;
  styleAnalysis: StyleAnalysisPreferences;
  seoAnalysis: SeoAnalysisPreferences;
  aiPromptSettings: AIPromptSettings;
}

// Valores padrão para as preferências
export const defaultScriptyPreferences: ScriptyPreferences = {
  toolbar: {
    showToolbar: true,
    visibleMetrics: ['words', 'charsWithSpaces', 'readingTime', 'sentences', 'paragraphs'],
  },
  advancedMetrics: {
    visibleReadabilityIndices: ['jurbiX', 'fleschKincaidReadingEase', 'gunningFog'],
    showLengthCard: true,
    showRedundancyCard: true,
    showSentimentCard: true,
    showReadabilityCarousel: true,
    showToneCard: true, // Adicionado
    showFormalityCard: true, // Adicionado
    showClarityCard: true, // Adicionado
    showConcisenessCard: true, // Adicionado
  },
  styleAnalysis: {
    passiveVoice: { showCard: true, detailLevel: 'details_collapsed' },
    adverbs: { showCard: true, detailLevel: 'summary' }, // Adicionar detailLevel padrão
    complexSentences: { showCard: true, detailLevel: 'details_collapsed' },
    discourseConnectors: { showCard: true, detailLevel: 'summary' }, // Adicionar detailLevel padrão
    lexicalDiversity: { showCard: true, detailLevel: 'summary' }, // Adicionar detailLevel padrão
  },
  seoAnalysis: {
    mainKeyword: { showCard: true },
    lsiResult: { showCard: true },
    seoReadability : { showCard: true },
    seoTextLength: { showCard: true },
    headingResult: { showCard: true },
  },
  aiPromptSettings: {
    generateComprehensivePrompt: true,
  }
};
