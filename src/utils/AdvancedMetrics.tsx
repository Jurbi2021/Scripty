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

export interface ClarityResult {
  score: number; // 0-100, higher is clearer
  level: string;
  feedback: string;
}

export interface ConcisenessResult {
  verbosePhrasesFound: { phrase: string; suggestion: string, sentenceIndex: number }[];
  count: number;
  level: string;
  feedback: string;
}

export interface FormalityResult {
  level: "muito formal" | "formal" | "neutro" | "informal" | "muito informal";
  score: number; // e.g., -2 to +2 or 0-100
  feedback: string;
}

export interface AdvancedMetricsData {
  readability: ReadabilityIndices;
  redundancy: RedundancyResult;
  textLengthWords: number;
  textLengthChars: number;
  sentiment: SentimentScore;
  feedbackComprimento: string;
  clarity: ClarityResult; // Added
  conciseness: ConcisenessResult; // Added
  formality: FormalityResult; // Added
}

// --- Lexical Resources (Placeholders - to be expanded or loaded from lexico.json) ---
//const FORMAL_WORDS = ["outrossim", "destarte", "hodiernamente", "doravante", "porquanto", "entrementes", "comunique-se", "cumpra-se", "respeitosamente", "cordialmente"];
//const INFORMAL_WORDS = ["tipo", "mano", "mina", "valeu", "falou", "aí", "né", "tá", "pra", "vc", "pq", "tb", "blz"];
//const CONTRACTIONS = ["pra", "pro", "pras", "pros", "num", "numa", "nuns", "numas", "dum", "duma", "duns", "dumas", "tô", "tá", "tamos", "tão"];
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
  positiveEmojis: string[]; negativeEmojis: string[];
  bigramsPositive?: string[]; bigramsNegative?: string[];
  // Add lists for tone/formality if lexico is expanded
  formalWords?: string[]; informalWords?: string[]; contractions?: string[];
}

const analyzeSentiment = (text: string, lexico: Lexico): SentimentScore => {
  if (!text || !text.trim() || !lexico) {
    return { neg: 0, neu: 1, pos: 0, compound: 0, sentiment: "neutro" };
  }
  const normalizedText = text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ").replace(/\s+/g, " ").trim();
  const words = normalizedText.split(" ");
  const emojis = text.match(/[\p{Emoji}]/gu) || [];
  let positiveScore = 0, negativeScore = 0, negationActive = false, negationCounter = 0;
  const NEGATION_WINDOW = 3;
  const WEIGHTS = { word: 1.0, intensifier: 1.5, negation: -1.5, emoji: 1.5 }; // Adjusted weights

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (lexico.negations.includes(word)) { negationActive = true; negationCounter = NEGATION_WINDOW; continue; }
    const isIntensifier = lexico.intensifiers.includes(word);
    let wordScore = 0;
    if (lexico.positive.includes(word)) { wordScore = WEIGHTS.word * (isIntensifier ? WEIGHTS.intensifier : 1.0); }
    else if (lexico.negative.includes(word)) { wordScore = -WEIGHTS.word * (isIntensifier ? WEIGHTS.intensifier : 1.0); }
    if (negationActive && wordScore !== 0) { wordScore *= WEIGHTS.negation; }
    if (wordScore > 0) positiveScore += wordScore;
    else if (wordScore < 0) negativeScore += Math.abs(wordScore);
    if (negationActive) { negationCounter--; if (negationCounter <= 0) negationActive = false; }
  }
  for (const emoji of emojis) {
    if (lexico.positiveEmojis.includes(emoji)) positiveScore += WEIGHTS.emoji;
    else if (lexico.negativeEmojis.includes(emoji)) negativeScore += WEIGHTS.emoji;
  }
  const totalScore = positiveScore + negativeScore;
  const compound = totalScore === 0 ? 0 : (positiveScore - negativeScore) / Math.sqrt(Math.pow(positiveScore - negativeScore, 2) + 15); // VADER-like compound
  
  let sentiment: "positivo" | "negativo" | "neutro" = "neutro";
  if (compound >= 0.05) sentiment = "positivo";
  else if (compound <= -0.05) sentiment = "negativo";

  return {
    neg: parseFloat((negativeScore / (totalScore || 1)).toFixed(3)), 
    neu: parseFloat((totalScore === 0 ? 1 : 1 - (positiveScore + negativeScore) / totalScore).toFixed(3)), 
    pos: parseFloat((positiveScore / (totalScore || 1)).toFixed(3)), 
    compound: parseFloat(compound.toFixed(4)), 
    sentiment 
  };
};

// --- Tone, Clarity, Conciseness, Formality ---

const analyzeClarity = (totalWords: number, totalSentences: number, complexWords: number, thresholds: ThresholdConfig): ClarityResult => {
    let score = 50; // Base score
    if (totalWords > 0 && totalSentences > 0) {
        const avgSentenceLength = totalWords / totalSentences;
        const percentComplexWords = (complexWords / totalWords) * 100;

        if (avgSentenceLength <= 15) score += 20;
        else if (avgSentenceLength <= 20) score += 10;
        else if (avgSentenceLength > 25) score -= (avgSentenceLength - 25) * 0.5; // Penalty for very long sentences

        if (percentComplexWords <= 5) score += 20;
        else if (percentComplexWords <= 10) score += 10;
        else if (percentComplexWords > 15) score -= (percentComplexWords - 15) * 0.5; // Penalty for many complex words
        
        score = Math.max(0, Math.min(100, score));
    }
    score = parseFloat(score.toFixed(1));
   let level = "N/A", feedback = "Texto muito curto para análise de clareza.";
if (totalWords > 0) {
    if (score >= thresholds.clarityScoreMin + 15) { // Ex: se o mínimo para Bom é 60, Excelente é >= 75
        level = "Excelente"; 
        feedback = "Excelente clareza! O texto é direto e fácil de entender."; 
    } else if (score >= thresholds.clarityScoreMin) { // <<< USA O LIMIAR DO PERFIL
        level = "Bom"; 
        feedback = "Boa clareza. O texto é geralmente compreensível."; 
    } else { 
        level = "Regular"; 
        feedback = "Clareza regular. Considere usar frases mais curtas e palavras mais simples."; 
    }
}
return { score, level, feedback };
};

const analyzeConciseness = (text: string, sentences: string[], thresholds: ThresholdConfig): ConcisenessResult => {
    const verbosePhrasesFound: ConcisenessResult["verbosePhrasesFound"] = [];
    const lowerText = text.toLowerCase();

    Object.entries(VERBOSE_PHRASES).forEach(([verbose, concise]) => {
        let startIndex = lowerText.indexOf(verbose);
        while (startIndex !== -1) {
            // Find which sentence this phrase belongs to
            let sentenceIndex = -1;
            let cumulativeLength = 0;
            for(let i=0; i < sentences.length; i++) {
                const sentenceText = sentences[i];
                if (startIndex >= cumulativeLength && startIndex < cumulativeLength + sentenceText.length) {
                    sentenceIndex = i + 1;
                    break;
                }
                cumulativeLength += sentenceText.length + 1; // +1 for separator
            }
            verbosePhrasesFound.push({ phrase: verbose, suggestion: concise, sentenceIndex });
            startIndex = lowerText.indexOf(verbose, startIndex + verbose.length);
        }
    });

    const count = verbosePhrasesFound.length;
    let level = "Excelente", feedback = "Excelente! O texto parece conciso e direto.";

    // <<< USA O LIMIAR DO PERFIL >>>
    if (count > 0 && count <= thresholds.verbosePhrasesMax) { 
        level = "Bom"; 
        feedback = `Bom. Encontrada(s) ${count} expressão(ões) que pode(m) ser mais concisa(s).`; 
    } else if (count > thresholds.verbosePhrasesMax) { 
        level = "Regular"; // Ou "Ruim", dependendo da sua preferência
        feedback = `Atenção: Encontrada(s) ${count} expressões prolixas. Tente usar alternativas mais diretas.`; 
    }

    return { verbosePhrasesFound, count, level, feedback };
};

const analyzeFormality = (words: string[], lexico: Lexico, thresholds: ThresholdConfig): FormalityResult => {
    let formalityScore = 0; // -100 (very informal) to +100 (very formal)
    const wordCount = words.length;
    if (wordCount === 0) return { level: "neutro", score: 0, feedback: "Texto muito curto." };

    words.forEach(word => {
        const lowerWord = word.toLowerCase();
        if (lexico.formalWords?.includes(lowerWord)) formalityScore += 2;
        if (lexico.informalWords?.includes(lowerWord)) formalityScore -= 2;
        if (lexico.contractions?.includes(lowerWord)) formalityScore -= 1;
    });

    // Normalize score to a percentage of max possible deviation
    const normalizedScore = (formalityScore / (wordCount * 2)) * 100; // Max deviation is 2 per word
    const score = parseFloat(Math.max(-100, Math.min(100, normalizedScore)).toFixed(1));

    let level: FormalityResult["level"] = "neutro";
    let feedback = "";

    if (score > thresholds.formalityMax + 20) { // Ex: Muito acima do máximo para formal
        level = "muito formal"; feedback = "O texto tem um nível de formalidade muito alto."; 
    } else if (score > thresholds.formalityMax) { 
        level = "formal"; feedback = "O texto apresenta um nível de formalidade alto."; 
    } else if (score < thresholds.formalityMin - 20) { // Ex: Muito abaixo do mínimo para informal
        level = "muito informal"; feedback = "O texto é muito informal, adequado para conversas casuais."; 
    } else if (score < thresholds.formalityMin) { 
        level = "informal"; feedback = "O texto tem um tom informal."; 
    } else { // Se estiver dentro de [formalityMin, formalityMax]
        level = "neutro"; feedback = "O nível de formalidade do texto é neutro e adequado para este perfil."; 
    }

    return { level, score, feedback };
};

// --- Text Length Feedback ---
const getTextLengthFeedback = (totalWords: number, thresholds: ThresholdConfig): string => {
    if (totalWords === 0) return "";
    if (totalWords < thresholds.minWords) return `Texto muito curto. O ideal para este perfil é acima de ${thresholds.minWords} palavras.`;
    if (totalWords <= thresholds.optimalMaxWords) return `Comprimento (${totalWords} palavras) adequado para este perfil.`;
    return `Texto longo (${totalWords} palavras). Considere se é possível encurtar ou dividir.`;
};

// --- Main Calculation Function ---
export const calculateAdvancedMetrics = (
  text: string, 
  lexico: Lexico,
  styleAnalysisData: StyleAnalysisData, // <<< Recebe os dados de estilo
  thresholds: ThresholdConfig           // <<< Recebe os limiares dinâmicos
): AdvancedMetricsData => {
  const cleanedText = text.trim();
  const basicMetrics = calculateBasicMetrics(cleanedText);
  const { words: totalWords, sentences: totalSentences, charsNoSpaces: totalLetters } = basicMetrics;
  const wordsArray = getWords(cleanedText);
  const sentencesArray = getSentences(cleanedText);
  const totalSyllables = wordsArray.reduce((sum, word) => sum + countSyllables(word), 0);
  const complexWordsForFog = countComplexWords(wordsArray);
  const polysyllablesForSmog = countPolysyllables(wordsArray)

  const gunningFogResult = calculateGunningFog(totalWords, totalSentences, complexWordsForFog, thresholds);
  const fleschKincaidResult = calculateFleschKincaidReadingEase(totalWords, totalSentences, totalSyllables, thresholds);
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
    conciseness: { verbosePhrasesFound: [], count: 0, level: "N/A", feedback: "Digite algum texto para análise." },
    formality: { level: "neutro", score: 0, feedback: "Digite algum texto para análise." },
  }
};

