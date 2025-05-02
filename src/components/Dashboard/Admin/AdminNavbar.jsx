import { useAuth } from '../../../context/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminNavbar() {
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/mahasantri');
  };

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navbar */}
        <div className="hidden md:flex h-16 items-center justify-between">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/dashboard-admin/')}
          >
            <i className="ri-dashboard-line text-xl mr-2"></i>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <i className="ri-user-line"></i>
              <span className="hidden sm:inline">Welcome,</span>
              <span className="font-medium">{currentUser?.nama}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out flex items-center"
            >
              <i className="ri-logout-box-r-line mr-2"></i>
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Navbar */}
        <div className="md:hidden flex h-16 items-center justify-between">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/admin')}
          >
            <i className="ri-dashboard-line text-lg mr-2"></i>
            <h1 className="text-lg font-bold">Admin Panel</h1>
          </div>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
          >
            {mobileMenuOpen ? (
              <i className="ri-close-line text-xl"></i>
            ) : (
              <i className="ri-menu-line text-xl"></i>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-700 pb-3 px-4">
          <div className="pt-2 pb-3 space-y-1">
            <div className="px-3 py-2 text-sm font-medium flex items-center">
              <i className="ri-user-line mr-2"></i>
              <span>Logged in as: {currentUser?.nama}</span>
            </div>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 flex items-center"
            >
              <i className="ri-logout-box-r-line mr-2"></i>
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}