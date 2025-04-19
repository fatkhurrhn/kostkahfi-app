import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import { useAuth } from './components/AuthContext';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Setoran from './pages/Setoran';
import AdminHome from './pages/admin/Home';
import AdminSetoran from './pages/admin/Setoran';
import Kehadiran from './pages/Kehadiran';
import RecapKehadiran from './pages/admin/recapKehadiran';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
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
          <Route path="/login" element={<Login />} />
          <Route path="/setoran" element={<Setoran />} />
          <Route path="/kehadiran" element={<Kehadiran />} />
          
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

          {/* Admin Route */}
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