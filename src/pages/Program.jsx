import BottomNavbar from '../components/BottomNavbar';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Program() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [isTestimonialExpanded, setIsTestimonialExpanded] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading state
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);

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

    const openRegisterModal = (program) => {
        setSelectedProgram(program);
        setShowRegisterModal(true);
    };

    const toggleTestimonial = (id) => {
        setIsTestimonialExpanded(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const sponsors = [
        { name: "Yayasan Al-Barakah", logo: "ri-community-line" },
        { name: "PT. Amanah Sejahtera", logo: "ri-building-4-line" },
        { name: "Baitul Maal Hidayatullah", logo: "ri-bank-line" },
        { name: "Koperasi Syariah Al-Ikhlas", logo: "ri-wallet-3-line" },
        { name: "Tokopedia Wakaf", logo: "ri-shopping-bag-line" },
    ];

    const testimonials = [
        {
            id: 1,
            name: "Ahmad Fauzi",
            role: "Alumni Mahasantri 2024",
            avatar: "/api/placeholder/100/100",
            rating: 5,
            text: "Program Mahasantri benar-benar mengubah hidup saya. Saya belajar banyak tentang agama dan menghafal Al-Qur'an dengan metode yang mudah dipahami. Ustadz-ustadznya sangat sabar dan profesional dalam membimbing kami. Sekarang saya sudah menjadi guru tahfidz di pesantren daerah saya. Sangat merekomendasikan program ini!",
            photo: "/api/placeholder/400/300"
        },
        {
            id: 2,
            name: "Siti Aisyah",
            role: "Peserta BIMAN Angkatan 5",
            avatar: "/api/placeholder/100/100",
            rating: 5,
            text: "Sebagai mahasiswa kedokteran, jadwal saya sangat padat. Program BIMAN memberikan fleksibilitas untuk tetap belajar agama tanpa mengganggu kuliah. Materi-materinya sangat relevan dengan kehidupan sehari-hari dan mudah diaplikasikan. Semoga program ini terus berkembang dan memberi manfaat untuk lebih banyak orang.",
            photo: "/api/placeholder/400/300"
        },
        {
            id: 3,
            name: "Rizky Pratama",
            role: "Professional, Peserta BIMAN",
            avatar: "/api/placeholder/100/100",
            rating: 4,
            text: "Program BIMAN sangat cocok untuk para pekerja seperti saya. Jadwalnya yang fleksibel memungkinkan saya tetap bisa mengikuti kajian di tengah kesibukan. Pembimbingnya sangat memahami kondisi peserta, materi dibuat ringkas tapi berbobot. Alhamdulillah, spiritualitas saya jauh lebih baik setelah mengikuti program ini.",
            photo: null
        }
    ];

    const faqs = [
        {
            question: "Bagaimana cara mendaftar program Mahasantri?",
            answer: "Pendaftaran program Mahasantri dibuka 2 kali setahun (Januari dan Juli). Anda dapat mendaftar melalui website ini atau datang langsung ke kantor kami. Seleksi meliputi tes tulis, wawancara, dan hafalan Al-Qur'an."
        },
        {
            question: "Apakah program BIMAN menyediakan sertifikat?",
            answer: "Ya, setiap peserta yang menyelesaikan program BIMAN akan mendapatkan sertifikat digital dan cetak. Sertifikat ini diakui oleh beberapa institusi pendidikan Islam sebagai kredit tambahan."
        },
        {
            question: "Bagaimana jika saya melewatkan beberapa pertemuan?",
            answer: "Untuk program BIMAN, kami menyediakan rekaman video setiap pertemuan yang bisa diakses melalui aplikasi. Namun, kehadiran minimal 75% tetap diperlukan untuk mendapatkan sertifikat."
        },
        {
            question: "Apakah ada beasiswa untuk program Mahasantri?",
            answer: "Ya, kami menyediakan beasiswa penuh untuk 3 peserta terbaik dan beasiswa parsial untuk 5 peserta lainnya berdasarkan kemampuan akademik dan kondisi ekonomi."
        }
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-blue-800 font-medium">Memuat Program...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-blue-50">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white shadow-md py-3 px-4">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center text-blue-900"
                    >
                        <i className="ri-arrow-left-line text-xl mr-2"></i>
                        <span className="font-medium">Program</span>
                    </button>
                    <div className="flex items-center space-x-3">
                        <button className="text-blue-600">
                            <i className="ri-search-line text-xl"></i>
                        </button>
                        <button className="text-blue-600">
                            <i className="ri-share-line text-xl"></i>
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="bg-blue-600 text-white px-4 py-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-700 opacity-30">
                    <div className="absolute top-0 left-0 w-full h-full">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="opacity-20">
                            <path fill="#ffffff" fillOpacity="1" d="M0,160L48,165.3C96,171,192,181,288,197.3C384,213,480,235,576,234.7C672,235,768,213,864,197.3C960,181,1056,171,1152,170.7C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        </svg>
                    </div>
                </div>
                <div className="max-w-3xl mx-auto relative z-10">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">
                        Program Unggulan <span className="text-blue-200">Kost Al-Kahfi</span>
                    </h1>
                    <p className="text-blue-100 text-center mb-6">Mencetak generasi berilmu, berakhlak, dan bermanfaat</p>
                    
                    <div className="flex justify-center">
                        <div className="rounded-lg p-1 inline-flex gap-2">
                            <a href="/program/mahasantri" className="px-4 py-2 rounded-md text-sm font-medium transition-all bg-white text-blue-700 hover:bg-blue-100">
                            Mahasantri</a>
                            <a href="/program/biman" className="px-4 py-2 rounded-md text-sm font-medium transition-all text-white bg-white/10">
                            BIMAN</a>
                        </div>
                    </div>

                </div>
            </div>

            <main className="flex-1 pb-20">
                <div className="max-w-3xl mx-auto px-4 py-6">
                    {/* Program Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            <div id="mahasantri" className="bg-white rounded-2xl shadow-md overflow-hidden transform transition hover:shadow-lg">
                                <div className="h-40 bg-blue-600 relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center bg-blue-900/30">
                                        <img src="https://ponpes.alhasanah.sch.id/wp-content/uploads/2020/05/Pentingnya-Kajian-Walaupun-Minimal-Sekali-Sepekan.jpg" alt="Program Mahasantri" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h2 className="text-xl font-bold text-blue-900 mb-2 flex items-center">
                                        <i className="ri-user-3-line mr-2 text-blue-600"></i>
                                        Program Mahasantri
                                    </h2>
                                    <p className="text-gray-600 mb-4 text-sm">
                                        Program intensif fokus mendalami agama dengan kurikulum terstruktur, tahfidz Al-Qur'an, dan pembinaan langsung ustadz berpengalaman.
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">1 Tahun</span>
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">10 Peserta</span>
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Beasiswa</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-blue-600 font-semibold">Pendaftaran dibuka</span>
                                        <button 
                                            onClick={() => openRegisterModal('mahasantri')}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                                        >
                                            <i className="ri-user-add-line mr-1"></i>
                                            Daftar
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div id="biman" className="bg-white rounded-2xl shadow-md overflow-hidden transform transition hover:shadow-lg">
                                <div className="h-40 bg-blue-500 relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center bg-blue-800/30">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/70/Suasana_Kajian_Rutin_di_Masjid_Ubay_bin_Kaab_Jambi.jpg" alt="Program Mahasantri" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h2 className="text-xl font-bold text-blue-900 mb-2 flex items-center">
                                        <i className="ri-team-line mr-2 text-blue-600"></i>
                                        Program BIMAN
                                    </h2>
                                    <p className="text-gray-600 mb-4 text-sm">
                                        Program fleksibel untuk mahasiswa/pekerja dengan jadwal malam dan weekend, fokus pada pembinaan ruhiyah seimbang.
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">6 Bulan</span>
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">15 Peserta</span>
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Fleksibel</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-blue-600 font-semibold">Kuota tersisa: 8</span>
                                        <button 
                                            onClick={() => openRegisterModal('biman')}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                                        >
                                            <i className="ri-user-add-line mr-1"></i>
                                            Daftar
                                        </button>
                                    </div>
                                </div>
                            </div>
                    </div>

                    {/* Program Comparison */}
                    <section className="mb-8 overflow-hidden bg-white rounded-2xl shadow-sm">
                        <div className="bg-blue-600 px-4 py-3">
                            <h3 className="text-lg font-bold text-white flex items-center justify-center">
                                <i className="ri-table-2 mr-2"></i>
                                Perbandingan Program
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-blue-50">
                                        <th className="p-3 font-semibold text-blue-900 text-left border-b border-blue-100">Aspek</th>
                                        <th className="p-3 font-semibold text-blue-800 text-left border-b border-blue-100">Mahasantri</th>
                                        <th className="p-3 font-semibold text-blue-800 text-left border-b border-blue-100">BIMAN</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        ["Target Peserta", "Lulusan pesantren/mahasiswa agama", "Mahasiswa/pekerja umum"],
                                        ["Intensitas", "Full-time (setiap hari)", "Part-time (3x seminggu)"],
                                        ["Jadwal", "Pagi - Sore (08.00 - 16.00 WIB)", "Malam & Weekend"],
                                        ["Fokus Pembelajaran", "Tahfidz Quran & ilmu alat", "Tahsin & aplikasi Islam sehari-hari"],
                                        ["Kurikulum", "Tahfidz, Aqidah, Fiqih, B. Arab", "Tahsin, Tazkiyah, Sirah, Adab"],
                                        ["Biaya", "Subsidi penuh", "Terjangkau (cicilan)"],
                                        ["Output", "Da'i & Pengajar", "Muslim Profesional"]
                                    ].map(([aspect, mahasantri, biman], index) => (
                                        <tr key={index} className={`border-b border-blue-50 hover:bg-blue-50/50 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}`}>
                                            <td className="p-3 font-medium text-blue-900">{aspect}</td>
                                            <td className="p-3 text-gray-700">{mahasantri}</td>
                                            <td className="p-3 text-gray-700">{biman}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Testimonials */}
                    <section className="mb-8">
                        <h3 className="text-lg font-bold mb-4 text-blue-900 flex items-center">
                            <i className="ri-double-quotes-l mr-2 text-blue-600"></i>
                            Testimoni Alumni
                        </h3>
                        <div className="space-y-4">
                            {testimonials.map((testimonial) => (
                                <div key={testimonial.id} className="bg-white rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center mb-3">
                                        <img 
                                            src={testimonial.avatar} 
                                            alt={testimonial.name} 
                                            className="w-12 h-12 rounded-full mr-3 border-2 border-blue-200"
                                        />
                                        <div>
                                            <h4 className="font-semibold text-blue-900">{testimonial.name}</h4>
                                            <p className="text-sm text-gray-600">{testimonial.role}</p>
                                        </div>
                                        <div className="ml-auto">
                                            <div className="flex text-yellow-500">
                                                {[...Array(5)].map((_, i) => (
                                                    <i key={i} className={`ri-star-${i < testimonial.rating ? 'fill' : 'line'} text-sm`}></i>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className={`text-gray-700 text-sm ${!isTestimonialExpanded[testimonial.id] && 'line-clamp-3'}`}>
                                        {testimonial.text}
                                    </p>
                                    {testimonial.text.length > 150 && (
                                        <button 
                                            onClick={() => toggleTestimonial(testimonial.id)}
                                            className="text-blue-600 text-sm mt-1 hover:text-blue-800"
                                        >
                                            {isTestimonialExpanded[testimonial.id] ? 'Lihat lebih sedikit' : 'Lihat selengkapnya'}
                                        </button>
                                    )}
                                    {testimonial.photo && (
                                        <div className="mt-3">
                                            <img 
                                                src={testimonial.photo} 
                                                alt="Foto kegiatan" 
                                                className="w-full h-40 object-cover rounded-lg"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 flex justify-center">
                            <button className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors flex items-center">
                                <span>Lihat Semua Testimoni</span>
                                <i className="ri-arrow-right-line ml-1"></i>
                            </button>
                        </div>
                    </section>

                    {/* FAQ */}
                    <section className="mb-8 bg-white rounded-2xl p-5 shadow-sm">
                        <h3 className="text-lg font-bold mb-4 text-blue-900 flex items-center">
                            <i className="ri-question-answer-line mr-2 text-blue-600"></i>
                            Pertanyaan Umum
                        </h3>
                        <div className="space-y-3">
                            {faqs.map((faq, index) => (
                                <details key={index} className="group rounded-lg bg-blue-50 overflow-hidden">
                                    <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-blue-800 list-none">
                                        <span>{faq.question}</span>
                                        <i className="ri-arrow-down-s-line text-lg text-blue-600 transition-transform group-open:rotate-180"></i>
                                    </summary>
                                    <div className="bg-white p-4 text-sm text-gray-700 border-t border-blue-100">
                                        {faq.answer}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </section>

                    {/* Sponsors Section */}
                    <section className="bg-white rounded-2xl p-5 shadow-sm mb-8">
                        <h3 className="text-lg font-bold mb-4 text-center text-blue-900 flex items-center justify-center">
                            <i className="ri-hand-heart-line mr-2 text-blue-600"></i>
                            Didukung Oleh
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                            {sponsors.map((sponsor, index) => (
                                <div 
                                    key={index} 
                                    className="flex flex-col items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
                                        <i className={`${sponsor.logo} text-xl text-blue-600`}></i>
                                    </div>
                                    <span className="text-xs text-center font-medium text-blue-800">{sponsor.name}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="bg-blue-600 rounded-2xl p-6 text-center text-white shadow-md mb-0 relative overflow-hidden">
                        <div className="absolute inset-0 bg-blue-500 opacity-50">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 opacity-30">
                                <path fill="#ffffff" fillOpacity="1" d="M0,96L48,106.7C96,117,192,139,288,133.3C384,128,480,96,576,106.7C672,117,768,171,864,186.7C960,203,1056,181,1152,170.7C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                            </svg>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-3">Mulai Perjalanan Ilmu Anda Sekarang</h3>
                            <p className="text-blue-100 mb-5">Daftar dan bergabung dengan ribuan alumni yang telah merasakan manfaatnya</p>
                            <div className="flex justify-center space-x-3">
                                <button className="bg-white text-blue-700 px-5 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                                    Konsultasi Gratis
                                </button>
                                <button className="bg-blue-700 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors">
                                    Daftar Sekarang
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* Register Modal */}
            {showRegisterModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-5 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-blue-900">
                                Daftar Program {selectedProgram === 'mahasantri' ? 'Mahasantri' : 'BIMAN'}
                                </h3>
                                <button 
                                    onClick={() => setShowRegisterModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <i className="ri-close-line text-xl"></i>
                                </button>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="mb-6">
                                <p className="text-sm text-gray-600 mb-3">
                                    Silakan isi formulir pendaftaran di bawah ini untuk mendaftar program {selectedProgram === 'mahasantri' ? 'Mahasantri' : 'BIMAN'}.
                                </p>
                                <div className="bg-blue-50 rounded-lg p-3 flex items-start mb-4">
                                    <i className="ri-information-line text-blue-600 mt-1 mr-2"></i>
                                    <p className="text-xs text-blue-800">
                                        {selectedProgram === 'mahasantri' 
                                            ? 'Program Mahasantri berdurasi 1 tahun full-time. Pastikan Anda sudah siap sebelum mendaftar.'
                                            : 'Program BIMAN berlangsung selama 6 bulan dengan jadwal fleksibel malam dan weekend.'
                                        }
                                    </p>
                                </div>
                            </div>
                            
                            <form>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                        <input 
                                            type="text" 
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                            placeholder="Masukkan nama lengkap Anda"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input 
                                            type="email" 
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp</label>
                                        <input 
                                            type="tel" 
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                            placeholder="08xxxxxxxxxx"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Usia</label>
                                        <input 
                                            type="number" 
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                            placeholder="Usia Anda"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Pendidikan Terakhir</label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                            <option value="">Pilih Pendidikan</option>
                                            <option value="SMA/SMK">SMA/SMK/Sederajat</option>
                                            <option value="D3">D3</option>
                                            <option value="S1">S1</option>
                                            <option value="S2">S2</option>
                                            <option value="S3">S3</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Riwayat Pendidikan Agama</label>
                                        <textarea 
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24" 
                                            placeholder="Contoh: Pesantren, Madrasah, dll (jika ada)"
                                        ></textarea>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Jadwal</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {selectedProgram === 'mahasantri' ? (
                                                <>
                                                    <label className="flex items-center bg-white border border-gray-300 rounded-lg p-3 cursor-pointer hover:bg-blue-50">
                                                        <input type="radio" name="schedule" className="text-blue-600 mr-2" />
                                                        <span className="text-sm">Juli 2025</span>
                                                    </label>
                                                    <label className="flex items-center bg-white border border-gray-300 rounded-lg p-3 cursor-pointer hover:bg-blue-50">
                                                        <input type="radio" name="schedule" className="text-blue-600 mr-2" />
                                                        <span className="text-sm">Januari 2026</span>
                                                    </label>
                                                </>
                                            ) : (
                                                <>
                                                    <label className="flex items-center bg-white border border-gray-300 rounded-lg p-3 cursor-pointer hover:bg-blue-50">
                                                        <input type="radio" name="schedule" className="text-blue-600 mr-2" />
                                                        <span className="text-sm">Kelas Malam (19.30-21.00)</span>
                                                    </label>
                                                    <label className="flex items-center bg-white border border-gray-300 rounded-lg p-3 cursor-pointer hover:bg-blue-50">
                                                        <input type="radio" name="schedule" className="text-blue-600 mr-2" />
                                                        <span className="text-sm">Kelas Weekend (08.00-12.00)</span>
                                                    </label>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Motivasi Mengikuti Program</label>
                                        <textarea 
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24" 
                                            placeholder="Ceritakan motivasi Anda mengikuti program ini"
                                        ></textarea>
                                    </div>
                                    
                                    <div className="flex items-start">
                                        <input type="checkbox" className="text-blue-600 mt-1 mr-2" />
                                        <label className="text-xs text-gray-600">
                                            Saya menyetujui <span className="text-blue-600">syarat dan ketentuan</span> yang berlaku dan bersedia mengikuti seluruh rangkaian program
                                        </label>
                                    </div>
                                </div>
                                
                                <div className="mt-6">
                                    <button 
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
                                    >
                                        Kirim Pendaftaran
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Info Popup */}
            {/* <div className="fixed bottom-20 left-0 right-0 mx-3 bg-white rounded-lg shadow-lg border border-blue-100 p-3 flex items-center z-40">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <i className="ri-live-line text-blue-600 text-lg"></i>
                </div>
                <div className="flex-1">
                    <h4 className="text-sm font-medium text-blue-900">Live Session Tahsin Pemula</h4>
                    <p className="text-xs text-gray-600">Sedang berlangsung • 53 orang mengikuti</p>
                </div>
                <button className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full hover:bg-blue-700 transition-colors">
                    Gabung
                </button>
                <button className="ml-2 text-gray-400 hover:text-gray-600">
                    <i className="ri-close-line text-lg"></i>
                </button>
            </div> */}

            {/* Bottom Navbar */}
            <BottomNavbar />
        </div>
    );
}

export default Program;