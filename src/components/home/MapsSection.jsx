// src/components/homepage/MapsSection.jsx
import React from 'react';

export default function MapsSection() {
    return (
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
    )
}