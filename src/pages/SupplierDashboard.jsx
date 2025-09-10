import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import SupplierSidebar from '@/components/Supplier/SupplierSidebar';
import SupplierOverview from '@/components/Supplier/SupplierOverview.jsx';
import ProductManagement from '@/components/Supplier/ProductManagement.jsx';
import SupplierOrders from '@/components/Supplier/SupplierOrders.jsx';

const SupplierDashboard = () => {
  return (
    <>
      <Helmet>
        <title>Tedarikçi Dashboard - TanePro B2B</title>
        <meta name="description" content="TanePro B2B tedarikçi yönetim paneli" />
        <meta property="og:title" content="Tedarikçi Dashboard - TanePro B2B" />
        <meta property="og:description" content="TanePro B2B tedarikçi yönetim paneli" />
      </Helmet>

      <Routes>
        <Route path="/" element={
          <DashboardLayout 
            sidebar={<SupplierSidebar />} 
            title="Genel Bakış"
          >
            <SupplierOverview />
          </DashboardLayout>
        } />
        <Route path="/products" element={
          <DashboardLayout 
            sidebar={<SupplierSidebar />} 
            title="Ürün Yönetimi"
          >
            <ProductManagement />
          </DashboardLayout>
        } />
        <Route path="/orders" element={
          <DashboardLayout 
            sidebar={<SupplierSidebar />} 
            title="Siparişlerim"
          >
            <SupplierOrders />
          </DashboardLayout>
        } />
        <Route path="*" element={<Navigate to="/supplier" replace />} />
      </Routes>
    </>
  );
};

export default SupplierDashboard;