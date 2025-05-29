import React, { useState, useEffect } from 'react';
import styles from './EditorWithStyle.module.scss'; // Use specific styles
import basicStyles from './EditorWithMetrics.module.scss'; // Reuse basic metrics styles
import MetricsToolbar from '../molecules/MetricsToolbar'; // Import the new molecule

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
    switch (level?.toLowerCase()) { // Added optional chaining
      case 'excelente': return styles.levelExcelente;
      case 'bom': return styles.levelBom;
      case 'regular': return styles.levelRegular;
      case 'ruim': return styles.levelRuim;
      default: return '';
    }
  };

  // Function to render sentences with highlighting (optional)
  const renderSentences = (sentences: SentenceInfo[] | ComplexSentenceInfo[]) => {
    if (!sentences || sentences.length === 0) return <p>Nenhuma frase para destacar.</p>; // Added check for undefined
    return (
      <ul className={styles.sentenceList}>
        {sentences.slice(0, 5).map((info) => (
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

        {/* Use the MetricsToolbar molecule */}
        <MetricsToolbar metrics={basicMetrics} />

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
          <div className={`${styles.feedbackCard} ${getLevelClass(styleAnalysis.passiveVoice?.level)}`}> {/* Optional chaining */}
            <h4 className={styles.feedbackTitle}>Voz Passiva</h4>
            <p className={styles.feedbackText}>{styleAnalysis.passiveVoice?.feedback ?? 'Calculando...'}</p> {/* Optional chaining */}
            {(styleAnalysis.passiveVoice?.count ?? 0) > 0 && (
              <details className={styles.details}>
                <summary>Ver frases ({styleAnalysis.passiveVoice.count})</summary>
                {renderSentences(styleAnalysis.passiveVoice.sentences)}
              </details>
            )}
          </div>

          {/* Adverbs Feedback */}
          <div className={`${styles.feedbackCard} ${getLevelClass(styleAnalysis.adverbs?.level)}`}> {/* Optional chaining */}
            <h4 className={styles.feedbackTitle}>Advérbios</h4>
            <p className={styles.feedbackText}>{styleAnalysis.adverbs?.feedback ?? 'Calculando...'}</p> {/* Optional chaining */}
            {(styleAnalysis.adverbs?.count ?? 0) > 0 && (
              <details className={styles.details}>
                <summary>Ver advérbios ({styleAnalysis.adverbs.count})</summary>
                <p className={styles.wordList}>{styleAnalysis.adverbs.adverbs.slice(0, 15).join(', ')}{styleAnalysis.adverbs.adverbs.length > 15 ? '...' : ''}</p>
              </details>
            )}
          </div>

          {/* Complex Sentences Feedback */}
          <div className={`${styles.feedbackCard} ${getLevelClass(styleAnalysis.complexSentences?.level)}`}> {/* Optional chaining */}
            <h4 className={styles.feedbackTitle}>Frases Complexas</h4>
            <p className={styles.feedbackText}>{styleAnalysis.complexSentences?.feedback ?? 'Calculando...'}</p> {/* Optional chaining */}
            {(styleAnalysis.complexSentences?.count ?? 0) > 0 && (
              <details className={styles.details}>
                <summary>Ver frases ({styleAnalysis.complexSentences.count})</summary>
                {renderSentences(styleAnalysis.complexSentences.sentences)}
              </details>
            )}
          </div>

          {/* Discourse Connectors Feedback */}
          <div className={`${styles.feedbackCard} ${getLevelClass(styleAnalysis.discourseConnectors?.level)}`}> {/* Optional chaining */}
            <h4 className={styles.feedbackTitle}>Conectores Discursivos</h4>
            <p className={styles.feedbackText}>{styleAnalysis.discourseConnectors?.feedback ?? 'Calculando...'}</p> {/* Optional chaining */}
            {(styleAnalysis.discourseConnectors?.count ?? 0) > 0 && (
              <details className={styles.details}>
                <summary>Ver conectores ({styleAnalysis.discourseConnectors.count})</summary>
                <p className={styles.wordList}>{styleAnalysis.discourseConnectors.connectors.slice(0, 15).join(', ')}{styleAnalysis.discourseConnectors.connectors.length > 15 ? '...' : ''}</p>
              </details>
            )}
          </div>

          {/* Lexical Diversity Feedback */}
          <div className={`${styles.feedbackCard} ${getLevelClass(styleAnalysis.lexicalDiversity?.level)}`}> {/* Optional chaining */}
            <h4 className={styles.feedbackTitle}>Diversidade Léxica</h4>
            <p className={styles.feedbackText}>{styleAnalysis.lexicalDiversity?.feedback ?? 'Calculando...'}</p> {/* Optional chaining */}
          </div>

        </div>
      </div>
    </div>
  );
};

export default EditorWithStyle;

