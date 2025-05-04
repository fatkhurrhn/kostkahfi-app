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

      <div className="">
        <button 
          onClick={() => navigate('/login')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-4 px-6 rounded-lg shadow-md transition-colors duration-300 flex flex-col items-center"
        >
          Program Mahasantri
        </button>
      </div>
    </div>
  );
}