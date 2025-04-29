// import { useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';

export default function Home() {
  const { data: kamar, loading } = useFirestore('kamar');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Daftar Kamar Tersedia</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <i className="ri-loader-4-line animate-spin text-2xl text-blue-600"></i>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">No Kamar</th>
                <th className="py-3 px-4 text-left">Tipe</th>
                <th className="py-3 px-4 text-left">Harga</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {kamar.filter(k => k.status === 'tersedia').map(kamar => (
                <tr key={kamar.id} className="hover:bg-blue-50">
                  <td className="py-3 px-4">{kamar.no_kamar}</td>
                  <td className="py-3 px-4 capitalize">{kamar.tipe}</td>
                  <td className="py-3 px-4">Rp {kamar.harga.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${kamar.status === 'tersedia' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {kamar.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <a 
                      href={`/booking?kamar_id=${kamar.id}`}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      Booking <i className="ri-arrow-right-line ml-1"></i>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}