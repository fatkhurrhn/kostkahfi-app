// src/components/rooms/RoomsContent.jsx
import RoomCard from './RoomCard';

export default function RoomsContent({ rooms, filter, loading }) {
  const filtered = rooms.filter(r =>
    filter === 'all' ? true : r.status === filter
  );

  // Group rooms by building and floor
  const groupedRooms = filtered.reduce((acc, room) => {
    const building = room.no.substring(0, 1);
    const floor = room.no.substring(1, 2);

    if (!acc[building]) acc[building] = {};
    if (!acc[building][floor]) acc[building][floor] = [];
    
    acc[building][floor].push(room);
    return acc;
  }, {});

  if (loading) return null;

  return (
    <>
      {Object.keys(groupedRooms).length > 0 ? (
        Object.entries(groupedRooms).map(([building, floors]) => (
          <div key={`building-${building}`} className="mb-12">
            {Object.entries(floors).map(([floor, floorRooms]) => (
              <div key={`building-${building}-floor-${floor}`} className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  Gedung {building} Lantai {floor}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {floorRooms.map(room => (
                    <RoomCard key={room.id} room={room} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Tidak ada kamar yang tersedia</p>
        </div>
      )}
    </>
  );
}