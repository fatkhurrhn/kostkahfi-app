import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';

export default function HomePage() {
    const navigate = useNavigate();
    const [quote, setQuote] = useState('');
    
      useEffect(() => {
        fetch('/quotes/quotes.json')
          .then((res) => res.json())
          .then((data) => {
            const randomIndex = Math.floor(Math.random() * data.length);
            setQuote(data[randomIndex]);
          })
          .catch((err) => console.error('Gagal ambil quote:', err));
      }, []);

    return (
        <div className="h-screen flex flex-col bg-slate-50">
            <div className="flex-1 overflow-y-auto container max-w-2xl mx-auto px-4 pt-[70px] pb-20 scrollbar-hide">
                {/* Header */}
                <div className="fixed top-0 left-0 max-w-[710px] mx-auto right-0 bg-white z-50 border-b border-gray-300 py-3">
                    <div className="w-full mx-auto px-6 flex justify-between items-center">
                        <h3 className="text-black flex items-center gap-2 cursor-pointer">
                            <i className="ri-arrow-left-line text-lg"></i> Program Mahasantri
                        </h3>
                        <div className="flex items-center space-x-4">
                            <i className="ri-notification-3-line text-lg text-gray-700"></i>
                            <a href="/mahasantri/login"><i className="ri-user-line text-lg text-gray-700"></i></a>
                        </div>
                    </div>
                </div>

                {/* Page Title with Gradient Background */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-6 mb-6 relative overflow-hidden shadow-md">
                    <div className="absolute top-0 right-0 opacity-20">
                        <i className="ri-group-line text-9xl text-white"></i>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                        Assalamualaikum 👋
                    </h1>
                    <p className="text-white text-sm opacity-90">Ahlan wa sahlan Anak Program</p>
                    <div className="mt-4 bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                        <div className="flex items-center text-white">
                            <div>
                                <p className="text-[14px]"><b>Quote of the day</b></p>
                                <p className="font-smal text-[12px]"><i>"{quote}"</i></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl pt-3">
                    <button
                        onClick={() => navigate('/mahasantri/recap-habits')}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-6 rounded-lg shadow-md transition-colors duration-300 flex flex-col items-center"
                    >
                        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Daily Habits
                        <span className="text-sm font-normal mt-1">Lihat Track Habits</span>
                    </button>

                    <button
                        onClick={() => navigate('/mahasantri/recap-kehadiran')}
                        className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-4 px-6 rounded-lg shadow-md transition-colors duration-300 flex flex-col items-center"
                    >
                        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Recap Kajian
                        <span className="text-sm font-normal mt-1">Lihat Data Kehadiran</span>
                    </button>

                    <button
                        onClick={() => navigate('/mahasantri/recap-setoran')}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-4 px-6 rounded-lg shadow-md transition-colors duration-300 flex flex-col items-center"
                    >
                        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Recap Setoran
                        <span className="text-sm font-normal mt-1">Lihat Data Setoran</span>
                    </button>

                    <button
                        onClick={() => navigate('/mahasantri/gallery')}
                        className="bg-violet-600 hover:bg-violet-700 text-white font-medium py-4 px-6 rounded-lg shadow-md transition-colors duration-300 flex flex-col items-center"
                    >
                        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Gallery Mahasantri
                        <span className="text-sm font-normal mt-1">Lihat Gallery Disini</span>
                    </button>
                </div>
            </div>
        </div>
    );
}