import { useAuth } from '../context/AuthContext';
import AdminNavbar from '../components/Dashboard/Admin/AdminNavbar';
import UserManagement from '../components/Dashboard/Admin/UserManagement';

export default function DashboardAdmin() {
  const { currentUser } = useAuth();

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-xl md:text-2xl font-bold text-red-500 mb-4">Unauthorized Access</h1>
          <p className="text-gray-600">You don't have permission to view this page.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="container mx-auto p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {currentUser.name || 'Admin'}!</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <UserManagement />
        </div>
      </div>
    </div>
  );
}