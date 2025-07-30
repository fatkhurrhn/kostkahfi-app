import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { app } from '../../../../firebase';

export default function ManagePembayaranAdmin() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    const db = getFirestore(app);
    const snap = await getDocs(query(collection(db, 'pembayaran'), orderBy('createdAt', 'desc')));
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    setPayments(list);
    setLoading(false);
  };

  useEffect(() => { fetchPayments(); }, []);

  const updateStatus = async (id, status) => {
    const db = getFirestore(app);
    await updateDoc(doc(db, 'pembayaran', id), { status, updatedAt: new Date() });
    fetchPayments();
  };

  // Kelompokkan per user
  const byUser = {};
  payments.forEach(p => {
    if (!byUser[p.userId]) byUser[p.userId] = [];
    byUser[p.userId].push(p);
  });

  if (loading) return <SkeletonTable />;
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Kelola Pembayaran</h1>
      {Object.entries(byUser).map(([uid, list]) => (
        <div key={uid} className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Penghuni: {uid}</h2>
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Tahun</th>
                  <th className="px-4 py-2">Bulan</th>
                  <th className="px-4 py-2">Nominal</th>
                  <th className="px-4 py-2">Bukti</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {list.map(p => (
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-2">{p.tahun}</td>
                    <td className="px-4 py-2">{p.bulan}</td>
                    <td className="px-4 py-2">Rp{p.nominal.toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <a href={p.buktiUrl} target="_blank" rel="noreferrer"
                         className="text-blue-600 underline">Lihat</a>
                    </td>
                    <td className="px-4 py-2 font-semibold">
                      <span className={`${p.status === 'pending' ? 'text-yellow-600' :
                         p.status === 'diterima' ? 'text-green-600' : 'text-red-600'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      {p.status === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(p.id, 'diterima')}
                                  className="bg-green-500 text-white px-3 py-1 rounded text-xs">Terima</button>
                          <button onClick={() => updateStatus(p.id, 'ditolak')}
                                  className="bg-red-500 text-white px-3 py-1 rounded text-xs">Tolak</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
const SkeletonTable = () => (
  <div className="p-6">
    <div className="h-6 bg-gray-300 rounded mb-2 w-1/3 animate-pulse" />
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-8 bg-gray-200 rounded animate-pulse" />
      ))}
    </div>
  </div>
);