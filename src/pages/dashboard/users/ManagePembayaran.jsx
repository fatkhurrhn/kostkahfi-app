// src/pages/users/ManagePembayaranUser.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    query,
    where,
    onSnapshot,
    serverTimestamp,
    orderBy,
} from 'firebase/firestore';
import { app } from '../../../firebase';
import Layout from '../../../components/users/Layout';

// --- CONSTANTS --------------------------------------------------------------
const HARGA_PER_BULAN = {
    reguler: 750000,
    mahasantri: 350000,
    biman: 0,
};

// --- MAIN PAGE --------------------------------------------------------------
export default function ManagePembayaranUser() {
    const [records, setRecords] = useState([]);
    const [selectedMonths, setSelectedMonths] = useState([]);
    const [nominal, setNominal] = useState(0);
    const [bukti, setBukti] = useState('');
    const [userName, setUserName] = useState('');
    const [userType, setUserType] = useState('');
    const [uid, setUid] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showKonfirmasiModal, setShowKonfirmasiModal] = useState(false);

    const navigate = useNavigate();

    /* ----------------------------------------------------------------------- */
    /*  Auth & data fetch                                                      */
    /* ----------------------------------------------------------------------- */
    useEffect(() => {
        const auth = getAuth(app);
        const db = getFirestore(app);

        const unsubAuth = onAuthStateChanged(auth, async (user) => {
            if (!user) return navigate('/login');

            setUid(user.uid);
            setUserName(user.displayName || user.email || user.uid);

            // 1. Ambil data user dari Firestore
            const uSnap = await getDocs(
                query(collection(db, 'users'),
                    where('uid', '==', user.uid)
                ) // Pastikan menggunakan field yang benar
            );

            let type = 'reguler'; // Default value
            if (!uSnap.empty) {
                const userData = uSnap.docs[0].data();
                console.log('User data:', userData); // Untuk debugging
                type = userData.role || 'reguler'; // Gunakan field 'role'
            }
            setUserType(type);

            // 2. Listener realtime pembayaran
            const payQuery = query(
                collection(db, 'pembayaran'),
                where('userId', '==', user.uid),
                orderBy('updatedAt', 'desc')
            );
            const unsubPay = onSnapshot(
                payQuery,
                (snap) => {
                    const paid = {};
                    snap.forEach((d) => {
                        const key = `${d.data().tahun}-${d.data().bulan}`;
                        paid[key] = d.data().status;
                    });

                    // Generate list 2025-2026
                    const list = [];
                    for (let y = 2025; y <= 2026; y++) {
                        for (let m = 1; m <= 12; m++) {
                            const date = new Date(y, m - 1);
                            list.push({
                                tahun: y,
                                bulan: m,
                                namaBulan: date.toLocaleDateString('id-ID', { month: 'long' }),
                                status: paid[`${y}-${m}`] || 'belum bayar',
                            });
                        }
                    }
                    setRecords(list);
                    setLoading(false);
                },
                (err) => {
                    console.error(err);
                    setError('Gagal memuat data pembayaran');
                    setLoading(false);
                }
            );

            return () => unsubPay();
        });

        return unsubAuth;
    }, [navigate]);

    /* ----------------------------------------------------------------------- */
    /*  Hitung nominal otomatis                                                */
    /* ----------------------------------------------------------------------- */
    useEffect(() => {
        const harga = HARGA_PER_BULAN[userType] || 0;
        setNominal(selectedMonths.length * harga);
    }, [selectedMonths, userType]);

    /* ----------------------------------------------------------------------- */
    /*  Kirim konfirmasi                                                       */
    /* ----------------------------------------------------------------------- */
    const handleKonfirmasi = useCallback(async () => {
        if (!selectedMonths.length || (nominal > 0 && !bukti.trim())) return;

        const db = getFirestore(app);
        const batch = selectedMonths.map((m) =>
            addDoc(collection(db, 'pembayaran'), {
                userId: uid,
                tahun: m.tahun,
                bulan: m.bulan,
                nominal,
                buktiUrl: bukti,
                status: 'pending',
                userType,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            })
        );
        await Promise.all(batch);
        setSelectedMonths([]);
        setBukti('');
        setShowKonfirmasiModal(false);
    }, [selectedMonths, nominal, bukti, uid, userType]);

    /* ----------------------------------------------------------------------- */
    /*  Render                                                                 */
    /* ----------------------------------------------------------------------- */
    if (loading) {
        return (
            <Layout>
                <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow rounded-xl text-center">
                    <p className="text-gray-500">Memuat data...</p>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow rounded-xl">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-gray-600 text-white py-2 rounded-lg"
                    >
                        Coba Lagi
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-full mx-auto">

                <RiwayatTab
                    records={records}
                    onKonfirmasiClick={() => setShowKonfirmasiModal(true)}
                    userType={userType}
                />

                {/* Modal Konfirmasi Pembayaran */}
                {showKonfirmasiModal && (
                    <KonfirmasiModal
                        records={records}
                        selectedMonths={selectedMonths}
                        setSelectedMonths={setSelectedMonths}
                        nominal={nominal}
                        bukti={bukti}
                        setBukti={setBukti}
                        handleKonfirmasi={handleKonfirmasi}
                        userType={userType}
                        hargaPerBulan={HARGA_PER_BULAN[userType]}
                        onClose={() => {
                            setShowKonfirmasiModal(false);
                            setSelectedMonths([]);
                            setBukti('');
                        }}
                    />
                )}
            </div>
        </Layout>
    );
}

// --- RIWAYAT TAB -------------------------------------------------------------
const RiwayatTab = React.memo(({ records, onKonfirmasiClick, userType }) => {
    const belumBayar = records.filter(r => r.status === 'belum bayar').length;

    return (
        <div className="">
            <div className="border-b border-gray-200 flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    Daftar Status Pembayaran
                </h2>
                {belumBayar > 0 && (
                    <button
                        onClick={onKonfirmasiClick}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm mb-2"
                    >
                        Konfirmasi Pembayaran
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 mt-2">
                {records.map((r) => (
                    <div
                        key={`${r.tahun}-${r.bulan}`}
                        className="p-4 border rounded-md shadow-sm bg-white hover:bg-gray-50 transition"
                    >
                        <div className="text-sm font-medium text-gray-800 mb-2">
                            Bulan {r.namaBulan} {r.tahun}
                        </div>
                        <span
                            className={`px-3 py-1 text-xs font-semibold rounded-[8px] ${r.status === 'lunas'
                                ? 'bg-green-100 text-green-700'
                                : r.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                        >
                            {r.status === 'lunas'
                                ? 'KAMU LUNAS'
                                : r.status === 'pending'
                                    ? 'MENUNGGU VERIFIKASI'
                                    : 'BELUM BAYAR'}
                        </span>
                    </div>
                ))}
            </div>


            {userType === 'biman' && (
                <div className="p-4 bg-blue-50 border-t border-blue-100 mt-3">
                    <p className="text-sm text-blue-700">
                        Kamu termasuk dalam kategori Biman sehingga tidak dikenakan biaya sewa.
                    </p>
                </div>
            )}
        </div>
    );
});

// --- KONFIRMASI MODAL --------------------------------------------------------
const KonfirmasiModal = ({
    records,
    selectedMonths,
    setSelectedMonths,
    nominal,
    bukti,
    setBukti,
    handleKonfirmasi,
    userType,
    hargaPerBulan,
    onClose,
}) => {
    const [confirmModal, setConfirmModal] = useState(false);
    const [successModal, setSuccessModal] = useState(false);

    const send = async () => {
        try {
            await handleKonfirmasi();
            setConfirmModal(false);
            setSuccessModal(true);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <>
            {/* Main Modal */}
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-800">
                                Konfirmasi Pembayaran
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-2 border border-gray-200">
                            <p className="text-sm">
                                <span className="font-medium">Tipe User:</span> {userType}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Harga per Bulan:</span>{' '}
                                {hargaPerBulan === 0
                                    ? 'Gratis'
                                    : `Rp ${hargaPerBulan.toLocaleString('id-ID')}`}
                            </p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Pilih Bulan yang Akan Dibayar
                                {selectedMonths.length > 0 && (
                                    <span className="ml-2 text-gray-600">
                                        ({selectedMonths.length} bulan)
                                    </span>
                                )}
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {records
                                    .filter((r) => r.status === 'belum bayar')
                                    .map((r) => (
                                        <div
                                            key={`${r.tahun}-${r.bulan}`}
                                            className={`p-3 border rounded-lg cursor-pointer transition-all ${selectedMonths.some(
                                                (m) => m.tahun === r.tahun && m.bulan === r.bulan
                                            )
                                                ? 'border-gray-500 bg-gray-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            onClick={() =>
                                                setSelectedMonths((prev) =>
                                                    prev.some(
                                                        (m) => m.tahun === r.tahun && m.bulan === r.bulan
                                                    )
                                                        ? prev.filter(
                                                            (m) =>
                                                                !(m.tahun === r.tahun && m.bulan === r.bulan)
                                                        )
                                                        : [...prev, r]
                                                )
                                            }
                                        >
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    readOnly
                                                    checked={selectedMonths.some(
                                                        (m) => m.tahun === r.tahun && m.bulan === r.bulan
                                                    )}
                                                    className="mr-2 h-4 w-4 text-gray-600 rounded"
                                                />
                                                <span className="text-sm font-medium">
                                                    {r.namaBulan} {r.tahun}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Total Nominal
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                        Rp
                                    </span>
                                    <input
                                        type="text"
                                        value={nominal.toLocaleString('id-ID')}
                                        readOnly
                                        className="pl-10 border border-gray-300 rounded-lg px-4 py-2 w-full bg-gray-50"
                                    />
                                </div>
                                {hargaPerBulan === 0 && (
                                    <p className="mt-1 text-xs text-green-600">
                                        Gratis untuk user Biman
                                    </p>
                                )}
                            </div>

                            {hargaPerBulan > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Link Bukti Transfer
                                    </label>
                                    <input
                                        type="url"
                                        value={bukti}
                                        onChange={(e) => setBukti(e.target.value)}
                                        placeholder="https://contoh.com/bukti-transfer.jpg"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-500"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Upload bukti transfer ke Google Drive/Dropbox lalu masukkan link-nya di sini
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={onClose}
                                    className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() => setConfirmModal(true)}
                                    disabled={
                                        !selectedMonths.length || (hargaPerBulan > 0 && !bukti.trim())
                                    }
                                    className={`flex-1 py-2 rounded-lg font-medium text-white ${!selectedMonths.length || (hargaPerBulan > 0 && !bukti.trim())
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gray-600 hover:bg-gray-700'
                                        }`}
                                >
                                    {hargaPerBulan === 0
                                        ? 'Konfirmasi Pendaftaran'
                                        : 'Kirim Konfirmasi Pembayaran'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Konfirmasi */}
            {confirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            Konfirmasi
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Kamu akan membayar {selectedMonths.length} bulan sebesar{' '}
                            <span className="block text-2xl font-bold">
                                Rp {nominal.toLocaleString('id-ID')}
                            </span>
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmModal(false)}
                                className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={send}
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg"
                            >
                                Konfirmasi
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Sukses */}
            {successModal && (
                <SuccessModal
                    onClose={() => {
                        setSuccessModal(false);
                        onClose();
                    }}
                    message="Konfirmasi berhasil dikirim!"
                />
            )}
        </>
    );
};

// --- MODAL SUKSES ------------------------------------------------------------
const SuccessModal = ({ onClose, message }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-green-500 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">Sukses!</h3>
            <p className="text-gray-600 text-center mb-6">{message}</p>
            <button
                onClick={onClose}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
                Tutup
            </button>
        </div>
    </div>
);