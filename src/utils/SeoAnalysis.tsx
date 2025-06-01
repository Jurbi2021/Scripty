// src/utils/SeoAnalysis.tsx
import { countSyllables } from "./BasicMetrics"; // Assuming countSyllables is here
export { SeoAnalysisResult }

// --- Interfaces ---
interface LsiResult {
  density: number;
  synonymsUsed: string[];
  feedback: string;
  suggestions: string[];
}

interface HeadingResult {
  hasStructure: boolean; // Changed from hasHeadings
  potentialHeadings: string[]; // Changed from headings
  feedback: string;
}

interface SeoAnalysisResult {
  mainKeyword: string | null;
  keywordDensity: number;
  seoReadability: "Bom" | "Precisa de Ajustes";
  seoTextLength: "Muito Curto" | "Adequado" | "Muito Longo";
  lsiResult: LsiResult;
  headingResult: HeadingResult;
  feedbackKeyword: string;
  feedbackReadability: string;
  feedbackLength: string;
  feedbackHeadings: string;
}

// --- Constants ---
const LSI_DENSITY_MIN = 1.0; // Based on HelpModal (1%)
const LSI_DENSITY_MAX = 2.0; // Based on HelpModal (2%)

// Simple synonym lexicon (can be expanded)
const synonymLexicon: { [key: string]: string[] } = {
  "tecnologia": ["inovação", "digital", "sistema", "técnica"],
  "marketing": ["publicidade", "propaganda", "estratégia", "campanha"],
  // Add more relevant synonyms based on project context
};

const stopWords = [
    "o", "a", "os", "as", "de", "do", "da", "dos", "das", "e", "em", "no", "na",
    "nos", "nas", "por", "para", "com", "um", "uma", "uns", "umas", "que", "é",
    "são", "foi", "foram", "era", "eram", "tem", "tinha", "teve", "ou", "se",
    "ao", "aos", "à", "às", "pelo", "pela", "pelos", "pelas", "seu", "sua",
    "seus", "suas", "este", "esta", "estes", "estas", "isso", "aquilo", "mas",
    "como", "quando", "onde", "quem", "qual", "porque", "pois", "então", "assim",
    "sobre", "sob", "até", "após", "desde", "entre", "sem", "comigo", "contigo",
    "consigo", "conosco", "convosco", "ser", "estar", "ir", "vir", "ter", "haver"
];

// --- Helper Functions ---
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[\r\n]+/g, " ")
    .replace(/[.,!?;:"\\'()]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const countWordOccurrences = (text: string, word: string): number => {
  const regex = new RegExp(`\\b${word}\\b`, "gi");
  const matches = text.match(regex) || [];
  return matches.length;
};

// --- SEO Analysis Functions ---

const calculateLSIDensity = (text: string, keyword: string | null): LsiResult => {
  if (!keyword || !text) {
    return {
      density: 0,
      synonymsUsed: [],
      feedback: "Nenhuma palavra-chave principal identificada para análise LSI.",
      suggestions: [],
    };
  }

  const normalizedText = normalizeText(text);
  const normalizedKeyword = keyword.toLowerCase().trim();
  const words = normalizedText.split(" ");
  const totalWords = words.length;

  if (totalWords === 0) {
      return { density: 0, synonymsUsed: [], feedback: "Texto vazio.", suggestions: [] };
  }

  let synonyms = synonymLexicon[normalizedKeyword] || [];
  let synonymsUsed: string[] = [];
  let occurrences = countWordOccurrences(normalizedText, normalizedKeyword);

  synonyms.forEach((synonym) => {
    const count = countWordOccurrences(normalizedText, synonym);
    if (count > 0) {
      synonymsUsed.push(synonym);
      occurrences += count;
    }
  });

  const density = (occurrences / totalWords) * 100;
  const suggestions = synonyms.filter((syn) => !synonymsUsed.includes(syn));
  let feedback = "";

  if (density >= LSI_DENSITY_MIN && density <= LSI_DENSITY_MAX) {
    feedback = `Densidade LSI (${density.toFixed(1)}%) ideal! Bom uso de palavra-chave e sinônimos.`;
  } else if (density < LSI_DENSITY_MIN) {
    feedback = `Densidade LSI (${density.toFixed(1)}%) baixa. Use mais a palavra-chave ou sinônimos`;
    if (suggestions.length > 0) {
        feedback += ` como \'${suggestions[0]}\'.`;
    } else {
        feedback += ".";
    }
  } else {
    feedback = `Densidade LSI (${density.toFixed(1)}%) alta. Reduza repetições da palavra-chave ou sinônimos.`;
  }

  return {
    density,
    synonymsUsed,
    feedback,
    suggestions,
  };
};

// Refactored function to detect text structure instead of specific headings
const detectTextStructure = (text: string): HeadingResult => {
  const lines = text.replace(/\r\n/g, "\n").split("\n").map(line => line.trim());
  let potentialHeadings: string[] = [];
  let hasStructure = false;

  lines.forEach((line, index) => {
    const isShortLine = line.length > 0 && line.length < 60; // Potential title
    const endsWithPunctuation = /[.!?;:]$/.test(line);
    const nextLineExists = index + 1 < lines.length;
    const nextLineIsBlank = nextLineExists && lines[index + 1] === "";
    const lineAfterNextIsNotBlank = index + 2 < lines.length && lines[index + 2] !== "";

    // Identify potential headings: short lines, no punctuation, followed by content
    if (isShortLine && !endsWithPunctuation && nextLineExists && lines[index + 1] !== "") {
        // Basic check: is it followed by a longer line or a blank line then content?
        if (lines[index + 1].length > 60 || (nextLineIsBlank && lineAfterNextIsNotBlank)) {
            potentialHeadings.push(line);
            hasStructure = true;
        }
    }
  });

  // Count paragraphs (blocks separated by double newlines)
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const paragraphCount = paragraphs.length;

  let feedback = "";
  if (potentialHeadings.length > 1 && paragraphCount > potentialHeadings.length) {
    feedback = `Boa estrutura textual detectada (${potentialHeadings.length} seções)! Isso ajuda na leitura e SEO.`;
    hasStructure = true;
  } else if (potentialHeadings.length > 0) {
    feedback = `Alguma estrutura textual detectada. Considere usar títulos curtos e parágrafos bem definidos.`;
    hasStructure = true;
  } else if (paragraphCount > 1) {
      feedback = `Texto dividido em ${paragraphCount} parágrafos. Adicionar títulos curtos pode melhorar a estrutura para SEO.`;
      hasStructure = false; // No clear headings found
  } else {
    feedback = "Texto parece ser um bloco único. Divida em parágrafos e use títulos curtos para melhorar a estrutura e SEO.";
    hasStructure = false;
  }

  return {
    hasStructure,
    potentialHeadings,
    feedback,
  };
};

const calculateFleschKincaid = (words: string[], sentences: string[]): number => {
    const totalWords = words.length;
    const totalSentences = sentences.length;
    if (totalWords === 0 || totalSentences === 0) return 0;

    const totalSyllables = words.reduce((sum, word) => sum + countSyllables(word), 0);
    const fleschKincaid = 206.835 - 1.015 * (totalWords / totalSentences) - 84.6 * (totalSyllables / totalWords);
    return Math.max(0, Math.min(100, fleschKincaid)); // Clamp between 0 and 100
};

// --- Main SEO Analysis Function ---
export const analyzeSeo = (text: string): SeoAnalysisResult => {
  if (!text || !text.trim()) {
    return {
      mainKeyword: null,
      keywordDensity: 0,
      seoReadability: "Precisa de Ajustes",
      seoTextLength: "Muito Curto",
      lsiResult: { density: 0, synonymsUsed: [], feedback: "Texto vazio.", suggestions: [] },
      headingResult: { hasStructure: false, potentialHeadings: [], feedback: "Texto vazio." },
      feedbackKeyword: "Texto vazio.",
      feedbackReadability: "Texto vazio.",
      feedbackLength: "Texto vazio.",
      feedbackHeadings: "Texto vazio.",
    };
  }

  const cleanedText = text.trim();
  const words = cleanedText.split(/\s+/).filter(word => word.length > 0);
  const sentences = cleanedText.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
  const totalWords = words.length;

  // 1. Main Keyword and Density
  const wordFreq: { [key: string]: number } = {};
  words.forEach(word => {
    const wordLower = word.toLowerCase();
    if (!stopWords.includes(wordLower) && wordLower.length >= 3) { // Min length 3 based on HelpModal
      wordFreq[wordLower] = (wordFreq[wordLower] || 0) + 1;
    }
  });
  const sortedKeywords = Object.entries(wordFreq).sort(([, freqA], [, freqB]) => freqB - freqA);
  const mainKeyword = sortedKeywords.length > 0 ? sortedKeywords[0][0] : null;
  const keywordDensity = mainKeyword && totalWords > 0
    ? (wordFreq[mainKeyword] / totalWords) * 100
    : 0;

  let feedbackKeyword = "";
  if (!mainKeyword) {
      feedbackKeyword = "Nenhuma palavra-chave principal significativa encontrada.";
  } else if (keywordDensity < LSI_DENSITY_MIN) {
    feedbackKeyword = `Densidade (${keywordDensity.toFixed(1)}%) baixa. Aumente o uso de \'${mainKeyword}\'.`;
  } else if (keywordDensity > LSI_DENSITY_MAX) {
    feedbackKeyword = `Densidade (${keywordDensity.toFixed(1)}%) alta. Reduza o uso de \'${mainKeyword}\' para evitar spam.`;
  } else {
    feedbackKeyword = `Densidade (${keywordDensity.toFixed(1)}%) ideal para \'${mainKeyword}\'!`;
  }

  // 2. SEO Readability (Flesch-Kincaid based on HelpModal)
  const fleschScore = calculateFleschKincaid(words, sentences);
  const seoReadability: "Bom" | "Precisa de Ajustes" = fleschScore >= 60 && fleschScore <= 90 ? "Bom" : "Precisa de Ajustes";
  const feedbackReadability = seoReadability === "Bom"
    ? `Legibilidade (${fleschScore.toFixed(0)}) boa para SEO!`
    : `Legibilidade (${fleschScore.toFixed(0)}) precisa de ajustes. Simplifique ou ajuste o texto.`;

  // 3. SEO Text Length (Word count based on HelpModal)
  let seoTextLength: "Muito Curto" | "Adequado" | "Muito Longo";
  let feedbackLength = "";
  if (totalWords < 300) {
    seoTextLength = "Muito Curto";
    feedbackLength = `Texto (${totalWords} palavras) muito curto para SEO. Adicione mais conteúdo.`;
  } else if (totalWords <= 2000) {
    seoTextLength = "Adequado";
    feedbackLength = `Comprimento (${totalWords} palavras) adequado para SEO!`;
  } else {
    seoTextLength = "Muito Longo";
    feedbackLength = `Texto (${totalWords} palavras) muito longo. Considere dividir.`;
  }

  // 4. Text Structure (Replaces Headings)
  const headingResult = detectTextStructure(cleanedText); // Use the refactored function

  // 5. LSI Density
  const lsiResult = calculateLSIDensity(cleanedText, mainKeyword);

  return {
    mainKeyword,
    keywordDensity,
    seoReadability,
    seoTextLength,
    lsiResult,
    headingResult,
    feedbackKeyword,
    feedbackReadability,
    feedbackLength,
    feedbackHeadings: headingResult.feedback, // Use the new feedback
  };
};

