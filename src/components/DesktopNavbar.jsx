import { NavLink } from 'react-router-dom';

const DesktopNavbar = ({ navItems, userEmail }) => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Menu Items */}
          <div className="flex space-x-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  inline-flex items-center px-3 py-2 text-sm font-medium
                  ${isActive ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'}
                `}
                end
              >
                <i className={`${item.icon} mr-2`} />
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* User Info */}
          <div className="flex items-center">
            <span className="text-sm text-gray-600 flex items-center">
              <i className="ri-user-line mr-2" />
              <span className="hidden md:inline">{userEmail}</span>
            </span>
            <button className="ml-4 px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 flex items-center text-sm">
              <i className="ri-logout-box-r-line mr-1" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DesktopNavbar;