import React from 'react';
import DashboardLayout from '../templates/DashboardLayout';
import PersonalizationPanel from '../organisms/PersonalizationPanel';
import styles from './PersonalizationPage.module.scss';

const PersonalizationPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className={styles.page}>
        <PersonalizationPanel />
      </div>
    </DashboardLayout>
  );
};

export default PersonalizationPage;