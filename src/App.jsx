// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

import Home from './pages/public/Home';
import Login from './pages/Login';
import AdminLogin from './pages/admin/AdminLogin';
import MateriTugas from './pages/public/MateriTugas';
import Tentang from './pages/public/Tentang';
import Dashboard from './pages/member/Dashboard';
import ChangePassword from './pages/member/ChangePassword';
import Diskusi from './pages/member/Diskusi';
import ThreadDetail from './pages/member/ThreadDetail';
import SaranKritik from './pages/member/SaranKritik';

import AdminDashboard from './pages/admin/AdminDashboard';
import UploadMateri from './pages/admin/UploadMateri';
import DataInformasi from './pages/admin/DataInformasi';
import ModifWebsite from './pages/admin/ModifWebsite';
import BuatInformasi from './pages/admin/BuatInformasi';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Publik & Member (Navbar Biasa) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/materi" element={<MateriTugas />} />
          <Route path="/tentang" element={<Tentang />} />
        </Route>

        {/* Rute Protected (Member & Admin) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/diskusi" element={<Diskusi />} />
            <Route path="/diskusi/:threadId" element={<ThreadDetail />} />
            <Route path="/saran" element={<SaranKritik />} />
          </Route>
          
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/upload" element={<UploadMateri />} />
              <Route path="/admin/data" element={<DataInformasi />} />
              <Route path="/admin/informasi" element={<BuatInformasi />} />
              <Route path="/admin/modif" element={<ModifWebsite />} />
            </Route>
          </Route>
          
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>
        
        {/* Rute Penuh (Publik, Tanpa Navbar) */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;