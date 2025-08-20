import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatBot from "../components/chatbot/ChatBot";
import ScrollToTop from "../components/ScrollToTop";

const API_URL = "http://localhost:8888/api/gallery";

export default function Gallery() {
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState("Semua");
    const [selectedItem, setSelectedItem] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItems = async () => {
            const res = await fetch(API_URL);
            const data = await res.json();
            setItems(Array.isArray(data) ? data : []);
        };
        fetchItems();
    }, []);

    // Handle URL hash changes
    useEffect(() => {
        if (items.length > 0) {
            const hash = location.hash.substring(1); // Remove the # from hash
            const allCategories = ["Semua", ...new Set(items.map(i => i.category))];
            
            if (hash && allCategories.includes(hash)) {
                setFilter(hash);
            } else {
                setFilter("Semua");
            }
        }
    }, [location.hash, items]);

    const allCategories = ["Semua", ...new Set(items.map(i => i.category))];

    const filteredItems = filter === "Semua"
        ? items
        : items.filter(item => item.category === filter);

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const handleFilterClick = (category) => {
        setFilter(category);
        // Update URL hash without page reload
        if (category === "Semua") {
            navigate("/gallery", { replace: true });
        } else {
            navigate(`/gallery#${category}`, { replace: true });
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 pt-[110px]">
            <Navbar />
            <ChatBot />
            <ScrollToTop/>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold mb-3 text-gray-800">
                    <span className="text-[#eb6807]">Galeri</span> Kami
                </h1>
                <div className="w-20 h-1 bg-[#eb6807] mx-auto mb-4"></div>
                <p className="text-gray-600 max-w-lg mx-auto">
                    Jelajahi koleksi dokumentasi kegiatan dan momen spesial kami. Setiap gambar punya cerita yang kami banggakan.
                </p>
            </div>

            {/* Filter */}
            <div className="w-full overflow-x-auto">
                <div className="inline-flex space-x-2 px-0 mb-8">
                    {allCategories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => handleFilterClick(cat)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition ${filter === cat
                                ? "bg-[#eb6807] text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Rest of your component remains the same */}
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pb-10">
                {filteredItems.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className="rounded-[10px] overflow-hidden shadow-md hover:shadow-xl cursor-pointer"
                    >
                        {/* Gambar + Kategori */}
                        <div className="relative">
                            <img
                                src={`http://localhost:8888${item.imageUrl}`}
                                alt={item.title}
                                className="w-full h-48 object-cover"
                            />
                            <span className="absolute top-2 right-2 text-xs bg-[#eb6807]/90 text-white px-2 py-0.5 rounded-full shadow-md">
                                {item.category}
                            </span>
                        </div>

                        {/* Info */}
                        <div className="p-4 bg-white">
                            <h3 className="font-bold text-gray-800">{item.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">Upload: {formatDate(item.createdAt)}</p>
                        </div>
                    </div>
                ))}
            </div>

            {filteredItems.length === 0 && (
                <p className="text-center font-medium text-gray-500 py-8">[Server bermasalah atau belum di RUN]</p>
            )}

            {/* Modal Detail */}
            {selectedItem && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedItem(null)}
                >
                    <div
                        className="bg-white rounded-xl relative max-w-4xl w-full max-h-[90vh] overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                         {/* Tombol Tutup */}
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center text-2xl font-bold text-gray-600 hover:text-gray-900 bg-white/80 rounded-full shadow-md hover:bg-white transition"
                            aria-label="Tutup modal"
                        >
                            ×
                        </button>

                        {/* Gambar dengan max-height */}
                        <img
                            src={`http://localhost:8888${selectedItem.imageUrl}`}
                            alt={selectedItem.title}
                            className="w-full h-auto max-h-[80vh] object-contain rounded-t-xl"
                        />
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}