import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Ahlan Wa Sahlan Fi</h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Sistem Manajemen Kost Kahfi - Kelola data dengan mudah dan simpel tentunyaa
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
          <span className="text-sm font-normal mt-1">Login sebagai Admin</span>
        </button>
      </div>
    </div>
  );
}