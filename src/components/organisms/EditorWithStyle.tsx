// src/components/organisms/EditorWithStyle.tsx
import React, { useState, useEffect } from 'react';
import styles from './EditorWithStyle.module.scss';
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
  performStyleAnalysis,
  StyleAnalysisData,
  getEmptyStyleAnalysis,
  SentenceInfo,
  ComplexSentenceInfo
} from '../../utils/StyleAnalysis';

import { useEditor } from '../../contexts/EditorContext';
import { StyleMetricKey, DetailLevel } from '../../utils/preferences'; // Ajuste o caminho

const EditorWithStyle: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [basicMetrics, setBasicMetrics] = useState<BasicMetricsData>(calculateBasicMetrics(''));
  const [styleAnalysis, setStyleAnalysis] = useState<StyleAnalysisData>(getEmptyStyleAnalysis());

  const { preferences, isFocusMode } = useEditor();

  useEffect(() => {
    const handler = setTimeout(() => {
      setBasicMetrics(calculateBasicMetrics(text));
      setStyleAnalysis(performStyleAnalysis(text));
    }, 300);
    return () => clearTimeout(handler);
  }, [text]);

  const getLevelClass = (level: string | undefined): string => { // Aceita undefined
    switch (level?.toLowerCase()) {
      case 'excelente': return styles.levelExcelente;
      case 'bom': return styles.levelBom;
      case 'regular': return styles.levelRegular; // Supondo que você tenha esta classe
      case 'ruim': return styles.levelRuim;
      default: return styles.levelNA || '';
    }
  };

  const renderSentences = (sentences: SentenceInfo[] | ComplexSentenceInfo[], type: string) => {
    if (!sentences || sentences.length === 0) return <p className={styles.noDetails}>Nenhuma frase para destacar.</p>;
    return (
      <ul className={styles.sentenceList}>
        {sentences.slice(0, 5).map((info) => (
          <li key={`${type}-${info.index}`}>
            <span>{info.index}:</span> {info.sentence}
            {(info as ComplexSentenceInfo).wordCount && (
              <span className={styles.sentenceMeta}> ({(info as ComplexSentenceInfo).wordCount} palavras)</span>
            )}
          </li>
        ))}
        {sentences.length > 5 && <li className={styles.moreDetails}>... e mais {sentences.length - 5}.</li>}
      </ul>
    );
  };

  const cardVariants = { /* ... (mesmo cardVariants de EditorWithMetrics) ... */
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: (i: number) => ({ /* ... */ }),
  };
  
  const metricsWithDetailsConfig: StyleMetricKey[] = ['passiveVoice', 'complexSentences'];

  const allAnalysisItemsDefinition = [
    { key: 'passiveVoice' as StyleMetricKey, dataField: 'passiveVoice', title: 'Voz Passiva', detailsField: 'sentences', detailType: 'passive' },
    { key: 'adverbs' as StyleMetricKey, dataField: 'adverbs', title: 'Advérbios', detailsField: 'adverbs', detailType: 'adverbs' },
    { key: 'complexSentences' as StyleMetricKey, dataField: 'complexSentences', title: 'Frases Complexas', detailsField: 'sentences', detailType: 'complex' },
    { key: 'discourseConnectors' as StyleMetricKey, dataField: 'discourseConnectors', title: 'Conectores Discursivos', detailsField: 'connectors', detailType: 'connectors'},
    { key: 'lexicalDiversity' as StyleMetricKey, dataField: 'lexicalDiversity', title: 'Diversidade Léxica', detailsField: null, detailType: null }
  ];

  const analysisItemsToDisplay = allAnalysisItemsDefinition
    .map(itemDef => ({
      ...itemDef,
      // @ts-ignore Acessando dinamicamente styleAnalysis
      data: styleAnalysis[itemDef.dataField],
      // @ts-ignore
      detailsContent: itemDef.detailsField ? styleAnalysis[itemDef.dataField]?.[itemDef.detailsField] : null,
    }))
    .filter(item => preferences.styleAnalysis[item.key]?.showCard);

  const hasVisibleStyleCards = analysisItemsToDisplay.length > 0;

  return (
    <div className={`${editorLayoutStyles.editorLayout} ${isFocusMode ? editorLayoutStyles.focusModeLayoutActive : ''}`}>
      <div className={editorLayoutStyles.mainContentArea}>
        <motion.h2 /* ... Editor Title ... */ className={editorLayoutStyles.editorTitle}>Análise de Estilo</motion.h2>
        <motion.p /* ... Editor Subtitle ... */ className={editorLayoutStyles.editorSubtitle}>Descubra mais sobre a forma como você escreve!</motion.p>
        <div className={editorLayoutStyles.toolbarWrapper}>
          <MetricsToolbar metrics={basicMetrics} />
        </div>
        <TextArea
          className={editorLayoutStyles.editorAreaAdapter}
          placeholder="Cole seu texto aqui para analisar o estilo..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={15}
        />
      </div>

      {!isFocusMode && (
        <motion.div
          className={styles.styleAnalysisPanel}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          key="styleAnalysisPanel"
        >
          <h3 className={styles.panelTitle}>Análise de Estilo</h3>
          <p className={styles.panelSubtitle}>Todo o feedback de análise de estilo.</p>
          <AnimatePresence>
            {(text.length > 0 && hasVisibleStyleCards) ? (
              <div className={styles.feedbackContainer}>
                {analysisItemsToDisplay.map((item, index) => {
                  const currentMetricPref = preferences.styleAnalysis[item.key];
                  const detailLevel = currentMetricPref && metricsWithDetailsConfig.includes(item.key)
                                      ? currentMetricPref.detailLevel
                                      : undefined;
                  const showDetailsTag = detailLevel === 'details_expanded' || detailLevel === 'details_collapsed';

                  return (
                    <motion.div
                      key={item.key}
                      className={`${styles.feedbackCard} ${getLevelClass(item.data?.level)}`}
                      custom={index}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <h4 className={styles.feedbackTitle}>{item.title}</h4>
                      <p className={styles.feedbackText}>{item.data?.feedback}</p>
                      
                      {(item.detailsContent && item.data?.count > 0 && showDetailsTag) && (
                        <details
                          className={styles.details}
                          {...(detailLevel === 'details_expanded' && { open: true })}
                        >
                          <summary>Ver {item.detailType === 'adverbs' || item.detailType === 'connectors' ? 'lista' : 'frases'} ({item.data.count})</summary>
                          {Array.isArray(item.detailsContent) ? (
                            (item.detailType === 'adverbs' || item.detailType === 'connectors') ?
                              <p className={styles.wordList}>{(item.detailsContent as string[]).slice(0,15).join(', ')}{(item.detailsContent.length > 15 ? '...' : '')}</p> :
                              renderSentences(item.detailsContent as SentenceInfo[] | ComplexSentenceInfo[], item.detailType!)
                          ) : null}
                        </details>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              text.length > 0 && !hasVisibleStyleCards ? (
                  <motion.div key="empty-style-config" className={editorLayoutStyles.emptyStateAdvancedMetrics} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <FaLightbulb />
                      <p>Nenhuma métrica de estilo selecionada para exibição. Ajuste na página de personalização.</p>
                  </motion.div>
              ) : text.length === 0 ? (
                  <motion.div key="empty-style-text" className={editorLayoutStyles.emptyStateAdvancedMetrics} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <FaLightbulb />
                      <p>Sua análise de estilo aparecerá aqui quando você digitar.</p>
                  </motion.div>
              ) : null
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default EditorWithStyle;