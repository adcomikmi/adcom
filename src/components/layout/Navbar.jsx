// src/components/layout/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { HiMenu, HiX } from 'react-icons/hi';
import { getHomeConfig } from '../../services/api';

function Navbar() {
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
  const activeLinkStyle = "shadow-neum-in text-accent-blue";
  const inactiveLinkStyle = "hover:shadow-neum-out-hover";

  const getLinkClass = ({ isActive }) => 
    `${linkStyle} ${isActive ? activeLinkStyle : inactiveLinkStyle}`;
  
  const NavLinks = ({ isMobile = false }) => (
    <>
      <NavLink to="/" className={getLinkClass} onClick={() => setIsOpen(false)}>Home</NavLink>
      <NavLink to="/materi" className={getLinkClass} onClick={() => setIsOpen(false)}>Materi</NavLink>
      <NavLink to="/diskusi" className={getLinkClass} onClick={() => setIsOpen(false)}>Diskusi</NavLink>
      <NavLink to="/saran" className={getLinkClass} onClick={() => setIsOpen(false)}>Saran</NavLink>
      <NavLink to="/tentang" className={getLinkClass} onClick={() => setIsOpen(false)}>Tentang</NavLink>
      
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

  const PublicLinks = ({ isMobile = false }) => (
    <>
      <NavLink to="/" className={getLinkClass} onClick={() => setIsOpen(false)}>Home</NavLink>
      <NavLink to="/materi" className={getLinkClass} onClick={() => setIsOpen(false)}>Materi</NavLink>
      <NavLink to="/tentang" className={getLinkClass} onClick={() => setIsOpen(false)}>Tentang</NavLink>

      <NavLink
        to="/login"
        className={`${isMobile ? 'w-full text-center block py-3' : 'inline-block py-2'}
           px-4 rounded-lg text-sm font-medium
           font-semibold text-white bg-accent-blue shadow-md
           transition-all duration-300 ease-in-out
           hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5
           active:scale-95 active:bg-blue-800`}
        onClick={() => setIsOpen(false)}
      >
        Login
      </NavLink>
    </>
  );

  return (
    <nav className="fixed top-0 w-full z-10 bg-neum-bg shadow-neum-out">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-lg font-bold text-accent-blue">
          <NavLink to="/" className="flex items-center space-x-3">
            {logoUrl && (
              <img 
                src={logoUrl} 
                alt="Logo" 
                className="h-10 w-10 object-cover rounded-full" 
              />
            )}
            <span>ADCOM IKMI</span>
          </NavLink>
        </div>
        
        <div className="hidden md:flex items-center space-x-2">
          {user ? <NavLinks /> : <PublicLinks />}
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 text-2xl">
            {isOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden p-4 space-y-2 bg-neum-bg shadow-neum-in">
          {user ? <NavLinks isMobile /> : <PublicLinks isMobile />}
        </div>
      )}

      <div 
        className="h-1 w-full bg-gradient-to-r from-accent-blue via-accent-red via-accent-yellow to-accent-green"
        style={{ backgroundSize: '200% 200%' }}
      />
    </nav>
  );
}

export default Navbar;