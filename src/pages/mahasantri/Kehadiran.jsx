import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import BottomNavbar from '../../components/BottomNavbar';
import { useNavigate } from 'react-router-dom';

function Kehadiran() {
    const navigate = useNavigate();

    const [kehadiranList, setKehadiranList] = useState([]);
    const [filter, setFilter] = useState({
        asatidz: '',
        jenis: '',
        month: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAttendance, setSelectedAttendance] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState('semua');

    useEffect(() => {
        const fetchKehadiran = async () => {
            try {
                setLoading(true);
                setError(null);
                const querySnapshot = await getDocs(collection(db, 'kehadiran_kajian'));
                const data = querySnapshot.docs.map(doc => {
                    const docData = doc.data();
                    return {
                        id: doc.id,
                        ...docData,
                        waktu: docData.waktu?.toDate() || null
                    };
                }).reverse();
                setKehadiranList(data);
            } catch (err) {
                console.error("Gagal memuat data:", err);
                setError("Gagal memuat data kehadiran");
            } finally {
                setLoading(false);
            }
        };

        fetchKehadiran();
    }, []);

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

    // Handle tab change and update jenis filter
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'semua') {
            setFilter({ ...filter, jenis: '' });
        } else if (tab === 'online') {
            setFilter({ ...filter, jenis: 'online' });
        } else if (tab === 'offline') {
            setFilter({ ...filter, jenis: 'offline' });
        }
    };

    const filteredData = kehadiranList.filter(data => {
        const matchesAsatidz = filter.asatidz === '' || data.asatidz === filter.asatidz;
        const matchesJenis = filter.jenis === '' || data.jenis === filter.jenis;
        const matchesMonth = filter.month === '' ||
            (data.waktu && data.waktu.toLocaleDateString('id-ID', { month: 'long' }) === filter.month);

        return matchesAsatidz && matchesJenis && matchesMonth;
    });

    const handleShowAttendance = (data) => {
        setSelectedAttendance(data);
        setShowModal(true);
    };

    // Calculate statistics
    const totalKajian = kehadiranList.length;
    const totalOnline = kehadiranList.filter(item => item.jenis === 'online').length;
    const totalOffline = kehadiranList.filter(item => item.jenis === 'offline').length;

    // Count unique asatidz
    const uniqueAsatidz = new Set(kehadiranList.map(item => item.asatidz)).size;

    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600 font-medium">Memuat data kehadiran...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-md max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <i className="ri-error-warning-line text-3xl text-red-500"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Terjadi Kesalahan</h3>
                    <p className="text-gray-600">{error}</p>
                    <button
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
                        onClick={() => window.location.reload()}
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-slate-50">
            <div className="flex-1 overflow-y-auto container mx-auto px-4 pt-[70px] pb-20">
                {/* Header */}
                <div className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-300 py-3">
                    <div className="w-full mx-auto px-6 flex justify-between items-center">
                        <h3 className="text-black flex items-center gap-2 cursor-pointer" onClick={() => navigate(-1)}>
                            <i className="ri-arrow-left-line text-lg"></i> Kajian
                        </h3>
                        <div className="flex items-center space-x-4">
                            <i className="ri-notification-3-line text-lg text-gray-700"></i>
                            <i className="ri-user-line text-lg text-gray-700"></i>
                        </div>
                    </div>
                </div>

                {/* Page Title with Gradient Background */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-6 mb-6 relative overflow-hidden shadow-md">
                    <div className="absolute top-0 right-0 opacity-20">
                        <i className="ri-discuss-line text-9xl text-white"></i>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Data Kehadiran Kajian</h1>
                    <p className="text-white text-sm opacity-90">Riwayat kehadiran kajian dan pembelajaran</p>
                    <div className="mt-4 bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                        <div className="flex items-center text-white">
                            <i className="ri-calendar-check-line mr-2"></i>
                            <div>
                                <p className="text-xs">Total Kajian</p>
                                <p className="font-medium">{totalKajian} Kajian Tercatat</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">Online</span>
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <i className="ri-computer-line text-blue-600"></i>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{totalOnline}</p>
                        <p className="text-xs text-blue-600 mt-1">Kajian online</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">Offline</span>
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <i className="ri-user-voice-line text-green-600"></i>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{totalOffline}</p>
                        <p className="text-xs text-green-600 mt-1">Kajian tatap muka</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">Asatidz</span>
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <i className="ri-user-star-line text-purple-600"></i>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{uniqueAsatidz}</p>
                        <p className="text-xs text-purple-600 mt-1">Jumlah pengajar</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">Pekan Ini</span>
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <i className="ri-calendar-line text-blue-600"></i>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">
                            {kehadiranList.filter(item => {
                                if (!item.waktu) return false;
                                const now = new Date();
                                const day = now.getDay(); // 0 (Sunday) to 6 (Saturday)
                                const diffToMonday = (day === 0 ? -6 : 1) - day; // Senin sebagai awal pekan
                                const monday = new Date(now);
                                monday.setDate(now.getDate() + diffToMonday);
                                monday.setHours(0, 0, 0, 0);

                                const nextMonday = new Date(monday);
                                nextMonday.setDate(monday.getDate() + 7);

                                const waktu = new Date(item.waktu);
                                return waktu >= monday && waktu < nextMonday;
                            }).length}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">Kajian pekan ini</p>
                    </div>

                </div>

                {/* Tab Navigation */}
                <div className="flex mb-4 bg-white rounded-xl p-1 shadow-sm">
                    <button
                        className={`flex-1 py-2 text-sm font-medium rounded-lg ${activeTab === 'semua' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                        onClick={() => handleTabChange('semua')}
                    >
                        Semua
                    </button>
                    <button
                        className={`flex-1 py-2 text-sm font-medium rounded-lg ${activeTab === 'online' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                        onClick={() => handleTabChange('online')}
                    >
                        Online
                    </button>
                    <button
                        className={`flex-1 py-2 text-sm font-medium rounded-lg ${activeTab === 'offline' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                        onClick={() => handleTabChange('offline')}
                    >
                        Offline
                    </button>
                </div>

                {/* Filter Section */}
                <div className="bg-white p-4 rounded-xl shadow-sm mb-5">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-800">Filter Data</h3>
                        <button
                            className="text-xs text-blue-600 font-medium flex items-center"
                            onClick={() => setFilter({ asatidz: '', jenis: '', month: '' })}
                        >
                            <i className="ri-refresh-line mr-1"></i> Reset
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Asatidz</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-600 bg-gray-50"
                                value={filter.asatidz}
                                onChange={(e) => setFilter({ ...filter, asatidz: e.target.value })}
                            >
                                <option value="">Semua Asatidz</option>
                                <option value="Ustadz Khanzan">Ustadz Khanzan</option>
                                <option value="Ustadz Haidir">Ustadz Haidir</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Bulan</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-600 bg-gray-50"
                                value={filter.month}
                                onChange={(e) => setFilter({ ...filter, month: e.target.value })}
                            >
                                <option value="">Semua Bulan</option>
                                {Array.from({ length: 12 }, (_, i) => {
                                    const date = new Date(0, i);
                                    return (
                                        <option key={i} value={date.toLocaleDateString('id-ID', { month: 'long' })}>
                                            {date.toLocaleDateString('id-ID', { month: 'long' })}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Kehadiran Cards */}
                <div className="space-y-4 mb-10">
                    {filteredData.length === 0 ? (
                        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="ri-file-search-line text-2xl text-gray-400"></i>
                            </div>
                            <h3 className="text-gray-800 font-medium mb-1">Tidak ada data</h3>
                            <p className="text-sm text-gray-500">Tidak ada data kehadiran yang sesuai dengan filter yang dipilih</p>
                        </div>
                    ) : (
                        filteredData.map((data) => (
                            <div key={data.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="p-4">
                                    <div className="flex items-start">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${data.jenis === 'online' ? 'bg-blue-100' : 'bg-green-100'
                                            }`}>
                                            <i className={`${data.jenis === 'online' ? 'ri-computer-line text-blue-600' : 'ri-user-voice-line text-green-600'
                                                } text-xl`}></i>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium text-gray-800">{data.tema}</h4>
                                                    <p className="text-sm text-gray-600 mt-1">{data.asatidz}</p>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs ${data.jenis === 'online' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {data.jenis}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-y-2 gap-x-3 mt-3 text-xs">
                                                <div className="flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                                    <i className="ri-calendar-line mr-1"></i>
                                                    <span>{formatDate(data.waktu)}</span>
                                                </div>
                                                <div className="flex items-center px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                                                    <i className="ri-group-line mr-1"></i>
                                                    <span>{data.peserta?.filter(p => p.hadir).length || 0} dari {data.peserta?.length || 0} hadir</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
                                    <button
                                        onClick={() => handleShowAttendance(data)}
                                        className="text-xs bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 flex items-center"
                                    >
                                        <i className="ri-group-line mr-1"></i> Lihat Detail Kehadiran
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Attendance Detail Modal */}
                {showModal && selectedAttendance && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-4 rounded-t-xl">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-white">
                                        Detail Kehadiran
                                    </h3>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="text-white hover:text-blue-200"
                                    >
                                        <i className="ri-close-line text-xl"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 max-h-96 overflow-y-auto text-gray-800">
                                <div className="mb-4 space-y-2 bg-blue-50 p-3 rounded-lg">
                                    <div className="flex items-center">
                                        <i className="ri-calendar-line text-blue-600 mr-2"></i>
                                        <p className="text-sm">{formatDate(selectedAttendance.waktu)}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <i className="ri-user-star-line text-blue-600 mr-2"></i>
                                        <p className="text-sm">{selectedAttendance.asatidz}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <i className="ri-book-open-line text-blue-600 mr-2"></i>
                                        <p className="text-sm">{selectedAttendance.tema}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <i className={`${selectedAttendance.jenis === 'online' ? 'ri-computer-line' : 'ri-user-voice-line'} text-blue-600 mr-2`}></i>
                                        <p className="text-sm">{selectedAttendance.jenis}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-semibold text-gray-800">Daftar Mahasantri:</h4>
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                        {selectedAttendance.peserta?.filter(p => p.hadir).length || 0}/{selectedAttendance.peserta?.length || 0} Hadir
                                    </span>
                                </div>

                                <div className="bg-gray-50 rounded-lg">
                                    <ul className="divide-y divide-gray-200">
                                        {selectedAttendance.peserta?.map((peserta, index) => (
                                            <li key={index} className="flex justify-between items-center p-3">
                                                <div className="flex items-center">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${peserta.hadir ? 'bg-green-100' : 'bg-red-100'
                                                        }`}>
                                                        <i className={`${peserta.hadir ? 'ri-check-line text-green-600' : 'ri-close-line text-red-600'
                                                            }`}></i>
                                                    </div>
                                                    <span className="text-sm font-medium">{peserta.nama}</span>
                                                </div>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${peserta.hadir
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                        }`}
                                                >
                                                    {peserta.hadir ? 'Hadir' : 'Tidak Hadir'}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-gray-200 flex justify-end">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Navbar */}
            <BottomNavbar />
        </div>
    );
}

export default Kehadiran;