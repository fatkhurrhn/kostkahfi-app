import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, query, where, onSnapshot, serverTimestamp, orderBy } from 'firebase/firestore';
import { app } from '../../../../firebase';
import Layout from '../../../components/users/Layout';

// Harga per bulan berdasarkan tipe user
const HARGA_PER_BULAN = {
  reguler: 750000,
  mahasantri: 350000,
  biman: 0
};

const SkeletonUser = () => (
  <div className="p-6 space-y-4 animate-pulse">
    <div className="h-8 bg-gray-200 rounded-full w-1/2" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 bg-gray-100 rounded-lg" />
      ))}
    </div>
  </div>
);

const SuccessModal = ({ onClose, message }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
      <div className="flex justify-center text-green-500 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">Sukses!</h3>
      <p className="text-gray-600 text-center mb-6">{message}</p>
      <button
        onClick={onClose}
        className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
      >
        Tutup
      </button>
    </div>
  </div>
);

const KonfirmasiTab = React.memo(({
  records,
  selectedMonths,
  setSelectedMonths,
  nominal,
  bukti,
  setBukti,
  handleKonfirmasi,
  userType,
  hargaPerBulan
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async () => {
    try {
      await handleKonfirmasi();
      setShowConfirmModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-gray-100">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Konfirmasi Pembayaran</h2>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-2 border border-gray-200">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Tipe User:</span> <span className="capitalize">{userType}</span>
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Harga per Bulan:</span> {hargaPerBulan === 0 ? 'Gratis' : `Rp ${hargaPerBulan.toLocaleString('id-ID')}`}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Bulan yang Akan Dibayar:
              {selectedMonths.length > 0 && (
                <span className="ml-2 text-gray-600">({selectedMonths.length} bulan dipilih)</span>
              )}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {records.filter(r => r.status === 'belum bayar').map(r => (
                <div
                  key={`${r.tahun}-${r.bulan}`}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedMonths.some(m => m.tahun === r.tahun && m.bulan === r.bulan)
                      ? 'border-gray-500 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setSelectedMonths(prev =>
                      prev.some(m => m.tahun === r.tahun && m.bulan === r.bulan)
                        ? prev.filter(m => !(m.tahun === r.tahun && m.bulan === r.bulan))
                        : [...prev, r]
                    );
                  }}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedMonths.some(m => m.tahun === r.tahun && m.bulan === r.bulan)}
                      onChange={() => {}}
                      className="mr-2 h-4 w-4 text-gray-600 rounded focus:ring-gray-500"
                    />
                    <span className="text-sm font-medium">{r.namaBulan} {r.tahun}</span>
                  </div>
                </div>
              ))}
            </div>
            {records.filter(r => r.status === 'belum bayar').length === 0 && (
              <p className="text-gray-500 text-sm mt-2">Tidak ada bulan yang perlu dibayar</p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Nominal Pembayaran</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
                <input
                  type="text"
                  value={nominal.toLocaleString('id-ID')}
                  readOnly
                  className="pl-10 border border-gray-300 rounded-lg px-4 py-2 w-full bg-gray-50 text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500"
                />
              </div>
              {hargaPerBulan === 0 && (
                <p className="mt-1 text-xs text-green-600">Gratis untuk user tipe Biman</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link Bukti Transfer</label>
              <input
                type="url"
                value={bukti}
                onChange={e => setBukti(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                placeholder="https://contoh.com/bukti-transfer.jpg"
                disabled={hargaPerBulan === 0}
              />
              <p className="mt-1 text-xs text-gray-500">
                {hargaPerBulan === 0
                  ? 'Tidak perlu bukti transfer untuk user gratis'
                  : 'Upload bukti transfer ke Google Drive/Dropbox lalu masukkan link-nya'
                }
              </p>
            </div>

            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={!selectedMonths.length || (hargaPerBulan > 0 && !bukti)}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                !selectedMonths.length || (hargaPerBulan > 0 && !bukti)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 hover:bg-gray-700'
              } transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}
            >
              {hargaPerBulan === 0 ? 'Konfirmasi Pendaftaran' : 'Kirim Konfirmasi Pembayaran'}
            </button>
          </div>
        </div>
      </div>

      {/* Konfirmasi Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Konfirmasi Pembayaran</h3>
            <p className="text-gray-600 mb-6">
              Anda akan mengkonfirmasi pembayaran untuk {selectedMonths.length} bulan dengan total:
              <span className="block text-2xl font-bold text-gray-600 mt-2">Rp {nominal.toLocaleString('id-ID')}</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal 
          onClose={() => setShowSuccessModal(false)}
          message="Konfirmasi pembayaran berhasil dikirim!"
        />
      )}
    </>
  );
});

const RiwayatTab = React.memo(({ records }) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bulan/Tahun</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {records.map(r => (
            <tr key={`${r.tahun}-${r.bulan}`} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{r.namaBulan} {r.tahun}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  r.status === 'lunas' ? 'bg-green-100 text-green-800' :
                  r.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {r.status === 'lunas' ? 'LUNAS' : 
                   r.status === 'pending' ? 'MENUNGGU VERIFIKASI' : 
                   'BELUM DIBAYAR'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
));

export default function ManagePembayaranUser() {
  const [records, setRecords] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [nominal, setNominal] = useState(0);
  const [bukti, setBukti] = useState('');
  const [userName, setUserName] = useState('');
  const [userType, setUserType] = useState('reguler');
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState(null);
  const [activeTab, setActiveTab] = useState('konfirmasi');
  const [tglMasuk] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchUserData = useCallback(async (currentUid) => {
    const db = getFirestore(app);

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('userId', '==', currentUid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        if (userData.tipeUser) setUserType(userData.tipeUser);
      }

      return setupPaymentListener(currentUid);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Gagal memuat data pengguna');
      return () => {};
    }
  }, []);

  const setupPaymentListener = useCallback((userId) => {
    const db = getFirestore(app);
    const paymentQuery = query(
      collection(db, 'pembayaran'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(paymentQuery, (snapshot) => {
      const paidMonths = {};
      snapshot.forEach(doc => {
        const data = doc.data();
        const key = `${data.tahun}-${data.bulan}`;
        if (!paidMonths[key] || data.status === 'lunas') {
          paidMonths[key] = data.status === 'lunas' ? 'lunas' : 'pending';
        }
      });
      generateMonthRecords(paidMonths);
    }, (error) => {
      console.error('Payment listener error:', error);
      setError('Gagal memuat data pembayaran');
    });

    return unsubscribe;
  }, []);

  const generateMonthRecords = useCallback((paidMonths = {}) => {
    const startDate = new Date(2025, 0, 1);
    const endDate = new Date(2026, 11, 31);
    let currentDate = new Date(startDate);
    const list = [];

    while (currentDate <= endDate) {
      const tahun = currentDate.getFullYear();
      const bulan = currentDate.getMonth() + 1;

      list.push({
        tahun,
        bulan,
        namaBulan: currentDate.toLocaleDateString('id-ID', { month: 'long' }),
        status: paidMonths[`${tahun}-${bulan}`] || 'belum bayar'
      });

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    setRecords(list);
  }, []);

  const handleKonfirmasi = useCallback(async () => {
    if (!selectedMonths.length || !bukti.trim()) {
      return;
    }

    try {
      const db = getFirestore(app);
      const batch = selectedMonths.map(m =>
        addDoc(collection(db, 'pembayaran'), {
          userId: uid,
          tahun: m.tahun,
          bulan: m.bulan,
          nominal,
          buktiUrl: bukti,
          status: 'pending',
          userType: userType,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      );

      await Promise.all(batch);
      setSelectedMonths([]);
      setBukti('');
      return true;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }, [selectedMonths, nominal, bukti, uid, userType]);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }
      setUid(user.uid);
      setUserName(user.displayName || user.email || user.uid);
      try {
        await fetchUserData(user.uid);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Gagal memuat data pengguna');
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, [navigate, fetchUserData]);

  useEffect(() => {
    if (tglMasuk) setupPaymentListener(uid);
  }, [tglMasuk, uid, setupPaymentListener]);

  useEffect(() => {
    const hargaPerBulan = HARGA_PER_BULAN[userType] || 0;
    const totalNominal = selectedMonths.length * hargaPerBulan;
    setNominal(totalNominal);
  }, [selectedMonths, userType]);

  if (error) {
    return (
      <Layout>
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 max-w-md mx-auto mt-10">
          <div className="text-red-600 font-medium mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Error
          </div>
          <p className="mb-4 text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <SkeletonUser />
      </Layout>
    );
  }

  return (
    <Layout>
        <div className="max-w-full mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">Pembayaran Kost</h1>
              <div className="flex gap-2">
                <div className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full capitalize">
                  {userType}
                </div>
                <div className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                  {userName}
                </div>
              </div>
            </div>

            <div className="flex border-b border-gray-200 mt-6">
              <button
                onClick={() => setActiveTab('konfirmasi')}
                className={`px-4 py-2 font-medium relative ${
                  activeTab === 'konfirmasi' 
                    ? 'text-gray-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gray-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Konfirmasi Pembayaran
              </button>
              <button
                onClick={() => setActiveTab('riwayat')}
                className={`px-4 py-2 font-medium relative ${
                  activeTab === 'riwayat' 
                    ? 'text-gray-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gray-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Riwayat Pembayaran
              </button>
            </div>
          </div>

          {activeTab === 'konfirmasi' ? (
            <KonfirmasiTab
              records={records}
              selectedMonths={selectedMonths}
              setSelectedMonths={setSelectedMonths}
              nominal={nominal}
              bukti={bukti}
              setBukti={setBukti}
              handleKonfirmasi={handleKonfirmasi}
              userType={userType}
              hargaPerBulan={HARGA_PER_BULAN[userType]}
            />
          ) : (
            <RiwayatTab records={records} />
          )}
        </div>
    </Layout>
  );
}