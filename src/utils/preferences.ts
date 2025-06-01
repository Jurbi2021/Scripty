// src/utils/preferences.ts

export type BasicMetricKey = 'words' | 'charsWithSpaces' | 'sentences' | 'paragraphs' | 'readingTime' | 'uniqueWords' | 'avgWordsPerSentence' | 'avgCharsPerWord' | 'charsNoSpaces';
export type ReadabilityIndexKey = 'jurbiX' | 'gunningFog' | 'fleschKincaidReadingEase' | 'smogIndex' | 'colemanLiauIndex'/* | 'gulpeaseIndex' */;
export type StyleMetricKey = 'passiveVoice' | 'adverbs' | 'complexSentences' | 'discourseConnectors' | 'lexicalDiversity';
export type SeoMetricKey = 'mainKeyword' | 'keywordDensity' | 'lsiResult' | 'seoReadability' | 'seoTextLength' | 'headingResult'; // Ajustar chaves conforme SeoAnalysisResult

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
  visibleReadabilityIndices: ReadabilityIndexKey[];
}

export interface StyleAnalysisPreferences {
  // Um objeto onde a chave é a métrica de estilo e o valor define visibilidade e nível de detalhe
  [key in StyleMetricKey]?: {
    showCard: boolean;
    detailLevel: DetailLevel; // Aplicável para passiveVoice, complexSentences
  };
  // Exemplo explícito para melhor clareza no código:
  passiveVoice: { showCard: boolean; detailLevel: DetailLevel };
  adverbs: { showCard: boolean; /* detailLevel não aplicável ou sempre 'summary' */ };
  complexSentences: { showCard: boolean; detailLevel: DetailLevel };
  discourseConnectors: { showCard: boolean; };
  lexicalDiversity: { showCard: boolean; };
}

export interface SeoAnalysisPreferences {
  [key in SeoMetricKey]?: { // Usar chaves de SeoAnalysisResult se necessário
    showCard: boolean;
  };
  // Exemplo explícito:
  mainKeyword: { showCard: boolean }; // Feedback sobre a keyword
  lsiResult: { showCard: boolean };   // Card LSI
  seoReadability : { showCard: boolean };
  seoTextLength: { showCard: boolean };
  headingResult: { showCard: boolean };
  // A keywordDensity está ligada ao mainKeyword, não é um card separado
}

export interface ScriptyPreferences {
  toolbar: ToolbarPreferences;
  advancedMetrics: AdvancedMetricsPreferences;
  styleAnalysis: StyleAnalysisPreferences;
  seoAnalysis: SeoAnalysisPreferences;
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
  },
  styleAnalysis: {
    passiveVoice: { showCard: true, detailLevel: 'details_collapsed' },
    adverbs: { showCard: true },
    complexSentences: { showCard: true, detailLevel: 'details_collapsed' },
    discourseConnectors: { showCard: true },
    lexicalDiversity: { showCard: true },
  },
  seoAnalysis: {
    mainKeyword: { showCard: true },
    lsiResult: { showCard: true },
    seoReadability : { showCard: true },
    seoTextLength: { showCard: true },
    headingResult: { showCard: true },
  },
};