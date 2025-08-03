// src/components/homepage/KamarSection.jsx
import React, { useState } from 'react';

export default function KamarSection() {
    const [roomStats] = useState({ total: 30, occupied: 18, available: 12 });

    return (
        <section id="kamar" className="py-16 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Ketersediaan <span className="text-[#eb6807]">Kamar</span></h2>
                        <p className="text-gray-600 mb-8">
                            Cek ketersediaan kamar kost kami. Update real-time setiap ada perubahan.
                        </p>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                                <div className="text-3xl font-bold text-gray-800">{roomStats.total}</div>
                                <div className="text-sm text-gray-500">Total Kamar</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                                <div className="text-3xl font-bold text-[#eb6807]">{roomStats.available}</div>
                                <div className="text-sm text-gray-500">Tersedia</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                                <div className="text-3xl font-bold text-gray-600">{roomStats.occupied}</div>
                                <div className="text-sm text-gray-500">Terisi</div>
                            </div>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                            <div
                                className="bg-[#eb6807] h-3 rounded-full"
                                style={{ width: `${(roomStats.available / roomStats.total) * 100}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-500 text-right">
                            {Math.round((roomStats.available / roomStats.total) * 100)}% kamar tersedia
                        </p>

                        <a
                            href="/kamar"
                            className="inline-flex items-center mt-6 text-[#eb6807] font-medium"
                        >
                            Lihat detail kamar <i className="ri-arrow-right-line ml-2"></i>
                        </a>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-xl font-semibold mb-4">Tipe Kamar</h3>
                        <div className="space-y-4">
                            {[
                                { type: 'Reguler', price: 'Rp 750.000', available: 5, total: 50 },
                                { type: 'Mahasantri', price: 'Rp 350.000', available: 8, total: 10 },
                                { type: 'Biman', price: 'Rp 0', available: 20, total: 20 },
                            ].map((item, index) => (
                                <div key={index} className="border-b border-gray-100 pb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-medium">{item.type}</h4>
                                        <span className="text-gray-600">{item.price}/bulan</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>{item.available} dari {item.total} kamar tersedia</span>
                                        <span className="text-[#eb6807]">
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
    )
}