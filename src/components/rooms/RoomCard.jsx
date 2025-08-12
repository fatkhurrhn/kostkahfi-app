// src/components/rooms/RoomCard.jsx
export default function RoomCard({ room }) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm overflow-hidden border-t-4 ${
        room.status === 'kosong' ? 'border-green-400' : 'border-rose-400'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded ${
                room.status === 'kosong'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-rose-100 text-rose-700'
              }`}
            >
              {room.status === 'kosong' ? 'Tersedia' : 'Terisi'}
            </span>
          </div>
          <div className="text-[17px] font-bold text-gray-800">#{room.no}</div>
        </div>

        <div className="flex items-center justify-center my-4">
          <div
            className={`text-5xl ${
              room.status === 'kosong' ? 'text-green-400' : 'text-rose-400'
            }`}
          >
            {room.status === 'kosong' ? (
              <i className="ri-door-open-line" />
            ) : (
              <i className="ri-door-closed-line" />
            )}
          </div>
        </div>

        {room.occupant && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600 flex items-center">
              <i className="ri-user-line mr-2 text-gray-400" />
              <span className="font-medium">{room.occupant}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}