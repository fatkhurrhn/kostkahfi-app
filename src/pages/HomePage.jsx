import { Link } from 'react-router-dom';
import BottomNavbar from '../components/BottomNavbar';

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <BottomNavbar />
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <h1 className="text-3xl text-gray-800 font-bold mb-6">Selamat Datang</h1>
        <p className="mb-6 text-gray-600">Sistem informasi Pondok Kost Al-Kahfi Depok</p>
        
        <Link 
            to="/login" 
            className="block w-full px-3 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Login Admin
          </Link>
      </div>
    </div>
  );
}

export default HomePage;