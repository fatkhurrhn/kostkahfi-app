import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  query, 
  where, 
  doc, 
  deleteDoc,
  addDoc,
  updateDoc
} from 'firebase/firestore';
import Layout from '../../components/admin/Layout';

export default function DashboardAdmin() {
    const [penghuni, setPenghuni] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
    const [selectedPenghuni, setSelectedPenghuni] = useState(null);
    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        noTlp: '',
        tglMasuk: '',
        role: 'reguler'
    });
    const navigate = useNavigate();

    // Format date function
    const formatDate = (date) => {
        if (!date) return '-';
        if (date.toDate) return date.toDate().toLocaleDateString('id-ID');
        if (typeof date === 'string') return new Date(date).toLocaleDateString('id-ID');
        return '-';
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle delete penghuni
    const handleDelete = async () => {
        if (!selectedPenghuni) return;
        
        try {
            const db = getFirestore(app);
            await deleteDoc(doc(db, 'users', selectedPenghuni.id));
            setPenghuni(prev => prev.filter(p => p.id !== selectedPenghuni.id));
            setShowDeleteModal(false);
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const db = getFirestore(app);
            
            if (formMode === 'add') {
                // Add new penghuni
                const docRef = await addDoc(collection(db, 'users'), {
                    ...formData,
                    createdAt: new Date()
                });
                setPenghuni(prev => [...prev, { id: docRef.id, ...formData }]);
            } else {
                // Update existing penghuni
                await updateDoc(doc(db, 'users', selectedPenghuni.id), formData);
                setPenghuni(prev => prev.map(p => 
                    p.id === selectedPenghuni.id ? { ...p, ...formData } : p
                ));
            }
            
            setShowFormModal(false);
        } catch (error) {
            console.error("Error saving document: ", error);
        }
    };

    // Open form in edit mode
    const openEditForm = (penghuni) => {
        setSelectedPenghuni(penghuni);
        setFormMode('edit');
        setFormData({
            nama: penghuni.nama || '',
            email: penghuni.email || '',
            noTlp: penghuni.noTlp || '',
            tglMasuk: penghuni.tglMasuk || '',
            role: penghuni.role || 'reguler'
        });
        setShowFormModal(true);
    };

    // Open form in add mode
    const openAddForm = () => {
        setSelectedPenghuni(null);
        setFormMode('add');
        setFormData({
            nama: '',
            email: '',
            noTlp: '',
            tglMasuk: '',
            role: 'reguler'
        });
        setShowFormModal(true);
    };

    useEffect(() => {
        const auth = getAuth(app);
        const db = getFirestore(app);

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                navigate('/login');
                return;
            }

            try {
                // Verify admin role
                const q = query(
                    collection(db, 'users'),
                    where('uid', '==', currentUser.uid)
                );
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const userData = querySnapshot.docs[0].data();
                    if (userData.role !== 'admin') {
                        navigate('/dashboard-users');
                        return;
                    }

                    // Get all penghuni data
                    const penghuniSnapshot = await getDocs(collection(db, 'users'));
                    const penghuniData = penghuniSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setPenghuni(penghuniData);
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <i className="ri-loader-4-line animate-spin text-4xl text-gray-700"></i>
            </div>
        );
    }

    return (
        <Layout>
            <div className="max-w-full mx-auto">
                {/* Table Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                        <i className="ri-group-line mr-2"></i>Manajemen Penghuni
                    </h2>
                    <button
                        onClick={openAddForm}
                        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm flex items-center"
                    >
                        <i className="ri-user-add-line mr-2"></i>Tambah Penghuni
                    </button>
                </div>

                {/* Penghuni Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nama
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        No. Telepon
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tanggal Masuk
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {penghuni.length > 0 ? (
                                    penghuni.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {item.nama || '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                {item.email || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                {item.noTlp || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                {formatDate(item.tglMasuk)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${item.role === 'admin' ? 'bg-gray-200 text-gray-800' : 
                                                      item.role === 'mahasantri' ? 'bg-gray-200 text-gray-800' : 
                                                      item.role === 'biman' ? 'bg-gray-200 text-gray-800' : 
                                                      'bg-gray-200 text-gray-800'}`}>
                                                    {item.role || 'reguler'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => openEditForm(item)}
                                                        className="text-gray-600 hover:text-gray-900"
                                                    >
                                                        <i className="ri-edit-line"></i>
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedPenghuni(item);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        className="text-gray-600 hover:text-gray-900"
                                                    >
                                                        <i className="ri-delete-bin-line"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                            Tidak ada data penghuni
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full border border-gray-200">
                        <div className="flex items-center mb-4">
                            <div className="bg-gray-100 p-2 rounded-full mr-3">
                                <i className="ri-error-warning-line text-gray-600 text-xl"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Konfirmasi Hapus</h3>
                        </div>
                        <p className="mb-6 text-gray-600">Apakah Anda yakin ingin menghapus penghuni <span className="font-semibold">{selectedPenghuni?.nama}</span>?</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Form Modal */}
            {showFormModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {formMode === 'add' ? 'Tambah Penghuni' : 'Edit Penghuni'}
                            </h3>
                            <button 
                                onClick={() => setShowFormModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                                    <input
                                        type="text"
                                        name="nama"
                                        value={formData.nama}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
                                    <input
                                        type="tel"
                                        name="noTlp"
                                        value={formData.noTlp}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Masuk</label>
                                    <input
                                        type="date"
                                        name="tglMasuk"
                                        value={formData.tglMasuk}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                                    >
                                        <option value="reguler">Reguler</option>
                                        <option value="mahasantri">Mahasantri</option>
                                        <option value="biman">BIMAN</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowFormModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                                >
                                    {formMode === 'add' ? 'Simpan' : 'Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
}