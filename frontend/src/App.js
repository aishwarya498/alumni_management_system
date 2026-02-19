import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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
import AdminDashboardNew from './pages/AdminDashboardNew';
import ManagerDashboard from './pages/ManagerDashboard';
import AlumniDashboard from './pages/AlumniDashboard';
import RoleManagement from './pages/RoleManagement';

// new module pages
import Dashboard from './pages/Dashboard';
import NetworkingHub from './pages/NetworkingHub';
import JobPortal from './pages/JobPortal';
import Donations from './pages/Donations';
import EventsReunions from './pages/EventsReunions';
import SuccessStories from './pages/SuccessStories';
import Feedback from './pages/Feedback';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

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
                  <AdminDashboardNew />
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
              <Route path="/alumni" element={<AlumniList />} />
              <Route path="/alumni/:id" element={<AlumniDetails />} />
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
              <Route path="/search" element={<SearchPage />} />

              {/* new module routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/networking" element={<NetworkingHub />} />
              <Route path="/jobs" element={<JobPortal />} />
              <Route path="/donations" element={<Donations />} />
              <Route path="/events" element={<EventsReunions />} />
              <Route path="/stories" element={<SuccessStories />} />
              <Route path="/feedback" element={<Feedback />} />
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
