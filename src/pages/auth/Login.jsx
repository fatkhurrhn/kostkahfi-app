// src/pages/auth/Login.jsx
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const auth = getAuth(app);
      const db = getFirestore(app);

      // Sign in user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Get user role from Firestore
      const q = query(
        collection(db, 'users'),
        where('uid', '==', userCredential.user.uid)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        const userRole = userData.role;

        // Redirect based on role
        if (userRole === 'admin') {
          navigate('/dashboard-admin');
        } else {
          navigate('/dashboard-users');
        }
      } else {
        setError('User data not found');
      }
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace('auth/', '').replace(/-/g, ' '));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <Link to="/">
          <div className="mx-auto w-20 h-20 bg-[#eb6807]/10 rounded-full flex items-center justify-center mb-4">
            <i className="ri-login-box-line text-3xl text-[#eb6807]"></i>
          </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-start">
            <i className="ri-error-warning-line mr-2 mt-0.5"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="ri-mail-line text-gray-400"></i>
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50 placeholder-gray-400 transition duration-200"
                placeholder="emailyou@kahfi.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-[#eb6807] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="ri-lock-line text-gray-400"></i>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50 placeholder-gray-400 transition duration-200"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#eb6807] hover:bg-[#d45e06] text-white font-medium rounded-lg shadow-md transition duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#eb6807]/50 focus:ring-offset-2"
          >
            {loading ? (
              <>
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                Signing in...
              </>
            ) : (
              <>
                <i className="ri-login-box-line mr-2"></i>
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-[#eb6807] hover:text-[#d45e06] hover:underline">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}