import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export const RoomChecker = () => {
  const [rooms, setRooms] = useState([]);
  const [residents, setResidents] = useState([]);
  const [openBookingModal, setOpenBookingModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  // Booking form state
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Laki-laki',
    phone: '',
    origin: '',
    occupationType: 'kuliah',
    occupationDetail: ''
  });

  const fetchRoomsAndResidents = async () => {
    const roomsSnapshot = await getDocs(collection(db, 'rooms'));
    const roomsData = roomsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const residentsSnapshot = await getDocs(collection(db, 'residents'));
    const residentsData = residentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    setRooms(roomsData);
    setResidents(residentsData);
  };

  useEffect(() => {
    fetchRoomsAndResidents();
  }, []);

  const handleOpenBooking = (room) => {
    setSelectedRoom(room);
    setOpenBookingModal(true);
  };

  const handleBookRoom = async () => {
    if (!formData.name || !selectedRoom) return;
    
    try {
      // Add resident with pending status
      await addDoc(collection(db, 'residents'), {
        ...formData,
        roomId: selectedRoom.id,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      
      // Update room status to "dipesan"
      await updateDoc(doc(db, 'rooms', selectedRoom.id), {
        status: 'dipesan'
      });
      
      // Reset form and close modal
      setFormData({
        name: '',
        gender: 'Laki-laki',
        phone: '',
        origin: '',
        occupationType: 'kuliah',
        occupationDetail: ''
      });
      setSelectedRoom(null);
      setOpenBookingModal(false);
      
      // Refresh data
      fetchRoomsAndResidents();
    } catch (error) {
      console.error('Error booking room: ', error);
    }
  };

  const getRoomStatus = (room) => {
    const resident = residents.find(res => res.roomId === room.id);
    
    if (resident) {
      return resident.status === 'pending' ? 'Dipesan' : 'Terisi';
    }
    return 'Kosong';
  };

  const availableRooms = rooms.filter(room => {
    const resident = residents.find(res => res.roomId === room.id);
    return !resident || resident.status === 'pending';
  });

  const occupiedRooms = rooms.filter(room => {
    const resident = residents.find(res => res.roomId === room.id);
    return resident && resident.status === 'confirmed';
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Cek Ketersediaan Kamar</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Kamar</h3>
          <p className="text-3xl font-bold">{rooms.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Kamar Kosong</h3>
          <p className="text-3xl font-bold text-green-600">{availableRooms.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Kamar Terisi</h3>
          <p className="text-3xl font-bold text-red-600">{occupiedRooms.length}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                    getRoomStatus(room) === 'Kosong' ? 'bg-green-100 text-green-800' : 
                    getRoomStatus(room) === 'Terisi' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {getRoomStatus(room)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRoomStatus(room) === 'Kosong' && (
                    <button 
                      onClick={() => handleOpenBooking(room)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 flex items-center text-sm"
                    >
                      <i className="ri-user-add-line mr-1"></i> Booking
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Booking Modal */}
      {openBookingModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Formulir Booking Kamar</h3>
                <button 
                  onClick={() => setOpenBookingModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
              
              <p className="text-sm text-gray-500 mb-4">
                Kamar: Gedung {selectedRoom?.building} - {selectedRoom?.roomNumber}
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asal</label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({...formData, origin: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="occupationType"
                        value="kuliah"
                        checked={formData.occupationType === 'kuliah'}
                        onChange={() => setFormData({...formData, occupationType: 'kuliah'})}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">Kuliah</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="occupationType"
                        value="kerja"
                        checked={formData.occupationType === 'kerja'}
                        onChange={() => setFormData({...formData, occupationType: 'kerja'})}
                        className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2">Kerja</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {formData.occupationType === 'kuliah' ? 'Nama Kampus' : 'Nama Perusahaan'}
                    </label>
                    <input
                      type="text"
                      value={formData.occupationDetail}
                      onChange={(e) => setFormData({...formData, occupationDetail: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setOpenBookingModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleBookRoom}
                    className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Booking Kamar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };