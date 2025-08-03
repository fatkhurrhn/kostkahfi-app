// src/components/homepage/KeunggulanSection.jsx
import React from 'react';

const features = [
  {icon: 'ri-shield-check-line', title: 'Keamanan', desc: '24 Jam', color: 'bg-blue-100 text-blue-600'},
  {icon: 'ri-wifi-line', title: 'Internet', desc: 'High Speed', color: 'bg-purple-100 text-purple-600'},
  // Data lainnya...
];

export default function KeunggulanSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Kenapa Kost Alkahfi?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kami memberikan pengalaman tinggal terbaik dengan berbagai keunggulan eksklusif.
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