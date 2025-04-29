import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [building, setBuilding] = useState('1');
  const [roomNumber, setRoomNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchRooms = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, 'rooms'));
    const roomsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setRooms(roomsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleAddRoom = async () => {
    if (!roomNumber) return;
    
    try {
      await addDoc(collection(db, 'rooms'), {
        building,
        roomNumber,
        status: 'kosong',
        createdAt: new Date().toISOString()
      });
      setRoomNumber('');
      fetchRooms();
    } catch (error) {
      console.error('Error adding room: ', error);
    }
  };

  const handleDeleteRoom = async (id) => {
    try {
      await deleteDoc(doc(db, 'rooms', id));
      fetchRooms();
    } catch (error) {
      console.error('Error deleting room: ', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Kelola Kamar</h2>
      
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Gedung</label>
            <select
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="1">Gedung 1</option>
              <option value="2">Gedung 2</option>
              <option value="3">Gedung 3</option>
              <option value="4">Gedung 4</option>
            </select>
          </div>
          
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Kamar</label>
            <input
              type="text"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Nomor Kamar"
            />
          </div>
          
          <button 
            onClick={handleAddRoom}
            disabled={!roomNumber || loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center disabled:bg-blue-400"
          >
            {loading ? (
              <>
                <i className="ri-loader-4-line animate-spin mr-1"></i> Memproses...
              </>
            ) : (
              <>
                <i className="ri-add-line mr-1"></i> Tambah Kamar
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">
            <i className="ri-loader-4-line animate-spin text-2xl text-blue-500"></i>
            <p className="mt-2">Memuat data kamar...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Tidak ada data kamar yang tersedia
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gedung</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Kamar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rooms.map((room) => (
                <tr key={room.id}>
                  <td className="px-6 py-4 whitespace-nowrap">Gedung {room.building}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{room.roomNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      room.status === 'kosong' ? 'bg-green-100 text-green-800' : 
                      room.status === 'terisi' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {room.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => handleDeleteRoom(room.id)}
                      className="text-red-600 hover:text-red-900 flex items-center"
                      disabled={loading}
                    >
                      <i className="ri-delete-bin-line mr-1"></i> Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminRooms;