import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavCreator = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (section) => {
    setOpenDropdown(openDropdown === section ? null : section);
  };

  const navItems = [
    { path: '/', icon: 'ri-code-s-slash-line', activeIcon: 'ri-code-s-slash-fill', label: 'Fasilitas' },
    { path: '/', icon: 'ri-folders-line', activeIcon: 'ri-folders-fill', label: 'Gallery' },
    { path: '/blog', icon: 'ri-news-line', activeIcon: 'ri-news-fill', label: 'Blogs', isNew: true },
    { path: '/', icon: 'ri-apps-line', activeIcon: 'ri-apps-fill', label: 'Others', isNew: true },
  ];

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto max-w-7xl px-3 py-1">
          <div className="flex items-center justify-between">
            {/* Desktop Logo */}
            <Link to="/" className="hidden md:flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-800">kostKahfi</span>
            </Link>

            {/* Mobile Menu Icon */}
            <button
              className="md:hidden text-gray-800 p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setIsSidebarOpen(true)}
            >
              <i className="ri-menu-2-line text-xl"></i>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <div key={item.label} className="relative">
                  <Link
                    to={item.path}
                    className={`text-black hover:text-gray-600 transition-colors font-medium ${location.pathname === item.path ? 'text-gray-600 font-semibold' : ''
                      }`}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>

            {/* Cavelatte Button */}
            <Link
              to="/contact"
              className="text-gray-800 font-medium rounded-lg text-sm px-4 py-2 bg-white border border-gray-200 hover:bg-gray-100"
            >
              Hubungi
            </Link>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-[60]"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar (Mobile) */}
      <div
        className={`fixed top-0 left-0 h-full w-2/4 bg-white text-gray-800 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out z-[70] px-6`}
      >        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Kost Kahfi</h3>
          <button onClick={() => setIsSidebarOpen(false)} className="text-2xl">
            <i className="ri-close-line"></i>
          </button>
        </div>

        {/* Sidebar Menu */}
        <ul className="pt-8 ml-[-7px] mt-6 space-y-2">
          <li>
            <Link to="/" className="block hover:text-blue-400">Home</Link>
          </li>
          <li>
            <button onClick={() => toggleDropdown("frontend")} className="flex items-center hover:text-blue-400 w-full">
              <i className={`${openDropdown === "frontend" ? "ri-arrow-down-s-line mr-2" : "ri-arrow-right-s-line mr-1"}`}></i>
              Frontdev
            </button>
            {openDropdown === "frontend" && (
              <ul className="mt-2 ml-4 space-y-2 border-l-2 border-gray-600 pl-4">
                <li><Link to="/projects" className="block hover:text-blue-400">Projects</Link></li>
                <li><Link to="/certificates" className="block hover:text-blue-400">Certificates</Link></li>
                <li><Link to="/blogs" className="block hover:text-blue-400">Blogs</Link></li>
              </ul>
            )}
          </li>
          <li>
            <Link to="/storythur" className="block hover:text-blue-400">Creator</Link>
          </li>
          <li>
            <button
              onClick={() => toggleDropdown("islamic")}
              className="flex items-center hover:text-blue-400 w-full"
            >
              <i className={`${openDropdown === "islamic" ? "ri-arrow-down-s-line mr-2" : "ri-arrow-right-s-line mr-1"}`}></i>
              Islamic
            </button>
            {openDropdown === "islamic" && (
              <ul className="mt-2 ml-4 space-y-2 border-l-2 border-gray-600 pl-4">
                <li><Link to="/#" className="block hover:text-blue-400">#</Link></li>
                <li><Link to="/#" className="block hover:text-blue-400">#</Link></li>
                <li><Link to="/#" className="block hover:text-blue-400">#</Link></li>
              </ul>
            )}
          </li>
        </ul>

        {/* Footer */}
        <div className="absolute bottom-12 left-6 right-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Follow for more</h3>
        </div>

        {/* Social Icons */}
        <div className="absolute bottom-5 left-0 w-full flex justify-center gap-4">
          <Link to="https://youtube.com/fatkhurrhnn" target="_blank" rel="noopener noreferrer">
            <i className="ri-youtube-fill text-xl text-gray-800 hover:text-red-600 transition-all"></i>
          </Link>
          <Link to="https://linkedin.com/fatkhurrhn" target="_blank" rel="noopener noreferrer">
            <i className="ri-linkedin-box-fill text-xl text-gray-800 hover:text-blue-600 transition-all"></i>
          </Link>
          <Link to="https://tiktok.com/fatkhurrhnn" target="_blank" rel="noopener noreferrer">
            <i className="ri-tiktok-fill text-xl text-gray-800 hover:text-black transition-all"></i>
          </Link>
          <Link to="https://instagram.com/fatkhurrhn" target="_blank" rel="noopener noreferrer">
            <i className="ri-instagram-fill text-xl text-gray-800 hover:text-pink-500 transition-all"></i>
          </Link>
        </div>
      </div>

      {/* Content Wrapper */}
      <main className="pb-1">{children}</main>
    </>
  );
};

export default NavCreator;
