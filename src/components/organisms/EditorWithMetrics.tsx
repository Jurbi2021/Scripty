import React from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { EditorToolbar } from '../molecules/EditorToolbar';
import MetricsSummary from '../molecules/MetricsSummary';
import styles from './EditorWithMetrics.module.scss';
import {
  countCharsWithSpaces,
  countCharsNoSpaces,
  countWords,
  countUniqueWords,
  countSentences,
  countParagraphs,
  avgWordsPerSentence,
  avgCharsPerWord,
  readingTime
} from '../../utils/BasicMetrics';

const EditorWithMetrics: React.FC = () => {
  const { text, setText, isFocusMode } = useEditor();

  const toolbarMetrics = [
    { label: 'Caracteres (c/ espaço)', value: countCharsWithSpaces(text) },
    { label: 'Caracteres (s/ espaço)', value: countCharsNoSpaces(text) },
    { label: 'Palavras', value: countWords(text) },
    { label: 'Palavras únicas', value: countUniqueWords(text) },
    { label: 'Sentenças', value: countSentences(text) },
    { label: 'Parágrafos', value: countParagraphs(text) },
    { label: 'Média de palavras/frase', value: avgWordsPerSentence(text) },
    { label: 'Média de caracteres/palavra', value: avgCharsPerWord(text) },
    { label: 'Tempo de leitura (min)', value: readingTime(text) },
  ];

  const advancedMetrics = [
    { name: 'Indicador de Legibilidade', value: 'Boa' },
    { name: 'Comprimento do Texto', value: 'Médio' },
    { name: 'Redundância', value: 'Baixa' },
    { name: 'Análise de Sentimento', value: 'Positivo' },
  ];

  return (
    <div className={`${styles.editorWrapper} ${isFocusMode ? styles.focusMode : ''}`}>
      <h1 className={styles.editorTitle}>Editor Scripty</h1>
      <h1 className={styles.metricsTitle}>Métricas Avançadas</h1>
      
      <div className={styles.editorColumn}>
        <EditorToolbar metrics={toolbarMetrics} />
        <textarea
          className={styles.editor}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Metrifique o seu texto da melhor forma."
        />
      </div>
      
      <div className={styles.metricsColumn}>
        <MetricsSummary metrics={advancedMetrics} />
      </div>
    </div>
  );
};

export default EditorWithMetrics;