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
      path: '/gallery', 
      icon: 'ri-image-ai-line', 
      activeIcon: 'ri-image-ai-fill', 
      label: 'Gallery'
    },
    { 
      path: '/program', 
      icon: 'ri-calendar-event-line', 
      activeIcon: 'ri-group-fill', 
      label: 'Program'
    },
    { 
      path: '/cavelatte', 
      icon: 'ri-cup-line', 
      activeIcon: 'ri-cup-fill', 
      label: 'Caveltte'
    },
    { 
      path: '/more', 
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
        <div className="w-full mx-auto px-6 flex justify-between items-center">
          <img src={Logo} alt="AnakProgram Logo" className="h-8" />
          <button className="text-sm font-medium text-gray-500">
            <i className="ri-login-box-line text-[20px]"></i>
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
        <div className="w-full mx-auto flex justify-around items-stretch py-1">
          {navItems.map((item) => {
            let isActive = false;

            if (item.exact) {
              isActive = location.pathname === item.path;
            } else if (item.activePaths) {
              isActive = item.activePaths.includes(location.pathname);
            } else {
              isActive = location.pathname.startsWith(item.path);
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center text-xs font-medium text-gray-500 px-2 py-1 ${
                  isActive ? 'text-emerald-600' : ''
                }`}
              >
                <i className={`${isActive ? item.activeIcon : item.icon} text-xl`}></i>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default BottomNavbar;
