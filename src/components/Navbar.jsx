import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">Kost Management</div>
        <div className="flex space-x-6">
          <Link to="/" className="flex items-center hover:text-blue-200">
            <i className="ri-home-line mr-1"></i> Cek Kamar
          </Link>
          <Link to="/profiles" className="flex items-center hover:text-blue-200">
            <i className="ri-user-line mr-1"></i> Profil Penghuni
          </Link>
          <Link to="/admin/rooms" className="flex items-center hover:text-blue-200">
            <i className="ri-hotel-line mr-1"></i> Admin Kamar
          </Link>
          <Link to="/admin/residents" className="flex items-center hover:text-blue-200">
            <i className="ri-admin-line mr-1"></i> Admin Penghuni
          </Link>
        </div>
      </div>
    </nav>
  );
};