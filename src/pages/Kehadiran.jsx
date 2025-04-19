import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import BottomNavbar from '../components/BottomNavbar';

function Kehadiran() {
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

    useEffect(() => {
        const fetchKehadiran = async () => {
/*************  ✨ Windsurf Command ⭐  *************/
        /**
         * Fetch kehadiran data from Firestore
         * @returns {Promise<void>}
/*******  b8fec70d-d89a-4a85-839d-797b6180c2b6  *******/            
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
                }).reverse(); // Tambahkan .reverse() di sini
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

    if (loading) return <div className="container mx-auto px-4 py-8 text-center">Memuat data...</div>;
    if (error) return <div className="container mx-auto px-4 py-8 text-center text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8 pt-[70px] bg-white">
            <BottomNavbar />
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Rekap Kehadiran Kajian</h1>

            {/* Filter Section */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-300 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Asatidz</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            value={filter.asatidz}
                            onChange={(e) => setFilter({ ...filter, asatidz: e.target.value })}
                        >
                            <option value="">Semua Asatidz</option>
                            <option value="Ustadz Khanzan">Ustadz Khanzan</option>
                            <option value="Ustadz Haidir">Ustadz Haidir</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jenis</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            value={filter.jenis}
                            onChange={(e) => setFilter({ ...filter, jenis: e.target.value })}
                        >
                            <option value="">Semua Jenis</option>
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
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

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
                {filteredData.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        Tidak ada data kehadiran yang ditemukan
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asatidz</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tema</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peserta Hadir</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredData.map((data) => (
                                    <tr key={data.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-700">{formatDate(data.waktu)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-700">{data.asatidz}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs ${data.jenis === 'online' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                {data.jenis}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-700">{data.tema}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <span className="text-sm text-gray-700 mr-2">
                                                    {data.peserta?.filter(p => p.hadir).length || 0} dari {data.peserta?.length || 0} mahasantri
                                                </span>
                                                <button
                                                    onClick={() => handleShowAttendance(data)}
                                                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                                >
                                                    Detail
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Attendance Detail Modal - Light Mode */}
            {showModal && selectedAttendance && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Detail Kehadiran - {formatDate(selectedAttendance.waktu)}
                            </h3>
                        </div>

                        {/* Content */}
                        <div className="p-4 max-h-96 overflow-y-auto text-gray-800">
                            <div className="mb-4 space-y-1">
                                <p><span className="font-semibold">Asatidz:</span> {selectedAttendance.asatidz}</p>
                                <p><span className="font-semibold">Tema:</span> {selectedAttendance.tema}</p>
                                <p><span className="font-semibold">Jenis:</span> {selectedAttendance.jenis}</p>
                            </div>

                            <h4 className="font-semibold mb-2 text-gray-800">Daftar Mahasantri:</h4>
                            <ul className="space-y-2">
                                {selectedAttendance.peserta?.map((peserta, index) => (
                                    <li key={index} className="flex justify-between items-center">
                                        <span>{peserta.nama}</span>
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

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Kehadiran;