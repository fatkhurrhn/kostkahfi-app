import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:8888/api/gallery";

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("Semua");
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      const res = await fetch(API_URL);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    };
    fetchItems();
  }, []);

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

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Galeri <span className="text-[#eb6807]">Kost Al Kahfi</span>
      </h1>

      {/* Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {allCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === cat
                ? "bg-[#eb6807] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer transform hover:-translate-y-1"
          >
            <img
              src={`http://localhost:8888${item.imageUrl}`}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 bg-white">
              <h3 className="font-bold text-gray-800">{item.title}</h3>
              <span className="text-xs bg-[#eb6807]/20 text-[#eb6807] px-2 py-0.5 rounded">
                {item.category}
              </span>
              <p className="text-xs text-gray-500 mt-1">Upload: {formatDate(item.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <p className="text-center text-gray-500 py-8">Belum ada foto di kategori ini.</p>
      )}

      {/* Modal Detail */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`http://localhost:8888${selectedItem.imageUrl}`}
              alt={selectedItem.title}
              className="w-full h-80 object-cover rounded-t-xl"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800">{selectedItem.title}</h2>
              <span className="inline-block mt-3 px-3 py-1 bg-[#eb6807] text-white text-sm rounded-full">
                {selectedItem.category}
              </span>
              <p className="text-sm text-gray-600 mt-2">
                Diupload pada: {formatDate(selectedItem.createdAt)}
              </p>
              <button
                onClick={() => setSelectedItem(null)}
                className="mt-4 w-full py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}