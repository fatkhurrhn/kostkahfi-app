import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '../../../../firebase';
import { Navigate } from 'react-router-dom';

export default function ManagePembayaranUser() {
  const [records, setRecords] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [nominal, setNominal] = useState(500000);
  const [bukti, setBukti] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  const auth = getAuth(app);
  const user = auth.currentUser;

  const fetchData = async () => {
    const db = getFirestore(app);
    const [userSnap, paySnap] = await Promise.all([
      getDocs(collection(db, 'users')),
      getDocs(collection(db, 'pembayaran'))
    ]);
    const u = userSnap.docs.find(d => d.data().uid === user.uid);
    setUserName(u?.data().nama || user.uid);

    const paid = paySnap.docs
      .filter(d => d.data().userId === user.uid)
      .reduce((acc, d) => {
        const { tahun, bulan, status } = d.data();
        acc[`${tahun}-${bulan}`] = status === 'diterima' ? 'lunas' : 'pending';
        return acc;
      }, {});

    // generate 12 bulan terakhir
    const now = new Date();
    const list = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      return {
        tahun: d.getFullYear(),
        bulan: d.getMonth() + 1,
        status: paid[key] || 'belum bayar'
      };
    }).reverse();
    setRecords(list);
    setLoading(false);
  };

  useEffect(() => {
  const auth = getAuth(app);
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserName(user.displayName || user.uid);
      fetchPayments(user.uid);
    } else {
      // redirect ke login jika belum login
      navigate('/login');
    }
  });
  return () => unsubscribe();
}, [Navigate]);

  const handleKonfirmasi = async () => {
    if (!selectedMonths.length || !bukti.trim()) return alert('Pilih bulan & masukkan bukti');
    const db = getFirestore(app);
    for (const m of selectedMonths) {
      await addDoc(collection(db, 'pembayaran'), {
        userId: user.uid,
        tahun: m.tahun,
        bulan: m.bulan,
        nominal,
        buktiUrl: bukti,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    setSelectedMonths([]);
    setBukti('');
    fetchData();
  };

  if (loading) return <SkeletonUser />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Pembayaran Saya</h1>

      {/* Form */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Konfirmasi Pembayaran</h2>
        <p className="text-sm text-gray-600 mb-2">Nama: <b>{userName}</b></p>

        {/* Pilih bulan */}
        <label className="block mb-2 text-sm font-medium">Pilih bulan:</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {records.filter(r => r.status === 'belum bayar').map(r => (
            <label key={`${r.tahun}-${r.bulan}`} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedMonths.some(s => s.tahun === r.tahun && s.bulan === r.bulan)}
                onChange={e => {
                  const val = { tahun: r.tahun, bulan: r.bulan };
                  setSelectedMonths(prev =>
                    e.target.checked ? [...prev, val] : prev.filter(v => v !== val)
                  );
                }}
              />
              <span className="ml-1">{r.tahun}-{String(r.bulan).padStart(2, '0')}</span>
            </label>
          ))}
        </div>

        <input
          type="number"
          value={nominal}
          onChange={e => setNominal(Number(e.target.value))}
          className="border rounded px-3 py-1 w-full mb-2"
          placeholder="Nominal"
        />
        <input
          type="url"
          value={bukti}
          onChange={e => setBukti(e.target.value)}
          className="border rounded px-3 py-1 w-full mb-2"
          placeholder="Link bukti transfer .jpg"
        />
        <button onClick={handleKonfirmasi}
                className="bg-blue-600 text-white px-4 py-2 rounded">
          Kirim Konfirmasi
        </button>
      </div>

      {/* History */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Tahun</th>
              <th className="px-4 py-2">Bulan</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={`${r.tahun}-${r.bulan}`} className="border-t">
                <td className="px-4 py-2">{r.tahun}</td>
                <td className="px-4 py-2">{String(r.bulan).padStart(2, '0')}</td>
                <td className="px-4 py-2 font-semibold">
                  <span className={`${r.status === 'lunas' ? 'text-green-600' :
                    r.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
const SkeletonUser = () => (
  <div className="p-6">
    <div className="h-8 bg-gray-300 rounded mb-4 w-1/2 animate-pulse" />
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-6 bg-gray-200 rounded animate-pulse" />
      ))}
    </div>
  </div>
);