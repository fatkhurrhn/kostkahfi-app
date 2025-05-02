import React, { useEffect, useState } from 'react';

const Tes = () => {
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
    <div>
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-6 mb-6 relative overflow-hidden shadow-md">
                    <div className="absolute top-0 right-0 opacity-20">
                        <i className="ri-group-line text-9xl text-white"></i>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                        Assalamualaikum 👋
                    </h1>
                    <p className="text-white text-sm opacity-90">Ahlan wa sahlan di halaman <b>Program Mahasantri</b></p>
                    <div className="mt-4 bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                        <div className="flex items-center text-white">
                            <div>
                                <p className="text-xs">Quote of the day</p>
                                <p className="font-medium">{quote}</p>
                            </div>
                        </div>
                    </div>
                </div>
    </div>
  );
};

export default Tes;
