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
        <section className="py-12 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">Apa Kata Penghuni?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Testimoni jujur dari penghuni Kost Alkahfi.
                    </p>
                </div>

                <div className="relative">
                    {/* Scrollable container with hidden scrollbar */}
                    <div className="overflow-x-auto pb-6 scrollbar-hide">
                        <div className="flex space-x-6 w-max mx-auto">
                            {testimonials.map((item, index) => (
                                <TestimonialCard
                                    key={index}
                                    item={item}
                                    isActive={activeTestimonial === index}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Custom indicators */}
                    <div className="flex justify-center mt-8 space-x-2">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveTestimonial(index)}
                                className={`w-2.5 h-2.5 rounded-full transition-all ${activeTestimonial === index ? 'bg-[#eb6807] w-4' : 'bg-gray-300'}`}
                                aria-label={`Go to testimonial ${index + 1}`}
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
        <div className={`w-[450px] flex-shrink-0 bg-white p-5 rounded-xl shadow-sm transition-all duration-300 transform ${isActive ? 'ring-2 ring-[#eb6807] scale-[1.02]' : 'hover:shadow-md'}`}>
            <div className="flex items-center mb-4">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-white shadow-sm"
                />
                <div>
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.role}</p>
                </div>
            </div>
            <p className="text-gray-600 mb-4 italic text-justify">"{item.quote}"</p>
            <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                    <i key={star} className="ri-star-fill"></i>
                ))}
            </div>
        </div>
    )
}