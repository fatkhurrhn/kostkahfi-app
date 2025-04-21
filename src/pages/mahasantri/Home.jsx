import { useNavigate } from 'react-router-dom';

import BottomNavbar from '../../components/BottomNavbar';

function Home() {
    const navigate = useNavigate();

    return (
        <div className="h-screen flex flex-col bg-white">
            <div className="flex-1 overflow-y-auto container mx-auto px-4 pt-[70px] pb-20">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">header</h1>
                {/* back */}
                <div className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-300 py-3">
                    <div className="max-w-[540px] w-full mx-auto px-6 flex justify-between items-center">
                        <h3 className="text-black flex items-center gap-2 cursor-pointer" onClick={() => navigate(-1)}>
                            <i className="ri-arrow-left-line text-lg"></i> Mahasantri
                        </h3>
                    </div>
                </div>

            </div>

            {/* Bottom Navbar */}
            <BottomNavbar />
        </div>

    );
}

export default Home;
