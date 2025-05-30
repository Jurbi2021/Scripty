// src/components/organisms/EditorWithSEO.tsx
import React, { useState, useEffect } from 'react';
import styles from './EditorWithSEO.module.scss'; // Estilos específicos
import editorLayoutStyles from './EditorWithMetrics.module.scss'; // Reutilizar estilos de layout
import { motion, AnimatePresence } from 'framer-motion';
import { FaLightbulb } from 'react-icons/fa';

// Componentes
import TextArea from '../atoms/TextArea';
import MetricsToolbar from '../molecules/MetricsToolbar';

// Utils e Tipos
import {
  calculateBasicMetrics,
  BasicMetricsData,
} from '../../utils/BasicMetrics';; //
import {
  analyzeSeo,
  SeoAnalysisResult //
} from '../../utils/SeoAnalysis'; //

// Ordem das métricas básicas
const basicMetricDisplayOrder: { key: keyof BasicMetricsData; label: string }[] = [
  { key: 'words', label: 'Palavras' },
  { key: 'charsWithSpaces', label: 'Caracteres' },
  { key: 'readingTime', label: 'Tempo Leitura' },
  { key: 'sentences', label: 'Sentenças' },
  { key: 'paragraphs', label: 'Parágrafos' },
  { key: 'uniqueWords', label: 'Palavras Únicas' },
  { key: 'avgWordsPerSentence', label: 'Média Palavras/Sentença' },
  { key: 'avgCharsPerWord', label: 'Média Caracteres/Palavra' },
  { key: 'charsNoSpaces', label: 'Caracteres (s/ espaço)' },
];

const EditorWithSEO: React.FC = () => {
  const [text, setText] = useState<string>(''); //
  const [basicMetrics, setBasicMetrics] = useState<BasicMetricsData>(calculateBasicMetrics('')); //
  const [seoAnalysis, setSeoAnalysis] = useState<SeoAnalysisResult | null>(null); //

  useEffect(() => {
    const handler = setTimeout(() => {
      setBasicMetrics(calculateBasicMetrics(text)); //
      setSeoAnalysis(analyzeSeo(text)); //
    }, 300);
    return () => clearTimeout(handler);
  }, [text]);

  const toolbarMetrics = basicMetricDisplayOrder.map(metric => ({
    label: metric.label,
    value: basicMetrics[metric.key]
  }));

  const getStatusClass = (status: string | undefined): string => { //
    switch (status?.toLowerCase()) {
      case 'bom': return styles.statusBom;
      case 'ideal': return styles.statusBom; //
      case 'adequado': return styles.statusBom; //
      case 'precisa de ajustes': return styles.statusRegular; //
      case 'baixa': return styles.statusRuim; //
      case 'alta': return styles.statusRuim; //
      case 'muito curto': return styles.statusRuim; //
      case 'muito longo': return styles.statusRuim; //
      default: return styles.statusNA || '';
    }
  };

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.07,
      duration: 0.4,
      // ease: [0.6, 0.05, -0.01, 0.9] // <--- Linha problemática
      ease: "easeOut" // <--- SUBSTITUA POR UM EASING VÁLIDO
      // ou tente ajustar os valores da sua cubic-bezier, ex:
      // ease: [0.6, 0.05, 0.1, 0.9]
    }
  })
};

  // Estrutura para facilitar o mapeamento dos cards de SEO
  const seoAnalysisCards = seoAnalysis ? [
    { key: 'keyword', title: 'Palavra-Chave Principal', feedback: seoAnalysis.feedbackKeyword, status: seoAnalysis.keywordDensity < 1 ? 'baixa' : seoAnalysis.keywordDensity > 2 ? 'alta' : 'ideal', details: seoAnalysis.mainKeyword ? [{ type: 'info', label: 'Palavra-chave:', value: seoAnalysis.mainKeyword }] : null },
    { key: 'lsi', title: 'Densidade LSI', feedback: seoAnalysis.lsiResult?.feedback, status: seoAnalysis.lsiResult?.density < 1 ? 'baixa' : seoAnalysis.lsiResult?.density > 2 ? 'alta' : 'ideal', details: [
        ...(seoAnalysis.lsiResult?.synonymsUsed && seoAnalysis.lsiResult.synonymsUsed.length > 0 ? [{ type: 'list', summaryLabel: `Sinônimos usados (${seoAnalysis.lsiResult.synonymsUsed.length})`, items: seoAnalysis.lsiResult.synonymsUsed }] : []),
        ...(seoAnalysis.lsiResult?.suggestions && seoAnalysis.lsiResult.suggestions.length > 0 ? [{ type: 'list', summaryLabel: `Sugestões (${seoAnalysis.lsiResult.suggestions.length})`, items: seoAnalysis.lsiResult.suggestions }] : [])
    ].filter(d => d && d.items && d.items.length > 0) },
    { key: 'readability', title: 'Legibilidade para SEO', feedback: seoAnalysis.feedbackReadability, status: seoAnalysis.seoReadability },
    { key: 'length', title: 'Comprimento do Texto', feedback: seoAnalysis.feedbackLength, status: seoAnalysis.seoTextLength },
    { key: 'structure', title: 'Estrutura Textual', feedback: seoAnalysis.feedbackHeadings, status: seoAnalysis.headingResult?.hasStructure ? 'bom' : 'precisa de ajustes', details: seoAnalysis.headingResult?.potentialHeadings && seoAnalysis.headingResult.potentialHeadings.length > 0 ? [{ type: 'headings', summaryLabel: `Títulos potenciais (${seoAnalysis.headingResult.potentialHeadings.length})`, items: seoAnalysis.headingResult.potentialHeadings }] : null },
  ] : [];


  return (
    <div className={editorLayoutStyles.editorLayout}>
      <div className={editorLayoutStyles.mainContentArea}>
        <motion.h2 className={editorLayoutStyles.editorTitle} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}>
          Análise de SEO
        </motion.h2>
        <motion.p className={editorLayoutStyles.editorSubtitle} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}>
          Otimize seu texto para os motores de busca.
        </motion.p>

        <div className={editorLayoutStyles.toolbarWrapper}>
          <MetricsToolbar metrics={basicMetrics} />
        </div>

        <TextArea
          className={editorLayoutStyles.editorAreaAdapter}
          placeholder="Cole seu texto aqui para analisar o SEO..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={15}
        />
      </div>

      <motion.div
        className={styles.seoAnalysisPanel}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
      >
        <h3 className={styles.panelTitle}>Análise de SEO</h3>
        <p className={styles.panelSubtitle}>Verifique os pontos chave para otimização.</p>

        <AnimatePresence>
          {text.length > 0 && seoAnalysis ? (
            <div className={styles.feedbackContainer}>
              {seoAnalysisCards.map((card, index) => (
                <motion.div
                  key={card.key}
                  className={`${styles.feedbackCard} ${getStatusClass(card.status)}`}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <h4 className={styles.feedbackTitle}>{card.title}</h4>
                  <p className={styles.feedbackText}>{card.feedback}</p>
                  {card.details && card.details.map((detail: any, detailIndex: number) => (
                    detail.type === 'info' ? (
                      <div key={detailIndex} className={styles.keywordInfo}>
                        <span className={styles.keywordLabel}>{detail.label}</span>
                        <span className={styles.keywordValue}>{detail.value}</span>
                      </div>
                    ) : detail.type === 'list' ? (
                      <details key={detailIndex} className={styles.details}>
                        <summary>{detail.summaryLabel}</summary>
                        <p className={styles.wordList}>{detail.items.join(', ')}</p>
                      </details>
                    ) : detail.type === 'headings' ? (
                       <details key={detailIndex} className={styles.details}>
                        <summary>{detail.summaryLabel}</summary>
                        <ul className={styles.headingsList}>
                            {detail.items.map((heading: string, hIndex: number) => <li key={hIndex}>{heading}</li>)}
                        </ul>
                       </details>
                    ) : null
                  ))}
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
                key="empty-seo"
                className={editorLayoutStyles.emptyStateAdvancedMetrics} // Reutilizar estilo
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
            >
                <FaLightbulb />
                <p>Sua análise de SEO aparecerá aqui quando você digitar.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default EditorWithSEO;