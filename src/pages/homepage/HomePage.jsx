import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function HomePage() {
    return (
        <div className="bg-gray-50 min-h-screen text-gray-800 transition-colors duration-300">
            <Navbar />
            
            {/* Hero Section */}
            <section className="relative bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                                Tempat Tinggal Nyaman <span className="text-gray-600">Untuk Masa Depan Cerah</span>
                            </h1>
                            <p className="text-lg text-gray-600 mb-8">
                                Kost eksklusif dengan fasilitas lengkap dan lingkungan yang mendukung untuk produktivitas mahasiswa dan profesional.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a href="#fasilitas" className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                                    <i className="ri-eye-line mr-2"></i> Lihat Fasilitas
                                </a>
                                <a href="#kontak" className="border border-gray-300 hover:bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors">
                                    <i className="ri-phone-line mr-2"></i> Hubungi Kami
                                </a>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-gray-200 rounded-xl overflow-hidden aspect-video">
                                <img 
                                    src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                                    alt="Kost Modern" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg hidden md:block">
                                <div className="flex items-center">
                                    <div className="bg-gray-100 p-3 rounded-full mr-3">
                                        <i className="ri-home-4-line text-2xl text-gray-800"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Tersedia</p>
                                        <p className="font-bold">25+ Kamar</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Keunggulan */}
            <section className="bg-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Mengapa Memilih Kami?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Kami memberikan pengalaman tinggal terbaik dengan berbagai keunggulan yang tidak akan Anda temukan di tempat lain.</p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {icon: 'ri-shield-check-line', title: 'Keamanan 24 Jam', desc: 'Dilengkapi CCTV dan security untuk kenyamanan Anda'},
                            {icon: 'ri-wifi-line', title: 'Internet Cepat', desc: 'WiFi high speed tanpa batas untuk kebutuhan belajar dan bekerja'},
                            {icon: 'ri-plant-line', title: 'Lingkungan Asri', desc: 'Area hijau yang sejuk dan nyaman untuk relaksasi'},
                            {icon: 'ri-restaurant-line', title: 'Dapur Bersama', desc: 'Fasilitas memasak lengkap untuk kebutuhan harian'},
                            {icon: 'ri-washing-machine-line', title: 'Laundry', desc: 'Layanan laundry tersedia dengan harga terjangkau'},
                            {icon: 'ri-map-pin-line', title: 'Lokasi Strategis', desc: 'Akses mudah ke kampus dan pusat kota'},
                        ].map((item, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                    <i className={`${item.icon} text-2xl text-gray-800`}></i>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                <p className="text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Fasilitas */}
            <section id="fasilitas" className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Fasilitas Unggulan</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Nikmati berbagai fasilitas premium yang kami sediakan untuk kenyamanan Anda.</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-gray-50 rounded-xl overflow-hidden">
                            <img 
                                src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                                alt="Kamar Kost" 
                                className="w-full h-64 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">Kamar Tidur</h3>
                                <p className="text-gray-600 mb-4">Kamar nyaman dengan kasur premium, lemari pakaian, dan meja belajar.</p>
                                <ul className="space-y-2">
                                    {['Kasur springbed', 'AC', 'Lemari besar', 'Meja belajar', 'Lampu baca'].map((item, i) => (
                                        <li key={i} className="flex items-center">
                                            <i className="ri-checkbox-circle-fill text-green-500 mr-2"></i>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                {img: 'https://images.unsplash.com/photo-1600566752227-8f2324f4f6c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80', title: 'Kamar Mandi'},
                                {img: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1468&q=80', title: 'Dapur Bersama'},
                                {img: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80', title: 'Ruang Tamu'},
                                {img: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80', title: 'Area Parkir'},
                            ].map((item, index) => (
                                <div key={index} className="bg-gray-50 rounded-xl overflow-hidden group">
                                    <div className="aspect-square overflow-hidden">
                                        <img 
                                            src={item.img} 
                                            alt={item.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium">{item.title}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimoni */}
            <section className="py-16 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Apa Kata Penghuni?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Testimoni dari penghuni yang sudah merasakan kenyamanan tinggal di kost kami.</p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {name: 'Rina Susanti', role: 'Mahasiswa', quote: 'Lokasi strategis dekat kampus, fasilitas lengkap, dan pengelola sangat responsif.'},
                            {name: 'Budi Santoso', role: 'Karyawan', quote: 'Suasana nyaman dan tenang, cocok untuk bekerja remote. Internetnya juga cepat.'},
                            {name: 'Dewi Anggraeni', role: 'Mahasiswa', quote: 'Kamar bersih dan rapi, area kost hijau membuat udara segar.'},
                        ].map((item, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                                <div className="flex items-center mb-4">
                                    <div className="bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                                        <i className="ri-user-3-line text-xl text-gray-600"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{item.name}</h3>
                                        <p className="text-sm text-gray-500">{item.role}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600">"{item.quote}"</p>
                                <div className="mt-4 flex text-yellow-400">
                                    {[1,2,3,4,5].map((star) => (
                                        <i key={star} className="ri-star-fill"></i>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-gray-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-6">Tertarik Untuk Menjadi Penghuni?</h2>
                    <p className="text-gray-300 max-w-2xl mx-auto mb-8">Segera hubungi kami untuk informasi lebih lanjut atau kunjungi langsung lokasi kost kami.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a href="#kontak" className="bg-white hover:bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors">
                            <i className="ri-phone-line mr-2"></i> Hubungi Kami
                        </a>
                        <a href="#" className="border border-white hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                            <i className="ri-map-pin-line mr-2"></i> Lihat Lokasi
                        </a>
                    </div>
                </div>
            </section>

            {/* Kontak */}
            <section id="kontak" className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Hubungi Kami</h2>
                            <p className="text-gray-600 mb-8">Silakan isi form berikut atau hubungi langsung melalui kontak yang tersedia.</p>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex items-start">
                                    <div className="bg-gray-100 p-3 rounded-full mr-4">
                                        <i className="ri-map-pin-2-line text-xl text-gray-800"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Alamat</h3>
                                        <p className="text-gray-600">Jl. Contoh No. 123, Kota Bandung, Jawa Barat</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <div className="bg-gray-100 p-3 rounded-full mr-4">
                                        <i className="ri-phone-line text-xl text-gray-800"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Telepon</h3>
                                        <p className="text-gray-600">+62 812 3456 7890</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <div className="bg-gray-100 p-3 rounded-full mr-4">
                                        <i className="ri-mail-line text-xl text-gray-800"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Email</h3>
                                        <p className="text-gray-600">info@kostexample.com</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex space-x-4">
                                <a href="#" className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition-colors">
                                    <i className="ri-facebook-fill text-xl text-gray-800"></i>
                                </a>
                                <a href="#" className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition-colors">
                                    <i className="ri-instagram-line text-xl text-gray-800"></i>
                                </a>
                                <a href="#" className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition-colors">
                                    <i className="ri-whatsapp-line text-xl text-gray-800"></i>
                                </a>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 p-6 rounded-xl">
                            <form>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                    <input 
                                        type="text" 
                                        id="name" 
                                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-100 focus:border-gray-300" 
                                        placeholder="Masukkan nama Anda"
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-100 focus:border-gray-300" 
                                        placeholder="Masukkan email Anda"
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                                    <input 
                                        type="tel" 
                                        id="phone" 
                                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-100 focus:border-gray-300" 
                                        placeholder="Masukkan nomor telepon"
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Pesan</label>
                                    <textarea 
                                        id="message" 
                                        rows="4" 
                                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-100 focus:border-gray-300" 
                                        placeholder="Tulis pesan Anda..."
                                    ></textarea>
                                </div>
                                
                                <button type="submit" className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors">
                                    <i className="ri-send-plane-line mr-2"></i> Kirim Pesan
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}