import { useAuth } from '../context/AuthContext';
import AdminNavbar from '../components/Dashboard/Admin/AdminNavbar';
import UserManagement from '../components/Dashboard/Admin/UserManagement';

export default function DashboardAdmin() {
  const { currentUser } = useAuth();

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-md">
          <h1 className="text-2xl font-bold text-red-500">Unauthorized Access</h1>
          <p>You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <UserManagement />
      </div>
    </div>
  );
}