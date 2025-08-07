import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatBot from '../components/chatbot/ChatBot';
import { Link } from 'react-router-dom';

export default function AboutUs() {
    return (
        <div className="bg-gray-50 min-h-screen text-gray-800">
            <Navbar />
            <ChatBot />

            {/* Hero Section (unchanged as requested) */}
            <section className="max-w-7xl mx-auto px-4 pt-[110px]">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold mb-3 text-gray-800">
                        <span className="text-[#eb6807]">Tentang</span> Kami
                    </h1>
                    <div className="w-20 h-1 bg-[#eb6807] mx-auto mb-4"></div>
                    <p className="text-gray-600 max-w-lg mx-auto">
                        Kost Al Kahfi - Rumah nyaman bagi mahasiswa dan profesional muda di Depok dengan konsep modern dan fasilitas lengkap.
                    </p>
                </div>
            </section>

            {/* Unique Content Structure */}
            <div className="max-w-7xl mx-auto px-4 pb-16">
                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div>
                        <h2 className="text-3xl font-bold mb-6 text-gray-800">
                            Cerita Kami
                        </h2>
                        <div className="space-y-4 text-gray-600">
                            <p>
                                Berdiri sejak 2015, Kost Al Kahfi hadir untuk memenuhi kebutuhan akomodasi nyaman dengan harga terjangkau bagi mahasiswa dan pekerja di sekitar Depok.
                            </p>
                            <p>
                                Kami percaya tempat tinggal yang nyaman akan mendukung produktivitas dan kebahagiaan penghuninya. Itulah mengapa kami terus berinovasi dalam layanan dan fasilitas.
                            </p>
                        </div>
                    </div>
                    <div className="bg-gray-200 rounded-xl h-80 w-full overflow-hidden">
                        {/* Placeholder for image */}
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-500">Foto Bangunan Kost</span>
                        </div>
                    </div>
                </div>

                {/* Unique Value Proposition */}
                <div className="mb-24 bg-gray-100 p-12 rounded-3xl">
                    <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
                        <span className="text-[#eb6807]">Keunikan</span> Al Kahfi
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: "ri-community-line",
                                title: "Ekosistem Komunitas",
                                description: "Program mingguan untuk networking dan pengembangan diri"
                            },
                            {
                                icon: "ri-leaf-line",
                                title: "Konsep Green Living",
                                description: "Lingkungan hijau dengan sistem pengelolaan sampah terpadu"
                            },
                            {
                                icon: "ri-smartphone-line",
                                title: "Digital Experience",
                                description: "Aplikasi mobile untuk manajemen pembayaran dan permintaan layanan"
                            }
                        ].map((item, index) => (
                            <div key={index} className="bg-white p-8 rounded-xl shadow-sm text-center hover:shadow-md transition-all">
                                <div className="bg-[#eb6807]/10 text-[#eb6807] p-4 rounded-full inline-block mb-4">
                                    <i className={`${item.icon} text-3xl`}></i>
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-gray-600">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Enhanced Team Section */}
                <div className="mb-20">
                    <div className="text-center mb-12 px-4">
                        <h2 className="text-4xl font-bold mb-4 text-gray-800">
                            <span className="text-[#eb6807]">Tim</span> Pengelola
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            Tim profesional yang berdedikasi untuk memberikan pengalaman terbaik bagi penghuni Kost Al Kahfi
                        </p>
                    </div>

                    {/* Horizontal scroll container for mobile */}
                    <div className="lg:hidden px-4">
                        <div className="pb-6 overflow-x-auto">
                            <div className="flex space-x-4 w-max">
                                {[
                                    {
                                        name: "Ahmad Fatkhurrohman",
                                        role: "Founder & CEO",
                                        specialty: "Manajemen Properti",
                                        social: {
                                            instagram: "@afatkhur",
                                            linkedin: "/in/afatkhur",
                                            email: "afatkhur@kostalkahfi.com"
                                        },
                                        photo: "bg-[url('https://i.pinimg.com/736x/f6/05/92/f60592ce2784e044f8e3387f025222e7.jpg')]"
                                    },
                                    {
                                        name: "Siti Aminah",
                                        role: "Manajer Operasional",
                                        specialty: "Hubungan Penghuni",
                                        social: {
                                            instagram: "@sitiaminah",
                                            linkedin: "/in/sitiaminah",
                                            email: "sitiaminah@kostalkahfi.com"
                                        },
                                        photo: "bg-[url('https://i.pinimg.com/736x/e1/f3/e9/e1f3e9f687aff238f6624e6b7930ec5a.jpg')]"
                                    },
                                    {
                                        name: "Budi Santoso",
                                        role: "Manajer Fasilitas",
                                        specialty: "Perawatan Gedung",
                                        social: {
                                            instagram: "@budisant",
                                            linkedin: "/in/budisant",
                                            email: "budisant@kostalkahfi.com"
                                        },
                                        photo: "bg-[url('https://i.pinimg.com/1200x/87/fa/ec/87faec9b22495d9ee1544af6c760c1c6.jpg')]"
                                    },
                                    {
                                        name: "Dewi Anggraeni",
                                        role: "Manajer Cavelatte",
                                        specialty: "Event & Komunitas",
                                        social: {
                                            instagram: "@dewanggra",
                                            linkedin: "/in/dewanggra",
                                            email: "dewanggra@kostalkahfi.com"
                                        },
                                        photo: "bg-[url('https://i.pinimg.com/736x/45/c3/a6/45c3a651fc02cb82a76418324375fa28.jpg')]"
                                    }
                                ].map((member, index) => (
                                    <div key={index} className="w-72 flex-shrink-0 bg-white rounded-xl shadow-md overflow-hidden">
                                        {/* Team Photo */}
                                        <div className={`h-48 ${member.photo} bg-cover bg-center`}></div>

                                        {/* Team Info - Always Visible */}
                                        <div className="p-5">
                                            <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                                            <p className="text-[#eb6807] font-medium mb-3">{member.role}</p>

                                            {/* Social Links */}
                                            <div className="flex space-x-3">
                                                <a
                                                    href={`https://instagram.com/${member.social.instagram}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-500 hover:text-[#eb6807] transition-colors"
                                                    aria-label={`Instagram ${member.name}`}
                                                >
                                                    <i className="ri-instagram-fill text-xl"></i>
                                                </a>
                                                <a
                                                    href={`https://linkedin.com${member.social.linkedin}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-500 hover:text-[#eb6807] transition-colors"
                                                    aria-label={`LinkedIn ${member.name}`}
                                                >
                                                    <i className="ri-linkedin-box-fill text-xl"></i>
                                                </a>
                                                <a
                                                    href={`mailto:${member.social.email}`}
                                                    className="text-gray-500 hover:text-[#eb6807] transition-colors"
                                                    aria-label={`Email ${member.name}`}
                                                >
                                                    <i className="ri-mail-fill text-xl"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Grid layout for desktop */}
                    <div className="hidden lg:grid grid-cols-4 gap-5 px-4">
                        {[
                            {
                                name: "Ahmad Fatkhurrohman",
                                role: "Founder & CEO",
                                specialty: "Manajemen Properti",
                                social: {
                                    instagram: "@afatkhur",
                                    linkedin: "/in/afatkhur",
                                    email: "afatkhur@kostalkahfi.com"
                                },
                                photo: "bg-[url('https://i.pinimg.com/736x/f6/05/92/f60592ce2784e044f8e3387f025222e7.jpg')]"
                            },
                            {
                                name: "Siti Aminah",
                                role: "Manajer Operasional",
                                specialty: "Hubungan Penghuni",
                                social: {
                                    instagram: "@sitiaminah",
                                    linkedin: "/in/sitiaminah",
                                    email: "sitiaminah@kostalkahfi.com"
                                },
                                photo: "bg-[url('https://i.pinimg.com/736x/e1/f3/e9/e1f3e9f687aff238f6624e6b7930ec5a.jpg')]"
                            },
                            {
                                name: "Budi Santoso",
                                role: "Manajer Fasilitas",
                                specialty: "Perawatan Gedung",
                                social: {
                                    instagram: "@budisant",
                                    linkedin: "/in/budisant",
                                    email: "budisant@kostalkahfi.com"
                                },
                                photo: "bg-[url('https://i.pinimg.com/1200x/87/fa/ec/87faec9b22495d9ee1544af6c760c1c6.jpg')]"
                            },
                            {
                                name: "Dewi Anggraeni",
                                role: "Manajer Cavelatte",
                                specialty: "Event & Komunitas",
                                social: {
                                    instagram: "@dewanggra",
                                    linkedin: "/in/dewanggra",
                                    email: "dewanggra@kostalkahfi.com"
                                },
                                photo: "bg-[url('https://i.pinimg.com/736x/45/c3/a6/45c3a651fc02cb82a76418324375fa28.jpg')]"
                            }
                        ].map((member, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                                {/* Team Photo */}
                                <div className={`h-60 ${member.photo} bg-cover bg-center`}></div>

                                {/* Team Info - Always Visible */}
                                <div className="p-5">
                                    <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                                    <p className="text-[#eb6807] font-medium mb-2">{member.role}</p>

                                    {/* Social Links */}
                                    <div className="flex space-x-3">
                                        <a
                                            href={`https://instagram.com/${member.social.instagram}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-500 hover:text-[#eb6807] transition-colors"
                                            aria-label={`Instagram ${member.name}`}
                                        >
                                            <i className="ri-instagram-fill text-xl"></i>
                                        </a>
                                        <a
                                            href={`https://linkedin.com${member.social.linkedin}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-500 hover:text-[#eb6807] transition-colors"
                                            aria-label={`LinkedIn ${member.name}`}
                                        >
                                            <i className="ri-linkedin-box-fill text-xl"></i>
                                        </a>
                                        <a
                                            href={`mailto:${member.social.email}`}
                                            className="text-gray-500 hover:text-[#eb6807] transition-colors"
                                            aria-label={`Email ${member.name}`}
                                        >
                                            <i className="ri-mail-fill text-xl"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Achievement Banner */}
                <div className="mb-24 bg-gray-800 rounded-2xl overflow-hidden">
                    <div className="grid md:grid-cols-3 ">
                        {[
                            {
                                number: "70+",
                                title: "Kamar Tersedia",
                                icon: "ri-home-3-line"
                            },
                            {
                                number: "11",
                                title: "Fasilitas Unggulan",
                                icon: "ri-star-smile-line"
                            },
                            {
                                number: "24/7",
                                title: "Layanan Pelanggan",
                                icon: "ri-customer-service-2-line"
                            }
                        ].map((item, index) => (
                            <div key={index} className="p-8 text-center text-white">
                                <i className={`${item.icon} text-4xl mb-4`}></i>
                                <p className="text-4xl font-bold mb-2">{item.number}</p>
                                <p className="text-lg">{item.title}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Gallery Preview */}
                <div className="mb-16">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-900">
                            <span className="block sm:hidden">Galeri</span>
                            <span className="hidden sm:block">
                                Galeri <span className="text-[#eb6807]">Kost Alkahfi</span>
                            </span>
                        </h2>
                        <Link
                            to="/gallery"
                            className="inline-flex items-center text-[#eb6807] hover:text-[#d45e06] font-medium transition-colors"
                        >
                            Lihat Semua <i className="ri-arrow-right-line ml-2"></i>
                        </Link>
                    </div>

                    {/* Gallery Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            "https://i.pinimg.com/1200x/95/55/c6/9555c67c29362dc7951a426337a8e773.jpg",
                            "https://i.pinimg.com/736x/68/25/0e/68250e5a011744a8dc97dcd541e84020.jpg",
                            "https://i.pinimg.com/736x/68/25/0e/68250e5a011744a8dc97dcd541e84020.jpg",
                            "https://i.pinimg.com/736x/68/25/0e/68250e5a011744a8dc97dcd541e84020.jpg",
                        ].map((src, index) => (
                            <div
                                key={index}
                                className="aspect-square rounded-xl overflow-hidden transform transition-transform duration-300 hover:scale-[1.03] shadow-sm"
                            >
                                <img
                                    src={src}
                                    alt={`Galeri ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>


                {/* CTA Section */}
                <div className="bg-gradient-to-r from-[#1F2937] to-[#1F2937] text-white rounded-2xl p-12 text-center overflow-hidden relative">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full"></div>
                    <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full"></div>
                    <div className="relative">
                        <h2 className="text-3xl font-bold mb-4">Bergabunglah dengan Komunitas Kami</h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            Temukan pengalaman tinggal terbaik di jantung Depok
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a
                                href="/kamar"
                                className="bg-white text-[#eb6807] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                            >
                                Lihat Kamar Tersedia
                            </a>
                            <a
                                href="/contact"
                                className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors"
                            >
                                Hubungi Kami
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}