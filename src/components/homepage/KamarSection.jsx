// src/components/homepage/KamarSection.jsx
import React, { useState } from 'react';

export default function KamarSection() {
  const [roomStats] = useState({ total: 30, occupied: 18, available: 12 });
  
  return (
    <section id="kamar" className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Konten status kamar... */}
        </div>
      </div>
    </section>
  )
}