
    import React from 'react';
    import { Routes, Route, Navigate } from 'react-router-dom';
    import { Helmet } from 'react-helmet';
    import DashboardLayout from '@/components/Layout/DashboardLayout';
    import AdminSidebar from '@/components/Admin/AdminSidebar';
    import AdminOverview from '@/components/Admin/AdminOverview';
    import SupplierManagement from '@/components/Admin/SupplierManagement';
    import CustomerManagement from '@/components/Admin/CustomerManagement';
    import OrderManagement from '@/components/Admin/OrderManagement';
    import CategoryManagement from '@/components/Admin/CategoryManagement';
    import AdminProductManagement from '@/components/Admin/AdminProductManagement';

    const AdminDashboard = () => {
      return (
        <>
          <Helmet>
            <title>Admin Dashboard - TanePro B2B</title>
            <meta name="description" content="TanePro B2B admin yönetim paneli" />
            <meta property="og:title" content="Admin Dashboard - TanePro B2B" />
            <meta property="og:description" content="TanePro B2B admin yönetim paneli" />
          </Helmet>

          <Routes>
            <Route path="/" element={
              <DashboardLayout 
                sidebar={<AdminSidebar />} 
                title="Genel Bakış"
              >
                <AdminOverview />
              </DashboardLayout>
            } />
            <Route path="/suppliers" element={
              <DashboardLayout 
                sidebar={<AdminSidebar />} 
                title="Tedarikçi Yönetimi"
              >
                <SupplierManagement />
              </DashboardLayout>
            } />
            <Route path="/customers" element={
              <DashboardLayout 
                sidebar={<AdminSidebar />} 
                title="Müşteri Yönetimi"
              >
                <CustomerManagement />
              </DashboardLayout>
            } />
            <Route path="/orders" element={
              <DashboardLayout 
                sidebar={<AdminSidebar />} 
                title="Sipariş Yönetimi"
              >
                <OrderManagement />
              </DashboardLayout>
            } />
             <Route path="/categories" element={
              <DashboardLayout 
                sidebar={<AdminSidebar />} 
                title="Kategori Yönetimi"
              >
                <CategoryManagement />
              </DashboardLayout>
            } />
            <Route path="/products" element={
              <DashboardLayout 
                sidebar={<AdminSidebar />} 
                title="Ürün Yönetimi"
              >
                <AdminProductManagement />
              </DashboardLayout>
            } />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </>
      );
    };

    export default AdminDashboard;
  