// src/components/organisms/EditorWithMetrics.tsx
import React, { useState, useEffect } from 'react';
import styles from './EditorWithMetrics.module.scss';
import editorLayoutStyles from './EditorWithMetrics.module.scss'; // Reutiliza o mesmo para .editorLayout e .mainContentArea
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel, Pagination, Navigation } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLightbulb } from 'react-icons/fa';

import TextArea from '../atoms/TextArea';
import MetricsToolbar from '../molecules/MetricsToolbar';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import {
  calculateBasicMetrics,
  BasicMetricsData,
} from '../../utils/BasicMetrics';
import {
  calculateAdvancedMetrics,
  AdvancedMetricsData,
  ReadabilityIndices, // Usado para tipar advancedMetrics.readability[key]
  getEmptyAdvancedMetrics,
  SentimentScore
} from '../../utils/AdvancedMetrics';
import lexicoData from '../../utils/lexico.json'; //

import { useEditor } from '../../contexts/EditorContext';
import { ReadabilityIndexKey } from '../../utils/preferences'; // Ajuste o caminho

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
    // { key: 'gulpeaseIndex', label: 'Gulpease' }, // Adicione se for usar
];

const EditorWithMetrics: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [basicMetrics, setBasicMetrics] = useState<BasicMetricsData>(calculateBasicMetrics(''));
  const [advancedMetrics, setAdvancedMetrics] = useState<AdvancedMetricsData>(getEmptyAdvancedMetrics());
  
  const { preferences, isFocusMode } = useEditor();

  useEffect(() => {
    const handler = setTimeout(() => {
      setBasicMetrics(calculateBasicMetrics(text));
      setAdvancedMetrics(calculateAdvancedMetrics(text, lexico));
    }, 300);
    return () => clearTimeout(handler);
  }, [text]);

  const formatSentiment = (sentiment: SentimentScore): string => {
    const score = sentiment.compound;
    let emoji = '😐';
    if (sentiment.sentiment === 'positivo') emoji = '😊';
    else if (sentiment.sentiment === 'negativo') emoji = '😟';
    return `${emoji} ${sentiment.sentiment.charAt(0).toUpperCase() + sentiment.sentiment.slice(1)} (${score.toFixed(2)})`;
  };

  const getLevelClass = (level: string | undefined): string => { // Aceita undefined
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.07,
        duration: 0.4,
        ease: "easeOut"
      }
    })
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
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={15}
        />
      </div>

      {!isFocusMode && ( // O painel avançado só é renderizado se NÃO estiver em Modo Foco
        <motion.div
          className={styles.advancedMetricsPanel}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          // Adicionar key para AnimatePresence funcionar corretamente se o painel some/aparece
          key="advancedMetricsPanel"
        >
          <h3 className={styles.advancedPanelTitle}>Métricas Avançadas</h3>
          <p className={styles.advancedSubtitle}>Analise a legibilidade do seu texto de forma mais profunda.</p>

          <AnimatePresence>
            {(text.length > 0 && shouldShowAnyAdvancedCard) ? (
              <motion.div
                className={styles.advancedGridContainer}
                initial="hidden"
                animate="visible" // Os cards internos terão sua própria animação com 'custom'
              >
                {preferences.advancedMetrics.showLengthCard && (
                  <motion.div className={`${styles.advancedGridItem} ${styles.advancedCard}`} custom={0} variants={cardVariants} initial="hidden" animate="visible">
                    <span className={styles.advancedCardTitle}>Comprimento do Texto</span>
                    <div className={styles.advancedCardContent}>
                      <p className={`${styles.metricFeedback} ${getLevelClass(advancedMetrics.textLengthWords < 300 ? 'ruim' : advancedMetrics.textLengthWords <= 2000 ? 'bom' : 'ruim')}`}>
                        {advancedMetrics.feedbackComprimento || 'Digite para feedback.'}
                      </p>
                    </div>
                  </motion.div>
                )}

                {preferences.advancedMetrics.showRedundancyCard && (
                  <motion.div className={`${styles.advancedGridItem} ${styles.advancedCard}`} custom={1} variants={cardVariants} initial="hidden" animate="visible">
                    <span className={styles.advancedCardTitle}>Redundância</span>
                    <div className={styles.advancedCardContent}>
                      <p>Índice: <span className={styles.metricHighlight}>{advancedMetrics.redundancy.index.toFixed(1)}%</span></p>
                      <p className={`${styles.metricFeedback} ${getLevelClass(advancedMetrics.redundancy.level)}`}>
                        {advancedMetrics.redundancy.feedback || 'Digite para feedback.'}
                      </p>
                    </div>
                  </motion.div>
                )}

                {preferences.advancedMetrics.showSentimentCard && (
                  <motion.div className={`${styles.advancedGridItem} ${styles.advancedCard}`} custom={2} variants={cardVariants} initial="hidden" animate="visible">
                    <span className={styles.advancedCardTitle}>Análise de Sentimento</span>
                    <div className={styles.advancedCardContent}>
                      <p className={styles.metricHighlightLarge}>{formatSentiment(advancedMetrics.sentiment)}</p>
                    </div>
                  </motion.div>
                )}
                
                {(preferences.advancedMetrics.showReadabilityCarousel && readabilityIndicesToDisplay.length > 0) && (
                  <motion.div
                    className={`${styles.advancedGridItem} ${styles.readabilityCarouselContainer}`}
                    custom={3}
                    variants={cardVariants} initial="hidden" animate="visible"
                  >
                    <h4>Índices de Legibilidade</h4>
                    <Swiper
                      modules={[Pagination, Mousewheel, Navigation]}
                      spaceBetween={10}
                      slidesPerView={1}
                      pagination={{ clickable: true, dynamicBullets: true, el: `.${styles.customPagination}` }}
                      mousewheel={true}
                      navigation
                      className={styles.readabilitySwiper}
                    >
                      {readabilityIndicesToDisplay.map(({ key, label }) => {
                        const result = advancedMetrics.readability[key as keyof ReadabilityIndices];
                        return (
                          <SwiperSlide key={key} className={styles.readabilitySlide}>
                            <div className={styles.readabilityCard}>
                              <span className={styles.readabilityName}>{label}</span>
                              <span className={`${styles.readabilityValue} ${getLevelClass(result?.level)}`}>
                                {result?.score?.toFixed(1) ?? 'N/A'}
                              </span>
                              <span className={`${styles.readabilityLevel} ${getLevelClass(result?.level)}`}>{result?.level ?? 'Indisponível'}</span>
                              <span className={styles.readabilityFeedback}>{result?.feedback || 'Sem dados para este índice.'}</span>
                            </div>
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
                   <motion.div key="empty-metrics-config" className={styles.emptyStateAdvancedMetrics} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <FaLightbulb />
                      <p>Nenhuma métrica avançada selecionada para exibição. Ajuste na página de personalização.</p>
                  </motion.div>
              ) : text.length === 0 ? (
                  <motion.div key="empty-metrics-text" className={styles.emptyStateAdvancedMetrics} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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