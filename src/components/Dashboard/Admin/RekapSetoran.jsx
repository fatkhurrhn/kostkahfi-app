import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signOut, db, collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from '../../../firebase';
import { useAuth } from '../../../context/AuthContext';
import Navbar from './AdminNavbar';

function Admin() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [setoranList, setSetoranList] = useState([]);
  const [formData, setFormData] = useState({
    pekan: '',
    bulan: '',
    tahun: '',
    nama: '',
    ayatMulai: '',
    ayatSelesai: '',
    halaman: '',
    metode: 'online',
    jenis: 'setoran'
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const bulanList = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const tahunList = [2023, 2024, 2025];
  const pekanList = [1, 2, 3, 4];
  const jenisList = ['setoran', 'murojaah'];

  useEffect(() => {
    fetchSetoran();
  }, []);

  const fetchSetoran = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'setoran'));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).reverse();
      setSetoranList(data);
    } catch (error) {
      console.error("Error fetching setoran:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const setoranData = {
        ...formData,
        pekan: parseInt(formData.pekan),
        tahun: parseInt(formData.tahun),
        createdAt: formData.createdAt || new Date(),
        updatedAt: new Date()
      };

      if (editingId) {
        await updateDoc(doc(db, 'setoran', editingId), setoranData);
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'setoran'), setoranData);
      }

      resetForm();
      await fetchSetoran();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving setoran:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      pekan: '',
      bulan: '',
      tahun: '',
      nama: '',
      ayatMulai: '',
      ayatSelesai: '',
      halaman: '',
      metode: 'online',
      jenis: 'setoran'
    });
  };

  const handleEdit = (setoran) => {
    setFormData({
      pekan: setoran.pekan.toString(),
      bulan: setoran.bulan,
      tahun: setoran.tahun.toString(),
      nama: setoran.nama,
      ayatMulai: setoran.ayatMulai,
      ayatSelesai: setoran.ayatSelesai,
      halaman: setoran.halaman,
      metode: setoran.metode,
      jenis: setoran.jenis || 'setoran',
      createdAt: setoran.createdAt
    });
    setEditingId(setoran.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus setoran ini?')) {
      try {
        await deleteDoc(doc(db, 'setoran', id));
        await fetchSetoran();
      } catch (error) {
        console.error("Error deleting setoran:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
{/* Add Data Header & Button */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
  <h2 className="text-lg font-semibold text-gray-800">Daftar Setoran / Murojaah</h2>
  
  <button
    onClick={() => {
      resetForm();
      setEditingId(null);
      setShowModal(true);
    }}
    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex items-center shadow-sm transition duration-150"
  >
    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
    Tambah Data Baru
  </button>
</div>


          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
 

  {loading ? (
    <div className="p-4 text-center text-gray-500">Memuat data...</div>
  ) : (
    <div className="overflow-x-auto">
      <table className="min-w-[800px] w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ayat</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Halaman/Juz</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metode</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {setoranList.length > 0 ? (
            setoranList.map((setoran) => (
              <tr key={setoran.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    setoran.jenis === 'setoran'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {setoran.jenis || 'setoran'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{setoran.nama}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-700">
                    {setoran.ayatMulai} - {setoran.ayatSelesai}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{setoran.halaman}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">
                    Pekan {setoran.pekan}<br />
                    {setoran.bulan} {setoran.tahun}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    setoran.metode === 'online'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {setoran.metode}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-y-2 flex flex-col items-start">
  <button
    onClick={() => handleEdit(setoran)}
    className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
  >
    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
    Edit
  </button>
  <button
    onClick={() => handleDelete(setoran.id)}
    className="text-red-500 hover:text-red-700 text-sm flex items-center"
  >
    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
    Hapus
  </button>
</td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                Tidak ada data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )}
</div>

        </div>
      </main>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {editingId ? 'Edit Data' : 'Tambah Data Baru'}
                </h3>
                <button 
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                    setEditingId(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jenis</label>
                    <select
                      name="jenis"
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                      value={formData.jenis}
                      onChange={handleInputChange}
                      required
                    >
                      {jenisList.map(jenis => (
                        <option key={jenis} value={jenis}>
                          {jenis.charAt(0).toUpperCase() + jenis.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pekan</label>
                    <select
                      name="pekan"
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                      value={formData.pekan}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Pilih Pekan</option>
                      {pekanList.map(pekan => (
                        <option key={pekan} value={pekan}>Pekan {pekan}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
                    <select
                      name="bulan"
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                      value={formData.bulan}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Pilih Bulan</option>
                      {bulanList.map(bulan => (
                        <option key={bulan} value={bulan}>{bulan}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                    <select
                      name="tahun"
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                      value={formData.tahun}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Pilih Tahun</option>
                      {tahunList.map(tahun => (
                        <option key={tahun} value={tahun}>{tahun}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Metode</label>
                    <select
                      name="metode"
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                      value={formData.metode}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                  <input
                    type="text"
                    name="nama"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    value={formData.nama}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ayat Mulai</label>
                    <input
                      type="text"
                      name="ayatMulai"
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Contoh: Al-Baqarah: 1"
                      value={formData.ayatMulai}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ayat Selesai</label>
                    <input
                      type="text"
                      name="ayatSelesai"
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Contoh: Al-Baqarah: 10"
                      value={formData.ayatSelesai}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Halaman/Juz</label>
                  <input
                    type="text"
                    name="halaman"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: Halaman 15-17 atau Juz 1"
                    value={formData.halaman}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                      setEditingId(null);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 text-sm flex items-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {editingId ? 'Updating...' : 'Menyimpan...'}
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        {editingId ? 'Update' : 'Simpan'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;