import { Link, useLocation } from 'react-router-dom';

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
      activeIcon: 'ri-calendar-event-fill', 
      label: 'Program',
      activePaths: ['/program',
                    '/program/mahasantri', '/program/mahasantri/setoran', '/program/mahasantri/kehadiran',
                    '/program/biman', '/program/biman/kehadiran', '/program/biman/setoran']

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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 z-50">
        <div className="w-full mx-auto flex justify-around items-stretch py-1">
          {navItems.map((item, index) => {
            let isActive = false;

            if (item.exact) {
              isActive = location.pathname === item.path;
            } else if (item.activePaths) {
              isActive = item.activePaths.includes(location.pathname);
            } else {
              isActive = location.pathname.startsWith(item.path);
            }

            return (
              <Link key={index} to={item.path} className="flex flex-col items-center justify-center text-xs px-1">
                <i
                  className={`${isActive ? item.activeIcon + ' text-blue-600' : item.icon + ' text-gray-500'} text-xl`}
                ></i>
                <span className={`${isActive ? 'text-blue-600' : 'text-gray-500'} text-[10px]`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default BottomNavbar;
