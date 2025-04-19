import { Link, useLocation } from 'react-router-dom';
import Logo from '/logo.png';

const BottomNavbar = () => {
  const location = useLocation();

  const navItems = [
    { 
      path: '/', 
      icon: 'ri-home-3-line', 
      activeIcon: 'ri-home-3-fill', 
      label: 'Home',
      exact: true
    },
    { 
      path: '/kehadiran', 
      icon: 'ri-book-2-line', 
      activeIcon: 'ri-book-2-fill', 
      label: 'Kajian'
    },
    { 
      path: '/setoran', 
      icon: 'ri-speak-ai-line', 
      activeIcon: 'ri-speak-ai-fill', 
      label: 'Setoran'
    },
    { 
      path: '#', 
      icon: 'ri-play-circle-line', 
      activeIcon: 'ri-play-circle-fill', 
      label: 'DOkumentasi'
    },
    { 
      path: '#', 
      icon: 'ri-apps-line', 
      activeIcon: 'ri-apps-fill', 
      label: 'More',
      activePaths: ['/more', '/tes', '/paid-promote', '/xixi']
    }
  ];

  return (
    <>
      {/* Compact Fixed Top Header */}
<div className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100 py-3">
  <div className="flex justify-between items-center px-6">
  <img src={Logo} alt="AnakProgram Logo" className="h-7" />
    <button className="text-sm font-medium text-gray-500"><i class="ri-login-box-line text-[20px]"></i></button>
  </div>
</div>

      {/* Bottom Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
        <div className="flex justify-around items-stretch py-1">
          {navItems.map((item) => {
            let isActive = false;

            if (item.exact) {
              isActive = location.pathname === item.path;
            } else if (item.activePaths && item.activePaths.length > 0) {
              isActive = item.activePaths.some((path) => location.pathname.startsWith(path));
            } else {
              isActive = location.pathname.startsWith(item.path);
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex-1 flex flex-col items-center justify-center p-1 transition-colors ${
                  isActive ? 'text-black' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className={`text-lg ${isActive ? item.activeIcon : item.icon}`}></i>
                <span className="text-[10px] leading-tight mt-0.5">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default BottomNavbar;
