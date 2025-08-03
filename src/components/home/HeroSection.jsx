// src/components/homepage/HeroSection.jsx
import React from 'react';

export default function HeroSection() {
    return (
        <section className="relative h-screen flex items-center justify-center text-center overflow-hidden bg-gray-900">
            {/* Background full image - dark overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://res.cloudinary.com/dbssvz2pe/image/upload/v1754237445/assets-gallery/dmllmjw8ypwpum3ma4sfxqenf.png"
                    alt="Kost Alkahfi"
                    className="w-full h-full object-cover opacity-70"
                    loading="eager"
                    style={{ touchAction: 'pan-y' }} // Prevent zoom on scroll
                />
                <div className="absolute inset-0 bg-black/50"></div>
            </div>

            {/* Konten utama */}
            <div className="relative z-10 px-4 w-full max-w-4xl mx-auto text-white">
                {/* Tagline */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                    <span className="text-white">Kost Alkahfi</span>
                    <span className="block mt-2 sm:mt-3 text-white/90 text-xl sm:text-2xl md:text-3xl font-medium">
                        Rumah Kedua yang Nyaman
                    </span>
                </h1>

                {/* Deskripsi singkat */}
                <p className="text-lg sm:text-xl md:text-1xl mb-6 sm:mb-8 text-white/80 mx-auto max-w-md sm:max-w-xl md:max-w-2xl leading-relaxed">
                    Kost premium dengan konsep modern di jantung Depok. Kami menawarkan kamar
                    nyaman dengan fasilitas lengkap untuk mahasiswa dan profesional muda
                    yang mengutamakan kenyamanan dan kebersihan.
                </p>

                {/* Harga */}
                <div className="mb-8 sm:mb-10">
                    <p className="text-lg sm:text-xl text-white/80">Mulai dari</p>
                    <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
                        Rp <span className="text-[#eb6807]">750</span>rb<span className="text-xl sm:text-2xl text-white/70">/bulan</span>
                    </p>
                </div>

                {/* Tombol CTA dengan aksen orange */}
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
                    <a
                        href="#kamar"
                        className="bg-[#eb6807] hover:bg-[#d45e06] text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-medium text-lg transition-all flex items-center justify-center shadow-lg hover:shadow-[#eb6807]/40 hover:scale-105"
                    >
                        <i className="ri-home-4-line mr-2"></i> Lihat Kamar
                    </a>
                    <a
                        href="/cavelatte"
                        className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-medium text-lg transition-all flex items-center justify-center border border-white/20 hover:border-white/40 hover:scale-105 backdrop-blur-sm"
                    >
                        <i className="ri-cup-line mr-2"></i> Explore Cavelatte
                    </a>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="pointer-events-none absolute bottom-8 left-[49%] -translate-x-1/2 z-30 animate-bounce">
                <i className="ri-arrow-down-line text-3xl text-white/80"></i>
            </div>
        </section>
    )
}