// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import HomePage from './pages/index';
// import Login from './pages/adminKost/Login';
// import Dashboard from './pages/adminKost/Dashboard';
// import DataPenyewa from './pages/DataPenyewa';
// import Pembayaran from './pages/Pembayaran';
// import Gallery from './pages/Gallery';

// import AdminDataPenyewa from './pages/adminKost/DataPenyewa';
// import PembayaranAdmin from './pages/adminKost/AdminPembayaran';
// import KonfirmasiPembayaran from './pages/adminKost/KonfirmasiPembayaran';

// import AdminRooms from './pages/adminKost/AdminRooms';
// import AdminResidents from './pages/adminKost/AdminResidents';
// import RoomChecker from './pages/RoomChecker';
// // import ResidentProfiles from './pages/ResidentProfiles';

// function App() {
//   return (
//     <Router>
//       <Routes>

//       <Route path="/admin/rooms" element={<AdminRooms />} />
//         <Route path="/admin/residents" element={<AdminResidents />} />
//         <Route path="/x" element={<RoomChecker />} />
//         {/* <Route path="/profiles" element={<ResidentProfiles />} /> */}



//         <Route path="/home" element={<HomePage />} />
//         <Route path="/penyewa" element={<DataPenyewa />} />
//         <Route path="/gallery" element={<Gallery />} />

//         <Route path="/kost/login" element={<Login />} />
//         <Route path="/kost/dashboard" element={<Dashboard />} />
//         <Route path="/kost/penyewa" element={<AdminDataPenyewa />} />

//         {/* // Tambahkan route ini */}
//       <Route path="/pembayaran" element={<Pembayaran />} />
//       <Route path="/kost/pembayaran" element={<PembayaranAdmin />} />
//       <Route path="/kost/konfirmasi-pembayaran" element={<KonfirmasiPembayaran />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Login from './pages/Admin/Login';
import Dashboard from './pages/Admin/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}