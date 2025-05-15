import React from 'react';
import DashboardLayout from '../templates/DashboardLayout';
import EditorWithStyle from '../organisms/EditorWithStyle';
import styles from './EditorStylePage.module.scss';

const EditorStylePage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className={styles.page}>
        <h1>Análise de Estilo</h1>
        <EditorWithStyle />
      </div>
    </DashboardLayout>
  );
};

export default EditorStylePage;