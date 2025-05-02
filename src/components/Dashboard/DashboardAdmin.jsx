import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function DashboardAdmin() {
  const { currentUser, logout, getUsers, deleteUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      return;
    }
    
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
  }, [currentUser, getUsers]);

  const handleDeleteUser = async () => {
    try {
      await deleteUser(selectedUserId);
      setUsers(users.filter(user => user.id !== selectedUserId));
      setShowDeleteModal(false);
    } catch (err) {
      alert('Failed to delete user');
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/mahasantri');
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

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-xl md:text-2xl font-bold text-red-500 mb-4 flex items-center">
            <i className="ri-error-warning-line mr-2"></i>
            Unauthorized Access
          </h1>
          <p className="text-gray-600">You don't have permission to view this page.</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
          >
            <i className="ri-home-line mr-2"></i>
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Navbar */}
          <div className="hidden md:flex h-16 items-center justify-between">
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => navigate('/dashboard-admin/')}
            >
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <i className="ri-user-line"></i>
                <span className="hidden sm:inline">Welcome,</span>
                <span className="font-medium">{currentUser?.nama}</span>
              </div>
              <button 
                onClick={() => setShowLogoutModal(true)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out flex items-center"
              >
                <i className="ri-logout-box-r-line mr-2"></i>
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Navbar */}
          <div className="md:hidden flex h-16 items-center justify-between">
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => navigate('/dashboard-admin/')}
            >
              <i className="ri-dashboard-line text-lg mr-2"></i>
              <h1 className="text-lg font-bold">Admin Panel</h1>
            </div>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <i className="ri-close-line text-xl"></i>
              ) : (
                <i className="ri-menu-line text-xl"></i>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Slide from right */}
        <div className={`md:hidden fixed inset-y-0 right-0 w-64 bg-gray-800 shadow-xl transform ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
          <div className="flex flex-col h-full p-4">
            <div className="flex justify-between items-center border-b border-gray-700 pb-4">
              <div className="flex items-center">
                <i className="ri-user-line mr-2"></i>
                <span>{currentUser?.nama}</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            
            <div className="flex-1 flex flex-col justify-between py-4">
              <div>
              <Link to="/dashboard-admin/" className="block w-full text-left px-4 py-1 text-sm font-medium rounded-md hover:bg-gray-700 mb-1 flex items-center">Home 
              </Link>
                <Link 
                  to="/dashboard-admin/kehadiran-kajian" 
                  className="block w-full text-left px-4 py-1 text-sm font-medium rounded-md hover:bg-gray-700 mb-1 flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Rekap Kehadiran Kajian
                </Link>
                <Link 
                  to="/dashboard-admin/setoran" 
                  className="block w-full text-left px-4 py-1 text-sm font-medium rounded-md hover:bg-gray-700 mb-1 flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Rekap Data Setoran
                </Link>
              </div>
              
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowLogoutModal(true);
                }}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 flex items-center"
              >
                <i className="ri-logout-box-r-line mr-3"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
        
        {/* Overlay when mobile menu is open */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
        )}
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-4 md:p-6">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 mb-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center">
            <i className="ri-dashboard-line mr-3"></i>
            Admin Dashboard
          </h1>
          <p className="flex items-center">
            <i className="ri-user-smile-line mr-2"></i>
            Welcome back, {currentUser.nama || 'Admin'}!
          </p>
        </div>
        
        {/* User Management Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <i className="ri-loader-4-line animate-spin text-4xl text-blue-500"></i>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
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
          ) : (
            <>
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800 flex items-center">
                      Home
                    </h2>
                    <p className="text-gray-600 mt-1 flex items-center">
                      <i className="ri-user-line mr-1"></i>
                      {users.length} users registered
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link 
                      to="/dashboard-admin/kehadiran-kajian" 
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md hover:from-blue-600 hover:to-blue-700 transition text-center flex items-center justify-center shadow-md"
                    >
                      <i className="ri-calendar-check-line mr-2"></i>
                      Rekap Kehadiran Kajian
                    </Link>
                    <Link 
                      to="/dashboard-admin/setoran" 
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md hover:from-green-600 hover:to-green-700 transition text-center flex items-center justify-center shadow-md"
                    >
                      <i className="ri-wallet-line mr-2"></i>
                      Rekap Data Setoran
                    </Link>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Name
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registered
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">{user.nama}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className="text-sm text-gray-900">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
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
                        <td className="px-4 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            {user?.createdAt?.toDate().toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedUserId(user.id);
                              setShowDeleteModal(true);
                            }}
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
                <div className="text-center py-12 text-gray-500 flex flex-col items-center">
                  <i className="ri-user-unfollow-line text-4xl mb-4 text-gray-300"></i>
                  <p className="text-lg">No users found</p>
                  <button 
                    onClick={refreshUsers}
                    className="mt-4 text-blue-500 hover:text-blue-700 flex items-center"
                  >
                    <i className="ri-refresh-line mr-2"></i>
                    Refresh
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600">
                <i className="ri-logout-box-r-line text-xl"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Confirm Logout</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Are you sure you want to logout from admin panel?</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600">
                <i className="ri-delete-bin-line text-xl"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Are you sure you want to delete this user? This action cannot be undone.</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}