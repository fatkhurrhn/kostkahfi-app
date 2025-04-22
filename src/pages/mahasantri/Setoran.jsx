import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import BottomNavbar from '../../components/BottomNavbar';

// Constants
const BULAN_LIST = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const PEKAN_LIST = [1, 2, 3, 4];
const FALLBACK_AYAH = {
  surahNumber: "1",
  surahName: "Al-Fatihah",
  ayahNumber: "2",
  arabicText: "اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَۙ",
  translation: "Segala puji bagi Allah, Tuhan seluruh alam",
  tafsir: "ini isi tafsir ayat 2"
};

function Setoran() {
  const [time, setTime] = useState(new Date());
  const [randomAyah, setRandomAyah] = useState(null);
  const [showTafsir, setShowTafsir] = useState(false);
  const [setoranList, setSetoranList] = useState([]);
  const [filter, setFilter] = useState({
    jenis: '',
    pekan: '',
    bulan: '',
    tahun: ''
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('semua');
  const navigate = useNavigate();

  // Format time to HH:MM:SS
  const formattedTime = time.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Memoized function to fetch random ayah
  const getRandomAyah = useCallback(async () => {
    try {
      const randomSurah = Math.floor(Math.random() * 114) + 1;
      const response = await fetch(`/surah/${randomSurah}.json`);
      
      if (!response.ok) throw new Error('Failed to fetch surah');
      
      const surahData = await response.json();
      const surah = surahData[randomSurah.toString()];
      const totalAyah = parseInt(surah.number_of_ayah);
      const randomAyahNumber = Math.floor(Math.random() * totalAyah) + 1;
      
      setRandomAyah({
        surahNumber: surah.number,
        surahName: surah.name_latin,
        ayahNumber: randomAyahNumber,
        arabicText: surah.text[randomAyahNumber.toString()],
        translation: surah.translations.id.text[randomAyahNumber.toString()],
        tafsir: surah.tafsir.id.kemenag.text[randomAyahNumber.toString()]
      });
    } catch (error) {
      console.error("Error fetching random ayah:", error);
      setRandomAyah(FALLBACK_AYAH);
    }
  }, []);

  // Fetch setoran data
  const fetchSetoran = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'setoran'));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSetoranList(data);
    } catch (error) {
      console.error("Error fetching setoran:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial data fetch
    getRandomAyah();
    fetchSetoran();

    // Set up intervals
    const timer = setInterval(() => setTime(new Date()), 1000);
    const ayahInterval = setInterval(getRandomAyah, 300000);

    return () => {
      clearInterval(timer);
      clearInterval(ayahInterval);
    };
  }, [getRandomAyah, fetchSetoran]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilter(prev => ({
      ...prev,
      jenis: tab === 'semua' ? '' : tab
    }));
  };

  // Filter data based on filter state
  const filteredData = setoranList.filter(item => {
    return (
      (filter.jenis === '' || item.jenis === filter.jenis) &&
      (filter.pekan === '' || item.pekan === parseInt(filter.pekan)) &&
      (filter.bulan === '' || item.bulan === filter.bulan) &&
      (filter.tahun === '' || item.tahun === parseInt(filter.tahun))
    );
  });

  // Loading state
  if (loading || !randomAyah) {
    return (
      <div className="min-h-screen max-w-3xl mx-auto flex flex-col items-center justify-center bg-blue-50">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-blue-800 font-medium">Memuat Data</p>
            </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 max-w-3xl mx-auto">
      {/* Header */}
      <div className="fixed max-w-3xl mx-auto top-0 left-0 right-0 bg-white z-50 border-b border-gray-300 py-3">
        <div className="w-full mx-auto px-6 flex justify-between items-center">
          <h3 className="text-black flex items-center gap-2 cursor-pointer" onClick={() => navigate(-1)}>
            <i className="ri-arrow-left-line text-lg"></i> Data Setoran
          </h3>
          <div className="flex items-center space-x-4">
            <i className="ri-notification-3-line text-lg text-gray-700"></i>
            <i className="ri-user-line text-lg text-gray-700"></i>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto container mx-auto px-4 pt-[70px] pb-20 scrollbar-hide">
        <BottomNavbar/>
        {/* Page Title with Gradient Background */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-6 mb-6 relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 opacity-20">
            <i className="ri-book-open-line text-9xl text-white"></i>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {new Date().toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </h1>
          <p className="text-white text-sm opacity-90">Capaian hafalan dan murojaah Mahasantri</p>
          <div className="mt-4 bg-white/20 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center text-white">
              <i className="ri-award-line mr-2"></i>
              <div>
                <p className="text-xs">Total Capaian</p>
                <p className="font-medium">{setoranList.length} Aktivitas Tercatat</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ayah Card */}
        <div className="grid grid-cols-1 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">don't forget read this</span>
            <span className="text-sm font-medium text-gray-600">{formattedTime}</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-1xl text-center font-bold text-gray-800 font-amiri">{randomAyah.arabicText}</p>
            <p className="text-sm text-center text-black mt-1">"{randomAyah.translation}"</p>
            <div 
              className="text-[11px] text-center text-gray-600 mt-1 cursor-pointer hover:text-blue-600"
              onClick={() => setShowTafsir(true)}
            >
              [ {randomAyah.surahName} : {randomAyah.ayahNumber} | Tafsir ]
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-4 bg-white rounded-xl p-1 shadow-sm">
          {['semua', 'setoran', 'murojaah'].map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize ${
                activeTab === tab ? 'bg-blue-500 text-white' : 'text-gray-600'
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filter Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-800">Filter Data</h3>
            <button 
              className="text-xs text-blue-600 font-medium flex items-center"
              onClick={() => setFilter({ jenis: '', pekan: '', bulan: '', tahun: '' })}
            >
              <i className="ri-refresh-line mr-1"></i> Reset
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Pekan</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-600 bg-gray-50"
                value={filter.pekan}
                onChange={(e) => setFilter({ ...filter, pekan: e.target.value })}
              >
                <option value="">Semua Pekan</option>
                {PEKAN_LIST.map((pekan) => (
                  <option key={pekan} value={pekan}>Pekan {pekan}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Bulan</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg text-gray-600 text-sm bg-gray-50"
                value={filter.bulan}
                onChange={(e) => setFilter({ ...filter, bulan: e.target.value })}
              >
                <option value="">Semua Bulan</option>
                {BULAN_LIST.map((bulan) => (
                  <option key={bulan} value={bulan}>{bulan}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Data Cards */}
        <div className="space-y-4 mb-10">
          {filteredData.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-file-search-line text-2xl text-gray-400"></i>
              </div>
              <h3 className="text-gray-800 font-medium mb-1">Tidak ada data</h3>
              <p className="text-sm text-gray-500">Tidak ada data yang sesuai dengan filter yang dipilih</p>
            </div>
          ) : (
            [...filteredData].reverse().map((setoran) => (
              <div key={setoran.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${
                    setoran.jenis === 'setoran' ? 'bg-purple-100' : 'bg-yellow-100'
                  }`}>
                    <i className={`${
                      setoran.jenis === 'setoran' ? 'ri-book-marked-line text-purple-600' : 'ri-refresh-line text-yellow-600'
                    } text-xl`}></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-800">{setoran.nama}</h4>
                        <p className="text-sm text-gray-600 mt-1">Surah {setoran.ayatMulai} - {setoran.ayatSelesai} | {setoran.halaman}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        setoran.jenis === 'setoran' ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {setoran.jenis || 'setoran'}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-y-2 gap-x-3 mt-3 text-xs">
                      <div className={`flex items-center px-2 py-1 rounded-full ${
                        setoran.metode === 'online' ? 'bg-blue-100 text-blue-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        <i className={`${
                          setoran.metode === 'online' ? 'ri-global-line' : 'ri-user-voice-line'
                        } mr-1`}></i>
                        <span>{setoran.metode}</span>
                      </div>
                      <div className="flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                        <i className="ri-calendar-line mr-1"></i>
                        <span>Pekan {setoran.pekan}, {setoran.bulan} {setoran.tahun}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Tafsir Popup */}
        {showTafsir && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Tafsir {randomAyah.surahName} : {randomAyah.ayahNumber}
                </h3>
                <button 
                  onClick={() => setShowTafsir(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="text-sm text-gray-700">
                <p className="mb-1 text-[12px] font-bold text-gray-900 text-center text-xl font-amiri">{randomAyah.arabicText}</p>
                <p className="mb-4 text-xs text-purple-600 text-center">"{randomAyah.translation}"</p>
                <div className="text-gray-800">
                  <h4 className="font-semibold mb-2">Tafsir Kemenag:</h4>
                  <p className='text-justify'>{randomAyah.tafsir}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navbar */}
      <BottomNavbar />
    </div>
  );
}

export default Setoran;