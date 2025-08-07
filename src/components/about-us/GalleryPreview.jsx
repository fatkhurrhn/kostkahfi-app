import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = "http://localhost:8888/api/gallery";

export default function GalleryPreview() {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null); // Untuk modal

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error("Gagal memuat galeri");

                const data = await response.json();

                // Ambil 4 terbaru berdasarkan createdAt
                const latestFour = data
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 4);

                setItems(latestFour);
            } catch (error) {
                console.error("Error fetching gallery:", error);
                setItems([]);
            }
        };

        fetchGallery();
    }, []);

    return (
        <div className="mb-16">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                    <span className="block sm:hidden">Galeri</span>
                    <span className="hidden sm:block">
                        Galeri <span className="text-[#eb6807]">Kost Alkahfi</span>
                    </span>
                </h2>
                <Link
                    to="/gallery"
                    className="inline-flex items-center text-[#eb6807] hover:text-[#d45e06] font-medium transition-colors"
                >
                    Lihat Semua <i className="ri-arrow-right-line ml-2"></i>
                </Link>
            </div>

            {/* Grid Gambar */}
            {items.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="aspect-square rounded-xl overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-[1.03] shadow-sm"
                            onClick={() => setSelectedItem(item)} // Buka modal
                        >
                            <img
                                src={`http://localhost:8888${item.imageUrl}`}
                                alt={item.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center py-6">Tidak ada foto tersedia.</p>
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

                        {/* Gambar */}
                        <img
                            src={`http://localhost:8888${selectedItem.imageUrl}`}
                            alt={selectedItem.title}
                            className="w-full h-auto max-h-[80vh] object-contain rounded-t-xl"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}