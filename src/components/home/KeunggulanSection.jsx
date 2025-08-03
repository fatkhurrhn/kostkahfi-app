// src/components/homepage/KeunggulanSection.jsx
import React from 'react';

const features = [
    { icon: 'ri-plant-line', title: 'Lingkungan', desc: 'Hijau & Asri', color: 'bg-green-100 text-green-600' },
    { icon: 'ri-restaurant-line', title: 'Dapur', desc: 'Bersama', color: 'bg-yellow-100 text-yellow-600' },
    { icon: 'ri-cup-line', title: 'Cavelatte', desc: 'Coworking Space', color: 'bg-indigo-100 text-indigo-600' },
    { icon: 'ri-map-pin-line', title: 'Lokasi', desc: 'Strategis', color: 'bg-cyan-100 text-cyan-600' }
];

export default function KeunggulanSection() {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Keunggulan <span className="text-[#eb6807]">Kost Alkahfi</span>
                    </h2>
                     <p className="text-md sm:text-md text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Temukan pengalaman tinggal premium dengan fasilitas lengkap yang dirancang khusus untuk kenyamanan dan produktivitas kamuu.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {features.map((item, index) => (
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
    )
}