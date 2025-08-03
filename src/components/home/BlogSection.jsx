// src/components/homepage/BlogSection.jsx
import React from 'react';

const blogPosts = [
        {
            title: 'Tips Memilih Kost untuk Mahasiswa Baru',
            excerpt: 'Panduan lengkap memilih kost yang nyaman dan sesuai budget untuk mahasiswa baru...',
            date: '15 Juni 2024',
            image: 'https://images.unsplash.com/photo-1529408686214-b48b8532f72c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
        },
        {
            title: 'Fasilitas Unggulan Kost Alkahfi',
            excerpt: 'Temukan berbagai fasilitas premium yang hanya ada di Kost Alkahfi...',
            date: '5 Mei 2024',
            image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
        },
        {
            title: 'Event Bulanan di Cavelatte',
            excerpt: 'Jadwal event-event seru di Cavelatte bulan ini. Free untuk penghuni kost!',
            date: '22 April 2024',
            image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80'
        }
    ];

export default function BlogSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Artikel Terbaru</h2>
          <a href="/blog" className="inline-flex items-center text-green-600 hover:text-green-700 font-medium">
            Lihat Semua <i className="ri-arrow-right-line ml-2"></i>
          </a>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <BlogCard key={index} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}

function BlogCard({ post }) {
  return (
    <div className="group">
      <div className="relative rounded-xl overflow-hidden aspect-video mb-4">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <span className="bg-white text-gray-800 text-xs px-2 py-1 rounded">{post.date}</span>
        </div>
      </div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-green-600 transition-colors">{post.title}</h3>
      <p className="text-gray-600 mb-4">{post.excerpt}</p>
      <a href="#" className="inline-flex items-center text-sm text-green-600 hover:text-green-700 font-medium">
        Baca Selengkapnya <i className="ri-arrow-right-line ml-2"></i>
      </a>
    </div>
  )
}