// src/utils/AdvancedMetrics.tsx

import { countSyllables, BasicMetricsData, calculateBasicMetrics } from "./BasicMetrics"; 
import { ThresholdConfig } from './contentProfiles';
import { StyleAnalysisData } from "./StyleAnalysis"


// --- Interfaces ---

export interface ReadabilityIndexResult {
  score: number;
  level: string;
  feedback: string;
}

export interface ReadabilityIndices {
  jurbiX: ReadabilityIndexResult;
  gunningFog: ReadabilityIndexResult;
  fleschKincaidReadingEase: ReadabilityIndexResult;
  smogIndex: ReadabilityIndexResult;
  colemanLiauIndex: ReadabilityIndexResult;
  gulpeaseIndex?: ReadabilityIndexResult;
  overallReadability: ReadabilityIndexResult; // Added
}

export interface SentimentScore {
  neg: number;
  neu: number;
  pos: number;
  compound: number;
  sentiment: "positivo" | "negativo" | "neutro";
}

export interface RedundancyResult {
  index: number;
  level: string;
  feedback: string;
}

export interface ToneAnalysisResult {
  type: "formal" | "informal" | "técnico" | "persuasivo" | "neutro";
  level: string;
  feedback: string;
}

export interface ClarityResult {
  score: number; // 0-100, higher is clearer
  level: string;
  feedback: string;
}

export interface ConcisenessResult {
  verbosePhrasesFound: { phrase: string; suggestion: string, sentenceIndex: number }[];
  verbosePhraseCount: number;
  level: string;
  feedback: string;
}

export interface FormalityResult {
  formalityLevel: "muito formal" | "formal" | "neutro" | "informal" | "muito informal";
  score: number; // e.g., -100 to +100
  level: string;
  feedback: string;
}

export interface AdvancedMetricsData {
  readability: ReadabilityIndices;
  redundancy: RedundancyResult;
  textLengthWords: number;
  textLengthChars: number;
  sentiment: SentimentScore;
  feedbackComprimento: string;
  clarity: ClarityResult;
  conciseness: ConcisenessResult;
  formality: FormalityResult;
  tone: ToneAnalysisResult; // Adicionado
}

// --- Lexical Resources (Placeholders - to be expanded or loaded from lexico.json) ---
const FORMAL_WORDS = ["outrossim", "destarte", "hodiernamente", "doravante", "porquanto", "entrementes", "comunique-se", "cumpra-se", "respeitosamente", "cordialmente"];
const INFORMAL_WORDS = ["tipo", "mano", "mina", "valeu", "falou", "aí", "né", "tá", "pra", "vc", "pq", "tb", "blz"];
const CONTRACTIONS = ["pra", "pro", "pras", "pros", "num", "numa", "nuns", "numas", "dum", "duma", "duns", "dumas", "tô", "tá", "tamos", "tão"];
const TECHNICAL_WORDS = ["algoritmo", "implementação", "metodologia", "paradigma", "framework", "infraestrutura", "otimização", "parametrização", "protocolo", "requisito"];
const PERSUASIVE_WORDS = ["incrível", "extraordinário", "revolucionário", "essencial", "fundamental", "crucial", "imperdível", "exclusivo", "limitado", "garantido"];

const VERBOSE_PHRASES: { [key: string]: string } = {
  "devido ao fato de que": "porque",
  "com o objetivo de": "para",
  "a fim de": "para",
  "apesar do fato de que": "embora",
  "no que diz respeito a": "sobre",
  "tem a capacidade de": "pode",
  "é capaz de": "pode",
  "chegar a uma conclusão": "concluir",
  "fazer uma análise de": "analisar",
  "em virtude de": "devido a",
  "com a finalidade de": "para",
  "no momento atual": "agora",
  "na eventualidade de": "se",
  "um grande número de": "muitos",
  "de forma a": "para"
};

// --- Helper Functions ---

const countComplexWords = (words: string[]): number => {
  return words.filter(word => word.length > 6).length;
};

const countPolysyllables = (words: string[]): number => {
  return words.filter(word => countSyllables(word) >= 3).length;
};

const getSentences = (text: string): string[] => {
    return text
        .replace(/([.!?]+|\n+)\s*/g, '$1|') // Add delimiter after sentence-ending punctuation or newlines
        .split("|")
        .map(s => s.trim())
        .filter(s => s.length > 0);
};

const getWords = (text: string): string[] => {
    return text.toLowerCase().match(/\b[\w\[À-ú\]\[-\]]+\b/g) || []; // Keep hyphens and accented chars
};

// --- Readability Calculations ---

const calculateGunningFog = (totalWords: number, totalSentences: number, complexWords: number, thresholds: ThresholdConfig): ReadabilityIndexResult => {
  let score = 0;
  if (totalSentences > 0 && totalWords > 0) {
    const wordsPerSentence = totalWords / totalSentences;
    const percentComplexWords = (complexWords / totalWords) * 100;
    score = 0.4 * (wordsPerSentence + percentComplexWords);
  }
  score = parseFloat(score.toFixed(1));
  let level = "N/A", feedback = "Texto muito curto para análise.";
  if (totalWords > 0) {
      // Usa o limiar do perfil. Ex: se o máximo para "Bom" é 12, Muito Fácil seria < 8, Fácil < 12, etc.
      if (score < thresholds.gunningFogMax - 4) { level = "Muito Fácil"; feedback = "Texto muito fácil, acessível para leitores com ensino fundamental."; }
      else if (score <= thresholds.gunningFogMax) { level = "Fácil"; feedback = "Texto fácil, adequado para leitores com ensino médio."; }
      else if (score < thresholds.gunningFogMax + 4) { level = "Médio"; feedback = "Texto de dificuldade média, requer ensino superior ou conhecimento técnico."; }
      else { level = "Difícil"; feedback = "Texto difícil, possivelmente técnico ou acadêmico."; }
  }
  return { score, level, feedback };
};

const calculateFleschKincaidReadingEase = (totalWords: number, totalSentences: number, totalSyllables: number, thresholds: ThresholdConfig): ReadabilityIndexResult => {
  let score = 0;
  if (totalSentences > 0 && totalWords > 0) {
    score = 206.835 - 1.015 * (totalWords / totalSentences) - 84.6 * (totalSyllables / totalWords);
  }
  score = parseFloat(Math.max(0, Math.min(100, score)).toFixed(1));
  let level = "N/A", feedback = "Texto muito curto para análise.";
  if (totalWords > 0) {
      if (score >= 90) { level = "Muito Fácil"; feedback = "Texto muito fácil, acessível para leitores de 5ª série."; }
      else if (score >= thresholds.fleschKincaidMin) { level = "Fácil"; feedback = `Leitura fácil, acima do limiar de ${thresholds.fleschKincaidMin} do perfil.`; }
      else if (score >= 30) { level = "Médio"; feedback = "Texto de dificuldade média, adequado para leitores com ensino médio."; }
      else { level = "Difícil"; feedback = "Texto difícil, nível universitário ou técnico."; }
  }
  return { score, level, feedback };
};

const calculateSmogIndex = (totalSentences: number, polysyllables: number, thresholds: ThresholdConfig): ReadabilityIndexResult => {
  let score = 0;
  if (totalSentences > 0 && polysyllables >= 0) {
      let polysyllablesForCalc = polysyllables;
      if (totalSentences < 30 && totalSentences > 0) {
          polysyllablesForCalc = polysyllables * (30 / totalSentences);
      }
      score = 1.0430 * Math.sqrt(polysyllablesForCalc) + 3.1291;
  }
  score = parseFloat(score.toFixed(1));
  let level = "N/A", feedback = "Texto muito curto para análise.";
  if (totalSentences > 0) {
      if (score < thresholds.smogMax - 3) { level = "Muito Fácil"; feedback = "Texto muito fácil, acessível para leitores de 5ª série."; }
      else if (score < thresholds.smogMax) { level = "Fácil"; feedback = "Texto fácil, adequado para leitores de 6ª a 9ª série."; }
      else if (score < thresholds.smogMax - 4) { level = "Médio"; feedback = "Texto médio, adequado para leitores com ensino médio."; }
      else { level = "Difícil"; feedback = "Texto difícil, nível universitário ou técnico."; }
  }
  return { score, level, feedback };
};

const calculateColemanLiauIndex = (totalWords: number, totalSentences: number, totalLetters: number, thresholds: ThresholdConfig): ReadabilityIndexResult => {
  let score = 0;
  if (totalWords > 0) {
    const L = (totalLetters / totalWords) * 100;
    const S = (totalSentences / totalWords) * 100;
    score = 0.0588 * L - 0.296 * S - 15.8;
  }
  score = parseFloat(score.toFixed(1));
  let level = "N/A", feedback = "Texto muito curto para análise.";
  if (totalWords > 0) {
      if (score < thresholds.colemanLiauMax - 4) { level = "Muito Fácil"; feedback = "Texto muito fácil, acessível para leitores de 5ª série."; }
      else if (score < thresholds.colemanLiauMax) { level = "Fácil"; feedback = "Texto fácil, adequado para leitores de 6ª a 8ª série."; }
      else if (score < thresholds.colemanLiauMax + 4) { level = "Médio"; feedback = "Texto de dificuldade média, adequado para leitores com ensino médio."; }
      else { level = "Difícil"; feedback = "Texto difícil, nível universitário ou técnico."; }
  }
  return { score, level, feedback };
};

const calculateGulpeaseIndex = (totalWords: number, totalSentences: number, totalLetters: number): ReadabilityIndexResult => {
    let score = 0;
    if (totalWords > 0 && totalSentences > 0) {
        const gulpease = 89 - (10 * totalLetters / totalWords) + (300 * totalSentences / totalWords);
        score = parseFloat(Math.max(0, Math.min(100, gulpease)).toFixed(1));
    }
    let level = "N/A", feedback = "Texto muito curto para análise Gulpease.";
    if (totalWords > 0) {
        if (score >= 80) { level = "Muito Fácil"; feedback = "Leitura muito fácil (ensino fundamental)."; }
        else if (score >= 60) { level = "Fácil"; feedback = "Leitura fácil (ensino fundamental completo)."; }
        else if (score >= 40) { level = "Médio"; feedback = "Leitura de dificuldade média (ensino médio)."; }
        else { level = "Difícil"; feedback = "Leitura difícil (ensino superior)."; }
    }
    return { score, level, feedback };
};

// JurbiX - Placeholder for StyleAnalysisData integration
const calculateJurbiX = (
    text: string,
    basicMetrics: BasicMetricsData,
    readabilityIndices: Omit<ReadabilityIndices, "jurbiX" | "overallReadability">,
    styleAnalysisData: StyleAnalysisData, // <<< DADOS DE ESTILO
    thresholds: ThresholdConfig // <<< THRESHOLDS DO PERFIL
): ReadabilityIndexResult => {
    const { words: totalWords, charsWithSpaces: totalCaracteres, sentences: totalSentences, paragraphs: totalParagrafos, uniqueWords: palavrasUnicas } = basicMetrics;
    const { fleschKincaidReadingEase, gunningFog, smogIndex, colemanLiauIndex, gulpeaseIndex } = readabilityIndices;

    if (totalWords === 0 || totalParagrafos === 0) {
        return { score: 0, level: "N/A", feedback: "Texto muito curto para análise JurbiX." };
    }

    const textLengthFactor = Math.min(1, totalCaracteres / 1000);
    const fleschKincaidNorm = fleschKincaidReadingEase.score;
    const gunningFogNorm = Math.max(0, 100 - (gunningFog.score * (4 / Math.max(0.1, textLengthFactor)))); // Adjusted weight
    const smogNorm = Math.max(0, 100 - (smogIndex.score * (4 / Math.max(0.1, textLengthFactor))));     // Adjusted weight
    const colemanLiauNorm = Math.max(0, 100 - (colemanLiauIndex.score * (4 / Math.max(0.1, textLengthFactor)))); // Adjusted weight
    const gulpeaseNorm = gulpeaseIndex?.score || fleschKincaidNorm; // Use Flesch if Gulpease not available

    let jurbiXBase = (fleschKincaidNorm + gunningFogNorm + smogNorm + colemanLiauNorm + gulpeaseNorm) / 5;

    const uniqueWordRatio = (palavrasUnicas / totalWords) * 100;
    const uniqueWordBonus = Math.min(15, uniqueWordRatio / 4); // Adjusted bonus
    const hasList = text.includes("\n1.") || text.includes("\n-") || text.includes("\n*");
    const listBonus = hasList ? 3 : 0; // Adjusted bonus
    const avgWordsPerParagraph = totalWords / totalParagrafos;
    const shortParagraphBonus = avgWordsPerParagraph < 75 ? 3 : (avgWordsPerParagraph > 150 ? -3 : 0); // Adjusted bonus/penalty
    const clarityBoost = listBonus + shortParagraphBonus;

    // Placeholder for penalties from StyleAnalysisData
    const passiveVoicePercent = styleAnalysisData.passiveVoice.count / Math.max(1, totalSentences) * 100;
    const adverbPercent = styleAnalysisData.adverbs.count / Math.max(1, totalWords) * 100;
    const complexSentencesPercent = styleAnalysisData.complexSentences.count / Math.max(1, totalSentences) * 100;
    
    const stylePenalty = 
        (passiveVoicePercent > thresholds.passiveVoicePercent ? (passiveVoicePercent - thresholds.passiveVoicePercent) * 0.2 : 0) +
        (adverbPercent > thresholds.adverbPercent ? (adverbPercent - thresholds.adverbPercent) * 0.2 : 0) +
        (complexSentencesPercent > thresholds.complexSentencePercent ? (complexSentencesPercent - thresholds.complexSentencePercent) * 0.2 : 0);

    let finalJurbiX = jurbiXBase + uniqueWordBonus + clarityBoost - stylePenalty;
    finalJurbiX = Math.max(0, Math.min(100, finalJurbiX));
    finalJurbiX = parseFloat(finalJurbiX.toFixed(1));

    let level = "N/A", feedback = "";
    // Usa os thresholds do perfil para JurbiX
    if (finalJurbiX >= thresholds.readabilityJurbiXTarget) { level = "Excelente"; feedback = "Legibilidade excelente! Texto claro, conciso e envolvente."; }
    else if (finalJurbiX >= thresholds.readabilityJurbiXMin) { level = "Bom"; feedback = "Boa legibilidade. O texto é fácil de entender pela maioria."; }
    else if (finalJurbiX >= 45) { level = "Médio"; feedback = "Legibilidade razoável. Algumas partes podem ser simplificadas."; }
    else { level = "Difícil"; feedback = "Legibilidade baixa. Considere simplificar frases e vocabulário."; }

    return { score: finalJurbiX, level, feedback };
};
const calculateOverallReadability = (indices: Omit<ReadabilityIndices, "overallReadability">): ReadabilityIndexResult => {
    // Normalize scores to a 0-100 scale where higher is better
    // Flesch-Kincaid and Gulpease are already 0-100 (higher is better)
    // Gunning Fog, SMOG, Coleman-Liau are grade levels (lower is better)
    const normalizeGradeLevel = (score: number, maxGrade = 20) => Math.max(0, 100 - (score / maxGrade) * 100);

    const fkScore = indices.fleschKincaidReadingEase.score;
    const fogScoreNormalized = normalizeGradeLevel(indices.gunningFog.score);
    const smogScoreNormalized = normalizeGradeLevel(indices.smogIndex.score);
    const colemanLiauNormalized = normalizeGradeLevel(indices.colemanLiauIndex.score);
    const gulpeaseScore = indices.gulpeaseIndex?.score || fkScore; // Use FK if Gulpease not present
    const jurbixScore = indices.jurbiX.score;

    const averageScore = (fkScore + fogScoreNormalized + smogScoreNormalized + colemanLiauNormalized + gulpeaseScore + jurbixScore) / 6;
    const score = parseFloat(averageScore.toFixed(1));

    let level = "N/A", feedback = "";
    if (score >= 80) { level = "Excelente"; feedback = "A legibilidade geral do texto é excelente, muito acessível."; }
    else if (score >= 65) { level = "Bom"; feedback = "A legibilidade geral do texto é boa."; }
    else if (score >= 45) { level = "Médio"; feedback = "A legibilidade geral do texto é média. Pode haver pontos de dificuldade."; }
    else { level = "Difícil"; feedback = "A legibilidade geral do texto é baixa. Recomenda-se revisão para simplificar."; }
    return { score, level, feedback };
};

// --- Redundancy Calculation ---
const calculateRedundancy = (words: string[], thresholds: ThresholdConfig): RedundancyResult => {
  let index = 0;
  if (words.length > 0) {
      const wordFreq: { [key: string]: number } = {};
      words.forEach(word => {
        const lowerWord = word.toLowerCase().replace(/[.,!?;:"\\'()]/g, "");
        if (lowerWord.length > 0) {
            wordFreq[lowerWord] = (wordFreq[lowerWord] || 0) + 1;
        }
      });
      const repeatedWordsCount = Object.values(wordFreq)
        .filter(freq => freq > 1)
        .reduce((sum, freq) => sum + (freq - 1), 0);
      index = (repeatedWordsCount / words.length) * 100;
  }
  index = parseFloat(index.toFixed(1));
  let level = "N/A", feedback = "Texto muito curto para análise.";
  if (words.length > 0) {
      if (index < thresholds.redundancyPercentMaxBom / 2) { level = "Excelente"; feedback = "Excelente! Pouca redundância no texto, vocabulário variado."; }
      else if (index < thresholds.redundancyPercentMaxBom) { level = "Bom"; feedback = "Bom! A redundância está aceitável, mas pode ser melhorada com sinônimos."; }
      else if (index < thresholds.redundancyPercentMaxRegular) { level = "Regular"; feedback = "Regular. Há redundância perceptível. Tente variar mais as palavras e usar sinônimos."; }
      else { level = "Ruim"; feedback = "Ruim. Muita redundância. Considere revisar e usar sinônimos para evitar repetições."; }
  }
  return { index, level, feedback };
};

// --- Sentiment Analysis ---
interface Lexico {
  positive: string[]; negative: string[]; intensifiers: string[]; negations: string[];
  bigramsPositive?: string[]; bigramsNegative?: string[];
  positiveEmojis?: string[]; negativeEmojis?: string[];
  synonyms?: { [key: string]: string[] };
}

const analyzeSentiment = (text: string, lexico: Lexico): SentimentScore => {
  const words = getWords(text);
  const sentences = getSentences(text);
  
  if (words.length === 0) {
    return { neg: 0, neu: 1, pos: 0, compound: 0, sentiment: "neutro" };
  }

  let posCount = 0, negCount = 0, neuCount = 0;
  let compound = 0;

  // Simplified sentiment analysis
  words.forEach(word => {
    const lowerWord = word.toLowerCase();
    if (lexico.positive.includes(lowerWord)) {
      posCount++;
    } else if (lexico.negative.includes(lowerWord)) {
      negCount++;
    } else {
      neuCount++;
    }
  });

  // Check for emojis if available
  if (lexico.positiveEmojis && lexico.negativeEmojis) {
    lexico.positiveEmojis.forEach(emoji => {
      if (text.includes(emoji)) posCount += 2; // Emojis have stronger weight
    });
    lexico.negativeEmojis.forEach(emoji => {
      if (text.includes(emoji)) negCount += 2; // Emojis have stronger weight
    });
  }

  // Check for bigrams if available
  if (lexico.bigramsPositive && lexico.bigramsNegative) {
    for (let i = 0; i < words.length - 1; i++) {
      const bigram = `${words[i]} ${words[i+1]}`.toLowerCase();
      if (lexico.bigramsPositive.includes(bigram)) {
        posCount += 2; // Bigrams have stronger weight
      } else if (lexico.bigramsNegative.includes(bigram)) {
        negCount += 2; // Bigrams have stronger weight
      }
    }
  }

  // Calculate normalized scores
  const total = posCount + negCount + neuCount;
  const pos = posCount / total;
  const neg = negCount / total;
  const neu = neuCount / total;
  
  // Calculate compound score (-1 to 1)
  compound = (posCount - negCount) / (posCount + negCount + 0.001);
  compound = Math.max(-1, Math.min(1, compound));

  // Determine sentiment
  let sentiment: "positivo" | "negativo" | "neutro" = "neutro";
  if (compound > 0.05) {
    sentiment = "positivo";
  } else if (compound < -0.05) {
    sentiment = "negativo";
  }

  return { pos, neg, neu, compound, sentiment };
};

// --- Text Length Feedback ---
const getTextLengthFeedback = (wordCount: number, thresholds: ThresholdConfig): string => {
  if (wordCount === 0) {
    return "";
  } else if (wordCount < thresholds.minWords) {
    return `Texto muito curto. Recomendamos pelo menos ${thresholds.minWords} palavras para uma análise completa.`;
  } else if (wordCount < thresholds.optimalMinWords) {
    return `Texto curto. Para melhor impacto, considere expandir para pelo menos ${thresholds.optimalMinWords} palavras.`;
  } else if (wordCount <= thresholds.optimalMaxWords) {
    return `Comprimento ideal! Entre ${thresholds.optimalMinWords} e ${thresholds.optimalMaxWords} palavras é perfeito para este tipo de conteúdo.`;
  } else if (wordCount <= thresholds.maxWords) {
    return `Texto um pouco longo. Considere revisar para maior concisão, idealmente abaixo de ${thresholds.optimalMaxWords} palavras.`;
  } else {
    return `Texto muito longo. Recomendamos dividir em partes menores ou reduzir para menos de ${thresholds.maxWords} palavras.`;
  }
};

// --- Clarity Analysis ---
const analyzeClarity = (totalWords: number, totalSentences: number, complexWords: number, thresholds: ThresholdConfig): ClarityResult => {
  if (totalWords === 0) {
    return { score: 0, level: "N/A", feedback: "Digite algum texto para análise de clareza." };
  }

  // Calculate clarity score (0-100)
  const avgWordsPerSentence = totalWords / Math.max(1, totalSentences);
  const complexWordRatio = complexWords / Math.max(1, totalWords);
  
  // Penalize for very long sentences and high complex word ratio
  const sentencePenalty = avgWordsPerSentence > 20 ? Math.min(30, (avgWordsPerSentence - 20) * 1.5) : 0;
  const complexityPenalty = complexWordRatio > 0.2 ? Math.min(30, (complexWordRatio - 0.2) * 150) : 0;
  
  // Base score starts high and gets reduced by penalties
  let score = 100 - sentencePenalty - complexityPenalty;
  score = Math.max(0, Math.min(100, score));
  score = parseFloat(score.toFixed(1));

  // Determine level and feedback based on score and thresholds
  let level = "N/A", feedback = "";
  if (score >= thresholds.clarityScoreMin + 15) {
    level = "Excelente";
    feedback = "Texto muito claro e fácil de entender. Mantém um bom equilíbrio entre simplicidade e precisão.";
  } else if (score >= thresholds.clarityScoreMin) {
    level = "Bom";
    feedback = "Texto claro. A maioria dos leitores conseguirá entender sem dificuldade.";
  } else if (score >= thresholds.clarityScoreMin - 15) {
    level = "Regular";
    feedback = "Clareza moderada. Considere simplificar algumas frases e usar palavras mais comuns.";
  } else {
    level = "Ruim";
    feedback = "Texto pouco claro. Recomenda-se simplificar frases longas e reduzir o uso de palavras complexas.";
  }

  return { score, level, feedback };
};

// --- Conciseness Analysis ---
const analyzeConciseness = (text: string, sentences: string[], thresholds: ThresholdConfig): ConcisenessResult => {
  const verbosePhrasesFound: { phrase: string; suggestion: string, sentenceIndex: number }[] = [];
  
  // Check for verbose phrases in each sentence
  sentences.forEach((sentence, sentenceIndex) => {
    const lowerSentence = sentence.toLowerCase();
    
    Object.entries(VERBOSE_PHRASES).forEach(([phrase, suggestion]) => {
      if (lowerSentence.includes(phrase)) {
        verbosePhrasesFound.push({
          phrase,
          suggestion,
          sentenceIndex
        });
      }
    });
  });
  
  const verbosePhraseCount = verbosePhrasesFound.length;
  
  // Determine level and feedback based on count and thresholds
  let level = "N/A", feedback = "";
  if (text.length === 0) {
    level = "N/A";
    feedback = "Digite algum texto para análise de concisão.";
  } else if (verbosePhraseCount === 0) {
    level = "Excelente";
    feedback = "Texto muito conciso. Não foram encontradas expressões verbosas.";
  } else if (verbosePhraseCount <= thresholds.verbosePhrasesMax) {
    level = "Bom";
    feedback = `Texto relativamente conciso. Foram encontradas ${verbosePhraseCount} expressões que poderiam ser mais diretas.`;
  } else if (verbosePhraseCount <= thresholds.verbosePhrasesMax * 2) {
    level = "Regular";
    feedback = `Texto moderadamente verboso. Considere revisar as ${verbosePhraseCount} expressões identificadas para maior concisão.`;
  } else {
    level = "Ruim";
    feedback = `Texto muito verboso. Recomenda-se revisar as ${verbosePhraseCount} expressões identificadas para tornar o texto mais direto e impactante.`;
  }
  
  return { verbosePhrasesFound, verbosePhraseCount, level, feedback };
};

// --- Formality Analysis ---
const analyzeFormality = (words: string[], lexico: Lexico, thresholds: ThresholdConfig): FormalityResult => {
  if (words.length === 0) {
    return { 
      formalityLevel: "neutro", 
      score: 0, 
      level: "N/A", 
      feedback: "Digite algum texto para análise de formalidade." 
    };
  }
  
  // Count formal and informal markers
  let formalCount = 0;
  let informalCount = 0;
  
  words.forEach(word => {
    const lowerWord = word.toLowerCase();
    
    // Check for formal words
    if (FORMAL_WORDS.includes(lowerWord)) {
      formalCount += 2; // Stronger weight for formal markers
    }
    
    // Check for informal words and contractions
    if (INFORMAL_WORDS.includes(lowerWord)) {
      informalCount += 2;
    }
    if (CONTRACTIONS.includes(lowerWord)) {
      informalCount += 1;
    }
    
    // Other informal markers
    if (lowerWord.endsWith('inho') || lowerWord.endsWith('inha') || 
        lowerWord.endsWith('zinho') || lowerWord.endsWith('zinha')) {
      informalCount += 1;
    }
  });
  
  // Calculate formality score (-100 to +100, negative is informal, positive is formal)
  const totalMarkers = formalCount + informalCount;
  let score = 0;
  
  if (totalMarkers > 0) {
    score = ((formalCount - informalCount) / Math.max(1, words.length)) * 100;
    score = Math.max(-100, Math.min(100, score));
  }
  
  score = parseFloat(score.toFixed(1));
  
  // Determine formality level
  let formalityLevel: "muito formal" | "formal" | "neutro" | "informal" | "muito informal" = "neutro";
  
  if (score > 30) formalityLevel = "muito formal";
  else if (score > 10) formalityLevel = "formal";
  else if (score > -10) formalityLevel = "neutro";
  else if (score > -30) formalityLevel = "informal";
  else formalityLevel = "muito informal";
  
  // Determine level and feedback based on thresholds
  let level = "N/A", feedback = "";
  
  // Use thresholds to determine if the formality is appropriate for the content type
  if (score >= thresholds.formalityMin && score <= thresholds.formalityMax) {
    level = "Bom";
    feedback = `Nível de formalidade adequado para este tipo de conteúdo (${formalityLevel}).`;
  } else if (score < thresholds.formalityMin) {
    level = "Regular";
    feedback = `Texto mais informal do que o recomendado para este tipo de conteúdo. Considere um tom mais formal.`;
  } else {
    level = "Regular";
    feedback = `Texto mais formal do que o recomendado para este tipo de conteúdo. Considere um tom mais acessível.`;
  }
  
  return { formalityLevel, score, level, feedback };
};

// --- Tone Analysis ---
const analyzeTone = (text: string, words: string[], thresholds: ThresholdConfig): ToneAnalysisResult => {
  if (words.length === 0) {
    return { 
      type: "neutro", 
      level: "N/A", 
      feedback: "Digite algum texto para análise de tom." 
    };
  }
  
  // Count markers for different tones
  let formalCount = 0;
  let informalCount = 0;
  let technicalCount = 0;
  let persuasiveCount = 0;
  
  words.forEach(word => {
    const lowerWord = word.toLowerCase();
    
    // Check for formal words
    if (FORMAL_WORDS.includes(lowerWord)) {
      formalCount += 1;
    }
    
    // Check for informal words
    if (INFORMAL_WORDS.includes(lowerWord)) {
      informalCount += 1;
    }
    
    // Check for technical words
    if (TECHNICAL_WORDS.includes(lowerWord)) {
      technicalCount += 1;
    }
    
    // Check for persuasive words
    if (PERSUASIVE_WORDS.includes(lowerWord)) {
      persuasiveCount += 1;
    }
  });
  
  // Normalize counts by text length
  const normalizedFormal = formalCount / Math.max(1, words.length) * 100;
  const normalizedInformal = informalCount / Math.max(1, words.length) * 100;
  const normalizedTechnical = technicalCount / Math.max(1, words.length) * 100;
  const normalizedPersuasive = persuasiveCount / Math.max(1, words.length) * 100;
  
  // Determine dominant tone
  const toneScores = [
    { type: "formal", score: normalizedFormal },
    { type: "informal", score: normalizedInformal },
    { type: "técnico", score: normalizedTechnical },
    { type: "persuasivo", score: normalizedPersuasive }
  ];
  
  // Sort by score descending
  toneScores.sort((a, b) => b.score - a.score);
  
  // If highest score is significant, use that tone, otherwise neutral
  const dominantTone = toneScores[0].score > 2 ? toneScores[0].type : "neutro";
  
  // Determine if tone is appropriate based on thresholds and content type
  let level = "Bom";
  let feedback = "";
  
  // Different content types prefer different tones
  const contentTypePreference = {
    default: ["neutro", "formal"],
    blog: ["informal", "persuasivo"],
    formal_report: ["formal", "técnico"],
    social_media: ["informal", "persuasivo"],
    marketing: ["persuasivo", "informal"]
  };
  
  // Get current profile ID from thresholds (this is a simplification, in reality you'd pass the profile ID)
  let currentProfileId = "default";
  if (thresholds.formalityMin < -20) currentProfileId = "blog";
  else if (thresholds.formalityMin > 5) currentProfileId = "formal_report";
  else if (thresholds.formalityMin < -40) currentProfileId = "social_media";
  else if (thresholds.formalityMin < -15 && thresholds.formalityMax > 5) currentProfileId = "marketing";
  
  const preferredTones = contentTypePreference[currentProfileId as keyof typeof contentTypePreference] || contentTypePreference.default;
  
  if (preferredTones.includes(dominantTone as any)) {
    level = "Excelente";
    feedback = `Tom ${dominantTone} é ideal para este tipo de conteúdo.`;
  } else if (dominantTone === "neutro") {
    level = "Bom";
    feedback = `Tom neutro é adequado para a maioria dos conteúdos, mas você pode considerar um tom ${preferredTones[0]} para maior impacto.`;
  } else {
    level = "Regular";
    feedback = `O tom ${dominantTone} pode não ser o mais adequado para este tipo de conteúdo. Considere um tom mais ${preferredTones[0]}.`;
  }
  
  return { 
    type: dominantTone as "formal" | "informal" | "técnico" | "persuasivo" | "neutro", 
    level, 
    feedback 
  };
};

// --- Main Function ---
export const calculateAdvancedMetrics = (text: string, lexico: Lexico, styleAnalysisData: StyleAnalysisData, thresholds: ThresholdConfig): AdvancedMetricsData => {
  if (!text || text.trim().length === 0) {
    return getEmptyAdvancedMetrics();
  }

  const cleanedText = text.trim();
  const basicMetrics = calculateBasicMetrics(cleanedText);
  const wordsArray = getWords(cleanedText);
  const sentencesArray = getSentences(cleanedText);
  
  const totalWords = wordsArray.length;
  const totalSentences = sentencesArray.length;
  const totalSyllables = wordsArray.reduce((sum, word) => sum + countSyllables(word), 0);
  const totalLetters = wordsArray.reduce((sum, word) => sum + word.length, 0);
  
  const complexWordsForFog = countComplexWords(wordsArray);
  const polysyllablesForSmog = countPolysyllables(wordsArray);

  const fleschKincaidResult = calculateFleschKincaidReadingEase(totalWords, totalSentences, totalSyllables, thresholds);
  const gunningFogResult = calculateGunningFog(totalWords, totalSentences, complexWordsForFog, thresholds);
  const smogResult = calculateSmogIndex(totalSentences, polysyllablesForSmog, thresholds);
  const colemanLiauResult = calculateColemanLiauIndex(totalWords, totalSentences, totalLetters, thresholds);
  const gulpeaseResult = calculateGulpeaseIndex(totalWords, totalSentences, totalLetters);
  
  const baseReadability = { gunningFog: gunningFogResult, fleschKincaidReadingEase: fleschKincaidResult, smogIndex: smogResult, colemanLiauIndex: colemanLiauResult, gulpeaseIndex: gulpeaseResult };
  
  const jurbiXResult = calculateJurbiX(cleanedText, basicMetrics, baseReadability, styleAnalysisData, thresholds);
  
  const overallReadabilityResult = calculateOverallReadability({ jurbiX: jurbiXResult, ...baseReadability });

  const readability: ReadabilityIndices = { jurbiX: jurbiXResult, ...baseReadability, overallReadability: overallReadabilityResult };

  const redundancyResult = calculateRedundancy(wordsArray, thresholds);
  const sentimentResult = analyzeSentiment(cleanedText, lexico);
  const feedbackComprimentoResult = getTextLengthFeedback(totalWords, thresholds);

  // Novas métricas também recebem os thresholds
  const clarityResult = analyzeClarity(totalWords, totalSentences, complexWordsForFog, thresholds);
  const concisenessResult = analyzeConciseness(cleanedText, sentencesArray, thresholds);
  const formalityResult = analyzeFormality(wordsArray, lexico, thresholds);
  const toneResult = analyzeTone(cleanedText, wordsArray, thresholds);

  return {
    readability,
    redundancy: redundancyResult,
    textLengthWords: totalWords,
    textLengthChars: basicMetrics.charsWithSpaces,
    sentiment: sentimentResult,
    feedbackComprimento: feedbackComprimentoResult,
    clarity: clarityResult,
    conciseness: concisenessResult,
    formality: formalityResult,
    tone: toneResult,
  };
};

// --- Empty State ---
export const getEmptyAdvancedMetrics = (): AdvancedMetricsData => {
  const naResult = { score: 0, level: "N/A", feedback: "Digite algum texto para análise." };
  const naReadability: ReadabilityIndices = {
    jurbiX: naResult, gunningFog: naResult, fleschKincaidReadingEase: naResult,
    smogIndex: naResult, colemanLiauIndex: naResult, gulpeaseIndex: naResult,
    overallReadability: naResult,
  };
  return {
    readability: naReadability,
    redundancy: { index: 0, level: "N/A", feedback: "Digite algum texto para análise." },
    textLengthWords: 0, textLengthChars: 0,
    sentiment: { neg: 0, neu: 1, pos: 0, compound: 0, sentiment: "neutro" },
    feedbackComprimento: "",
    clarity: { score: 0, level: "N/A", feedback: "Digite algum texto para análise." },
    conciseness: { verbosePhrasesFound: [], verbosePhraseCount: 0, level: "N/A", feedback: "Digite algum texto para análise." },
    formality: { formalityLevel: "neutro", score: 0, level: "N/A", feedback: "Digite algum texto para análise." },
    tone: { type: "neutro", level: "N/A", feedback: "Digite algum texto para análise." },
  }
};
