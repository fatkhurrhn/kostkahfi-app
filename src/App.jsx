
import { BrowserRouter, Routes, Route, Navigate  } from 'react-router-dom';
import HomePage from './pages/homepage/HomePage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardAdmin from './pages/dashboard/DashboardAdmin';
import DashboardUsers from './pages/dashboard/DashboardUsers';
import ManageKamar from './pages/dashboard/admin/ManageKamar';
import Kamar from './pages/homepage/Kamar';
import ManagePembayaranUser from './pages/dashboard/users/ManagePembayaran';
import ManagePembayaran from './pages/dashboard/admin/ManagePembayaran';
import Blog from './pages/homepage/Blog';
import ManageBlog from './pages/dashboard/admin/ManageBlog';
import DetailBlog from './pages/homepage/DetailBlog';
import ManageComments from './pages/dashboard/admin/ManageComments';
import ManageUsers from './pages/dashboard/admin/ManageUsers';
import NotFound from './pages/NotFound';

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
        <Route path="/dashboard-admin/manage-blog" element={<ManageBlog />} />
        <Route path="/dashboard-admin/manage-komentar" element={<ManageComments />} />
        <Route path="/dashboard-admin/manage-users" element={<ManageUsers />} />

        <Route path="/kamar" element={<Kamar />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<DetailBlog />} />
        <Route path="/not-found" element={<NotFound />} />

        {/* Catch-all untuk halaman 404 */}
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </BrowserRouter>
  );
}