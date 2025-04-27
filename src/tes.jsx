import { useState } from 'react';
// import Head from 'next/head';

export default function ArabicTranslator() {
  const [indonesianText, setIndonesianText] = useState('');
  const [arabicText, setArabicText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [history, setHistory] = useState([]);

  // Contoh data terjemahan (dalam aplikasi nyata, gunakan API)
  const dictionary = {
    'selamat pagi': 'صباح الخير',
    'terima kasih': 'شكرا',
    'tolong': 'من فضلك',
    'maaf': 'آسف',
    'nama': 'اسم',
    'saya': 'أنا',
    'kamu': 'أنت',
    'makan': 'أكل',
    'minum': 'شرب',
    'tidur': 'نوم',
    'kerja': 'عمل',
    'rumah': 'بيت',
    'sekolah': 'مدرسة',
    'kesehatan': 'صحة',
    'cinta': 'حب',
    'bahagia': 'سعادة',
    'sabar': 'صبر',
    'keluarga': 'عائلة'
  };

  const handleTranslate = () => {
    if (!indonesianText.trim()) return;
    
    setIsTranslating(true);
    
    // Simulasi proses terjemahan
    setTimeout(() => {
      const translated = dictionary[indonesianText.toLowerCase()] || 'لم يتم العثور على ترجمة';
      setArabicText(translated);
      
      // Tambahkan ke riwayat
      if (translated !== 'لم يتم العثور على ترجمة') {
        setHistory(prev => [
          { id: Date.now(), indonesian: indonesianText, arabic: translated },
          ...prev.slice(0, 4)
        ]);
      }
      
      setIsTranslating(false);
    }, 800);
  };

  const handleClear = () => {
    setIndonesianText('');
    setArabicText('');
  };

  const handleSpeak = (text, lang) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'ar' ? 'ar-SA' : 'id-ID';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-amber-50 pb-10">
      {/* <Head> */}
        <title>Terjemahan Indonesia-Arab</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* </Head> */}

      <header className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4 shadow-md">
        <h1 className="text-2xl font-bold text-white text-center">مترجم إندونيسي - عربي</h1>
        <p className="text-white text-opacity-90 text-center text-sm mt-1">Terjemahan</p>
      </header>

      <main className="container mx-auto px-4 mt-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <label htmlFor="indonesian" className="block text-sm font-medium text-gray-700 mb-1">
            Teks Indonesia
          </label>
          <div className="relative">
            <textarea
              id="indonesian"
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ketik teks dalam bahasa Indonesia..."
              value={indonesianText}
              onChange={(e) => setIndonesianText(e.target.value)}
            />
            {indonesianText && (
              <button
                onClick={handleClear}
                className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          
          <button
            onClick={handleTranslate}
            disabled={isTranslating || !indonesianText.trim()}
            className={`mt-3 w-full py-3 px-4 rounded-lg font-medium text-white flex items-center justify-center ${isTranslating || !indonesianText.trim() ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isTranslating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Menerjemahkan...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389 21.034 21.034 0 01-.914-1.026 18.994 18.994 0 01-2.825 3.944 1 1 0 01-1.37-1.455 17.015 17.015 0 002.705-3.718 1 1 0 01.23-1.273A16.87 16.87 0 005 6H3a1 1 0 010-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.981.981 0 01.116.241 1 1 0 01-1.819.832L15.383 15h-4.764l-.724 1.447a1 1 0 11-1.788-.894l3-6A1 1 0 0113 8zm-1.382 5h2.764L13 10.236 11.618 13z" clipRule="evenodd" />
                </svg>
                Terjemahkan
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        {arabicText && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Teks Arab</label>
              <button
                onClick={() => handleSpeak(arabicText, 'ar')}
                className="p-1 text-blue-600 hover:text-blue-800"
                title="Dengarkan"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-16 text-right text-2xl font-arabic">
              {arabicText}
            </div>
            <div className="mt-3 flex justify-between">
              <button
                onClick={() => navigator.clipboard.writeText(arabicText)}
                className="py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
                Salin
              </button>
              <button
                onClick={() => handleSpeak(indonesianText, 'id')}
                className="py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                </svg>
                Dengarkan (ID)
              </button>
            </div>
          </div>
        )}

        {/* History Section */}
        {history.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Riwayat Terjemahan</h3>
            <div className="space-y-2">
              {history.map((item) => (
                <div key={item.id} className="p-2 border-b border-gray-100 last:border-0">
                  <div className="text-sm text-gray-600">{item.indonesian}</div>
                  <div className="text-right text-lg font-arabic text-blue-600">{item.arabic}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-8 text-center text-xs text-gray-500">
        <p>Terjemahan Indonesia-Arab © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}