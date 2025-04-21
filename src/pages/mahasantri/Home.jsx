import { useNavigate } from 'react-router-dom';
import BottomNavbar from '../../components/BottomNavbar';

function Home() {
    const navigate = useNavigate();
    
    // Dummy data
    const upcomingActivities = [
        {
            id: 1,
            title: "Setoran Surah Al-Kahfi",
            date: "23 April 2025",
            time: "07:30 - 09:00",
            location: "Ruang Tahfidz Lt. 2",
            icon: "ri-book-open-line"
        },
        {
            id: 2,
            title: "Kajian Tafsir Ibnu Katsir",
            date: "24 April 2025",
            time: "19:30 - 21:00",
            location: "Aula Utama",
            icon: "ri-discuss-line"
        },
        {
            id: 3,
            title: "Setoran Hadits Arba'in",
            date: "25 April 2025",
            time: "15:30 - 17:00",
            location: "Ruang Tahfidz Lt. 1",
            icon: "ri-book-open-line"
        }
    ];

    return (
        <div className="h-screen flex flex-col bg-slate-50">
            <div className="flex-1 overflow-y-auto container mx-auto px-4 pt-[70px] pb-20">
                {/* back */}
                <div className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-300 py-3">
                    <div className=" w-full mx-auto px-6 flex justify-between items-center">
                        <h3 className="text-black flex items-center gap-2 cursor-pointer" onClick={() => navigate(-1)}>
                            <i className="ri-arrow-left-line text-lg"></i> Mahasantri
                        </h3>
                        <div className="flex items-center space-x-4">
                            <i className="ri-notification-3-line text-lg text-gray-700"></i>
                            <i className="ri-user-line text-lg text-gray-700"></i>
                        </div>
                    </div>
                </div>

                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-2xl p-6 mb-6 relative overflow-hidden shadow-md">
                    <div className="absolute top-0 right-0 opacity-20">
                        <i className="ri-quran-line text-9xl text-white"></i>
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2">Assalamu'alaikum</h2>
                    <p className="text-white text-sm mb-4">Selamat datang di Program Mahasantri Pesantren Digital</p>
                    <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                        <div className="flex items-center text-white">
                            <i className="ri-calendar-event-line mr-2"></i>
                            <div>
                                <p className="text-xs">Jadwal Hari Ini</p>
                                <p className="font-medium">Setoran Hafalan Ba'da Shubuh</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">Total Setoran</span>
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <i className="ri-book-mark-line text-blue-600"></i>
                            </div>
                        </div>
                        <p className="text-xl font-bold text-gray-800">14 Juz</p>
                        <p className="text-xs text-green-600 mt-1">+2 halaman minggu ini</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">Kajian Diikuti</span>
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <i className="ri-discuss-line text-purple-600"></i>
                            </div>
                        </div>
                        <p className="text-xl font-bold text-gray-800">28 Kajian</p>
                        <p className="text-xs text-green-600 mt-1">3 kajian bulan ini</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Akses Cepat</h3>
                    <div className="grid grid-cols-4 gap-3">
                        <div className="flex flex-col items-center" onClick={() => navigate('/setoran')}>
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-1">
                                <i className="ri-book-open-fill text-green-600 text-xl"></i>
                            </div>
                            <span className="text-xs text-gray-600 text-center">Setoran</span>
                        </div>
                        <div className="flex flex-col items-center" onClick={() => navigate('/kajian')}>
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                                <i className="ri-discuss-fill text-blue-600 text-xl"></i>
                            </div>
                            <span className="text-xs text-gray-600 text-center">Kajian</span>
                        </div>
                        <div className="flex flex-col items-center" onClick={() => navigate('/jadwal')}>
                            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-1">
                                <i className="ri-calendar-line text-amber-600 text-xl"></i>
                            </div>
                            <span className="text-xs text-gray-600 text-center">Jadwal</span>
                        </div>
                        <div className="flex flex-col items-center" onClick={() => navigate('/profile')}>
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-1">
                                <i className="ri-user-line text-purple-600 text-xl"></i>
                            </div>
                            <span className="text-xs text-gray-600 text-center">Profil</span>
                        </div>
                    </div>
                </div>

                {/* Upcoming Activities */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Kegiatan Mendatang</h3>
                        <span className="text-xs text-green-600 font-medium">Lihat Semua</span>
                    </div>

                    <div className="space-y-3">
                        {upcomingActivities.map(activity => (
                            <div key={activity.id} className="bg-white rounded-xl p-4 shadow-sm">
                                <div className="flex items-start">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                                        <i className={`${activity.icon} text-green-600`}></i>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-800">{activity.title}</h4>
                                        <div className="flex flex-wrap gap-y-1 gap-x-3 mt-2 text-xs text-gray-500">
                                            <div className="flex items-center">
                                                <i className="ri-calendar-line mr-1"></i>
                                                <span>{activity.date}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <i className="ri-time-line mr-1"></i>
                                                <span>{activity.time}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <i className="ri-map-pin-line mr-1"></i>
                                                <span>{activity.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Data Buttons */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <button 
                        onClick={() => navigate('/program/mahasantri/setoran')}
                        className="flex flex-col items-center p-4 bg-green-600 rounded-xl shadow-sm transition hover:bg-green-700"
                    >
                        <i className="ri-file-list-3-line text-white text-2xl mb-2"></i>
                        <span className="text-white font-medium">Lihat Data Setoran</span>
                    </button>
                    <button 
                        onClick={() => navigate('/program/mahasantri/kehadiran')}
                        className="flex flex-col items-center p-4 bg-blue-600 rounded-xl shadow-sm transition hover:bg-blue-700"
                    >
                        <i className="ri-file-chart-line text-white text-2xl mb-2"></i>
                        <span className="text-white font-medium">Lihat Data Kajian</span>
                    </button>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Aktivitas Terakhir</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <img src="/api/placeholder/50/50" alt="Avatar" className="rounded-full w-8 h-8 mr-3" />
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <h4 className="text-sm font-medium text-gray-800">Ust. Ahmad Faiz</h4>
                                    <span className="text-xs text-gray-500">Kemarin</span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">Memberikan nilai mumtaz pada setoran surah Al-Mulk halaman 3</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <img src="/api/placeholder/50/50" alt="Avatar" className="rounded-full w-8 h-8 mr-3" />
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <h4 className="text-sm font-medium text-gray-800">Ust. Muhammad Hasan</h4>
                                    <span className="text-xs text-gray-500">2 hari lalu</span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">Menambahkan catatan pada kajian Fiqih Muamalah</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Bottom Navbar */}
            <BottomNavbar />
        </div>
    );
}

export default Home;