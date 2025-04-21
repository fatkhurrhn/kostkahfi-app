import BottomNavbar from '../components/BottomNavbar';
import { useEffect, useState } from 'react';

function RealtimeAyah() {
  const [time, setTime] = useState(new Date());
  const [randomAyah, setRandomAyah] = useState(null);
  const [showTafsir, setShowTafsir] = useState(false);

  const getRandomAyah = async () => {
    try {
      // Random surah antara 1-114
      const randomSurah = Math.floor(Math.random() * 114) + 1;
      const response = await fetch(`/surah/${randomSurah}.json`);
      const surahData = await response.json();
      
      // Ambil data surah
      const surah = surahData[randomSurah.toString()];
      const totalAyah = parseInt(surah.number_of_ayah);
      
      // Random ayat antara 1-totalAyah
      const randomAyahNumber = Math.floor(Math.random() * totalAyah) + 1;
      
      // Format data ayah
      const ayahData = {
        surahNumber: surah.number,
        surahName: surah.name_latin,
        ayahNumber: randomAyahNumber,
        arabicText: surah.text[randomAyahNumber.toString()],
        translation: surah.translations.id.text[randomAyahNumber.toString()],
        tafsir: surah.tafsir.id.kemenag.text[randomAyahNumber.toString()] // Ambil tafsir sesuai nomor ayat
      };
      
      setRandomAyah(ayahData);
    } catch (error) {
      console.error("Error fetching random ayah:", error);
      // Fallback jika terjadi error
      setRandomAyah({
        surahNumber: "1",
        surahName: "Al-Fatihah",
        ayahNumber: "2",
        arabicText: "اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَۙ",
        translation: "Segala puji bagi Allah, Tuhan seluruh alam",
        tafsir: "ini isi tafris ayat 2" // Tafsir fallback untuk ayat 2 Al-Fatihah
      });
    }
  };

  useEffect(() => {
    getRandomAyah();
    
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    const ayahInterval = setInterval(() => {
      getRandomAyah();
    }, 300000);

    return () => {
      clearInterval(timer);
      clearInterval(ayahInterval);
    };
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const formattedTime = `${hours}:${minutes}:${seconds}`;

  if (!randomAyah) {
    return (
      <div className="h-screen flex flex-col bg-white">
        <div className="flex-1 overflow-y-auto container mx-auto px-4 pt-[70px] pb-20 flex items-center justify-center">
          <p className="text-gray-600">Memuat ayat...</p>
        </div>
        <BottomNavbar />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto container mx-auto px-4 pt-[70px] pb-20">
        <div className="grid grid-cols-1 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">don't forget read this</span>
            <span className="text-sm font-medium text-gray-600">{formattedTime}</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-1xl text-center font-bold text-gray-800 font-amiri">{randomAyah.arabicText}</p>
            <p className="text-xs text-center text-purple-600 mt-1">"{randomAyah.translation}"</p>
            <div 
              className="text-[10px] text-center text-gray-600 mt-1 cursor-pointer hover:text-blue-600"
              onClick={() => setShowTafsir(true)}
            >
              {randomAyah.surahName} : {randomAyah.ayahNumber} | Tafsir
            </div>
          </div>
        </div>
      </div>

      <BottomNavbar />

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
  );
}

export default RealtimeAyah;