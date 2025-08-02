import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavCreator = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: 'ri-code-s-slash-line', activeIcon: 'ri-code-s-slash-fill', label: 'Fasilitas'},
    { path: '/', icon: 'ri-folders-line', activeIcon: 'ri-folders-fill', label: 'Gallery' },
    { path: '/blog', icon: 'ri-news-line', activeIcon: 'ri-news-fill', label: 'Blogs', isNew: true },
    { path: '/', icon: 'ri-apps-line', activeIcon: 'ri-apps-fill', label: 'Others', isNew: true },
  ];

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto max-w-7xl px-3 py-2">
          <div className="flex items-center justify-between">
            {/* Desktop Logo - Hidden di Mobile */}
            <Link to="/" className="hidden md:flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-800">kostKahfi</span>
            </Link>

            {/* Mobile Menu Icon - Kiri */}
            <button className="md:hidden text-gray-800 p-2 rounded-lg hover:bg-gray-100">
              <i className="ri-menu-2-line text-xl"></i>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <div key={item.path} className="relative">
                  <Link
                    to={item.path}
                    className={`text-black hover:text-gray-600 transition-colors font-medium ${
                      location.pathname === item.path ? 'text-gray-600 font-semibold' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>

            {/* Cavelatte Button - Kanan (Mobile & Desktop) */}
            <Link
              to="/cavelatte"
              className="text-gray-800 font-medium rounded-lg text-sm px-4 py-2 bg-white border border-gray-200 hover:bg-gray-100"
            >
              Cavelatte
            </Link>
          </div>
        </div>
      </nav>

      {/* Konten halaman dengan padding biar ga ketiban */}
      <main className="pb-[64px]">{children}</main>
    </>
  );
};

export default NavCreator;