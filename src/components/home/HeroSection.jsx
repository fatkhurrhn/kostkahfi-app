// src/components/homepage/HeroSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
    return (
        <section className="relative h-screen flex items-center justify-center text-center overflow-hidden bg-gray-900">
            <div className="">
                <img
                    src="https://res.cloudinary.com/dbssvz2pe/image/upload/v1754237445/assets-gallery/dmllmjw8ypwpum3ma4sfxqenf.png"
                    alt="Kost Alkahfi"
                    className="w-full h-full object-cover opacity-70"
                    loading="eager"
                    style={{ touchAction: 'pan-y' }} // Prevent zoom on scroll
                />
                <div className="absolute inset-0 bg-black/50"></div>
            </div>
        </section>
    )
}