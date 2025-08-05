import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
    return (
        <div className="bg-gray-50 min-h-screen text-gray-800">
            <Navbar />

            <section className="max-w-7xl mx-auto px-4 py-6">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold mb-3 text-gray-800">
                        <span className="text-[#eb6807]">Contact</span> Us
                    </h1>
                    <div className="w-20 h-1 bg-[#eb6807] mx-auto mb-4"></div>
                    <p className="text-gray-600 max-w-lg mx-auto">
                        Have questions, feedback, or interested in collaborating with us? We're here to help. Feel free to reach out to us anytime.
                    </p>
                </div>

                {/* Contact Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Informasi Kontak</h2>

                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="w-10 h-10 flex items-center justify-center bg-[#eb6807]/10 rounded-full mr-4">
                                    <i className="ri-map-pin-2-line text-[#eb6807] text-xl"></i>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Alamat</h3>
                                    <p className="text-gray-600">
                                        Jl. Kukusan Raya No. 39, Beji, Depok, Jawa Barat 16425
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-10 h-10 flex items-center justify-center bg-[#eb6807]/10 rounded-full mr-4">
                                    <i className="ri-phone-line text-[#eb6807] text-xl"></i>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Telepon</h3>
                                    <p className="text-gray-600">
                                        <a href="tel:+6281234567890" className="hover:text-[#eb6807] transition-colors">
                                            +62 812-3456-7890
                                        </a>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-10 h-10 flex items-center justify-center bg-[#eb6807]/10 rounded-full mr-4">
                                    <i className="ri-mail-line text-[#eb6807] text-xl"></i>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Email</h3>
                                    <p className="text-gray-600">
                                        <a href="mailto:kostalkahfi@gmail.com" className="hover:text-[#eb6807] transition-colors">
                                            kostalkahfi@gmail.com
                                        </a>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-10 h-10 flex items-center justify-center bg-[#eb6807]/10 rounded-full mr-4">
                                    <i className="ri-time-line text-[#eb6807] text-xl"></i>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Jam Operasional</h3>
                                    <p className="text-gray-600">
                                        Senin - Minggu<br />
                                        08:00 - 22:00 WIB
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="mt-8">
                            <h3 className="font-semibold text-gray-800 mb-4">Media Sosial</h3>
                            <div className="flex space-x-4">
                                {[
                                    { icon: 'ri-whatsapp-fill', color: 'text-green-500', url: 'https://wa.me/6281234567890' },
                                    { icon: 'ri-instagram-fill', color: 'text-pink-500', url: 'https://instagram.com/kostalkahfi' },
                                    { icon: 'ri-tiktok-fill', color: 'text-gray-800', url: 'https://tiktok.com/@kostalkahfi' },
                                    { icon: 'ri-facebook-fill', color: 'text-blue-600', url: 'https://facebook.com/kostalkahfi' }
                                ].map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`bg-gray-100 w-10 h-10 flex items-center justify-center hover:bg-gray-200 p-3 rounded-full text-xl transition-colors ${social.color}`}
                                    >
                                        <i className={social.icon}></i>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Map and Contact Form */}
                    <div className="space-y-8">
                        {/* Google Maps */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3831.042081585881!2d106.81678007483026!3d-6.3573448936326304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ec2092accabd%3A0xd021b67b8e9d13a5!2sKost%20UI%20Pondok%20Al-Kahfi%2C%20Kukusan%2C%20Depok!5e1!3m2!1sid!2sid!4v1754234417847!5m2!1sid!2sid"
                                width="100%"
                                height="300"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="rounded-t-xl"
                            ></iframe>
                            <div className="p-4 bg-gray-50 border-t border-gray-200">
                                <a
                                    href="https://maps.google.com/maps?q=Kost+UI+Pondok+Al-Kahfi,+Kukusan,+Depok"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#eb6807] font-medium flex items-center"
                                >
                                    <i className="ri-map-pin-line mr-2"></i> Buka di Google Maps
                                </a>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800">Kirim Pesan</h2>
                            <form className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#eb6807] focus:border-[#eb6807] outline-none transition"
                                        placeholder="Nama Anda"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#eb6807] focus:border-[#eb6807] outline-none transition"
                                        placeholder="email@contoh.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                        Pesan
                                    </label>
                                    <textarea
                                        id="message"
                                        rows="4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#eb6807] focus:border-[#eb6807] outline-none transition"
                                        placeholder="Tulis pesan Anda..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-[#eb6807] hover:bg-[#d45e06] text-white font-medium py-3 px-4 rounded-lg transition-colors"
                                >
                                    Kirim Pesan
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}