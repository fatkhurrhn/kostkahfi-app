import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signOut, db, collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from '../../firebase';
import { useAuth } from '../../components/AuthContext';

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
    jenis: 'setoran' // New field
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const bulanList = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const tahunList = [2023, 2024, 2025];
  const pekanList = [1, 2, 3, 4];
  const jenisList = ['setoran', 'murojaah']; // New options

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
      }));
      setSetoranList(data);
    } catch (error) {
      console.error("Error fetching setoran:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error("Logout error:", err);
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
      await fetchSetoran();
    } catch (error) {
      console.error("Error saving setoran:", error);
    } finally {
      setLoading(false);
    }
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
      jenis: setoran.jenis || 'setoran', // Handle existing data
      createdAt: setoran.createdAt
    });
    setEditingId(setoran.id);
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
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Dashboard Admin</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 text-sm">{currentUser?.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          {/* Form Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              {editingId ? 'Edit Data' : 'Tambah Data Baru'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jenis</label>
                  <select
                    name="jenis"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
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
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
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
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
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
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
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
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
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
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
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
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
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
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
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
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Contoh: Halaman 15-17 atau Juz 1"
                  value={formData.halaman}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
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
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
                  >
                    Batal
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 text-sm"
                  disabled={loading}
                >
                  {loading ? 'Menyimpan...' : editingId ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>

          {/* Data Table Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Daftar Setoran/Murojaah</h2>
            </div>
            
            {loading ? (
              <div className="p-4 text-center text-gray-500">Memuat data...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ayat</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Halaman/Juz</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
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
                          <td className="px-6 py-4 whitespace-nowrap space-x-2">
                            <button
                              onClick={() => handleEdit(setoran)}
                              className="text-blue-500 hover:text-blue-700 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(setoran.id)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
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
    </div>
  );
}

export default Admin;