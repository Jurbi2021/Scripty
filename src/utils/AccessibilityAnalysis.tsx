import { BasicMetrics } from './BasicMetrics';

// Interfaces para os resultados de análise de acessibilidade
export interface CognitiveAccessibilityResult {
  score: number;
  level: 'Excelente' | 'Bom' | 'Regular' | 'Ruim';
  feedback: string;
  issues: {
    longSentences: number;
    complexWords: number;
    inconsistentTerminology: number;
    unclearReferences: number;
  };
  suggestions: string[];
}

export interface VisualAccessibilityResult {
  score: number;
  level: 'Excelente' | 'Bom' | 'Regular' | 'Ruim';
  feedback: string;
  issues: {
    longParagraphs: number;
    missingStructure: boolean;
    poorTextFlow: number;
    lackOfBreaks: number;
  };
  suggestions: string[];
}

export interface LinguisticAccessibilityResult {
  score: number;
  level: 'Excelente' | 'Bom' | 'Regular' | 'Ruim';
  feedback: string;
  issues: {
    technicalTerms: number;
    idiomaticExpressions: number;
    regionalisms: number;
    complexVocabulary: number;
  };
  suggestions: string[];
}

export interface AccessibilityAnalysisResult {
  overallScore: number;
  overallLevel: 'Excelente' | 'Bom' | 'Regular' | 'Ruim';
  cognitive: CognitiveAccessibilityResult;
  visual: VisualAccessibilityResult;
  linguistic: LinguisticAccessibilityResult;
  generalFeedback: string;
  prioritySuggestions: string[];
}

// Listas de palavras e padrões para análise
const COMPLEX_WORDS = [
  'implementar', 'estabelecer', 'desenvolver', 'proporcionar', 'constituir',
  'fundamentar', 'caracterizar', 'determinar', 'identificar', 'especificar',
  'compreender', 'demonstrar', 'evidenciar', 'exemplificar', 'contextualizar',
  'metodologia', 'paradigma', 'epistemologia', 'hermenêutica', 'dialética',
  'fenomenologia', 'empirismo', 'racionalismo', 'pragmatismo', 'relativismo'
];

const TECHNICAL_TERMS = [
  'algoritmo', 'interface', 'framework', 'software', 'hardware', 'database',
  'servidor', 'protocolo', 'arquitetura', 'infraestrutura', 'deployment',
  'backend', 'frontend', 'middleware', 'API', 'SDK', 'IDE', 'URL', 'HTTP',
  'TCP/IP', 'DNS', 'SSL', 'VPN', 'firewall', 'malware', 'phishing'
];

const IDIOMATIC_EXPRESSIONS = [
  'dar uma de', 'fazer vista grossa', 'puxar o tapete', 'quebrar o galho',
  'dar uma mãozinha', 'estar com a corda no pescoço', 'pisar na bola',
  'dar com os burros n\'água', 'estar com a pulga atrás da orelha',
  'fazer tempestade em copo d\'água', 'estar entre a cruz e a espada'
];

const REGIONALISMS = [
  'aipim', 'macaxeira', 'mandioca', 'bergamota', 'mexerica', 'tangerina',
  'pão francês', 'pão de açúcar', 'pãozinho', 'sinal', 'farol', 'semáforo',
  'geladeira', 'refrigerador', 'frigobar', 'chinelo', 'sandália', 'tamanco'
];

const UNCLEAR_PRONOUNS = ['ele', 'ela', 'isso', 'isto', 'aquilo', 'este', 'esse'];

// Função para contar sílabas (aproximação)
function countSyllables(word: string): number {
  const vowels = 'aeiouáéíóúâêîôûàèìòùãõ';
  let count = 0;
  let previousWasVowel = false;
  
  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i].toLowerCase());
    if (isVowel && !previousWasVowel) {
      count++;
    }
    previousWasVowel = isVowel;
  }
  
  return Math.max(1, count);
}

// Função para detectar sentenças
function getSentences(text: string): string[] {
  return text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
}

// Função para detectar parágrafos
function getParagraphs(text: string): string[] {
  return text.split(/\n\s*\n/).filter(paragraph => paragraph.trim().length > 0);
}

// Análise de Acessibilidade Cognitiva
export function analyzeCognitiveAccessibility(text: string): CognitiveAccessibilityResult {
  const sentences = getSentences(text);
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  
  // Detectar frases longas (mais de 20 palavras)
  const longSentences = sentences.filter(sentence => {
    const sentenceWords = sentence.trim().split(/\s+/);
    return sentenceWords.length > 20;
  }).length;
  
  // Detectar palavras complexas
  const complexWords = words.filter(word => 
    COMPLEX_WORDS.includes(word) || countSyllables(word) > 3
  ).length;
  
  // Detectar inconsistência terminológica (palavras similares usadas de forma diferente)
  const wordFrequency: { [key: string]: number } = {};
  words.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });
  
  const inconsistentTerminology = Object.values(wordFrequency).filter(freq => freq === 1).length;
  
  // Detectar referências pouco claras
  const unclearReferences = words.filter(word => 
    UNCLEAR_PRONOUNS.includes(word)
  ).length;
  
  // Calcular score (0-100)
  let score = 100;
  score -= Math.min(30, longSentences * 5); // Penalizar frases longas
  score -= Math.min(25, (complexWords / words.length) * 100); // Penalizar palavras complexas
  score -= Math.min(20, (inconsistentTerminology / words.length) * 50); // Penalizar inconsistência
  score -= Math.min(25, (unclearReferences / words.length) * 100); // Penalizar referências pouco claras
  
  score = Math.max(0, Math.round(score));
  
  // Determinar nível
  let level: 'Excelente' | 'Bom' | 'Regular' | 'Ruim';
  if (score >= 85) level = 'Excelente';
  else if (score >= 70) level = 'Bom';
  else if (score >= 50) level = 'Regular';
  else level = 'Ruim';
  
  // Gerar feedback e sugestões
  const suggestions: string[] = [];
  let feedback = '';
  
  if (longSentences > 0) {
    suggestions.push(`Divida ${longSentences} frase(s) longa(s) em frases menores`);
  }
  
  if (complexWords > words.length * 0.1) {
    suggestions.push('Substitua palavras complexas por alternativas mais simples');
  }
  
  if (unclearReferences > words.length * 0.05) {
    suggestions.push('Esclareça pronomes e referências ambíguas');
  }
  
  if (level === 'Excelente') {
    feedback = 'Excelente acessibilidade cognitiva! O texto é claro e fácil de processar.';
  } else if (level === 'Bom') {
    feedback = 'Boa acessibilidade cognitiva, com pequenos ajustes possíveis.';
  } else if (level === 'Regular') {
    feedback = 'Acessibilidade cognitiva regular. Algumas melhorias são recomendadas.';
  } else {
    feedback = 'Acessibilidade cognitiva baixa. O texto pode ser difícil de processar para pessoas com dificuldades cognitivas.';
  }
  
  return {
    score,
    level,
    feedback,
    issues: {
      longSentences,
      complexWords,
      inconsistentTerminology,
      unclearReferences
    },
    suggestions
  };
}

// Análise de Acessibilidade Visual
export function analyzeVisualAccessibility(text: string): VisualAccessibilityResult {
  const paragraphs = getParagraphs(text);
  const sentences = getSentences(text);
  
  // Detectar parágrafos muito longos (mais de 150 palavras)
  const longParagraphs = paragraphs.filter(paragraph => {
    const words = paragraph.trim().split(/\s+/);
    return words.length > 150;
  }).length;
  
  // Verificar estrutura (cabeçalhos, listas, etc.)
  const hasHeaders = /^#+\s/.test(text) || /<h[1-6]>/i.test(text);
  const hasLists = /^\s*[-*+]\s/m.test(text) || /^\s*\d+\.\s/m.test(text) || /<[uo]l>/i.test(text);
  const missingStructure = !hasHeaders && !hasLists && paragraphs.length > 3;
  
  // Detectar fluxo de texto ruim (frases muito variadas em tamanho)
  const sentenceLengths = sentences.map(sentence => sentence.trim().split(/\s+/).length);
  const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
  const variance = sentenceLengths.reduce((acc, length) => acc + Math.pow(length - avgLength, 2), 0) / sentenceLengths.length;
  const poorTextFlow = variance > 100 ? 1 : 0;
  
  // Detectar falta de quebras visuais
  const lackOfBreaks = paragraphs.length < 2 && text.length > 500 ? 1 : 0;
  
  // Calcular score (0-100)
  let score = 100;
  score -= Math.min(30, longParagraphs * 10); // Penalizar parágrafos longos
  score -= missingStructure ? 25 : 0; // Penalizar falta de estrutura
  score -= poorTextFlow * 20; // Penalizar fluxo ruim
  score -= lackOfBreaks * 25; // Penalizar falta de quebras
  
  score = Math.max(0, Math.round(score));
  
  // Determinar nível
  let level: 'Excelente' | 'Bom' | 'Regular' | 'Ruim';
  if (score >= 85) level = 'Excelente';
  else if (score >= 70) level = 'Bom';
  else if (score >= 50) level = 'Regular';
  else level = 'Ruim';
  
  // Gerar feedback e sugestões
  const suggestions: string[] = [];
  let feedback = '';
  
  if (longParagraphs > 0) {
    suggestions.push(`Divida ${longParagraphs} parágrafo(s) longo(s) em seções menores`);
  }
  
  if (missingStructure) {
    suggestions.push('Adicione cabeçalhos e listas para melhorar a estrutura visual');
  }
  
  if (poorTextFlow) {
    suggestions.push('Equilibre o tamanho das frases para melhorar o fluxo de leitura');
  }
  
  if (lackOfBreaks) {
    suggestions.push('Adicione quebras de parágrafo para facilitar a navegação visual');
  }
  
  if (level === 'Excelente') {
    feedback = 'Excelente acessibilidade visual! O texto tem boa estrutura e organização.';
  } else if (level === 'Bom') {
    feedback = 'Boa acessibilidade visual, com estrutura adequada.';
  } else if (level === 'Regular') {
    feedback = 'Acessibilidade visual regular. A estrutura pode ser melhorada.';
  } else {
    feedback = 'Acessibilidade visual baixa. O texto pode ser difícil de navegar visualmente.';
  }
  
  return {
    score,
    level,
    feedback,
    issues: {
      longParagraphs,
      missingStructure,
      poorTextFlow,
      lackOfBreaks
    },
    suggestions
  };
}

// Análise de Acessibilidade Linguística
export function analyzeLinguisticAccessibility(text: string): LinguisticAccessibilityResult {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const textLower = text.toLowerCase();
  
  // Detectar termos técnicos
  const technicalTerms = words.filter(word => 
    TECHNICAL_TERMS.includes(word)
  ).length;
  
  // Detectar expressões idiomáticas
  let idiomaticExpressions = 0;
  IDIOMATIC_EXPRESSIONS.forEach(expression => {
    if (textLower.includes(expression.toLowerCase())) {
      idiomaticExpressions++;
    }
  });
  
  // Detectar regionalismos
  const regionalisms = words.filter(word => 
    REGIONALISMS.includes(word)
  ).length;
  
  // Detectar vocabulário complexo (palavras com mais de 4 sílabas)
  const complexVocabulary = words.filter(word => 
    countSyllables(word) > 4
  ).length;
  
  // Calcular score (0-100)
  let score = 100;
  score -= Math.min(25, (technicalTerms / words.length) * 100); // Penalizar termos técnicos
  score -= Math.min(20, idiomaticExpressions * 5); // Penalizar expressões idiomáticas
  score -= Math.min(15, regionalisms * 3); // Penalizar regionalismos
  score -= Math.min(40, (complexVocabulary / words.length) * 100); // Penalizar vocabulário complexo
  
  score = Math.max(0, Math.round(score));
  
  // Determinar nível
  let level: 'Excelente' | 'Bom' | 'Regular' | 'Ruim';
  if (score >= 85) level = 'Excelente';
  else if (score >= 70) level = 'Bom';
  else if (score >= 50) level = 'Regular';
  else level = 'Ruim';
  
  // Gerar feedback e sugestões
  const suggestions: string[] = [];
  let feedback = '';
  
  if (technicalTerms > words.length * 0.05) {
    suggestions.push('Explique ou substitua termos técnicos por alternativas mais acessíveis');
  }
  
  if (idiomaticExpressions > 0) {
    suggestions.push('Substitua expressões idiomáticas por linguagem mais direta');
  }
  
  if (regionalisms > 0) {
    suggestions.push('Use termos mais universais em vez de regionalismos');
  }
  
  if (complexVocabulary > words.length * 0.1) {
    suggestions.push('Simplifique o vocabulário usando palavras mais comuns');
  }
  
  if (level === 'Excelente') {
    feedback = 'Excelente acessibilidade linguística! O vocabulário é claro e acessível.';
  } else if (level === 'Bom') {
    feedback = 'Boa acessibilidade linguística, com vocabulário adequado.';
  } else if (level === 'Regular') {
    feedback = 'Acessibilidade linguística regular. O vocabulário pode ser simplificado.';
  } else {
    feedback = 'Acessibilidade linguística baixa. O vocabulário pode ser muito complexo para alguns leitores.';
  }
  
  return {
    score,
    level,
    feedback,
    issues: {
      technicalTerms,
      idiomaticExpressions,
      regionalisms,
      complexVocabulary
    },
    suggestions
  };
}

// Função principal de análise de acessibilidade
export function calculateAccessibilityMetrics(text: string): AccessibilityAnalysisResult {
  if (!text || text.trim().length === 0) {
    return {
      overallScore: 0,
      overallLevel: 'Ruim',
      cognitive: {
        score: 0,
        level: 'Ruim',
        feedback: 'Digite algum texto para análise',
        issues: { longSentences: 0, complexWords: 0, inconsistentTerminology: 0, unclearReferences: 0 },
        suggestions: []
      },
      visual: {
        score: 0,
        level: 'Ruim',
        feedback: 'Digite algum texto para análise',
        issues: { longParagraphs: 0, missingStructure: false, poorTextFlow: 0, lackOfBreaks: 0 },
        suggestions: []
      },
      linguistic: {
        score: 0,
        level: 'Ruim',
        feedback: 'Digite algum texto para análise',
        issues: { technicalTerms: 0, idiomaticExpressions: 0, regionalisms: 0, complexVocabulary: 0 },
        suggestions: []
      },
      generalFeedback: 'Digite algum texto para análise de acessibilidade',
      prioritySuggestions: []
    };
  }
  
  const cognitive = analyzeCognitiveAccessibility(text);
  const visual = analyzeVisualAccessibility(text);
  const linguistic = analyzeLinguisticAccessibility(text);
  
  // Calcular score geral (média ponderada)
  const overallScore = Math.round(
    (cognitive.score * 0.4) + (visual.score * 0.3) + (linguistic.score * 0.3)
  );
  
  // Determinar nível geral
  let overallLevel: 'Excelente' | 'Bom' | 'Regular' | 'Ruim';
  if (overallScore >= 85) overallLevel = 'Excelente';
  else if (overallScore >= 70) overallLevel = 'Bom';
  else if (overallScore >= 50) overallLevel = 'Regular';
  else overallLevel = 'Ruim';
  
  // Gerar feedback geral
  let generalFeedback = '';
  if (overallLevel === 'Excelente') {
    generalFeedback = 'Seu texto tem excelente acessibilidade! É fácil de ler e compreender para pessoas com diferentes necessidades.';
  } else if (overallLevel === 'Bom') {
    generalFeedback = 'Seu texto tem boa acessibilidade, com algumas oportunidades de melhoria.';
  } else if (overallLevel === 'Regular') {
    generalFeedback = 'Seu texto tem acessibilidade regular. Algumas melhorias podem torná-lo mais inclusivo.';
  } else {
    generalFeedback = 'Seu texto tem baixa acessibilidade. Várias melhorias são necessárias para torná-lo mais inclusivo.';
  }
  
  // Compilar sugestões prioritárias
  const prioritySuggestions: string[] = [];
  
  // Priorizar sugestões baseadas nos scores mais baixos
  const categories = [
    { name: 'cognitiva', score: cognitive.score, suggestions: cognitive.suggestions },
    { name: 'visual', score: visual.score, suggestions: visual.suggestions },
    { name: 'linguística', score: linguistic.score, suggestions: linguistic.suggestions }
  ].sort((a, b) => a.score - b.score);
  
  categories.forEach(category => {
    if (category.score < 70 && category.suggestions.length > 0) {
      prioritySuggestions.push(...category.suggestions.slice(0, 2)); // Máximo 2 sugestões por categoria
    }
  });
  
  return {
    overallScore,
    overallLevel,
    cognitive,
    visual,
    linguistic,
    generalFeedback,
    prioritySuggestions: prioritySuggestions.slice(0, 5) // Máximo 5 sugestões prioritárias
  };
}

