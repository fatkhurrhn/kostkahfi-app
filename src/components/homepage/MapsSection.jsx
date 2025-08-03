// src/components/homepage/MapsSection.jsx
import React from 'react';

export default function MapsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Lokasi Kost</h2>
            {/* Konten alamat... */}
          </div>
          
          <div className="rounded-xl overflow-hidden shadow-xl border border-gray-200">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3831.042081585881!2d106.81678007483026!3d-6.3573448936326304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ec2092accabd%3A0xd021b67b8e9d13a5!2sKost%20UI%20Pondok%20Al-Kahfi%2C%20Kukusan%2C%20Depok!5e1!3m2!1sid!2sid!4v1754234417847!5m2!1sid!2sid" 
              width="100%" 
              height="400" 
              style={{border:0}} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-xl"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  )
}