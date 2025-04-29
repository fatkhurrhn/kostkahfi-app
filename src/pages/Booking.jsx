import { useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Booking() {
  const [nama, setNama] = useState('');
  const [noHP, setNoHP] = useState('');
  const [program, setProgram] = useState('reguler');
  const [searchParams] = useSearchParams();
  const kamarId = searchParams.get('kamar_id');
  const { addData } = useFirestore('booking');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addData({
      nama,
      kontak: noHP,
      kamar_id: kamarId,
      status: 'pending',
      program,
      tanggal_booking: new Date(),
    });
    alert('Booking berhasil! Admin akan menghubungi Anda.');
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <i className="ri-home-4-line text-2xl text-blue-600 mr-2"></i>
          <h1 className="text-2xl font-bold text-blue-800">Form Booking Kamar</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor HP</label>
            <input
              type="tel"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="No HP"
              value={noHP}
              onChange={(e) => setNoHP(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
            >
              <option value="reguler">Reguler</option>
              <option value="BIMAN">BIMAN</option>
              <option value="mahasantri">Mahasantri</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center transition duration-200"
          >
            Submit Booking <i className="ri-send-plane-line ml-2"></i>
          </button>
        </form>
      </div>
    </div>
  );
}