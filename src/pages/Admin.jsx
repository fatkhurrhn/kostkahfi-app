// ... (import dan kode awal sama seperti sebelumnya)

const Admin = () => {
    // State untuk data setoran
    const [setoranList, setSetoranList] = useState([]);
    const [formData, setFormData] = useState({
      pekan: 1,
      bulan: new Date().toLocaleString('id-ID', { month: 'long' }),
      tahun: new Date().getFullYear(),
      nama: '',
      ayatMulai: '',
      ayatSelesai: '',
      halaman: '',
      metode: 'online'
    });
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
  
    // Fetch data setoran
    const fetchSetoran = async () => {
      const querySnapshot = await getDocs(collection(db, "setoran"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSetoranList(data);
    };
  
    // Handle form submit
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      try {
        const now = new Date();
        const setoranData = {
          ...formData,
          createdAt: now,
          updatedAt: now
        };
  
        if (isEditing) {
          await updateDoc(doc(db, "setoran", currentId), setoranData);
        } else {
          await addDoc(collection(db, "setoran"), setoranData);
        }
  
        resetForm();
        fetchSetoran();
      } catch (error) {
        console.error("Error saving data: ", error);
      }
    };
  
    // Edit data
    const handleEdit = (setoran) => {
      setFormData({
        pekan: setoran.pekan,
        bulan: setoran.bulan,
        tahun: setoran.tahun,
        nama: setoran.nama,
        ayatMulai: setoran.ayatMulai,
        ayatSelesai: setoran.ayatSelesai,
        halaman: setoran.halaman,
        metode: setoran.metode
      });
      setIsEditing(true);
      setCurrentId(setoran.id);
    };
  
    // Delete data
    const handleDelete = async (id) => {
      if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
        await deleteDoc(doc(db, "setoran", id));
        fetchSetoran();
      }
    };
  
    // Reset form
    const resetForm = () => {
      setFormData({
        pekan: 1,
        bulan: new Date().toLocaleString('id-ID', { month: 'long' }),
        tahun: new Date().getFullYear(),
        nama: '',
        ayatMulai: '',
        ayatSelesai: '',
        halaman: '',
        metode: 'online'
      });
      setIsEditing(false);
      setCurrentId(null);
    };
  
    // ... (kode login/logout tetap sama)
  
    return (
      <div className="container mx-auto px-4 py-8">
        {/* ... (kode header dan login/logout sama) */}
  
        {/* Form Setoran */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">
            {isEditing ? 'Edit Setoran' : 'Tambah Setoran Baru'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Pekan</label>
                <select
                  value={formData.pekan}
                  onChange={(e) => setFormData({...formData, pekan: parseInt(e.target.value)})}
                  className="w-full p-2 border rounded"
                  required
                >
                  {[1, 2, 3, 4].map(num => (
                    <option key={num} value={num}>Pekan {num}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Bulan</label>
                <select
                  value={formData.bulan}
                  onChange={(e) => setFormData({...formData, bulan: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
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
                  value={formData.tahun}
                  onChange={(e) => setFormData({...formData, tahun: parseInt(e.target.value)})}
                  className="w-full p-2 border rounded"
                  required
                >
                  {[2023, 2024, 2025].map(tahun => (
                    <option key={tahun} value={tahun}>{tahun}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Nama</label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({...formData, nama: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ayat Mulai</label>
                <input
                  type="text"
                  value={formData.ayatMulai}
                  onChange={(e) => setFormData({...formData, ayatMulai: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="Contoh: Al-Baqarah: 1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Ayat Selesai</label>
                <input
                  type="text"
                  value={formData.ayatSelesai}
                  onChange={(e) => setFormData({...formData, ayatSelesai: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="Contoh: Al-Baqarah: 10"
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Halaman/Juz</label>
              <input
                type="text"
                value={formData.halaman}
                onChange={(e) => setFormData({...formData, halaman: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="Contoh: Halaman 15-17 atau Juz 1"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Metode</label>
              <select
                value={formData.metode}
                onChange={(e) => setFormData({...formData, metode: e.target.value})}
                className="w-full p-2 border rounded"
                required
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-2">
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                  <i class="ri-close-line mr-1"></i> Batal
                </button>
              )}
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                <i class={isEditing ? "ri-save-line mr-1" : "ri-add-line mr-1"}></i>
                {isEditing ? 'Simpan Perubahan' : 'Tambah Data'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Tabel Data Setoran */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Pekan</th>
                <th className="p-3 text-left">Bulan</th>
                <th className="p-3 text-left">Nama</th>
                <th className="p-3 text-left">Ayat</th>
                <th className="p-3 text-left">Halaman/Juz</th>
                <th className="p-3 text-left">Metode</th>
                <th className="p-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {setoranList.map((setoran) => (
                <tr key={setoran.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">Pekan {setoran.pekan}</td>
                  <td className="p-3">{setoran.bulan} {setoran.tahun}</td>
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
                  <td className="p-3">
                    <button
                      onClick={() => handleEdit(setoran)}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      <i class="ri-edit-line"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(setoran.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <i class="ri-delete-bin-line"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default Admin;