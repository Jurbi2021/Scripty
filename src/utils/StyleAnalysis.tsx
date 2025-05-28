// src/utils/StyleAnalysis.tsx
import { countSyllables } from './BasicMetrics'; // Assuming countSyllables is here

// --- Types ---

export interface SentenceInfo {
  index: number;
  sentence: string;
}

export interface PassiveVoiceResult {
  count: number;
  sentences: SentenceInfo[];
  feedback: string;
  level: string; // e.g., 'Bom', 'Regular', 'Ruim'
}

export interface AdverbResult {
  count: number;
  adverbs: string[];
  feedback: string;
  level: string;
}

export interface ComplexSentenceInfo extends SentenceInfo {
  wordCount: number;
  syllableCount: number;
  commaCount: number;
  conjunctionCount: number;
  avgWordLength: number;
  complexityScore: number;
}

export interface ComplexSentencesResult {
  count: number;
  sentences: ComplexSentenceInfo[];
  feedback: string;
  level: string;
}

export interface DiscourseConnectorsResult {
    count: number;
    connectors: string[];
    percentage: number;
    feedback: string;
    level: string;
}

export interface LexicalDiversityResult {
    index: number;
    feedback: string;
    level: string;
}

export interface StyleAnalysisData {
  passiveVoice: PassiveVoiceResult;
  adverbs: AdverbResult;
  complexSentences: ComplexSentencesResult;
  discourseConnectors: DiscourseConnectorsResult; // Added
  lexicalDiversity: LexicalDiversityResult; // Added
}

// --- Constants (from original JS and HelpModal context) ---

const PASSIVE_INDICATORS: string[] = [
  'foi', 'foram', 'é', 'são', 'era', 'eram', 'será', 'serão', 'está', 'estão',
  'esteve', 'estiveram', 'ser', 'estar', 'parecer', 'ficar', 'tornar-se', 'fui',
  'fomos', 'tenha sido', 'tenha', 'tenho', 'tinha', 'tive', 'tivemos', 'sendo',
  'sido', 'estando', 'estado', 'ficando', 'ficado'
];
const PASSIVE_PREPOSITIONS: string[] = [
  'por', 'pelo', 'pela', 'pelos', 'pelas', 'de', 'do', 'da', 'dos', 'das'
];
const PARTICIPLES: string[] = [
  'feito', 'feita', 'feitos', 'feitas', 'visto', 'vista', 'vistos', 'vistas',
  'escrito', 'escrita', 'escritos', 'escritas', 'dito', 'dita', 'ditos', 'ditas',
  'posto', 'posta', 'postos', 'postas', 'aberto', 'aberta', 'abertos', 'abertas',
  'coberto', 'coberta', 'cobertos', 'cobertas', 'descoberto', 'descoberta',
  'descobertos', 'descobertas'
  // Add more common participles if needed
];

const ADVERB_ENDINGS: string[] = ['mente'];
const COMMON_ADVERBS: string[] = [
  'não', 'mais', 'muito', 'já', 'quando', 'mesmo', 'depois', 'ainda', 'bem',
  'aqui', 'hoje', 'sempre', 'menos', 'agora', 'antes', 'tão', 'quase', 'nunca',
  'também', 'apenas', 'assim', 'então', 'lá', 'logo', 'fora', 'cedo', 'tarde',
  'acima', 'abaixo', 'mal', 'pouco', 'bastante', 'demais', 'ali', 'atrás',
  'adiante', 'dentro', 'perto', 'longe', 'certamente', 'realmente', 'possivelmente',
  'provavelmente', 'talvez', 'inclusive', 'somente', 'principalmente', 'especialmente'
];

const COMPLEX_CONJUNCTIONS: string[] = [
  'e', 'ou', 'mas', 'porque', 'embora', 'enquanto', 'pois', 'portanto',
  'contudo', 'entretanto', 'assim', 'logo', 'quando', 'se', 'como', 'que'
];

const DISCOURSE_CONNECTORS: string[] = [
    'portanto', 'contudo', 'entretanto', 'porém', 'pois', 'porque', 'embora',
    'enquanto', 'além disso', 'por outro lado', 'assim', 'dessa forma',
    'consequentemente', 'ou seja', 'isto é', 'em resumo', 'afinal', 'de fato',
    'com efeito', 'no entanto', 'todavia', 'apesar disso', 'ademais', 'outrossim',
    'além do mais', 'como se não bastasse', 'não obstante', 'em contrapartida',
    'ao passo que', 'visto que', 'já que', 'uma vez que', 'logo', 'por conseguinte',
    'a saber', 'em outras palavras', 'antes que', 'depois que', 'desde que', 'sempre que',
    'finalmente', 'em síntese', 'certamente', 'decerto', 'sem dúvida', 'caso',
    'a menos que', 'salvo se', 'da mesma forma', 'similarmente', 'por exemplo',
    'em vista disso', 'assim sendo', 'dado que', 'mesmo que', 'ainda que',
    'seja como for', 'de qualquer modo', 'sobretudo', 'principalmente', 'especificamente',
    'particularmente', 'inclusive', 'como caso típico', 'vejamos o caso de'
];

// Thresholds based on HelpModal descriptions (adjust as needed)
const PASSIVE_VOICE_THRESHOLD_PERCENT = 5;
const ADVERB_THRESHOLD_PERCENT = 4;
const COMPLEX_SENTENCE_THRESHOLD_PERCENT = 15;
const COMPLEX_WORD_COUNT_THRESHOLD = 20;
// Dynamic thresholds for connectors will be calculated inside the function
const SHANNON_INDEX_LOW_THRESHOLD = 2.5; // Adjusted based on typical values
const SHANNON_INDEX_HIGH_THRESHOLD = 3.5; // Adjusted based on typical values

// --- Analysis Functions ---

export const analyzePassiveVoice = (sentences: string[]): PassiveVoiceResult => {
  let passiveCount = 0;
  const passiveSentences: SentenceInfo[] = [];

  sentences.forEach((sentence, index) => {
    const words = sentence.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    let foundPassive = false;
    for (let i = 0; i < words.length - 1; i++) {
      if (PASSIVE_INDICATORS.includes(words[i]) && (PARTICIPLES.includes(words[i + 1]) || (words[i+1]?.endsWith('ado') || words[i+1]?.endsWith('ido')))) {
        passiveCount++;
        passiveSentences.push({ index: index + 1, sentence: sentence.trim() });
        foundPassive = true;
        break;
      }
    }
  });

  const totalSentences = sentences.length;
  const percentage = totalSentences > 0 ? (passiveCount / totalSentences) * 100 : 0;
  let feedback = '';
  let level = '';

  if (percentage === 0) {
    feedback = 'Excelente! Nenhuma frase em voz passiva detectada.';
    level = 'Excelente';
  } else if (percentage <= PASSIVE_VOICE_THRESHOLD_PERCENT) {
    feedback = 'Bom uso da voz ativa. Poucas frases em voz passiva.';
    level = 'Bom';
  } else {
    feedback = `Atenção: ${passiveCount} frase(s) (${percentage.toFixed(0)}%) usam voz passiva. Tente reescrevê-las na voz ativa.`;
    level = 'Ruim';
  }

  return { count: passiveCount, sentences: passiveSentences, feedback, level };
};

export const analyzeAdverbs = (words: string[]): AdverbResult => {
  const totalWords = words.length;
  if (totalWords === 0) {
    return { count: 0, adverbs: [], feedback: 'Texto muito curto para análise.', level: 'N/A' };
  }

  const foundAdverbs = words.filter(word => {
    const lowerWord = word.toLowerCase().replace(/[.,!?;:]$/, '');
    return ADVERB_ENDINGS.some(ending => lowerWord.endsWith(ending)) || COMMON_ADVERBS.includes(lowerWord);
  });

  const adverbCount = foundAdverbs.length;
  const percentage = (adverbCount / totalWords) * 100;
  let feedback = '';
  let level = '';

  if (percentage <= ADVERB_THRESHOLD_PERCENT / 2) {
    feedback = 'Ótimo! Uso moderado de advérbios.';
    level = 'Excelente';
  } else if (percentage <= ADVERB_THRESHOLD_PERCENT) {
    feedback = 'Bom equilíbrio no uso de advérbios.';
    level = 'Bom';
  } else {
    feedback = `Atenção: ${adverbCount} advérbios (${percentage.toFixed(0)}%). Considere usar verbos mais fortes.`;
    level = 'Ruim';
  }

  const uniqueAdverbs = [...new Set(foundAdverbs.map(adv => adv.toLowerCase().replace(/[.,!?;:]$/, '')))];

  return { count: adverbCount, adverbs: uniqueAdverbs, feedback, level };
};

export const analyzeComplexSentences = (sentences: string[]): ComplexSentencesResult => {
  const complexSentencesList: ComplexSentenceInfo[] = [];

  sentences.forEach((sentence, index) => {
    const sentenceWords = sentence.split(/\s+/).filter(word => word.length > 0);
    const wordCount = sentenceWords.length;

    if (wordCount > COMPLEX_WORD_COUNT_THRESHOLD) {
        const syllableCount = sentenceWords.reduce((sum, word) => sum + countSyllables(word), 0);
        const commaCount = (sentence.match(/,/g) || []).length;
        const conjunctionCount = sentenceWords.filter(word => COMPLEX_CONJUNCTIONS.includes(word.toLowerCase())).length;

        complexSentencesList.push({
            index: index + 1,
            sentence: sentence.trim(),
            wordCount,
            syllableCount,
            commaCount,
            conjunctionCount,
            avgWordLength: sentenceWords.join('').length / wordCount || 0,
            complexityScore: wordCount
        });
    }
  });

  const complexCount = complexSentencesList.length;
  const totalSentences = sentences.length;
  const percentage = totalSentences > 0 ? (complexCount / totalSentences) * 100 : 0;
  let feedback = '';
  let level = '';

  if (percentage === 0) {
    feedback = 'Excelente! Todas as frases são concisas.';
    level = 'Excelente';
  } else if (percentage <= COMPLEX_SENTENCE_THRESHOLD_PERCENT) {
    feedback = 'Bom! A maioria das frases tem um comprimento adequado.';
    level = 'Bom';
  } else {
    feedback = `Atenção: ${complexCount} frase(s) (${percentage.toFixed(0)}%) são muito longas. Tente quebrá-las.`;
    level = 'Ruim';
  }

  return { count: complexCount, sentences: complexSentencesList, feedback, level };
};

export const analyzeDiscourseConnectors = (words: string[]): DiscourseConnectorsResult => {
    const totalWords = words.length;
    if (totalWords === 0) {
        return { count: 0, connectors: [], percentage: 0, feedback: 'Texto muito curto para análise.', level: 'N/A' };
    }

    const cleanedWords = words.map(word => word.toLowerCase().replace(/[.,!?;]/g, ''));
    const foundConnectorsList = cleanedWords.filter(word => DISCOURSE_CONNECTORS.includes(word));
    const count = foundConnectorsList.length;
    const percentage = (count / totalWords) * 100;

    // Dynamic thresholds based on text length
    let minPercentage, maxPercentage;
    if (totalWords < 50) {
        minPercentage = 0.5; // Adjusted slightly
        maxPercentage = 15; // Adjusted slightly
    } else if (totalWords <= 500) {
        minPercentage = 1.0; // Adjusted slightly
        maxPercentage = 6;
    } else {
        minPercentage = 1.5; // Adjusted slightly
        maxPercentage = 7;
    }

    let feedback = '';
    let level = '';

    if (percentage < minPercentage) {
        feedback = `Poucos conectores (${percentage.toFixed(1)}%). Adicione para melhorar a coesão.`;
        level = 'Ruim';
    } else if (percentage <= maxPercentage) {
        feedback = `Uso adequado de conectores (${percentage.toFixed(1)}%).`;
        level = 'Bom';
    } else {
        feedback = `Muitos conectores (${percentage.toFixed(1)}%). Reduza para evitar redundância.`;
        level = 'Ruim';
    }

    const uniqueConnectors = [...new Set(foundConnectorsList)];

    return {
        count,
        connectors: uniqueConnectors,
        percentage: parseFloat(percentage.toFixed(1)),
        feedback,
        level
    };
};

export const analyzeLexicalDiversity = (words: string[]): LexicalDiversityResult => {
    const totalWords = words.length;
    if (totalWords < 10) { // Need a minimum number of words for meaningful analysis
        return { index: 0, feedback: 'Texto muito curto para análise de diversidade.', level: 'N/A' };
    }

    const wordFreq: { [key: string]: number } = {};
    words.forEach(word => {
        const wordLower = word.toLowerCase();
        wordFreq[wordLower] = (wordFreq[wordLower] || 0) + 1;
    });

    let shannonIndex = 0;
    Object.values(wordFreq).forEach(freq => {
        const probability = freq / totalWords;
        if (probability > 0) { // Avoid log2(0)
            shannonIndex -= probability * Math.log2(probability);
        }
    });

    const index = parseFloat(shannonIndex.toFixed(2));
    let feedback = '';
    let level = '';

    if (index < SHANNON_INDEX_LOW_THRESHOLD) {
        feedback = `Baixa diversidade léxica (${index}). Use mais variedade de palavras.`;
        level = 'Ruim';
    } else if (index <= SHANNON_INDEX_HIGH_THRESHOLD) {
        feedback = `Diversidade léxica adequada (${index}). Bom equilíbrio!`;
        level = 'Bom';
    } else {
        feedback = `Alta diversidade léxica (${index}). Ótimo para textos criativos!`;
        level = 'Excelente';
    }

    return {
        index,
        feedback,
        level
    };
};


// --- Main Style Analysis Function ---

export const performStyleAnalysis = (text: string): StyleAnalysisData => {
  const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
  const words = text.split(/\s+/).filter(word => word.length > 0);

  const passiveVoice = analyzePassiveVoice(sentences);
  const adverbs = analyzeAdverbs(words);
  const complexSentences = analyzeComplexSentences(sentences);
  const discourseConnectors = analyzeDiscourseConnectors(words); // Added
  const lexicalDiversity = analyzeLexicalDiversity(words); // Added

  return {
    passiveVoice,
    adverbs,
    complexSentences,
    discourseConnectors, // Added
    lexicalDiversity, // Added
  };
};

// Function to get empty/initial state
export const getEmptyStyleAnalysis = (): StyleAnalysisData => {
    const emptyFeedback = 'Digite algum texto para análise.';
    return {
        passiveVoice: { count: 0, sentences: [], feedback: emptyFeedback, level: 'N/A' },
        adverbs: { count: 0, adverbs: [], feedback: emptyFeedback, level: 'N/A' },
        complexSentences: { count: 0, sentences: [], feedback: emptyFeedback, level: 'N/A' },
        discourseConnectors: { count: 0, connectors: [], percentage: 0, feedback: emptyFeedback, level: 'N/A' }, // Added
        lexicalDiversity: { index: 0, feedback: emptyFeedback, level: 'N/A' }, // Added
    };
};

