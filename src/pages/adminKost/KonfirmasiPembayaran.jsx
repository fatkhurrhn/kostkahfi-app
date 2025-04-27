import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function KonfirmasiPembayaran() {
  const [pembayaran, setPembayaran] = useState([]);

  useEffect(() => {
    const fetchPembayaran = async () => {
      const querySnapshot = await getDocs(collection(db, 'konfirmasi_pembayaran'));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        tanggalKonfirmasi: doc.data().tanggal?.toDate().toLocaleString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }));
      data.sort((a, b) => b.tanggal?.seconds - a.tanggal?.seconds);
      setPembayaran(data);
    };
    fetchPembayaran();
  }, []);

  const handleVerifikasi = async (id, status) => {
    try {
      // 1. Update status konfirmasi pembayaran
      await updateDoc(doc(db, 'konfirmasi_pembayaran', id), { status });
      
      // 2. Jika diterima, update status pembayaran di collection pembayaran
      if (status === 'Diterima') {
        const konfirmasi = pembayaran.find(p => p.id === id);
        const bulanDibayar = konfirmasi.bulan.split(',').map(b => b.trim());
        
        // Update semua bulan yang dibayar
        for (const bulan of bulanDibayar) {
          const paymentId = `${konfirmasi.kamar}_${bulan}`;
          await setDoc(doc(db, 'pembayaran', paymentId), {
            penyewaId: konfirmasi.kamar, // menggunakan no kamar sebagai reference
            bulan: bulan,
            status: 'Lunas',
            updatedAt: new Date()
          }, { merge: true });
        }
      }

      // Update state
      const updated = pembayaran.map(p => 
        p.id === id ? { ...p, status } : p
      );
      setPembayaran(updated);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        await deleteDoc(doc(db, 'konfirmasi_pembayaran', id));
        setPembayaran(pembayaran.filter(p => p.id !== id));
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    }
  };

  return (
    <div style={{ padding: '20px', overflowX: 'auto' }}>
      <h2>Konfirmasi Pembayaran</h2>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Nama</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Kamar</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Bulan Dibayar</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Waktu Konfirmasi</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Bukti</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {pembayaran.map(p => (
            <tr key={p.id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{p.nama}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{p.kamar}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                {p.bulan.split(',').map((bulan, i) => (
                  <div key={i}>{bulan.trim()}</div>
                ))}
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                {p.tanggalKonfirmasi || '-'}
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                {p.bukti && (
                  <a href={p.bukti} target="_blank" rel="noopener noreferrer">
                    Lihat Bukti
                  </a>
                )}
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                {p.status === 'Pending' && <span style={{ color: '#FF9800' }}>Pending</span>}
                {p.status === 'Diterima' && <span style={{ color: '#4CAF50' }}>✓ Diterima</span>}
                {p.status === 'Ditolak' && <span style={{ color: '#F44336' }}>✗ Ditolak</span>}
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                {p.status === 'Pending' && (
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button 
                      onClick={() => handleVerifikasi(p.id, 'Diterima')}
                      style={buttonStyle.success}
                    >
                      Terima
                    </button>
                    <button 
                      onClick={() => handleVerifikasi(p.id, 'Ditolak')}
                      style={buttonStyle.danger}
                    >
                      Tolak
                    </button>
                  </div>
                )}
                <button
                  onClick={() => handleDelete(p.id)}
                  style={{ ...buttonStyle.secondary, marginTop: '5px' }}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const buttonStyle = {
  success: {
    padding: '5px 10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer'
  },
  danger: {
    padding: '5px 10px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer'
  },
  secondary: {
    padding: '5px 10px',
    backgroundColor: '#607d8b',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    width: '100%'
  }
};