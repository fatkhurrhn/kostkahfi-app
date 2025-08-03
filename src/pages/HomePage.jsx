import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function HomePage() {
    const [roomStats, setRoomStats] = useState({ total: 30, occupied: 18, available: 12 });
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const testimonials = [
        {
            name: 'Rina Susanti',
            role: 'Mahasiswa UI',
            quote: 'Lokasi strategis dekat kampus, fasilitas lengkap, dan pengelola sangat responsif.',
            image: 'https://randomuser.me/api/portraits/women/65.jpg'
        },
        {
            name: 'Budi Santoso',
            role: 'Karyawan Startup',
            quote: 'Suasana nyaman dan tenang, cocok untuk bekerja remote. Internetnya juga cepat.',
            image: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        {
            name: 'Dewi Anggraeni',
            role: 'Mahasiswa Kedokteran',
            quote: 'Kamar bersih dan rapi, area kost hijau membuat udara segar.',
            image: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        {
            name: 'Fajar Setiawan',
            role: 'Freelancer',
            quote: 'Cavelatte jadi tempat favorit buat meeting klien. Konsepnya unik dan nyaman!',
            image: 'https://randomuser.me/api/portraits/men/76.jpg'
        },
        {
            name: 'Sarah Wijaya',
            role: 'Mahasiswa Arsitektur',
            quote: 'Desain interior kamar aesthetic banget, bikin betah belajar berjam-jam.',
            image: 'https://randomuser.me/api/portraits/women/68.jpg'
        }
    ];

    const blogPosts = [
        {
            title: 'Tips Memilih Kost untuk Mahasiswa Baru',
            excerpt: 'Panduan lengkap memilih kost yang nyaman dan sesuai budget untuk mahasiswa baru...',
            date: '15 Juni 2024',
            image: 'https://images.unsplash.com/photo-1529408686214-b48b8532f72c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
        },
        {
            title: 'Fasilitas Unggulan Kost Alkahfi',
            excerpt: 'Temukan berbagai fasilitas premium yang hanya ada di Kost Alkahfi...',
            date: '5 Mei 2024',
            image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
        },
        {
            title: 'Event Bulanan di Cavelatte',
            excerpt: 'Jadwal event-event seru di Cavelatte bulan ini. Free untuk penghuni kost!',
            date: '22 April 2024',
            image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80'
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen text-gray-800 transition-colors duration-300">
            <Navbar />

            {/* Hero Section - Enhanced */}
            <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                        alt="Kost Alkahfi"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
                                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                                <span>Buka Pendaftaran Penghuni Baru</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-100">Kost Alkahfi</span> -
                                Rumah Kedua yang Nyaman
                            </h1>
                            <p className="text-lg text-gray-300 mb-8 max-w-lg">
                                Kost eksklusif dengan fasilitas lengkap dan lingkungan yang mendukung untuk produktivitas mahasiswa dan profesional.
                                Dilengkapi dengan Cavelatte - coworking space eksklusif untuk penghuni.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a
                                    href="#kamar"
                                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center group"
                                >
                                    <i className="ri-home-4-line mr-2"></i> Lihat Kamar Tersedia
                                    <i className="ri-arrow-right-line ml-2 group-hover:translate-x-1 transition-transform"></i>
                                </a>
                                <a
                                    href="/cavelatte"
                                    className="border border-white/30 hover:bg-white/10 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
                                >
                                    <i className="ri-cup-line mr-2"></i> Explore Cavelatte
                                </a>
                            </div>

                            <div className="mt-12 flex flex-wrap gap-6">
                                <div className="flex items-center">
                                    <div className="bg-white/10 p-3 rounded-full mr-4">
                                        <i className="ri-wifi-line text-xl"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-300">Internet</p>
                                        <p className="font-bold">High Speed</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="bg-white/10 p-3 rounded-full mr-4">
                                        <i className="ri-shield-check-line text-xl"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-300">Keamanan</p>
                                        <p className="font-bold">24 Jam</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="bg-white/10 p-3 rounded-full mr-4">
                                        <i className="ri-map-pin-line text-xl"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-300">Lokasi</p>
                                        <p className="font-bold">Strategis</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative hidden md:block">
                            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] w-full h-full shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80"
                                    alt="Kamar Kost"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-6 text-white">
                                    <h3 className="text-xl font-bold">Mulai dari</h3>
                                    <p className="text-3xl font-bold text-green-300">Rp 750rb<span className="text-base text-gray-300">/bulan</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Keunggulan - Enhanced */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Kenapa Kost Alkahfi?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Kami memberikan pengalaman tinggal terbaik dengan berbagai keunggulan eksklusif.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {[
                            { icon: 'ri-shield-check-line', title: 'Keamanan', desc: '24 Jam', color: 'bg-blue-100 text-blue-600' },
                            { icon: 'ri-wifi-line', title: 'Internet', desc: 'High Speed', color: 'bg-purple-100 text-purple-600' },
                            { icon: 'ri-plant-line', title: 'Lingkungan', desc: 'Hijau & Asri', color: 'bg-green-100 text-green-600' },
                            { icon: 'ri-restaurant-line', title: 'Dapur', desc: 'Bersama', color: 'bg-yellow-100 text-yellow-600' },
                            { icon: 'ri-community-line', title: 'Komunitas', desc: 'Aktif', color: 'bg-red-100 text-red-600' },
                            { icon: 'ri-cup-line', title: 'Cavelatte', desc: 'Coworking Space', color: 'bg-indigo-100 text-indigo-600' },
                            { icon: 'ri-washing-machine-line', title: 'Laundry', desc: 'Service', color: 'bg-pink-100 text-pink-600' },
                            { icon: 'ri-map-pin-line', title: 'Lokasi', desc: 'Strategis', color: 'bg-cyan-100 text-cyan-600' },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-white p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-center group"
                            >
                                <div className={`${item.color} w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl md:text-3xl group-hover:scale-110 transition-transform`}>
                                    <i className={item.icon}></i>
                                </div>
                                <h3 className="text-sm md:text-base font-semibold mb-1">{item.title}</h3>
                                <p className="text-xs md:text-sm text-gray-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Status Kamar */}
            <section id="kamar" className="py-16 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Ketersediaan Kamar</h2>
                            <p className="text-gray-600 mb-8">
                                Cek ketersediaan kamar kost kami. Update real-time setiap ada perubahan.
                            </p>

                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                                    <div className="text-3xl font-bold text-gray-800">{roomStats.total}</div>
                                    <div className="text-sm text-gray-500">Total Kamar</div>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                                    <div className="text-3xl font-bold text-green-600">{roomStats.available}</div>
                                    <div className="text-sm text-gray-500">Tersedia</div>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                                    <div className="text-3xl font-bold text-gray-600">{roomStats.occupied}</div>
                                    <div className="text-sm text-gray-500">Terisi</div>
                                </div>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                                <div
                                    className="bg-green-500 h-3 rounded-full"
                                    style={{ width: `${(roomStats.available / roomStats.total) * 100}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-gray-500 text-right">
                                {Math.round((roomStats.available / roomStats.total) * 100)}% kamar tersedia
                            </p>

                            <a
                                href="/kamar"
                                className="inline-flex items-center mt-6 text-green-600 hover:text-green-700 font-medium"
                            >
                                Lihat detail kamar <i className="ri-arrow-right-line ml-2"></i>
                            </a>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-xl font-semibold mb-4">Tipe Kamar</h3>
                            <div className="space-y-4">
                                {[
                                    { type: 'Reguler', price: 'Rp 750.000', available: 5, total: 15 },
                                    { type: 'Mahasantri', price: 'Rp 350.000', available: 4, total: 10 },
                                    { type: 'Premium', price: 'Rp 1.200.000', available: 3, total: 5 },
                                ].map((item, index) => (
                                    <div key={index} className="border-b border-gray-100 pb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-medium">{item.type}</h4>
                                            <span className="text-gray-600">{item.price}/bulan</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span>{item.available} dari {item.total} kamar tersedia</span>
                                            <span className="text-green-600">
                                                {Math.round((item.available / item.total) * 100)}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cavelatte Section */}
            <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <h2 className="text-3xl font-bold mb-6">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-100">Cavelatte</span> -
                                Coworking Space Eksklusif
                            </h2>
                            <p className="text-gray-300 mb-6">
                                Nikmati coworking space eksklusif hanya untuk penghuni Kost Alkahfi. Tempat nyaman untuk bekerja, belajar, atau sekadar nongkrong sambil menikmati kopi berkualitas.
                            </p>
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center">
                                    <i className="ri-checkbox-circle-fill text-green-400 mr-3 text-xl"></i>
                                    <span>Free akses untuk penghuni</span>
                                </div>
                                <div className="flex items-center">
                                    <i className="ri-checkbox-circle-fill text-green-400 mr-3 text-xl"></i>
                                    <span>High speed internet</span>
                                </div>
                                <div className="flex items-center">
                                    <i className="ri-checkbox-circle-fill text-green-400 mr-3 text-xl"></i>
                                    <span>Kopi dan snack premium</span>
                                </div>
                                <div className="flex items-center">
                                    <i className="ri-checkbox-circle-fill text-green-400 mr-3 text-xl"></i>
                                    <span>Event mingguan</span>
                                </div>
                            </div>
                            <a
                                href="/cavelatte"
                                className="inline-flex items-center bg-white hover:bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                <i className="ri-cup-line mr-2"></i> Jelajahi Cavelatte
                            </a>
                        </div>
                        <div className="order-1 md:order-2">
                            <div className="relative rounded-2xl overflow-hidden aspect-video shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80"
                                    alt="Cavelatte"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/30 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-6">
                                    <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                                        <i className="ri-time-line mr-2"></i> Buka setiap hari 08:00 - 22:00
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Blog Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold">Artikel Terbaru</h2>
                        <a
                            href="/blog"
                            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                        >
                            Lihat Semua <i className="ri-arrow-right-line ml-2"></i>
                        </a>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {blogPosts.map((post, index) => (
                            <div key={index} className="group">
                                <div className="relative rounded-xl overflow-hidden aspect-video mb-4">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-4">
                                        <span className="bg-white text-gray-800 text-xs px-2 py-1 rounded">{post.date}</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-green-600 transition-colors">{post.title}</h3>
                                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                                <a
                                    href="#"
                                    className="inline-flex items-center text-sm text-green-600 hover:text-green-700 font-medium"
                                >
                                    Baca Selengkapnya <i className="ri-arrow-right-line ml-2"></i>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonial - Enhanced */}
            <section className="py-16 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Apa Kata Penghuni?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Testimoni jujur dari penghuni Kost Alkahfi.
                        </p>
                    </div>

                    <div className="relative">
                        <div className="overflow-x-auto pb-6 scrollbar-hide">
                            <div className="flex space-x-6 w-max">
                                {testimonials.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`w-80 flex-shrink-0 bg-white p-6 rounded-xl shadow-sm transition-all duration-300 ${activeTestimonial === index ? 'ring-2 ring-green-500' : ''}`}
                                    >
                                        <div className="flex items-center mb-4">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-12 h-12 rounded-full object-cover mr-4"
                                            />
                                            <div>
                                                <h3 className="font-semibold">{item.name}</h3>
                                                <p className="text-sm text-gray-500">{item.role}</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 mb-4">"{item.quote}"</p>
                                        <div className="flex text-yellow-400">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <i key={star} className="ri-star-fill"></i>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-center mt-8 space-x-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveTestimonial(index)}
                                    className={`w-3 h-3 rounded-full ${activeTestimonial === index ? 'bg-green-500' : 'bg-gray-300'}`}
                                ></button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Maps Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Lokasi Kost</h2>
                            <p className="text-gray-600 mb-6">
                                Kost Alkahfi berlokasi strategis di dekat kampus UI, Depok. Akses mudah ke berbagai fasilitas umum.
                            </p>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-start">
                                    <div className="bg-gray-100 p-3 rounded-full mr-4">
                                        <i className="ri-map-pin-2-line text-xl text-gray-800"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Alamat</h3>
                                        <p className="text-gray-600">Jl. Kukusan Raya No. 123, Beji, Depok, Jawa Barat</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-gray-100 p-3 rounded-full mr-4">
                                        <i className="ri-compass-3-line text-xl text-gray-800"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Akses Terdekat</h3>
                                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                                            <li>Kampus UI: 5 menit jalan kaki</li>
                                            <li>Stasiun Depok: 10 menit</li>
                                            <li>Margocity Mall: 15 menit</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <a
                                href="#"
                                className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                <i className="ri-navigation-line mr-2"></i> Dapatkan Petunjuk Arah
                            </a>
                        </div>

                        <div className="rounded-xl overflow-hidden shadow-xl border border-gray-200">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3831.042081585881!2d106.81678007483026!3d-6.3573448936326304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ec2092accabd%3A0xd021b67b8e9d13a5!2sKost%20UI%20Pondok%20Al-Kahfi%2C%20Kukusan%2C%20Depok!5e1!3m2!1sid!2sid!4v1754234417847!5m2!1sid!2sid"
                                width="100%"
                                height="400"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="rounded-xl"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-gradient-to-r from-green-600 to-green-500 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-6">Tertarik Menjadi Penghuni?</h2>
                    <p className="text-green-100 max-w-2xl mx-auto mb-8">
                        Segera hubungi kami untuk informasi lebih lanjut atau kunjungi langsung lokasi kost kami.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="#kontak"
                            className="bg-white hover:bg-gray-100 text-green-600 px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
                        >
                            <i className="ri-phone-line mr-2"></i> Hubungi Kami
                        </a>
                        <a
                            href="/kamar"
                            className="border border-white/50 hover:bg-white/10 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
                        >
                            <i className="ri-home-4-line mr-2"></i> Lihat Kamar
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}