import React from 'react';
import styles from './MainLayout.module.scss';
import Sidebar from '../organisms/Sidebar';
import Header from '../organisms/Header';

// Define the possible views that the sidebar can navigate to
type View = 'metrics' | 'style' | 'seo' | 'personalization' | 'help';

interface MainLayoutProps {
  children: React.ReactNode;
  onNavigate: (view: View) => void; // Receive navigation handler from App
  initialView?: View; // Optional: to set the initial active item in Sidebar if needed
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, onNavigate, initialView }) => {
  return (
    <div className={styles.layout}>
      {/* Pass initialView to Sidebar if it needs to highlight an item on load */}
      <Sidebar onNavigate={onNavigate} initialView={initialView} /> 
      {/* Corrected class name to match SCSS for proper flex behavior */}
      <div className={styles.mainContent}> 
        <Header />
        {/* Corrected class name to match SCSS for proper flex behavior and scrolling */}
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

