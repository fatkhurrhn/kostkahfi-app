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

      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-6">
        <button
          onClick={() => navigate('/mahasantri/')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-4 px-6 rounded-lg shadow-md transition-colors duration-300 w-64 text-center"
        >
          Program Mahasantrii
        </button>

        <button
          onClick={() => navigate('#')}
          className="bg-orange-400 cursor-not-allowed text-white font-medium py-4 px-6 rounded-lg shadow-md transition-colors duration-300 w-64 text-center"
          disabled
        >
          Program BIMAN (Coming Soon)
        </button>

        <button
          onClick={() => navigate('#')}
          className="bg-green-400 cursor-not-allowed text-white font-medium py-4 px-6 rounded-lg shadow-md transition-colors duration-300 w-64 text-center"
          disabled
        >
          Cavelatte (Coming Soon)
        </button>
      </div>

    </div>
  );
}