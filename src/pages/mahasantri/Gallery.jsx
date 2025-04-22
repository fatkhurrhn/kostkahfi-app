import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { galleryRef } from '../../firebase';
import { getDocs } from 'firebase/firestore';
import BottomNavbar from '../../components/BottomNavbar';

function Gallery() {
  const navigate = useNavigate();
  const [galleryItems, setGalleryItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', 'kajian', 'diskusi', 'makan-makan', 'bermain'];

  useEffect(() => {
    const fetchGalleryItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const querySnapshot = await getDocs(galleryRef);
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setGalleryItems(items);
      } catch (error) {
        console.error("Error fetching gallery items: ", error);
        setError("Gagal memuat galeri. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

    const searchedItems = searchQuery 
    ? filteredItems.filter(item => {
        const desc = item.description || '';
        return desc.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : filteredItems;

  // Urutkan berdasarkan tanggal terbaru
  const sortedItems = [...searchedItems].sort((a, b) => {
    const dateA = a.createdAt || '0';
    const dateB = b.createdAt || '0';
    return dateB.localeCompare(dateA);
  });

  return (
    <div className="h-screen flex flex-col bg-blue-50 max-w-3xl mx-auto">
      <div className="flex-1 overflow-y-auto container px-4 pt-[70px] pb-20 scrollbar-hide">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 text-white z-50 max-w-3xl mx-auto shadow-md py-3">
          <div className="w-full mx-auto px-4 flex justify-between items-center">
            <button 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <i className="ri-arrow-left-line text-lg text-gray-800"></i>
              <span className="font-medium text-gray-800">Gallery Mahasantri</span>
            </button>
            <div className="flex items-center space-x-4 text-gray-800">
              <i className="ri-notification-3-line text-lg"></i>
              <i className="ri-user-line text-lg"></i>
            </div>
          </div>
        </div>

        {/* Search and Filter Row */}
        <div className="mt-0 mb-4 flex gap-2">
          {/* Search Input - takes more space */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="ri-search-line text-blue-500"></i>
            </div>
            <input
              type="text"
              placeholder="Cari deskripsi..."
              className="w-full pl-10 pr-4 py-2 text-gray-800 rounded-[10px] border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-blue-600 text-white pl-3 pr-8 py-2 rounded-[10px] border-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {categories.map((category) => (
                <option 
                  key={category} 
                  value={category}
                  className="bg-white text-gray-800"
                >
                  {category === 'all' ? 'Semua' : category}
                </option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <i className="ri-arrow-down-s-line text-white"></i>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Gallery Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? 
              'Tidak ditemukan foto dengan deskripsi tersebut' : 
              'Tidak ada foto untuk kategori ini'}
          </div>
        ) : (
            <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-2 pt-2">
            {sortedItems.map((item) => (
              <div key={item.id} className="mb-4 break-inside-avoid">
                <div className="relative group rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  {/* Image with original aspect ratio */}
                  <img
                    src={item.imageUrl}
                    alt={item.description || 'Foto kegiatan'}
                    className="w-full h-auto object-cover rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300?text=Gambar+Tidak+Tersedia';
                    }}
                  />
                  
                  {/* Category badge - top left */}
                  <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-[5px] z-10">
                    {item.category}
                  </span>
                  
                  {/* Description overlay - appears on hover/click */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                    <p className="text-sm text-white line-clamp-2">
                      {item.description || 'Tidak ada deskripsi'}
                    </p>
                    {item.createdAt && (
                      <p className="text-xs text-blue-100 mt-1">
                        <i className="ri-calendar-line mr-1"></i>
                        {new Date(item.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Bottom Navbar */}
      <BottomNavbar />
    </div>
  );
}

export default Gallery;