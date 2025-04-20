import BottomNavbar from '../components/BottomNavbar';

function Program() {
  const programs = [
    {
      id: 1,
      name: "BIMAN",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      participants: 15,
      activities: [
        { name: "Setoran Hafalan", icon: "ri-book-read-line" },
        { name: "Kajian", icon: "ri-group-line" },
        { name: "Diskusi", icon: "ri-discuss-line" }
      ],
      icon: "ri-team-line",
      color: "bg-blue-100",
      textColor: "text-blue-800"
    },
    {
      id: 2,
      name: "Mahasantri",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      participants: 10,
      activities: [
        { name: "Setoran Hafalan", icon: "ri-book-read-line" },
        { name: "Kajian", icon: "ri-group-line" }
      ],
      icon: "ri-user-3-line",
      color: "bg-green-100",
      textColor: "text-green-800"
    }
  ];

  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto container mx-auto px-4 pt-[70px] pb-20">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Program Kost Al-Kahfi</h1>
        
        <div className="mb-8 text-center text-gray-600">
          <p>Selain program di bawah ini, Kost Al-Kahfi juga menyediakan kamar biasa tanpa kegiatan wajib.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {programs.map((program) => (
            <div key={program.id} className={`rounded-lg shadow-md overflow-hidden ${program.color} border border-gray-200`}>
              <div className="p-5">
                <div className="flex items-center mb-3">
                  <i className={`${program.icon} text-2xl mr-3 ${program.textColor}`}></i>
                  <h2 className={`text-xl font-semibold ${program.textColor}`}>{program.name}</h2>
                </div>
                
                <p className="text-gray-700 mb-4">{program.description}</p>
                
                <div className="mb-4">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <i className="ri-user-line mr-2"></i>
                    <span>Jumlah Peserta: {program.participants} orang</span>
                  </div>
                </div>
                
                <h3 className="font-medium text-gray-800 mb-2">Kegiatan:</h3>
                <ul className="space-y-2">
                  {program.activities.map((activity, index) => (
                    <li key={index} className="flex items-center">
                      <i className={`${activity.icon} mr-2 ${program.textColor}`}></i>
                      <span className="text-gray-700">{activity.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
            <i className="ri-information-line mr-2 text-blue-500"></i>
            Informasi Tambahan
          </h3>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
          </p>
        </div>
      </div>

      {/* Bottom Navbar */}
      <BottomNavbar />
    </div>
  );
}

export default Program;