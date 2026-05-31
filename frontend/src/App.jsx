import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Interview from './pages/Interview';
import InterviewReport from './pages/InterviewReport';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-100 selection:bg-indigo-500/30 selection:text-indigo-200">
        <Routes>
          {/* Main profile controller entry track */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Interactive live speech processing nodes */}
          <Route path="/interview" element={<Interview />} />
          
          {/* Detailed structured analytical reports sheet */}
          <Route path="/interview-report" element={<InterviewReport />} />
          
          {/* Fallback route redirection rules */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;