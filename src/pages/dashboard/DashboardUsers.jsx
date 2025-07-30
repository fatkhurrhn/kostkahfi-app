// src/pages/dashboard/DashboardUsers.jsx
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import {
  getFirestore, collection, query, where,
  getDocs, updateDoc, doc, orderBy, getDoc
} from 'firebase/firestore';

export default function DashboardUsers() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availableKamars, setAvailableKamars] = useState([]);
  const [selectedKamar, setSelectedKamar] = useState('');
  const [userKamar, setUserKamar] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const fetchUserData = async (currentUser) => {
    const db = getFirestore(app);
    try {
      const userQuery = query(
        collection(db, 'users'),
        where('uid', '==', currentUser.uid)
      );
      const userSnapshot = await getDocs(userQuery);
      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        setUser(userData);

        if (userData.kamarId) {
          const kamarDoc = await getDoc(doc(db, 'kamar', userData.kamarId));
          if (kamarDoc.exists()) {
            const kamar = { id: kamarDoc.id, ...kamarDoc.data() };
            setUserKamar(kamar);
            setSelectedKamar(kamar.id); // <-- tampilkan kamar yang sudah dipilih
          }
        }

        const kamarQuery = query(
          collection(db, 'kamar'),
          where('status', '==', 'kosong'),
          orderBy('no_kamar')
        );
        const kamarSnapshot = await getDocs(kamarQuery);
        setAvailableKamars(
          kamarSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        );
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      const db = getFirestore(app);
      const adminCheck = query(
        collection(db, 'users'),
        where('uid', '==', currentUser.uid),
        where('role', '==', 'admin')
      );
      const adminSnapshot = await getDocs(adminCheck);
      if (!adminSnapshot.empty) {
        navigate('/dashboard-admin');
        return;
      }
      await fetchUserData(currentUser);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
      navigate('/login');
    } catch {
      setError('Gagal logout');
    }
  };

  const handleSelectKamar = async () => {
    if (!selectedKamar) {
      setError('Pilih kamar terlebih dahulu');
      return;
    }
    try {
      const auth = getAuth(app);
      const db = getFirestore(app);
      const currentUser = auth.currentUser;
      await updateDoc(doc(db, 'kamar', selectedKamar), {
        status: 'terisi',
        penghuniId: currentUser.uid
      });
      const userQuery = query(
        collection(db, 'users'),
        where('uid', '==', currentUser.uid)
      );
      const snapshot = await getDocs(userQuery);
      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        await updateDoc(userDoc.ref, { kamarId: selectedKamar });
        const selectedRoom = availableKamars.find(k => k.id === selectedKamar);
        setUserKamar(selectedRoom);
        setUser(prev => ({ ...prev, kamarId: selectedKamar }));
        setAvailableKamars(prev => prev.filter(k => k.id !== selectedKamar));
        setSelectedKamar(selectedRoom.id); // tetap tampilkan nomor kamar
        setError('');
        setSuccess(`Kamar ${selectedRoom.no_kamar} berhasil dipilih`);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error("Error selecting kamar:", error);
      setError('Gagal memilih kamar');
    }
  };

  const handleChangeKamar = async () => {
    if (!window.confirm('Apakah Anda yakin ingin mengganti kamar?')) return;
    try {
      const auth = getAuth(app);
      const db = getFirestore(app);
      const currentUser = auth.currentUser;
      if (userKamar) {
        await updateDoc(doc(db, 'kamar', userKamar.id), {
          status: 'kosong',
          penghuniId: null
        });
        // hapus kamarId di user
        const userQuery = query(
          collection(db, 'users'),
          where('uid', '==', currentUser.uid)
        );
        const snap = await getDocs(userQuery);
        if (!snap.empty) {
          await updateDoc(snap.docs[0].ref, { kamarId: null });
        }
      }
      await updateDoc(doc(db, 'kamar', selectedKamar), {
        status: 'terisi',
        penghuniId: currentUser.uid
      });
      const newRoom = availableKamars.find(k => k.id === selectedKamar);
      const updated = [...availableKamars];
      if (userKamar) {
        updated.push({ ...userKamar, status: 'kosong' });
        updated.sort((a, b) => parseInt(a.no_kamar) - parseInt(b.no_kamar));
      }
      setUserKamar(newRoom);
      setUser(prev => ({ ...prev, kamarId: selectedKamar }));
      setAvailableKamars(updated.filter(k => k.id !== selectedKamar));
      setSelectedKamar(newRoom.id);
      setSuccess(`Berhasil pindah ke kamar ${newRoom.no_kamar}`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error("Error changing kamar:", error);
      setError('Gagal mengganti kamar');
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
            <i className="ri-dashboard-line mr-2"></i>User Dashboard
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
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            <i className="ri-information-line mr-2"></i>Informasi Akun
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-2">Data Pribadi</h3>
              <div className="space-y-2">
                <p className="text-gray-800">
                  <span className="font-medium">Nama:</span> {user?.nama || '-'}
                </p>
                <p className="text-gray-800">
                  <span className="font-medium">Email:</span> {user?.email || '-'}
                </p>
                <p className="text-gray-800">
                  <span className="font-medium">No. Telepon:</span> {user?.noTlp || '-'}
                </p>
                <p className="text-gray-800">
                  <span className="font-medium">Role:</span> {user?.role || '-'}
                </p>
                {userKamar && (
                  <p className="text-gray-800">
                    <span className="font-medium">Kamar:</span> {userKamar.no_kamar}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-700 mb-2">
                {userKamar ? 'Ganti Kamar' : 'Pilih Kamar'}
              </h3>
              <div className="space-y-3">
                <select
                  value={selectedKamar}
                  onChange={(e) => setSelectedKamar(e.target.value)}
                  className="w-full bg-white text-gray-800 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
                >
                  <option value="">
                    {userKamar ? `Kamar ${userKamar.no_kamar} (terisi)` : '-- Pilih Kamar --'}
                  </option>
                  {availableKamars.map(kamar => (
                    <option key={kamar.id} value={kamar.id}>
                      Kamar {kamar.no_kamar} [kosong]
                    </option>
                  ))}
                </select>

                {userKamar ? (
                  <button
                    onClick={handleChangeKamar}
                    disabled={!selectedKamar || selectedKamar === userKamar.id}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <i className="ri-home-4-line mr-2"></i> Ganti Kamar
                  </button>
                ) : (
                  <button
                    onClick={handleSelectKamar}
                    disabled={!selectedKamar}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <i className="ri-check-line mr-2"></i> Pilih Kamar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}