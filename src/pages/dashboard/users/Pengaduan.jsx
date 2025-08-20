// src/pages/dashboard/users/Pengaduan.jsx
import React, { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  deleteDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion
} from 'firebase/firestore';
import { db } from '../../../firebase';
import { getAuth } from 'firebase/auth';
import Layout from '../../../components/users/Layout';

export default function Pengaduan() {
  const [pengaduanList, setPengaduanList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPengaduan, setSelectedPengaduan] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'perbaikan',
    imageUrl: ''
  });
  
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      console.log("User ID:", user.uid); // Debug
      const q = query(
        collection(db, 'pengaduan'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const pengaduanData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          pengaduanData.push({ 
            id: doc.id, 
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date()
          });
        });
        console.log("Data pengaduan diterima:", pengaduanData); // Debug
        setPengaduanList(pengaduanData);
      }, (error) => {
        console.error("Error fetching pengaduan:", error);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Buat pesan pertama sebagai deskripsi pengaduan
      const initialMessage = {
        sender: 'user',
        senderName: user.displayName || user.email,
        message: formData.description,
        timestamp: serverTimestamp()
      };
      
      await addDoc(collection(db, 'pengaduan'), {
        userId: user.uid,
        userName: user.displayName || user.email,
        userEmail: user.email,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        imageUrl: formData.imageUrl,
        status: 'pending',
        priority: 'sedang',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        messages: [initialMessage]
      });
      
      setFormData({ title: '', description: '', category: 'perbaikan', imageUrl: '' });
      setShowForm(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Terjadi kesalahan saat mengirim pengaduan. Pastikan Anda terhubung ke internet.');
    }
    
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengaduan ini?')) {
      try {
        await deleteDoc(doc(db, 'pengaduan', id));
      } catch (error) {
        console.error('Error deleting document: ', error);
        alert('Terjadi kesalahan saat menghapus pengaduan');
      }
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedPengaduan) return;
    
    setSendingMessage(true);
    try {
      const messageData = {
        sender: 'user',
        senderName: user.displayName || user.email,
        message: newMessage,
        timestamp: serverTimestamp()
      };
      
      const pengaduanRef = doc(db, 'pengaduan', selectedPengaduan.id);
      await updateDoc(pengaduanRef, {
        messages: arrayUnion(messageData),
        updatedAt: serverTimestamp()
      });
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Terjadi kesalahan saat mengirim pesan');
    }
    setSendingMessage(false);
  };

  const openDetailModal = (pengaduan) => {
    setSelectedPengaduan(pengaduan);
    setNewMessage('');
    setShowDetailModal(true);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-gray-200 text-gray-800';
      case 'diproses': return 'bg-blue-100 text-blue-800';
      case 'selesai': return 'bg-green-100 text-green-800';
      case 'ditolak': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'rendah': return 'bg-gray-100 text-gray-700';
      case 'sedang': return 'bg-yellow-100 text-yellow-700';
      case 'tinggi': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Pengaduan Saya</h1>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-[#eb6807] hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition duration-200"
          >
            <i className="ri-add-line mr-2"></i> Buat Pengaduan Baru
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Form Pengaduan Baru</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Judul Pengaduan</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb6807]"
                  required
                  placeholder="Masukkan judul pengaduan"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Kategori</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb6807]"
                >
                  <option value="perbaikan">Perbaikan</option>
                  <option value="kebersihan">Kebersihan</option>
                  <option value="keamanan">Keamanan</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Deskripsi</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb6807]"
                  required
                  placeholder="Jelaskan keluhan atau pengaduan Anda secara detail"
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">URL Gambar (Opsional)</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb6807]"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#eb6807] hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition duration-200"
                >
                  {loading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i> Mengirim...
                    </>
                  ) : (
                    <>
                      <i className="ri-send-plane-line mr-2"></i> Kirim Pengaduan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {pengaduanList.length === 0 ? (
            <div className="text-center py-12">
              <i className="ri-inbox-line text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-600">Belum ada pengaduan</p>
              <button 
                onClick={() => setShowForm(true)}
                className="mt-4 text-[#eb6807] hover:text-orange-700 font-medium transition duration-200"
              >
                Buat pengaduan pertama Anda
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pesan Terakhir</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pengaduanList.map((pengaduan) => {
                    const lastMessage = pengaduan.messages && pengaduan.messages.length > 0 
                      ? pengaduan.messages[pengaduan.messages.length - 1] 
                      : null;
                    
                    return (
                      <tr key={pengaduan.id} className="hover:bg-gray-50 transition duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {pengaduan.createdAt ? new Date(pengaduan.createdAt).toLocaleDateString('id-ID') : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{pengaduan.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 capitalize">{pengaduan.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(pengaduan.status)}`}>
                            {pengaduan.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            {lastMessage ? (
                              <>
                                <span className="font-medium">{lastMessage.senderName}: </span>
                                {lastMessage.message.length > 50 
                                  ? `${lastMessage.message.substring(0, 50)}...` 
                                  : lastMessage.message
                                }
                              </>
                            ) : 'Tidak ada pesan'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => openDetailModal(pengaduan)}
                            className="text-[#eb6807] hover:text-orange-700 mr-3 transition duration-200"
                            title="Lihat Detail"
                          >
                            <i className="ri-eye-line"></i>
                          </button>
                          {pengaduan.status === 'pending' && (
                            <button 
                              onClick={() => handleDelete(pengaduan.id)}
                              className="text-red-500 hover:text-red-700 transition duration-200"
                              title="Hapus Pengaduan"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Detail Pengaduan dengan Fitur Chat */}
        {showDetailModal && selectedPengaduan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Detail Pengaduan</h2>
                  <button 
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-500 hover:text-gray-700 transition duration-200"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{selectedPengaduan.title}</h3>
                  <p className="text-sm text-gray-600">Dibuat pada: {formatDate(selectedPengaduan.createdAt)}</p>
                  <p className="text-sm text-gray-600">Terakhir diupdate: {formatDate(selectedPengaduan.updatedAt)}</p>
                </div>
                
                <div className="mb-4">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(selectedPengaduan.status)} mr-2`}>
                    Status: {selectedPengaduan.status}
                  </span>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full capitalize ${getPriorityColor(selectedPengaduan.priority)}`}>
                    Prioritas: {selectedPengaduan.priority}
                  </span>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Kategori:</h4>
                  <p className="capitalize text-gray-800">{selectedPengaduan.category}</p>
                </div>
                
                {selectedPengaduan.imageUrl && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Gambar:</h4>
                    <img 
                      src={selectedPengaduan.imageUrl} 
                      alt="Bukti pengaduan" 
                      className="max-w-full h-auto rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                {/* Area Chat */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Percakapan:</h4>
                  <div className="border border-gray-200 rounded-lg p-4 max-h-80 overflow-y-auto">
                    {selectedPengaduan.messages && selectedPengaduan.messages.length > 0 ? (
                      selectedPengaduan.messages.map((msg, index) => (
                        <div 
                          key={index} 
                          className={`mb-3 ${msg.sender === 'user' ? 'text-right' : ''}`}
                        >
                          <div className={`inline-block p-3 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-[#eb6807] text-white' : 'bg-gray-200 text-gray-800'}`}>
                            <p className="text-sm">{msg.message}</p>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {msg.senderName} • {msg.timestamp ? formatTime(msg.timestamp.toDate ? msg.timestamp.toDate() : new Date(msg.timestamp)) : ''}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center">Belum ada percakapan</p>
                    )}
                  </div>
                </div>
                
                {/* Input Pesan Baru */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Balas Pesan:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb6807]"
                      placeholder="Ketik pesan balasan..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') sendMessage();
                      }}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={sendingMessage || !newMessage.trim()}
                      className="bg-[#eb6807] hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
                    >
                      {sendingMessage ? (
                        <i className="ri-loader-4-line animate-spin"></i>
                      ) : (
                        <i className="ri-send-plane-line"></i>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="bg-[#eb6807] hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Sukses */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-checkbox-circle-line text-3xl text-green-600"></i>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Pengaduan Berhasil Dikirim!</h2>
                <p className="text-gray-600 mb-6">Pengaduan Anda telah berhasil dikirim dan akan segera diproses oleh admin.</p>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="bg-[#eb6807] hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
                >
                  Oke
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}