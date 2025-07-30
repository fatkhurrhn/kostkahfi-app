
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homepage/HomePage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardAdmin from './pages/dashboard/DashboardAdmin';
import DashboardUsers from './pages/dashboard/DashboardUsers';
import ManageKamar from './pages/dashboard/admin/ManageKamar';
import Kamar from './pages/homepage/Kamar';
import ManagePembayaranUser from './pages/dashboard/users/ManagePembayaran';
import ManagePembayaran from './pages/dashboard/admin/ManagePembayaran';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/dashboard-users" element={<DashboardUsers />} />

        <Route path="/dashboard-admin/manage-kamar" element={<ManageKamar />} />
        <Route path="/dashboard-users/manage-pembayaran" element={<ManagePembayaranUser />} />
        <Route path="/dashboard-admin/manage-pembayaran" element={<ManagePembayaran />} />

        <Route path="/kamar" element={<Kamar />} />
      </Routes>
    </BrowserRouter>
  );
}