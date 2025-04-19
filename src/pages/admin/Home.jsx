import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import { auth, signOut } from '../../firebase';
import { useState, useEffect } from 'react';

function AdminHome() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            if (window.innerWidth > 768) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center">
                        <h1 className="text-lg md:text-xl font-bold text-gray-800 flex items-center">
                            <i className="ri-dashboard-line mr-2 text-blue-500"></i>
                            Dashboard Admin
                        </h1>
                    </div>
                    
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-3">
                        <span className="text-gray-600 text-sm truncate max-w-[120px] lg:max-w-none flex items-center">
                            <i className="ri-user-line mr-1"></i>
                            {currentUser?.email}
                        </span>
                        <button
                            onClick={() => navigate('/admin/setoran')}
                            className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs md:text-sm whitespace-nowrap flex items-center"
                        >
                            <i className="ri-book-line mr-1"></i>
                            Kelola Setoran
                        </button>
                        <button
                            onClick={() => navigate('/admin/kehadiran')}
                            className="px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 text-xs md:text-sm whitespace-nowrap flex items-center"
                        >
                            <i className="ri-calendar-check-line mr-1"></i>
                            Kelola Kehadiran
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs md:text-sm whitespace-nowrap flex items-center"
                        >
                            <i className="ri-logout-box-r-line mr-1"></i>
                            Logout
                        </button>
                    </div>
                    
                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
                        >
                            {isMenuOpen ? (
                                <i className="ri-close-line text-[24px]"></i>
                            ) : (
                                <i className="ri-menu-line text-[24px]"></i>
                            )}
                        </button>
                    </div>
                </div>
                
                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-200 py-2 px-4">
                        <div className="flex flex-col space-y-3">
                            <div className="text-sm text-gray-500 py-1 border-b border-gray-100 flex items-center">
                                <i className="ri-user-line mr-2"></i>
                                {currentUser?.email}
                            </div>
                            <button
                                onClick={() => {
                                    navigate('/admin/setoran');
                                    setIsMenuOpen(false);
                                }}
                                className="w-full text-left px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex items-center"
                            >
                                <i className="ri-book-line mr-2"></i>
                                Kelola Setoran
                            </button>
                            <button
                                onClick={() => {
                                    navigate('/admin/kehadiran');
                                    setIsMenuOpen(false);
                                }}
                                className="w-full text-left px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm flex items-center"
                            >
                                <i className="ri-calendar-check-line mr-2"></i>
                                Kelola Kehadiran
                            </button>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsMenuOpen(false);
                                }}
                                className="w-full text-left px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm flex items-center"
                            >
                                <i className="ri-logout-box-r-line mr-2"></i>
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </header>

            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="px-0 sm:px-0">
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold mb-3 sm:mb-4 text-gray-800 flex items-center">
                            <i className="ri-home-4-line mr-2 text-blue-500"></i>
                            Selamat datang di Dashboard Admin
                        </h2>
                        <p className="text-gray-600 text-sm sm:text-base">
                            Anda dapat mengelola data setoran hafalan dan kehadiran melalui menu di atas.
                        </p>
                        
                        {/* Quick Stats Section */}
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <h3 className="text-sm font-medium text-blue-800 flex items-center">
                                    <i className="ri-stack-line mr-2"></i>
                                    Total Setoran
                                </h3>
                                <p className="text-2xl font-bold text-blue-600 mt-1">-</p>
                                <p className="text-xs text-blue-500 mt-1 flex items-center">
                                    <i className="ri-time-line mr-1"></i>
                                    Terakhir diupdate: -
                                </p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                <h3 className="text-sm font-medium text-green-800 flex items-center">
                                    <i className="ri-user-heart-line mr-2"></i>
                                    Kehadiran Hari Ini
                                </h3>
                                <p className="text-2xl font-bold text-green-600 mt-1">-</p>
                                <p className="text-xs text-green-500 mt-1 flex items-center">
                                    <i className="ri-time-line mr-1"></i>
                                    Terakhir diupdate: -
                                </p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                <h3 className="text-sm font-medium text-purple-800 flex items-center">
                                    <i className="ri-trophy-line mr-2"></i>
                                    Pencapaian
                                </h3>
                                <p className="text-2xl font-bold text-purple-600 mt-1">-</p>
                                <p className="text-xs text-purple-500 mt-1 flex items-center">
                                    <i className="ri-time-line mr-1"></i>
                                    Terakhir diupdate: -
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            
            {/* Mobile Footer Navigation */}
            <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-around shadow-lg">
                <button
                    onClick={() => navigate('/admin/setoran')}
                    className="flex flex-col items-center text-xs text-gray-600"
                >
                    <i className="ri-book-line text-[20px] mb-1"></i>
                    Setoran
                </button>
                <button
                    onClick={() => navigate('/admin/kehadiran')}
                    className="flex flex-col items-center text-xs text-gray-600"
                >
                    <i className="ri-calendar-check-line text-[20px] mb-1"></i>
                    Kehadiran
                </button>
                <button
                    onClick={handleLogout}
                    className="flex flex-col items-center text-xs text-gray-600"
                >
                    <i className="ri-logout-box-r-line text-[20px] mb-1"></i>
                    Logout
                </button>
            </footer>
        </div>
    );
}

export default AdminHome;