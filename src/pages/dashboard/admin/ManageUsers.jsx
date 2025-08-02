import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../../../firebase';
import Layout from '../../../components/admin/Layout';

export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [rooms, setRooms] = useState([]); // State untuk menyimpan data kamar
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        noTlp: '',
        jenKel: 'laki-laki',
        role: 'reguler',
        kamarId: '',
        noKamar: ''
    });

    // Fetch users and rooms from Firestore
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Ambil data pengguna
                const usersRef = collection(db, 'users');
                const usersQuery = query(usersRef, orderBy('nama'));
                const usersSnapshot = await getDocs(usersQuery);

                // Ambil data kamar
                const roomsRef = collection(db, 'kamar');
                const roomsSnapshot = await getDocs(roomsRef);

                const roomsData = roomsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setRooms(roomsData);

                // Gabungkan data pengguna dengan nomor kamar
                const usersData = usersSnapshot.docs.map(doc => {
                    const userData = doc.data();
                    const userRoom = roomsData.find(room => room.id === userData.kamarId);
                    return {
                        id: doc.id,
                        ...userData,
                        noKamar: userRoom ? userRoom.no_kamar : '-'
                    };
                });

                setUsers(usersData);
                setFilteredUsers(usersData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data: ', err);
                setError('Gagal memuat data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Apply filters and search
    useEffect(() => {
        let result = users;

        if (roleFilter !== 'all') {
            result = result.filter(user => user.role === roleFilter);
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(user =>
                user.nama.toLowerCase().includes(term) ||
                user.email.toLowerCase().includes(term) ||
                (user.noTlp && user.noTlp.includes(term)) ||
                (user.noKamar && user.noKamar.toLowerCase().includes(term))
            );
        }

        setFilteredUsers(result);
    }, [users, roleFilter, searchTerm]);

    // Handle view detail
    const handleViewDetail = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
        setIsEditing(false);
        setFormData({
            nama: user.nama,
            email: user.email,
            noTlp: user.noTlp || '',
            jenKel: user.jenKel || 'laki-laki',
            role: user.role || 'reguler',
            kamarId: user.kamarId || '',
            noKamar: user.noKamar || '-'
        });
    };

    // Handle edit user
    const handleEditUser = async () => {
        try {
            // Cari ID kamar berdasarkan no_kamar yang dipilih
            const selectedRoom = rooms.find(room => room.no_kamar === formData.noKamar);
            const kamarId = selectedRoom ? selectedRoom.id : '';

            const updatedData = {
                ...formData,
                kamarId: kamarId
            };

            await updateDoc(doc(db, 'users', selectedUser.id), updatedData);

            // Update state dengan data terbaru termasuk noKamar
            setUsers(users.map(user =>
                user.id === selectedUser.id ? {
                    ...user,
                    ...updatedData,
                    noKamar: formData.noKamar
                } : user
            ));

            setIsModalOpen(false);
            alert('Data pengguna berhasil diperbarui!');
        } catch (error) {
            console.error('Error updating user: ', error);
            alert('Gagal memperbarui data pengguna');
        }
    };

    // Handle delete user
    const handleDeleteUser = async () => {
        try {
            await deleteDoc(doc(db, 'users', selectedUser.id));
            setUsers(users.filter(user => user.id !== selectedUser.id));
            setIsDeleteModalOpen(false);
            alert('Pengguna berhasil dihapus!');
        } catch (error) {
            console.error('Error deleting user: ', error);
            alert('Gagal menghapus pengguna');
        }
    };

    // Format date
    const formatDate = (timestamp) => {
        if (!timestamp) return '-';
        try {
            const date = timestamp.toDate();
            return date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch {
            return '-';
        }
    };

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
            </div>
        );
    }

    return (
        <Layout>
            <div className="bg-gray-50 min-h-screen text-gray-800">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Kelola Pengguna</h1>

                {/* Filter and Search */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cari Pengguna</label>
                            <input
                                type="text"
                                placeholder="Cari berdasarkan nama, email, no. telp, atau no. kamar"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-100"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Filter Role</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-100"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="all">Semua Role</option>
                                <option value="admin">Admin</option>
                                <option value="reguler">Reguler</option>
                                <option value="biman">BIMAN</option>
                                <option value="mahasantri">Mahasantri</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profil</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Kamar</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Masuk</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center">
                                            <div className="flex justify-center">
                                                <i className="ri-loader-4-line animate-spin text-2xl text-gray-500"></i>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <img
                                                    src="https://cdn-icons-png.freepik.com/512/7718/7718888.png"
                                                    alt={user.nama}
                                                    className="h-10 w-10 rounded-full"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium">{user.nama}</div>
                                                <div className="text-sm text-gray-500">{user.jenKel}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                        user.role === 'biman' ? 'bg-gray-100 text-gray-800' :
                                                            user.role === 'mahasantri' ? 'bg-green-100 text-green-800' :
                                                                'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm">{user.noKamar}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium">{formatDate(user.tglMasuk)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                                                <button
                                                    onClick={() => handleViewDetail(user)}
                                                    className="text-gray-600 hover:text-gray-900 mr-3"
                                                >
                                                    <i className="ri-eye-line"></i> Detail
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleViewDetail(user);
                                                        setIsEditing(true);
                                                    }}
                                                    className="text-yellow-600 hover:text-yellow-900 mr-3"
                                                >
                                                    <i className="ri-edit-line"></i> Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <i className="ri-delete-bin-line"></i> Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                            Tidak ada pengguna yang ditemukan
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Detail/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className={`bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden ${isEditing ? 'max-w-xl' : ''}`}>
                        {/* Header */}
                        <div className="bg-gradient-to-r from-gray-600 to-gray-500 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white">
                                {isEditing ? 'Edit Pengguna' : 'Detail Pengguna'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-white hover:text-gray-100 transition-colors"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-5">
                            {/* Profile Picture */}
                            <div className="flex justify-center">
                                <div className="relative">
                                    <img
                                        src="https://cdn-icons-png.freepik.com/512/7718/7718888.png"
                                        alt="Profile"
                                        className="h-24 w-24 rounded-full border-4 border-gray-100 object-cover"
                                    />
                                    {isEditing && (
                                        <button className="absolute bottom-0 right-0 bg-gray-500 text-white p-1.5 rounded-full hover:bg-gray-600 transition-colors">
                                            <i className="ri-camera-line text-sm"></i>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className={`grid gap-4 ${isEditing ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-100 focus:border-gray-500"
                                            value={formData.nama}
                                            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                        />
                                    ) : (
                                        <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">{selectedUser.nama}</div>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-100 focus:border-gray-500"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    ) : (
                                        <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">{selectedUser.email}</div>
                                    )}
                                </div>

                                {/* Phone Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-100 focus:border-gray-500"
                                            value={formData.noTlp}
                                            onChange={(e) => setFormData({ ...formData, noTlp: e.target.value })}
                                        />
                                    ) : (
                                        <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">{selectedUser.noTlp || '-'}</div>
                                    )}
                                </div>

                                {/* Gender Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                                    {isEditing ? (
                                        <select
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-100 focus:border-gray-500"
                                            value={formData.jenKel}
                                            onChange={(e) => setFormData({ ...formData, jenKel: e.target.value })}
                                        >
                                            <option value="laki-laki">Laki-laki</option>
                                            <option value="perempuan">Perempuan</option>
                                        </select>
                                    ) : (
                                        <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100 capitalize">{selectedUser.jenKel || '-'}</div>
                                    )}
                                </div>

                                {/* Role Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    {isEditing ? (
                                        <select
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-100 focus:border-gray-500"
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="reguler">Reguler</option>
                                            <option value="biman">BIMAN</option>
                                            <option value="mahasantri">Mahasantri</option>
                                        </select>
                                    ) : (
                                        <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100 capitalize">{selectedUser.role || '-'}</div>
                                    )}
                                </div>

                                {/* Room Number - Shown in both modes */}
                                <div className={isEditing ? 'md:col-span-' : ''}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">No. Kamar</label>
                                    {isEditing ? (
                                        <select
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-100 focus:border-gray-500"
                                            value={formData.noKamar}
                                            onChange={(e) => setFormData({ ...formData, noKamar: e.target.value })}
                                            disabled
                                        >
                                            <option value="">Pilih Kamar</option>
                                            {rooms.map(room => (
                                                <option key={room.id} value={room.no_kamar}>
                                                    {room.no_kamar}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">{selectedUser.noKamar || '-'}</div>
                                    )}
                                </div>

                                {/* Additional info - Only shown in view mode */}
                                {!isEditing && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Masuk</label>
                                            <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">{formatDate(selectedUser.tglMasuk)}</div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                                            <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100 text-xs font-mono break-all">
                                                {selectedUser.uid}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Footer - Edit mode only */}
                        {isEditing && (
                            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleEditUser}
                                    className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                                >
                                    <i className="ri-save-line mr-2"></i> Simpan Perubahan
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold mb-4">Konfirmasi Hapus Pengguna</h3>
                        <p className="mb-6">Apakah Anda yakin ingin menghapus pengguna <span className="font-semibold">{selectedUser?.nama}</span>? Aksi ini tidak dapat dibatalkan.</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDeleteUser}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                <i className="ri-delete-bin-line mr-2"></i> Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </Layout>
    );
}