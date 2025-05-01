import { useState, useEffect } from 'react';
import { galleryRef } from '../../firebase';
import { addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import BottomNavbar from '../../components/BottomNavbar';

function GalleryControl() {
  const navigate = useNavigate();
  const [galleryItems, setGalleryItems] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    category: 'kajian',
    description: '',
    imageUrl: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const categories = ['kajian', 'diskusi', 'makan-makan', 'bermain'];

  useEffect(() => {
    fetchGalleryItems();
  }, []);

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

  return (
    <div className="h-screen flex flex-col bg-slate-50 max-w-3xl mx-auto">
      <div className="flex-1 overflow-y-auto container px-4 pt-[70px] pb-20 scrollbar-hide">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 bg-white z-50 max-w-3xl mx-auto border-b border-gray-300 py-3">
          <div className="w-full mx-auto px-6 flex justify-between items-center">
            <h3 className="text-black flex items-center gap-2 cursor-pointer" onClick={() => navigate(-1)}>
              <i className="ri-arrow-left-line text-lg"></i>Gallery Control Panel
            </h3>
            <div className="flex items-center space-x-4">
              <i className="ri-notification-3-line text-lg text-gray-700"></i>
              <i className="ri-user-line text-lg text-gray-700"></i>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="mt-16 mb-8 p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            {isEditing ? 'Edit Gallery Item' : 'Add New Gallery Item'}
          </h2>
          {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
                disabled={loading}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
                disabled={loading}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Image URL</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="https://example.com/image.jpg"
                required
                disabled={loading}
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                type="submit"
                className={`px-4 py-2 text-white rounded ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                disabled={loading}
              >
                {loading ? 'Processing...' : (isEditing ? 'Update' : 'Save')}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Gallery Items List */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Gallery Items</h2>
          {loading && !galleryItems.length ? (
            <div className="text-center py-8">Loading data...</div>
          ) : galleryItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No gallery items found.</div>
          ) : (
            <div className="space-y-4">
              {galleryItems.map((item) => (
                <div key={item.id} className="p-4 bg-white rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        {item.category}
                      </span>
                      <p className="mt-2 text-gray-700">{item.description}</p>
                      <div className="mt-2">
                        <img 
                          src={item.imageUrl} 
                          alt={item.description} 
                          className="h-20 object-cover rounded"
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = 'https://via.placeholder.com/150';
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1 text-blue-500 hover:text-blue-700"
                        disabled={loading}
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-red-500 hover:text-red-700"
                        disabled={loading}
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Bottom Navbar */}
      <BottomNavbar />
    </div>
  );
}

export default GalleryControl;