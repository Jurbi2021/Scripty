import React, { useState, useEffect } from 'react';
import styles from './EditorWithMetrics.module.scss';
import MetricsToolbar from '../molecules/MetricsToolbar'; // Import the new molecule
import { Swiper, SwiperSlide } from 'swiper/react'; // Keep for advanced metrics carousel
import { Pagination, Mousewheel } from 'swiper/modules'; // Keep for advanced metrics carousel

// Import Swiper styles (only for advanced carousel now)
import 'swiper/css';
import 'swiper/css/pagination';

// Import metric functions and types
import {
  calculateBasicMetrics,
  BasicMetricsData,
} from '../../utils/BasicMetrics';
import {
  calculateAdvancedMetrics,
  AdvancedMetricsData,
  ReadabilityIndices,
  ReadabilityIndexResult,
  RedundancyResult,
  getEmptyAdvancedMetrics,
  SentimentScore
} from '../../utils/AdvancedMetrics';

// Import Lexico data directly
import lexicoData from '../../utils/lexico.json';

// Define Lexico type
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

// Define structure for advanced readability display
const readabilityIndicesDisplayOrder: { key: keyof ReadabilityIndices; label: string }[] = [
    { key: 'jurbiX', label: 'JurbiX' },
    { key: 'fleschKincaidReadingEase', label: 'Flesch-Kincaid' },
    { key: 'gunningFog', label: 'Gunning Fog' },
    { key: 'smogIndex', label: 'SMOG' },
    { key: 'colemanLiauIndex', label: 'Coleman-Liau' },
    // { key: 'gulpeaseIndex', label: 'Gulpease' },
];

const EditorWithMetrics: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [basicMetrics, setBasicMetrics] = useState<BasicMetricsData>(calculateBasicMetrics(''));
  const [advancedMetrics, setAdvancedMetrics] = useState<AdvancedMetricsData>(getEmptyAdvancedMetrics());

  // Calculate metrics when text changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setBasicMetrics(calculateBasicMetrics(text));
      setAdvancedMetrics(calculateAdvancedMetrics(text, lexico));
    }, 250);

    return () => {
      clearTimeout(handler);
    };
  }, [text]);

  // Helper to format sentiment
  const formatSentiment = (sentiment: SentimentScore) => {
    const score = sentiment.compound;
    let emoji = '😐';
    if (sentiment.sentiment === 'positivo') emoji = '😊';
    else if (sentiment.sentiment === 'negativo') emoji = '😟';
    return `${emoji} ${sentiment.sentiment.charAt(0).toUpperCase() + sentiment.sentiment.slice(1)} (${score.toFixed(2)})`;
  };

  // Helper to get CSS class based on level (optional, for styling)
  const getLevelClass = (level: string): string => {
    switch (level?.toLowerCase()) { // Added optional chaining
      case 'muito fácil': return styles.levelMuitoFacil;
      case 'fácil': return styles.levelFacil;
      case 'médio': return styles.levelMedio;
      case 'difícil': return styles.levelDificil;
      case 'excelente': return styles.levelExcelente;
      case 'bom': return styles.levelBom;
      case 'regular': return styles.levelRegular;
      case 'ruim': return styles.levelRuim;
      default: return '';
    }
  };

  return (
    <div className={styles.editorLayout}>
      {/* Main Editor Area (Left/Center) */}
      <div className={styles.mainContentArea}>
        <h2 className={styles.editorTitle}>Editor Scripty</h2>
        <p className={styles.editorSubtitle}>Metrifique o seu texto da melhor forma.</p>

        {/* Use the MetricsToolbar molecule */}
        <MetricsToolbar metrics={basicMetrics} />

        {/* Text Area */}
        <textarea
          className={styles.editorArea}
          placeholder="Comece a escrever seu texto aqui..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      {/* Advanced Metrics Panel (Right) - Now using Grid */}
      <div className={styles.advancedMetricsPanel}>
        <h3 className={styles.advancedPanelTitle}>Métricas Avançadas</h3>
        <p className={styles.advancedSubtitle}>Análise a legibilidade do seu texto de forma mais profunda</p>

        <div className={styles.advancedGridContainer}>
          {/* Item 1: Readability Indices Carousel */}
          <div className={`${styles.advancedGridItem} ${styles.readabilityCarouselContainer}`}>
            <h4>Índices de Legibilidade</h4>
            <Swiper
              modules={[Pagination, Mousewheel]}
              spaceBetween={10}
              slidesPerView={1}
              pagination={{ clickable: true, dynamicBullets: true }}
              mousewheel={true}
              className={styles.readabilitySwiper}
            >
              {readabilityIndicesDisplayOrder.map(({ key, label }) => {
                const result: ReadabilityIndexResult | undefined = advancedMetrics.readability?.[key]; // Optional chaining
                return (
                  <SwiperSlide key={key} className={styles.readabilitySlide}>
                    <div className={styles.readabilityCard}>
                      <span className={styles.readabilityName}>{label}</span>
                      <span className={`${styles.readabilityValue} ${getLevelClass(result?.level ?? '')}`}>
                        {result?.score?.toFixed(1) ?? 'N/A'}
                      </span>
                      <span className={styles.readabilityLevel}>{result?.level ?? ''}</span>
                      <span className={styles.readabilityFeedback}>{result?.feedback ?? ''}</span>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>

          {/* Item 2: Text Length Card */}
          <div className={`${styles.advancedGridItem} ${styles.advancedCard}`}>
            <span className={styles.advancedCardTitle}>Comprimento do Texto</span>
            <div className={styles.advancedCardContent}>
              {advancedMetrics.feedbackComprimento ? (
                  <p className={styles.metricFeedback}>{advancedMetrics.feedbackComprimento}</p>
              ) : (
                  <p className={styles.metricFeedback}>Digite algo para ver o feedback.</p>
              )}
            </div>
          </div>

          {/* Item 3: Redundancy Card */}
          <div className={`${styles.advancedGridItem} ${styles.advancedCard}`}>
            <span className={styles.advancedCardTitle}>Redundância</span>
            <div className={styles.advancedCardContent}>
              <p>Índice: {advancedMetrics.redundancy?.index?.toFixed(1) ?? 'N/A'}%</p> {/* Optional chaining */}
              {advancedMetrics.redundancy?.feedback && <p className={`${styles.metricFeedback} ${getLevelClass(advancedMetrics.redundancy.level)}`}>{advancedMetrics.redundancy.feedback}</p>}
            </div>
          </div>

          {/* Item 4: Sentiment Analysis Card */}
          <div className={`${styles.advancedGridItem} ${styles.advancedCard}`}>
            <span className={styles.advancedCardTitle}>Análise de Sentimento</span>
            <div className={styles.advancedCardContent}>
              {/* Add check for sentiment object */}
              {advancedMetrics.sentiment ? (
                <p>{formatSentiment(advancedMetrics.sentiment)}</p>
              ) : (
                <p>N/A</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorWithMetrics;

