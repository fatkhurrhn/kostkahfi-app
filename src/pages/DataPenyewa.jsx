import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export default function DataPenyewa() {
  const [penyewa, setPenyewa] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchPenyewa = async () => {
      try {
        const q = query(collection(db, 'data_penyewa_kost'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPenyewa(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPenyewa();
  }, []);

  const filteredPenyewa = penyewa.filter(item => {
    const matchesSearch = item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.kamarNo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || item.kategori === filter;
    return matchesSearch && matchesFilter;
  });

  const getCategoryStyle = (kategori) => {
    switch(kategori) {
      case 'mahasantri': 
        return { 
          bg: 'bg-blue-100', 
          text: 'text-blue-800',
          icon: 'ri-graduation-cap-line'
        };
      case 'biman': 
        return { 
          bg: 'bg-green-100', 
          text: 'text-green-800',
          icon: 'ri-briefcase-line'
        };
      default: 
        return { 
          bg: 'bg-purple-100', 
          text: 'text-purple-800',
          icon: 'ri-home-4-line'
        };
    }
  };

  const getGenderIcon = (gender) => {
    return gender === 'Perempuan' ? 'ri-women-line text-pink-500' : 'ri-men-line text-blue-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Data Penyewa Kost</h1>
          <p className="mt-2 text-gray-600">Daftar penyewa yang tinggal di kost ini</p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white shadow rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="ri-search-line text-gray-400"></i>
              </div>
              <input
                type="text"
                placeholder="Cari nama atau no kamar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setFilter('all')} 
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                <i className="ri-list-check"></i> Semua
              </button>
              <button 
                onClick={() => setFilter('kost_biasa')} 
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filter === 'kost_biasa' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                <i className="ri-home-4-line"></i> Kost Biasa
              </button>
              <button 
                onClick={() => setFilter('mahasantri')} 
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filter === 'mahasantri' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                <i className="ri-graduation-cap-line"></i> Mahasantri
              </button>
              <button 
                onClick={() => setFilter('biman')} 
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filter === 'biman' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                <i className="ri-briefcase-line"></i> BIMAN
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredPenyewa.length === 0 && (
          <div className="bg-white shadow rounded-xl p-8 text-center">
            <i className="ri-emotion-sad-line text-4xl text-gray-400 mx-auto"></i>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Tidak ada data</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Hasil pencarian tidak ditemukan' : 'Belum ada data penyewa'}
            </p>
          </div>
        )}

        {/* Card Grid */}
        {!isLoading && filteredPenyewa.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPenyewa.map(item => {
              const categoryStyle = getCategoryStyle(item.kategori);
              return (
                <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* Header with Category */}
                  <div className={`${categoryStyle.bg} px-4 py-2 flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <i className={`${categoryStyle.icon} ${categoryStyle.text}`}></i>
                      <span className={`text-sm font-medium ${categoryStyle.text}`}>
                        {item.kategori === 'kost_biasa' ? 'Kost Biasa' : 
                         item.kategori === 'mahasantri' ? 'Mahasantri' : 'BIMAN'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <i className={`${getGenderIcon(item.jenis_kelamin)} text-lg`}></i>
                      <span className="text-xs text-gray-600">{item.kamarNo}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Photo and Basic Info */}
                    <div className="flex gap-4 items-start">
                      <div className="flex-shrink-0">
                        {item.foto ? (
                          <img 
                            src={item.foto} 
                            alt={item.nama} 
                            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white shadow">
                            <i className="ri-user-3-line text-gray-500 text-xl"></i>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{item.nama}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          <i className="ri-map-pin-line text-gray-500 mr-1"></i>
                          {item.asal || '-'}
                        </p>
                        <p className="text-sm text-gray-600">
                          <i className="ri-calendar-line text-gray-500 mr-1"></i>
                          Sejak {item.sejak || '-'}
                        </p>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      {item.tipe === 'kuliah' ? (
                        <div className="flex items-center text-sm text-gray-700">
                          <i className="ri-building-2-line text-gray-500 mr-2"></i>
                          <span>{item.kampus || 'Belum diisi'}</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-sm text-gray-700">
                          <i className="ri-community-line text-gray-500 mr-2"></i>
                          <span>{item.perusahaan || 'Belum diisi'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RemixIcon CDN */}
      <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet" />
    </div>
  );
}