// src/utils/generateAIPrompt.ts

import { AdvancedMetricsData, ReadabilityIndices } from './AdvancedMetrics'; // Adicionado ReadabilityIndices
// Corrigir importações
import type { StyleAnalysisData } from './StyleAnalysis'; 
import type { SeoAnalysisResult } from './SeoAnalysis';
import { ReadabilityIndexKey, StyleMetricKey } from './preferences'; // Importar do arquivo de preferências

interface FeedbackItem {
  source: string;
  message: string;
  level?: string; // Opcional: para ajudar a priorizar ou formatar
}

const readabilityLabels: Record<ReadabilityIndexKey, string> = {
  jurbiX: "JurbiX",
  fleschKincaidReadingEase: "Flesch-Kincaid",
  gunningFog: "Gunning Fog",
  smogIndex: "SMOG",
  colemanLiauIndex: "Coleman-Liau",
  gulpeaseIndex: "Gulpease", // Adicione se estiver a usar
};

const styleLabels: Record<StyleMetricKey, string> = {
  passiveVoice: "Voz Passiva",
  adverbs: "Uso de Advérbios",
  complexSentences: "Frases Complexas",
  discourseConnectors: "Conectores Discursivos",
  lexicalDiversity: "Diversidade Léxica",
};

// Níveis que indicam um "gap" ou área de melhoria
const GAPS_LEVELS_ADVANCED_READABILITY = ['Difícil', 'Médio', 'Ruim']; // Adicionado 'Médio'
const GAPS_LEVELS_REDUNDANCY = ['Ruim', 'Regular']; // Já incluía 'Regular'
const GAPS_LEVELS_STYLE = ['Ruim', 'Regular']; // Adicionado 'Regular'
const GAPS_LEVELS_ADVANCED_METRICS = ['Ruim', 'Regular']; // Para as novas métricas avançadas

export const generateAIPrompt = (
  text: string,
  activeViewContext: 'metrics' | 'style' | 'seo' | 'all', // <<< NOVO PARÂMETRO
  advancedMetrics: AdvancedMetricsData,
  styleAnalysis: StyleAnalysisData,
  seoAnalysis: SeoAnalysisResult | null
): { prompt: string; includedFeedbacks: string[] } => {
  const collectedFeedbacks: FeedbackItem[] = [];
  const includedFeedbackTypes: Set<string> = new Set();

  // 1. Coletar feedbacks de Métricas Avançadas
  if ((activeViewContext === 'metrics' || activeViewContext === 'all') && advancedMetrics) {
    // Índices de Legibilidade
    (Object.keys(advancedMetrics.readability) as ReadabilityIndexKey[]).forEach(key => {
      const indexResult = advancedMetrics.readability[key as keyof ReadabilityIndices]; // Type assertion
      if (indexResult && indexResult.level && GAPS_LEVELS_ADVANCED_READABILITY.includes(indexResult.level)) {
        collectedFeedbacks.push({
          source: `Legibilidade - ${readabilityLabels[key] || key}`,
          message: indexResult.feedback,
          level: indexResult.level,
        });
        includedFeedbackTypes.add(readabilityLabels[key] || 'Legibilidade');
      }
    });

    // Redundância
    if (advancedMetrics.redundancy.level && GAPS_LEVELS_REDUNDANCY.includes(advancedMetrics.redundancy.level)) {
      collectedFeedbacks.push({
        source: 'Redundância',
        message: advancedMetrics.redundancy.feedback,
        level: advancedMetrics.redundancy.level,
      });
      includedFeedbackTypes.add('Redundância');
    }
    
    // Comprimento do Texto (feedback geral) - Este é mais subjetivo para "gap"
    // Poderíamos incluir se o feedback NÃO for o ideal, por exemplo.
    // Por agora, focaremos nos que têm um 'level' claro de 'Ruim' ou 'Regular'.
    // Se advancedMetrics.feedbackComprimento indicar um problema (ex: "muito curto", "muito longo" - mas isso é mais específico do SEO)
    // Se feedbackComprimento NÃO CONTIVER "ideal" ou "ótimo", por exemplo:
    if (advancedMetrics.feedbackComprimento && 
        !(advancedMetrics.feedbackComprimento.toLowerCase().includes("ideal") || 
          advancedMetrics.feedbackComprimento.toLowerCase().includes("ótimo"))) {
        // Não vamos adicionar à lista principal para não poluir, mas fica a ideia se quiser refinar
    }

    // NOVAS MÉTRICAS AVANÇADAS

    // Tom do Texto
    if (advancedMetrics.tone && advancedMetrics.tone.level && 
        GAPS_LEVELS_ADVANCED_METRICS.includes(advancedMetrics.tone.level)) {
      collectedFeedbacks.push({
        source: 'Tom do Texto',
        message: advancedMetrics.tone.feedback,
        level: advancedMetrics.tone.level,
      });
      includedFeedbackTypes.add('Tom do Texto');
    }

    // Formalidade
    if (advancedMetrics.formality && advancedMetrics.formality.level && 
        GAPS_LEVELS_ADVANCED_METRICS.includes(advancedMetrics.formality.level)) {
      collectedFeedbacks.push({
        source: 'Formalidade',
        message: advancedMetrics.formality.feedback,
        level: advancedMetrics.formality.level,
      });
      includedFeedbackTypes.add('Formalidade');
    }

    // Clareza
    if (advancedMetrics.clarity && advancedMetrics.clarity.level && 
        GAPS_LEVELS_ADVANCED_METRICS.includes(advancedMetrics.clarity.level)) {
      collectedFeedbacks.push({
        source: 'Clareza',
        message: advancedMetrics.clarity.feedback,
        level: advancedMetrics.clarity.level,
      });
      includedFeedbackTypes.add('Clareza');
    }

    // Concisão
    if (advancedMetrics.conciseness && advancedMetrics.conciseness.level && 
        GAPS_LEVELS_ADVANCED_METRICS.includes(advancedMetrics.conciseness.level)) {
      collectedFeedbacks.push({
        source: 'Concisão',
        message: advancedMetrics.conciseness.feedback,
        level: advancedMetrics.conciseness.level,
      });
      includedFeedbackTypes.add('Concisão');
    }
  }

  // 2. Coletar feedbacks de Análise de Estilo
  if ((activeViewContext === 'style' || activeViewContext === 'all') && styleAnalysis) {
    (Object.keys(styleAnalysis) as StyleMetricKey[]).forEach(key => {
      const styleItem = styleAnalysis[key as keyof StyleAnalysisData]; // Type assertion
      // @ts-ignore Acesso dinâmico pode ser complexo para o TS aqui, mas a estrutura é conhecida

      if (styleItem && styleItem.level && GAPS_LEVELS_STYLE.includes(styleItem.level)) {

        collectedFeedbacks.push({
          source: `Estilo - ${styleLabels[key] || key}`,
          // @ts-ignore
          message: styleItem.feedback,
          // @ts-ignore
          level: styleItem.level,
        });
        includedFeedbackTypes.add(styleLabels[key] || 'Estilo');
      }
    });
  }

  // 3. Coletar feedbacks de Análise de SEO
  if ((activeViewContext === 'seo' || activeViewContext === 'all') && seoAnalysis) {
    // Densidade da Palavra-Chave
    
    if (seoAnalysis.mainKeyword && (seoAnalysis.keywordDensity < 1 || seoAnalysis.keywordDensity > 2)) {
      collectedFeedbacks.push({ source: 'Densidade da Palavra-Chave', message: seoAnalysis.feedbackKeyword, level: "Ajustar" });
      includedFeedbackTypes.add('Densidade Palavra-Chave');
    }
    // Densidade LSI
    if (seoAnalysis.lsiResult && (seoAnalysis.lsiResult.density < 1 || seoAnalysis.lsiResult.density > 2)) {
      collectedFeedbacks.push({ source: 'Densidade LSI', message: seoAnalysis.lsiResult.feedback, level: "Ajustar" });
      includedFeedbackTypes.add('Densidade LSI');
    }
    // Legibilidade para SEO
    if (seoAnalysis.seoReadability === 'Precisa de Ajustes') {
      collectedFeedbacks.push({ source: 'Legibilidade (SEO)', message: seoAnalysis.feedbackReadability, level: "Ajustar" });
      includedFeedbackTypes.add('Legibilidade SEO');
    }
    // Comprimento do Texto para SEO
    if (seoAnalysis.seoTextLength === 'Muito Curto' || seoAnalysis.seoTextLength === 'Muito Longo') {
      collectedFeedbacks.push({ source: 'Comprimento do Texto (SEO)', message: seoAnalysis.feedbackLength, level: "Ajustar" });
      includedFeedbackTypes.add('Comprimento SEO');
    }
    // Estrutura Textual (Headings)
    if (seoAnalysis.headingResult && !seoAnalysis.headingResult.hasStructure) {
      collectedFeedbacks.push({ source: 'Estrutura Textual (SEO)', message: seoAnalysis.feedbackHeadings, level: "Ajustar" });
      includedFeedbackTypes.add('Estrutura SEO');
    }
  }

  // Opcional: Ordenar feedbacks por um critério de "gravidade" se tivermos mais níveis
  // Por enquanto, a ordem será a de coleta.

  const formattedFeedbacks = collectedFeedbacks.length > 0
    ? collectedFeedbacks.map(fb => `- [${fb.source}${fb.level ? ` - Nível: ${fb.level}` : ''}]: ${fb.message}`).join('\n')
    : "- Nenhuma sugestão crítica ou de melhoria significativa foi identificada pelo Scripty. Considere uma revisão geral para garantir a qualidade e o tom desejado.";

  const prompt = `
**[R] Papel:**
Você é um editor de textos experiente e um especialista em otimizar textos para máxima clareza, coesão, engajamento e impacto, utilizando análises métricas detalhadas como guia.

**[O] Objetivo:**
O seu principal objetivo é refinar e aprimorar substancialmente o texto original fornecido abaixo. Para isso, concentre-se em aplicar as seguintes sugestões de melhoria que foram identificadas pela ferramenta de análise textual Scripty:
${formattedFeedbacks}

**[L] Contexto (Texto Original para Refinamento):**
'''
${text}
'''

**[E] Resultado Esperado:**
Por favor, forneça apenas o texto completamente revisado e melhorado. As melhorias devem ser incorporadas de forma fluida e natural ao texto. Mantenha o tom, a intenção original e as informações chave do texto, a menos que uma das sugestões específicas indique explicitamente uma alteração de tom ou a necessidade de adicionar/remover conteúdo. O resultado deve ser um texto significativamente aprimorado e pronto para uso.
  `.trim();

  return { prompt, includedFeedbacks: Array.from(includedFeedbackTypes) };
};
