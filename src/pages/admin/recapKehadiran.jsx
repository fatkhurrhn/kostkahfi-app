import { useState, useEffect } from 'react';
import { db, collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from '../../firebase';
// import { useAuth } from '../../components/AuthContext';

const MAHASANTRI_LIST = [
  'Fathur', 'Faiz', 'Budiman', 'Khair', 
  'Romi', 'Ikhsan', 'Yazid', 'Sayyid', 'Sigma', 'Fano'
];

function RecapKehadiran() {
  const [kehadiranList, setKehadiranList] = useState([]);
  const [formData, setFormData] = useState({
    waktu: '',
    asatidz: 'Ustadz Khanzan',
    jenis: 'online',
    tema: '',
    peserta: MAHASANTRI_LIST.map(nama => ({
      nama,
      hadir: true,
      catatan: ''
    }))
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchKehadiran();
  }, []);

  const fetchKehadiran = async () => {
    try {
      setLoading(true);
      setError(null);
      const querySnapshot = await getDocs(collection(db, 'kehadiran_kajian'));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamp to Date object
        waktu: doc.data().waktu?.toDate() || null
      })).reverse(); // Tambahkan .reverse() di sini
      setKehadiranList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Gagal memuat data kehadiran");
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

  const handlePesertaChange = (index, field, value) => {
    const updatedPeserta = [...formData.peserta];
    updatedPeserta[index] = {
      ...updatedPeserta[index],
      [field]: field === 'hadir' ? !updatedPeserta[index].hadir : value
    };
    setFormData({
      ...formData,
      peserta: updatedPeserta
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validasi data sebelum submit
      if (!formData.waktu) {
        throw new Error("Waktu kajian harus diisi");
      }

      const dataToSave = {
        asatidz: formData.asatidz,
        jenis: formData.jenis,
        tema: formData.tema,
        peserta: formData.peserta,
        waktu: new Date(formData.waktu),
        updatedAt: new Date(),
        createdAt: formData.createdAt || new Date()
      };

      if (editingId) {
        await updateDoc(doc(db, 'kehadiran_kajian', editingId), dataToSave);
      } else {
        await addDoc(collection(db, 'kehadiran_kajian'), dataToSave);
      }

      resetForm();
      await fetchKehadiran();
    } catch (error) {
      console.error("Error saving data:", error);
      setError(error.message || "Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      waktu: '',
      asatidz: 'Ustadz Khanzan',
      jenis: 'online',
      tema: '',
      peserta: MAHASANTRI_LIST.map(nama => ({
        nama,
        hadir: true,
        catatan: ''
      }))
    });
    setEditingId(null);
    setError(null);
  };

  const handleEdit = (data) => {
    try {
      // Format waktu untuk input datetime-local
      const waktuFormatted = data.waktu 
        ? new Date(data.waktu).toISOString().slice(0, 16) 
        : '';
      
      setFormData({
        ...data,
        waktu: waktuFormatted,
        // Pastikan peserta selalu ada
        peserta: data.peserta || MAHASANTRI_LIST.map(nama => ({ 
          nama, 
          hadir: true, 
          catatan: '' 
        }))
      });
      setEditingId(data.id);
      setError(null);
    } catch (error) {
      console.error("Error preparing edit form:", error);
      setError("Gagal mempersiapkan form edit");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        await deleteDoc(doc(db, 'kehadiran_kajian', id));
        await fetchKehadiran();
      } catch (error) {
        console.error("Error deleting data:", error);
        setError("Gagal menghapus data");
      }
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          {editingId ? 'Edit Data Kehadiran' : 'Tambah Data Kehadiran Baru'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Kajian*</label>
              <input
                type="datetime-local"
                name="waktu"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={formData.waktu}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asatidz*</label>
              <select
                name="asatidz"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={formData.asatidz}
                onChange={handleInputChange}
                required
              >
                <option value="Ustadz Khanzan">Ustadz Khanzan</option>
                <option value="Ustadz Haidir">Ustadz Haidir</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kajian*</label>
              <select
                name="jenis"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={formData.jenis}
                onChange={handleInputChange}
                required
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tema/Materi Kajian*</label>
            <input
              type="text"
              name="tema"
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              value={formData.tema}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-md font-medium text-gray-700 mb-3">Daftar Kehadiran Mahasantri</h3>
            <div className="space-y-3">
              {formData.peserta.map((peserta, index) => (
                <div key={peserta.nama} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 w-24">{peserta.nama}</span>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={peserta.hadir}
                        onChange={() => handlePesertaChange(index, 'hadir')}
                        className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Hadir</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Catatan"
                      className="p-2 border border-gray-300 rounded-md text-sm flex-1 max-w-xs"
                      value={peserta.catatan}
                      onChange={(e) => handlePesertaChange(index, 'catatan', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Rekap Kehadiran Kajian</h2>
        </div>
        
        {loading ? (
          <div className="p-4 text-center text-gray-500">Memuat data...</div>
        ) : kehadiranList.length === 0 ? (
          <div className="p-4 text-center text-gray-500">Belum ada data kehadiran</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asatidz</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tema</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peserta Hadir</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {kehadiranList.map((data) => (
                  <tr key={data.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{formatDate(data.waktu)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{data.asatidz}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        data.jenis === 'online' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {data.jenis}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">{data.tema}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        {data.peserta?.filter(p => p.hadir).length || 0} dari {data.peserta?.length || 0} mahasantri
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleEdit(data)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(data.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecapKehadiran;