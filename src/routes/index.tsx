import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Switch -> Routes
import EditorMetricsPage from '../components/pages/EditorMetricsPage';
import EditorStylePage from '../components/pages/EditorStylePage';
import EditorSEOPage from '../components/pages/EditorSEOPage';
import HelpCenterPage from '../components/pages/HelpCenterPage';
import PersonalizationPage from '../components/pages/PersonalizationPage';

const AppRoutes: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/editor/metrics" element={<EditorMetricsPage />} />
      <Route path="/editor/style" element={<EditorStylePage />} />
      <Route path="/editor/seo" element={<EditorSEOPage />} />
      <Route path="/help" element={<HelpCenterPage />} />
      <Route path="/personalization" element={<PersonalizationPage />} />
      <Route path="/" element={<EditorMetricsPage />} />
    </Routes>
  </Router>
);

export default AppRoutes;