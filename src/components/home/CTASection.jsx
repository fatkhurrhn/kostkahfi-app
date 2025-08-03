// src/components/homepage/CTASection.jsx
import React from 'react';

export default function CTASection() {
  return (
    <section className="py-16 bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-6">Tertarik Menjadi <span className='text-[#eb6807]'>Penghuni?</span></h2>
        <p className="text-gray-100 max-w-2xl mx-auto mb-8">
          Segera hubungi kami untuk informasi lebih lanjut atau kunjungi langsung lokasi kost kami.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a 
            href="#kontak" 
            className="bg-white hover:bg-gray-100 text-[#eb6807] px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
          >
            <i className="ri-phone-line mr-2"></i> Hubungi Kami
          </a>
          <a 
            href="/kamar" 
            className="border border-white/50 hover:bg-white/10 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
          >
            <i className="ri-home-4-line mr-2"></i> Lihat Kamar
          </a>
        </div>
      </div>
    </section>
  )
}