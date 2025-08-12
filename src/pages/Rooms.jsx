// src/pages/Rooms.jsx
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../firebase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import ChatBot from '../components/chatbot/ChatBot';
import RoomsHeader from '../components/rooms/RoomsHeader';
import RoomsFilter from '../components/rooms/RoomsFilter';
import RoomsContent from '../components/rooms/RoomsContent';

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

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      <Navbar />
      <ChatBot />
      <ScrollToTop />
      <main className="max-w-7xl mx-auto px-4 pt-[110px] pb-12">
        <RoomsHeader />
        <RoomsFilter filter={filter} setFilter={setFilter} />
        {loading && <div className="text-center text-gray-500 py-4">Memuat data...</div>}
        <RoomsContent 
          rooms={rooms} 
          filter={filter} 
          loading={loading} 
        />
      </main>
      <Footer />
    </div>
  );
}