// src/components/organisms/EditorWithStyle.tsx
import React, { useState, useEffect } from 'react';
import styles from './EditorWithStyle.module.scss'; // Estilos específicos para este editor
import editorLayoutStyles from './EditorWithMetrics.module.scss'; // Reutilizar estilos de layout do EditorWithMetrics
import { motion, AnimatePresence } from 'framer-motion';
import { FaLightbulb } from 'react-icons/fa'; // Para o empty state

// Componentes
import TextArea from '../atoms/TextArea';
import MetricsToolbar from '../molecules/MetricsToolbar';

// Utils e Tipos
import {
  calculateBasicMetrics,
  BasicMetricsData,
} from '../../utils/BasicMetrics';;
import {
  performStyleAnalysis,
  StyleAnalysisData,
  getEmptyStyleAnalysis,
  SentenceInfo, //
  ComplexSentenceInfo //
} from '../../utils/StyleAnalysis'; //

// Ordem das métricas básicas (igual ao EditorWithMetrics)
const basicMetricDisplayOrder: { key: keyof BasicMetricsData; label: string }[] = [
  { key: 'words', label: 'Palavras' },
  { key: 'charsWithSpaces', label: 'Caracteres' },
  { key: 'readingTime', label: 'Tempo Leitura' },
  { key: 'sentences', label: 'Sentenças' },
  { key: 'paragraphs', label: 'Parágrafos' },
  { key: 'uniqueWords', label: 'Palavras Únicas' },
  { key: 'avgWordsPerSentence', label: 'Média Palavras/Sentença' },
  { key: 'avgCharsPerWord', label: 'Média Caracteres/Palavra' },
  { key: 'charsNoSpaces', label: 'Caracteres (s/ espaço)' },
];

const EditorWithStyle: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [basicMetrics, setBasicMetrics] = useState<BasicMetricsData>(calculateBasicMetrics(''));
  const [styleAnalysis, setStyleAnalysis] = useState<StyleAnalysisData>(getEmptyStyleAnalysis()); //

  useEffect(() => {
    const handler = setTimeout(() => {
      setBasicMetrics(calculateBasicMetrics(text));
      setStyleAnalysis(performStyleAnalysis(text)); //
    }, 300);
    return () => clearTimeout(handler);
  }, [text]);

  const toolbarMetrics = basicMetricDisplayOrder.map(metric => ({
    label: metric.label,
    value: basicMetrics[metric.key]
  }));

  const getLevelClass = (level: string): string => { //
    switch (level?.toLowerCase()) {
      case 'excelente': return styles.levelExcelente;
      case 'bom': return styles.levelBom;
      case 'regular': return styles.levelRegular;
      case 'ruim': return styles.levelRuim;
      default: return styles.levelNA || '';
    }
  };

  const renderSentences = (sentences: SentenceInfo[] | ComplexSentenceInfo[], type: string) => { //
    if (!sentences || sentences.length === 0) return <p className={styles.noDetails}>Nenhuma frase para destacar nesta categoria.</p>;
    return (
      <ul className={styles.sentenceList}>
        {sentences.slice(0, 5).map((info) => (
          <li key={`${type}-${info.index}`}>
            <span>{info.index}:</span> {info.sentence}
            {/* Para frases complexas, podemos adicionar mais detalhes se quisermos */}
            {(info as ComplexSentenceInfo).wordCount && (
              <span className={styles.sentenceMeta}> ({ (info as ComplexSentenceInfo).wordCount} palavras)</span>
            )}
          </li>
        ))}
        {sentences.length > 5 && <li className={styles.moreDetails}>... e mais {sentences.length - 5}.</li>}
      </ul>
    );
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
      // ease: [0.6, 0.05, -0.01, 0.9] // <--- Linha problemática
      ease: "easeOut" // <--- SUBSTITUA POR UM EASING VÁLIDO
      // ou tente ajustar os valores da sua cubic-bezier, ex:
      // ease: [0.6, 0.05, 0.1, 0.9]
    }
  })
};

  const analysisItems = [
    { key: 'passiveVoice', data: styleAnalysis.passiveVoice, title: 'Voz Passiva', detailsContent: styleAnalysis.passiveVoice.sentences, detailType: 'passive' },
    { key: 'adverbs', data: styleAnalysis.adverbs, title: 'Advérbios', detailsContent: styleAnalysis.adverbs.adverbs, detailType: 'adverbs' },
    { key: 'complexSentences', data: styleAnalysis.complexSentences, title: 'Frases Complexas', detailsContent: styleAnalysis.complexSentences.sentences, detailType: 'complex' },
    { key: 'discourseConnectors', data: styleAnalysis.discourseConnectors, title: 'Conectores Discursivos', detailsContent: styleAnalysis.discourseConnectors.connectors, detailType: 'connectors'},
    { key: 'lexicalDiversity', data: styleAnalysis.lexicalDiversity, title: 'Diversidade Léxica', detailsContent: null }
  ];


  return (
    <div className={editorLayoutStyles.editorLayout}>
      <div className={editorLayoutStyles.mainContentArea}>
        <motion.h2
          className={editorLayoutStyles.editorTitle}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          Análise de Estilo
        </motion.h2>
        <motion.p
          className={editorLayoutStyles.editorSubtitle}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        >
          Descubra mais sobre a forma como você escreve!
        </motion.p>

        <div className={editorLayoutStyles.toolbarWrapper}>
          <MetricsToolbar metrics={basicMetrics} />
        </div>

        <TextArea
          className={editorLayoutStyles.editorAreaAdapter}
          placeholder="Cole seu texto aqui para analisar o estilo..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={15}
        />
      </div>

      <motion.div
        className={styles.styleAnalysisPanel} // Usar o estilo específico do painel
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
      >
        <h3 className={styles.panelTitle}>Análise de Estilo</h3>
        <p className={styles.panelSubtitle}>Todo o feedback de análise de estilo.</p>

        <AnimatePresence>
          {text.length > 0 ? (
            <div className={styles.feedbackContainer}>
              {analysisItems.map((item, index) => (
                <motion.div
                  key={item.key}
                  className={`${styles.feedbackCard} ${getLevelClass(item.data.level)}`}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible" // Animar quando o texto > 0
                  exit="hidden" // Pode não ser necessário se o container some
                >
                  <h4 className={styles.feedbackTitle}>{item.title}</h4>
                  <p className={styles.feedbackText}>{item.data.feedback}</p>
                  {item.detailsContent && item.data.count > 0 && (
                    <details className={styles.details}>
                      <summary>Ver {item.title === 'Advérbios' || item.title === 'Conectores Discursivos' ? 'lista' : 'frases'} ({item.data.count})</summary>
                      {Array.isArray(item.detailsContent) ? (
                        (item.detailType === 'adverbs' || item.detailType === 'connectors') ?
                          <p className={styles.wordList}>{(item.detailsContent as string[]).slice(0,15).join(', ')}{(item.detailsContent.length > 15 ? '...' : '')}</p> :
                          renderSentences(item.detailsContent as SentenceInfo[] | ComplexSentenceInfo[], item.detailType!)
                      ) : null}
                    </details>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
             <motion.div
                key="empty-style"
                className={editorLayoutStyles.emptyStateAdvancedMetrics} // Reutilizar estilo do empty state
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
             >
                <FaLightbulb />
                <p>Sua análise de estilo aparecerá aqui quando você digitar.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default EditorWithStyle;