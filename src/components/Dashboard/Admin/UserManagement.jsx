import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function UserManagement() {
  const { getUsers, deleteUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersList = await getUsers();
      setUsers(usersList);
      setLoading(false);
    };
    fetchUsers();
  }, [getUsers]);

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="mt-6 text-gray-800">
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>
      <h2 className='text-2xl'><a href="/dashboard-admin/kehadiran-kajian">Data Kehadiran</a></h2>
      <h2 className='text-2xl'><a href="/dashboard-admin/setoran">Data Setoran</a></h2>
      <br/>
      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            checked={showPasswords} 
            onChange={() => setShowPasswords(!showPasswords)} 
            className="rounded"
          />
          <span>Show Passwords</span>
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Nama</th>
              <th className="py-2 px-4 border">Email</th>
              {showPasswords && <th className="py-2 px-4 border">Password</th>}
              <th className="py-2 px-4 border">Role</th>
              <th className="py-2 px-4 border">Tanggal Daftar</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{user.nama}</td>
                <td className="py-2 px-4 border">{user.email}</td>
                {showPasswords && (
                  <td className="py-2 px-4 border">
                    {user.password_plain || 'No password stored'}
                  </td>
                )}
                <td className="py-2 px-4 border">{user.role}</td>
                <td className="py-2 px-4 border">
                  {user?.createdAt?.toDate().toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}