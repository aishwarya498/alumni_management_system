import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import AlumniList from './pages/AlumniList';
import AlumniForm from './pages/AlumniForm';
import AlumniDetails from './pages/AlumniDetails';
import SearchPage from './pages/SearchPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AlumniDashboard from './pages/AlumniDashboard';
import RoleManagement from './pages/RoleManagement';

// new module pages
import NetworkingHub from './pages/NetworkingHub';
import JobPortal from './pages/JobPortal';
import Donations from './pages/Donations';
import EventsReunions from './pages/EventsReunions';
import SuccessStories from './pages/SuccessStories';
import Feedback from './pages/Feedback';

// new resource pages
import CareerServices from './pages/CareerServices';
import Mentorship from './pages/Mentorship';
import Newsletter from './pages/Newsletter';
import HelpCenter from './pages/HelpCenter';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const DashboardSwitch = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.roles?.includes('admin')) {
    return <AdminDashboard />;
  }

  if (user.roles?.includes('manager')) {
    return <ManagerDashboard />;
  }

  if (user.roles?.includes('alumni')) {
    return <AlumniDashboard />;
  }

  return <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <UIProvider>
          <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/manager" element={
                <ProtectedRoute requiredRoles={['manager']}>
                  <ManagerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/alumni-dashboard" element={
                <ProtectedRoute requiredRoles={['alumni']}>
                  <AlumniDashboard />
                </ProtectedRoute>
              } />
              <Route path="/roles" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <RoleManagement />
                </ProtectedRoute>
              } />
              <Route path="/alumni" element={
                <ProtectedRoute>
                  <AlumniList />
                </ProtectedRoute>
              } />
              <Route path="/alumni/:id" element={
                <ProtectedRoute>
                  <AlumniDetails />
                </ProtectedRoute>
              } />
              <Route path="/add-alumni" element={
                <ProtectedRoute requiredRoles={['admin', 'manager', 'alumni']}>
                  <AlumniForm isEdit={false} />
                </ProtectedRoute>
              } />
              <Route path="/edit-alumni/:id" element={
                <ProtectedRoute requiredRoles={['admin', 'manager', 'alumni']}>
                  <AlumniForm isEdit={true} />
                </ProtectedRoute>
              } />
              <Route path="/search" element={
                <ProtectedRoute>
                  <SearchPage />
                </ProtectedRoute>
              } />

              {/* new module routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardSwitch />
                </ProtectedRoute>
              } />
              <Route path="/networking" element={
                <ProtectedRoute>
                  <NetworkingHub />
                </ProtectedRoute>
              } />
              <Route path="/jobs" element={
                <ProtectedRoute>
                  <JobPortal />
                </ProtectedRoute>
              } />
              <Route path="/donations" element={
                <ProtectedRoute>
                  <Donations />
                </ProtectedRoute>
              } />
              <Route path="/events" element={
                <ProtectedRoute>
                  <EventsReunions />
                </ProtectedRoute>
              } />
              <Route path="/stories" element={
                <ProtectedRoute>
                  <SuccessStories />
                </ProtectedRoute>
              } />
              <Route path="/feedback" element={
                <ProtectedRoute>
                  <Feedback />
                </ProtectedRoute>
              } />

              {/* resource pages */}
              <Route path="/careers" element={
                <ProtectedRoute>
                  <CareerServices />
                </ProtectedRoute>
              } />
              <Route path="/mentorship" element={
                <ProtectedRoute>
                  <Mentorship />
                </ProtectedRoute>
              } />
              <Route path="/newsletter" element={
                <ProtectedRoute>
                  <Newsletter />
                </ProtectedRoute>
              } />
              <Route path="/help" element={
                <ProtectedRoute>
                  <HelpCenter />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
          </div>
        </UIProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
