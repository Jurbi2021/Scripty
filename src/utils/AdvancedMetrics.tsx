// src/utils/AdvancedMetrics.tsx

import { countWords, countSentences, countSyllables, BasicMetricsData, calculateBasicMetrics } from "./BasicMetrics";

// --- Interfaces ---

// Interface for individual readability index result including level and feedback
export interface ReadabilityIndexResult {
  score: number;
  level: string; // e.g., "Muito Fácil", "Fácil", "Médio", "Difícil"
  feedback: string; // Detailed feedback based on the score
}

// Updated interface for all readability indices
export interface ReadabilityIndices {
  jurbiX: ReadabilityIndexResult;
  gunningFog: ReadabilityIndexResult;
  fleschKincaidReadingEase: ReadabilityIndexResult;
  smogIndex: ReadabilityIndexResult;
  colemanLiauIndex: ReadabilityIndexResult;
  gulpeaseIndex?: ReadabilityIndexResult; // Keep optional or calculate if needed
}

export interface SentimentScore {
  neg: number;
  neu: number;
  pos: number;
  compound: number;
  sentiment: "positivo" | "negativo" | "neutro";
}

// Interface for Redundancy result
export interface RedundancyResult {
    index: number; // Percentage
    level: string; // e.g., "Excelente", "Bom", "Regular", "Ruim"
    feedback: string;
}

// Updated main data interface
export interface AdvancedMetricsData {
  readability: ReadabilityIndices;
  redundancy: RedundancyResult;
  textLengthWords: number;
  textLengthChars: number;
  sentiment: SentimentScore;
  feedbackComprimento: string;
  // Sugestoes can be added later if needed
}

// --- Helper Functions ---

const countComplexWords = (words: string[]): number => {
  // Using Gunning Fog definition from HelpModal: > 6 characters
  // Original textAnalysis used syllables >= 3. Let's stick to the HelpModal definition for Gunning Fog.
  // However, SMOG uses polysyllables (>=3 syllables). We need both.
  return words.filter(word => word.length > 6).length;
};

const countPolysyllables = (words: string[]): number => {
    // SMOG definition: >= 3 syllables
    return words.filter(word => countSyllables(word) >= 3).length;
};

// --- Readability Calculations with Feedback (Based on HelpModal) ---

const calculateGunningFog = (totalWords: number, totalSentences: number, complexWords: number): ReadabilityIndexResult => {
  let score = 0;
  if (totalSentences > 0 && totalWords > 0) {
    const wordsPerSentence = totalWords / totalSentences;
    const percentComplexWords = (complexWords / totalWords) * 100;
    score = 0.4 * (wordsPerSentence + percentComplexWords);
  }
  score = parseFloat(score.toFixed(1));

  let level = "";
  let feedback = "";
  if (score === 0 && totalWords === 0) {
      level = "N/A";
      feedback = "Texto muito curto para análise.";
  } else if (score < 8) {
    level = "Muito Fácil";
    feedback = "Texto muito fácil, acessível para leitores com ensino fundamental.";
  } else if (score < 10) {
    level = "Fácil";
    feedback = "Texto fácil, adequado para leitores com ensino médio.";
  } else if (score < 14) {
    level = "Médio";
    feedback = "Texto médio, requer ensino superior ou conhecimento técnico.";
  } else {
    level = "Difícil";
    feedback = "Texto difícil, possivelmente técnico ou acadêmico.";
  }
  return { score, level, feedback };
};

const calculateFleschKincaidReadingEase = (totalWords: number, totalSentences: number, totalSyllables: number): ReadabilityIndexResult => {
  let score = 0;
  if (totalSentences > 0 && totalWords > 0) {
    score = 206.835 - 1.015 * (totalWords / totalSentences) - 84.6 * (totalSyllables / totalWords);
  }
  score = parseFloat(Math.max(0, Math.min(100, score)).toFixed(1)); // Clamp 0-100

  let level = "";
  let feedback = "";
   if (score === 0 && totalWords === 0) {
      level = "N/A";
      feedback = "Texto muito curto para análise.";
  } else if (score >= 90) {
    level = "Muito Fácil";
    feedback = "Texto muito fácil, acessível para leitores de 5ª série.";
  } else if (score >= 60) {
    level = "Fácil";
    feedback = "Texto fácil, adequado para leitores de 6ª a 8ª série.";
  } else if (score >= 30) {
    level = "Médio";
    feedback = "Texto médio, adequado para leitores com ensino médio.";
  } else {
    level = "Difícil";
    feedback = "Texto difícil, nível universitário ou técnico.";
  }
  return { score, level, feedback };
};

const calculateSmogIndex = (totalSentences: number, polysyllables: number): ReadabilityIndexResult => {
  let score = 0;
  if (totalSentences > 0) {
      let polysyllablesForCalc = polysyllables;
      if (totalSentences < 30) {
          // Extrapolate if less than 30 sentences (as per original JS)
          polysyllablesForCalc = polysyllables * (30 / totalSentences);
      }
      if (polysyllablesForCalc >= 0) { // Avoid sqrt of negative
          score = 1.0430 * Math.sqrt(polysyllablesForCalc) + 3.1291;
      }
  }
  score = parseFloat(score.toFixed(1));

  let level = "";
  let feedback = "";
   if (score === 0 && totalSentences === 0) {
      level = "N/A";
      feedback = "Texto muito curto para análise.";
  } else if (score < 9) {
    level = "Muito Fácil";
    feedback = "Texto muito fácil, acessível para leitores de 5ª série.";
  } else if (score < 12) {
    level = "Fácil";
    feedback = "Texto fácil, adequado para leitores de 6ª a 9ª série.";
  } else if (score < 16) {
    level = "Médio";
    feedback = "Texto médio, adequado para leitores com ensino médio.";
  } else {
    level = "Difícil";
    feedback = "Texto difícil, nível universitário ou técnico.";
  }
  return { score, level, feedback };
};

const calculateColemanLiauIndex = (totalWords: number, totalSentences: number, totalLetters: number): ReadabilityIndexResult => {
  let score = 0;
  if (totalWords > 0) {
    const L = (totalLetters / totalWords) * 100;
    const S = (totalSentences / totalWords) * 100;
    score = 0.0588 * L - 0.296 * S - 15.8;
  }
  score = parseFloat(score.toFixed(1));

  let level = "";
  let feedback = "";
   if (score === 0 && totalWords === 0) {
      level = "N/A";
      feedback = "Texto muito curto para análise.";
  } else if (score < 8) {
    level = "Muito Fácil";
    feedback = "Texto muito fácil, acessível para leitores de 5ª série.";
  } else if (score < 10) {
    level = "Fácil";
    feedback = "Texto fácil, adequado para leitores de 6ª a 8ª série.";
  } else if (score < 14) {
    level = "Médio";
    feedback = "Texto médio, adequado para leitores com ensino médio.";
  } else {
    level = "Difícil";
    feedback = "Texto difícil, nível universitário ou técnico.";
  }
  return { score, level, feedback };
};

// Placeholder for Gulpease Index calculation
const calculateGulpeaseIndex = (totalWords: number, totalSentences: number, totalLetters: number): ReadabilityIndexResult => {
    let score = 0;
    if (totalWords > 0) {
        const gulpease = 89 - (10 * totalLetters / totalWords) + (300 * totalSentences / totalWords);
        score = parseFloat(Math.max(0, Math.min(100, gulpease)).toFixed(1));
    }
    // Add level/feedback if needed, otherwise return basic structure
    return { score, level: "N/A", feedback: "Gulpease feedback not defined." };
};

// JurbiX - More accurate adaptation from textAnalysis.jsx
const calculateJurbiX = (
    text: string,
    basicMetrics: BasicMetricsData,
    readabilityIndices: Omit<ReadabilityIndices, "jurbiX"> // Pass other calculated indices
): ReadabilityIndexResult => {

    const { words: totalWords, charsWithSpaces: totalCaracteres, sentences: totalSentences, paragraphs: totalParagrafos, uniqueWords: palavrasUnicas } = basicMetrics;
    const { fleschKincaidReadingEase, gunningFog, smogIndex, colemanLiauIndex, gulpeaseIndex } = readabilityIndices;

    if (totalWords === 0 || totalParagrafos === 0) {
        return { score: 0, level: "N/A", feedback: "Texto muito curto para análise JurbiX." };
    }

    const textLengthFactor = Math.min(1, totalCaracteres / 1000);
    const fleschKincaidNorm = fleschKincaidReadingEase.score;
    const gunningFogNorm = Math.max(0, 100 - (gunningFog.score * (3 / Math.max(0.1, textLengthFactor))));
    const smogNorm = Math.max(0, 100 - (smogIndex.score * (3 / Math.max(0.1, textLengthFactor))));
    const colemanLiauNorm = Math.max(0, 100 - (colemanLiauIndex.score * (3 / Math.max(0.1, textLengthFactor))));
    const gulpeaseNorm = gulpeaseIndex?.score || 0;

    let jurbiXBase = (fleschKincaidNorm + gunningFogNorm + smogNorm + colemanLiauNorm + gulpeaseNorm) / 5;

    const uniqueWordRatio = (palavrasUnicas / totalWords) * 100;
    const uniqueWordBonus = Math.min(20, uniqueWordRatio / 5);
    const hasList = text.includes("\n1.") || text.includes("\n-") || text.includes("\n*");
    const listBonus = hasList ? 5 : 0;
    const avgWordsPerParagraph = totalWords / totalParagrafos;
    const shortParagraphBonus = avgWordsPerParagraph < 50 ? 5 : 0;
    const clarityBoost = listBonus + shortParagraphBonus;

    // Penalties (Placeholders - require style analysis)
    const vozPassivaPercent = 0;
    const adverbPercent = 0;
    const complexSentencesPercent = 0;
    const ajuste = Math.min(-5, - (vozPassivaPercent / 20) - (adverbPercent / 5) - (complexSentencesPercent / 15));

    let finalJurbiX = jurbiXBase + uniqueWordBonus + clarityBoost + ajuste;
    finalJurbiX = Math.max(0, Math.min(100, finalJurbiX));
    finalJurbiX = parseFloat(finalJurbiX.toFixed(1));

    let level = "";
    let feedback = "";
    if (finalJurbiX >= 80) {
        level = "Muito Fácil";
        feedback = "Texto muito fácil e claro, ótimo para todos os públicos!";
    } else if (finalJurbiX >= 60) {
        level = "Fácil";
        feedback = "Texto fácil, acessível à maioria dos leitores.";
    } else if (finalJurbiX >= 40) {
        level = "Médio";
        feedback = "Texto de dificuldade média, pode ser ajustado para maior clareza.";
    } else {
        level = "Difícil";
        feedback = "Texto difícil, considere simplificar para melhorar a legibilidade.";
    }

    return { score: finalJurbiX, level, feedback };
};

// --- Redundancy Calculation with Feedback ---

const calculateRedundancy = (words: string[]): RedundancyResult => {
  let index = 0;
  if (words.length > 0) {
      const wordFreq: { [key: string]: number } = {};
      words.forEach(word => {
        const lowerWord = word.toLowerCase().replace(/[.,!?;:"'()]/g, "");
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

  let level = "";
  let feedback = "";
  if (index === 0 && words.length === 0) {
      level = "N/A";
      feedback = "Texto muito curto para análise.";
  } else if (index < 15) {
    level = "Excelente";
    feedback = "Excelente! Pouca redundância no texto.";
  } else if (index < 30) {
    level = "Bom";
    feedback = "Bom! A redundância está aceitável, mas pode ser melhorada.";
  } else if (index < 50) {
    level = "Regular";
    feedback = "Regular. Há redundância perceptível. Tente variar mais as palavras.";
  } else {
    level = "Ruim";
    feedback = "Ruim. Muita redundância. Considere revisar e usar sinônimos.";
  }
  return { index, level, feedback };
};

// --- Sentiment Analysis (Adaptation from sentiment_analysis.jsx) ---

interface Lexico {
  positive: string[];
  negative: string[];
  intensifiers: string[];
  negations: string[];
  positiveEmojis: string[];
  negativeEmojis: string[];
  bigramsPositive?: string[];
  bigramsNegative?: string[];
}

const analyzeSentiment = (text: string, lexico: Lexico): SentimentScore => {
  if (!text || !text.trim() || !lexico) {
    return { neg: 0, neu: 1, pos: 0, compound: 0, sentiment: "neutro" };
  }
  // ... (sentiment calculation logic remains the same as before) ...
   const normalizedText = text.toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = normalizedText.split(" ");
  const emojis = text.match(/[\p{Emoji}]/gu) || [];

  let positiveScore = 0;
  let negativeScore = 0;
  let negationActive = false;
  let negationCounter = 0;
  const NEGATION_WINDOW = 3;
  const WEIGHTS = { word: 1.0, intensifier: 0.8, negation: -1.0, emoji: 1.5 };

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    if (lexico.negations.includes(word)) {
      negationActive = true;
      negationCounter = NEGATION_WINDOW;
      continue;
    }

    const isIntensifier = lexico.intensifiers.includes(word);
    const intensifierMultiplier = isIntensifier ? WEIGHTS.intensifier : 1.0;
    let wordScore = 0;

    if (lexico.positive.includes(word)) {
      wordScore = WEIGHTS.word * intensifierMultiplier;
    } else if (lexico.negative.includes(word)) {
      wordScore = -WEIGHTS.word * intensifierMultiplier;
    }

    if (negationActive && wordScore !== 0) {
      wordScore *= WEIGHTS.negation;
    }

    if (wordScore > 0) positiveScore += wordScore;
    else if (wordScore < 0) negativeScore += Math.abs(wordScore);

    if (negationActive) {
      negationCounter--;
      if (negationCounter <= 0) negationActive = false;
    }
  }

  // Add bigram logic if needed
  // ...

  for (const emoji of emojis) {
    if (lexico.positiveEmojis.includes(emoji)) {
      positiveScore += WEIGHTS.emoji;
    } else if (lexico.negativeEmojis.includes(emoji)) {
      negativeScore += WEIGHTS.emoji;
    }
  }

  const total = positiveScore + negativeScore;
  const pos = total > 0 ? positiveScore / total : 0;
  const neg = total > 0 ? negativeScore / total : 0;
  const neu = total === 0 ? 1.0 : 0;
  const compound = total > 0 ? (positiveScore - negativeScore) / total : 0;

  let sentiment: "positivo" | "negativo" | "neutro" = "neutro";
  if (compound >= 0.05) sentiment = "positivo";
  else if (compound <= -0.05) sentiment = "negativo";

  return {
    neg: parseFloat(neg.toFixed(3)),
    neu: parseFloat(neu.toFixed(3)),
    pos: parseFloat(pos.toFixed(3)),
    compound: parseFloat(compound.toFixed(4)),
    sentiment,
  };
};

// --- Text Length Feedback ---
const getTextLengthFeedback = (totalWords: number): string => {
    if (totalWords === 0) return "";
    // Using ranges from HelpModal for SEO length
    if (totalWords < 300) return "Texto muito curto para SEO, adicione mais conteúdo.";
    if (totalWords <= 2000) return "Comprimento adequado para SEO.";
    return "Texto muito longo para SEO, considere dividir.";
    // Original ranges:
    // if (totalWords < 500) return "Seu texto é muito curto. Considere adicionar mais conteúdo para engajar melhor o leitor.";
    // if (totalWords < 1200) return "O comprimento do texto é ideal para redes sociais ou posts curtos.";
    // if (totalWords < 3000) return "Ótimo comprimento para um artigo ou blog post.";
    // return "Texto longo, ideal para conteúdos detalhados, mas cuidado com a concisão.";
};

// --- Main Calculation Function ---

export const calculateAdvancedMetrics = (text: string, lexico: Lexico): AdvancedMetricsData => {
  const cleanedText = text.trim();
  const basicMetrics = calculateBasicMetrics(cleanedText);

  const { words: totalWords, sentences: totalSentences, charsWithSpaces: totalChars, charsNoSpaces, paragraphs, uniqueWords } = basicMetrics;

  const wordsArray = cleanedText.split(/\s+/).filter(word => word.length > 0);
  const totalLetters = charsNoSpaces;
  const totalSyllables = wordsArray.reduce((sum, word) => sum + countSyllables(word), 0);
  const complexWords = countComplexWords(wordsArray); // Using > 6 chars definition for Gunning Fog
  const polysyllables = countPolysyllables(wordsArray); // Using >= 3 syllables for SMOG

  const gunningFogResult = calculateGunningFog(totalWords, totalSentences, complexWords);
  const fleschKincaidResult = calculateFleschKincaidReadingEase(totalWords, totalSentences, totalSyllables);
  const smogResult = calculateSmogIndex(totalSentences, polysyllables);
  const colemanLiauResult = calculateColemanLiauIndex(totalWords, totalSentences, totalLetters);
  const gulpeaseResult = calculateGulpeaseIndex(totalWords, totalSentences, totalLetters);

  const baseReadability = {
      gunningFog: gunningFogResult,
      fleschKincaidReadingEase: fleschKincaidResult,
      smogIndex: smogResult,
      colemanLiauIndex: colemanLiauResult,
      gulpeaseIndex: gulpeaseResult,
  };

  const jurbiXResult = calculateJurbiX(cleanedText, basicMetrics, baseReadability);

  const finalReadability: ReadabilityIndices = {
      ...baseReadability,
      jurbiX: jurbiXResult,
  };

  const redundancyResult = calculateRedundancy(wordsArray);
  const sentimentResult = analyzeSentiment(cleanedText, lexico);
  const feedbackComprimentoResult = getTextLengthFeedback(totalWords);

  return {
    readability: finalReadability,
    redundancy: redundancyResult,
    textLengthWords: totalWords,
    textLengthChars: totalChars,
    sentiment: sentimentResult,
    feedbackComprimento: feedbackComprimentoResult,
  };
};

// Placeholder for empty metrics
const emptyReadabilityIndex: ReadabilityIndexResult = { score: 0, level: "N/A", feedback: "" };
export const getEmptyAdvancedMetrics = (): AdvancedMetricsData => ({
  readability: {
    jurbiX: { ...emptyReadabilityIndex, feedback: "Texto muito curto para análise JurbiX." },
    gunningFog: { ...emptyReadabilityIndex, feedback: "Texto muito curto para análise." },
    fleschKincaidReadingEase: { ...emptyReadabilityIndex, feedback: "Texto muito curto para análise." },
    smogIndex: { ...emptyReadabilityIndex, feedback: "Texto muito curto para análise." },
    colemanLiauIndex: { ...emptyReadabilityIndex, feedback: "Texto muito curto para análise." },
    gulpeaseIndex: { ...emptyReadabilityIndex, feedback: "Texto muito curto para análise." },
  },
  redundancy: { index: 0, level: "N/A", feedback: "Texto muito curto para análise." },
  textLengthWords: 0,
  textLengthChars: 0,
  sentiment: { neg: 0, neu: 1, pos: 0, compound: 0, sentiment: "neutro" },
  feedbackComprimento: "",
});

