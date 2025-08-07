
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardAdmin from './pages/dashboard/DashboardAdmin';
import DashboardUsers from './pages/dashboard/DashboardUsers';
import ManageKamar from './pages/dashboard/admin/ManageKamar';
import Kamar from './pages/Rooms';
import ManagePembayaranUser from './pages/dashboard/users/ManagePembayaran';
import ManagePembayaran from './pages/dashboard/admin/ManagePembayaran';
import Blog from './pages/Blog';
import ManageBlog from './pages/dashboard/admin/ManageBlog';
import DetailBlog from './pages/DetailBlog';
import ManageComments from './pages/dashboard/admin/ManageComments';
import ManageUsers from './pages/dashboard/admin/ManageUsers';
import NotFound from './pages/NotFound';
import Template from './pages/Template';
import Contact from './pages/Contact';
import Cavelatte from './pages/Cavelatte';
import AboutUs from './pages/AboutUs';
import VerifyOTP from './pages/auth/VerifyOTP';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/sign-up" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/dashboard-users" element={<DashboardUsers />} />

        <Route path="/dashboard-admin/manage-kamar" element={<ManageKamar />} />
        <Route path="/dashboard-users/manage-pembayaran" element={<ManagePembayaranUser />} />
        <Route path="/dashboard-admin/manage-pembayaran" element={<ManagePembayaran />} />
        <Route path="/dashboard-admin/manage-blog" element={<ManageBlog />} />
        <Route path="/dashboard-admin/manage-komentar" element={<ManageComments />} />
        <Route path="/dashboard-admin/manage-users" element={<ManageUsers />} />

        <Route path="/rooms-list" element={<Kamar />} />
        <Route path="/blogs" element={<Blog />} />
        <Route path="/blogs/:slug" element={<DetailBlog />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="/tes" element={<Template />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cavelatte" element={<Cavelatte />} />
        <Route path="/about-us" element={<AboutUs />} />

        {/* Catch-all untuk halaman 404 */}
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </BrowserRouter>
  );
}