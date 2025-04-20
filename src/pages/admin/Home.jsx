import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import MobileSidebar from '../../components/MobileSidebar';
import DesktopNavbar from '../../components/DesktopNavbar';

const AdminLayout = () => {
  const [isMobileView, setIsMobileView] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { currentUser } = useAuth();
  const location = useLocation();

  // Cek viewport saat resize
  useEffect(() => {
    const checkViewport = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Tutup sidebar saat navigasi di mobile
  useEffect(() => {
    if (isMobileView) {
      setMobileSidebarOpen(false);
    }
  }, [location, isMobileView]);

  const navItems = [
    { path: '/admin', icon: 'ri-dashboard-line', label: 'Dashboard' },
    { path: '/admin/setoran', icon: 'ri-book-line', label: 'Setoran' },
    { path: '/admin/kehadiran', icon: 'ri-calendar-check-line', label: 'Kehadiran' },
    { path: '/admin/profile', icon: 'ri-user-line', label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tampilan Mobile - Sidebar */}
      {isMobileView && (
        <MobileSidebar 
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
          navItems={navItems}
          userEmail={currentUser?.email}
        />
      )}

      {/* Tampilan Desktop - Navbar */}
      {!isMobileView && (
        <DesktopNavbar 
          navItems={navItems}
          userEmail={currentUser?.email}
        />
      )}

      {/* Header dengan Hamburger (Mobile) */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center">
          {isMobileView && (
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="mr-3 p-1 rounded-md text-gray-600 hover:bg-gray-100"
              aria-label="Open menu"
            >
              <i className="ri-menu-fold-4-line text-xl" />
            </button>
          )}
          <h1 className="text-lg font-semibold text-gray-800">
            {navItems.find(item => location.pathname === item.path)?.label || 'Dashboard'}
          </h1>
        </div>
      </header>

      {/* Konten Utama */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;