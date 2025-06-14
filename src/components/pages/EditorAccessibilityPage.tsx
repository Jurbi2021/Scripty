import React from 'react';
import DashboardLayout from '../templates/DashboardLayout';
import AccessibilityAnalysis from '../organisms/AccessibilityAnalysis';
import styles from './EditorAccessibilityPage.module.scss';

const EditorAccessibilityPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className={styles.page}>
        <AccessibilityAnalysis />
      </div>
    </DashboardLayout>
  );
};

export default EditorAccessibilityPage;

