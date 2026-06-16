import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Page Views
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

// Candidate Page Views
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import PracticeSetup from './pages/candidate/PracticeSetup';
import JoinInterview from './pages/candidate/JoinInterview';
import ResultsPage from './pages/candidate/ResultsPage';
import ResultsHistory from './pages/candidate/ResultsHistory';

// Recruiter Page Views
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import CreateTemplate from './pages/recruiter/CreateTemplate';
import TemplateCandidates from './pages/recruiter/TemplateCandidates';

// Interview Session View
import InterviewRoom from './pages/interview/InterviewRoom';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-brand-bg text-slate-100 font-sans">
          
          {/* Global Header */}
          <Navbar />
          
          {/* Main Content Viewport */}
          <main className="flex-grow flex flex-col w-full">
            <Routes>
              
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Protected Candidate Routes */}
              <Route 
                path="/candidate/dashboard" 
                element={
                  <ProtectedRoute allowedRole="candidate">
                    <CandidateDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/candidate/practice" 
                element={
                  <ProtectedRoute allowedRole="candidate">
                    <PracticeSetup />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/candidate/join" 
                element={
                  <ProtectedRoute allowedRole="candidate">
                    <JoinInterview />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/candidate/results/:sessionId" 
                element={
                  <ProtectedRoute allowedRole="candidate">
                    <ResultsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/candidate/history" 
                element={
                  <ProtectedRoute allowedRole="candidate">
                    <ResultsHistory />
                  </ProtectedRoute>
                } 
              />

              {/* Protected Recruiter Routes */}
              <Route 
                path="/recruiter/dashboard" 
                element={
                  <ProtectedRoute allowedRole="recruiter">
                    <RecruiterDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/recruiter/create-template" 
                element={
                  <ProtectedRoute allowedRole="recruiter">
                    <CreateTemplate />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/recruiter/template/:templateId" 
                element={
                  <ProtectedRoute allowedRole="recruiter">
                    <TemplateCandidates />
                  </ProtectedRoute>
                } 
              />

              {/* Shared Protected Interview Room */}
              <Route 
                path="/interview/:sessionId" 
                element={
                  <ProtectedRoute>
                    <InterviewRoom />
                  </ProtectedRoute>
                } 
              />

              {/* Fallback Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </main>
          
          {/* Global Footer */}
          <Footer />
          
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
