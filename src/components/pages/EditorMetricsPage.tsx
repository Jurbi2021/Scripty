import React from 'react';
import DashboardLayout from '../templates/DashboardLayout';
import EditorWithMetrics from '../organisms/EditorWithMetrics';
import styles from './EditorMetricsPage.module.scss';

const EditorMetricsPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className={styles.page}>
        <EditorWithMetrics />
      </div>
    </DashboardLayout>
  );
};

export default EditorMetricsPage;