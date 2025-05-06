import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db, collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from '../../../firebase';
import { useAuth } from '../../../context/AuthContext';

// Constants
const bulanList = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const tahunList = [2025, 2026, 2027];
const pekanList = [1, 2, 3, 4];
const jenisList = ['setoran', 'murojaah'];

// Helper functions
const getCurrentPekan = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const diffDays = Math.floor((now - firstDay) / (1000 * 60 * 60 * 24));
  return Math.min(Math.floor(diffDays / 7) + 1, 4); // Ensure max pekan is 4
};

const initFormData = () => {
  const now = new Date();
  return {
    pekan: getCurrentPekan().toString(),
    bulan: bulanList[now.getMonth()],
    tahun: now.getFullYear().toString(),
    nama: '',
    ayatMulai: '',
    ayatSelesai: '',
    halaman: '',
    metode: 'online',
    jenis: 'setoran'
  };
};

export default function Admin() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [setoranList, setSetoranList] = useState([]);
  const [formData, setFormData] = useState(initFormData());
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchSetoran();
  }, []);

  const fetchSetoran = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'setoran'));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        bulanIndex: bulanList.indexOf(doc.data().bulan)
      }))
        .sort((a, b) => {
          if (a.tahun !== b.tahun) return b.tahun - a.tahun;
          if (a.bulanIndex !== b.bulanIndex) return b.bulanIndex - a.bulanIndex;
          return b.pekan - a.pekan;
        });
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
        bulanIndex: bulanList.indexOf(formData.bulan),
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
    setFormData(initFormData());
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

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'setoran', selectedId));
      await fetchSetoran();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting setoran:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/mahasantri');
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

        {/* Data Management Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                {/* <h2 className="text-xl md:text-2xl font-semibold text-gray-800 flex items-center">
                  <a href="/dashboard-admin/">Home </a>/ Daftar Hafalan Santri
                </h2> */}
                <nav className="text-xl md:text-2xl font-semibold text-gray-800 mb-4" aria-label="Breadcrumb">
                  <ol className="list-reset flex items-center space-x-2">
                    <li>
                      <a href="/dashboard-admin" className="text-blue-600 hover:underline">Home</a>
                    </li>
                    <li>/</li>
                    <li className="text-gray-800 font-semibold">Daftar Hafalan Santri</li>
                  </ol>
                </nav>
                <p className="text-gray-600 mt-1 flex items-center">
                  <i className="ri-database-line mr-1"></i>
                  {setoranList.length} data ditemukan
                </p>
              </div>

              <button
                onClick={() => {
                  resetForm();
                  setEditingId(null);
                  setShowModal(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md hover:from-blue-600 hover:to-blue-700 transition text-center flex items-center justify-center shadow-md"
              >
                <i className="ri-add-line mr-2"></i>
                Tambah Data Baru
              </button>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <i className="ri-loader-4-line animate-spin text-4xl text-blue-500"></i>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jenis
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ayat
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Halaman/Juz
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Waktu
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Metode
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {setoranList.length > 0 ? (
                    setoranList.map((setoran) => (
                      <tr key={setoran.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${setoran.jenis === 'setoran'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {setoran.jenis || 'setoran'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
                            {setoran.nama}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-700 whitespace-nowrap">
                            {setoran.ayatMulai} - {setoran.ayatSelesai}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-700">
                            {setoran.halaman}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-700 whitespace-nowrap">
                            Pekan {setoran.pekan}<br />
                            {setoran.bulan} {setoran.tahun}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${setoran.metode === 'online'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                            }`}>
                            {setoran.metode}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex flex-col items-start space-y-2">
                            <button
                              onClick={() => handleEdit(setoran)}
                              className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
                            >
                              <i className="ri-edit-line mr-1"></i>
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedId(setoran.id);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-500 hover:text-red-700 text-sm flex items-center"
                            >
                              <i className="ri-delete-bin-line mr-1"></i>
                              <span className="hidden sm:inline">Hapus</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500 flex flex-col items-center">
                        <i className="ri-database-2-line text-4xl text-gray-300 mb-2"></i>
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

      {/* Add/Edit Data Modal */}
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
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jenis</label>
                    <select
                      name="jenis"
                      className="w-full p-2 border border-gray-300 bg-white text-gray-800 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full p-2 border border-gray-300 bg-white text-gray-800 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full p-2 border border-gray-300 bg-white text-gray-800 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full p-2 border border-gray-300 bg-white text-gray-800 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full p-2 border border-gray-300 bg-white text-gray-800 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full p-2 border border-gray-300 bg-white text-gray-800 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full p-2 border border-gray-300 bg-white text-gray-800 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full p-2 border border-gray-300 bg-white text-gray-800 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Contoh: Al-Baqarah: 10"
                      value={formData.ayatSelesai}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Halaman</label>
                  <input
                    type="text"
                    name="halaman"
                    className="w-full p-2 border border-gray-300 bg-white text-gray-800 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: 1 halaman"
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
                  <p className="text-sm text-gray-500">Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
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
                className="px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
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