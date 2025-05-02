import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Index from './pages/index';

import DashboardAdmin from './components/Dashboard/DashboardAdmin';
import DashboardSantri from './components/Dashboard/DashboardSantri';

import RekapKehadiranAdmin from './components/Dashboard/Admin/RekapKehadiran';
import RekapSetoranAdmin from './components/Dashboard/Admin/RekapSetoran';

import Login from './pages/mahasantri/Login';
import Register from './pages/mahasantri/Register';
import HomeMahasantri from './pages/mahasantri/Home';
import RecapHabits from './pages/mahasantri/RecapHabits';
import RecapKehadiran from './pages/mahasantri/RecapKehadiran';
import RecapSetoran from './pages/mahasantri/RecapSetoran';
import GallerySantri from './pages/mahasantri/Gallery';

function PrivateRoute({ children, role }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (role && currentUser.role !== role) {
    return <Navigate to={currentUser.role === 'admin' ? '/dashboard-admin' : '/dashboard-santri'} />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />

          <Route path="/mahasantri" element={<HomeMahasantri />} />
          <Route path="/mahasantri/login" element={<Login />} />
          <Route path="/mahasantri/register" element={<Register />} />
          <Route path="/mahasantri/recap-habits" element={<RecapHabits />} />
          <Route path="/mahasantri/recap-kehadiran" element={<RecapKehadiran />} />
          <Route path="/mahasantri/recap-setoran" element={<RecapSetoran />} />
          <Route path="/mahasantri/gallery" element={<GallerySantri />} />

          <Route path="/dashboard-admin" element={ <PrivateRoute role="admin"> <DashboardAdmin /></PrivateRoute> } />
          <Route path="/dashboard-admin/kehadiran-kajian" element={<RekapKehadiranAdmin />} />
          <Route path="/dashboard-admin/setoran" element={<RekapSetoranAdmin />} />

          <Route path="/dashboard-santri" element={ <PrivateRoute role="santri"> <DashboardSantri /> </PrivateRoute>} />
          {/* <Route path="/" element={<Navigate to="/login" />} /> */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;





// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider } from './components/AuthContext';
// import { useAuth } from './components/AuthContext';
// import HomePage from './pages/HomePage';
// import Tes from './pages/Tes';
// import Program from './pages/Program';
// import GalleryKahfi from './pages/Gallery';
// import Cavelatte from './pages/Cavelatte';

// import Login from './pages/adminMahasantri/Login';

// import AdminHome from './pages/adminMahasantri/Home';
// import RecapKehadiran from './pages/adminMahasantri/recapKehadiran';
// import AdminSetoran from './pages/adminMahasantri/Setoran';
// import AdminGallery from './pages/adminMahasantri/GalleryControl';

// import HomeMahasantri from './pages/mahasantri/Home';
// import Kehadiran from './pages/mahasantri/Kehadiran';
// import Setoran from './pages/mahasantri/Setoran';
// import Gallery from './pages/mahasantri/Gallery';

// function PrivateRoute({ children }) {
//   const { currentUser } = useAuth();
//   return currentUser ? children : <Navigate to="/" />;
// }

// function AdminLayout({ children }) {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header bisa dipindahkan ke sini jika sama di semua halaman admin */}
//       {children}
//     </div>
//   );
// }

// function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/" element={<HomePage />} />
//           <Route path="/tes" element={<Tes />} />
//           <Route path="/program" element={<Program />} />
//           <Route path="/gallery" element={<GalleryKahfi />} />
//           <Route path="/cavelatte" element={<Cavelatte />} />

//           {/* mahasantri */}
//           <Route path="/program/mahasantri" element={<HomeMahasantri />} />
//           <Route path="/program/mahasantri/setoran" element={<Setoran />} />
//           <Route path="/program/mahasantri/kehadiran" element={<Kehadiran />} />
//           <Route path="/program/mahasantri/gallery" element={<Gallery />} />

//           <Route path="/mahasantri/login" element={<Login />} />

//           {/* Admin Routes */}
//           <Route path="/mahasantri/dashboard" element={
//             <PrivateRoute>
//               <AdminLayout>
//                 <AdminHome />
//               </AdminLayout>
//             </PrivateRoute>
//           } />
          
//           <Route path="/mahasantri/setoran" element={
//             <PrivateRoute>
//               <AdminLayout>
//                 <AdminSetoran />
//               </AdminLayout>
//             </PrivateRoute>
//           } />

//           <Route path="/mahasantri/kehadiran" element={
//             <PrivateRoute>
//               <AdminLayout>
//                 <RecapKehadiran />
//               </AdminLayout>
//             </PrivateRoute>
//           } />

//           <Route path="/mahasantri/gallery" element={
//             <PrivateRoute>
//               <AdminLayout>
//                 <AdminGallery />
//               </AdminLayout>
//             </PrivateRoute>
//           } />
          
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

// export default App;