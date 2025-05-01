import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RegisterForm from '../components/Auth/RegisterForm';

export default function Register() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (nama, email, password) => {
    try {
      setLoading(true);
      setError('');
      await register(nama, email, password);
      navigate('/login');
    } catch {
      setError('Failed to register. Email might already be in use.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Register Santri</h1>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        <RegisterForm onSubmit={handleRegister} loading={loading} />
        <p className="mt-4 text-center">
          Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login here</a>
        </p>
      </div>
    </div>
  );
}