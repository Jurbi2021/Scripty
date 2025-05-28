import React, { useState, useEffect } from 'react';
import styles from './EditorWithStyle.module.scss'; // Use specific styles
import basicStyles from './EditorWithMetrics.module.scss'; // Reuse basic metrics styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';

// Import metric functions and types
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

// Reuse basic metric display order
const basicMetricDisplayOrder: { key: keyof BasicMetricsData; label: string }[] = [
  { key: 'words', label: 'Palavras' },
  { key: 'charsWithSpaces', label: 'Caracteres' },
  { key: 'sentences', label: 'Sentenças' },
  { key: 'paragraphs', label: 'Parágrafos' },
  { key: 'readingTime', label: 'Tempo Leitura' },
  { key: 'uniqueWords', label: 'Palavras Únicas' },
  { key: 'avgWordsPerSentence', label: 'Média Palavras/Sentença' },
  { key: 'avgCharsPerWord', label: 'Média Caracteres/Palavra' },
  { key: 'charsNoSpaces', label: 'Caracteres (s/ espaço)' },
];

const EditorWithStyle: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [basicMetrics, setBasicMetrics] = useState<BasicMetricsData>(calculateBasicMetrics(''));
  const [styleAnalysis, setStyleAnalysis] = useState<StyleAnalysisData>(getEmptyStyleAnalysis());

  // Calculate metrics and style analysis when text changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setBasicMetrics(calculateBasicMetrics(text));
      setStyleAnalysis(performStyleAnalysis(text));
    }, 300); // Slightly longer delay for potentially heavier analysis

    return () => {
      clearTimeout(handler);
    };
  }, [text]);

  // Helper to get CSS class based on level
  const getLevelClass = (level: string): string => {
    switch (level.toLowerCase()) {
      case 'excelente': return styles.levelExcelente;
      case 'bom': return styles.levelBom;
      case 'regular': return styles.levelRegular; // Added for potential use
      case 'ruim': return styles.levelRuim;
      default: return '';
    }
  };

  // Function to render sentences with highlighting (optional)
  const renderSentences = (sentences: SentenceInfo[] | ComplexSentenceInfo[]) => {
    if (sentences.length === 0) return <p>Nenhuma frase para destacar.</p>;
    return (
      <ul className={styles.sentenceList}>
        {sentences.slice(0, 5).map((info) => ( // Limit displayed sentences
          <li key={info.index}>
            <span>{info.index}:</span> {info.sentence}
          </li>
        ))}
        {sentences.length > 5 && <li>... e mais {sentences.length - 5}.</li>}
      </ul>
    );
  };

  return (
    <div className={basicStyles.editorLayout}> {/* Reuse overall layout */}
      {/* Main Editor Area (Left/Center) - Reused */}
      <div className={basicStyles.mainContentArea}>
        <h2 className={basicStyles.editorTitle}>Editor Scripty</h2>
        <p className={basicStyles.editorSubtitle}>Descubra mais sobre a forma que você escreve!</p>

        {/* Basic Metrics Toolbar - Reused */}
        <div className={basicStyles.toolbar}>
          <Swiper
            modules={[FreeMode, Mousewheel]}
            slidesPerView={'auto'}
            spaceBetween={12}
            freeMode={true}
            mousewheel={true}
            className={basicStyles.metricsSwiper}
          >
            {basicMetricDisplayOrder.map(({ key, label }) => (
              <SwiperSlide key={key} className={basicStyles.metricSlide}>
                <div className={basicStyles.metricCard}>
                  <span className={basicStyles.metricName}>{label}</span>
                  <span className={basicStyles.metricValue}>{basicMetrics[key]}</span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Text Area - Reused */}
        <textarea
          className={basicStyles.editorArea}
          placeholder="Cole seu texto aqui para analisar o estilo..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      {/* Style Analysis Panel (Right) */}
      <div className={styles.styleAnalysisPanel}>
        <h3 className={styles.panelTitle}>Análise de Estilo</h3>
        <p className={styles.panelSubtitle}>Todo o feedback de análise de estilo</p>

        <div className={styles.feedbackContainer}>
          {/* Passive Voice Feedback */}
          <div className={`${styles.feedbackCard} ${getLevelClass(styleAnalysis.passiveVoice.level)}`}>
            <h4 className={styles.feedbackTitle}>Voz Passiva</h4>
            <p className={styles.feedbackText}>{styleAnalysis.passiveVoice.feedback}</p>
            {styleAnalysis.passiveVoice.count > 0 && (
              <details className={styles.details}>
                <summary>Ver frases ({styleAnalysis.passiveVoice.count})</summary>
                {renderSentences(styleAnalysis.passiveVoice.sentences)}
              </details>
            )}
          </div>

          {/* Adverbs Feedback */}
          <div className={`${styles.feedbackCard} ${getLevelClass(styleAnalysis.adverbs.level)}`}>
            <h4 className={styles.feedbackTitle}>Advérbios</h4>
            <p className={styles.feedbackText}>{styleAnalysis.adverbs.feedback}</p>
            {styleAnalysis.adverbs.count > 0 && (
              <details className={styles.details}>
                <summary>Ver advérbios ({styleAnalysis.adverbs.count})</summary>
                <p className={styles.wordList}>{styleAnalysis.adverbs.adverbs.slice(0, 15).join(', ')}{styleAnalysis.adverbs.adverbs.length > 15 ? '...' : ''}</p>
              </details>
            )}
          </div>

          {/* Complex Sentences Feedback */}
          <div className={`${styles.feedbackCard} ${getLevelClass(styleAnalysis.complexSentences.level)}`}>
            <h4 className={styles.feedbackTitle}>Frases Complexas</h4>
            <p className={styles.feedbackText}>{styleAnalysis.complexSentences.feedback}</p>
            {styleAnalysis.complexSentences.count > 0 && (
              <details className={styles.details}>
                <summary>Ver frases ({styleAnalysis.complexSentences.count})</summary>
                {renderSentences(styleAnalysis.complexSentences.sentences)}
              </details>
            )}
          </div>

          {/* Discourse Connectors Feedback - Added */}
          <div className={`${styles.feedbackCard} ${getLevelClass(styleAnalysis.discourseConnectors.level)}`}>
            <h4 className={styles.feedbackTitle}>Conectores Discursivos</h4>
            <p className={styles.feedbackText}>{styleAnalysis.discourseConnectors.feedback}</p>
            {styleAnalysis.discourseConnectors.count > 0 && (
              <details className={styles.details}>
                <summary>Ver conectores ({styleAnalysis.discourseConnectors.count})</summary>
                <p className={styles.wordList}>{styleAnalysis.discourseConnectors.connectors.slice(0, 15).join(', ')}{styleAnalysis.discourseConnectors.connectors.length > 15 ? '...' : ''}</p>
              </details>
            )}
          </div>

          {/* Lexical Diversity Feedback - Added */}
          <div className={`${styles.feedbackCard} ${getLevelClass(styleAnalysis.lexicalDiversity.level)}`}>
            <h4 className={styles.feedbackTitle}>Diversidade Léxica</h4>
            <p className={styles.feedbackText}>{styleAnalysis.lexicalDiversity.feedback}</p>
            {/* No details needed for Shannon Index, just the feedback */}
          </div>

        </div>
      </div>
    </div>
  );
};

export default EditorWithStyle;

