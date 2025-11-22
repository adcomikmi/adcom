// src/components/layout/AdminNavbar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { HiMenu, HiX } from 'react-icons/hi';
import { getHomeConfig } from '../../services/api';

function AdminNavbar() {
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const config = await getHomeConfig();
        if (config.logoImage && config.logoImage.url) {
          setLogoUrl(config.logoImage.url);
        }
      } catch (err) {
        console.error("Gagal mengambil logo", err);
      }
    };
    fetchLogo();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const linkStyle = "block md:inline-block px-4 py-3 md:py-2 rounded-lg text-sm font-medium text-gray-700 transition-all duration-150";
  const activeLinkStyle = "shadow-neum-in";
  const inactiveLinkStyle = "hover:shadow-neum-out-hover";

  const getLinkClass = ({ isActive }) => 
    `${linkStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`;
  
  const AdminNavLinks = ({ isMobile = false }) => (
    <>
      <NavLink to="/admin" className={getLinkClass} onClick={() => setIsOpen(false)} end>Home</NavLink>
      <NavLink to="/admin/informasi" className={getLinkClass} onClick={() => setIsOpen(false)}>Buat Informasi</NavLink>
      <NavLink to="/admin/upload" className={getLinkClass} onClick={() => setIsOpen(false)}>Upload Materi</NavLink>
      <NavLink to="/admin/data" className={getLinkClass} onClick={() => setIsOpen(false)}>Data Informasi</NavLink>
      <NavLink to="/admin/modif" className={getLinkClass} onClick={() => setIsOpen(false)}>Modif Website</NavLink>
      
      <button
        onClick={handleLogout}
        className={`${isMobile ? 'w-full text-center block py-3' : 'inline-block py-2'}
           px-4 rounded-lg text-sm font-medium
           font-semibold text-white bg-accent-red shadow-md
           transition-all duration-300 ease-in-out
           hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5
           active:scale-95 active:bg-red-800`}
      >
        Logout
      </button>
    </>
  );

  return (
    <nav className="fixed top-0 w-full z-10 bg-neum-bg shadow-neum-out">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-lg font-bold text-gray-700">
          <NavLink to="/admin" className="flex items-center space-x-3">
            {logoUrl && (
              <img 
                src={logoUrl} 
                alt="Logo" 
                className="h-10 w-10 object-cover rounded-full" 
              />
            )}
            <span className="text-base font-medium">{user?.nama || 'Admin Panel'}</span>
          </NavLink>
        </div>
        
        <div className="hidden md:flex items-center space-x-2">
          <AdminNavLinks />
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 text-2xl">
            {isOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden p-4 space-y-2 bg-neum-bg shadow-neum-in">
          <AdminNavLinks isMobile />
        </div>
      )}

      <div 
        className="h-1 w-full bg-gradient-to-r from-accent-blue via-accent-red via-accent-yellow to-accent-green"
        style={{ backgroundSize: '200% 200%' }}
      />
    </nav>
  );
}

export default AdminNavbar;