import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginForm from '../../components/Auth/LoginForm';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      setError('');
      const user = await login(email, password);
      
      if (user.role === 'admin') {
        navigate('/dashboard-admin');
      } else {
        navigate('/dashboard-santri');
      }
    } catch {
      setError('Failed to login. Check your email and password.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h1>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        <LoginForm onSubmit={handleLogin} loading={loading} />
        <p className="mt-4 text-center text-gray-800">
          Don't have an account? <a href="/mahasantri/register" className="text-blue-500 hover:underline">Register here</a>
        </p>
      </div>
    </div>
  );
}