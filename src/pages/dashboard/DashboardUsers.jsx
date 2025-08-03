// src/pages/dashboard/DashboardUsers.jsx
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    doc,
    orderBy,
    getDoc,
} from 'firebase/firestore';
import Layout from '../../components/users/Layout';

const KamarModal = ({ isOpen, onClose, kamars, onSelect, loading }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white max-w-md w-full rounded-xl shadow-2xl mx-4">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800">Pilih Kamar</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                        &times;
                    </button>
                </div>

                {/* Body */}
                <div className="max-h-80 overflow-y-auto p-4 space-y-3">
                    {loading ? (
                        <div className="text-center py-10">
                            <i className="ri-loader-4-line animate-spin text-2xl text-gray-400"></i>
                            <p className="mt-2 text-gray-500">Memuat kamar...</p>
                        </div>
                    ) : kamars.length ? (
                        kamars.map((k) => (
                            <button
                                key={k.id}
                                onClick={() => {
                                    onSelect(k);
                                    onClose();
                                }}
                                className="w-full text-left flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg px-4 py-3 transition"
                            >
                                <div>
                                    <p className="font-semibold text-gray-800">Kamar {k.no_kamar}</p>
                                    <p className="text-sm text-gray-500">Status: Kosong</p>
                                </div>
                                <i className="ri-arrow-right-s-line text-gray-400 text-xl"></i>
                            </button>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 text-sm py-10">
                            Tidak ada kamar kosong saat ini.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function DashboardUsers() {
    const [user, setUser] = useState(null);
    const [availableKamars, setAvailableKamars] = useState([]);
    const [userKamar, setUserKamar] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [kamarLoading, setKamarLoading] = useState(false);
    const navigate = useNavigate();

    const fetchUserData = async (currentUser) => {
        setLoading(true);
        const db = getFirestore(app);
        try {
            // fetch user
            const userSnap = await getDocs(
                query(collection(db, 'users'), where('uid', '==', currentUser.uid))
            );
            if (userSnap.empty) return;
            const userData = userSnap.docs[0].data();
            setUser(userData);

            // fetch kamar user jika ada
            if (userData.kamarId) {
                const kamarDoc = await getDoc(doc(db, 'kamar', userData.kamarId));
                if (kamarDoc.exists()) {
                    setUserKamar({ id: kamarDoc.id, ...kamarDoc.data() });
                }
            }

            // fetch kamar kosong
            setKamarLoading(true);
            const kamarSnap = await getDocs(
                query(collection(db, 'kamar'), where('status', '==', 'kosong'), orderBy('no_kamar'))
            );
            setAvailableKamars(
                kamarSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
            );
        } catch (err) {
            console.error(err);
            setError('Gagal memuat data');
        } finally {
            setLoading(false);
            setKamarLoading(false);
        }
    };

    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, async (cur) => {
            if (!cur) return navigate('/login');

            const db = getFirestore(app);
            const adminSnap = await getDocs(
                query(collection(db, 'users'), where('uid', '==', cur.uid), where('role', '==', 'admin'))
            );
            if (!adminSnap.empty) return navigate('/dashboard-admin');

            fetchUserData(cur);
        });
        return unsubscribe;
    }, [navigate]);

    const handleSelectKamar = async (kamar) => {
        if (!kamar) return;
        try {
            setKamarLoading(true);
            const auth = getAuth(app);
            const db = getFirestore(app);
            const cur = auth.currentUser;

            await updateDoc(doc(db, 'kamar', kamar.id), {
                status: 'terisi',
                penghuniId: cur.uid,
            });

            const userDoc = (await getDocs(query(collection(db, 'users'), where('uid', '==', cur.uid)))).docs[0];
            await updateDoc(userDoc.ref, { kamarId: kamar.id });

            setUserKamar(kamar);
            setAvailableKamars((prev) => prev.filter((k) => k.id !== kamar.id));
            setSuccess(`Kamar ${kamar.no_kamar} berhasil dipilih`);
            setTimeout(() => setSuccess(''), 3000);
        } catch (e) {
            console.error(e);
            setError('Gagal memilih kamar');
        } finally {
            setKamarLoading(false);
        }
    };

    const handleChangeKamar = async (newKamar) => {
        if (!window.confirm('Yakin ingin pindah kamar?')) return;
        try {
            setKamarLoading(true);
            const auth = getAuth(app);
            const db = getFirestore(app);
            const cur = auth.currentUser;

            if (userKamar) {
                await updateDoc(doc(db, 'kamar', userKamar.id), {
                    status: 'kosong',
                    penghuniId: null,
                });
                setAvailableKamars((prev) =>
                    [...prev, userKamar].sort((a, b) => parseInt(a.no_kamar) - parseInt(b.no_kamar))
                );
            }

            await updateDoc(doc(db, 'kamar', newKamar.id), {
                status: 'terisi',
                penghuniId: cur.uid,
            });
            const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', cur.uid))).docs[0];
            await updateDoc(userDoc.ref, { kamarId: newKamar.id });

            setUserKamar(newKamar);
            setAvailableKamars((prev) => prev.filter((k) => k.id !== newKamar.id));
            setSuccess(`Berhasil pindah ke kamar ${newKamar.no_kamar}`);
            setTimeout(() => setSuccess(''), 3000);
        } catch (e) {
            console.error(e);
            setError('Gagal mengganti kamar');
        } finally {
            setKamarLoading(false);
        }
    };

    const LoadingPlaceholder = ({ width = 'full' }) => (
        <div className={`bg-gray-200 animate-pulse h-6 rounded ${width === 'full' ? 'w-full' : 'w-1/2'}`}></div>
    );

    return (
        <Layout>
            <div className="max-w-full mx-auto">
                {/* Alert */}
                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-start">
                        <i className="ri-error-warning-line text-xl mr-3"></i>
                        <div>
                            <p className="font-medium">Error</p>
                            <p>{error}</p>
                        </div>
                    </div>
                )}
                {success && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg flex items-start">
                        <i className="ri-checkbox-circle-line text-xl mr-3"></i>
                        <div>
                            <p className="font-medium">Sukses</p>
                            <p>{success}</p>
                        </div>
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Card Profile */}
                    <div className="bg-gradient-to-r from-white to-gray-50 shadow-lg rounded-2xl p-6 border border-gray-100 h-full">
                        <div className="flex items-center mb-6">
                            <div className="bg-[#eb6807]/10 p-3 rounded-full mr-4">
                                <i className="ri-account-circle-line text-3xl text-[#eb6807]"></i>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Profil Saya</h2>
                                <p className="text-gray-500">Informasi akun dan kamar Anda</p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <LoadingPlaceholder />
                                    <LoadingPlaceholder />
                                    <LoadingPlaceholder />
                                    <LoadingPlaceholder />
                                </div>
                                <div className="space-y-4">
                                    <LoadingPlaceholder />
                                    <LoadingPlaceholder />
                                    <LoadingPlaceholder />
                                </div>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Nama Lengkap</p>
                                        <p className="font-medium text-gray-800">{user?.nama || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Jenis Kelamin</p>
                                        <p className="font-medium text-gray-800">
                                            {user?.jenKel ? user.jenKel.charAt(0).toUpperCase() + user.jenKel.slice(1) : '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium text-gray-800">{user?.email || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Nomor Telepon</p>
                                        <p className="font-medium text-gray-800">{user?.noTlp || '-'}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Tanggal Masuk</p>
                                        <p className="font-medium text-gray-800">
                                            {user?.tglMasuk
                                                ? user.tglMasuk.toDate().toLocaleDateString('id-ID', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })
                                                : '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Role</p>
                                        <p className="font-medium text-gray-800">
                                            {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Kamar</p>
                                        {userKamar ? (
                                            <span className="inline-block bg-[#eb6807]/10 text-[#eb6807] px-3 py-1 rounded-full font-medium">
                                                Kamar {userKamar.no_kamar}
                                            </span>
                                        ) : (
                                            <p className="font-medium text-gray-800">-</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Card Kamar */}
                    <div className="bg-gradient-to-r from-white to-gray-50 shadow-lg rounded-2xl p-6 border border-gray-100 h-full">
                        <div className="flex items-center mb-6">
                            <div className="bg-[#eb6807]/10 p-3 rounded-full mr-4">
                                <i className="ri-home-4-line text-3xl text-[#eb6807]"></i>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {userKamar ? 'Manajemen Kamar' : 'Pilih Kamar'}
                                </h2>
                                <p className="text-gray-500">
                                    {userKamar ? 'Anda dapat mengganti kamar' : 'Silakan pilih kamar yang tersedia'}
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-5">
                            <div className="flex flex-col sm:flex-row items-center justify-between">
                                <div className="mb-4 sm:mb-0">
                                    <p className="text-gray-500">Status Kamar</p>
                                    <p className="text-lg font-semibold text-gray-800">
                                        {userKamar ? `Kamar ${userKamar.no_kamar}` : 'Belum memiliki kamar'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {userKamar ? 'Status: Terisi' : 'Status: -'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setModalOpen(true)}
                                    disabled={kamarLoading}
                                    className="bg-[#eb6807] hover:bg-[#d45e06] text-white px-6 py-2.5 rounded-lg font-medium transition flex items-center"
                                >
                                    {kamarLoading ? (
                                        <>
                                            <i className="ri-loader-4-line animate-spin mr-2"></i>
                                            Memproses...
                                        </>
                                    ) : (
                                        <>
                                            <i className={userKamar ? 'ri-exchange-line mr-2' : 'ri-check-line mr-2'}></i>
                                            {userKamar ? 'Ganti Kamar' : 'Pilih Kamar'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <KamarModal
                            isOpen={modalOpen}
                            onClose={() => setModalOpen(false)}
                            kamars={availableKamars}
                            onSelect={(kamar) =>
                                userKamar ? handleChangeKamar(kamar) : handleSelectKamar(kamar)
                            }
                            loading={kamarLoading}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
}