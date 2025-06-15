// src/components/organisms/AccessibilityAnalysis.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditor } from '../../contexts/EditorContext';
import { calculateAccessibilityMetrics, AccessibilityAnalysisResult } from '../../utils/AccessibilityAnalysis';
import MetricsToolbar from '../molecules/MetricsToolbar';
import TextArea from '../atoms/TextArea';
import styles from './AccessibilityAnalysis.module.scss';
import editorLayoutStyles from './EditorWithMetrics.module.scss';

// Componente para o score geral de acessibilidade
const AccessibilityOverallScore: React.FC<{ result: AccessibilityAnalysisResult }> = ({ result }) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return '#58d6a3'; // Verde
    if (score >= 70) return '#f59e0b'; // Amarelo
    if (score >= 50) return '#f97316'; // Laranja
    return '#ef4444'; // Vermelho
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (result.overallScore / 100) * circumference;

  return (
    <motion.div 
      className={`${editorLayoutStyles.advancedGridItem} ${styles.overallScore}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.scoreCircle}>
        <svg width="80" height="80" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="var(--border-color-dark)"
            strokeWidth="8"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={getScoreColor(result.overallScore)}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 50 50)"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className={styles.scoreText}>
          <span className={styles.scoreNumber}>{result.overallScore}</span>
          <span className={styles.scoreLabel}>Acessibilidade</span>
        </div>
      </div>
      <div className={styles.scoreInfo}>
        <h3>Score Geral</h3>
        <p className={styles.scoreLevel} data-level={result.overallLevel.toLowerCase()}>
          {result.overallLevel}
        </p>
        <p className={styles.scoreFeedback}>{result.generalFeedback}</p>
      </div>
    </motion.div>
  );
};

// Componente para cada categoria de acessibilidade
const AccessibilityCategory: React.FC<{
  title: string;
  icon: string;
  result: any;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ title, icon, result, isExpanded, onToggle }) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Excelente': return '#58d6a3';
      case 'Bom': return '#f59e0b';
      case 'Regular': return '#f97316';
      case 'Ruim': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <motion.div 
      className={`${editorLayoutStyles.advancedGridItem} ${styles.categoryCard} ${isExpanded ? styles.expanded : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.categoryHeader} onClick={onToggle}>
        <div className={styles.categoryIcon}>
          <span>{icon}</span>
        </div>
        <div className={styles.categoryInfo}>
          <h4>{title}</h4>
          <div className={styles.categoryScore}>
            <span className={styles.scoreValue}>{result.score}/100</span>
            <span 
              className={styles.levelBadge}
              style={{ backgroundColor: getLevelColor(result.level) }}
            >
              {result.level}
            </span>
          </div>
        </div>
        <div className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ''}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4.427 9.573L8 6l3.573 3.573a.5.5 0 0 0 .708-.708L8.354 5.146a.5.5 0 0 0-.708 0L3.72 8.865a.5.5 0 1 0 .708.708z"/>
          </svg>
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className={styles.categoryDetails}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className={styles.categoryFeedback}>{result.feedback}</p>
            
            <div className={styles.issuesGrid}>
              {Object.entries(result.issues).map(([key, value]) => (
                <div key={key} className={styles.issueItem}>
                  <span className={styles.issueLabel}>
                    {key === 'longSentences' && 'Frases Longas'}
                    {key === 'complexWords' && 'Palavras Complexas'}
                    {key === 'inconsistentTerminology' && 'Terminologia Inconsistente'}
                    {key === 'unclearReferences' && 'Referências Pouco Claras'}
                    {key === 'longParagraphs' && 'Parágrafos Longos'}
                    {key === 'missingStructure' && 'Estrutura Ausente'}
                    {key === 'poorTextFlow' && 'Fluxo Ruim'}
                    {key === 'lackOfBreaks' && 'Falta de Quebras'}
                    {key === 'technicalTerms' && 'Termos Técnicos'}
                    {key === 'idiomaticExpressions' && 'Expressões Idiomáticas'}
                    {key === 'regionalisms' && 'Regionalismos'}
                    {key === 'complexVocabulary' && 'Vocabulário Complexo'}
                  </span>
                  <span className={styles.issueValue}>
                    {typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Componente para sugestões prioritárias
const PrioritySuggestions: React.FC<{ suggestions: string[] }> = ({ suggestions }) => {
  if (suggestions.length === 0) return null;

  return (
    <motion.div 
      className={`${editorLayoutStyles.advancedGridItem} ${styles.prioritySuggestions}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <span className={editorLayoutStyles.advancedCardTitle}>🎯 Sugestões Prioritárias</span>
      <div className={styles.suggestionsList}>
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={index}
            className={styles.suggestionItem}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
          >
            <span className={styles.suggestionNumber}>{index + 1}</span>
            <span className={styles.suggestionText}>{suggestion}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Componente principal da análise de acessibilidade
const AccessibilityAnalysis: React.FC = () => {
  const { text, setText, basicMetrics, isFocusMode } = useEditor();
  const [accessibilityData, setAccessibilityData] = useState<AccessibilityAnalysisResult | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({
    cognitive: false,
    visual: false,
    linguistic: false
  });

  useEffect(() => {
    if (text) {
      const result = calculateAccessibilityMetrics(text);
      setAccessibilityData(result);
    } else {
      setAccessibilityData(null);
    }
  }, [text]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const hasContent = text && text.trim().length > 0;

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
          Analise a acessibilidade do seu texto para diferentes necessidades.
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

      {!isFocusMode && (
        <motion.div
          className={editorLayoutStyles.advancedMetricsPanel}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        >
          <h3 className={editorLayoutStyles.advancedPanelTitle}>Análise de Acessibilidade</h3>
          <p className={editorLayoutStyles.advancedSubtitle}>Verifique se seu texto é acessível para todos os públicos.</p>

          <AnimatePresence mode="wait">
            {!hasContent ? (
              <motion.div 
                className={styles.emptyState}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.emptyIcon}>♿</div>
                <h4>Análise de Acessibilidade</h4>
                <p>Digite algum texto no editor para analisar sua acessibilidade</p>
              </motion.div>
            ) : accessibilityData ? (
              <motion.div
                className={styles.accessibilityContainer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AccessibilityOverallScore result={accessibilityData} />
                
                <div className={styles.categoriesContainer}>
                  <AccessibilityCategory
                    title="Acessibilidade Cognitiva"
                    icon="🧠"
                    result={accessibilityData.cognitive}
                    isExpanded={expandedCategories.cognitive}
                    onToggle={() => toggleCategory('cognitive')}
                  />
                  
                  <AccessibilityCategory
                    title="Acessibilidade Visual"
                    icon="👁️"
                    result={accessibilityData.visual}
                    isExpanded={expandedCategories.visual}
                    onToggle={() => toggleCategory('visual')}
                  />
                  
                  <AccessibilityCategory
                    title="Acessibilidade Linguística"
                    icon="🗣️"
                    result={accessibilityData.linguistic}
                    isExpanded={expandedCategories.linguistic}
                    onToggle={() => toggleCategory('linguistic')}
                  />
                </div>
                
                <PrioritySuggestions suggestions={accessibilityData.prioritySuggestions} />
              </motion.div>
            ) : (
              <motion.div 
                className={styles.loading}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.loadingSpinner}></div>
                <p>Analisando acessibilidade...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default AccessibilityAnalysis;