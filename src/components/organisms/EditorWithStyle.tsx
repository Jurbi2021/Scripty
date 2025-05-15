import React from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { EditorToolbar } from '../molecules/EditorToolbar';
import MetricsSummary from '../molecules/MetricsSummary';
import styles from './EditorWithStyle.module.scss';

const EditorWithStyle: React.FC = () => {
  const { text, setText, isFocusMode } = useEditor();

  const toolbarMetrics = [
    { label: 'Palavras', value: text.split(' ').filter(Boolean).length },
    { label: 'Sentences', value: text.split('.').filter(Boolean).length },
  ];

  const styleMetrics = [
    { name: 'Clareza', value: 'Alta' },
    { name: 'Tom', value: 'Formal' },
  ];

  return (
    <div className={`${styles.editorWrapper} ${isFocusMode ? styles.focusMode : ''}`}>
      {/* Primeira Seção: Títulos */}
      <div className={styles.titleSection}>
        <div className={styles.titleColumn}>
          <h1 className={styles.editorTitle}>Editor de Estilo</h1>
        </div>
        <div className={styles.titleColumn}>
          <h1 className={styles.styleTitle}>Análise de Estilo</h1>
        </div>
      </div>

      {/* Segunda Seção: Editor e Métricas de Estilo */}
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
        <div className={styles.styleColumn}>
          <MetricsSummary metrics={styleMetrics} />
        </div>
      </div>
    </div>
  );
};

export default EditorWithStyle;