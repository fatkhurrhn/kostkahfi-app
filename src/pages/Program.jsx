import BottomNavbar from '../components/BottomNavbar';
import { Link, useNavigate } from 'react-router-dom';

function Program() {
    const navigate = useNavigate();

    const sponsors = [
        { name: "Yayasan Al-Barakah", logo: "ri-community-line" },
        { name: "PT. Amanah Sejahtera", logo: "ri-building-4-line" },
        { name: "Baitul Maal Hidayatullah", logo: "ri-bank-line" },
        { name: "Koperasi Syariah Al-Ikhlas", logo: "ri-wallet-3-line" },
        { name: "Tokopedia Wakaf", logo: "ri-shopping-bag-line" },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white shadow-sm py-3 px-4">
                <div className="max-w-3xl mx-auto flex items-center">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-800"
                    >
                        <i className="ri-arrow-left-line text-xl mr-2"></i>
                        <span className="font-medium">Program</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 pb-20">
                <div className="max-w-3xl mx-auto px-4 py-6">
                    {/* Page Title */}
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
                        Program Unggulan <span className="text-emerald-600">Kost Al-Kahfi</span>
                    </h1>

                    {/* Program Navigation Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Link
                            to="/program/mahasantri"
                            className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium"
                        >
                            <i className="ri-user-3-line text-xl"></i>
                            <span>Mahasantri</span>
                        </Link>
                        <Link
                            to="/program/biman"
                            className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-sky-600 to-sky-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium"
                        >
                            <i className="ri-team-line text-xl"></i>
                            <span>BIMAN</span>
                        </Link>
                    </div>

                    {/* Mahasantri Program Section */}
                    <section className="mb-12 bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center mb-4">
                            <div className="w-2 h-8 bg-emerald-500 rounded-full mr-3"></div>
                            <h2 className="text-xl font-bold text-gray-800">Program Mahasantri</h2>
                        </div>
                        <p className="text-gray-600 mb-5 leading-relaxed">
                            Program khusus bagi santri yang ingin fokus mendalami agama dengan kurikulum terstruktur.
                            Peserta akan mengikuti program tahfidz Al-Qur'an, kajian kitab kuning, dan pembinaan intensif
                            dengan ustadz berpengalaman.
                        </p>
                        <div className="bg-emerald-50/80 p-5 rounded-xl border border-emerald-100">
                            <h4 className="font-semibold text-emerald-800 mb-3 flex items-center">
                                <i className="ri-lightbulb-flash-line mr-2 text-lg"></i>
                                Keunggulan Program
                            </h4>
                            <ul className="space-y-2">
                                <li className="flex items-start">
                                    <i className="ri-checkbox-circle-fill text-emerald-500 mt-1 mr-2"></i>
                                    <span className="text-gray-700">10 peserta per angkatan (pembinaan intensif)</span>
                                </li>
                                <li className="flex items-start">
                                    <i className="ri-checkbox-circle-fill text-emerald-500 mt-1 mr-2"></i>
                                    <span className="text-gray-700">Durasi program 1 tahun (full-time)</span>
                                </li>
                                <li className="flex items-start">
                                    <i className="ri-checkbox-circle-fill text-emerald-500 mt-1 mr-2"></i>
                                    <span className="text-gray-700">Beasiswa penuh untuk peserta berprestasi</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* BIMAN Program Section */}
                    <section className="mb-12 bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center mb-4">
                            <div className="w-2 h-8 bg-sky-500 rounded-full mr-3"></div>
                            <h2 className="text-xl font-bold text-gray-800">Program BIMAN</h2>
                        </div>
                        <p className="text-gray-600 mb-5 leading-relaxed">
                            BIMAN (Bina Iman) adalah program untuk mahasiswa/pekerja yang ingin mengimbangi kesibukan dunia
                            dengan pembinaan ruhiyah. Program ini fleksibel dengan jadwal malam hari dan weekend.
                        </p>
                        <div className="bg-sky-50/80 p-5 rounded-xl border border-sky-100">
                            <h4 className="font-semibold text-sky-800 mb-3 flex items-center">
                                <i className="ri-lightbulb-flash-line mr-2 text-lg"></i>
                                Keunggulan Program
                            </h4>
                            <ul className="space-y-2">
                                <li className="flex items-start">
                                    <i className="ri-checkbox-circle-fill text-sky-500 mt-1 mr-2"></i>
                                    <span className="text-gray-700">15 peserta per kelompok</span>
                                </li>
                                <li className="flex items-start">
                                    <i className="ri-checkbox-circle-fill text-sky-500 mt-1 mr-2"></i>
                                    <span className="text-gray-700">Durasi 6 bulan (part-time)</span>
                                </li>
                                <li className="flex items-start">
                                    <i className="ri-checkbox-circle-fill text-sky-500 mt-1 mr-2"></i>
                                    <span className="text-gray-700">Sistem pembelajaran modular fleksibel</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Comparison Table */}
                    <section className="mb-12 bg-white rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold mb-5 text-center text-gray-800 flex items-center justify-center">
                            <i className="ri-table-2 mr-2 text-emerald-600"></i>
                            Perbandingan Program
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-100 text-left">
                                        <th className="p-3 font-semibold text-gray-700 rounded-tl-lg">Aspek</th>
                                        <th className="p-3 font-semibold text-emerald-600">Mahasantri</th>
                                        <th className="p-3 font-semibold text-sky-600 rounded-tr-lg">BIMAN</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        ["Target Peserta", "Lulusan pesantren/mahasiswa agama", "Mahasiswa/pekerja umum"],
                                        ["Intensitas", "Full-time (setiap hari)", "Part-time (3x seminggu)"],
                                        ["Fokus Pembelajaran", "Tahfidz Quran & ilmu alat", "Tahsin & aplikasi Islam sehari-hari"],
                                        ["Biaya", "Subsidi penuh", "Terjangkau (cicilan)"]
                                    ].map(([aspect, mahasantri, biman], index) => (
                                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="p-3 font-medium text-gray-700">{aspect}</td>
                                            <td className="p-3 text-gray-600">{mahasantri}</td>
                                            <td className="p-3 text-gray-600">{biman}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Sponsors Section */}
                    <section className="bg-white rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold mb-6 text-center text-gray-800 flex items-center justify-center">
                            <i className="ri-hand-heart-line mr-2 text-emerald-600"></i>
                            Didukung Oleh
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {sponsors.map((sponsor, index) => (
                                <div 
                                    key={index} 
                                    className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
                                        <i className={`${sponsor.logo} text-2xl text-emerald-600`}></i>
                                    </div>
                                    <span className="text-sm text-center font-medium text-gray-700">{sponsor.name}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            {/* Bottom Navbar */}
            <BottomNavbar />
        </div>
    );
}

export default Program;