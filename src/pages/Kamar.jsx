import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../firebase'; // path ke firebase.js Anda
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Kamar() {
  const [rooms, setRooms] = useState([]);
  const [filter, setFilter] = useState('all'); // all | kosong | terisi
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore(app);
      const [kamarSnap, usersSnap] = await Promise.all([
        getDocs(collection(db, 'kamar')),
        getDocs(collection(db, 'users'))
      ]);

      const userMap = {};
      usersSnap.forEach(doc => {
        const u = doc.data();
        userMap[u.uid] = u.nama;
      });

      const data = kamarSnap.docs.map(doc => {
        const {
          no_kamar: no,
          status,
          penghuniId
        } = doc.data();
        return {
          id: doc.id,
          no,
          status,
          occupant: penghuniId ? userMap[penghuniId] || '—' : null
        };
      });

      data.sort((a, b) => parseInt(a.no) - parseInt(b.no));
      setRooms(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filtered = rooms.filter(r =>
    filter === 'all' ? true : r.status === filter
  );

  /* ---------- UI ---------- */
  return (
    <div className="bg-gray-100 min-h-screen text-gray-800">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-5xl font-extrabold text-center mb-2">
          Info Kamar
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Ketersediaan kamar kost secara real-time
        </p>

        {/* Filter */}
        <div className="flex justify-center space-x-2 mb-8">
          {['all', 'kosong', 'terisi'].map(btn => (
            <button
              key={btn}
              onClick={() => setFilter(btn)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all
                ${filter === btn
                  ? 'bg-gray-800 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:shadow-md'
                }`}
            >
              {btn === 'all' ? 'Semua' : btn === 'kosong' ? 'Kosong' : 'Terisi'}
            </button>
          ))}
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-300 rounded-xl h-48 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Room Cards */}
        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filtered.map(room => (
              <div
                key={room.id}
                className={`relative bg-white rounded-2xl shadow-md hover:shadow-xl
                  transform hover:-translate-y-2 transition-all duration-300
                  p-6 flex flex-col justify-between
                  ${room.status === 'kosong' ? 'border-green-200' : 'border-rose-200'}
                  border-l-4`}
              >
                {/* Icon besar */}
                <div className="text-center mb-3">
                  <i
                    className={`ri-4x
                    ${room.status === 'kosong'
                        ? 'ri-home-gear-line text-green-500'
                        : 'ri-user-shared-2-line text-rose-500'
                      }`}
                  />
                </div>

                {/* Nomor */}
                <h2 className="text-3xl font-bold text-center mb-1">
                  {room.no}
                </h2>

                {/* Status chip */}
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full mx-auto
                  ${room.status === 'kosong'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-rose-100 text-rose-700'
                    }`}
                >
                  {room.status === 'kosong' ? 'Kosong' : 'Terisi'}
                </span>

                {/* Penghuni */}
                {room.occupant && (
                  <p className="text-sm text-gray-500 mt-2 text-center truncate">
                    <i className="ri-user-line mr-1" />
                    {room.occupant}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}