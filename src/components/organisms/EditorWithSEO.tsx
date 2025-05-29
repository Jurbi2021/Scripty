import React, { useState, useEffect } from 'react';
import styles from './EditorWithSEO.module.scss';
import basicStyles from './EditorWithMetrics.module.scss'; // Reuse basic metrics styles
import MetricsToolbar from '../molecules/MetricsToolbar'; // Import the new molecule

// Import metric functions and types
import {
  calculateBasicMetrics,
  BasicMetricsData,
} from '../../utils/BasicMetrics';
import {
  analyzeSeo,
  SeoAnalysisResult
} from '../../utils/SeoAnalysis';

const EditorWithSEO: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [basicMetrics, setBasicMetrics] = useState<BasicMetricsData>(calculateBasicMetrics(''));
  const [seoAnalysis, setSeoAnalysis] = useState<SeoAnalysisResult | null>(null);

  // Calculate metrics and SEO analysis when text changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setBasicMetrics(calculateBasicMetrics(text));
      setSeoAnalysis(analyzeSeo(text));
    }, 300); // Slightly longer delay for potentially heavier analysis

    return () => {
      clearTimeout(handler);
    };
  }, [text]);

  // Helper to get CSS class based on status
  const getStatusClass = (status: string | undefined): string => { // Added undefined type
    switch (status?.toLowerCase()) { // Added optional chaining for safety
      case 'bom': return styles.statusBom;
      case 'ideal': return styles.statusBom;
      case 'adequado': return styles.statusBom;
      case 'precisa de ajustes': return styles.statusRegular;
      case 'baixa': return styles.statusRuim;
      case 'alta': return styles.statusRuim;
      case 'muito curto': return styles.statusRuim;
      case 'muito longo': return styles.statusRuim;
      default: return '';
    }
  };

  return (
    <div className={basicStyles.editorLayout}>
      {/* Main Editor Area (Left/Center) - Reused */}
      <div className={basicStyles.mainContentArea}>
        <h2 className={basicStyles.editorTitle}>Editor Scripty</h2>
        <p className={basicStyles.editorSubtitle}>Otimize seu texto para SEO da forma!</p>

        {/* Use the MetricsToolbar molecule */}
        <MetricsToolbar metrics={basicMetrics} />

        {/* Text Area - Reused */}
        <textarea
          className={basicStyles.editorArea}
          placeholder="Cole seu texto aqui para analisar o SEO..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      {/* SEO Analysis Panel (Right) - Apply the same structure as Style Panel */}
      <div className={styles.seoAnalysisPanel}> {/* This is the main panel container */}
        <h3 className={styles.panelTitle}>Análise de SEO</h3>
        <p className={styles.panelSubtitle}>Otimize seu texto para SEO da forma!</p>

        {/* This container holds the cards, mirroring the Style panel structure */}
        <div className={styles.feedbackContainer}>
          {seoAnalysis ? (
            <>
              {/* Keyword Density Feedback */}
              <div className={`${styles.feedbackCard} ${getStatusClass(seoAnalysis.keywordDensity < 1 ? 'baixa' : seoAnalysis.keywordDensity > 2 ? 'alta' : 'ideal')}`}>
                <h4 className={styles.feedbackTitle}>Palavra-Chave Principal</h4>
                <p className={styles.feedbackText}>{seoAnalysis.feedbackKeyword ?? 'Calculando...'}</p>
                {seoAnalysis.mainKeyword && (
                  <div className={styles.keywordInfo}>
                    <span className={styles.keywordLabel}>Palavra-chave:</span>
                    <span className={styles.keywordValue}>{seoAnalysis.mainKeyword}</span>
                  </div>
                )}
              </div>

              {/* LSI Density Feedback */}
              <div className={`${styles.feedbackCard} ${getStatusClass(seoAnalysis.lsiResult?.density < 1 ? 'baixa' : seoAnalysis.lsiResult?.density > 2 ? 'alta' : 'ideal')}`}>
                <h4 className={styles.feedbackTitle}>Densidade LSI</h4>
                <p className={styles.feedbackText}>{seoAnalysis.lsiResult?.feedback ?? 'Calculando...'}</p>
                {(seoAnalysis.lsiResult?.synonymsUsed?.length ?? 0) > 0 && (
                  <details className={styles.details}>
                    <summary>Sinônimos usados ({seoAnalysis.lsiResult.synonymsUsed.length})</summary>
                    <p className={styles.wordList}>{seoAnalysis.lsiResult.synonymsUsed.join(', ')}</p>
                  </details>
                )}
                {(seoAnalysis.lsiResult?.suggestions?.length ?? 0) > 0 && (
                  <details className={styles.details}>
                    <summary>Sugestões ({seoAnalysis.lsiResult.suggestions.length})</summary>
                    <p className={styles.wordList}>{seoAnalysis.lsiResult.suggestions.join(', ')}</p>
                  </details>
                )}
              </div>

              {/* Readability Feedback */}
              <div className={`${styles.feedbackCard} ${getStatusClass(seoAnalysis.seoReadability)}`}>
                <h4 className={styles.feedbackTitle}>Legibilidade para SEO</h4>
                <p className={styles.feedbackText}>{seoAnalysis.feedbackReadability ?? 'Calculando...'}</p>
              </div>

              {/* Text Length Feedback */}
              <div className={`${styles.feedbackCard} ${getStatusClass(seoAnalysis.seoTextLength)}`}>
                <h4 className={styles.feedbackTitle}>Comprimento do Texto</h4>
                <p className={styles.feedbackText}>{seoAnalysis.feedbackLength ?? 'Calculando...'}</p>
              </div>

              {/* Text Structure Feedback (Updated) */}
              <div className={`${styles.feedbackCard} ${getStatusClass(seoAnalysis.headingResult?.hasStructure ? 'bom' : 'precisa de ajustes')}`}>
                <h4 className={styles.feedbackTitle}>Estrutura Textual</h4>
                <p className={styles.feedbackText}>{seoAnalysis.feedbackHeadings ?? 'Calculando...'}</p>
                {(seoAnalysis.headingResult?.potentialHeadings?.length ?? 0) > 0 && (
                  <details className={styles.details}>
                    <summary>Títulos potenciais detectados ({seoAnalysis.headingResult.potentialHeadings.length})</summary>
                    <ul className={styles.headingsList}>
                      {seoAnalysis.headingResult.potentialHeadings.map((heading, index) => (
                        <li key={index}>{heading}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <p>Digite seu texto para receber análise de SEO</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorWithSEO;

