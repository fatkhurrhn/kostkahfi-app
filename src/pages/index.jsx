import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Selamat Datang</h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Sistem Manajemen Kost - Kelola data penyewa dan pembayaran dengan mudah
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {/* Admin Kost Button */}
        <button 
          onClick={() => navigate('/kost/login')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-4 px-6 rounded-lg shadow-md transition-colors duration-300 flex flex-col items-center"
        >
          <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 7H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 7h6m0 0v6m0-6L10 14" />
          </svg>
          Admin Kost
          <span className="text-sm font-normal mt-1">Login sebagai admin</span>
        </button>

        {/* Data Penyewa Button */}
        <button 
          onClick={() => navigate('/penyewa')}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-6 rounded-lg shadow-md transition-colors duration-300 flex flex-col items-center"
        >
          <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Data Penyewa
          <span className="text-sm font-normal mt-1">Lihat daftar penyewa</span>
        </button>

        {/* Pembayaran Button */}
        <button 
          onClick={() => navigate('/pembayaran')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg shadow-md transition-colors duration-300 flex flex-col items-center"
        >
          <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Pembayaran
          <span className="text-sm font-normal mt-1">Cek status pembayaran</span>
        </button>
      </div>
    </div>
  );
}