// src/pages/dashboard/DashboardUsers.jsx
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../../firebase';
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

// --- Reusable Modal Component ---
const KamarModal = ({ isOpen, onClose, kamars, onSelect }) => {
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
                    {kamars.length ? (
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
    const navigate = useNavigate();

    const fetchUserData = async (currentUser) => {
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
            const kamarSnap = await getDocs(
                query(collection(db, 'kamar'), where('status', '==', 'kosong'), orderBy('no_kamar'))
            );
            setAvailableKamars(
                kamarSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
            );
        } catch (err) {
            console.error(err);
            setError('Gagal memuat data');
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

    // --- Logic memilih / ganti kamar ---
    const handleSelectKamar = async (kamar) => {
        if (!kamar) return;
        try {
            const auth = getAuth(app);
            const db = getFirestore(app);
            const cur = auth.currentUser;

            // update kamar
            await updateDoc(doc(db, 'kamar', kamar.id), {
                status: 'terisi',
                penghuniId: cur.uid,
            });

            // update user
            const userDoc = (await getDocs(query(collection(db, 'users'), where('uid', '==', cur.uid)))).docs[0];
            await updateDoc(userDoc.ref, { kamarId: kamar.id });

            // optimis
            setUserKamar(kamar);
            setAvailableKamars((prev) => prev.filter((k) => k.id !== kamar.id));
            setSuccess(`Kamar ${kamar.no_kamar} berhasil dipilih`);
            setTimeout(() => setSuccess(''), 3000);
        } catch (e) {
            console.error(e);
            setError('Gagal memilih kamar');
        }
    };

    const handleChangeKamar = async (newKamar) => {
        if (!window.confirm('Yakin ingin pindah kamar?')) return;
        try {
            const auth = getAuth(app);
            const db = getFirestore(app);
            const cur = auth.currentUser;

            // lepas kamar lama
            if (userKamar) {
                await updateDoc(doc(db, 'kamar', userKamar.id), {
                    status: 'kosong',
                    penghuniId: null,
                });
                setAvailableKamars((prev) =>
                    [...prev, userKamar].sort((a, b) => parseInt(a.no_kamar) - parseInt(b.no_kamar))
                );
            }

            // pilih kamar baru
            await updateDoc(doc(db, 'kamar', newKamar.id), {
                status: 'terisi',
                penghuniId: cur.uid,
            });
            const userDoc = (await getDocs(query(collection(db, 'users'), where('uid', '==', cur.uid)))).docs[0];
            await updateDoc(userDoc.ref, { kamarId: newKamar.id });

            setUserKamar(newKamar);
            setAvailableKamars((prev) => prev.filter((k) => k.id !== newKamar.id));
            setSuccess(`Berhasil pindah ke kamar ${newKamar.no_kamar}`);
            setTimeout(() => setSuccess(''), 3000);
        } catch (e) {
            console.error(e);
            setError('Gagal mengganti kamar');
        }
    };

    return (
        <Layout>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Alert */}
                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                        {success}
                    </div>
                )}

                {/* Card Profile */}
                <div className="bg-white shadow-xl rounded-xl p-6 sm:p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <i className="ri-account-circle-line text-3xl mr-3 text-gray-400"></i>
                        Profil Saya
                    </h2>

                    <div className="grid md:grid-cols-2 gap-x-10 gap-y-6 text-sm text-gray-700">
                        <div className="space-y-2">
                            <p><span className="font-semibold">Nama:</span> {user?.nama || '-'}</p>
                            <p><span className="font-semibold">JenKel:</span> {user?.jenKel || '-'}</p>
                            <p><span className="font-semibold">Email:</span> {user?.email || '-'}</p>
                            <p><span className="font-semibold">No. Telepon:</span> {user?.noTlp || '-'}</p>
                        </div>
                        <div className="space-y-2">
                            <p><span className="font-semibold">Tgl Masuk:</span> {' '}
                                {user?.tglMasuk
                                    ? user.tglMasuk.toDate().toLocaleDateString('id-ID', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                    })
                                    : '-'}</p>
                            <p><span className="font-semibold">Role:</span> {user?.role || '-'}</p>
                            <p>
                                <span className="font-semibold">Kamar:</span>{' '}
                                {userKamar ? (
                                    <span className="inline-block bg-gray-100 text-gray-800 px-2 py-0.5 rounded-md">
                                        {userKamar.no_kamar}
                                    </span>
                                ) : (
                                    '-'
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card Kamar */}
                <div className="mt-8 bg-white shadow-xl rounded-xl p-6 sm:p-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <i className="ri-home-4-line text-2xl mr-3 text-gray-400"></i>
                        {userKamar ? 'Ganti Kamar' : 'Pilih Kamar'}
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                            <p className="text-gray-700 font-medium">
                                {userKamar
                                    ? `Kamar ${userKamar.no_kamar} (terisi)`
                                    : 'Belum memiliki kamar'}
                            </p>
                            <button
                                onClick={() => setModalOpen(true)}
                                className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-lg transition"
                            >
                                {userKamar ? 'Ganti' : 'Pilih'}
                            </button>
                        </div>

                        <KamarModal
                            isOpen={modalOpen}
                            onClose={() => setModalOpen(false)}
                            kamars={availableKamars}
                            onSelect={(kamar) =>
                                userKamar ? handleChangeKamar(kamar) : handleSelectKamar(kamar)
                            }
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
}