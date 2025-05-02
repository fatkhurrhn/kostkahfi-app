import { useState, useEffect } from 'react';
import { galleryRef } from '../../firebase';
import { addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function Gallery() {
  const navigate = useNavigate();
  const [galleryItems, setGalleryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    category: 'kajian',
    description: '',
    imageUrl: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [galleryItems, searchQuery, selectedCategory]);

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
      setError("Gagal memuat data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = [...galleryItems];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }

    setFilteredItems(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing) {
        await updateDoc(doc(galleryRef, formData.id), {
          category: formData.category,
          description: formData.description,
          imageUrl: formData.imageUrl,
          updatedAt: new Date().toISOString()
        });
      } else {
        await addDoc(galleryRef, {
          category: formData.category,
          description: formData.description,
          imageUrl: formData.imageUrl,
          createdAt: new Date().toISOString()
        });
      }
      resetForm();
      setShowModal(false);
      await fetchGalleryItems();
    } catch (error) {
      console.error("Error submitting form: ", error);
      setError(`Gagal menyimpan data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      category: item.category,
      description: item.description,
      imageUrl: item.imageUrl
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus item ini?")) {
      setLoading(true);
      try {
        await deleteDoc(doc(galleryRef, id));
        await fetchGalleryItems();
      } catch (error) {
        console.error("Error deleting document: ", error);
        setError(`Gagal menghapus data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      category: 'kajian',
      description: '',
      imageUrl: ''
    });
    setIsEditing(false);
    setError(null);
  };

  const openImageModal = (item) => {
    setSelectedImage(item);
    setShowImageModal(true);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <div className="flex-1 overflow-y-auto container max-w-2xl mx-auto px-4 pt-[70px] pb-20 scrollbar-hide">
        {/* Header */}
        <div className="fixed top-0 left-0 max-w-[710px] mx-auto right-0 bg-white z-50 border-b border-gray-300 py-3">
          <div className="w-full mx-auto px-6 flex justify-between items-center">
            <h3 className="text-black flex items-center gap-2 cursor-pointer" onClick={() => navigate(-1)}>
              <i className="ri-arrow-left-line text-lg"></i> Gallery
            </h3>
            <div className="flex items-center space-x-4">
              <i className="ri-notification-3-line text-lg text-gray-700"></i>
              <i className="ri-user-line text-lg text-gray-700"></i>
            </div>
          </div>
        </div>

        {/* Page Title with Gradient Background */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-6 mb-6 relative overflow-hidden shadow-md">
                    <div className="absolute top-0 right-0 opacity-20">
                        <i className="ri-image-ai-line text-9xl text-white"></i>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Gallery Mahasantri</h1>
                    <p className="text-white text-sm opacity-90">Semua kenangan harus terdokumentasikan</p>
                    {/* <div className="mt-4 bg-white/20 rounded-lg p-3 backdrop-blur-sm"> */}
                    <div className="mt-4 relative w-full max-w-full text-white">
  <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-white text-lg"></i>
  <input
    type="text"
    placeholder="Cari foto..."
    className="w-full pl-10 pr-4 py-3 placeholder:text-white bg-white/20 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
</div>
                    </div>

        {/* Gallery Grid */}
        {loading && !galleryItems.length ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p>Memuat data...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <i className="ri-image-line text-4xl text-gray-300 mb-2"></i>
            <p className="text-gray-500">Tidak ada foto yang ditemukan</p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-2 text-blue-500 hover:text-blue-700 text-sm"
              >
                Reset pencarian
              </button>
            )}
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-3 gap-2 space-y-2 mb-24">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="relative group break-inside-avoid mb-3 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer bg-white"
                onClick={() => openImageModal(item)}
              >
                <div>
                  <img
                    src={item.imageUrl}
                    alt={item.description}
                    className="w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
                    }}
                  />
                </div>
                {item.description && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-white text-xs line-clamp-2">{item.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Floating Add Button */}
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all hover:shadow-xl flex items-center justify-center"
        >
          <i className="ri-image-add-line text-xl"></i>
        </button>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {isEditing ? 'Edit Foto' : 'Tambah Foto Baru'}
                  </h3>
                  <button
                    onClick={() => {
                      resetForm();
                      setShowModal(false);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1">Deskripsi</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-1">URL Gambar</label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/image.jpg"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        setShowModal(false);
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      disabled={loading}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className={`px-4 py-2 text-white rounded-lg ${loading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <i className="ri-loader-4-line animate-spin mr-1"></i> Memproses...
                        </>
                      ) : isEditing ? (
                        'Update'
                      ) : (
                        'Simpan'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Image Detail Modal */}
        {showImageModal && selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Detail Foto</h3>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <div className="flex-1 overflow-auto flex flex-col md:flex-row">
                <div className="md:w-2/3 bg-black flex items-center justify-center p-2">
                  <img
                    src={selectedImage.imageUrl}
                    alt={selectedImage.description}
                    className="max-h-[60vh] w-auto max-w-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                    }}
                  />
                </div>

                <div className="md:w-1/3 p-4 border-t md:border-t-0 md:border-l">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Deskripsi</h4>
                    <p className="text-gray-800">{selectedImage.description || '-'}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Tanggal Upload</h4>
                    <p className="text-gray-800">
                      {new Date(selectedImage.createdAt || selectedImage.updatedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="flex space-x-3 mt-6 pt-4 border-t">
                    <button
                      onClick={() => {
                        setShowImageModal(false);
                        handleEdit(selectedImage);
                      }}
                      className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center"
                    >
                      <i className="ri-edit-line mr-2"></i> Edit
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Apakah Anda yakin ingin menghapus foto ini?")) {
                          handleDelete(selectedImage.id);
                          setShowImageModal(false);
                        }
                      }}
                      className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center"
                    >
                      <i className="ri-delete-bin-line mr-2"></i> Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Gallery;