import React, { useState } from 'react';
import './App.css';
import MainLayout from './components/templates/MainLayout';
import EditorWithMetrics from './components/organisms/EditorWithMetrics';
import EditorWithStyle from './components/organisms/EditorWithStyle';
import EditorWithSEO from './components/organisms/EditorWithSEO'; // Uncommented
// import PersonalizationPanel from './components/organisms/PersonalizationPanel'; // Placeholder for future
// import HelpComponent from './components/organisms/HelpComponent'; // Placeholder for future

// Define possible views/pages
type View = 'metrics' | 'style' | 'seo' | 'personalization' | 'help';

function App() {
  // State to manage the current view, default to 'metrics'
  const [currentView, setCurrentView] = useState<View>('metrics');

  // Function to handle navigation requests from Sidebar
  const handleNavigate = (view: View) => {
    // Allow navigation to implemented views
    if (view === 'metrics' || view === 'style' || view === 'seo') { // Added 'seo'
        setCurrentView(view);
    } else {
        console.warn(`Navigation to view "${view}" is not implemented yet.`);
        // Optionally, keep the current view or navigate to a default
        // setCurrentView('metrics');
    }
  };

  // Function to render the correct page based on the current view
  const renderPage = () => {
    switch (currentView) {
      case 'metrics':
        return <EditorWithMetrics />;
      case 'style':
        return <EditorWithStyle />;
      case 'seo': // Added case for SEO
        return <EditorWithSEO />;
      // case 'personalization':
      //   return <PersonalizationPanel />;
      // case 'help':
      //   return <HelpComponent />;
      default:
        console.warn(`Attempted to render unknown view: ${currentView}`);
        return <EditorWithMetrics />; // Default to metrics if state is invalid
    }
  };

  return (
    <MainLayout onNavigate={handleNavigate} initialView={currentView}> {/* Pass navigation handler and initial view */}
      {renderPage()} {/* Render the currently selected page */}
    </MainLayout>
  );
}

export default App;

