// src/components/organisms/EditorWithMetrics.tsx
import React, { useState, useEffect } from 'react';
import styles from './EditorWithMetrics.module.scss';
import editorLayoutStyles from './EditorWithMetrics.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import {  Mousewheel, Pagination, Navigation } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLightbulb } from 'react-icons/fa';

import TextArea from '../atoms/TextArea';
import MetricsToolbar from '../molecules/MetricsToolbar';
import { useContentProfile } from '../../contexts/ContentProfileContext';

import {
  calculateBasicMetrics,
  BasicMetricsData,
} from '../../utils/BasicMetrics';
import {
  calculateAdvancedMetrics,
  ReadabilityIndices,
  SentimentScore
} from '../../utils/AdvancedMetrics';
import lexicoData from '../../utils/lexico.json';

import { useEditor } from '../../contexts/EditorContext';
import { ReadabilityIndexKey } from '../../utils/preferences';

interface Lexico {
  positive: string[];
  negative: string[];
  intensifiers: string[];
  negations: string[];
  positiveEmojis: string[];
  negativeEmojis: string[];
  bigramsPositive?: string[];
  bigramsNegative?: string[];
}
const lexico: Lexico = lexicoData as Lexico;

const allReadabilityIndicesOptions: { key: ReadabilityIndexKey; label: string }[] = [
    { key: 'jurbiX', label: 'JurbiX' },
    { key: 'fleschKincaidReadingEase', label: 'Flesch-Kincaid' },
    { key: 'gunningFog', label: 'Gunning Fog' },
    { key: 'smogIndex', label: 'SMOG' },
    { key: 'colemanLiauIndex', label: 'Coleman-Liau' },
];

const EditorWithMetrics: React.FC = () => {
  const [basicMetrics] = useState<BasicMetricsData>(calculateBasicMetrics(''));
  const { 
  preferences, 
  isFocusMode, 
  text,                 // <<< ADICIONADO para ler do contexto
  setText,              // <<< ADICIONADO para atualizar o contexto
  advancedMetrics,      
  setAdvancedMetricsData,
  styleAnalysis,
  } = useEditor();
  const { thresholds } = useContentProfile();

  useEffect(() => {
  const handler = setTimeout(() => {
    const newAdvancedMetrics = calculateAdvancedMetrics(text, lexico, styleAnalysis, thresholds);
    setAdvancedMetricsData(newAdvancedMetrics);
    }, 300);
  return () => clearTimeout(handler);
}, [text, lexico, setAdvancedMetricsData, styleAnalysis, thresholds]);

  const formatSentiment = (sentiment: SentimentScore): string => {
    const score = sentiment.compound;
    let emoji = '😐';
    if (sentiment.sentiment === 'positivo') emoji = '😊';
    else if (sentiment.sentiment === 'negativo') emoji = '😟';
    return `${emoji} ${sentiment.sentiment.charAt(0).toUpperCase() + sentiment.sentiment.slice(1)} (${score.toFixed(2)})`;
  };

  const getLevelClass = (level: string | undefined): string => {
    switch (level?.toLowerCase()) {
      case 'muito fácil': return styles.levelMuitoFacil;
      case 'fácil': return styles.levelFacil;
      case 'médio': return styles.levelMedio;
      case 'difícil': return styles.levelDificil;
      case 'excelente': return styles.levelExcelente;
      case 'bom': return styles.levelBom;
      case 'regular': return styles.levelRegular;
      case 'ruim': return styles.levelRuim;
      default: return styles.levelNA || '';
    }
  };

  // Variantes para os cards principais dentro do grid
  const gridItemCardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: (i: number) => ({ // Aceita o índice para delay escalonado
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.07,
        duration: 0.4,
        ease: "easeOut"
      }
    }),
    // Animação de saída para cada card individual se o container pai (grid) não tiver uma exit própria
    // ou se quisermos que os cards sumam de forma escalonada também.
    // Se o grid container tiver um exit, esta pode não ser necessária.
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 10, 
      transition: { duration: 0.2, ease: "easeIn" } 
    } 
  };
  
  // Variantes para o conteúdo dos cards de legibilidade no Swiper
  const readabilityCardContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      }
    },
    // Adicionando exit aqui também para consistência se o slide mudar
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } }
  };

  // Variantes para a animação de mudança de valores numéricos
  const valueChangeVariants = {
    initial: { opacity: 0.3, y: -8 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  // Variantes para as mensagens de estado vazio
  const emptyStateVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }
  };

  // Variantes para o container do grid de métricas
  const gridContainerVariants = {
    initial: { opacity: 0 }, // Pode ser mais sutil, pois os filhos animam
    animate: { opacity: 1, transition: { duration: 0.1 } }, // Entrada rápida
    exit: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" } } // Saída coordenada
  };


  const readabilityIndicesToDisplay = allReadabilityIndicesOptions.filter(option =>
    preferences.advancedMetrics.visibleReadabilityIndices.includes(option.key)
  );

  const shouldShowAnyAdvancedCard = 
    preferences.advancedMetrics.showLengthCard ||
    preferences.advancedMetrics.showRedundancyCard ||
    preferences.advancedMetrics.showSentimentCard ||
    (preferences.advancedMetrics.showReadabilityCarousel && readabilityIndicesToDisplay.length > 0);

  return (
    <div className={`${editorLayoutStyles.editorLayout} ${isFocusMode ? editorLayoutStyles.focusModeLayoutActive : ''}`}>
      <div className={editorLayoutStyles.mainContentArea}>
        <motion.h2
            className={editorLayoutStyles.editorTitle}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            Editor Scripty
        </motion.h2>
        <motion.p
            className={editorLayoutStyles.editorSubtitle}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        >
            Metrifique o seu texto da melhor forma.
        </motion.p>

        <div className={editorLayoutStyles.toolbarWrapper}>
          <MetricsToolbar metrics={basicMetrics} />
        </div>

        <TextArea
         className={editorLayoutStyles.editorAreaAdapter}
         placeholder="Comece a escrever seu texto aqui..."
          value={text} // <<< Usa o 'text' do contexto
         onChange={(e) => setText(e.target.value)} // <<< Chama o 'setText' do contexto
         rows={15}
        />
      </div>

      {!isFocusMode && advancedMetrics && ( 
        <motion.div
          className={styles.advancedMetricsPanel}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        >
          <h3 className={styles.advancedPanelTitle}>Métricas Avançadas</h3>
          <p className={styles.advancedSubtitle}>Analise a legibilidade do seu texto de forma mais profunda.</p>

          <AnimatePresence mode="wait"> 
            {(text.length > 0 && shouldShowAnyAdvancedCard) ? (
              <motion.div
                key="metrics-grid-container" 
                className={styles.advancedGridContainer}
                variants={gridContainerVariants} // Usar variantes para o container do grid
                initial="initial"
                animate="animate"
                exit="exit" 
              >
                {preferences.advancedMetrics.showLengthCard && (
                  <motion.div 
                    className={`${styles.advancedGridItem} ${styles.advancedCard}`} 
                    custom={0} 
                    variants={gridItemCardVariants}
                    initial="hidden" 
                    animate="visible"
                    // exit="exit" // Se o gridItemCardVariants tiver a prop exit
                  >
                    <span className={styles.advancedCardTitle}>Comprimento do Texto</span>
                    <div className={styles.advancedCardContent}>
                      <motion.p
                        key={`length-feedback-${advancedMetrics.feedbackComprimento}`} 
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`${styles.metricFeedback} ${getLevelClass(advancedMetrics.textLengthWords < 300 ? 'ruim' : advancedMetrics.textLengthWords <= 2000 ? 'bom' : 'ruim')}`}>
                        {advancedMetrics.feedbackComprimento || 'Digite para feedback.'}
                      </motion.p>
                    </div>
                  </motion.div>
                )}

                {preferences.advancedMetrics.showRedundancyCard && (
                  <motion.div 
                    className={`${styles.advancedGridItem} ${styles.advancedCard}`} 
                    custom={1} 
                    variants={gridItemCardVariants}
                    initial="hidden"
                    animate="visible"
                    // exit="exit"
                  >
                    <span className={styles.advancedCardTitle}>Redundância</span>
                    <div className={styles.advancedCardContent}>
                      <p>
                        Índice:{" "}
                        <motion.span
                          key={`redundancy-value-${advancedMetrics.redundancy.index}`} 
                          variants={valueChangeVariants}
                          initial="initial"
                          animate="animate"
                          className={styles.metricHighlight}
                        >
                          {advancedMetrics.redundancy.index.toFixed(1)}%
                        </motion.span>
                      </p>
                      <motion.p
                        key={`redundancy-feedback-${advancedMetrics.redundancy.level}`}
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`${styles.metricFeedback} ${getLevelClass(advancedMetrics.redundancy.level)}`}>
                        {advancedMetrics.redundancy.feedback || 'Digite para feedback.'}
                      </motion.p>
                    </div>
                  </motion.div>
                )}

                {preferences.advancedMetrics.showSentimentCard && (
                  <motion.div 
                    className={`${styles.advancedGridItem} ${styles.advancedCard}`} 
                    custom={2} 
                    variants={gridItemCardVariants}
                    initial="hidden"
                    animate="visible"
                    // exit="exit"
                  >
                    <span className={styles.advancedCardTitle}>Análise de Sentimento</span>
                    <div className={styles.advancedCardContent}>
                       <motion.p
                        key={`sentiment-value-${advancedMetrics.sentiment.compound}`}
                        variants={valueChangeVariants}
                        initial="initial"
                        animate="animate"
                        className={styles.metricHighlightLarge}>
                          {formatSentiment(advancedMetrics.sentiment)}
                        </motion.p>
                    </div>
                  </motion.div>
                )}
                
                {(preferences.advancedMetrics.showReadabilityCarousel && readabilityIndicesToDisplay.length > 0) && (
                  <motion.div
                    className={`${styles.advancedGridItem} ${styles.readabilityCarouselContainer}`}
                    custom={3} 
                    variants={gridItemCardVariants} 
                    initial="hidden"
                    animate="visible"
                    // exit="exit"
                  >
                    <h4>Índices de Legibilidade</h4>
                    <Swiper
                      modules={[Pagination, Mousewheel, Navigation]}
                      spaceBetween={10}
                      slidesPerView={1}
                      pagination={{ clickable: true, dynamicBullets: true, el: `.${styles.customPagination}` }}
                      mousewheel={{ forceToAxis: true }}
                      navigation
                      className={styles.readabilitySwiper}
                    >
                      {readabilityIndicesToDisplay.map(({ key, label }) => {
                        const result = advancedMetrics.readability[key as keyof ReadabilityIndices];
                        return (
                          <SwiperSlide key={key} className={styles.readabilitySlide}>
                            <motion.div
                              className={styles.readabilityCard}
                              key={`readability-card-${key}-${result?.score}`} 
                              variants={readabilityCardContentVariants} 
                              initial="hidden"
                              animate="visible" 
                              exit="exit" // Para animar a saída do conteúdo do slide
                            >
                              <span className={styles.readabilityName}>{label}</span>
                              <motion.span
                                key={`score-value-${key}-${result?.score}`}
                                variants={valueChangeVariants}
                                initial="initial"
                                animate="animate"
                                className={`${styles.readabilityValue} ${getLevelClass(result?.level)}`}
                              >
                                {result?.score?.toFixed(1) ?? 'N/A'}
                              </motion.span>
                              <motion.span 
                                key={`level-text-${key}-${result?.level}`}
                                initial={{ opacity: 0.5 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className={`${styles.readabilityLevel} ${getLevelClass(result?.level)}`}
                              >
                                {result?.level ?? 'Indisponível'}
                              </motion.span>
                              <motion.span 
                                key={`feedback-text-${key}-${result?.feedback}`}
                                initial={{ opacity: 0.5 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.1 }} 
                                className={styles.readabilityFeedback}
                              >
                                {result?.feedback || 'Sem dados para este índice.'}
                              </motion.span>
                            </motion.div>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                    <div className={styles.customPagination}></div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              text.length > 0 && !shouldShowAnyAdvancedCard ? (
                   <motion.div 
                      key="empty-metrics-config" 
                      className={styles.emptyStateAdvancedMetrics} 
                      variants={emptyStateVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit" 
                    >
                      <FaLightbulb />
                      <p>Nenhuma métrica avançada selecionada para exibição. Ajuste na página de personalização.</p>
                  </motion.div>
              ) : text.length === 0 ? (
                   <motion.div 
                      key="empty-metrics-text" 
                      className={styles.emptyStateAdvancedMetrics} 
                      variants={emptyStateVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit" 
                    >
                      <FaLightbulb />
                      <p>Suas métricas avançadas aparecerão aqui assim que você começar a digitar.</p>
                  </motion.div>
              ) : null
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default EditorWithMetrics;