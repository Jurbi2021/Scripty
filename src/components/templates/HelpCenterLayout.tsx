import React from 'react';
import Header from '../organisms/Header';
import styles from './HelpCenterLayout.module.scss';

interface HelpCenterLayoutProps {
  children: React.ReactNode;
}

const HelpCenterLayout: React.FC<HelpCenterLayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.content}>{children}</main>
    </div>
  );
};

export default HelpCenterLayout;