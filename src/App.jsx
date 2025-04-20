import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import { useAuth } from './components/AuthContext';
import HomePage from './pages/HomePage';
import Tes from './pages/Tes';
import Program from './pages/Program';

import Login from './pages/admin/Login';

import AdminHome from './pages/admin/Home';
import RecapKehadiran from './pages/admin/recapKehadiran';
import AdminSetoran from './pages/admin/Setoran';

import Kehadiran from './pages/mahasantri/Kehadiran';
import Setoran from './pages/mahasantri/Setoran';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/" />;
}

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header bisa dipindahkan ke sini jika sama di semua halaman admin */}
      {children}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/tes" element={<Tes />} />
          <Route path="/program" element={<Program />} />

          {/* mahasantri */}
          <Route path="/mahasantri/setoran" element={<Setoran />} />
          <Route path="/mahasantri/kehadiran" element={<Kehadiran />} />

          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <PrivateRoute>
              <AdminLayout>
                <AdminHome />
              </AdminLayout>
            </PrivateRoute>
          } />
          
          <Route path="/admin/setoran" element={
            <PrivateRoute>
              <AdminLayout>
                <AdminSetoran />
              </AdminLayout>
            </PrivateRoute>
          } />

          <Route path="/admin/kehadiran" element={
            <PrivateRoute>
              <AdminLayout>
                <RecapKehadiran />
              </AdminLayout>
            </PrivateRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;