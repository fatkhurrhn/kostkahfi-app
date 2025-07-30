// src/pages/dashboard/DashboardAdmin.jsx
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

export default function DashboardAdmin() {
  const [user, setUser] = useState(null);
  const [penghuni, setPenghuni] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fungsi untuk format tanggal
  const formatDate = (date) => {
    if (!date) return '-';
    
    // Jika date adalah Firebase Timestamp
    if (date.toDate) {
      return date.toDate().toLocaleDateString('id-ID');
    }
    
    // Jika date adalah string ISO
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString('id-ID');
    }
    
    return '-';
  };

  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      try {
        // Get user data from Firestore
        const q = query(
          collection(db, 'users'),
          where('uid', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          if (userData.role !== 'admin') {
            navigate('/dashboard-users');
            return;
          }
          setUser(userData);
          
          // Get all penghuni data
          const penghuniSnapshot = await getDocs(collection(db, 'users'));
          const penghuniData = penghuniSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setPenghuni(penghuniData);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <i className="ri-loader-4-line animate-spin text-4xl text-gray-700"></i>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">
            <i className="ri-dashboard-line mr-2"></i>Admin Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              <i className="ri-user-line mr-1"></i> {user?.nama}
            </span>
            <button
              onClick={handleLogout}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm flex items-center"
            >
              <i className="ri-logout-box-r-line mr-1"></i> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            <i className="ri-group-line mr-2"></i>Daftar Penghuni Kamar
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No. Telepon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal Masuk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {penghuni.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {item.nama || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {item.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {item.noTlp || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {formatDate(item.tglMasuk)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {item.role || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}