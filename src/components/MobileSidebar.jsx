import { NavLink } from 'react-router-dom';

const MobileSidebar = ({ isOpen, onClose, navItems, userEmail }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-30
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 border-b flex justify-between text-gray-800 items-center">
          <h2 className="text-lg font-semibold ">Main Menu</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <i className="ri-close-line text-xl" />
          </button>
        </div>

        <nav className="p-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center px-4 py-3 rounded-md
                    ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}
                  `}
                  end
                >
                  <i className={`${item.icon} mr-3`} />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="text-sm text-gray-600 mb-3 flex items-center">
            <i className="ri-user-line mr-2" />
            <span className="truncate">{userEmail}</span>
          </div>
          <button className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 flex items-center">
            <i className="ri-logout-box-r-line mr-2" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default MobileSidebar;