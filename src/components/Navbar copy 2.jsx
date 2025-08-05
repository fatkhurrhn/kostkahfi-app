import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showLang, setShowLang] = useState(false);

  const toggleDropdown = (section) => {
    setOpenDropdown(openDropdown === section ? null : section);
  };

  const navItems = [
    { path: "/about-us", label: "About Us" },
    {
      label: "Rooms & Facilities",
      subItems: [
        { path: "/rooms-list", label: "Rooms List" },
        { path: "/facilities", label: "Facilities" },
        { path: "/gallery", label: "Gallery" }
      ]
    },
    {
      label: "Programs",
      subItems: [
        { path: "/program/mahasantri", label: "Mahasantri" },
        { path: "/program/biman", label: "Biman" }
      ]
    },
    { path: "/cavelatte", label: "Cavelatte" },
    { path: "/blogs", label: "Blogs" },
    { path: "/contact", label: "Contact" }
  ];

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="text-xl font-bold text-[#eb6807]">
              kostAlKahfi
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                item.subItems ? (
                  <div key={item.label} className="relative group">
                    <button
                      className="flex items-center space-x-1 text-gray-700 hover:text-[#eb6807] transition-colors"
                      onClick={() => toggleDropdown(item.label)}
                    >
                      <span>{item.label}</span>
                      <i className={`ri-arrow-${openDropdown === item.label ? 'up' : 'down'}-s-line`}></i>
                    </button>
                    {openDropdown === item.label && (
                      <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="text-gray-700 hover:text-[#eb6807] transition-colors"
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
            <div className="relative ml-4">
              <button
                onClick={() => setShowLang(!showLang)}
                className="border border-gray-300 text-sm px-4 py-2 rounded-lg bg-white hover:bg-gray-100 transition"
              >
                ID
              </button>
              {showLang && (
                <div className="absolute right-0 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <button
                    onClick={() => {
                      // set language to EN (custom logic)
                      setShowLang(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    EN
                  </button>
                </div>
              )}
            </div>
              <Link
                to="/sign-in"
                className="hidden md:block bg-[#eb6807] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#d45e06] transition-colors"
              >
                Sign In
              </Link>

              <button
                className="md:hidden text-gray-700 p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <i className={`ri-${isMobileMenuOpen ? 'close' : 'menu'}-line text-xl`}></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-[60] transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="p-4 border-b border-gray-200">
          <Link to="/" className="text-xl font-bold text-[#eb6807]">
            kostAlKahfi
          </Link>
        </div>

        <div className="p-4">
          {navItems.map((item) => (
            <div key={item.label} className="mb-2">
              {item.subItems ? (
                <>
                  <button
                    className="flex items-center justify-between w-full p-2 text-left text-gray-700 hover:text-[#eb6807]"
                    onClick={() => toggleDropdown(item.label)}
                  >
                    <span>{item.label}</span>
                    <i className={`ri-arrow-${openDropdown === item.label ? 'up' : 'down'}-s-line`}></i>
                  </button>
                  {openDropdown === item.label && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className="block p-2 text-sm text-gray-600 hover:text-[#eb6807] hover:bg-gray-50 rounded"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className="block p-2 text-gray-700 hover:text-[#eb6807] hover:bg-gray-50 rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            {/* sign in Button mobile */}
            <Link
              to="/sign-in"
              className="text-center bg-[#eb6807] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#d45e06] transition-colors w-full md:w-auto"
            >
              Sign In
            </Link>
           
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="pt-16 pb-4">{children}</main>
    </>
  );
};

export default Navbar;