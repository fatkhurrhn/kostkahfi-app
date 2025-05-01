import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function UserManagement() {
  const { getUsers, deleteUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersList = await getUsers();
        setUsers(usersList);
      } catch (err) {
        setError('Failed to load users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [getUsers]);

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        alert('Failed to delete user');
        console.error(err);
      }
    }
  };

  const refreshUsers = async () => {
    try {
      setLoading(true);
      const usersList = await getUsers();
      setUsers(usersList);
    } catch (err) {
      setError('Failed to refresh users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <i className="ri-loader-4-line animate-spin text-4xl text-blue-500"></i>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <i className="ri-error-warning-line text-red-500 text-xl"></i>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <button 
              onClick={refreshUsers}
              className="mt-2 text-sm text-red-700 underline hover:text-red-600 flex items-center"
            >
              <i className="ri-refresh-line mr-1"></i>
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <i className="ri-user-settings-line mr-2"></i>
            User Management
          </h2>
          <p className="text-gray-600 mt-1 flex items-center">
            <i className="ri-user-line mr-1"></i>
            {users.length} users registered
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Link 
            to="/dashboard-admin/kehadiran-kajian" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-center flex items-center justify-center"
          >
            <i className="ri-calendar-check-line mr-2"></i>
            Rekap Kehadiran Kajian
          </Link>
          <Link 
            to="/dashboard-admin/setoran" 
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-center flex items-center justify-center"
          >
            <i className="ri-wallet-line mr-2"></i>
            Rekap Data Setoran
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center">
            <button
              onClick={refreshUsers}
              className="p-2 rounded-full hover:bg-gray-100 mr-2 flex items-center"
              title="Refresh"
            >
              <i className="ri-refresh-line text-gray-600"></i>
            </button>
            <label className="flex items-center space-x-2 cursor-pointer">
              {showPasswords ? (
                <i className="ri-eye-off-line text-gray-600"></i>
              ) : (
                <i className="ri-eye-line text-gray-600"></i>
              )}
              <span className="text-sm">Show Passwords</span>
              <input 
                type="checkbox" 
                checked={showPasswords} 
                onChange={() => setShowPasswords(!showPasswords)} 
                className="sr-only"
              />
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <i className="ri-user-line mr-1"></i> Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <i className="ri-mail-line mr-1"></i> Email
                </th>
                {showPasswords && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <i className="ri-key-line mr-1"></i> Password
                  </th>
                )}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <i className="ri-admin-line mr-1"></i> Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <i className="ri-calendar-line mr-1"></i> Registration Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <i className="ri-settings-2-line mr-1"></i> Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <i className="ri-user-3-line mr-2 text-gray-400"></i>
                      <div className="text-sm font-medium text-gray-900">{user.nama}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <i className="ri-mail-line mr-2 text-gray-400"></i>
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </div>
                  </td>
                  {showPasswords && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <i className="ri-key-line mr-2 text-gray-400"></i>
                        <div className="text-sm text-gray-500 font-mono">
                          {user.password_plain || '••••••••'}
                        </div>
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role === 'admin' ? (
                        <i className="ri-shield-star-line mr-1"></i>
                      ) : (
                        <i className="ri-user-line mr-1"></i>
                      )}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <i className="ri-calendar-line mr-2"></i>
                      {user?.createdAt?.toDate().toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-900 flex items-center justify-end space-x-1 w-full"
                    >
                      <i className="ri-delete-bin-line"></i>
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-8 text-gray-500 flex flex-col items-center">
            <i className="ri-user-unfollow-line text-4xl mb-2"></i>
            No users found
          </div>
        )}
      </div>
    </div>
  );
}