import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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
import RoleManagement from './pages/RoleManagement';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
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
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
