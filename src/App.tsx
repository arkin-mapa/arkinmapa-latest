import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/Navbar';
import { ClientDashboard } from './pages/ClientDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { useAuth } from './hooks/useAuth';
import { useStore } from './store';

function App() {
  const { user, isAdmin, loading } = useAuth();
  const { fetchPlans, fetchVouchers, fetchPurchaseRequests } = useStore();

  useEffect(() => {
    if (user) {
      fetchPlans();
      fetchVouchers();
      fetchPurchaseRequests();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route 
            path="/dashboard" 
            element={user ? <ClientDashboard /> : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/admin" 
            element={
              user ? (
                isAdmin ? <AdminDashboard /> : <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/auth" replace />
              )
            } 
          />
        </Routes>
        <Toaster position="top-center" />
      </div>
    </Router>
  );
}

export default App;