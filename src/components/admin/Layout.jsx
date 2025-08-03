import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { app } from "../../firebase"; // Make sure you have this import

const pageTitles = {
  "/dashboard-admin": "Dashboard",
  "/dashboard-admin/manage-users": "Manage Users",
  "/dashboard-admin/manage-kamar": "Manage Kamar",
  "/dashboard-admin/manage-pembayaran": "Manage Pembayaran",
  "/dashboard-admin/manage-blog": "Manage Blog",
  "/dashboard-admin/manage-komentar": "Manage Komentar",
};

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const currentTitle = pageTitles[location.pathname] || "Dashboard";

  const handleLogout = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      try {
        // Get user data from Firestore
        const q = query(
          collection(db, 'users'),
          where('uid', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          if (userData.role !== 'admin') {
            navigate('/dashboard-users');
            return;
          }
          setUser(userData);

          // Get all penghuni data
          const penghuniSnapshot = await getDocs(collection(db, 'users'));
          const penghuniData = penghuniSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          (penghuniData);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        (false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar Desktop */}
      <div className="hidden md:block fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-40">
        <Sidebar />
      </div>

      {/* Konten kanan */}
      <div className="flex-1 flex flex-col md:ml-64 w-full">
        {/* Topbar */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-30">
          <button
            className="md:hidden text-xl text-gray-700"
            onClick={() => setSidebarOpen(true)}
          >
            <i className="ri-menu-2-line"></i>
          </button>

          <h1 className="hidden md:block text-xl font-semibold">{currentTitle}</h1>

          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              <i className="ri-user-line mr-1"></i> {user?.nama}
            </span>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm flex items-center"
            >
              <i className="ri-logout-box-r-line mr-1"></i> Logout
            </button>
          </div>
        </div>

        {/* Konten scrollable */}
        <main className="p-4 md:p-6 overflow-y-auto h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>

      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Sidebar */}
          <div className="relative z-50 w-64 bg-white h-full shadow-lg">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Modal Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Logout</h3>
            <p className="mb-6">Apakah Anda yakin ingin keluar?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
}