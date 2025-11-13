// src/components/layout/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function MainLayout() {
  return (
    <div className="min-h-screen bg-neum-bg">
      <Navbar />
      <main className="container mx-auto pt-24 pb-8">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;