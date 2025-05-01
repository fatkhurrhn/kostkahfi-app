import { useAuth } from '../../../context/AuthContext';

export default function AdminNavbar() {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span>Hello, {currentUser?.nama}</span>
          <button 
            onClick={logout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}