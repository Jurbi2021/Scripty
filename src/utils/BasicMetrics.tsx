// src/utils/basicmetrics.tsx

/*Métricas básicas usadas no EditorToolbar */

/**Contagem total de caracteres, incluindo espaços. */
export function countCharsWithSpaces(text: string): number {
    if (!text || !text.trim()) return 0;
    return text.length;
  }
  
  /*Contagem total de caracteres, excluindo espaços.*/
  export function countCharsNoSpaces(text: string): number {
    if (!text || !text.trim()) return 0;
    return text.replace(/\s+/g, '').length;
  }
  
  /*Contagem total de palavras.*/
  export function countWords(text: string): number {
    if (!text || !text.trim()) return 0;
    return text.split(/\s+/).filter(Boolean).length;
  }
  
  /** Contagem de palavras únicas (case-insensitive, sem pontuação final).*/
  export function countUniqueWords(text: string): number {
    if (!text || !text.trim()) return 0;
    const words = text
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w.toLowerCase().replace(/[.!?;]/g, ''));
    return new Set(words).size;
  }
  
  /*Contagem de sentenças (delimitadas por . ! ?).*/
  export function countSentences(text: string): number {
    if (!text || !text.trim()) return 0;
    // Handle cases like ... or !!! correctly by splitting and filtering empty strings
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return sentences.length;
    // A more robust approach might consider edge cases like Mr. Mrs. etc.
  }
  
  /**
   * Contagem de parágrafos (delimitados por quebras de linha com espaços opcionais).
   */
  export function countParagraphs(text: string): number {
    if (!text || !text.trim()) return 0;
    // Split by one or more newline characters, potentially surrounded by whitespace
    // Filter out empty strings resulting from multiple newlines
    return text.split(/\n\s*\n+/).filter(p => p.trim().length > 0).length || (text.trim().length > 0 ? 1 : 0);
    // The || part handles the case where there's text but no double newline (counts as 1 paragraph)
  }
  
  /**
   * Média de palavras por sentença.
   */
  export function avgWordsPerSentence(text: string): number {
    if (!text || !text.trim()) return 0;
    const totalWords = countWords(text);
    const sentences = countSentences(text);
    return sentences > 0 ? Number((totalWords / sentences).toFixed(1)) : 0;
  }
  
  /**
   * Média de caracteres por palavra.
   */
  export function avgCharsPerWord(text: string): number {
    if (!text || !text.trim()) return 0;
    const words = text.split(/\s+/).filter(Boolean);
    const totalChars = words.reduce((sum, w) => sum + w.length, 0);
    return words.length > 0 ? Number((totalChars / words.length).toFixed(1)) : 0;
  }
  
  /**
   * Estimativa de tempo de leitura em minutos (padrão 180 wpm).
   */
  export function readingTime(text: string, wpm: number = 180): number {
    if (!text || !text.trim()) return 0;
    const totalWords = countWords(text);
    const minutes = totalWords / wpm;
    // Return time in minutes, rounded to one decimal place or ceiling?
    // Let's return a string like "<1 min" or "X min"
    if (minutes < 1) {
        return Math.ceil(minutes * 60); // Return seconds if less than a minute
    } else {
        return Math.ceil(minutes); // Return minutes (ceiling)
    }
  }

  // Helper to format reading time
  export function formatReadingTime(text: string, wpm: number = 180): string {
    if (!text || !text.trim()) return '0 min';
    const totalWords = countWords(text);
    const minutes = totalWords / wpm;
    if (minutes === 0) return '0 min';
    if (minutes < 1) {
        const seconds = Math.ceil(minutes * 60);
        return `${seconds} seg`;
    }
    return `${Math.ceil(minutes)} min`;
  }

  // Structure to hold all metrics
  export interface BasicMetricsData {
    charsWithSpaces: number;
    charsNoSpaces: number;
    words: number;
    uniqueWords: number;
    sentences: number;
    paragraphs: number;
    avgWordsPerSentence: number;
    avgCharsPerWord: number;
    readingTime: string; // Formatted string
  }

  // Function to calculate all basic metrics
  export function calculateBasicMetrics(text: string): BasicMetricsData {
    return {
        charsWithSpaces: countCharsWithSpaces(text),
        charsNoSpaces: countCharsNoSpaces(text),
        words: countWords(text),
        uniqueWords: countUniqueWords(text),
        sentences: countSentences(text),
        paragraphs: countParagraphs(text),
        avgWordsPerSentence: avgWordsPerSentence(text),
        avgCharsPerWord: avgCharsPerWord(text),
        readingTime: formatReadingTime(text)
    };
  }



/**
 * Counts syllables in a Portuguese word.
 * (Adapted from textAnalysis.jsx logic)
 */
export function countSyllables(word: string): number {
  word = word.toLowerCase().trim();
  // Simple words often have 1 syllable
  if (word.length <= 3 && word.match(/[aeiouáéíóúàãõâêô]/gi)) {
      return 1;
  }
  if (word.length <= 2) {
    return 1;
  }

  const vowels = "aáàãâeéêiíoóõôuúy";
  // Common Portuguese diphthongs. This might need refinement.
  const diphthongs = ["ai", "ãi", "ei", "éi", "êi", "oi", "ói", "ôi", "ui", "au", "ão", "eu", "éu", "êu", "iu", "ou"];

  let syllableCount = 0;
  let i = 0;
  let previousCharIsVowel = false;

  const isVowel = (char: string): boolean => vowels.includes(char);

  while (i < word.length) {
    const char = word[i];
    let isCurrentCharVowel = isVowel(char);

    // Check for diphthongs
    if (isCurrentCharVowel && i + 1 < word.length && isVowel(word[i + 1])) {
        const twoChars = word.substring(i, i + 2);
        if (diphthongs.includes(twoChars)) {
            // It's a diphthong, count as one syllable unit
            if (!previousCharIsVowel) { // Count only if it starts a new syllable sound
                 syllableCount++;
            }
            previousCharIsVowel = true;
            i += 2; // Skip both vowels
            continue;
        }
        // Handle hiatus (two vowels together not forming a diphthong) - count first vowel
         if (!previousCharIsVowel) {
            syllableCount++;
         }
         previousCharIsVowel = true; // Mark that we just processed a vowel
         i++;
         continue;
    }

    // Handle single vowels
    if (isCurrentCharVowel) {
      if (!previousCharIsVowel) {
        syllableCount++;
      }
      previousCharIsVowel = true;
    } else {
      previousCharIsVowel = false;
    }
    i++;
  }

  // Basic adjustment for silent 'e' at the end (simplification)
  if (word.endsWith("e") && syllableCount > 1 && !isVowel(word[word.length - 2])) {
     // This rule is complex, let's stick to the original simple check for now
     // syllableCount--; // Avoid potentially incorrect reduction
  }

  // Ensure at least one syllable if the word has vowels and count is 0
  return syllableCount === 0 && word.split("").some(isVowel) ? 1 : syllableCount;
}

