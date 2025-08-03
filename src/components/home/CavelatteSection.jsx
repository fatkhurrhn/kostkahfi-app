// src/components/homepage/CavelatteSection.jsx
import React from 'react';

export default function CavelatteSection() {
    return (
        <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <h2 className="text-3xl font-bold mb-6">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#eb6807] to-white">Cavelatte</span> -
                            Coworking Space Eksklusif
                        </h2>
                        <p className="text-gray-300 mb-6">
                            Nikmati coworking space eksklusif hanya untuk penghuni Kost Alkahfi. Tempat nyaman untuk bekerja, belajar, atau sekadar nongkrong sambil menikmati kopi berkualitas.
                        </p>
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center">
                                <i className="ri-checkbox-circle-fill text-[#eb6807] mr-3 text-xl"></i>
                                <span>Free akses untuk penghuni</span>
                            </div>
                            <div className="flex items-center">
                                <i className="ri-checkbox-circle-fill text-[#eb6807] mr-3 text-xl"></i>
                                <span>High speed internet</span>
                            </div>
                            <div className="flex items-center">
                                <i className="ri-checkbox-circle-fill text-[#eb6807] mr-3 text-xl"></i>
                                <span>Kopi dan snack premium</span>
                            </div>
                            <div className="flex items-center">
                                <i className="ri-checkbox-circle-fill text-[#eb6807] mr-3 text-xl"></i>
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
    )
}