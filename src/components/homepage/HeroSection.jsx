// src/components/homepage/HeroSection.jsx
import React from 'react';

export default function HeroSection() {
    return (
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
    )
}