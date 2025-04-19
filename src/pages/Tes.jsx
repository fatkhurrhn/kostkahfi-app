return (
    <div className="container h-screen mx-auto px-4 py-8 bg-white">
      <BottomNavbar />
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 pt-8">Daftar Setoran & Murojaah</h1>
      
      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-300 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              value={filter.jenis}
              onChange={(e) => setFilter({...filter, jenis: e.target.value})}
            >
              <option value="">Semua Jenis</option>
              {jenisList.map(jenis => (
                <option key={jenis} value={jenis}>
                  {jenis.charAt(0).toUpperCase() + jenis.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pekan</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              value={filter.pekan}
              onChange={(e) => setFilter({...filter, pekan: e.target.value})}
            >
              <option value="">Semua Pekan</option>
              {pekanList.map(pekan => (
                <option key={pekan} value={pekan}>Pekan {pekan}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              value={filter.bulan}
              onChange={(e) => setFilter({...filter, bulan: e.target.value})}
            >
              <option value="">Semua Bulan</option>
              {bulanList.map(bulan => (
                <option key={bulan} value={bulan}>{bulan}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              value={filter.tahun}
              onChange={(e) => setFilter({...filter, tahun: e.target.value})}
            >
              <option value="">Semua Tahun</option>
              {tahunList.map(tahun => (
                <option key={tahun} value={tahun}>{tahun}</option>
              ))}
            </select>
          </div>
        </div>
      </div>  

      {/* Tabel Setoran */}
      <div className="bg-white rounded-lg shadow-sm mb-10 border border-gray-300 overflow-hidden">
        {filteredData.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Tidak ada data yang ditemukan
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ayat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Halaman/Juz</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...filteredData].reverse().map((setoran) => (
                  <tr key={setoran.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        setoran.jenis === 'setoran' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {setoran.jenis || 'setoran'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{setoran.nama}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {setoran.ayatMulai} - {setoran.ayatSelesai}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{setoran.halaman}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        setoran.metode === 'online' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {setoran.metode}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        Pekan {setoran.pekan}<br />
                        {setoran.bulan} {setoran.tahun}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );