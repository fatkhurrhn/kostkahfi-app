// src/pages/dashboard/users/ManagePembayaran.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, query, where, onSnapshot, serverTimestamp, orderBy } from 'firebase/firestore';
import { app } from '../../../../firebase';

export default function ManagePembayaranUser() {
    const [records, setRecords] = useState([]);
    const [selectedMonths, setSelectedMonths] = useState([]);
    const [nominal, setNominal] = useState(0);
    const [bukti, setBukti] = useState('');
    const [userName, setUserName] = useState('');
    const [userType, setUserType] = useState('reguler'); // reguler, mahasantri, biman
    const [loading, setLoading] = useState(true);
    const [uid, setUid] = useState(null);
    const [activeTab, setActiveTab] = useState('konfirmasi');
    const [tglMasuk] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    // Harga per bulan berdasarkan tipe user
    const HARGA_PER_BULAN = {
        reguler: 750000,
        mahasantri: 350000,
        biman: 0
    };

    /* ---------- Auth State Listener ---------- */
    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                navigate('/login');
                return;
            }
            setUid(user.uid);
            setUserName(user.displayName || user.email || user.uid);
            try {
                await fetchUserData(user.uid);
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Gagal memuat data pengguna');
            } finally {
                setLoading(false);
            }
        });
        return () => unsubscribeAuth();
    }, [navigate]);

    const fetchUserData = async (currentUid) => {
        const db = getFirestore(app);

        try {
            // Cari data user
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('userId', '==', currentUid));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data();

                if (userData.tipeUser) {
                    setUserType(userData.tipeUser);
                }
            }

            // Setup listener dengan error handling
            const unsubscribe = setupPaymentListener(currentUid);

            // Cleanup function
            return () => unsubscribe();
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError('Gagal memuat data pengguna');
            return () => { }; // Return empty cleanup function
        }
    };

    /* ---------- Payment Listener ---------- */
    const setupPaymentListener = (userId) => {
        const db = getFirestore(app);
        const paymentQuery = query(
            collection(db, 'pembayaran'),
            where('userId', '==', userId),
            orderBy('updatedAt', 'desc')
        );

        const unsubscribe = onSnapshot(paymentQuery, (snapshot) => {
            const paidMonths = {};
            snapshot.forEach(doc => {
                const data = doc.data();
                const key = `${data.tahun}-${data.bulan}`;

                // Prioritize 'lunas' status over 'pending'
                if (!paidMonths[key] || data.status === 'lunas') {
                    paidMonths[key] = data.status === 'lunas' ? 'lunas' : 'pending';
                }
            });

            generateMonthRecords(paidMonths);
        }, (error) => {
            console.error('Payment listener error:', error);
            setError('Gagal memuat data pembayaran');
        });

        return unsubscribe;
    };

    /* ---------- Generate Month Records ---------- */
    const generateMonthRecords = (paidMonths = {}) => {
        // Tetapkan rentang tetap dari Jan 2025 sampai Des 2026
        const startDate = new Date(2025, 0, 1); // Januari 2025
        const endDate = new Date(2026, 11, 31); // Desember 2026

        let currentDate = new Date(startDate);
        const list = [];

        while (currentDate <= endDate) {
            const tahun = currentDate.getFullYear();
            const bulan = currentDate.getMonth() + 1;

            list.push({
                tahun,
                bulan,
                namaBulan: currentDate.toLocaleDateString('id-ID', { month: 'long' }),
                status: paidMonths[`${tahun}-${bulan}`] || 'belum bayar'
            });

            // Tambah 1 bulan
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        console.log('Daftar bulan yang dihasilkan:', list);
        setRecords(list);
    };

    /* ---------- Effect untuk update records ketika tglMasuk berubah ---------- */
    useEffect(() => {
        if (tglMasuk) {
            // Re-generate records dengan data pembayaran terbaru
            setupPaymentListener(uid);
        }
    }, [tglMasuk, uid]);

    /* ---------- Effect untuk update nominal otomatis ---------- */
    useEffect(() => {
        const hargaPerBulan = HARGA_PER_BULAN[userType] || 0;
        const totalNominal = selectedMonths.length * hargaPerBulan;
        setNominal(totalNominal);
    }, [selectedMonths, userType]);

    /* ---------- Handle Konfirmasi ---------- */
    const handleKonfirmasi = async () => {
        if (!selectedMonths.length || !bukti.trim()) {
            alert('Pilih bulan & masukkan link bukti');
            return;
        }

        if (!window.confirm(`Konfirmasi pembayaran untuk ${selectedMonths.length} bulan dengan total Rp ${nominal.toLocaleString('id-ID')}?`)) {
            return;
        }

        try {
            const db = getFirestore(app);
            const batch = selectedMonths.map(m =>
                addDoc(collection(db, 'pembayaran'), {
                    userId: uid,
                    tahun: m.tahun,
                    bulan: m.bulan,
                    nominal,
                    buktiUrl: bukti,
                    status: 'pending',
                    userType: userType,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                })
            );

            await Promise.all(batch);
            setSelectedMonths([]);
            setBukti('');
            alert('Konfirmasi pembayaran berhasil dikirim!');
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat mengirim konfirmasi');
        }
    };

    /* ---------- Skeleton Loading ---------- */
    const SkeletonUser = () => (
        <div className="p-6 space-y-4">
            <div className="h-8 bg-gray-200 rounded-full w-1/2 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                ))}
            </div>
        </div>
    );

    /* ---------- Error Display ---------- */
    if (error) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="text-red-600 font-medium mb-2">Error</div>
                <p className="mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Coba Lagi
                </button>
            </div>
        );
    }

    /* ---------- Render Main Content ---------- */
    if (loading) return <SkeletonUser />;

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Pembayaran Saya</h1>
                    <div className="flex gap-2">
                        <div className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full capitalize">
                            {userType}
                        </div>
                        <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                            {userName}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b mb-6">
                    <button
                        onClick={() => setActiveTab('konfirmasi')}
                        className={`px-4 py-2 font-medium ${activeTab === 'konfirmasi' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    >
                        Konfirmasi Pembayaran
                    </button>
                    <button
                        onClick={() => setActiveTab('riwayat')}
                        className={`px-4 py-2 font-medium ${activeTab === 'riwayat' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    >
                        Riwayat Pembayaran
                    </button>
                </div>

                {/* Content based on active tab */}
                {activeTab === 'konfirmasi' ? (
                    <KonfirmasiTab
                        records={records}
                        selectedMonths={selectedMonths}
                        setSelectedMonths={setSelectedMonths}
                        nominal={nominal}
                        bukti={bukti}
                        setBukti={setBukti}
                        handleKonfirmasi={handleKonfirmasi}
                        tglMasuk={tglMasuk}
                        userType={userType}
                        hargaPerBulan={HARGA_PER_BULAN[userType]}
                    />
                ) : (
                    <RiwayatTab records={records} />
                )}
            </div>
        </div>
    );
}

/* ---------- Konfirmasi Tab Component ---------- */
const KonfirmasiTab = ({
    records,
    selectedMonths,
    setSelectedMonths,
    nominal,
    bukti,
    setBukti,
    handleKonfirmasi,
    userType,
    hargaPerBulan
}) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Konfirmasi Pembayaran</h2>

            {/* Info User */}
            <div className="mb-4 p-4 bg-blue-50 rounded-lg space-y-2">
                <p className="text-sm text-blue-800">
                    <span className="font-medium">Tipe User:</span> <span className="capitalize">{userType}</span>
                </p>
                <p className="text-sm text-blue-800">
                    <span className="font-medium">Harga per Bulan:</span> {hargaPerBulan === 0 ? 'Gratis' : `Rp ${hargaPerBulan.toLocaleString('id-ID')}`}
                </p>
            </div>

            {/* Pilih bulan */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Bulan yang Akan Dibayar:
                    {selectedMonths.length > 0 && (
                        <span className="ml-2 text-blue-600">({selectedMonths.length} bulan dipilih)</span>
                    )}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {records.filter(r => r.status === 'belum bayar').map(r => (
                        <div
                            key={`${r.tahun}-${r.bulan}`}
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${selectedMonths.some(m => m.tahun === r.tahun && m.bulan === r.bulan)
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                            onClick={() => {
                                setSelectedMonths(prev =>
                                    prev.some(m => m.tahun === r.tahun && m.bulan === r.bulan)
                                        ? prev.filter(m => !(m.tahun === r.tahun && m.bulan === r.bulan))
                                        : [...prev, r]
                                );
                            }}
                        >
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedMonths.some(m => m.tahun === r.tahun && m.bulan === r.bulan)}
                                    onChange={() => { }}
                                    className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium">{r.namaBulan} {r.tahun}</span>
                            </div>
                        </div>
                    ))}
                </div>
                {records.filter(r => r.status === 'belum bayar').length === 0 && (
                    <p className="text-gray-500 text-sm mt-2">Tidak ada bulan yang perlu dibayar</p>
                )}
            </div>

            {/* Form pembayaran */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Nominal Pembayaran</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
                        <input
                            type="text"
                            value={nominal.toLocaleString('id-ID')}
                            readOnly
                            className="pl-10 border border-gray-300 rounded-lg px-4 py-2 w-full bg-gray-50 text-gray-700"
                        />
                    </div>
                    {hargaPerBulan === 0 && (
                        <p className="mt-1 text-xs text-green-600">Gratis untuk user tipe Biman</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Link Bukti Transfer</label>
                    <input
                        type="url"
                        value={bukti}
                        onChange={e => setBukti(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://contoh.com/bukti-transfer.jpg"
                        disabled={hargaPerBulan === 0}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        {hargaPerBulan === 0
                            ? 'Tidak perlu bukti transfer untuk user gratis'
                            : 'Upload bukti transfer ke Google Drive/Dropbox lalu masukkan link-nya'
                        }
                    </p>
                </div>

                <button
                    onClick={handleKonfirmasi}
                    disabled={!selectedMonths.length || (hargaPerBulan > 0 && !bukti)}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white ${!selectedMonths.length || (hargaPerBulan > 0 && !bukti)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                        } transition-colors`}
                >
                    {hargaPerBulan === 0 ? 'Konfirmasi Pendaftaran' : 'Kirim Konfirmasi Pembayaran'}
                </button>
            </div>
        </div>
    </div>
);

/* ---------- Riwayat Tab Component ---------- */
const RiwayatTab = ({ records }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bulan/Tahun</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {records.map(r => (
                        <tr key={`${r.tahun}-${r.bulan}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{r.namaBulan} {r.tahun}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${r.status === 'lunas' ? 'bg-green-100 text-green-800' :
                                    r.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                    {r.status.toUpperCase()}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);