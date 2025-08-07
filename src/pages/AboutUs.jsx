import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatBot from '../components/chatbot/ChatBot';
import AboutHero from '../components/about-us/AboutHero';
import AboutStory from '../components/about-us/AboutStory';
import UniqueValue from '../components/about-us/UniqueValue';
import TeamSection from '../components/about-us/TeamSection';
import AchievementBanner from '../components/about-us/AchievementBanner';
import GalleryPreview from '../components/about-us/GalleryPreview';
import AboutCTA from '../components/about-us/AboutCTA';
import ScrollToTop from '../components/ScrollToTop';

export default function AboutUs() {
    return (
        <div className="bg-gray-50 min-h-screen text-gray-800">
            <Navbar />
            <ChatBot />
            <ScrollToTop/>
            
            <main className="max-w-7xl mx-auto px-4 pb-16">
                <AboutHero />
                <AboutStory />
                <UniqueValue />
                <TeamSection />
                <AchievementBanner />
                <GalleryPreview />
                <AboutCTA />
            </main>

            <Footer />
        </div>
    );
}