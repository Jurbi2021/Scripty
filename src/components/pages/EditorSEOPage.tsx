import React from 'react';
import DashboardLayout from '../templates/DashboardLayout';
import EditorWithSEO from '../organisms/EditorWithSEO';
import styles from './EditorSEOPage.module.scss';

const EditorSEOPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className={styles.page}>
        <EditorWithSEO />
      </div>
    </DashboardLayout>
  );
};

export default EditorSEOPage;