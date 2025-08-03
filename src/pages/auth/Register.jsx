// src/pages/auth/Register.jsx
import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { app } from '../../firebase';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    nama: '',
    noTlp: '',
    email: '',
    password: '',
    tglMasuk: '',
    role: 'reguler',
    jenKel: '' // <- baru

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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <i className="ri-user-add-line text-4xl text-gray-700 mb-2"></i>
          <h1 className="text-2xl font-bold text-gray-800">Register</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="nama">
              <i className="ri-user-line mr-2"></i>Nama Lengkap
            </label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="w-full bg-white text-gray-800 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="jenKel">
              <i className="ri-user-2-line mr-2"></i>Jenis Kelamin
            </label>
            <select
              id="jenKel"
              name="jenKel"
              value={formData.jenKel}
              onChange={handleChange}
              className="w-full bg-white text-gray-800 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
              required
            >
              <option value="">-- Pilih Jenis Kelamin --</option>
              <option value="laki-laki">Laki-laki</option>
              <option value="perempuan">Perempuan</option>
            </select>
          </div>


          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="noTlp">
              <i className="ri-phone-line mr-2"></i>Nomor Telepon
            </label>
            <input
              type="tel"
              id="noTlp"
              name="noTlp"
              value={formData.noTlp}
              onChange={handleChange}
              className="w-full bg-white text-gray-800 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              <i className="ri-mail-line mr-2"></i>Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white text-gray-800 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              <i className="ri-lock-line mr-2"></i>Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white text-gray-800 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="tglMasuk">
              <i className="ri-calendar-line mr-2"></i>Tanggal Masuk
            </label>
            <input
              type="date"
              id="tglMasuk"
              name="tglMasuk"
              value={formData.tglMasuk}
              onChange={handleChange}
              className="w-full bg-white text-gray-800 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="role">
              <i className="ri-user-settings-line mr-2"></i>Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-white text-gray-800 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
              required
            >
              {/* <option value="admin">Admin</option> */}
              <option value="reguler">Reguler</option>
              <option value="mahasantri">Mahasantri</option>
              <option value="biman">Biman</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-150"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                Processing...
              </span>
            ) : (
              'Register'
            )}
          </button>
        </form>

        <div className="mt-4 text-center text-gray-600">
          Sudah punya akun?{' '}
          <a href="/login" className="text-gray-800 hover:underline">
            Login disini
          </a>
        </div>
      </div>
    </div>
  );
}