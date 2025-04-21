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
        <div className="h-screen flex flex-col bg-white">
            <div className="flex-1 overflow-y-auto">
                {/* Container with max-w-4xl for desktop */}
                <div className="container mx-auto px-4 pt-[70px] pb-20">
                    {/* back */}
                    <div className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-300 py-3">
                        <div className="max-w-[540px] w-full mx-auto px-6 flex justify-between items-center">
                            <h3 className="text-black flex items-center gap-2 cursor-pointer" onClick={() => navigate(-1)}>
                                <i className="ri-arrow-left-line text-lg"></i> Program
                            </h3>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Program Unggulan Kost Al-Kahfi</h1>

                    {/* Program Navigation Buttons */}
                    <div className="flex flex-row flex-wrap gap-4 justify-center mb-10">
                        <Link
                            to="/program/mahasantri"
                            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow flex items-center justify-center transition-colors font-medium"
                        >
                            <i className="ri-user-3-line mr-2 text-lg"></i>
                            Mahasantri
                        </Link>
                        <Link
                            to="/program/biman"
                            className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow flex items-center justify-center transition-colors font-medium"
                        >
                            <i className="ri-team-line mr-2 text-lg"></i>
                            BIMAN
                        </Link>
                    </div>


                    {/* Mahasantri Program Section */}
                    <section className="mb-12">
                        <div className="flex items-center mb-3">
                            <div className="w-1 h-8 bg-emerald-500 mr-3 rounded-full"></div>
                            <h2 className="text-xl font-bold text-gray-800">Program Mahasantri</h2>
                        </div>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            Program khusus bagi santri yang ingin fokus mendalami agama dengan kurikulum terstruktur.
                            Peserta akan mengikuti program tahfidz Al-Qur'an, kajian kitab kuning, dan pembinaan intensif
                            dengan ustadz berpengalaman.
                        </p>
                        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                            <h4 className="font-medium text-emerald-800 mb-2 flex items-center">
                                <i className="ri-information-line mr-2"></i>
                                Fakta Singkat:
                            </h4>
                            <ul className="text-sm text-gray-700 space-y-1">
                                <li className="flex items-center"><i className="ri-check-line text-emerald-500 mr-2"></i> 10 peserta per angkatan</li>
                                <li className="flex items-center"><i className="ri-check-line text-emerald-500 mr-2"></i> Waktu program: 1 tahun</li>
                                <li className="flex items-center"><i className="ri-check-line text-emerald-500 mr-2"></i> Beasiswa penuh tersedia</li>
                            </ul>
                        </div>
                    </section>

                    {/* BIMAN Program Section */}
                    <section className="mb-12">
                        <div className="flex items-center mb-3">
                            <div className="w-1 h-8 bg-sky-500 mr-3 rounded-full"></div>
                            <h2 className="text-xl font-bold text-gray-800">Program BIMAN</h2>
                        </div>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            BIMAN (Bina Iman) adalah program untuk mahasiswa/pekerja yang ingin mengimbangi kesibukan dunia
                            dengan pembinaan ruhiyah. Program ini fleksibel dengan jadwal malam hari dan weekend.
                        </p>
                        <div className="bg-sky-50 p-4 rounded-lg border border-sky-100">
                            <h4 className="font-medium text-sky-800 mb-2 flex items-center">
                                <i className="ri-information-line mr-2"></i>
                                Fakta Singkat:
                            </h4>
                            <ul className="text-sm text-gray-700 space-y-1">
                                <li className="flex items-center"><i className="ri-check-line text-sky-500 mr-2"></i> 15 peserta per angkatan</li>
                                <li className="flex items-center"><i className="ri-check-line text-sky-500 mr-2"></i> Waktu program: 6 bulan</li>
                                <li className="flex items-center"><i className="ri-check-line text-sky-500 mr-2"></i> Sistem pembinaan modular</li>
                            </ul>
                        </div>
                    </section>

                    {/* Comparison Table */}
                    <div className="mb-12">
                        <h3 className="text-lg font-bold mb-4 text-center text-gray-800">
                            <i className="ri-table-2 mr-2"></i>
                            Tabel Perbandingan Program
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-3 text-left text-gray-700 border-b font-semibold">Aspek</th>
                                        <th className="p-3 text-left text-emerald-700 border-b font-semibold">Mahasantri</th>
                                        <th className="p-3 text-left text-sky-700 border-b font-semibold">BIMAN</th>
                                    </tr>
                                </thead>
                                <tbody className='text-gray-700'>
                                    <tr className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-medium">Target Peserta</td>
                                        <td className="p-3">Lulusan pesantren/mahasiswa agama</td>
                                        <td className="p-3">Mahasiswa/pekerja umum</td>
                                    </tr>
                                    <tr className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-medium">Intensitas</td>
                                        <td className="p-3">Full-time (setiap hari)</td>
                                        <td className="p-3">Part-time (3x seminggu)</td>
                                    </tr>
                                    <tr className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-medium">Fokus Pembelajaran</td>
                                        <td className="p-3">Tahfidz Quran & ilmu alat</td>
                                        <td className="p-3">Tahsin & aplikasi Islam sehari-hari</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Sponsors Section */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-center text-gray-800">
                            <i className="ri-hand-coin-line mr-2"></i>
                            Sponsor & Donatur
                        </h3>
                        <div className="flex flex-wrap justify-center gap-6 items-center">
                            {sponsors.map((sponsor, index) => (
                                <div key={index} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors min-w-[120px]">
                                    <i className={`${sponsor.logo} text-3xl text-gray-700 mb-2`}></i>
                                    <span className="text-sm text-center text-gray-600 font-medium">{sponsor.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Navbar */}
            <BottomNavbar />
        </div>
    );
}

export default Program;