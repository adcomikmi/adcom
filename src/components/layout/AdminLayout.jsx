// src/components/layout/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';

function AdminLayout() {
  return (
    <div className="min-h-screen bg-neum-bg">
      <AdminNavbar />
      <main className="container mx-auto pt-24 pb-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;