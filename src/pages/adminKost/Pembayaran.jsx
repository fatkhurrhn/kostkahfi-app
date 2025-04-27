import { useState, useEffect } from 'react';
import { collection, doc, setDoc, deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

export default function PembayaranAdmin() {
  const [penyewa, setPenyewa] = useState([]);
  const [pembayaran, setPembayaran] = useState([]);
  const [konfirmasi, setKonfirmasi] = useState([]);
  const [formPenyewa, setFormPenyewa] = useState({ nama: '', kamar: '', telpon: '' });
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState('status');
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", 
                "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const currentYear = new Date().getFullYear();

  // Real-time listeners
  useEffect(() => {
    const unsubscribePenyewa = onSnapshot(collection(db, 'penyewa'), (snapshot) => {
      // Sort by newest first
      setPenyewa(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => b.id - a.id));
    });

    const unsubscribePembayaran = onSnapshot(collection(db, 'pembayaran'), (snapshot) => {
      setPembayaran(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubscribeKonfirmasi = onSnapshot(collection(db, 'konfirmasi_pembayaran'), (snapshot) => {
      setKonfirmasi(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        tanggalKonfirmasi: doc.data().tanggal?.toDate().toLocaleString('id-ID')
      })).sort((a, b) => b.id - a.id)); // Sort by newest first
    });

    return () => {
      unsubscribePenyewa();
      unsubscribePembayaran();
      unsubscribeKonfirmasi();
    };
  }, []);

  // CRUD Penyewa
  const handleSubmitPenyewa = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await setDoc(doc(db, 'penyewa', editId), formPenyewa);
      } else {
        await setDoc(doc(db, 'penyewa', Date.now().toString()), formPenyewa);
      }
      setFormPenyewa({ nama: '', kamar: '', telpon: '' });
      setEditId(null);
      setShowModal(false);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleEditPenyewa = (data) => {
    setFormPenyewa({
      nama: data.nama,
      kamar: data.kamar,
      telpon: data.telpon
    });
    setEditId(data.id);
    setShowModal(true);
  };

  const handleDeletePenyewa = async (id) => {
    if (window.confirm('Hapus data penyewa ini?')) {
      await deleteDoc(doc(db, 'penyewa', id));
    }
  };

  // Update status pembayaran manual
  const handleUpdateStatus = async (kamar, month, status) => {
    const monthYear = `${month} ${currentYear}`;
    const paymentId = `${kamar}_${month}`;
    
    await setDoc(doc(db, 'pembayaran', paymentId), {
      penyewaId: kamar,
      bulan: monthYear,
      status,
      updatedAt: new Date()
    }, { merge: true });
  };

  // Konfirmasi pembayaran
  const handleVerifikasi = async (id, status) => {
    try {
      await updateDoc(doc(db, 'konfirmasi_pembayaran', id), { status });
    } catch (error) {
      console.error("Error verifying payment:", error);
    }
  };

  const handleDeleteKonfirmasi = async (id) => {
    if (window.confirm('Hapus konfirmasi ini?')) {
      await deleteDoc(doc(db, 'konfirmasi_pembayaran', id));
    }
  };

  const getStatus = (kamar, month) => {
    const monthYear = `${month} ${currentYear}`;
    const payment = pembayaran.find(p => 
      p.penyewaId === kamar && p.bulan === monthYear
    );
    return payment?.status || "Belum Bayar";
  };

  // Filter penyewa based on search query
  const filteredPenyewa = penyewa.filter(p => 
    p.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.kamar.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-blue-600 mb-8">
          Manajemen Pembayaran Kost
        </h1>
        
        {/* Tabs */}
        <div className="flex flex-wrap mb-6 gap-2 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('status')} 
            className={`px-4 py-2 rounded-t-lg transition ${activeTab === 'status' 
              ? 'bg-blue-500 text-white font-medium' 
              : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            <i className="ri-file-list-3-line mr-2"></i>
            Status Pembayaran
          </button>
          <button 
            onClick={() => setActiveTab('konfirmasi')} 
            className={`px-4 py-2 rounded-t-lg transition flex items-center ${activeTab === 'konfirmasi' 
              ? 'bg-blue-500 text-white font-medium' 
              : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            <i className="ri-check-double-line mr-2"></i>
            Konfirmasi
            {konfirmasi.filter(k => k.status === 'Pending').length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {konfirmasi.filter(k => k.status === 'Pending').length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('penyewa')} 
            className={`px-4 py-2 rounded-t-lg transition ${activeTab === 'penyewa' 
              ? 'bg-blue-500 text-white font-medium' 
              : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            <i className="ri-user-line mr-2"></i>
            Data Penyewa
          </button>
        </div>

        {/* Status Pembayaran Tab */}
        {activeTab === 'status' && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Status Pembayaran</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari nama atau nomor kamar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <i className="ri-search-line absolute left-3 top-2.5 text-gray-400"></i>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="sticky left-0 bg-gray-100 px-4 py-2 text-left text-sm font-medium z-10">Nama</th>
                    <th className="sticky left-20 bg-gray-100 px-4 py-2 text-left text-sm font-medium z-10">Kamar</th>
                    {months.map(month => (
                      <th key={month} className="px-4 py-2 text-left text-sm font-medium">{month}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPenyewa.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="sticky left-0 bg-white px-4 py-2 whitespace-nowrap z-10">{p.nama}</td>
                      <td className="sticky left-20 bg-white px-4 py-2 whitespace-nowrap z-10">{p.kamar}</td>
                      {months.map(month => (
                        <td key={month} className="px-2 py-2 whitespace-nowrap">
                          <select
                            value={getStatus(p.kamar, month)}
                            onChange={(e) => handleUpdateStatus(p.kamar, month, e.target.value)}
                            className={`p-1 border rounded-md text-sm w-full ${
                              getStatus(p.kamar, month) === 'Lunas' 
                                ? 'bg-green-100 border-green-300' 
                                : 'bg-red-100 border-red-300'
                            }`}
                          >
                            <option value="Lunas">Lunas</option>
                            <option value="Belum Bayar">Belum Bayar</option>
                          </select>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Konfirmasi Pembayaran Tab */}
        {activeTab === 'konfirmasi' && (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Konfirmasi Pembayaran</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium">Nama</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Kamar</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Bulan</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Waktu</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Bukti</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {konfirmasi.map(k => (
                    <tr key={k.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap">{k.nama}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{k.kamar}</td>
                      <td className="px-4 py-2">
                        {k.bulan.split(',').map((bulan, i) => (
                          <div key={i} className="text-sm">{bulan.trim()}</div>
                        ))}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{k.tanggalKonfirmasi || '-'}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {k.bukti && (
                          <button 
                            onClick={() => setSelectedImage(k.bukti)} 
                            className="text-blue-500 hover:text-blue-700 flex items-center text-sm"
                          >
                            <i className="ri-image-line mr-1"></i> Lihat
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          k.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          k.status === 'Diterima' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {k.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex space-x-2">
                          {k.status === 'Pending' && (
                            <>
                              <button 
                                onClick={() => handleVerifikasi(k.id, 'Diterima')} 
                                className="bg-green-500 text-white px-2 py-1 rounded text-xs flex items-center"
                              >
                                <i className="ri-check-line mr-1"></i> Terima
                              </button>
                              <button 
                                onClick={() => handleVerifikasi(k.id, 'Ditolak')} 
                                className="bg-red-500 text-white px-2 py-1 rounded text-xs flex items-center"
                              >
                                <i className="ri-close-line mr-1"></i> Tolak
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => handleDeleteKonfirmasi(k.id)} 
                            className="bg-gray-500 text-white px-2 py-1 rounded text-xs flex items-center"
                          >
                            <i className="ri-delete-bin-line mr-1"></i> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Data Penyewa Tab */}
        {activeTab === 'penyewa' && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Data Penyewa</h2>
              <button 
                onClick={() => { setEditId(null); setFormPenyewa({ nama: '', kamar: '', telpon: '' }); setShowModal(true); }} 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition"
              >
                <i className="ri-add-line mr-2"></i> Tambah Penyewa
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium">Nama</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Kamar</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Telpon</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {penyewa.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{p.nama}</td>
                      <td className="px-4 py-2">{p.kamar}</td>
                      <td className="px-4 py-2">{p.telpon}</td>
                      <td className="px-4 py-2">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEditPenyewa(p)} 
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs flex items-center"
                          >
                            <i className="ri-edit-line mr-1"></i> Edit
                          </button>
                          <button 
                            onClick={() => handleDeletePenyewa(p.id)} 
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs flex items-center"
                          >
                            <i className="ri-delete-bin-line mr-1"></i> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Penyewa Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{editId ? 'Edit Data Penyewa' : 'Tambah Data Penyewa'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmitPenyewa}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Nama:</label>
                <input
                  value={formPenyewa.nama}
                  onChange={(e) => setFormPenyewa({...formPenyewa, nama: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Kamar:</label>
                <input
                  value={formPenyewa.kamar}
                  onChange={(e) => setFormPenyewa({...formPenyewa, kamar: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">Telpon:</label>
                <input
                  value={formPenyewa.telpon}
                  onChange={(e) => setFormPenyewa({...formPenyewa, telpon: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                {editId && (
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)} 
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    Batal
                  </button>
                )}
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  {editId ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Image Preview */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-3xl max-h-full overflow-hidden">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Bukti Pembayaran</h3>
              <button onClick={() => setSelectedImage(null)} className="text-gray-500 hover:text-gray-700">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="overflow-auto">
              <img src={selectedImage} alt="Bukti Pembayaran" className="max-w-full h-auto" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}