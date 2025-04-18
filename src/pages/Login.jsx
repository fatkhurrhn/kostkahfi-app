import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword } from './firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin'); // Redirect ke halaman admin setelah login berhasil
    } catch (err) {
      console.error("Login error:", err);
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menerjemahkan kode error Firebase
  const getErrorMessage = (code) => {
    switch (code) {
      case 'auth/invalid-email':
        return 'Email tidak valid';
      case 'auth/user-disabled':
        return 'Akun ini dinonaktifkan';
      case 'auth/user-not-found':
        return 'Akun tidak ditemukan';
      case 'auth/wrong-password':
        return 'Password salah';
      case 'auth/too-many-requests':
        return 'Terlalu banyak percobaan gagal. Coba lagi nanti';
      default:
        return 'Gagal login. Silakan coba lagi';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <i class="ri-admin-line text-5xl text-blue-500 mb-2"></i>
          <h1 className="text-2xl font-bold">Login Admin</h1>
          <p className="text-gray-600">Masukkan email dan password untuk melanjutkan</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center ${
              loading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <i class="ri-loader-4-line animate-spin mr-2"></i> Memproses...
              </>
            ) : (
              <>
                <i class="ri-login-box-line mr-2"></i> Masuk
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;