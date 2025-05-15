import React from 'react';
import DashboardLayout from '../templates/DashboardLayout';
import EditorWithSEO from '../organisms/EditorWithSEO';
import styles from './EditorSEOPage.module.scss';

const EditorSEOPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className={styles.page}>
        <h1>Análise de SEO</h1>
        <EditorWithSEO />
      </div>
    </DashboardLayout>
  );
};

export default EditorSEOPage;