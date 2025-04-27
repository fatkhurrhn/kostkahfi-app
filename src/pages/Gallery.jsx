import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
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

  // Fetch images from Firestore
  const fetchImages = async () => {
    try {
      let q;
      if (selectedCategory !== 'all') {
        q = query(collection(db, 'gallery_kost'), where('category', '==', selectedCategory), orderBy('uploadDate', 'desc'));
      } else {
        q = query(collection(db, 'gallery_kost'), orderBy('uploadDate', 'desc'));
      }
      
      const querySnapshot = await getDocs(q);
      const imagesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setImages(imagesData);
      setFilteredImages(imagesData);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term === '') {
      setFilteredImages(images);
    } else {
      const filtered = images.filter(image =>
        image.description.toLowerCase().includes(term.toLowerCase()) ||
        image.uploader.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredImages(filtered);
    }
  };

  // Handle category filter
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
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

  // Fetch images on component mount and when category changes
  useEffect(() => {
    fetchImages();
  }, [selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Gallery Kost</h1>
      
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="relative w-full md:w-1/3">
          <i className="ri-search-line absolute left-3 top-3 text-gray-400"></i>
          <input
            type="text"
            placeholder="Search by description or uploader..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => handleCategoryFilter(cat.value)}
              className={`px-4 py-2 rounded-lg ${selectedCategory === cat.value ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Add Image Button */}
      <button
        onClick={openAddForm}
        className="mb-6 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
      >
        <i className="ri-image-add-line"></i> Add New Image
      </button>
      
      {/* Image Grid - Simplified Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredImages.map(image => (
          <div 
            key={image.id} 
            className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer"
            onClick={() => openImageDetail(image)}
          >
            <div className="absolute top-2 left-2 bg-white bg-opacity-80 px-2 py-1 rounded text-sm font-medium">
              {image.category}
            </div>
            <img
  src={image.url}
  alt={image.description}
  className="w-full object-contain"
  onError={(e) => {
    e.target.src = 'https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg';
  }}
/>
          </div>
        ))}
      </div>
      
      {/* Form Popup */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
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
                <label className="block text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Category</label>
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
                <label className="block text-gray-700 mb-2">Uploader Name</label>
                <input
                  type="text"
                  name="uploader"
                  value={formData.uploader}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
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
      
      {/* Image Detail Popup with Actions */}
      {isDetailOpen && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Image Details</h2>
              <button onClick={closeImageDetail} className="text-gray-500 hover:text-gray-700">
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.description}
                  className="w-full h-auto rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
                  }}
                />
              </div>
              
              <div className="md:w-1/2">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <i className="ri-information-line text-blue-500"></i>
                    <h3 className="text-lg font-semibold">Description</h3>
                  </div>
                  <p>{selectedImage.description}</p>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <i className="ri-user-line text-blue-500"></i>
                    <h3 className="text-lg font-semibold">Uploader</h3>
                  </div>
                  <p>{selectedImage.uploader}</p>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <i className="ri-calendar-line text-blue-500"></i>
                    <h3 className="text-lg font-semibold">Upload Date</h3>
                  </div>
                  <p>{formatDate(selectedImage.uploadDate)}</p>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <i className="ri-price-tag-3-line text-blue-500"></i>
                    <h3 className="text-lg font-semibold">Category</h3>
                  </div>
                  <span className="inline-block bg-gray-200 px-3 py-1 rounded-full text-sm">
                    {selectedImage.category}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6 border-t pt-4">
                  <button
                    onClick={() => openEditForm(selectedImage)}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                  >
                    <i className="ri-edit-line"></i> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(selectedImage.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    <i className="ri-delete-bin-line"></i> Deletes
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