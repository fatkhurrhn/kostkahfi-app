import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default function Pembayaran() {
  const [search, setSearch] = useState('');
  const [penyewa, setPenyewa] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    kamar: '',
    telpon: '',
    bulan: '',
    bukti: ''
  });
  const [allPenyewa, setAllPenyewa] = useState([]);
  const [pembayaran, setPembayaran] = useState([]);
  const [showAlert, setShowAlert] = useState({
    visible: false,
    message: '',
    type: 'info' // 'info', 'success', 'error'
  });
  const [searchError, setSearchError] = useState('');

  // Real-time listeners
  useEffect(() => {
    const unsubscribePenyewa = onSnapshot(collection(db, 'penyewa'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllPenyewa(data);
    });

    const unsubscribePembayaran = onSnapshot(collection(db, 'pembayaran'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPembayaran(data);
    });

    return () => {
      unsubscribePenyewa();
      unsubscribePembayaran();
    };
  }, []);

  const showNotification = (message, type = 'info') => {
    setShowAlert({ visible: true, message, type });
    setTimeout(() => {
      setShowAlert({ ...showAlert, visible: false });
    }, 5000);
  };

  const handleSearch = () => {
    const found = allPenyewa.find(p => p.kamar === search);
    if (found) {
      setPenyewa(found);
      setSearchError('');
    } else {
      setSearchError('Maap, nomor kamar yang kamu cari gaada');
      setPenyewa(null);
    }
  };

  const getUnpaidMonths = () => {
    if (!penyewa) return [];
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const months = [
      "Januari", "Februari", "Maret", "April", 
      "Mei", "Juni", "Juli", "Agustus",
      "September", "Oktober", "November", "Desember"
    ];
    
    return months.slice(0, currentMonth + 1).filter(month => {
      const monthYear = `${month} ${currentYear}`;
      const payment = pembayaran.find(p => 
        p.penyewaId === penyewa.kamar && 
        p.bulan === monthYear && 
        p.status === 'Lunas'
      );
      return !payment;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'konfirmasi_pembayaran'), {
        ...formData,
        status: 'Pending',
        tanggal: new Date()
      });
      showNotification('Konfirmasi pembayaran berhasil dikirim!', 'success');
      setShowForm(false);
      setFormData({
        nama: '',
        kamar: '',
        telpon: '',
        bulan: '',
        bukti: ''
      });
    } catch (error) {
      console.error("Error submitting payment:", error);
      showNotification('Gagal mengirim konfirmasi pembayaran', 'error');
    }
  };

  const unpaidMonths = getUnpaidMonths();
  const isAllPaid = unpaidMonths.length === 0;
  const currentMonthName = new Date().toLocaleString('id-ID', { month: 'long' });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Notification Alert */}
      {showAlert.visible && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
          showAlert.type === 'success' ? 'bg-green-50 text-green-800' : 
          showAlert.type === 'error' ? 'bg-red-50 text-red-800' : 
          'bg-blue-50 text-blue-800'
        }`}>
          <div className="flex items-center">
            {showAlert.type === 'success' ? (
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : showAlert.type === 'error' ? (
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span>{showAlert.message}</span>
            <button 
              onClick={() => setShowAlert({ ...showAlert, visible: false })}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Cek Status Pembayaran</h2>
          <p className="mt-2 text-sm text-gray-600">Masukkan nomor kamar untuk melihat status pembayaran</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Masukkan No Kamar"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSearchError('');
              }}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button 
              onClick={handleSearch}
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cari
            </button>
          </div>
          {searchError && (
            <div className="mt-2 text-sm text-red-600">
              {searchError}
            </div>
          )}
        </div>

        {penyewa && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Informasi Penyewa</h3>
            <div className="space-y-2">
              <p className="text-gray-700"><span className="font-medium">Nama:</span> {penyewa.nama}</p>
              <p className="text-gray-700"><span className="font-medium">No Kamar:</span> {penyewa.kamar}</p>
              <p className="text-gray-700"><span className="font-medium">No Telpon:</span> {penyewa.telpon}</p>
            </div>
            
            {isAllPaid ? (
              <div className="mt-6 p-4 bg-green-50 rounded-md">
                <p className="text-green-800 font-medium flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Selamat, sampai bulan {currentMonthName} kamu sudah melunasi semua pembayaran.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-2">Bulan yang belum dibayar:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {unpaidMonths.map(month => (
                      <li key={month} className="text-gray-700">{month}</li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setFormData({
                      ...formData,
                      nama: penyewa.nama,
                      kamar: penyewa.kamar,
                      telpon: penyewa.telpon,
                      bulan: unpaidMonths.join(', ')
                    });
                    setShowForm(true);
                  }}
                  className="mt-6 px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Konfirmasi Pembayaran
                </button>
              </>
            )}
          </div>
        )}

        {/* Popup Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Form Konfirmasi Pembayaran</h3>
                  <button 
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama:</label>
                    <input
                      value={formData.nama}
                      onChange={(e) => setFormData({...formData, nama: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No Kamar:</label>
                    <input
                      value={formData.kamar}
                      onChange={(e) => setFormData({...formData, kamar: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No Telpon:</label>
                    <input
                      value={formData.telpon}
                      onChange={(e) => setFormData({...formData, telpon: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bayar Untuk Bulan:</label>
                    <input
                      value={formData.bulan}
                      onChange={(e) => setFormData({...formData, bulan: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Bukti Pembayaran:</label>
                    <input
                      value={formData.bukti}
                      onChange={(e) => setFormData({...formData, bukti: e.target.value})}
                      required
                      placeholder="Contoh: https://example.com/bukti.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <p className='text-[12px]'>klik <a href="https://assets-gallery.vercel.app/" target='_blank'><u><b>disini</b></u></a> untuk ubah foto jadi url</p>
                  </div>

                  {/* Payment Info in Form */}
                  <div className="p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">Transfer ke:</span> EMILIANA FEBRIYANTI<br />
                      <span className="font-medium">Bank Mandiri:</span> 1290 007 5321 6<br />
                      <span className="text-xs">Atau bayar langsung ke Mbak Nurul</span>
                    </p>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Kirim
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}