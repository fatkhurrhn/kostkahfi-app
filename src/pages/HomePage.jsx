import { Link } from 'react-router-dom';
import BottomNavbar from '../components/BottomNavbar';
import Logo from '/logo.png';


function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <BottomNavbar />
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        {/* Compact Fixed Top Header */}
        <div className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100 py-3">
          <div className="w-full mx-auto px-6 flex justify-between items-center">
            <img src={Logo} alt="AnakProgram Logo" className="h-8" />
            <button className="text-sm font-medium text-gray-500">
              <i className="ri-login-box-line text-[20px]"></i>
            </button>
          </div>
        </div>
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