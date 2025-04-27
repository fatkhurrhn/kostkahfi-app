import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase';
import { FiEdit, FiTrash2, FiPlus, FiX, FiSearch } from 'react-icons/fi';

export default function AdminDataPenyewa() {
  const [penyewa, setPenyewa] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nama: '',
    jenis_kelamin: '',
    kategori: 'kost_biasa',
    foto: '',
    kamarNo: '',
    asal: '',
    sejak: '',
    tipe: 'kuliah',
    kampus: '',
    perusahaan: ''
  });
  const [editId, setEditId] = useState(null);

  // Fetch data dengan sorting terbaru di atas
  const fetchPenyewa = async () => {
    const q = query(collection(db, 'data_penyewa_kost'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPenyewa(data);
  };

  useEffect(() => { fetchPenyewa(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = { 
        ...formData,
        createdAt: serverTimestamp(),
        status: 'aktif'
      };

      if (editId) {
        await updateDoc(doc(db, 'data_penyewa_kost', editId), dataToSubmit);
      } else {
        await addDoc(collection(db, 'data_penyewa_kost'), dataToSubmit);
      }

      resetForm();
      fetchPenyewa();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      nama: '',
      jenis_kelamin: '',
      kategori: 'kost_biasa',
      foto: '',
      kamarNo: '',
      asal: '',
      sejak: '',
      tipe: 'kuliah',
      kampus: '',
      perusahaan: ''
    });
    setEditId(null);
    setIsModalOpen(false);
  };

  const handleEdit = (item) => {
    setFormData({
      nama: item.nama,
      jenis_kelamin: item.jenis_kelamin,
      kategori: item.kategori,
      foto: item.foto || '',
      kamarNo: item.kamarNo,
      asal: item.asal || '',
      sejak: item.sejak || '',
      tipe: item.tipe || 'kuliah',
      kampus: item.kampus || '',
      perusahaan: item.perusahaan || ''
    });
    setEditId(item.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus data penyewa ini?')) {
      await deleteDoc(doc(db, 'data_penyewa_kost', id));
      fetchPenyewa();
    }
  };

  const filteredPenyewa = penyewa.filter(item => 
    item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kamarNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Data Penyewa Kost</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FiPlus /> Tambah Penyewa
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Cari nama atau no kamar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full md:w-1/3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {editId ? 'Edit Penyewa' : 'Tambah Penyewa'}
              </h3>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Nama */}
                <div>
                  <label className="block mb-1">Nama Lengkap*</label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>

                {/* Jenis Kelamin & Kategori */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Jenis Kelamin*</label>
                    <select
                      name="jenis_kelamin"
                      value={formData.jenis_kelamin}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Pilih</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">Kategori*</label>
                    <select
                      name="kategori"
                      value={formData.kategori}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border rounded"
                    >
                      <option value="kost_biasa">Kost Biasa</option>
                      <option value="mahasantri">Mahasantri</option>
                      <option value="biman">BIMAN</option>
                    </select>
                  </div>
                </div>

                {/* Foto & Kamar */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Foto (URL)</label>
                    <input
                      type="text"
                      name="foto"
                      value={formData.foto}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">No Kamar*</label>
                    <input
                      type="text"
                      name="kamarNo"
                      value={formData.kamarNo}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>

                {/* Asal & Sejak */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Asal</label>
                    <input
                      type="text"
                      name="asal"
                      value={formData.asal}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Sejak*</label>
                    <input
                      type="text"
                      name="sejak"
                      value={formData.sejak}
                      onChange={handleInputChange}
                      placeholder="Contoh: Jan 2023"
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>

                {/* Tipe */}
                <div>
                  <label className="block mb-1">Tipe*</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="tipe"
                        value="kuliah"
                        checked={formData.tipe === 'kuliah'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Kuliah
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="tipe"
                        value="kerja"
                        checked={formData.tipe === 'kerja'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Kerja
                    </label>
                  </div>
                </div>

                {/* Kampus/Perusahaan */}
                {formData.tipe === 'kuliah' ? (
                  <div>
                    <label className="block mb-1">Nama Kampus</label>
                    <input
                      type="text"
                      name="kampus"
                      value={formData.kampus}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block mb-1">Nama Perusahaan</label>
                    <input
                      type="text"
                      name="perusahaan"
                      value={formData.perusahaan}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {editId ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabel Data */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Foto</th>
              <th className="px-6 py-3 text-left">Nama</th>
              <th className="px-6 py-3 text-left">Jenis Kelamin</th>
              <th className="px-6 py-3 text-left">Kategori</th>
              <th className="px-6 py-3 text-left">No Kamar</th>
              <th className="px-6 py-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPenyewa.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4">
                  {item.foto && (
                    <img 
                      src={item.foto} 
                      alt={item.nama} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                </td>
                <td className="px-6 py-4 font-medium">{item.nama}</td>
                <td className="px-6 py-4">{item.jenis_kelamin}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.kategori === 'mahasantri' ? 'bg-blue-100 text-blue-800' :
                    item.kategori === 'biman' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.kategori}
                  </span>
                </td>
                <td className="px-6 py-4">{item.kamarNo}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}