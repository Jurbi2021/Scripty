// src/components/organisms/EditorWithSEO.tsx
import React, { useState, useEffect } from 'react';
import styles from './EditorWithSEO.module.scss';
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
  analyzeSeo,
  SeoAnalysisResult // Corrigido: não precisa ser um default import se for named export
} from '../../utils/SeoAnalysis'; // Corrigido: sem chaves se SeoAnalysisResult for default export

import { useEditor } from '../../contexts/EditorContext';
import { SeoMetricKey } from '../../utils/preferences';

const EditorWithSEO: React.FC = () => {
  const [basicMetrics, setBasicMetrics] = useState<BasicMetricsData>(calculateBasicMetrics(''));
  const { 
  preferences, 
  isFocusMode,
  text,                 // <<< ADICIONE para ler do contexto
  setText,              // <<< ADICIONE para atualizar o contexto
  seoAnalysis,           
  setSeoAnalysisData     
} = useEditor();

useEffect(() => {
  const handler = setTimeout(() => {
    setBasicMetrics(calculateBasicMetrics(text)); // 'text' agora é o global do contexto
    const newSeoAnalysis = analyzeSeo(text);    // 'text' agora é o global
    setSeoAnalysisData(newSeoAnalysis);
  }, 300);
  return () => clearTimeout(handler);
}, [text, setSeoAnalysisData]); 

  const getStatusClass = (status: string | undefined): string => {
    if (!status) return styles.statusNA || '';
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('bom') || lowerStatus.includes('ideal') || lowerStatus.includes('adequado')) return styles.statusBom;
    if (lowerStatus.includes('precisa de ajustes') || lowerStatus.includes('regular')) return styles.statusRegular;
    if (lowerStatus.includes('baixa') || lowerStatus.includes('alta') || lowerStatus.includes('muito curto') || lowerStatus.includes('muito longo')) return styles.statusRuim;
    return styles.statusNA || '';
  };
  
  // Variantes para os cards individuais de feedback de SEO
  const feedbackCardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { delay: i * 0.07, duration: 0.4, ease: "easeOut" } 
    }),
    // exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2, ease: "easeIn" } } // Se necessário para saída individual
  };
  
  // Variantes para o container dos cards de feedback de SEO
  const feedbackItemsContainerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.2, delay: 0.1 } },
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

  // Variantes para o conteúdo expansível (listas LSI, títulos)
  const detailsContentVariants = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2, ease: "easeIn" } }
  };

  const [openDetails, setOpenDetails] = useState<Record<string, boolean>>({});
  const toggleDetails = (key: string) => {
    setOpenDetails(prev => ({ ...prev, [key]: !prev[key] }));
  };


  // Definição de todos os cards possíveis para SEO
  const allSeoAnalysisCardsDefinition = seoAnalysis ? [
    { key: 'mainKeyword' as SeoMetricKey, title: 'Palavra-Chave Principal', data: { feedback: seoAnalysis.feedbackKeyword, status: seoAnalysis.mainKeyword ? (seoAnalysis.keywordDensity < 1 ? 'baixa' : seoAnalysis.keywordDensity > 2 ? 'alta' : 'ideal') : undefined }, details: seoAnalysis.mainKeyword ? [{ type: 'info' as const, label: 'Palavra-chave:', value: seoAnalysis.mainKeyword, subValue: `Densidade: ${seoAnalysis.keywordDensity.toFixed(1)}%` }] : null },
    { key: 'lsiResult' as SeoMetricKey, title: 'Densidade LSI', data: { feedback: seoAnalysis.lsiResult?.feedback, status: seoAnalysis.lsiResult?.density < 1 ? 'baixa' : seoAnalysis.lsiResult?.density > 2 ? 'alta' : 'ideal' }, detailsKey: 'lsi', details: [
        ...(seoAnalysis.lsiResult?.synonymsUsed && seoAnalysis.lsiResult.synonymsUsed.length > 0 ? [{ type: 'list' as const, summaryLabel: `Sinônimos usados (${seoAnalysis.lsiResult.synonymsUsed.length})`, items: seoAnalysis.lsiResult.synonymsUsed }] : []),
        ...(seoAnalysis.lsiResult?.suggestions && seoAnalysis.lsiResult.suggestions.length > 0 ? [{ type: 'list' as const, summaryLabel: `Sugestões (${seoAnalysis.lsiResult.suggestions.length})`, items: seoAnalysis.lsiResult.suggestions }] : [])
    ].filter(d => d && d.items && d.items.length > 0) },
    { key: 'seoReadability' as SeoMetricKey, title: 'Legibilidade para SEO', data: { feedback: seoAnalysis.feedbackReadability, status: seoAnalysis.seoReadability } },
    { key: 'seoTextLength' as SeoMetricKey, title: 'Comprimento do Texto (SEO)', data: { feedback: seoAnalysis.feedbackLength, status: seoAnalysis.seoTextLength } },
    { key: 'headingResult' as SeoMetricKey, title: 'Estrutura Textual', data: { feedback: seoAnalysis.feedbackHeadings, status: seoAnalysis.headingResult?.hasStructure ? 'bom' : 'precisa de ajustes' }, detailsKey: 'headings', details: seoAnalysis.headingResult?.potentialHeadings && seoAnalysis.headingResult.potentialHeadings.length > 0 ? [{ type: 'headings' as const, summaryLabel: `Títulos potenciais (${seoAnalysis.headingResult.potentialHeadings.length})`, items: seoAnalysis.headingResult.potentialHeadings }] : null },
  ] : [];

  const seoCardsToDisplay = allSeoAnalysisCardsDefinition.filter(cardDef =>
    preferences.seoAnalysis[cardDef.key as keyof typeof preferences.seoAnalysis]?.showCard
  );

  const hasVisibleSeoCards = seoCardsToDisplay.length > 0;

  return (
    <div className={`${editorLayoutStyles.editorLayout} ${isFocusMode ? editorLayoutStyles.focusModeLayoutActive : ''}`}>
      <div className={editorLayoutStyles.mainContentArea}>
        <motion.h2 className={editorLayoutStyles.editorTitle} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}>Análise de SEO</motion.h2>
        <motion.p className={editorLayoutStyles.editorSubtitle} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}>Otimize seu texto para os motores de busca.</motion.p>
        <div className={editorLayoutStyles.toolbarWrapper}>
          <MetricsToolbar metrics={basicMetrics} />
        </div>
        <TextArea
          className={editorLayoutStyles.editorAreaAdapter}
          placeholder="Cole seu texto aqui para analisar o SEO..."
          value={text} // <<< Usa o 'text' do contexto
          onChange={(e) => setText(e.target.value)} // <<< Chama o 'setText' do contexto
          rows={15}
        />
      </div>

      {!isFocusMode && seoAnalysis && (
        <motion.div
          className={styles.seoAnalysisPanel}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        >
          <h3 className={styles.panelTitle}>Análise de SEO</h3>
          <p className={styles.panelSubtitle}>Verifique os pontos chave para otimização.</p>
          
          <AnimatePresence mode="wait">
            {(text.length > 0 && hasVisibleSeoCards) ? (
              <motion.div
                key="seo-feedback-items-container"
                className={styles.feedbackContainer}
                variants={feedbackItemsContainerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {seoCardsToDisplay.map((card, index) => (
                  <motion.div
                    key={card.key}
                    className={`${styles.feedbackCard} ${getStatusClass(card.data?.status)}`}
                    custom={index}
                    variants={feedbackCardVariants}
                    initial="hidden"
                    animate="visible"
                    // exit="exit" // Saída controlada pelo container pai
                  >
                    <h4 className={styles.feedbackTitle}>{card.title}</h4>
                    <motion.p
                      key={card.data?.feedback} // Animar quando o texto do feedback mudar
                      className={styles.feedbackText}
                      variants={feedbackTextChangeVariants}
                      initial="initial"
                      animate="animate"
                    >
                      {card.data?.feedback}
                    </motion.p>
                    
                    {card.details && card.details.length > 0 && (
                      <div className={styles.detailsWrapper}>
                        <motion.button 
                          onClick={() => toggleDetails(card.detailsKey || card.key)} 
                          className={styles.summaryButton}
                          aria-expanded={openDetails[card.detailsKey || card.key] ?? false}
                        >
                          {/* Para LSI e Headings, pode ter múltiplos 'details' items (listas), então pegamos o primeiro summaryLabel como exemplo */}
                          {card.details[0]?.summaryLabel || 'Ver detalhes'}
                          <motion.span className={styles.summaryChevron} animate={{ rotate: (openDetails[card.detailsKey || card.key] ?? false) ? 180 : 0 }}>&#9660;</motion.span>
                        </motion.button>
                        <AnimatePresence initial={false}>
                          {(openDetails[card.detailsKey || card.key] ?? false) && card.details.map((detail: any, detailIndex: number) => (
                            <motion.div
                              key={`details-content-${card.key}-${detailIndex}`}
                              variants={detailsContentVariants}
                              initial="initial"
                              animate="animate"
                              exit="exit"
                              style={{ overflow: 'hidden' }}
                            >
                              {detail.type === 'info' && (
                                <div className={styles.keywordInfo}>
                                  <span className={styles.keywordLabel}>{detail.label}</span>
                                  <motion.span 
                                    key={detail.value} 
                                    variants={feedbackTextChangeVariants} 
                                    initial="initial" animate="animate" 
                                    className={styles.keywordValue}
                                  >
                                    {detail.value}
                                  </motion.span>
                                  {detail.subValue && <span className={styles.keywordSubValue}>{detail.subValue}</span>}
                                </div>
                              )}
                              {detail.type === 'list' && (
                                <>
                                  {detail.summaryLabel && !openDetails[card.detailsKey || card.key] && <p className={styles.detailSummaryPreview}>{detail.summaryLabel}</p> /* Não será usado com botão */}
                                  <p className={styles.wordList}>{detail.items.join(', ')}</p>
                                </>
                              )}
                              {detail.type === 'headings' && (
                                <>
                                 {detail.summaryLabel && !openDetails[card.detailsKey || card.key] && <p className={styles.detailSummaryPreview}>{detail.summaryLabel}</p> /* Não será usado com botão */}
                                <ul className={styles.headingsList}>
                                  {detail.items.map((h: string, i: number) => <li key={i}>{h}</li>)}
                                </ul>
                                </>
                              )}
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              text.length > 0 && !hasVisibleSeoCards ? (
                  <motion.div 
                    key="empty-seo-config" 
                    className={editorLayoutStyles.emptyStateAdvancedMetrics} 
                    variants={emptyStateVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                      <FaLightbulb />
                      <p>Nenhuma métrica de SEO selecionada. Ajuste na personalização.</p>
                  </motion.div>
              ) : text.length === 0 ? (
                  <motion.div 
                    key="empty-seo-text" 
                    className={editorLayoutStyles.emptyStateAdvancedMetrics} 
                    variants={emptyStateVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                      <FaLightbulb />
                      <p>Sua análise de SEO aparecerá aqui.</p>
                  </motion.div>
              ) : null
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default EditorWithSEO;