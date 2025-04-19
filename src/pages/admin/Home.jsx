import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';

function AdminHome() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Dashboard Admin</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 text-sm">{currentUser?.email}</span>
            <button
              onClick={() => navigate('/admin/setoran')}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
            >
              Kelola Setoran
            </button>
            <button
  onClick={() => navigate('/admin/kehadiran')}
  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
>
  Kelola Kehadiran
</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Selamat datang di Dashboard Admin</h2>
            <p className="text-gray-600">Anda dapat mengelola data setoran hafalan melalui menu di atas.</p>
          </div>
        </div>
      </main>
    </>
  );
}

export default AdminHome;