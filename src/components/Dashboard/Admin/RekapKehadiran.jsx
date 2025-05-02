import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { db, collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from '../../../firebase';

const MAHASANTRI_LIST = [
  'Fathur', 'Faiz', 'Budiman', 'Khair',
  'Romi', 'Ikhsan', 'Yazid', 'Sayyid', 'Sigma', 'Fano'
];

export default function RecapKehadiran() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
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
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    try {
      await deleteDoc(doc(db, 'kehadiran_kajian', id));
      await fetchKehadiran();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting data:", error);
      setError("Gagal menghapus data");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/mahasantri');
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
      {/* Navbar */}
      <nav className="bg-gray-800 text-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Navbar */}
          <div className="hidden md:flex h-16 items-center justify-between">
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => navigate('/dashboard-admin/')}
            >
              <i className="ri-dashboard-line text-xl mr-2"></i>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <i className="ri-user-line"></i>
                <span className="hidden sm:inline">Welcome,</span>
                <span className="font-medium">{currentUser?.nama}</span>
              </div>
              <button 
                onClick={() => setShowLogoutModal(true)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out flex items-center"
              >
                <i className="ri-logout-box-r-line mr-2"></i>
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Navbar */}
          <div className="md:hidden flex h-16 items-center justify-between">
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => navigate('/dashboard-admin/')}
            >
              <i className="ri-dashboard-line text-lg mr-2"></i>
              <h1 className="text-lg font-bold">Admin Panel</h1>
            </div>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <i className="ri-close-line text-xl"></i>
              ) : (
                <i className="ri-menu-line text-xl"></i>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Slide from right */}
        <div className={`md:hidden fixed inset-y-0 right-0 w-64 bg-gray-800 shadow-xl transform ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
          <div className="flex flex-col h-full p-4">
            <div className="flex justify-between items-center border-b border-gray-700 pb-4">
              <div className="flex items-center">
                <i className="ri-user-line mr-2"></i>
                <span>{currentUser?.nama}</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            
            <div className="flex-1 flex flex-col justify-between py-4">
              <div>
                <Link to="/dashboard-admin/" className="block w-full text-left px-4 py-1 text-sm font-medium rounded-md hover:bg-gray-700 mb-1 flex items-center">Home 
                </Link>
                <Link to="/dashboard-admin/kehadiran-kajian" className="block w-full text-left px-4 py-1 text-sm font-medium rounded-md hover:bg-gray-700 mb-1 flex items-center">Rekap Kehadiran 
                </Link>
                <Link to="/dashboard-admin/setoran" className="block w-full text-left px-4 py-1 text-sm font-medium rounded-md hover:bg-gray-700 mb-1 flex items-center">Rekap Setoran 
                </Link>
              </div>
              
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowLogoutModal(true);
                }}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 flex items-center"
              >
                <i className="ri-logout-box-r-line mr-3"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
        
        {/* Overlay when mobile menu is open */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
        )}
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-4 md:p-6">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 mb-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center">
            Admin Dashboard
          </h1>
          <p className="flex items-center">
            <i className="ri-user-smile-line mr-2"></i>
            Welcome back, {currentUser?.nama || 'Admin'}!
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="ri-error-warning-line text-red-500 text-xl"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="mt-2 text-sm text-red-700 underline hover:text-red-600"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Data Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <nav className="text-xl md:text-2xl font-semibold text-gray-800 mb-4" aria-label="Breadcrumb">
  <ol className="list-reset flex items-center space-x-2">
    <li>
      <a href="/dashboard-admin" className="text-blue-600 hover:underline">Home</a>
    </li>
    <li>/</li>
    <li className="text-gray-800 font-semibold">Daftar Kehadiran</li>
  </ol>
</nav>
                <p className="text-gray-600 mt-1 flex items-center">
                  <i className="ri-database-line mr-1"></i>
                  {kehadiranList.length} data ditemukan
                </p>
              </div>
              
              <button
                onClick={openModal}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md hover:from-blue-600 hover:to-blue-700 transition text-center flex items-center justify-center shadow-md"
              >
                <i className="ri-add-line mr-2"></i>
                Tambah Data
              </button>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <i className="ri-loader-4-line animate-spin text-4xl text-blue-500"></i>
            </div>
          ) : kehadiranList.length === 0 ? (
            <div className="text-center py-12 text-gray-500 flex flex-col items-center">
              <i className="ri-calendar-2-line text-4xl text-gray-300 mb-4"></i>
              <p className="text-lg">Belum ada data kehadiran</p>
              <button 
                onClick={openModal}
                className="mt-4 text-blue-500 hover:text-blue-700 flex items-center"
              >
                <i className="ri-add-line mr-2"></i>
                Tambah Data
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Desktop Table */}
              <table className="hidden md:table min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <i className="ri-time-line mr-1"></i> Waktu
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <i className="ri-user-line mr-1"></i> Asatidz
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <i className="ri-computer-line mr-1"></i> Jenis
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <i className="ri-book-mark-line mr-1"></i> Tema
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <i className="ri-group-line mr-1"></i> Kehadiran
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <i className="ri-settings-2-line mr-1"></i> Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {kehadiranList.map((data) => (
                    <tr key={data.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">{formatDate(data.waktu)}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{data.asatidz}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          data.jenis === 'online' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {data.jenis}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{data.tema}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <span className="font-medium">{data.peserta?.filter(p => p.hadir).length || 0}</span> / {data.peserta?.length || 0}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(data)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <i className="ri-edit-line mr-1"></i>
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedId(data.id);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900 flex items-center"
                        >
                          <i className="ri-delete-bin-line mr-1"></i>
                          <span className="hidden sm:inline">Hapus</span>
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
                          className="mr-3 text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
                        >
                          <i className="ri-edit-line mr-1"></i>
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedId(data.id);
                            setShowDeleteModal(true);
                          }}
                          className="text-sm font-medium text-red-600 hover:text-red-500 flex items-center"
                        >
                          <i className="ri-delete-bin-line mr-1"></i>
                          Hapus
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <div className="mr-6 flex items-center text-sm text-gray-500">
                          <i className="ri-user-line mr-1"></i>
                          {data.asatidz}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <i className="ri-group-line mr-1"></i>
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

      {/* Add/Edit Data Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {editingId ? 'Edit Kehadiran' : 'Tambah Kehadiran'}
                </h3>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <i className="ri-time-line mr-1"></i> Waktu Kajian <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="waktu"
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                      value={formData.waktu}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <i className="ri-user-line mr-1"></i> Asatidz <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="asatidz"
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                      value={formData.asatidz}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Ustadz Khanzan">Ustadz Khanzan</option>
                      <option value="Ustadz Haidir">Ustadz Haidir</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <i className="ri-computer-line mr-1"></i> Jenis Kajian <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="jenis"
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                      value={formData.jenis}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <i className="ri-book-mark-line mr-1"></i> Tema Kajian <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="tema"
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                      value={formData.tema}
                      onChange={handleInputChange}
                      required
                      placeholder="Masukkan tema kajian"
                    />
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-4">
                  <h3 className="text-md font-semibold text-gray-800 mb-3">
                    <i className="ri-group-line mr-1"></i> Daftar Kehadiran
                  </h3>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {formData.peserta.map((peserta, index) => (
                      <div 
                        key={peserta.nama} 
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${peserta.hadir ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'}`}
                        onClick={() => handlePesertaChange(index, 'hadir')}
                      >
                        <span className="text-sm font-medium text-gray-700">{peserta.nama}</span>
                        <div className="relative">
                          <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${peserta.hadir ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                            {peserta.hadir && (
                              <i className="ri-check-line text-white text-sm"></i>
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

                <div className="mt-6 flex justify-end space-x-2 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
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
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        {editingId ? 'Updating...' : 'Menyimpan...'}
                      </>
                    ) : (
                      <>
                        <i className="ri-save-line mr-2"></i>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600">
                <i className="ri-delete-bin-line text-xl"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Konfirmasi Hapus</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Apakah Anda yakin ingin menghapus data kehadiran ini? Tindakan ini tidak dapat dibatalkan.</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleDelete(selectedId)}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              >
                <i className="ri-delete-bin-line mr-2"></i>
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600">
                <i className="ri-logout-box-r-line text-xl"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Konfirmasi Logout</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Apakah Anda yakin ingin logout dari admin panel?</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              >
                <i className="ri-logout-box-r-line mr-2"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}