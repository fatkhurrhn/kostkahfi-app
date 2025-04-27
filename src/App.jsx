import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/index';
import Login from './pages/adminKost/Login';
import Dashboard from './pages/adminKost/Dashboard';
import DataPenyewa from './pages/DataPenyewa';
import Pembayaran from './pages/Pembayaran';
import Gallery from './pages/Gallery';

import AdminDataPenyewa from './pages/adminKost/DataPenyewa';
import PembayaranAdmin from './pages/adminKost/AdminPembayaran';
import KonfirmasiPembayaran from './pages/adminKost/KonfirmasiPembayaran';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/penyewa" element={<DataPenyewa />} />
        <Route path="/gallery" element={<Gallery />} />

        <Route path="/kost/login" element={<Login />} />
        <Route path="/kost/dashboard" element={<Dashboard />} />
        <Route path="/kost/penyewa" element={<AdminDataPenyewa />} />

        {/* // Tambahkan route ini */}
      <Route path="/pembayaran" element={<Pembayaran />} />
      <Route path="/kost/pembayaran" element={<PembayaranAdmin />} />
      <Route path="/kost/konfirmasi-pembayaran" element={<KonfirmasiPembayaran />} />
      </Routes>
    </Router>
  );
}

export default App;