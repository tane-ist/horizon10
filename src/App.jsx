
    import React from 'react';
    import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
    import { Helmet } from 'react-helmet';
    import { Toaster } from '@/components/ui/toaster';
    import { AuthProvider } from '@/contexts/AuthContext';
    import { DataProvider } from '@/contexts/DataContext';
    import LoginPage from '@/pages/LoginPage';
    import RegisterPage from '@/pages/RegisterPage';
    import AdminDashboard from '@/pages/AdminDashboard';
    import SupplierDashboard from '@/pages/SupplierDashboard';
    import CustomerDashboard from '@/pages/CustomerDashboard';
    import ProtectedRoute from '@/components/ProtectedRoute';

    function App() {
      return (
        <AuthProvider>
          <DataProvider>
            <Router>
              <Helmet>
                <title>TanePro B2B - İş Ortağı Platformu</title>
                <meta name="description" content="TanePro B2B platformu ile tedarikçiler, müşteriler ve yöneticiler için kapsamlı iş yönetimi çözümü" />
                <meta property="og:title" content="TanePro B2B - İş Ortağı Platformu" />
                <meta property="og:description" content="TanePro B2B platformu ile tedarikçiler, müşteriler ve yöneticiler için kapsamlı iş yönetimi çözümü" />
              </Helmet>
              
              <div className="min-h-screen bg-gray-50">
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  
                  <Route path="/admin/*" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/supplier/*" element={
                    <ProtectedRoute allowedRoles={['supplier']}>
                      <SupplierDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/customer/*" element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
              </div>
              
              <Toaster />
            </Router>
          </DataProvider>
        </AuthProvider>
      );
    }

    export default App;
  