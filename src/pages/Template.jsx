import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Template() {
    return (
        <div className="bg-gray-50 min-h-screen text-gray-800 transition-colors duration-300">
            <Navbar />
            <section className="max-w-7xl mx-auto px-4 pt-2">
                <div>isi konten disini</div>
            </section>
            <Footer />
        </div>
    )
}

