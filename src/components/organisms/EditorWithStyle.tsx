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
import { StyleMetricKey, DetailLevel } from '../../utils/preferences';

const EditorWithStyle: React.FC = () => {
  const [basicMetrics, setBasicMetrics] = useState<BasicMetricsData>(calculateBasicMetrics(''));
  const { 
  preferences, 
  isFocusMode,
  text,                 // <<< ADICIONE para ler do contexto
  setText,              // <<< ADICIONE para atualizar o contexto
  styleAnalysis,           
  setStyleAnalysisData     
  } = useEditor();

 useEffect(() => {
  const handler = setTimeout(() => {
    setBasicMetrics(calculateBasicMetrics(text)); // 'text' agora é o global do contexto
    const newStyleAnalysis = performStyleAnalysis(text); // 'text' agora é o global
    setStyleAnalysisData(newStyleAnalysis);
  }, 300);
  return () => clearTimeout(handler);
  }, [text, setStyleAnalysisData]); 

  const getLevelClass = (level: string | undefined): string => {
    switch (level?.toLowerCase()) {
      case 'excelente': return styles.levelExcelente;
      case 'bom': return styles.levelBom;
      case 'regular': return styles.levelRegular;
      case 'ruim': return styles.levelRuim;
      default: return styles.levelNA || '';
    }
  };

  // Variantes para os cards individuais de feedback de estilo
  const feedbackCardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { delay: i * 0.07, duration: 0.4, ease: "easeOut" } 
    }),
    // Adicionando exit para cada card se o container principal for removido
    // Isso garante que eles saiam antes do container, se o staggerChildren for usado na saída do container
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15, ease: "easeIn" } }
  };
  
  // Variantes para o container dos cards de feedback de estilo
  const feedbackItemsContainerVariants = { // Renomeado para clareza
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.2, delay: 0.1 } }, // Leve delay para entrar após a msg de saida
    exit: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }
  };
  
  // Variantes para as mensagens de estado vazio
  const emptyStateVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }
  };

  // Variantes para animar a mudança do texto de feedback
  const feedbackTextChangeVariants = {
    initial: { opacity: 0.5, y: -5 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };
  
  // Variantes para a lista de sentenças/palavras dentro do <details>
  const detailsContentListVariants = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2, ease: "easeIn" } }
  };

  const sentenceItemVariants = {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, x: 10, transition: { duration: 0.15, ease: "easeIn" } }
  };


  const renderSentences = (sentences: SentenceInfo[] | ComplexSentenceInfo[], type: string) => {
    if (!sentences || sentences.length === 0) return <p className={styles.noDetails}>Nenhuma frase para destacar.</p>;
    return (
      <motion.ul 
        className={styles.sentenceList}
        variants={{ // Animação para o container da lista
          open: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
          closed: { opacity: 0 }
        }}
        initial="closed"
        animate="open"
        exit="closed" // Para quando o <details> fechar, se controlarmos
      >
        {sentences.slice(0, 5).map((info) => (
          <motion.li 
            key={`${type}-${info.index}`}
            variants={sentenceItemVariants} // Anima cada item da lista
            // initial, animate, exit são controlados pelo stagger do pai (ul)
          >
            <span>{info.index}:</span> {info.sentence}
            {(info as ComplexSentenceInfo).wordCount && (
              <span className={styles.sentenceMeta}> ({(info as ComplexSentenceInfo).wordCount} palavras)</span>
            )}
          </motion.li>
        ))}
        {sentences.length > 5 && <li className={styles.moreDetails}>... e mais {sentences.length - 5}.</li>}
      </motion.ul>
    );
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

  // Para controlar a animação do <details>
  const [openDetails, setOpenDetails] = useState<Record<string, boolean>>({});
  const toggleDetails = (key: string) => {
    setOpenDetails(prev => ({ ...prev, [key]: !prev[key] }));
  };


  return (
    <div className={`${editorLayoutStyles.editorLayout} ${isFocusMode ? editorLayoutStyles.focusModeLayoutActive : ''}`}>
      <div className={editorLayoutStyles.mainContentArea}>
        <motion.h2 className={editorLayoutStyles.editorTitle} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}>Análise de Estilo</motion.h2>
        <motion.p className={editorLayoutStyles.editorSubtitle} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}>Descubra mais sobre a forma como você escreve!</motion.p>
        <div className={editorLayoutStyles.toolbarWrapper}>
          <MetricsToolbar metrics={basicMetrics} />
        </div>
        <TextArea
          className={editorLayoutStyles.editorAreaAdapter}
          placeholder="Cole seu texto aqui para analisar o estilo..."
          value={text} // <<< Usa o 'text' do contexto
          onChange={(e) => setText(e.target.value)}
          rows={15}
        />
      </div>

      {!isFocusMode && styleAnalysis && (
        <motion.div
          className={styles.styleAnalysisPanel}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        >
          <h3 className={styles.panelTitle}>Análise de Estilo</h3>
          <p className={styles.panelSubtitle}>Todo o feedback de análise de estilo.</p>
          
          <AnimatePresence mode="wait">
            {(text.length > 0 && hasVisibleStyleCards) ? (
              <motion.div 
                key="style-feedback-items-container"
                className={styles.feedbackContainer}
                variants={feedbackItemsContainerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {analysisItemsToDisplay.map((item, index) => {
                  const currentMetricPref = preferences.styleAnalysis[item.key as StyleMetricKey];
                  const detailLevel = currentMetricPref && metricsWithDetailsConfig.includes(item.key as StyleMetricKey)
                                      ? currentMetricPref.detailLevel
                                      : undefined;
                  
                  // Determina se o <details> deve começar aberto com base nas preferências
                  const initiallyOpen = detailLevel === 'details_expanded';
                  // Atualiza o estado openDetails se ainda não estiver lá ou se a preferência mudou
                  // Isso é um pouco complexo de sincronizar perfeitamente com preferências dinâmicas.
                  // Uma abordagem mais simples é usar a prop 'open' do details diretamente se não precisar de animação customizada no toggle.

                  return (
                    <motion.div
                      key={item.key}
                      className={`${styles.feedbackCard} ${getLevelClass(item.data?.level)}`}
                      custom={index} 
                      variants={feedbackCardVariants}
                      initial="hidden"
                      animate="visible"
                      // exit="exit" // A saída será controlada pelo feedbackItemsContainerVariants
                    >
                      <h4 className={styles.feedbackTitle}>{item.title}</h4>
                      <motion.p
                        key={item.data?.feedback} 
                        className={styles.feedbackText}
                        variants={feedbackTextChangeVariants}
                        initial="initial"
                        animate="animate"
                      >
                        {item.data?.feedback}
                      </motion.p>
                      
                      {item.detailsContent && item.data?.count > 0 && (metricsWithDetailsConfig.includes(item.key as StyleMetricKey)) && (
                        <div className={styles.detailsWrapper}>
                          <motion.button 
                            onClick={() => toggleDetails(item.key)} 
                            className={styles.summaryButton}
                            aria-expanded={openDetails[item.key] ?? initiallyOpen}
                          >
                            Ver {item.detailType === 'adverbs' || item.detailType === 'connectors' ? 'lista' : 'frases'} ({item.data.count})
                            <motion.span className={styles.summaryChevron} animate={{ rotate: (openDetails[item.key] ?? initiallyOpen) ? 180 : 0 }}>&#9660;</motion.span>
                          </motion.button>
                          <AnimatePresence initial={false}>
                            {(openDetails[item.key] ?? initiallyOpen) && (
                              <motion.div
                                key="details-content"
                                variants={detailsContentListVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                style={{ overflow: 'hidden' }} // Necessário para animar height
                              >
                                {Array.isArray(item.detailsContent) ? (
                                  (item.detailType === 'adverbs' || item.detailType === 'connectors') ?
                                    <motion.p 
                                      className={styles.wordList}
                                      initial={{ opacity: 0 }} animate={{ opacity: 1}} transition={{duration: 0.3}}
                                    >
                                      {(item.detailsContent as string[]).slice(0,15).join(', ')}{(item.detailsContent.length > 15 ? '...' : '')}
                                    </motion.p> 
                                    :
                                    renderSentences(item.detailsContent as SentenceInfo[] | ComplexSentenceInfo[], item.detailType!)
                                ) : null}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              text.length > 0 && !hasVisibleStyleCards ? (
                  <motion.div 
                    key="empty-style-config" 
                    className={editorLayoutStyles.emptyStateAdvancedMetrics} 
                    variants={emptyStateVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                      <FaLightbulb />
                      <p>Nenhuma métrica de estilo selecionada. Ajuste na personalização.</p>
                  </motion.div>
              ) : text.length === 0 ? (
                  <motion.div 
                    key="empty-style-text" 
                    className={editorLayoutStyles.emptyStateAdvancedMetrics} 
                    variants={emptyStateVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
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