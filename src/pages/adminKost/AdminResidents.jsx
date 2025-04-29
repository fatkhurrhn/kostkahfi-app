import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const AdminResidents = () => {
  const [residents, setResidents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [openModal, setOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Laki-laki',
    phone: '',
    category: 'kost biasa',
    photoUrl: '',
    roomId: '',
    origin: '',
    since: '',
    occupationType: 'kuliah',
    occupationDetail: '',
    status: 'confirmed'
  });

  const fetchResidents = async () => {
    const querySnapshot = await getDocs(collection(db, 'residents'));
    const residentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setResidents(residentsData);
  };

  const fetchRooms = async () => {
    const querySnapshot = await getDocs(collection(db, 'rooms'));
    const roomsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setRooms(roomsData);
  };

  useEffect(() => {
    fetchResidents();
    fetchRooms();
  }, []);

  const handleAddResident = async () => {
    if (!formData.name || !formData.roomId) return;
    
    try {
      await addDoc(collection(db, 'residents'), {
        ...formData,
        createdAt: new Date().toISOString()
      });
      
      setFormData({
        name: '',
        gender: 'Laki-laki',
        phone: '',
        category: 'kost biasa',
        photoUrl: '',
        roomId: '',
        origin: '',
        since: '',
        occupationType: 'kuliah',
        occupationDetail: '',
        status: 'confirmed'
      });
      
      setOpenModal(false);
      fetchResidents();
    } catch (error) {
      console.error('Error adding resident: ', error);
    }
  };

  const handleDeleteResident = async (id) => {
    try {
      await deleteDoc(doc(db, 'residents', id));
      fetchResidents();
    } catch (error) {
      console.error('Error deleting resident: ', error);
    }
  };

  const handleConfirmBooking = async (id) => {
    try {
      await updateDoc(doc(db, 'residents', id), {
        status: 'confirmed'
      });
      fetchResidents();
    } catch (error) {
      console.error('Error confirming booking: ', error);
    }
  };

  const filteredResidents = residents.filter(resident => {
    const matchesSearch = resident.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (resident.roomId && rooms.find(r => r.id === resident.roomId)?.roomNumber.includes(searchTerm));
    
    if (activeTab === 0) {
      return matchesSearch && resident.status === 'confirmed';
    } else {
      return matchesSearch && resident.status === 'pending';
    }
  });

  const sortedResidents = [...filteredResidents].sort((a, b) => {
    const roomA = rooms.find(r => r.id === a.roomId);
    const roomB = rooms.find(r => r.id === b.roomId);
    
    if (!roomA || !roomB) return 0;
    
    if (sortOrder === 'asc') {
      return roomA.roomNumber.localeCompare(roomB.roomNumber);
    } else {
      return roomB.roomNumber.localeCompare(roomA.roomNumber);
    }
  });

  const getRoomInfo = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? `Gedung ${room.building} - ${room.roomNumber}` : 'Tidak ada kamar';
  };

  const pendingBookings = residents.filter(res => res.status === 'pending');

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Kelola Penghuni</h2>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="ri-search-line text-gray-400"></i>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Cari nama atau nomor kamar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          onClick={() => setOpenModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <i className="ri-add-line mr-1"></i> Tambah Penghuni
        </button>
      </div>
      
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab(0)}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 0
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Penghuni
          </button>
          <button
            onClick={() => setActiveTab(1)}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 1
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Konfirmasi Booking
            {pendingBookings.length > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {pendingBookings.length}
              </span>
            )}
          </button>
        </nav>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                <div className="flex items-center">
                  Kamar
                  <i className={`ri-arrow-up-down-line ml-1 ${sortOrder === 'asc' ? 'text-blue-500' : 'text-gray-400'}`}></i>
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Kelamin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sejak</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedResidents.length > 0 ? (
              sortedResidents.map((resident) => (
                <tr key={resident.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{resident.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getRoomInfo(resident.roomId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{resident.gender}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{resident.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{resident.origin}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{resident.since}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      resident.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {resident.status === 'pending' ? 'Menunggu Konfirmasi' : 'Terkonfirmasi'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    {resident.status === 'pending' && (
                      <button 
                        onClick={() => handleConfirmBooking(resident.id)}
                        className="text-green-600 hover:text-green-900 flex items-center"
                      >
                        <i className="ri-check-line mr-1"></i> Konfirmasi
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteResident(resident.id)}
                      className="text-red-600 hover:text-red-900 flex items-center"
                    >
                      <i className="ri-delete-bin-line mr-1"></i> Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                  Tidak ada data penghuni yang ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Add Resident Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Tambah Penghuni Baru</h3>
                <button 
                  onClick={() => setOpenModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="kost biasa">Kost Biasa</option>
                    <option value="biman">BIMAN</option>
                    <option value="mahasantri">Mahasantri</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Foto URL</label>
                  <input
                    type="text"
                    value={formData.photoUrl}
                    onChange={(e) => setFormData({...formData, photoUrl: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kamar</label>
                  <select
                    value={formData.roomId}
                    onChange={(e) => setFormData({...formData, roomId: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Pilih Kamar</option>
                    {rooms.filter(r => r.status === 'kosong').map(room => (
                      <option key={room.id} value={room.id}>
                        Gedung {room.building} - {room.roomNumber}
                      </option>
                    ))}
                  </select>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sejak</label>
                  <input
                    type="text"
                    value={formData.since}
                    onChange={(e) => setFormData({...formData, since: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Contoh: Januari 2024"
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
                    {formData.occupationType === 'kuliah' ? 'Nama Kampus' : 'Tempat Kerja'}
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
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleAddResident}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  disabled={!formData.name || !formData.roomId}
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResidents;