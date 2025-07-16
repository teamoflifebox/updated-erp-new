import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; 
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import StudentManagement from './pages/StudentManagement';
import FacultyManagement from './pages/FacultyManagement';
import AttendanceManagement from './pages/AttendanceManagement';
import MarksManagement from './pages/MarksManagement';
import FeeManagement from './pages/FeeManagement';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import DocumentsPage from './pages/DocumentsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import TimetablePage from './pages/TimetablePage';
import SettingsPage from './pages/SettingsPage';
import NotificationCenter from './components/WhatsApp/NotificationCenter';
import RealTimeAnalyticsPage from './pages/RealTimeAnalyticsPage';
import AlumniPage from './pages/AlumniPage';
import AcademicPage from './pages/AcademicModal';
import AdmissionsPage from './pages/AdmissionsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E3A8A]/5 via-white to-[#9333EA]/5">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return user ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" />
  );
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/alumni" element={<AlumniPage />} />
      <Route path="/admissions" element={<AdmissionsPage/>} />
      <Route path="/academics" element={<AcademicPage />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      
      <Route path="/students" element={
        <ProtectedRoute>
          <StudentManagement />
        </ProtectedRoute>
      } />
      
      <Route path="/faculty" element={
        <ProtectedRoute>
          <FacultyManagement />
        </ProtectedRoute>
      } />
      
      <Route path="/attendance" element={
        <ProtectedRoute>
          <AttendanceManagement />
        </ProtectedRoute>
      } />
      
      <Route path="/marks" element={
        <ProtectedRoute>
          <MarksManagement />
        </ProtectedRoute>
      } />
      
      <Route path="/fees" element={
        <ProtectedRoute>
          <FeeManagement />
        </ProtectedRoute>
      } />
      
      <Route path="/notifications" element={
        <ProtectedRoute>
          <NotificationsPage />
        </ProtectedRoute>
      } />
      
      <Route path="/documents" element={
        <ProtectedRoute>
          <DocumentsPage />
        </ProtectedRoute>
      } />
      
      <Route path="/analytics" element={
        <ProtectedRoute>
          <AnalyticsPage />
        </ProtectedRoute>
      } />

      <Route path="/real-time-analytics" element={
        <ProtectedRoute>
          <RealTimeAnalyticsPage />
        </ProtectedRoute>
      } />

      <Route path="/timetable" element={
        <ProtectedRoute>
          <TimetablePage />
        </ProtectedRoute>
      } />

      <Route path="/settings" element={
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      } />

      <Route path="/whatsapp" element={
        <ProtectedRoute>
          <NotificationCenter />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;