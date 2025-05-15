import React from 'react';
import DashboardLayout from '../templates/DashboardLayout';
import PersonalizationPanel from '../organisms/PersonalizationPanel';
import styles from './PersonalizationPage.module.scss';

const PersonalizationPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className={styles.page}>
        <h1>Personalizar Scripty</h1>
        <PersonalizationPanel />
      </div>
    </DashboardLayout>
  );
};

export default PersonalizationPage;