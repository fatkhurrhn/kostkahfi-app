import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from './firebase';

const Setoran = () => {
  const [setoranList, setSetoranList] = useState([]);
  const [filter, setFilter] = useState({
    pekan: 1,
    bulan: new Date().toLocaleString('id-ID', { month: 'long' }),
    tahun: new Date().getFullYear()
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSetoran = async () => {
      try {
        setLoading(true);
        const q = query(
          collection("setoran"),
          where("pekan", "==", filter.pekan),
          where("bulan", "==", filter.bulan),
          where("tahun", "==", filter.tahun)
        );
        
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setSetoranList(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };

    fetchSetoran();
  }, [filter]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Data Setoran</h1>
      
      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Pekan</label>
            <select 
              value={filter.pekan}
              onChange={(e) => setFilter({...filter, pekan: parseInt(e.target.value)})}
              className="w-full p-2 border rounded"
            >
              {[1, 2, 3, 4].map(num => (
                <option key={num} value={num}>Pekan {num}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Bulan</label>
            <select 
              value={filter.bulan}
              onChange={(e) => setFilter({...filter, bulan: e.target.value})}
              className="w-full p-2 border rounded"
            >
              {["Januari", "Februari", "Maret", "April", "Mei", "Juni", 
                "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
                .map(bulan => (
                  <option key={bulan} value={bulan}>{bulan}</option>
                ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Tahun</label>
            <select 
              value={filter.tahun}
              onChange={(e) => setFilter({...filter, tahun: parseInt(e.target.value)})}
              className="w-full p-2 border rounded"
            >
              {[2023, 2024, 2025].map(tahun => (
                <option key={tahun} value={tahun}>{tahun}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button 
              onClick={() => setFilter({
                pekan: 1,
                bulan: new Date().toLocaleString('id-ID', { month: 'long' }),
                tahun: new Date().getFullYear()
              })}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
            >
              <i class="ri-refresh-line mr-1"></i> Reset
            </button>
          </div>
        </div>
      </div>
      
      {/* Tabel Setoran */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">No</th>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">Ayat</th>
              <th className="p-3 text-left">Halaman/Juz</th>
              <th className="p-3 text-left">Metode</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                </td>
              </tr>
            ) : setoranList.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  Tidak ada data setoran
                </td>
              </tr>
            ) : (
              setoranList.map((setoran, index) => (
                <tr key={setoran.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{setoran.nama}</td>
                  <td className="p-3">{setoran.ayatMulai} - {setoran.ayatSelesai}</td>
                  <td className="p-3">{setoran.halaman}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      setoran.metode === 'online' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {setoran.metode}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Setoran;