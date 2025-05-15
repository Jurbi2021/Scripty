// src/utils/basicMetrics.tsx

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
    return text.split(/[.!?]+/).filter(Boolean).length;
  }
  
  /**
   * Contagem de parágrafos (delimitados por quebras de linha com espaços opcionais).
   */
  export function countParagraphs(text: string): number {
    if (!text || !text.trim()) return 0;
    return text.split(/\n\s*\n/).filter(Boolean).length;
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
    return Math.ceil(totalWords / wpm);
  }