import { useState, useEffect } from 'react';
import { db, collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from '../../../firebase';
import Navbar from './AdminNavbar';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        waktu: doc.data().waktu?.toDate() || null
      })).reverse();
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
      setIsModalOpen(false);
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
      const waktuFormatted = data.waktu
        ? new Date(data.waktu).toISOString().slice(0, 16)
        : '';

      setFormData({
        ...data,
        waktu: waktuFormatted,
        peserta: data.peserta || MAHASANTRI_LIST.map(nama => ({
          nama,
          hadir: true,
          catatan: ''
        }))
      });
      setEditingId(data.id);
      setError(null);
      setIsModalOpen(true);
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

  const formatShortDate = (date) => {
    if (!date) return '-';
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </button>
        </div>
      )}
      
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Rekap Kehadiran Kajian</h1>
          <button
            onClick={openModal}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Tambah Data
          </button>
        </div>

        {/* Data Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Daftar Kehadiran Kajian</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Rekapitulasi kehadiran mahasantri dalam kajian</p>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Memuat data...</span>
              </div>
            </div>
          ) : kehadiranList.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada data kehadiran</h3>
              <p className="mt-1 text-sm text-gray-500">Mulai dengan menambahkan data kehadiran baru.</p>
              <div className="mt-6">
                <button
                  onClick={openModal}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Tambah Data
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Desktop Table */}
              <table className="hidden md:table min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asatidz</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tema</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kehadiran</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {kehadiranList.map((data) => (
                    <tr key={data.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(data.waktu)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{data.asatidz}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          data.jenis === 'online' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {data.jenis}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{data.tema}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <span className="font-medium">{data.peserta?.filter(p => p.hadir).length || 0}</span> / {data.peserta?.length || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(data)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(data.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-200">
                {kehadiranList.map((data) => (
                  <div key={data.id} className="px-4 py-5 sm:p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className={`flex-shrink-0 h-4 w-4 rounded-full ${
                          data.jenis === 'online' ? 'bg-blue-400' : 'bg-green-400'
                        }`}></span>
                        <span className="ml-2 text-sm font-medium text-gray-900 truncate">{formatShortDate(data.waktu)}</span>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <button
                          onClick={() => handleEdit(data)}
                          className="mr-3 text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(data.id)}
                          className="text-sm font-medium text-red-600 hover:text-red-500"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <div className="mr-6 flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          {data.asatidz}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span>
                          {data.peserta?.filter(p => p.hadir).length || 0} / {data.peserta?.length || 0} hadir
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-900">
                      <p className="truncate">{data.tema}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
  <div className="fixed inset-0 z-50 overflow-y-auto">
    {/* Overlay */}
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
      onClick={closeModal}
      aria-hidden="true"
    ></div>

    {/* Modal container */}
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      {/* Modal content */}
      <div className="inline-block bg-white rounded-t-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:rounded-lg sm:p-6 w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            {editingId ? 'Edit Kehadiran' : 'Tambah Kehadiran'}
          </h3>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Tutup"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form grid - single column on mobile */}
          <div className="space-y-4">
            {/* Waktu Kajian */}
            <div>
              <label htmlFor="waktu" className="block text-sm font-medium text-gray-700 mb-1">
                Waktu Kajian <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="waktu"
                id="waktu"
                className="w-full p-2 border bg-white text-gray-800 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={formData.waktu}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Asatidz */}
            <div>
              <label htmlFor="asatidz" className="block text-sm font-medium text-gray-700 mb-1">
                Asatidz <span className="text-red-500">*</span>
              </label>
              <select
                id="asatidz"
                name="asatidz"
                className="w-full p-2  bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={formData.asatidz}
                onChange={handleInputChange}
                required
              >
                <option value="">Pilih Asatidz</option>
                <option value="Ustadz Khanzan">Ustadz Khanzan</option>
                <option value="Ustadz Haidir">Ustadz Haidir</option>
              </select>
            </div>

            {/* Jenis Kajian */}
            <div>
              <label htmlFor="jenis" className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Kajian <span className="text-red-500">*</span>
              </label>
              <select
                id="jenis"
                name="jenis"
                className="w-full p-2 border bg-white text-gray-800 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={formData.jenis}
                onChange={handleInputChange}
                required
              >
                <option value="">Pilih Jenis</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>

            {/* Tema Kajian */}
            <div>
              <label htmlFor="tema" className="block text-sm font-medium text-gray-700 mb-1">
                Tema Kajian <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="tema"
                id="tema"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={formData.tema}
                onChange={handleInputChange}
                required
                placeholder="Masukkan tema kajian"
              />
            </div>
          </div>

          {/* Daftar Kehadiran */}
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h3 className="text-md font-semibold text-gray-800 mb-3">Daftar Kehadiran</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {formData.peserta.map((peserta, index) => (
                <div 
                  key={peserta.nama} 
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${peserta.hadir ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'}`}
                  onClick={() => handlePesertaChange(index, 'hadir')}
                >
                  <span className="text-sm font-medium text-gray-700">{peserta.nama}</span>
                  <div className="relative">
                    {/* Custom checkbox */}
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${peserta.hadir ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                      {peserta.hadir && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={peserta.hadir}
                      onChange={() => handlePesertaChange(index, 'hadir')}
                      className="absolute opacity-0 w-full h-full top-0 left-0 cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded-lg shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </>
              ) : editingId ? 'Update' : 'Simpan'}
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

export default RecapKehadiran;