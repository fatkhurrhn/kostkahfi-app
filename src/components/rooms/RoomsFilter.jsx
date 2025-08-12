// src/components/rooms/RoomsFilter.jsx
export default function RoomsFilter({ filter, setFilter }) {
  return (
    <div className="flex justify-center space-x-5 mb-6">
      {['all', 'kosong', 'terisi'].map(btn => (
        <button
          key={btn}
          onClick={() => setFilter(btn)}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors
            ${filter === btn
              ? 'bg-[#eb6807] text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-200'
            }`}
        >
          {btn === 'all' ? 'Semua Kamar' : btn === 'kosong' ? 'Kamar Kosong' : 'Kamar Terisi'}
        </button>
      ))}
    </div>
  );
}