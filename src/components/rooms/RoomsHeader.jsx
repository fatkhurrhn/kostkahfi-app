// src/components/rooms/RoomsHeader.jsx
export default function RoomsHeader() {
  return (
    <div className="text-center mb-10">
      <h1 className="text-4xl font-bold mb-3 text-gray-800">
        <span className="text-[#eb6807]">Ketersediaan</span> Kamar
      </h1>
      <div className="w-20 h-1 bg-[#eb6807] mx-auto mb-4"></div>
      <p className="text-gray-600 max-w-lg mx-auto">
        Informasi real-time ketersediaan kamar di Kost Al Kahfi
      </p>
    </div>
  );
}