import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Cavelatte() {
    return (
        <div className="bg-gray-50 min-h-screen text-gray-800 transition-colors duration-300">
            <Navbar />
            <section className="max-w-7xl mx-auto px-4 py-6">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold mb-3 text-gray-800">
                        <span className="text-[#eb6807]">Cavelatte</span> Space
                    </h1>
                    <div className="w-20 h-1 bg-[#eb6807] mx-auto mb-4"></div>
                    <p className="text-gray-600 max-w-lg mx-auto">
                        Your exclusive coworking lounge with specialty coffee - perfect for work or relaxation.
                    </p>
                </div>
            </section>
            <Footer />
        </div>
    )
}

