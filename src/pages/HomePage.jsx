// src/pages/HomePage.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSection from '../components/homepage/HeroSection';
import KeunggulanSection from '../components/homepage/KeunggulanSection';
import KamarSection from '../components/homepage/KamarSection';
import CavelatteSection from '../components/homepage/CavelatteSection';
import BlogSection from '../components/homepage/BlogSection';
import TestimonialSection from '../components/homepage/TestimonialSection';
import MapsSection from '../components/homepage/MapsSection';
import CTASection from '../components/homepage/CTASection';

export default function HomePage() {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 transition-colors duration-300">
      <Navbar />
      
      <HeroSection />
      <KeunggulanSection />
      <KamarSection />
      <CavelatteSection />
      <BlogSection />
      <TestimonialSection />
      <MapsSection />
      <CTASection />
      
      <Footer />
    </div>
  )
}