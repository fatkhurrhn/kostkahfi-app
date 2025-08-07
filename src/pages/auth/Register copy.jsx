// src/pages/auth/Register.jsx
import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { app } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    nama: '',
    noTlp: '',
    email: '',
    password: '',
    tglMasuk: '',
    role: 'reguler',
    jenKel: ''
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

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await addDoc(collection(db, 'users'), {
        nama: formData.nama,
        jenKel: formData.jenKel,
        noTlp: formData.noTlp,
        email: formData.email,
        tglMasuk: Timestamp.fromDate(new Date(formData.tglMasuk)),
        role: formData.role,
        uid: userCredential.user.uid
      });

      // Redirect based on role
      if (formData.role === 'admin') {
        navigate('/dashboard-admin');
      } else {
        navigate('/dashboard-users');
      }
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace('auth/', '').replace(/-/g, ' '));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-4xl border border-gray-100">
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-[#eb6807]/10 rounded-full flex items-center justify-center mb-4">
            <i className="ri-user-add-line text-3xl text-[#eb6807]"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500 mt-2">Fill in your details to register</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-start">
            <i className="ri-error-warning-line mr-2 mt-0.5"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Column 1 */}
            <div className="space-y-5">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700" htmlFor="nama">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="ri-user-line text-gray-400"></i>
                  </div>
                  <input
                    type="text"
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50   placeholder-gray-400 transition duration-200"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700" htmlFor="jenKel">
                  Gender
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="ri-user-2-line text-gray-400"></i>
                  </div>
                  <select
                    id="jenKel"
                    name="jenKel"
                    value={formData.jenKel}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50   appearance-none transition duration-200"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="laki-laki">Male</option>
                    <option value="perempuan">Female</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <i className="ri-arrow-down-s-line text-gray-400"></i>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700" htmlFor="noTlp">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="ri-phone-line text-gray-400"></i>
                  </div>
                  <input
                    type="tel"
                    id="noTlp"
                    name="noTlp"
                    value={formData.noTlp}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50   placeholder-gray-400 transition duration-200"
                    placeholder="08123456789"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-5">
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
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50   placeholder-gray-400 transition duration-200"
                    placeholder="emailyou@kahfi.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                  Password
                </label>
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
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50   placeholder-gray-400 transition duration-200"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="tglMasuk">
                    Entry Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="ri-calendar-line text-gray-400"></i>
                    </div>
                    <input
                      type="date"
                      id="tglMasuk"
                      name="tglMasuk"
                      value={formData.tglMasuk}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50   transition duration-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="role">
                    Role
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="ri-user-settings-line text-gray-400"></i>
                    </div>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50   appearance-none transition duration-200"
                      required
                    >
                      <option value="reguler">Regular</option>
                      <option value="mahasantri">Mahasantri</option>
                      <option value="biman">Biman</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <i className="ri-arrow-down-s-line text-gray-400"></i>
                    </div>
                  </div>
                </div>
              </div>
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
                Registering...
              </>
            ) : (
              <>
                <i className="ri-user-add-line mr-2"></i>
                Register Now
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[#eb6807] hover:text-[#d45e06] hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}