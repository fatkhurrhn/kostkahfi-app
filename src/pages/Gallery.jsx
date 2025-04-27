import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase'; // Updated import path
import { Timestamp } from 'firebase/firestore';

const Gallery = () => {
  // State management
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    url: '',
    description: '',
    category: 'umum',
    uploader: '',
    uploadDate: ''
  });

  // Categories
  const categories = [
    { value: 'all', label: 'All' },
    { value: 'umum', label: 'Umum' },
    { value: 'cavelatte', label: 'Cavelatte' },
    { value: 'biman', label: 'Biman' },
    { value: 'mahasantri', label: 'Mahasantri' },
    { value: 'kostan', label: 'Kostan' }
  ];

  // Format date from Firestore Timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return 'No date';
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return new Date(timestamp).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fetch images from Firestore - Fixed category filter
  const fetchImages = async () => {
    try {
      // First, get all images
      const baseQuery = query(collection(db, 'gallery_kost'), orderBy('uploadDate', 'desc'));
      const querySnapshot = await getDocs(baseQuery);
      
      const imagesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setImages(imagesData);
      
      // Then filter based on selected category
      if (selectedCategory === 'all') {
        setFilteredImages(imagesData);
      } else {
        const filtered = imagesData.filter(img => img.category === selectedCategory);
        setFilteredImages(filtered);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term === '') {
      // If search is cleared, respect the category filter
      if (selectedCategory === 'all') {
        setFilteredImages(images);
      } else {
        setFilteredImages(images.filter(img => img.category === selectedCategory));
      }
    } else {
      // Apply search filter along with category filter if needed
      let filtered = images;
      
      // Apply category filter first if not "all"
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(img => img.category === selectedCategory);
      }
      
      // Then apply search term filter
      filtered = filtered.filter(image =>
        image.description.toLowerCase().includes(term.toLowerCase()) ||
        image.uploader.toLowerCase().includes(term.toLowerCase())
      );
      
      setFilteredImages(filtered);
    }
  };

  // Handle category filter - Fixed to properly filter
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    
    // Apply filtering immediately
    if (category === 'all') {
      // If "all" is selected, just apply any existing search filter
      if (searchTerm) {
        const filtered = images.filter(image =>
          image.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          image.uploader.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredImages(filtered);
      } else {
        setFilteredImages(images);
      }
    } else {
      // Filter by category and then by search term if it exists
      let filtered = images.filter(img => img.category === category);
      
      if (searchTerm) {
        filtered = filtered.filter(image =>
          image.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          image.uploader.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setFilteredImages(filtered);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: '',
      url: '',
      description: '',
      category: 'umum',
      uploader: '',
      uploadDate: ''
    });
  };

  // Open form for adding new image
  const openAddForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  // Open form for editing image
  const openEditForm = (image) => {
    setFormData({
      id: image.id,
      url: image.url,
      description: image.description,
      category: image.category,
      uploader: image.uploader,
      uploadDate: image.uploadDate
    });
    setIsFormOpen(true);
    setIsDetailOpen(false);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit form (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        // Update existing document
        const docRef = doc(db, 'gallery_kost', formData.id);
        await updateDoc(docRef, {
          url: formData.url,
          description: formData.description,
          category: formData.category,
          uploader: formData.uploader,
          uploadDate: formData.uploadDate || Timestamp.fromDate(new Date())
        });
      } else {
        // Add new document
        await addDoc(collection(db, 'gallery_kost'), {
          url: formData.url,
          description: formData.description,
          category: formData.category,
          uploader: formData.uploader,
          uploadDate: Timestamp.fromDate(new Date())
        });
      }
      setIsFormOpen(false);
      fetchImages();
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  // Delete image
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteDoc(doc(db, 'gallery_kost', id));
        setIsDetailOpen(false);
        fetchImages();
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  };

  // Open image detail
  const openImageDetail = (image) => {
    setSelectedImage(image);
    setIsDetailOpen(true);
  };

  // Close image detail
  const closeImageDetail = () => {
    setIsDetailOpen(false);
    setSelectedImage(null);
  };

  // Fetch images on component mount and when needed
  useEffect(() => {
    fetchImages();
  }, []); // Only on mount, since we handle category changes separately now

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Gallery Kost</h1>
      
      {/* Search Box - Mobile Optimized */}
      <div className="mb-4">
        <div className="relative w-full">
          <i className="ri-search-line absolute left-3 top-3 text-gray-400"></i>
          <input
            type="text"
            placeholder="Search by description or uploader..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>
      
      {/* Categories - Scrollable on Mobile */}
      <div className="mb-6 overflow-x-auto pb-2">
        <div className="flex gap-2 min-w-max">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => handleCategoryFilter(cat.value)}
              className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition ${
                selectedCategory === cat.value 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Add Image Button */}
      <button
        onClick={openAddForm}
        className="mb-6 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition mx-auto"
      >
        <i className="ri-image-add-line"></i> Add New Image
      </button>
      
      <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-5 gap-2 space-y-2">
  {filteredImages.map(image => (
    <div 
      key={image.id}
      className="break-inside-avoid w-full max-w-[250px] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer bg-white"
      onClick={() => openImageDetail(image)}
    >
      <div className="relative">
        <div className="absolute top-2 left-2 bg-white bg-opacity-80 px-2 py-1 rounded text-xs md:text-sm font-medium z-10">
          {image.category}
        </div>
        <img
          src={image.url}
          alt={image.description}
          className="w-full object-cover"
          onError={(e) => {
            e.target.src = 'https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg';
          }}
        />
      </div>
      <div className="p-2 bg-white">
        <p className="text-xs md:text-sm line-clamp-1 text-gray-700">{image.description}</p>
      </div>
    </div>
  ))}
</div>

      {/* Empty state when no images match filters */}
      {filteredImages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <i className="ri-image-line text-6xl text-gray-300 mb-4"></i>
          <p className="text-gray-500 mb-2">No images found</p>
          <p className="text-gray-400 text-sm">Try changing your search or category filter</p>
        </div>
      )}
      
      {/* Form Popup - Mobile Optimized */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {formData.id ? 'Edit Image' : 'Add New Image'}
              </h2>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-500 hover:text-gray-700">
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 text-sm font-medium">Image URL</label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                  placeholder="Describe this image..."
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 text-sm font-medium">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {categories.filter(c => c.value !== 'all').map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 text-sm font-medium">Uploader Name</label>
                <input
                  type="text"
                  name="uploader"
                  value={formData.uploader}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Your name"
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  {formData.id ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Image Detail Popup - Mobile Optimized */}
      {isDetailOpen && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white rounded-lg p-4 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-bold">Image Details</h2>
              <button onClick={closeImageDetail} className="text-gray-500 hover:text-gray-700">
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <div className="md:w-1/2">
                <div className="bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.description}
                    className="w-full h-auto object-contain max-h-[50vh]"
                    onError={(e) => {
                      e.target.src = 'https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg';
                    }}
                  />
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="mb-3 md:mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <i className="ri-information-line text-blue-500"></i>
                    <h3 className="text-base md:text-lg font-semibold">Description</h3>
                  </div>
                  <p className="text-sm md:text-base">{selectedImage.description}</p>
                </div>
                
                <div className="mb-3 md:mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <i className="ri-user-line text-blue-500"></i>
                    <h3 className="text-base md:text-lg font-semibold">Uploader</h3>
                  </div>
                  <p className="text-sm md:text-base">{selectedImage.uploader}</p>
                </div>
                
                <div className="mb-3 md:mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <i className="ri-calendar-line text-blue-500"></i>
                    <h3 className="text-base md:text-lg font-semibold">Upload Date</h3>
                  </div>
                  <p className="text-sm md:text-base">{formatDate(selectedImage.uploadDate)}</p>
                </div>
                
                <div className="mb-4 md:mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <i className="ri-price-tag-3-line text-blue-500"></i>
                    <h3 className="text-base md:text-lg font-semibold">Category</h3>
                  </div>
                  <span className="inline-block bg-gray-200 px-3 py-1 rounded-full text-xs md:text-sm">
                    {selectedImage.category}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4 pt-3 border-t">
                  <button
                    onClick={() => openEditForm(selectedImage)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition flex-1"
                  >
                    <i className="ri-edit-line"></i> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(selectedImage.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex-1"
                  >
                    <i className="ri-delete-bin-line"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;