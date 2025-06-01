// src/components/organisms/EditorWithStyle.tsx
import React, { useState, useEffect } from 'react';
import styles from './EditorWithStyle.module.scss';
// Usaremos editorLayoutStyles para as classes de layout base e a classe de modo foco
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

import { useEditor } from '../../contexts/EditorContext'; // Importar para isFocusMode e preferences
import { StyleMetricKey, DetailLevel } from '../../utils/preferences'; // Ajuste o caminho

const EditorWithStyle: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [basicMetrics, setBasicMetrics] = useState<BasicMetricsData>(calculateBasicMetrics(''));
  const [styleAnalysis, setStyleAnalysis] = useState<StyleAnalysisData>(getEmptyStyleAnalysis());

  // Obter isFocusMode e preferences do contexto
  const { preferences, isFocusMode } = useEditor();

  useEffect(() => {
    const handler = setTimeout(() => {
      setBasicMetrics(calculateBasicMetrics(text));
      const newStyleAnalysis = performStyleAnalysis(text);
      setStyleAnalysis(newStyleAnalysis);
      // console.log("Estado styleAnalysis ATUALIZADO:", newStyleAnalysis); // Mantenha para debugging se necessário
    }, 300);
    return () => clearTimeout(handler);
  }, [text]);

  const getLevelClass = (level: string | undefined): string => {
    switch (level?.toLowerCase()) {
      case 'excelente': return styles.levelExcelente;
      case 'bom': return styles.levelBom;
      case 'regular': return styles.levelRegular;
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: (i: number) => ({ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.07, duration: 0.4, ease: "easeOut" } }),
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
      data: styleAnalysis[itemDef.dataField as keyof StyleAnalysisData],
      detailsContent: itemDef.detailsField ? styleAnalysis[itemDef.dataField as keyof StyleAnalysisData]?.[itemDef.detailsField as keyof {}] : null,
    }))
    .filter(item => preferences.styleAnalysis[item.key as StyleMetricKey]?.showCard);

  const hasVisibleStyleCards = analysisItemsToDisplay.length > 0;

  return (
    // Adiciona a classe focusModeLayoutActive ao layout do editor SE o modo foco estiver ativo
    <div className={`${editorLayoutStyles.editorLayout} ${isFocusMode ? editorLayoutStyles.focusModeLayoutActive : ''}`}>
      <div className={editorLayoutStyles.mainContentArea}> {/* Esta área se expandirá no modo foco */}
        <motion.h2 className={editorLayoutStyles.editorTitle} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}>Análise de Estilo</motion.h2>
        <motion.p className={editorLayoutStyles.editorSubtitle} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}>Descubra mais sobre a forma como você escreve!</motion.p>
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

      {/* O painel de análise de estilo só é renderizado se NÃO estiver em Modo Foco */}
      {!isFocusMode && (
        <motion.div
          className={styles.styleAnalysisPanel} // Estilos específicos do painel de estilo
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          key="styleAnalysisPanel" // Chave para AnimatePresence, se o painel fosse animado em sua entrada/saída
        >
          <h3 className={styles.panelTitle}>Análise de Estilo</h3>
          <p className={styles.panelSubtitle}>Todo o feedback de análise de estilo.</p>
          <AnimatePresence>
            {(text.length > 0 && hasVisibleStyleCards) ? (
              <div className={styles.feedbackContainer}>
                {analysisItemsToDisplay.map((item, index) => {
                  // Log para depuração dos dados do card (PODE SER REMOVIDO APÓS TESTE)
                  // console.log(`Renderizando Card Estilo: ${item.title}`, "Dados:", item.data, "Pref:", preferences.styleAnalysis[item.key as StyleMetricKey]);

                  const currentMetricPref = preferences.styleAnalysis[item.key as StyleMetricKey];
                  const detailLevel = currentMetricPref && metricsWithDetailsConfig.includes(item.key as StyleMetricKey)
                                      ? currentMetricPref.detailLevel
                                      : undefined;
                  const showDetailsTag = detailLevel === 'details_expanded' || detailLevel === 'details_collapsed';

                  return (
                    <motion.div
                      key={item.key}
                      className={`${styles.feedbackCard} ${getLevelClass(item.data?.level)}`}
                      custom={index} variants={cardVariants} initial="hidden" animate="visible"
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
                      <p>Nenhuma métrica de estilo selecionada. Ajuste na personalização.</p>
                  </motion.div>
              ) : text.length === 0 ? (
                  <motion.div key="empty-style-text" className={editorLayoutStyles.emptyStateAdvancedMetrics} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <FaLightbulb />
                      <p>Sua análise de estilo aparecerá aqui.</p>
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