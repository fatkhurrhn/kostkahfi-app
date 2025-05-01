import { useAuth } from '../../../context/AuthContext';

export default function SantriProfile() {
  const { currentUser } = useAuth();

  return (
    <div className="mt-6 bg-white p-6 rounded shadow text-gray-800">
      <h2 className="text-2xl font-semibold mb-4">Profile Santri</h2>
      <div className="space-y-3">
        <p><span className="font-medium">Nama:</span> {currentUser?.nama}</p>
        <p><span className="font-medium">Email:</span> {currentUser?.email}</p>
        <p><span className="font-medium">Role:</span> {currentUser?.role}</p>
        <p><span className="font-medium">Tanggal Daftar:</span> {currentUser?.createdAt?.toDate().toLocaleDateString()}</p>
      </div>
    </div>
  );
}