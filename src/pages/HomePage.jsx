// src/pages/HomePage.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSection from '../components/home/HeroSection';
import KeunggulanSection from '../components/home/KeunggulanSection';
import KamarSection from '../components/home/KamarSection';
import CavelatteSection from '../components/home/CavelatteSection';
import BlogSection from '../components/home/BlogSection';
import TestimonialSection from '../components/home/TestimonialSection';
import MapsSection from '../components/home/MapsSection';
import CTASection from '../components/home/CTASection';
import GallerySection from '../components/home/GallerySection';
import ChatBot from '../components/chatbot/ChatBot';

export default function HomePage() {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 transition-colors duration-300">
      <Navbar />
      <ChatBot />

      <HeroSection />
      <KeunggulanSection />
      <KamarSection />
      <CavelatteSection />
      <BlogSection />
      <TestimonialSection />
      <GallerySection />
      <MapsSection />
      <CTASection />

      <Footer />
    </div>
  )
}