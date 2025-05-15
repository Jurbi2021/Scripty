import React from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { EditorToolbar } from '../molecules/EditorToolbar';
import MetricsSummary from '../molecules/MetricsSummary';
import styles from './EditorWithSEO.module.scss';

const EditorWithSEO: React.FC = () => {
  const { text, setText, isFocusMode } = useEditor();

  const toolbarMetrics = [
    { label: 'Palavras', value: text.split(' ').filter(Boolean).length },
    { label: 'Keywords', value: '0' }, // Placeholder, pode integrar lógica real depois
  ];

  const seoMetrics = [
    { name: 'SEO Score', value: '70%' },
    { name: 'Keywords', value: 'Faltando' },
  ];

  return (
    <div className={`${styles.editorWrapper} ${isFocusMode ? styles.focusMode : ''}`}>
      {/* Primeira Seção: Títulos */}
      <div className={styles.titleSection}>
        <div className={styles.titleColumn}>
          <h1 className={styles.editorTitle}>Editor SEO</h1>
        </div>
        <div className={styles.titleColumn}>
          <h1 className={styles.seoTitle}>Análise de SEO</h1>
        </div>
      </div>

      {/* Segunda Seção: Editor e Métricas de SEO */}
      <div className={styles.contentSection}>
        <div className={styles.editorColumn}>
          <EditorToolbar metrics={toolbarMetrics} />
          <textarea
            className={styles.editor}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Digite seu texto aqui..."
          />
        </div>
        <div className={styles.seoColumn}>
          <MetricsSummary metrics={seoMetrics} />
        </div>
      </div>
    </div>
  );
};

export default EditorWithSEO;