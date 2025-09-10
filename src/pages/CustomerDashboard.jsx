import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import CustomerSidebar from '@/components/Customer/CustomerSidebar';
import CustomerOverview from '@/components/Customer/CustomerOverview';
import ProductBrowsing from '@/components/Customer/ProductBrowsing';
import CustomerOrders from '@/components/Customer/CustomerOrders';
import ShoppingCart from '@/components/Customer/ShoppingCart';

const CustomerDashboard = () => {
  return (
    <>
      <Helmet>
        <title>Müşteri Dashboard - TanePro B2B</title>
        <meta name="description" content="TanePro B2B müşteri paneli" />
        <meta property="og:title" content="Müşteri Dashboard - TanePro B2B" />
        <meta property="og:description" content="TanePro B2B müşteri paneli" />
      </Helmet>

      <Routes>
        <Route path="/" element={
          <DashboardLayout 
            sidebar={<CustomerSidebar />} 
            title="Genel Bakış"
          >
            <CustomerOverview />
          </DashboardLayout>
        } />
        <Route path="/products" element={
          <DashboardLayout 
            sidebar={<CustomerSidebar />} 
            title="Ürünler"
          >
            <ProductBrowsing />
          </DashboardLayout>
        } />
        <Route path="/orders" element={
          <DashboardLayout 
            sidebar={<CustomerSidebar />} 
            title="Siparişlerim"
          >
            <CustomerOrders />
          </DashboardLayout>
        } />
        <Route path="/cart" element={
          <DashboardLayout 
            sidebar={<CustomerSidebar />} 
            title="Sepetim"
          >
            <ShoppingCart />
          </DashboardLayout>
        } />
        <Route path="*" element={<Navigate to="/customer" replace />} />
      </Routes>
    </>
  );
};

export default CustomerDashboard;