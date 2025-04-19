import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6">Selamat Datang</h1>
        <p className="mb-6">Sistem Pendataan Setoran Hafalan Al-Qur'an</p>
        
        <div className="space-y-4">
          <Link 
            to="/login" 
            className="block w-full px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Login Admin
          </Link>
          <Link 
            to="/setoran" 
            className="block w-full px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Lihat Daftar Setoran
          </Link>
          <Link 
            to="/kehadiran" 
            className="block w-full px-6 py-3 bg-red-500 text-white rounded hover:bg-green-600 transition"
          >
            Lihat Daftar kehadiran
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;