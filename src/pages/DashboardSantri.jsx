// import { useAuth } from '../context/AuthContext';
// import SantriNavbar from '../components/Dashboard/Santri/SantriNavbar';
// import SantriProfile from '../components/Dashboard/Santri/SantriProfile';

import { useAuth } from '../context/AuthContext';
import SantriNavbar from '../components/Dashboard/Santri/SantriNavbar';
import SantriProfile from '../components/Dashboard/Santri/SantriProfile';
import AmalYaumiyah from '../components/Dashboard/Santri/AmalYaumiyah';

export default function DashboardSantri() {
  const { currentUser } = useAuth();

  if (!currentUser || currentUser.role !== 'santri') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-md">
          <h1 className="text-2xl font-bold text-red-500">Unauthorized Access</h1>
          <p>You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <SantriNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard Santri</h1>
        <div className="grid grid-cols-1 gap-6">
          <SantriProfile />
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Amal Yaumiyah</h2>
            <AmalYaumiyah />
          </div>
        </div>
      </div>
    </div>
  );
}