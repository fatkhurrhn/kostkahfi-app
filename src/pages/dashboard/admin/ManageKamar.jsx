// src/pages/dashboard/admin/ManageKamar.jsx
import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '../../../../firebase';
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [kamarToFill, setKamarToFill] = useState(null);

    const openFillModal = (kamar) => {
        setKamarToFill(kamar);
        setShowModal(true);
    };

    const handleAssignOccupant = async (userDoc) => {
        if (!kamarToFill) return;
        const db = getFirestore(app);
        try {
            // Update kamar
            await updateDoc(doc(db, 'kamar', kamarToFill.id), {
                status: 'terisi',
                penghuniId: userDoc.uid
            });
            // Update user
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

            // Check admin role
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
                setIsAdmin(true);
                fetchData();
            } else {
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const fetchData = async () => {
        try {
            const db = getFirestore(app);

            // Fetch all rooms
            const kamarSnapshot = await getDocs(collection(db, 'kamar'));
            let kamarData = kamarSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Sort rooms numerically
            kamarData = kamarData.sort((a, b) => {
                return parseInt(a.no_kamar) - parseInt(b.no_kamar);
            });

            // Fetch all users for occupant names
            const usersSnapshot = await getDocs(collection(db, 'users'));
            const usersData = usersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersData);

            // Map occupant names to rooms
            kamarData = kamarData.map(kamar => {
                if (kamar.penghuniId) {
                    const occupant = usersData.find(user => user.uid === kamar.penghuniId);
                    return {
                        ...kamar,
                        occupantName: occupant ? occupant.nama : 'Unknown'
                    };
                }
                return kamar;
            });

            setKamars(kamarData);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError('Gagal memuat data kamar');
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddKamar = async (e) => {
        e.preventDefault();
        if (!formData.no_kamar) {
            setError('Nomor kamar harus diisi');
            return;
        }

        // Check if room number already exists
        if (kamars.some(k => k.no_kamar === formData.no_kamar)) {
            setError('Nomor kamar sudah ada');
            return;
        }

        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (kamarId, newStatus) => {
        try {
            const db = getFirestore(app);

            // 1. Ambil data kamar saat ini
            const kamarRef = doc(db, 'kamar', kamarId);
            const kamarSnap = await getDoc(kamarRef);
            if (!kamarSnap.exists()) return;

            const oldPenghuniId = kamarSnap.data().penghuniId;

            // 2. Update kamar
            await updateDoc(kamarRef, {
                status: newStatus,
                ...(newStatus === 'kosong' && { penghuniId: null })
            });

            // 3. Jika sedang dikosongkan, hapus kamarId pada user
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

            fetchData(); // refresh tabel
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
        if (filter === 'all') return true;
        return kamar.status === filter;
    });

    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <i className="ri-loader-4-line animate-spin text-4xl text-gray-700"></i>
            </div>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white shadow rounded-lg p-6 mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">
                            <i className="ri-home-gear-line mr-2"></i>Manajemen Kamar
                        </h1>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleAddKamar} className="mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-gray-700 mb-2">Nomor Kamar</label>
                                    <input
                                        type="text"
                                        name="no_kamar"
                                        value={formData.no_kamar}
                                        onChange={handleInputChange}
                                        className="w-full bg-white text-gray-800 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
                                        required
                                        placeholder="Contoh: 4101"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                                    >
                                        {loading ? 'Menambahkan...' : 'Tambah Kamar'}
                                    </button>
                                </div>
                            </div>
                        </form>

                        <div className="mb-4 flex space-x-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}
                            >
                                Semua
                            </button>
                            <button
                                onClick={() => setFilter('kosong')}
                                className={`px-4 py-2 rounded-md ${filter === 'kosong' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}
                            >
                                Kosong
                            </button>
                            <button
                                onClick={() => setFilter('terisi')}
                                className={`px-4 py-2 rounded-md ${filter === 'terisi' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}
                            >
                                Terisi
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            No. Kamar
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Penghuni
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredKamars.map((kamar) => (
                                        <tr key={kamar.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                {kamar.no_kamar}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${kamar.status === 'kosong'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {kamar.status === 'kosong' ? 'Kosong' : 'Terisi'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                {kamar.status === 'terisi' ? (kamar.occupantName || '-') : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 space-x-2">
                                                {kamar.status === 'kosong' ? (
                                                    <button
                                                        onClick={() => openFillModal(kamar)}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        <i className="ri-user-add-line mr-1"></i>Isi
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleUpdateStatus(kamar.id, 'kosong')}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <i className="ri-user-unfollow-line mr-1"></i>Kosongkan
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteKamar(kamar.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <i className="ri-delete-bin-line mr-1"></i>Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {showModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                                    <h3 className="text-lg font-semibold mb-4">
                                        Pilih Penghuni untuk Kamar {kamarToFill?.no_kamar}
                                    </h3>
                                    <ul className="max-h-60 overflow-y-auto">
                                        {users
                                            .filter(u => u.role !== 'admin')
                                            .map(u => (
                                                <li key={u.id} className="flex justify-between items-center py-2 border-b">
                                                    <span>
                                                        {u.nama} –{' '}
                                                        {u.kamarId ? `Sudah ambil kamar no ${kamars.find(k => k.id === u.kamarId)?.no_kamar}` : 'Belum ambil kamar'}
                                                    </span>
                                                    {!u.kamarId && (
                                                        <button
                                                            onClick={() => handleAssignOccupant(u)}
                                                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                                        >
                                                            Pilih
                                                        </button>
                                                    )}
                                                </li>
                                            ))}
                                    </ul>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="mt-4 bg-gray-300 text-gray-800 px-4 py-2 rounded"
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}