// src/utils/StyleAnalysis.tsx
import { countSyllables } from './BasicMetrics';
import { ThresholdConfig } from './contentProfiles';


// --- Types ---

export interface SentenceInfo {
  index: number;
  sentence: string;
}

export interface PassiveVoiceResult {
  count: number;
  sentences: SentenceInfo[];
  feedback: string;
  level: string; // e.g., 'Excelente', 'Bom', 'Ruim'
}

export interface AdverbResult {
  count: number;
  adverbs: string[]; // List of unique adverbs found
  feedback: string;
  level: string;
}

export interface ComplexSentenceInfo extends SentenceInfo {
  wordCount: number;
  syllableCount: number;
  avgWordLength: number;
  commaCount: number;
  conjunctionCount: number;
  complexityScore: number; // Enhanced score
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

export interface WordRepetitionInfo {
    word: string;
    count: number;
    locations: number[]; // Indices of sentences where it appears frequently
}

export interface WordRepetitionResult {
    repeatedWords: WordRepetitionInfo[];
    feedback: string;
    level: string;
}

export interface StyleAnalysisData {
  passiveVoice: PassiveVoiceResult;
  adverbs: AdverbResult;
  complexSentences: ComplexSentencesResult;
  discourseConnectors: DiscourseConnectorsResult;
  lexicalDiversity: LexicalDiversityResult;
  wordRepetition: WordRepetitionResult; // Added
}

// --- Constants ---

// Expanded list including auxiliary verbs for compound tenses
const PASSIVE_INDICATORS: string[] = [
  'foi', 'foram', 'é', 'são', 'era', 'eram', 'será', 'serão', 'está', 'estão',
  'esteve', 'estiveram', 'ser', 'estar', 'parecer', 'ficar', 'tornar-se', 'fui',
  'fomos', 'seja', 'sejam', 'fosse', 'fossem', 'for', 'forem', 'sendo', 'sido',
  'estado', 'ficado', // Auxiliaries for compound tenses
  'tem sido', 'têm sido', 'tinha sido', 'tinham sido', 'terá sido', 'terão sido',
  'esteja sendo', 'estejam sendo', 'estava sendo', 'estavam sendo', 'estará sendo', 'estarão sendo',
  'tenha sido', 'tenham sido', 'tivesse sido', 'tivessem sido', 'tiver sido', 'tiverem sido'
];

// Common irregular participles (add more as needed)
const PARTICIPLES: string[] = [
  'aberto', 'aceito', 'acendido', 'confundido', 'contundido', 'convencido',
  'coberto', 'corrigido', 'descoberto', 'despido', 'dito', 'eleito', 'elegido',
  'envolvido', 'enxugado', 'enxuto', 'escrito', 'expelido', 'expresso', 'expulso',
  'extinguido', 'extinto', 'feito', 'fritado', 'frito', 'ganhado', 'ganho',
  'gastado', 'gasto', 'imprimido', 'impresso', 'incluído', 'incorreto', 'inserido',
  'isento', 'limpado', 'limpo', 'matado', 'morto', 'omitido', 'omisso', 'pagado',
  'pago', 'pegado', 'pego', 'prendido', 'preso', 'rompido', 'roto', 'salvado',
  'salvo', 'segurado', 'seguro', 'soltado', 'solto', 'submergido', 'submerso',
  'suprimido', 'supresso', 'surpreendido', 'surpreso', 'suspendido', 'suspenso',
  'tingido', 'tinto', 'visto'
  // Add more common participles if needed
];

//const ADVERB_ENDINGS: string[] = ['mente'];
// Reviewed list of common adverbs
const COMMON_ADVERBS: string[] = [
  'não', 'mais', 'muito', 'já', 'quando', 'mesmo', 'depois', 'ainda', 'bem',
  'aqui', 'hoje', 'sempre', 'menos', 'agora', 'antes', 'tão', 'quase', 'nunca',
  'também', 'apenas', 'assim', 'então', 'lá', 'logo', 'fora', 'cedo', 'tarde',
  'acima', 'abaixo', 'mal', 'pouco', 'bastante', 'demais', 'ali', 'atrás',
  'adiante', 'dentro', 'perto', 'longe', 'certamente', 'realmente', 'possivelmente',
  'provavelmente', 'talvez', 'inclusive', 'somente', 'principalmente', 'especialmente',
  'debaixo', 'defronte', 'acaso', 'ademais', 'anteriormente', 'brevemente', 'completamente',
  'consequentemente', 'constantemente', 'cuidadosamente', 'devagar', 'dificilmente',
  'diretamente', 'efetivamente', 'erradamente', 'eventualmente', 'exatamente',
  'finalmente', 'frequentemente', 'geralmente', 'imediatamente', 'inicialmente',
  'junto', 'lentamente', 'melhor', 'pior', 'posteriormente', 'precisamente',
  'primeiramente', 'rapidamente', 'raramente', 'regularmente', 'sequer', 'simultaneamente',
  'subitamente', 'tampouco', 'totalmente', 'ultimamente', 'unicamente', 'vagamente',
  'verdadeiramente', 'virtualmente'
];

const COMPLEX_CONJUNCTIONS: string[] = [
  'e', 'ou', 'mas', 'porque', 'embora', 'enquanto', 'pois', 'portanto',
  'contudo', 'entretanto', 'assim', 'logo', 'quando', 'se', 'como', 'que',
  'nem', 'ora', 'quer', 'todavia', 'porém', 'senão', 'conquanto', 'caso',
  'conforme', 'segundo', 'para que', 'a fim de que', 'à medida que', 'à proporção que',
  'ainda que', 'mesmo que', 'posto que', 'visto que', 'já que', 'desde que'
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

// Stop words for repetition analysis (customize as needed)
const STOP_WORDS: string[] = [
    'a', 'o', 'as', 'os', 'um', 'uma', 'uns', 'umas',
    'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'nos', 'nas',
    'por', 'pelo', 'pela', 'pelos', 'pelas', 'com', 'sem', 'sob', 'sobre',
    'para', 'pra', 'perante', 'após', 'até', 'contra', 'desde', 'entre',
    'e', 'ou', 'mas', 'nem', 'que', 'se', 'como', 'quando', 'porque',
    'ser', 'estar', 'ter', 'haver', 'fazer', 'ir', 'vir', 'poder', 'saber',
    'querer', 'dizer', 'falar', 'ver', 'dar', 'ficar', 'dever', 'parecer',
    'eu', 'tu', 'ele', 'ela', 'você', 'nós', 'vós', 'eles', 'elas', 'vocês',
    'me', 'te', 'se', 'lhe', 'nos', 'vos', 'lhes', 'mim', 'ti', 'si',
    'meu', 'minha', 'meus', 'minhas', 'teu', 'tua', 'teus', 'tuas',
    'seu', 'sua', 'seus', 'suas', 'nosso', 'nossa', 'nossos', 'nossas',
    'vosso', 'vossa', 'vossos', 'vossas',
    'este', 'esta', 'estes', 'estas', 'isto', 'esse', 'essa', 'esses', 'essas', 'isso',
    'aquele', 'aquela', 'aqueles', 'aquelas', 'aquilo',
    'muito', 'pouco', 'mais', 'menos', 'bem', 'mal', 'tão', 'assim', 'já', 'ainda',
    'agora', 'hoje', 'ontem', 'amanhã', 'sempre', 'nunca', 'talvez', 'aqui', 'ali',
    'lá', 'cá', 'onde', 'aonde', 'donde', 'sim', 'não', 'tal', 'qual', 'quais',
    'quem', 'cujo', 'cuja', 'cujos', 'cujas', 'quanto', 'quanta', 'quantos', 'quantas',
    'todo', 'toda', 'todos', 'todas', 'outro', 'outra', 'outros', 'outras',
    'certo', 'certa', 'certos', 'certas', 'vário', 'vária', 'vários', 'várias',
    'mesmo', 'mesma', 'mesmos', 'mesmas', 'próprio', 'própria', 'próprios', 'próprias',
    'é', 'são', 'foi', 'foram', 'era', 'eram', 'será', 'serão', 'está', 'estão',
    'esteve', 'estiveram', 'tinha', 'tinham', 'tem', 'têm'
];

// Default thresholds (serão substituídos pelos thresholds do perfil selecionado)
//const DEFAULT_THRESHOLDS = {
//  passiveVoicePercent: 5,
//  adverbPercent: 4,
//  complexSentencePercent: 15,
//  repetitionGlobalPercent: 1.5,
//  complexWordCountThreshold: 20,
//  complexSyllableAvgThreshold: 1.8,
//  complexConjunctionThreshold: 3,
//  repetitionWindowSize: 100,
//  repetitionThresholdWindow: 3,
//  shannonIndexLowThreshold: 2.5,
//  shannonIndexHighThreshold: 3.5
// };

// --- Helper Functions ---

const getSentences = (text: string): string[] => {
    // Improved sentence splitting, handles more punctuation and edge cases
    return text
        .replace(/([.!?]+|\n+)\s*/g, '$1|') // Add delimiter after sentence-ending punctuation or newlines
        .split('|')
        .map(s => s.trim())
        .filter(s => s.length > 0);
};

const getWords = (text: string): string[] => {
    return text.toLowerCase().match(/\b\w+\b/g) || []; // Extract only words
};

const getNonStopWords = (words: string[]): string[] => {
    return words.filter(word => !STOP_WORDS.includes(word.toLowerCase()));
};

// --- Analysis Functions ---

export const analyzePassiveVoice = (sentences: string[], thresholds: ThresholdConfig): PassiveVoiceResult => {
  let passiveCount = 0;
  const passiveSentences: SentenceInfo[] = [];

  sentences.forEach((sentence, index) => {
    const words = sentence.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    let foundPassive = false;

    // Check for compound passive indicators first (e.g., "tem sido feito")
    for (let i = 0; i < words.length - 2; i++) {
        const compoundIndicator = `${words[i]} ${words[i+1]}`;
        if (PASSIVE_INDICATORS.includes(compoundIndicator) && (PARTICIPLES.includes(words[i + 2]) || words[i+2]?.endsWith('ado') || words[i+2]?.endsWith('ido'))) {
            passiveCount++;
            passiveSentences.push({ index: index + 1, sentence: sentence.trim() });
            foundPassive = true;
            break;
        }
    }

    // If not found as compound, check for simple indicators (e.g., "foi feito")
    if (!foundPassive) {
        for (let i = 0; i < words.length - 1; i++) {
            if (PASSIVE_INDICATORS.includes(words[i]) && (PARTICIPLES.includes(words[i + 1]) || words[i+1]?.endsWith('ado') || words[i+1]?.endsWith('ido'))) {
                passiveCount++;
                passiveSentences.push({ index: index + 1, sentence: sentence.trim() });
                break; // Found passive in this sentence
            }
        }
    }
  });

  const totalSentences = sentences.length;
  const percentage = totalSentences > 0 ? (passiveCount / totalSentences) * 100 : 0;
  
  // Usar o threshold do perfil selecionado
  const passiveVoiceThreshold = thresholds.passiveVoicePercent;
  
  let feedback = 
    percentage === 0 ? 'Excelente! Nenhuma frase em voz passiva detectada.' :
    percentage <= passiveVoiceThreshold ? 'Bom uso da voz ativa. Poucas frases em voz passiva.' :
    `Atenção: ${passiveCount} frase(s) (${percentage.toFixed(0)}%) usam voz passiva. Tente reescrevê-las na voz ativa.`;
  
  let level = 
    percentage === 0 ? 'Excelente' :
    percentage <= passiveVoiceThreshold ? 'Bom' :
    'Ruim';

  return { count: passiveCount, sentences: passiveSentences, feedback, level };
};

export const analyzeAdverbs = (words: string[], thresholds: ThresholdConfig): AdverbResult => {
  const totalWords = words.length;
  if (totalWords === 0) {
    return { count: 0, adverbs: [], feedback: 'Texto muito curto para análise.', level: 'N/A' };
  }

  const foundAdverbs = words.filter(word => {
    const lowerWord = word.toLowerCase().replace(/[.,!?;:]$/, '');
    // Basic check for -mente, avoiding very short words or potential nouns/adjectives
    const isMenteAdverb = lowerWord.endsWith('mente') && lowerWord.length > 5 && !['documente', 'comente', 'alimente', 'ferramente', 'semente'].includes(lowerWord); // Add more exceptions if needed
    return isMenteAdverb || COMMON_ADVERBS.includes(lowerWord);
  });

  const adverbCount = foundAdverbs.length;
  const percentage = (adverbCount / totalWords) * 100;
  
  // Usar o threshold do perfil selecionado
  const adverbThreshold = thresholds.adverbPercent;
  
  let feedback = 
    percentage <= adverbThreshold / 2 ? 'Ótimo! Uso moderado de advérbios.' :
    percentage <= adverbThreshold ? 'Bom equilíbrio no uso de advérbios.' :
    `Atenção: ${adverbCount} advérbios (${percentage.toFixed(0)}%). Considere usar verbos mais fortes ou descrições mais diretas.`;
  
  let level = 
    percentage <= adverbThreshold / 2 ? 'Excelente' :
    percentage <= adverbThreshold ? 'Bom' :
    'Ruim';

  const uniqueAdverbs = [...new Set(foundAdverbs.map(adv => adv.toLowerCase().replace(/[.,!?;:]$/, '')))];

  return { count: adverbCount, adverbs: uniqueAdverbs, feedback, level };
};

export const analyzeComplexSentences = (
  sentences: string[],
  thresholds: ThresholdConfig,
): ComplexSentencesResult => {
  const complexSentencesList: ComplexSentenceInfo[] = [];

  // Usar os thresholds do perfil selecionado
  const complexWordCountThreshold = thresholds.complexWordCountThreshold;
  const complexSyllableAvgThreshold = thresholds.complexSyllableAvgThreshold;
  const complexConjunctionThreshold = thresholds.complexConjunctionThreshold;

  sentences.forEach((sentence, index) => {
    const sentenceWords = sentence.split(/\s+/).filter(word => word.length > 0);
    const wordCount = sentenceWords.length;

    if (wordCount > 0) { // Avoid division by zero for empty sentences
        const syllableCount = sentenceWords.reduce((sum, word) => sum + countSyllables(word), 0);
        const avgSyllablesPerWord = syllableCount / wordCount;
        const commaCount = (sentence.match(/,/g) || []).length;
        const conjunctionCount = sentenceWords.filter(word => COMPLEX_CONJUNCTIONS.includes(word.toLowerCase())).length;
        const avgWordLength = sentenceWords.join('').length / wordCount;

        // Enhanced Complexity Score Calculation (weights can be adjusted)
        let complexityScore = 0;
        if (wordCount > complexWordCountThreshold) complexityScore += 1;
        if (avgSyllablesPerWord > complexSyllableAvgThreshold) complexityScore += 1;
        if (conjunctionCount >= complexConjunctionThreshold) complexityScore += 1;
        if (commaCount > conjunctionCount + 1) complexityScore += 0.5; // Many commas might indicate complexity

        // Consider a sentence complex if score is high enough or word count is very high
        if (complexityScore >= 2 || wordCount > complexWordCountThreshold * 1.5) {
            complexSentencesList.push({
                index: index + 1,
                sentence: sentence.trim(),
                wordCount,
                syllableCount,
                avgWordLength: parseFloat(avgWordLength.toFixed(1)),
                commaCount,
                conjunctionCount,
                complexityScore: parseFloat(complexityScore.toFixed(1))
            });
        }
    }
  });

  const complexCount = complexSentencesList.length;
  const totalSentences = sentences.length;
  const percentage = totalSentences > 0 ? (complexCount / totalSentences) * 100 : 0;
  
  // Usar o threshold do perfil selecionado
  const complexSentenceThreshold = thresholds.complexSentencePercent;
  
  let feedback = 
    complexCount === 0 ? 'Excelente! Todas as frases parecem ter boa fluidez.' :
    percentage <= complexSentenceThreshold ? 'Bom! A maioria das frases tem um comprimento e complexidade adequados.' :
    `Atenção: ${complexCount} frase(s) (${percentage.toFixed(0)}%) parecem longas ou complexas. Tente quebrá-las ou simplificá-las para melhor legibilidade.`;
  
  let level = 
    complexCount === 0 ? 'Excelente' :
    percentage <= complexSentenceThreshold ? 'Bom' :
    'Ruim';

  return { count: complexCount, sentences: complexSentencesList, feedback, level };
};

export const analyzeDiscourseConnectors = (words: string[]): DiscourseConnectorsResult => {
    const totalWords = words.length;
    if (totalWords === 0) {
        return { count: 0, connectors: [], percentage: 0, feedback: 'Texto muito curto para análise.', level: 'N/A' };
    }

    const cleanedWords = words.map(word => word.toLowerCase().replace(/[.,!?;]/g, ''));
    // Basic check for multi-word connectors (needs improvement for robustness)
    let count = 0;
    const foundConnectorsList: string[] = [];
    for (let i = 0; i < cleanedWords.length; i++) {
        let found = false;
        // Check 3-word connectors first
        if (i < cleanedWords.length - 2) {
            const threeWords = `${cleanedWords[i]} ${cleanedWords[i+1]} ${cleanedWords[i+2]}`;
            if (DISCOURSE_CONNECTORS.includes(threeWords)) {
                foundConnectorsList.push(threeWords);
                count++;
                i += 2; // Skip next two words
                found = true;
            }
        }
        // Check 2-word connectors
        if (!found && i < cleanedWords.length - 1) {
            const twoWords = `${cleanedWords[i]} ${cleanedWords[i+1]}`;
            if (DISCOURSE_CONNECTORS.includes(twoWords)) {
                foundConnectorsList.push(twoWords);
                count++;
                i += 1; // Skip next word
                found = true;
            }
        }
        // Check 1-word connectors
        if (!found && DISCOURSE_CONNECTORS.includes(cleanedWords[i])) {
            foundConnectorsList.push(cleanedWords[i]);
            count++;
        }
    }

    const percentage = (count / totalWords) * 100;

    let minPercentage, maxPercentage;
    if (totalWords < 50) { minPercentage = 0.5; maxPercentage = 15; }
    else if (totalWords <= 500) { minPercentage = 1.0; maxPercentage = 8; } // Adjusted max
    else { minPercentage = 1.5; maxPercentage = 7; }

    let feedback = 
        percentage < minPercentage ? `Poucos conectores (${percentage.toFixed(1)}%). Adicione para melhorar a coesão e o fluxo do texto.` :
        percentage <= maxPercentage ? `Uso adequado de conectores (${percentage.toFixed(1)}%). O texto flui bem.` :
        `Muitos conectores (${percentage.toFixed(1)}%). Considere reduzir para evitar redundância e tornar o texto mais direto.`;
    
    let level = 
        percentage < minPercentage ? 'Ruim' :
        percentage <= maxPercentage ? 'Bom' :
        'Ruim';

    const uniqueConnectors = [...new Set(foundConnectorsList)];

    return {
        count,
        connectors: uniqueConnectors,
        percentage: parseFloat(percentage.toFixed(1)),
        feedback,
        level
    };
};

export const analyzeLexicalDiversity = (
  words: string[],
  thresholds: ThresholdConfig,
): LexicalDiversityResult => {
    const totalWords = words.length;
    if (totalWords < 10) {
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
        if (probability > 0) {
            shannonIndex -= probability * Math.log2(probability);
        }
    });

    const index = parseFloat(shannonIndex.toFixed(2));
    
    // Usar os thresholds do perfil selecionado
      const shannonIndexLowThreshold = thresholds.shannonIndexLow;
      const shannonIndexHighThreshold = thresholds.shannonIndexHigh;
    
    let feedback = 
        index < shannonIndexLowThreshold ? `Baixa diversidade léxica (${index}). Tente usar sinônimos e variar mais as palavras.` :
        index <= shannonIndexHighThreshold ? `Diversidade léxica adequada (${index}). Bom equilíbrio!` :
        `Alta diversidade léxica (${index}). Excelente variedade de vocabulário!`;
    
    let level = 
        index < shannonIndexLowThreshold ? 'Ruim' :
        index <= shannonIndexHighThreshold ? 'Bom' :
        'Excelente';

    return { index, feedback, level };
};

export const analyzeWordRepetition = (
  words: string[], 
  sentences: string[],
  thresholds: ThresholdConfig,
): WordRepetitionResult => {
    const nonStopWords = getNonStopWords(words);
    const totalNonStopWords = nonStopWords.length;

    if (totalNonStopWords < 20) { // Need enough non-stop words
        return { repeatedWords: [], feedback: 'Texto muito curto para análise de repetição.', level: 'N/A' };
    }

    // Usar os thresholds do perfil selecionado
    const repetitionWindowSize = thresholds.repetitionWindowSize;
    const repetitionThresholdWindow = thresholds.repetitionThresholdWindow;
    const repetitionGlobalPercent = thresholds.repetitionGlobalPercent;

    const wordFreq: { [key: string]: { count: number; sentenceIndices: Set<number> } } = {};
    const wordPositions: { [key: string]: number[] } = {};

    // First pass: count frequencies and store positions
    nonStopWords.forEach((word, index) => {
        const lowerWord = word.toLowerCase();
        if (!wordFreq[lowerWord]) {
            wordFreq[lowerWord] = { count: 0, sentenceIndices: new Set() };
            wordPositions[lowerWord] = [];
        }
        wordFreq[lowerWord].count++;
        wordPositions[lowerWord].push(index);
    });

    // Second pass: find sentence indices for frequent words
    sentences.forEach((sentence, sentenceIndex) => {
        const sentenceNonStopWords = getNonStopWords(getWords(sentence));
        sentenceNonStopWords.forEach(word => {
            const lowerWord = word.toLowerCase();
            if (wordFreq[lowerWord]) { // Check if it's a non-stop word counted before
                wordFreq[lowerWord].sentenceIndices.add(sentenceIndex + 1);
            }
        });
    });

    const repeatedWordsList: WordRepetitionInfo[] = [];

    // Analyze frequencies and proximity
    Object.entries(wordFreq).forEach(([word, data]) => {
        const globalPercentage = (data.count / totalNonStopWords) * 100;
        let isRepeatedInWindow = false;

        // Check proximity (within window)
        const positions = wordPositions[word];
        if (positions.length >= repetitionThresholdWindow) {
            for (let i = 0; i <= positions.length - repetitionThresholdWindow; i++) {
                if (positions[i + repetitionThresholdWindow - 1] - positions[i] < repetitionWindowSize) {
                    isRepeatedInWindow = true;
                    break;
                }
            }
        }

        // Flag as repeated if globally frequent OR repeated closely
        if (globalPercentage > repetitionGlobalPercent || isRepeatedInWindow) {
            repeatedWordsList.push({
                word: word,
                count: data.count,
                locations: Array.from(data.sentenceIndices).sort((a, b) => a - b)
            });
        }
    });

    // Sort by count descending
    repeatedWordsList.sort((a, b) => b.count - a.count);

    const repeatedCount = repeatedWordsList.length;
    let feedback = 
        repeatedCount === 0 ? 'Excelente! Nenhuma repetição excessiva de palavras detectada.' :
        repeatedCount <= 3 ? `Uso moderado de repetições. ${repeatedCount} palavra(s) aparecem com frequência.` :
        `Atenção: ${repeatedCount} palavras se repetem excessivamente. Tente usar sinônimos ou reestruturar as frases.`;
    
    let level = 
        repeatedCount === 0 ? 'Excelente' :
        repeatedCount <= 3 ? 'Bom' :
        'Ruim';

    return { repeatedWords: repeatedWordsList.slice(0, 10), feedback, level }; // Limit to top 10 for display
};


// --- Main Style Analysis Function ---

export const performStyleAnalysis = (
  text: string,
  thresholds: ThresholdConfig
): StyleAnalysisData => {
  const sentences = getSentences(text);
  const words = getWords(text)

  const passiveVoice = analyzePassiveVoice(sentences, thresholds);
  const adverbs = analyzeAdverbs(words, thresholds);
  const complexSentences = analyzeComplexSentences(sentences, thresholds);
  const discourseConnectors = analyzeDiscourseConnectors(words);
  const lexicalDiversity = analyzeLexicalDiversity(words, thresholds);
  const wordRepetition = analyzeWordRepetition(words, sentences, thresholds);

  return {
    passiveVoice,
    adverbs,
    complexSentences,
    discourseConnectors,
    lexicalDiversity,
    wordRepetition,
  };
};

// Function to get empty/initial state
export const getEmptyStyleAnalysis = (): StyleAnalysisData => {
    const emptyFeedback = 'Digite algum texto para análise.';
    return {
        passiveVoice: { count: 0, sentences: [], feedback: emptyFeedback, level: 'N/A' },
        adverbs: { count: 0, adverbs: [], feedback: emptyFeedback, level: 'N/A' },
        complexSentences: { count: 0, sentences: [], feedback: emptyFeedback, level: 'N/A' },
        discourseConnectors: { count: 0, connectors: [], percentage: 0, feedback: emptyFeedback, level: 'N/A' },
        lexicalDiversity: { index: 0, feedback: emptyFeedback, level: 'N/A' },
        wordRepetition: { repeatedWords: [], feedback: emptyFeedback, level: 'N/A' },
    };
};
