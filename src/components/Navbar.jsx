import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavCreator = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/', icon: 'ri-code-s-slash-line', activeIcon: 'ri-code-s-slash-fill', label: 'Fasilitas'},
    { path: '/', icon: 'ri-folders-line', activeIcon: 'ri-folders-fill', label: 'Gallery' },
    { path: '/blog', icon: 'ri-news-line', activeIcon: 'ri-news-fill', label: 'Blogs', isNew: true },
    { path: '/', icon: 'ri-apps-line', activeIcon: 'ri-apps-fill', label: 'Others', isNew: true },
  ];

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto max-w-7xl px-3 py-2">
          <div className="flex items-center justify-between">
            {/* Desktop Logo */}
            <Link to="/" className="hidden md:flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-800">kostKahfi</span>
            </Link>

            {/* Mobile Menu Icon */}
            <button
              className="md:hidden text-gray-800 p-2 rounded-lg hover:bg-gray-100"
              onClick={toggleSidebar}
            >
              <i className="ri-menu-2-line text-xl"></i>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item, index) => (
                <div key={index} className="relative">
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

            {/* Cavelatte Button */}
            <Link
              to="/cavelatte"
              className="text-gray-800 font-medium rounded-lg text-sm px-4 py-2 bg-white border border-gray-200 hover:bg-gray-100"
            >
              Cavelatte
            </Link>
          </div>
        </div>
      </nav>

      {/* Sidebar Mobile */}
      <div className={`fixed inset-0 z-40 md:hidden transition duration-300 ${isSidebarOpen ? 'block' : 'hidden'}`}>
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black bg-opacity-30"
          onClick={closeSidebar}
        ></div>

        {/* Sidebar Panel */}
        <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4 flex items-center justify-between border-b">
            <span className="text-lg font-semibold">Menu</span>
            <button onClick={closeSidebar}>
              <i className="ri-close-line text-xl text-gray-600"></i>
            </button>
          </div>
          <nav className="flex flex-col p-4 space-y-3">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={closeSidebar}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  location.pathname === item.path
                    ? 'bg-gray-100 text-gray-900 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <i className={`${location.pathname === item.path ? item.activeIcon : item.icon} text-lg`}></i>
                <span>{item.label}</span>
              </Link>
            ))}

            <Link
              to="/cavelatte"
              onClick={closeSidebar}
              className="mt-4 text-center text-gray-800 font-medium rounded-lg text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200"
            >
              Cavelatte
            </Link>
          </nav>
        </div>
      </div>

      {/* Konten halaman */}
      <main className="pb-[64px] pt-[64px]">{children}</main>
    </>
  );
};

export default NavCreator;
