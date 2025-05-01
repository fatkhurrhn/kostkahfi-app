import { useState } from 'react';

export default function RegisterForm({ onSubmit, loading }) {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(nama, email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nama" className="block mb-1">Nama Lengkap</label>
        <input
          type="text"
          id="nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="w-full px-3 py-2 border rounded bg-white text-gray-800"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block mb-1">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded bg-white text-gray-800"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block mb-1">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded bg-white text-gray-800"
          required
          minLength="6"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
      >
        {loading ? 'Loading...' : 'Register'}
      </button>
    </form>
  );
}