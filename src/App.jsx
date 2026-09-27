import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import BoardPage from './pages/BoardPage';
import DashboardPage from './pages/DashboardPage';
import MembersAdminPage from './pages/MembersAdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-red-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content View */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route path="/bureau" element={<BoardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin/members" element={<MembersAdminPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
