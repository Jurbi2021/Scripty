// src/components/organisms/EditorWithMetrics.tsx
import React, { useState, useEffect } from 'react';
import styles from './EditorWithMetrics.module.scss'; //
import { Swiper, SwiperSlide } from 'swiper/react'; //
import { FreeMode, Mousewheel, Pagination, Navigation } from 'swiper/modules'; // Adicionado Pagination e Navigation
import { motion, AnimatePresence } from 'framer-motion'; // Adicionado Framer Motion
import { FaLightbulb } from 'react-icons/fa' 

// Importar seu novo átomo TextArea
import TextArea from '../atoms/TextArea'; // Assumindo que está em ../atoms/TextArea.tsx
// Importar a molécula EditorToolbar (que agora é o carrossel de métricas básicas)
import MetricsToolbar from '../molecules/MetricsToolbar';


import 'swiper/css'; //
import 'swiper/css/free-mode'; //
import 'swiper/css/pagination'; //
import 'swiper/css/navigation'; // Adicionado

import {
  calculateBasicMetrics,
  BasicMetricsData,
} from '../../utils/BasicMetrics'; //
import {
  calculateAdvancedMetrics,
  AdvancedMetricsData,
  ReadabilityIndices,
  ReadabilityIndexResult,
  RedundancyResult,
  getEmptyAdvancedMetrics,
  SentimentScore
} from '../../utils/AdvancedMetrics'; //
import lexicoData from '../../utils/lexico.json'; //

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
const lexico: Lexico = lexicoData as Lexico; //

const basicMetricDisplayOrder: { key: keyof BasicMetricsData; label: string }[] = [ //
  { key: 'words', label: 'Palavras' },
  { key: 'charsWithSpaces', label: 'Caracteres' },
  // ... resto das métricas básicas
  { key: 'readingTime', label: 'Tempo Leitura' },
  { key: 'sentences', label: 'Sentenças' },
  { key: 'paragraphs', label: 'Parágrafos' },
  { key: 'uniqueWords', label: 'Palavras Únicas' },
  { key: 'avgWordsPerSentence', label: 'Média Palavras/Sentença' },
  { key: 'avgCharsPerWord', label: 'Média Caracteres/Palavra' },
  { key: 'charsNoSpaces', label: 'Caracteres (s/ espaço)' },
];

const readabilityIndicesDisplayOrder: { key: keyof ReadabilityIndices; label: string }[] = [ //
    { key: 'jurbiX', label: 'JurbiX' },
    // ... resto dos índices
    { key: 'fleschKincaidReadingEase', label: 'Flesch-Kincaid' },
    { key: 'gunningFog', label: 'Gunning Fog' },
    { key: 'smogIndex', label: 'SMOG' },
    { key: 'colemanLiauIndex', label: 'Coleman-Liau' },
];

const EditorWithMetrics: React.FC = () => {
  const [text, setText] = useState<string>(''); //
  const [basicMetrics, setBasicMetrics] = useState<BasicMetricsData>(calculateBasicMetrics('')); //
  const [advancedMetrics, setAdvancedMetrics] = useState<AdvancedMetricsData>(getEmptyAdvancedMetrics()); //

  useEffect(() => {
    const handler = setTimeout(() => {
      setBasicMetrics(calculateBasicMetrics(text)); //
      setAdvancedMetrics(calculateAdvancedMetrics(text, lexico)); //
    }, 300); // Aumentar um pouco o debounce para análises mais pesadas
    return () => clearTimeout(handler);
  }, [text]);

  const formatSentiment = (sentiment: SentimentScore) => { //
    const score = sentiment.compound;
    let emoji = '😐';
    if (sentiment.sentiment === 'positivo') emoji = '😊';
    else if (sentiment.sentiment === 'negativo') emoji = '😟';
    return `${emoji} ${sentiment.sentiment.charAt(0).toUpperCase() + sentiment.sentiment.slice(1)} (${score.toFixed(2)})`;
  };

  const getLevelClass = (level: string): string => { //
    switch (level?.toLowerCase()) { // Adicionar optional chaining para level
      case 'muito fácil': return styles.levelMuitoFacil;
      case 'fácil': return styles.levelFacil;
      case 'médio': return styles.levelMedio;
      case 'difícil': return styles.levelDificil;
      case 'excelente': return styles.levelExcelente;
      case 'bom': return styles.levelBom;
      case 'regular': return styles.levelRegular;
      case 'ruim': return styles.levelRuim;
      default: return styles.levelNA || ''; // Classe para N/A
    }
  };

  // Mapear BasicMetricsData para o formato esperado pelo EditorToolbar
  const toolbarMetrics = basicMetricDisplayOrder.map(metric => ({
    label: metric.label,
    value: basicMetrics[metric.key]
  }));

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


  return (
    <div className={styles.editorLayout}>
      <div className={styles.mainContentArea}>
        <motion.h2
            className={styles.editorTitle}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            Editor Scripty
        </motion.h2>
        <motion.p
            className={styles.editorSubtitle}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        >
            Metrifique o seu texto da melhor forma.
        </motion.p>

        <div className={styles.toolbarWrapper}> {/* Novo wrapper para o toolbar */}
          <MetricsToolbar metrics={basicMetrics} />
        </div>

        <TextArea
          className={styles.editorAreaAdapter} // Usar uma classe adaptadora se o átomo não tiver todos os estilos de .editorArea
          placeholder="Comece a escrever seu texto aqui..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={15} // Ajustar conforme necessário
        />
      </div>

      <motion.div
        className={styles.advancedMetricsPanel}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
      >
        <h3 className={styles.advancedPanelTitle}>Métricas Avançadas</h3>
        <p className={styles.advancedSubtitle}>Analise a legibilidade do seu texto de forma mais profunda.</p>

        <AnimatePresence>
          {text.length > 0 ? ( // Só mostra o grid se houver texto
            <motion.div
              className={styles.advancedGridContainer}
              initial="hidden" // Não animar o container em si, mas os filhos
              animate="visible" // Não animar o container em si, mas os filhos
            >
              <motion.div
                className={`${styles.advancedGridItem} ${styles.readabilityCarouselContainer}`}
                custom={0} variants={cardVariants} initial="hidden" animate="visible"
              >
                <h4>Índices de Legibilidade</h4>
                <Swiper
                  modules={[Pagination, Mousewheel, Navigation]} // Adicionado Navigation
                  spaceBetween={10} //
                  slidesPerView={1} //
                  pagination={{ clickable: true, dynamicBullets: true, el: `.${styles.customPagination}` }} //
                  mousewheel={true} //
                  navigation // Habilitar navegação padrão do Swiper
                  className={styles.readabilitySwiper} //
                >
                  {readabilityIndicesDisplayOrder.map(({ key, label }) => {
                    const result = advancedMetrics.readability[key];
                    return (
                      <SwiperSlide key={key} className={styles.readabilitySlide}>
                        <div className={styles.readabilityCard}>
                          <span className={styles.readabilityName}>{label}</span>
                          <span className={`${styles.readabilityValue} ${getLevelClass(result?.level ?? 'N/A')}`}>
                            {result?.score?.toFixed(1) ?? 'N/A'}
                          </span>
                          <span className={`${styles.readabilityLevel} ${getLevelClass(result?.level ?? 'N/A')}`}>{result?.level ?? 'Indisponível'}</span>
                          <span className={styles.readabilityFeedback}>{result?.feedback || 'Sem dados para este índice.'}</span>
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
                <div className={styles.customPagination}></div> {/* Container para paginação customizada */}
              </motion.div>

              <motion.div className={`${styles.advancedGridItem} ${styles.advancedCard}`} custom={1} variants={cardVariants} initial="hidden" animate="visible">
                <span className={styles.advancedCardTitle}>Comprimento do Texto</span>
                <div className={styles.advancedCardContent}>
                  <p className={`${styles.metricFeedback} ${getLevelClass(advancedMetrics.textLengthWords < 300 ? 'ruim' : advancedMetrics.textLengthWords <= 2000 ? 'bom' : 'ruim')}`}>
                    {advancedMetrics.feedbackComprimento || 'Digite para feedback.'}
                  </p>
                </div>
              </motion.div>

              <motion.div className={`${styles.advancedGridItem} ${styles.advancedCard}`} custom={2} variants={cardVariants} initial="hidden" animate="visible">
                <span className={styles.advancedCardTitle}>Redundância</span>
                <div className={styles.advancedCardContent}>
                  <p>Índice: <span className={styles.metricHighlight}>{advancedMetrics.redundancy.index.toFixed(1)}%</span></p>
                  <p className={`${styles.metricFeedback} ${getLevelClass(advancedMetrics.redundancy.level)}`}>
                    {advancedMetrics.redundancy.feedback || 'Digite para feedback.'}
                  </p>
                </div>
              </motion.div>

              <motion.div className={`${styles.advancedGridItem} ${styles.advancedCard}`} custom={3} variants={cardVariants} initial="hidden" animate="visible">
                <span className={styles.advancedCardTitle}>Análise de Sentimento</span>
                <div className={styles.advancedCardContent}>
                  <p className={styles.metricHighlightLarge}>{formatSentiment(advancedMetrics.sentiment)}</p>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <div className={styles.emptyStateAdvancedMetrics}>
                <FaLightbulb />
                <p>Suas métricas avançadas aparecerão aqui assim que você começar a digitar.</p>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default EditorWithMetrics;

// Aplicar estrutura similar de animação e condicional para EditorWithStyle.tsx e EditorWithSEO.tsx