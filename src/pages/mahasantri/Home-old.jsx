import { useNavigate, useLocation } from 'react-router-dom';
import BottomNavbar from '../../components/BottomNavbar';
import { useState, useEffect } from 'react';

function Home() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading state
        setTimeout(() => {
            setIsLoading(false);
        }, 500);

        // Check if URL has a hash for direct program navigation
        if (location.hash) {
            const hash = location.hash.substring(1);

            // Smooth scroll to section after a delay
            setTimeout(() => {
                document.getElementById(hash)?.scrollIntoView({
                    behavior: 'smooth'
                });
            }, 1200);
        }
    }, [location.hash]);

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

    if (isLoading) {
        return (
            <div className="min-h-screen max-w-3xl mx-auto flex flex-col items-center justify-center bg-blue-50">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-blue-800 font-medium">Memuat Data</p>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-slate-50 max-w-3xl mx-auto">
            <div className="flex-1 overflow-y-auto container px-4 pt-[70px] pb-20 scrollbar-hide">
                {/* back */}
                <div className="fixed top-0 left-0 right-0 bg-white z-50 max-w-3xl mx-auto border-b border-gray-300 py-3">
                    <div className=" w-full mx-auto px-6 flex justify-between items-center">
                        <h3 className="text-black flex items-center gap-2 cursor-pointer" onClick={() => navigate(-1)}>
                            <i className="ri-arrow-left-line text-lg"></i>Mahasantri
                        </h3>
                        <div className="flex items-center space-x-4">
                            <i className="ri-notification-3-line text-lg text-gray-700"></i>
                            <i className="ri-user-line text-lg text-gray-700"></i>
                        </div>
                    </div>
                </div>

                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-6 mb-6 relative overflow-hidden shadow-md">
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
                                <p className="font-medium">Kajian Tafsir | Shubuh</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">Total Mahasantri</span>
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <i className="ri-team-line text-blue-600"></i>
                            </div>
                        </div>
                        <p className="text-xl font-bold text-gray-800">10 Orang</p>
                        <p className="text-xs text-blue-600 mt-1">Kampus UI & NF</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">Total Ustadz</span>
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <i className="ri-group-line text-blue-600"></i>
                            </div>
                        </div>
                        <p className="text-xl font-bold text-gray-800">2 Orang</p>
                        <p className="text-xs text-blue-600 mt-1">Ust Kanzan & Ust Haidir</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-5 rounded-xl shadow-sm mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Akses Cepat</h3>
                    <div className="grid grid-cols-4 gap-3">
                        <div className="flex flex-col items-center" onClick={() => navigate('/program/mahasantri/setoran')}>
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                                <i className="ri-book-open-fill text-blue-600 text-xl"></i>
                            </div>
                            <span className="text-xs text-gray-600 text-center">Setoran</span>
                        </div>
                        <div className="flex flex-col items-center" onClick={() => navigate('/program/mahasantri/kehadiran')}>
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                                <i className="ri-discuss-fill text-blue-600 text-xl"></i>
                            </div>
                            <span className="text-xs text-gray-600 text-center">Kajian</span>
                        </div>
                        <div className="flex flex-col items-center" onClick={() => navigate('/program/mahasantri/profile/ustadz')}>
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                                <i className="ri-group-fill text-blue-600 text-xl"></i>
                            </div>
                            <span className="text-xs text-gray-600 text-center">Ustadz</span>
                        </div>
                        <div className="flex flex-col items-center" onClick={() => navigate('/program/mahasantri/profile/mahasantri')}>
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                                <i className="ri-team-fill text-blue-600 text-xl"></i>
                            </div>
                            <span className="text-xs text-gray-600 text-center">Mahasantri</span>
                        </div>
                    </div>
                </div>

                {/* Upcoming Activities */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Kegiatan Mendatang</h3>
                        <span className="text-xs text-blue-600 font-medium">Lihat Semua</span>
                    </div>

                    <div className="space-y-3">
                        {upcomingActivities.map(activity => (
                            <div key={activity.id} className="bg-white rounded-xl p-4 shadow-sm">
                                <div className="flex items-start">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                                        <i className={`${activity.icon} text-blue-600`}></i>
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
                        className="flex flex-col items-center p-4 bg-blue-600 rounded-xl shadow-sm transition hover:bg-blue-700"
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

                {/* Gallery */}
        <section id="gallery" className="mb-8 bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <i className="ri-image-line mr-2 text-blue-600"></i> Dokumentasi
            </h2>
            <a href="/program/mahasantri/gallery" className="text-blue-600 text-sm">Lihat Semua</a>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="aspect-square rounded-lg overflow-hidden shadow">
              <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhkq9rpqVR08NY9ImgYezuUEhozn4p3p32jOHcombHafgWu6qvoua3qgPAkqXocej7BHe4c6DnLN3YS8BDijefFV7P3MAyjjV1kE-Qsfc5w5smZOgzDkUfuadqLB6X8E8Rfe31uZExvPDwE/s320/kost+samping+UI+depok2.jpg" 
                className="w-full h-full object-cover" 
                alt="Tampak depan kost"
              />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden shadow">
              <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg4a0eCC4te68wBRzVlLBNVOoYnIla4fj7YUcxVaPFC3OvT3F7u2nV7ZFPVwi09XYa9C7LkuPJU-e6s8oYX3ubwWZZ61I9d8Iu3wYqI7mTpqmnXKgfImeD1SEIBoJlrOZjxB46Xn8rehCav/s400/kost+kosan+dekat+ui+depok+7.jpg" 
                className="w-full h-full object-cover" 
                alt="Kamar kost"
              />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden shadow">
              <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgTd9-m7mw-k8gLeFiTGFiXBfKKYxRz74TGcg1a-99iVWYeKHLYKqxc-r4-KTS9SmOacPpxNnGBE2wfeoK4D2nGQzuhv566FPjgzrlPvewkNDwqCcGKDuJzMzY48DOe25H8K0LfoSlBHD8u/s400/kost+dekat+UI+kutek.jpg" 
                className="w-full h-full object-cover" 
                alt="Fasilitas umum"
              />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden shadow">
              <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjt0zVF3T7bA5er94hf6lLPJ2hSFlEvqCgu-f24C_C4G-F4QWbOc-qWntHdhK3ppXUOMLWW1W18MyC3rzZi90Nt6fG2yrY1SAq2235rwbMdvWtiPHBV1rTjmktwRfQGqEdtMeraQpFDrVlF/s1600/KOST+UI+DEPOK+KUTEK+KAHFI2.JPG" 
                className="w-full h-full object-cover" 
                alt="Area sekitar kost"
              />
            </div>
          </div>
          
          <div className="mt-3">
            <a href="/program/mahasantri/gallery" className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center">
              Lihat Galeri Lengkap <i className="ri-arrow-right-line ml-2"></i>
            </a>
          </div>
        </section>

                {/* Recent Activity */}
                {/* <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Aktivitas Terakhir</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <img src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740" alt="Avatar" className="rounded-full w-8 h-8 mr-3" />
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <h4 className="text-sm font-medium text-gray-800">Ust. Kanzan</h4>
                                    <span className="text-xs text-gray-500">Kemarin</span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">Memberikan nilai mumtaz pada setoran surah Al-Mulk halaman 3</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <img src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740" alt="Avatar" className="rounded-full w-8 h-8 mr-3" />
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <h4 className="text-sm font-medium text-gray-800">Ust. Abdullah Haidir</h4>
                                    <span className="text-xs text-gray-500">2 hari lalu</span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">Menambahkan catatan pada kajian Fiqih Muamalah</p>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
            {/* Bottom Navbar */}
            <BottomNavbar />
        </div>
    );
}

export default Home;