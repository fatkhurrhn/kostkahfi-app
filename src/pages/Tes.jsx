
import BottomNavbar from '../components/BottomNavbar';

function Program() {
  

  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto container mx-auto px-4 pt-[70px] pb-20">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Program Kost Al-Kahfi</h1>

       
      </div>

      {/* Bottom Navbar */}
      <BottomNavbar />
    </div>

  );
}

export default Program;
