import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import {
    getFirestore, collection, getDocs, addDoc,
    doc, updateDoc, deleteDoc, query, where, getDoc
} from 'firebase/firestore';
import Layout from '../../../components/admin/Layout';

export default function ManageKamar() {
    const [kamars, setKamars] = useState([]);
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({ no_kamar: '', status: 'kosong' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    // const [isAdmin, setIsAdmin] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [kamarToFill, setKamarToFill] = useState(null);
    const [loading, setLoading] = useState(true); // Tambahan state loading

    const openFillModal = (kamar) => {
        setKamarToFill(kamar);
        setShowModal(true);
    };

    const handleAssignOccupant = async (userDoc) => {
        if (!kamarToFill) return;
        const db = getFirestore(app);
        try {
            await updateDoc(doc(db, 'kamar', kamarToFill.id), {
                status: 'terisi',
                penghuniId: userDoc.uid
            });
            await updateDoc(doc(db, 'users', userDoc.id), {
                kamarId: kamarToFill.id
            });
            setSuccess(`Kamar ${kamarToFill.no_kamar} diisi oleh ${userDoc.nama}`);
            setShowModal(false);
            fetchData();
        } catch (err) {
            console.error(err);
            setError('Gagal mengisi kamar');
        }
    };

    useEffect(() => {
        const auth = getAuth(app);
        const db = getFirestore(app);

        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                navigate('/login');
                return;
            }

            const q = query(
                collection(db, 'users'),
                where('uid', '==', user.uid)
            );
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const userData = snapshot.docs[0].data();
                if (userData.role !== 'admin') {
                    navigate('/dashboard-users');
                    return;
                }
                // setIsAdmin(true);
                fetchData();
            } else {
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const fetchData = async () => {
        setLoading(true); // Mulai loading
        try {
            const db = getFirestore(app);
            const kamarSnapshot = await getDocs(collection(db, 'kamar'));
            let kamarData = kamarSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            kamarData = kamarData.sort((a, b) => parseInt(a.no_kamar) - parseInt(b.no_kamar));

            const usersSnapshot = await getDocs(collection(db, 'users'));
            const usersData = usersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersData);

            kamarData = kamarData.map(kamar => {
                if (kamar.penghuniId) {
                    const occupant = usersData.find(user => user.uid === kamar.penghuniId);
                    return { ...kamar, occupantName: occupant ? occupant.nama : 'Unknown' };
                }
                return kamar;
            });

            setKamars(kamarData);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError('Gagal memuat data kamar');
        } finally {
            setLoading(false); // Selesai loading
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddKamar = async (e) => {
        e.preventDefault();
        if (!formData.no_kamar) {
            setError('Nomor kamar harus diisi');
            return;
        }
        if (kamars.some(k => k.no_kamar === formData.no_kamar)) {
            setError('Nomor kamar sudah ada');
            return;
        }

        try {
            const db = getFirestore(app);
            await addDoc(collection(db, 'kamar'), {
                no_kamar: formData.no_kamar,
                status: 'kosong'
            });
            setFormData({ no_kamar: '', status: 'kosong' });
            setSuccess('Kamar berhasil ditambahkan');
            setError('');
            setTimeout(() => setSuccess(''), 3000);
            fetchData();
        } catch (err) {
            console.error("Error adding kamar:", err);
            setError('Gagal menambahkan kamar');
        }
    };

    const handleUpdateStatus = async (kamarId, newStatus) => {
        try {
            const db = getFirestore(app);
            const kamarRef = doc(db, 'kamar', kamarId);
            const kamarSnap = await getDoc(kamarRef);
            if (!kamarSnap.exists()) return;

            const oldPenghuniId = kamarSnap.data().penghuniId;

            await updateDoc(kamarRef, {
                status: newStatus,
                ...(newStatus === 'kosong' && { penghuniId: null })
            });

            if (newStatus === 'kosong' && oldPenghuniId) {
                const q = query(
                    collection(db, 'users'),
                    where('uid', '==', oldPenghuniId)
                );
                const snap = await getDocs(q);
                if (!snap.empty) {
                    const userDoc = snap.docs[0].ref;
                    await updateDoc(userDoc, { kamarId: null });
                }
            }
            fetchData();
        } catch (err) {
            console.error('Error updating kamar:', err);
            setError('Gagal mengupdate status kamar');
        }
    };

    const handleDeleteKamar = async (kamarId) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus kamar ini?')) return;
        try {
            const db = getFirestore(app);
            await deleteDoc(doc(db, 'kamar', kamarId));
            fetchData();
        } catch (err) {
            console.error("Error deleting kamar:", err);
            setError('Gagal menghapus kamar');
        }
    };

    const filteredKamars = kamars.filter(kamar => {
        if (filter !== 'all' && kamar.status !== filter) return false;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return (
                kamar.no_kamar.toLowerCase().includes(term) ||
                (kamar.occupantName && kamar.occupantName.toLowerCase().includes(term))
            );
        }
        return true;
    });

    return (
        <Layout>
            <div className="max-w-full mx-auto">
                {error && (
                    <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                        {success}
                    </div>
                )}

                {/* Add Room Form */}
                <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
                    <form onSubmit={handleAddKamar}>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tambah Nomor Kamar</label>
                                <input
                                    type="text"
                                    name="no_kamar"
                                    value={formData.no_kamar}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                                    required
                                    placeholder="Contoh: 101"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm flex items-center"
                                >
                                    <i className="ri-add-line mr-2"></i>
                                    Tambah Kamar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Filter and Search Section */}
                <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex space-x-2">
                            <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-md text-sm ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>Semua Kamar</button>
                            <button onClick={() => setFilter('kosong')} className={`px-4 py-2 rounded-md text-sm ${filter === 'kosong' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>Kamar Kosong</button>
                            <button onClick={() => setFilter('terisi')} className={`px-4 py-2 rounded-md text-sm ${filter === 'terisi' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>Kamar Terisi</button>
                        </div>
                        <div className="w-full md:w-64">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Cari kamar/penghuni..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <i className="ri-search-line absolute left-3 top-2.5 text-gray-400"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rooms Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Kamar</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penghuni</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-10">
                                            <div className="flex justify-center items-center">
                                                <svg
                                                    className="animate-spin h-5 w-5 text-gray-500 mr-2"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                                    ></path>
                                                </svg>
                                                <span className="text-sm text-gray-500">Memuat data...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredKamars.length > 0 ? (
                                    filteredKamars.map((kamar) => (
                                        <tr key={kamar.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">Kamar No - {kamar.no_kamar}</div></td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${kamar.status === 'kosong' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {kamar.status === 'kosong' ? 'Kosong' : 'Terisi'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{kamar.status === 'terisi' ? (kamar.occupantName || '-') : '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    {kamar.status === 'kosong' ? (
                                                        <button onClick={() => openFillModal(kamar)} className="flex items-center px-3 py-1 rounded-md text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300" title="Isi Kamar">
                                                            <i className="ri-user-add-line mr-1"></i> Isi Kamar
                                                        </button>
                                                    ) : (
                                                        <button onClick={() => handleUpdateStatus(kamar.id, 'kosong')} className="flex items-center px-3 py-1 rounded-md text-sm text-yellow-700 bg-yellow-100 hover:bg-yellow-200 border border-yellow-300" title="Kosongkan Kamar">
                                                            <i className="ri-user-unfollow-line mr-1"></i> Kosongkan
                                                        </button>
                                                    )}
                                                    <button onClick={() => handleDeleteKamar(kamar.id)} className="flex items-center px-3 py-1 rounded-md text-sm text-red-700 bg-red-100 hover:bg-red-200 border border-red-300" title="Hapus Kamar">
                                                        <i className="ri-delete-bin-line mr-1"></i> Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">Tidak ada data kamar yang ditemukan</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Assign Occupant Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800"><i className="ri-user-add-line mr-2"></i>Pilih Penghuni untuk Kamar {kamarToFill?.no_kamar}</h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><i className="ri-close-line text-xl"></i></button>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.filter(u => u.role !== 'admin').map(u => (
                                            <tr key={u.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{u.nama}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">
                                                    {u.kamarId ? (
                                                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Sudah punya kamar</span>
                                                    ) : (
                                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Tersedia</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">
                                                    {!u.kamarId && (
                                                        <button onClick={() => handleAssignOccupant(u)} className="text-xs bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700">Pilih</button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Tutup</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}