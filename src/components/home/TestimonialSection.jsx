// src/components/homepage/TestimonialSection.jsx
import React, { useState, useEffect } from 'react';

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

export default function TestimonialSection() {
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
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
                                <TestimonialCard
                                    key={index}
                                    item={item}
                                    isActive={activeTestimonial === index}
                                />
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
    )
}

function TestimonialCard({ item, isActive }) {
    return (
        <div className={`w-80 flex-shrink-0 bg-white p-6 rounded-xl shadow-sm transition-all duration-300 ${isActive ? 'ring-2 ring-green-500' : ''}`}>
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
    )
}