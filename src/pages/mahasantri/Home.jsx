import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Selamat Datang</h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Sistem Manajemen Mahasantri - Kelola data dengan mudah dan simpel tentunyaa
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <button 
          onClick={() => navigate('/login')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-4 px-6 rounded-lg shadow-md transition-colors duration-300 flex flex-col items-center"
        >
          <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 7H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 7h6m0 0v6m0-6L10 14" />
          </svg>
          Dashboard
          <span className="text-sm font-normal mt-1">Login sebagai Santri</span>
        </button>

        <button 
          onClick={() => navigate('/recap-habits')}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-6 rounded-lg shadow-md transition-colors duration-300 flex flex-col items-center"
        >
          <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Daily Habits
          <span className="text-sm font-normal mt-1">Lihat Track Habits</span>
        </button>

        <button 
          onClick={() => navigate('/recap-kehadiran')}
          className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-4 px-6 rounded-lg shadow-md transition-colors duration-300 flex flex-col items-center"
        >
          <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Recap Kajian
          <span className="text-sm font-normal mt-1">Lihat Data Kehadiran</span>
        </button>

        <button 
          onClick={() => navigate('/recap-setoran')}
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-4 px-6 rounded-lg shadow-md transition-colors duration-300 flex flex-col items-center"
        >
          <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Recap Setoran
          <span className="text-sm font-normal mt-1">Lihat Data Setoran</span>
        </button>
      </div>
    </div>
  );
}