import { useState } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('bookings');
  const navigate = useNavigate();
  
  // Firestore hooks
  const { data: bookings, updateData: updateBooking } = useFirestore('booking');
  const { data: kamar, updateData: updateKamar } = useFirestore('kamar');
  const { data: penghuni, addData: addPenghuni } = useFirestore('penghuni');
  const { data: pembayaran, updateData: updatePembayaran } = useFirestore('pembayaran');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleApprove = async (bookingId, kamarId) => {
    try {
      await updateBooking(bookingId, { status: 'approved' });
      await updateKamar(kamarId, { status: 'booking' });
    } catch (error) {
      console.error('Approve error:', error);
    }
  };

  const handleCheckIn = async (booking) => {
    try {
      // Tambah penghuni
      await addPenghuni({
        nama: booking.nama,
        noHP: booking.kontak,
        program: booking.program,
        kamar_id: booking.kamar_id,
        tanggal_masuk: new Date(),
        aktif: true,
      });
      
      // Update status kamar
      await updateKamar(booking.kamar_id, { 
        status: 'diisi',
        penghuni_id: booking.id 
      });
      
      // Update status booking
      await updateBooking(booking.id, { status: 'completed' });
    } catch (error) {
      console.error('Check-in error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <i className="ri-home-4-line text-2xl text-blue-600 mr-2"></i>
            <h1 className="text-xl font-bold">Admin Kost</h1>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center text-red-600 hover:text-red-800"
          >
            Logout <i className="ri-logout-box-r-line ml-1"></i>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'bookings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('bookings')}
          >
            <i className="ri-calendar-todo-line mr-2"></i>
            Bookings
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'payments' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('payments')}
          >
            <i className="ri-money-dollar-circle-line mr-2"></i>
            Payments
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'rooms' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('rooms')}
          >
            <i className="ri-door-line mr-2"></i>
            Kamar
          </button>
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center">
                <i className="ri-calendar-todo-line text-blue-500 mr-2"></i>
                Daftar Booking
              </h2>
            </div>
            <div className="divide-y">
              {bookings
                .filter(b => b.status === 'pending')
                .map(booking => (
                  <div key={booking.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{booking.nama}</p>
                        <p className="text-sm text-gray-600">{booking.kontak}</p>
                        <p className="text-sm mt-1">
                          <span className="font-medium">Kamar:</span> {kamar.find(k => k.id === booking.kamar_id)?.no_kamar || booking.kamar_id}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Tanggal:</span> {new Date(booking.tanggal_booking?.seconds * 1000).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(booking.id, booking.kamar_id)}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center hover:bg-blue-200 transition"
                        >
                          Approve <i className="ri-check-line ml-1"></i>
                        </button>
                        <button
                          onClick={() => handleCheckIn(booking)}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center hover:bg-green-200 transition"
                        >
                          Check-in <i className="ri-user-add-line ml-1"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              {bookings.filter(b => b.status === 'pending').length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  <i className="ri-inbox-line text-2xl mb-2"></i>
                  <p>Tidak ada booking pending</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center">
                <i className="ri-money-dollar-circle-line text-green-500 mr-2"></i>
                Daftar Pembayaran
              </h2>
            </div>
            <div className="divide-y">
              {pembayaran
                .filter(p => p.status === 'belum bayar')
                .map(payment => (
                  <div key={payment.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Bulan: {payment.bulan}</p>
                        <p className="text-sm text-gray-600">
                          Penghuni: {penghuni.find(p => p.id === payment.penghuni_id)?.nama || payment.penghuni_id}
                        </p>
                        <p className="text-sm mt-1">
                          <span className="font-medium">Jumlah:</span> Rp {payment.jumlah.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => updatePembayaran(payment.id, { status: 'lunas' })}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center hover:bg-green-200 transition"
                      >
                        Konfirmasi <i className="ri-checkbox-circle-line ml-1"></i>
                      </button>
                    </div>
                  </div>
                ))}
              {pembayaran.filter(p => p.status === 'belum bayar').length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  <i className="ri-wallet-3-line text-2xl mb-2"></i>
                  <p>Tidak ada pembayaran pending</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rooms Tab */}
        {activeTab === 'rooms' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center">
                <i className="ri-door-line text-purple-500 mr-2"></i>
                Daftar Kamar
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No Kamar</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipe</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Penghuni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {kamar.map(room => (
                    <tr key={room.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{room.no_kamar}</td>
                      <td className="px-6 py-4 whitespace-nowrap capitalize">{room.tipe}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          room.status === 'tersedia' ? 'bg-green-100 text-green-800' :
                          room.status === 'diisi' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {room.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {room.status === 'diisi' ? (
                          penghuni.find(p => p.id === room.penghuni_id)?.nama || '-'
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}