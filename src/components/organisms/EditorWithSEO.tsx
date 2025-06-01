// src/components/organisms/EditorWithSEO.tsx
import React, { useState, useEffect } from 'react';
import styles from './EditorWithSEO.module.scss';
import editorLayoutStyles from './EditorWithMetrics.module.scss';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLightbulb } from 'react-icons/fa';

import TextArea from '../atoms/TextArea';
import MetricsToolbar from '../molecules/MetricsToolbar';

import {
  calculateBasicMetrics,
  BasicMetricsData,
} from '../../utils/BasicMetrics';
import {
  analyzeSeo,
  SeoAnalysisResult
} from '../../utils/SeoAnalysis';

import { useEditor } from '../../contexts/EditorContext';
import { SeoMetricKey } from '../../utils/preferences'; // Ajuste o caminho

const EditorWithSEO: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [basicMetrics, setBasicMetrics] = useState<BasicMetricsData>(calculateBasicMetrics(''));
  const [seoAnalysis, setSeoAnalysis] = useState<SeoAnalysisResult | null>(null);

  const { preferences, isFocusMode } = useEditor();

  useEffect(() => {
    const handler = setTimeout(() => {
      setBasicMetrics(calculateBasicMetrics(text));
      setSeoAnalysis(analyzeSeo(text));
    }, 300);
    return () => clearTimeout(handler);
  }, [text]);

  const getStatusClass = (status: string | undefined): string => {
    switch (status?.toLowerCase()) {
      case 'bom': return styles.statusBom;
      case 'ideal': return styles.statusBom;
      case 'adequado': return styles.statusBom;
      case 'precisa de ajustes': return styles.statusRegular;
      case 'baixa': return styles.statusRuim;
      case 'alta': return styles.statusRuim;
      case 'muito curto': return styles.statusRuim;
      case 'muito longo': return styles.statusRuim;
      default: return styles.statusNA || '';
    }
  };

  const cardVariants = { /* ... (mesmo cardVariants de EditorWithMetrics) ... */
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: (i: number) => ({ /* ... */ }),
  };

  const allSeoAnalysisCardsDefinition = seoAnalysis ? [
    { key: 'mainKeyword' as SeoMetricKey, title: 'Palavra-Chave Principal', data: { feedback: seoAnalysis.feedbackKeyword, status: seoAnalysis.keywordDensity < 1 ? 'baixa' : seoAnalysis.keywordDensity > 2 ? 'alta' : 'ideal' }, details: seoAnalysis.mainKeyword ? [{ type: 'info', label: 'Palavra-chave:', value: seoAnalysis.mainKeyword }] : null },
    { key: 'lsiResult' as SeoMetricKey, title: 'Densidade LSI', data: { feedback: seoAnalysis.lsiResult?.feedback, status: seoAnalysis.lsiResult?.density < 1 ? 'baixa' : seoAnalysis.lsiResult?.density > 2 ? 'alta' : 'ideal' }, details: [
        ...(seoAnalysis.lsiResult?.synonymsUsed && seoAnalysis.lsiResult.synonymsUsed.length > 0 ? [{ type: 'list', summaryLabel: `Sinônimos usados (${seoAnalysis.lsiResult.synonymsUsed.length})`, items: seoAnalysis.lsiResult.synonymsUsed }] : []),
        ...(seoAnalysis.lsiResult?.suggestions && seoAnalysis.lsiResult.suggestions.length > 0 ? [{ type: 'list', summaryLabel: `Sugestões (${seoAnalysis.lsiResult.suggestions.length})`, items: seoAnalysis.lsiResult.suggestions }] : [])
    ].filter(d => d && d.items && d.items.length > 0) },
    { key: 'seoReadability' as SeoMetricKey, title: 'Legibilidade para SEO', data: { feedback: seoAnalysis.feedbackReadability, status: seoAnalysis.seoReadability } },
    { key: 'seoTextLength' as SeoMetricKey, title: 'Comprimento do Texto (SEO)', data: { feedback: seoAnalysis.feedbackLength, status: seoAnalysis.seoTextLength } },
    { key: 'headingResult' as SeoMetricKey, title: 'Estrutura Textual', data: { feedback: seoAnalysis.feedbackHeadings, status: seoAnalysis.headingResult?.hasStructure ? 'bom' : 'precisa de ajustes' }, details: seoAnalysis.headingResult?.potentialHeadings && seoAnalysis.headingResult.potentialHeadings.length > 0 ? [{ type: 'headings', summaryLabel: `Títulos potenciais (${seoAnalysis.headingResult.potentialHeadings.length})`, items: seoAnalysis.headingResult.potentialHeadings }] : null },
  ] : [];

  const seoCardsToDisplay = allSeoAnalysisCardsDefinition.filter(cardDef =>
    preferences.seoAnalysis[cardDef.key as keyof typeof preferences.seoAnalysis]?.showCard // Acessa dinamicamente
  );

  const hasVisibleSeoCards = seoCardsToDisplay.length > 0;

  return (
    <div className={`${editorLayoutStyles.editorLayout} ${isFocusMode ? editorLayoutStyles.focusModeLayoutActive : ''}`}>
      <div className={editorLayoutStyles.mainContentArea}>
        <motion.h2 /* ... Editor Title ... */ className={editorLayoutStyles.editorTitle}>Análise de SEO</motion.h2>
        <motion.p /* ... Editor Subtitle ... */ className={editorLayoutStyles.editorSubtitle}>Otimize seu texto para os motores de busca.</motion.p>
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

      {!isFocusMode && (
        <motion.div
          className={styles.seoAnalysisPanel}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          key="seoAnalysisPanel"
        >
          <h3 className={styles.panelTitle}>Análise de SEO</h3>
          <p className={styles.panelSubtitle}>Verifique os pontos chave para otimização.</p>
          <AnimatePresence>
            {(text.length > 0 && hasVisibleSeoCards && seoAnalysis) ? (
              <div className={styles.feedbackContainer}>
                {seoCardsToDisplay.map((card, index) => (
                  <motion.div
                    key={card.key}
                    className={`${styles.feedbackCard} ${getStatusClass(card.data?.status)}`}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <h4 className={styles.feedbackTitle}>{card.title}</h4>
                    <p className={styles.feedbackText}>{card.data?.feedback}</p>
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
               text.length > 0 && !hasVisibleSeoCards ? (
                  <motion.div key="empty-seo-config" className={editorLayoutStyles.emptyStateAdvancedMetrics} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <FaLightbulb />
                      <p>Nenhuma métrica de SEO selecionada para exibição. Ajuste na página de personalização.</p>
                  </motion.div>
               ) : text.length === 0 ? (
                  <motion.div key="empty-seo-text" className={editorLayoutStyles.emptyStateAdvancedMetrics} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <FaLightbulb />
                      <p>Sua análise de SEO aparecerá aqui quando você digitar.</p>
                  </motion.div>
               ) : null
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default EditorWithSEO;