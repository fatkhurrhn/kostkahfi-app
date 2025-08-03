import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../firebase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Kamar() {
  const [rooms, setRooms] = useState([]);
  const [filter, setFilter] = useState('all');
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

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-[56px] pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 text-gray-800">
            <span className="text-[#eb6807]">Daftar</span> Kamar
          </h1>
          <div className="w-20 h-1 bg-[#eb6807] mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-lg mx-auto">
            Informasi ketersediaan kamar kost secara real-time
          </p>
        </div>

        {/* Filter */}
        <div className="flex justify-center space-x-5 mb-12">
          {['all', 'kosong', 'terisi'].map(btn => (
            <button
              key={btn}
              onClick={() => setFilter(btn)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors
                ${filter === btn
                  ? 'bg-[#eb6807] text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200'
                }`}
            >
              {btn === 'all' ? 'Semua Kamar' : btn === 'kosong' ? 'Kamar Kosong' : 'Kamar Terisi'}
            </button>
          ))}
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 h-48 animate-pulse"></div>
            ))}
          </div>
        )}

        {/* Room Cards */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {filtered.map(room => (
              <div
                key={room.id}
                className={`bg-white rounded-lg shadow-sm overflow-hidden border-t-4 ${
                  room.status === 'kosong' ? 'border-green-400' : 'border-rose-400'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        room.status === 'kosong' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {room.status === 'kosong' ? 'Tersedia' : 'Terisi'}
                      </span>
                    </div>
                    <div className="text-[17px] font-bold text-gray-800">#{room.no}</div>
                  </div>

                  <div className="flex items-center justify-center my-4">
                    <div className={`text-5xl ${
                      room.status === 'kosong' 
                        ? 'text-green-400' 
                        : 'text-rose-400'
                    }`}>
                      {room.status === 'kosong' ? (
                        <i className="ri-door-open-line" />
                      ) : (
                        <i className="ri-door-closed-line" />
                      )}
                    </div>
                  </div>

                  {room.occupant && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600 flex items-center">
                        <i className="ri-user-line mr-2 text-gray-400" />
                        <span className="font-medium">{room.occupant}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}