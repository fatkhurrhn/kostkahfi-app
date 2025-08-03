// src/components/homepage/GallerySection.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const galleryImages = [
    {
        id: 1,
        src: 'https://res.cloudinary.com/dbssvz2pe/image/upload/v1754237445/assets-gallery/dmllmjw8ypwpum3ma4sfxqenf.png',
        alt: 'Tampak depan Kost Alkahfi',
        category: 'Eksterior'
    },
    {
        id: 2,
        src: 'https://res.cloudinary.com/dbssvz2pe/image/upload/v1754237445/assets-gallery/dmllmjw8ypwpum3ma4sfxqenf.png',
        alt: 'Kamar tidur premium',
        category: 'Interior'
    },
    {
        id: 3,
        src: 'https://res.cloudinary.com/dbssvz2pe/image/upload/v1754237445/assets-gallery/dmllmjw8ypwpum3ma4sfxqenf.png',
        alt: 'Coworking space Cavelatte',
        category: 'Fasilitas'
    },
    {
        id: 4,
        src: 'https://res.cloudinary.com/dbssvz2pe/image/upload/v1754237445/assets-gallery/dmllmjw8ypwpum3ma4sfxqenf.png',
        alt: 'Area taman hijau',
        category: 'Lingkungan'
    },
    {
        id: 5,
        src: 'https://res.cloudinary.com/dbssvz2pe/image/upload/v1754237445/assets-gallery/dmllmjw8ypwpum3ma4sfxqenf.png',
        alt: 'Kamar mandi bersih',
        category: 'Fasilitas'
    },
    {
        id: 6,
        src: 'https://res.cloudinary.com/dbssvz2pe/image/upload/v1754237445/assets-gallery/dmllmjw8ypwpum3ma4sfxqenf.png',
        alt: 'Ruang makan bersama',
        category: 'Fasilitas'
    },
    {
        id: 7,
        src: 'https://res.cloudinary.com/dbssvz2pe/image/upload/v1754237445/assets-gallery/dmllmjw8ypwpum3ma4sfxqenf.png',
        alt: 'Parkiran aman',
        category: 'Fasilitas'
    }
];

export default function GallerySection() {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900">
                        <span className="block sm:hidden">Galeri</span>
                        <span className="hidden sm:block">
                            Galeri <span className="text-[#eb6807]">Kost Alkahfi</span>
                        </span>
                    </h2>
                    <Link
                        to="/gallery"
                        className="inline-flex items-center text-[#eb6807] hover:text-[#d45e06] font-medium transition-colors"
                    >
                        Lihat Semua <i className="ri-arrow-right-line ml-2"></i>
                    </Link>
                </div>

                {/* Enhanced Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-3">
                    {/* Big featured image */}
                    <div className="sm:col-span-2 lg:col-span-2 lg:row-span-2 relative overflow-hidden rounded-[9px] shadow-lg">
                        <img
                            src={galleryImages[0].src}
                            alt={galleryImages[0].alt}
                            className="w-full h-full min-h-[300px] sm:min-h-[400px] object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-100 flex flex-col justify-end p-6">
                            <span className="bg-[#eb6807] text-white text-sm px-4 py-1.5 rounded-full inline-block mb-3 w-max">
                                {galleryImages[0].category}
                            </span>
                            <h3 className="text-white text-xl font-bold">{galleryImages[0].alt}</h3>
                        </div>
                    </div>

                    {/* Medium image */}
                    <div className="relative overflow-hidden rounded-[9px] shadow-lg">
                        <img
                            src={galleryImages[1].src}
                            alt={galleryImages[1].alt}
                            className="w-full h-full min-h-[200px] sm:min-h-[250px] object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-100 flex flex-col justify-end p-4">
                            <span className="bg-[#eb6807] text-white text-xs px-3 py-1 rounded-full inline-block mb-2 w-max">
                                {galleryImages[1].category}
                            </span>
                            <p className="text-white text-sm font-medium">{galleryImages[1].alt}</p>
                        </div>
                    </div>

                    {/* Small images grid */}
                    <div className="grid grid-cols-2 gap-3 lg:gap-3">
                        {galleryImages.slice(2, 6).map((image) => (
                            <div key={image.id} className="relative overflow-hidden rounded-xl shadow-md">
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="w-full h-full min-h-[150px] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-100 flex flex-col justify-end p-3">
                                    <span className="bg-[#eb6807] text-white text-xs px-2 py-0.5 rounded-full inline-block mb-1 w-max">
                                        {image.category}
                                    </span>
                                    <p className="text-white text-xs font-medium truncate">{image.alt}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
