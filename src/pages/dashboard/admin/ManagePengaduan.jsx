// src/pages/dashboard/admin/ManagePengaduan.jsx
import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  updateDoc, 
  doc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../../firebase';
import Layout from '../../../components/admin/Layout';

export default function ManagePengaduan() {
  const [pengaduanList, setPengaduanList] = useState([]);
  const [selectedPengaduan, setSelectedPengaduan] = useState(null);
  const [filterStatus, setFilterStatus] = useState('semua');
  const [responseText, setResponseText] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pengaduanToDelete, setPengaduanToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'pengaduan'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const pengaduanData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        pengaduanData.push({ 
          id: doc.id, 
          ...data,
          // Pastikan timestamp dikonversi dengan benar
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date()
        });
      });
      
      // Filter berdasarkan status jika bukan 'semua'
      const filteredData = filterStatus === 'semua' 
        ? pengaduanData 
        : pengaduanData.filter(item => item.status === filterStatus);
        
      setPengaduanList(filteredData);
      console.log("Data pengaduan admin:", filteredData); // Debug log
    }, (error) => {
      console.error("Error fetching pengaduan:", error);
    });

    return () => unsubscribe();
  }, [filterStatus]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const pengaduanRef = doc(db, 'pengaduan', id);
      await updateDoc(pengaduanRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      setSuccessMessage('Status berhasil diperbarui');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error updating document: ', error);
      alert('Terjadi kesalahan saat mengupdate status');
    }
  };

  const handleUpdatePriority = async (id, newPriority) => {
    try {
      const pengaduanRef = doc(db, 'pengaduan', id);
      await updateDoc(pengaduanRef, {
        priority: newPriority,
        updatedAt: serverTimestamp()
      });
      setSuccessMessage('Prioritas berhasil diperbarui');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error updating document: ', error);
      alert('Terjadi kesalahan saat mengupdate prioritas');
    }
  };

  const handleSendResponse = async () => {
    if (!responseText.trim()) {
      alert('Respons tidak boleh kosong');
      return;
    }

    try {
      const pengaduanRef = doc(db, 'pengaduan', selectedPengaduan.id);
      await updateDoc(pengaduanRef, {
        adminResponse: responseText,
        updatedAt: serverTimestamp()
      });
      
      setResponseText('');
      setShowResponseModal(false);
      setSuccessMessage('Respons berhasil dikirim');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error updating document: ', error);
      alert('Terjadi kesalahan saat mengirim respons');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'pengaduan', pengaduanToDelete.id));
      setShowDeleteModal(false);
      setSuccessMessage('Pengaduan berhasil dihapus');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error deleting document: ', error);
      alert('Terjadi kesalahan saat menghapus pengaduan');
    }
  };

  const openDetailModal = (pengaduan) => {
    setSelectedPengaduan(pengaduan);
    setShowDetailModal(true);
  };

  const openResponseModal = (pengaduan) => {
    setSelectedPengaduan(pengaduan);
    setResponseText(pengaduan.adminResponse || '');
    setShowResponseModal(true);
  };

  const openDeleteModal = (pengaduan) => {
    setPengaduanToDelete(pengaduan);
    setShowDeleteModal(true);
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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Kelola Pengaduan</h1>
          
          <div className="flex items-center">
            <label className="mr-2 text-gray-700">Filter Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb6807]"
            >
              <option value="semua">Semua</option>
              <option value="pending">Pending</option>
              <option value="diproses">Diproses</option>
              <option value="selesai">Selesai</option>
              <option value="ditolak">Ditolak</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {pengaduanList.length === 0 ? (
            <div className="text-center py-12">
              <i className="ri-inbox-line text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-600">Belum ada pengaduan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioritas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pengaduanList.map((pengaduan) => (
                    <tr key={pengaduan.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {pengaduan.createdAt ? new Date(pengaduan.createdAt).toLocaleDateString('id-ID') : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{pengaduan.userName || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{pengaduan.userEmail || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{pengaduan.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">{pengaduan.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={pengaduan.status}
                          onChange={(e) => handleUpdateStatus(pengaduan.id, e.target.value)}
                          className={`text-xs font-medium rounded-full px-2 py-1 capitalize ${getStatusColor(pengaduan.status)} border-none focus:ring-2 focus:ring-[#eb6807]`}
                        >
                          <option value="pending">Pending</option>
                          <option value="diproses">Diproses</option>
                          <option value="selesai">Selesai</option>
                          <option value="ditolak">Ditolak</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={pengaduan.priority}
                          onChange={(e) => handleUpdatePriority(pengaduan.id, e.target.value)}
                          className={`text-xs font-medium rounded-full px-2 py-1 capitalize ${getPriorityColor(pengaduan.priority)} border-none focus:ring-2 focus:ring-[#eb6807]`}
                        >
                          <option value="rendah">Rendah</option>
                          <option value="sedang">Sedang</option>
                          <option value="tinggi">Tinggi</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => openDetailModal(pengaduan)}
                          className="text-blue-500 hover:text-blue-700 mr-3 transition duration-200"
                          title="Lihat Detail"
                        >
                          <i className="ri-eye-line"></i>
                        </button>
                        <button 
                          onClick={() => openResponseModal(pengaduan)}
                          className="text-[#eb6807] hover:text-orange-700 mr-3 transition duration-200"
                          title="Berikan Respons"
                        >
                          <i className="ri-chat-1-line"></i>
                        </button>
                        <button 
                          onClick={() => openDeleteModal(pengaduan)}
                          className="text-red-500 hover:text-red-700 transition duration-200"
                          title="Hapus Pengaduan"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Detail Pengaduan */}
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
                  <p className="text-sm text-gray-600">Oleh: {selectedPengaduan.userName} ({selectedPengaduan.userEmail})</p>
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
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Deskripsi:</h4>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{selectedPengaduan.description}</p>
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
                
                {selectedPengaduan.adminResponse && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Tanggapan Admin:</h4>
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                      <p className="text-gray-800">{selectedPengaduan.adminResponse}</p>
                    </div>
                  </div>
                )}
                
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

        {/* Modal Respons */}
        {showResponseModal && selectedPengaduan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800">Berikan Respons</h2>
                <button 
                  onClick={() => setShowResponseModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition duration-200"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{selectedPengaduan.title}</h3>
                <p className="text-sm text-gray-600">Oleh: {selectedPengaduan.userName}</p>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Deskripsi Pengaduan:</h4>
                <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{selectedPengaduan.description}</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Tanggapan Anda:</label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb6807]"
                  placeholder="Tulis tanggapan Anda untuk pengaduan ini"
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowResponseModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200"
                >
                  Batal
                </button>
                <button
                  onClick={handleSendResponse}
                  className="bg-[#eb6807] hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                >
                  Kirim Respons
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Hapus */}
        {showDeleteModal && pengaduanToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-error-warning-line text-3xl text-red-600"></i>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Hapus Pengaduan?</h2>
                <p className="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus pengaduan dari {pengaduanToDelete.userName} dengan judul "{pengaduanToDelete.title}"? Tindakan ini tidak dapat dibatalkan.</p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                  >
                    Hapus
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
                <h2 className="text-xl font-bold text-gray-800 mb-2">Berhasil!</h2>
                <p className="text-gray-600 mb-6">{successMessage}</p>
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