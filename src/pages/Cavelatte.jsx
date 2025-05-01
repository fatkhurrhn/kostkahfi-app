import BottomNavbar from '../components/BottomNavbar';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Cavelatte() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('minuman');

    useEffect(() => {
        // Simulate loading state
        setTimeout(() => {
            setIsLoading(false);
        }, 500);

        // Check if URL has a hash for direct Cavelatte navigation
        if (location.hash) {
            const hash = location.hash.substring(1);
            
            // Smooth scroll to section after a delay
            setTimeout(() => {
                document.getElementById(hash)?.scrollIntoView({
                    behavior: 'smooth'
                });
            }, 1200);
        }
    }, [location.hash]);

    const menuItems = {
        minuman: [
            { name: 'Es Kopi Susu', price: '15K', desc: 'Kopi susu dengan es batu dan gula aren', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/330px-A_small_cup_of_coffee.JPG' },
            { name: 'Matcha Latte', price: '18K', desc: 'Matcha asli Jepang dengan susu segar', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/330px-A_small_cup_of_coffee.JPG' },
            { name: 'Caramel Macchiato', price: '20K', desc: 'Espresso dengan sirup karamel dan susu', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/330px-A_small_cup_of_coffee.JPG' },
            { name: 'Fresh Orange', price: '15K', desc: 'Jus jeruk segar', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/330px-A_small_cup_of_coffee.JPG' },
            { name: 'Teh Tarik', price: '12K', desc: 'Teh susu klasik khas Malaysia', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/330px-A_small_cup_of_coffee.JPG' }
        ],
        makanan: [
            { name: 'Roti Bakar', price: '18K', desc: 'Roti bakar dengan selai dan mentega', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/330px-A_small_cup_of_coffee.JPG' },
            { name: 'Nasi Goreng', price: '25K', desc: 'Nasi goreng spesial dengan telur dan ayam', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/330px-A_small_cup_of_coffee.JPG' },
            { name: 'Indomie Telur', price: '15K', desc: 'Indomie dengan telur mata sapi', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/330px-A_small_cup_of_coffee.JPG' },
            { name: 'French Fries', price: '15K', desc: 'Kentang goreng crispy dengan saus', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/330px-A_small_cup_of_coffee.JPG' },
            { name: 'Sandwich', price: '22K', desc: 'Sandwich dengan isi ayam dan sayuran', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/330px-A_small_cup_of_coffee.JPG' }
        ],
        snack: [
            { name: 'Pisang Goreng', price: '12K', desc: 'Pisang goreng dengan topping keju', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/330px-A_small_cup_of_coffee.JPG' },
            { name: 'Kentang Goreng', price: '15K', desc: 'Kentang goreng crispy dengan saus', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/330px-A_small_cup_of_coffee.JPG' },
            { name: 'Dimsum', price: '20K', desc: 'Aneka dimsum isi 5 pcs', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/330px-A_small_cup_of_coffee.JPG' },
            { name: 'Cireng', price: '10K', desc: 'Cireng dengan bumbu rujak', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/330px-A_small_cup_of_coffee.JPG' }
        ]
    };

    const fasilitas = [
        { icon: "ri-wifi-line", name: "Free Wifi" },
        { icon: "ri-projector-line", name: "Proyektor" },
        { icon: "ri-prayer-line", name: "Mushola" },
        { icon: "ri-plug-2-line", name: "Stop Kontak" },
        { icon: "ri-windy-line", name: "AC" },
        { icon: "ri-fish-line", name: "Kolam Ikan" },
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen max-w-3xl mx-auto flex flex-col items-center justify-center bg-blue-50">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-blue-800 font-medium">Memuat Data</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-blue-50 max-w-3xl mx-auto scrollbar-hide">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white shadow-md py-3 px-4">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600"
                    >
                        <i className="ri-arrow-left-line text-xl mr-2"></i>
                        <span className="font-medium text-gray-600">Cavelatte</span>
                    </button>
                    <div className="flex items-center space-x-3">
                        <button className="text-gray-600">
                            <i className="ri-search-line text-xl"></i>
                        </button>
                        <button className="text-gray-600">
                            <i className="ri-share-line text-xl"></i>
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="relative w-full h-64">
                <img 
                    src="https://nibble-images.b-cdn.net/nibble/original_images/cafe-di-menteng-00.jpg" 
                    alt="Cavelatte" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 text-white">
                    <h1 className="text-2xl font-bold">Cavelatte</h1>
                    <p className="text-sm opacity-90">Tempat nongkrong nyaman di Kost Kahfi</p>
                    <div className="flex items-center mt-2">
                        <i className="ri-map-pin-line mr-1 text-blue-300"></i>
                        <span className="text-sm">Area Kost Kahfi</span>
                        <div className="mx-2 h-1 w-1 bg-blue-300 rounded-full"></div>
                        <i className="ri-time-line mr-1 text-blue-300"></i>
                        <span className="text-sm">Buka 24 Jam</span>
                    </div>
                </div>
            </div>

            <main className="flex-1 pb-20">
                <div className="px-4 py-6">
                    {/* About Section */}
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <h2 className="text-lg font-semibold text-blue-800 mb-2">Tentang Cavelatte</h2>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Cavelatte adalah tempat nongkrong yang nyaman bagi penghuni Kost Kahfi. 
                            Dengan suasana yang terbuka namun tetap teduh, Cavelatte menawarkan berbagai 
                            menu makanan dan minuman yang lezat dengan harga terjangkau.
                        </p>
                        
                        {/* Rating */}
                        <div className="flex items-center mt-3">
                            <div className="flex text-yellow-400">
                                <i className="ri-star-fill"></i>
                                <i className="ri-star-fill"></i>
                                <i className="ri-star-fill"></i>
                                <i className="ri-star-fill"></i>
                                <i className="ri-star-half-line"></i>
                            </div>
                            <span className="ml-1 text-sm font-medium">4.8</span>
                            <span className="mx-1 text-gray-300">•</span>
                            <span className="text-sm text-gray-500">120+ reviews</span>
                        </div>
                    </div>
                    
                    {/* Facilities */}
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6" id="fasilitas">
                        <h2 className="text-lg font-semibold text-blue-800 mb-3">Fasilitas</h2>
                        <div className="grid grid-cols-3 gap-3">
                            {fasilitas.map((item, index) => (
                                <div key={index} className="flex flex-col items-center justify-center bg-blue-50 p-3 rounded-lg">
                                    <i className={`${item.icon} text-2xl text-blue-600 mb-1`}></i>
                                    <span className="text-xs text-center text-gray-700">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Gallery */}
                    <div className="mb-6" id="galeri">
                        <h2 className="text-lg font-semibold text-blue-800 mb-3">Galeri</h2>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="aspect-square rounded-lg overflow-hidden">
                                <img src="https://asset.kompas.com/crops/FejDtjHHkogvtzoaMbuSog49WlU=/0x182:960x822/1200x800/data/photo/2022/12/15/639aa1cc098ec.jpeg" alt="Cavelatte Space" className="w-full h-full object-cover" />
                            </div>
                            <div className="aspect-square rounded-lg overflow-hidden">
                                <img src="https://asset.kompas.com/crops/FejDtjHHkogvtzoaMbuSog49WlU=/0x182:960x822/1200x800/data/photo/2022/12/15/639aa1cc098ec.jpeg" alt="Cavelatte Dining" className="w-full h-full object-cover" />
                            </div>
                            <div className="aspect-square rounded-lg overflow-hidden">
                                <img src="https://asset.kompas.com/crops/FejDtjHHkogvtzoaMbuSog49WlU=/0x182:960x822/1200x800/data/photo/2022/12/15/639aa1cc098ec.jpeg" alt="Cavelatte Food" className="w-full h-full object-cover" />
                            </div>
                            <div className="relative aspect-square rounded-lg overflow-hidden bg-blue-800/30">
                                <img src="https://asset.kompas.com/crops/FejDtjHHkogvtzoaMbuSog49WlU=/0x182:960x822/1200x800/data/photo/2022/12/15/639aa1cc098ec.jpeg" alt="More Photos" className="w-full h-full object-cover opacity-70" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-white font-medium text-lg">+12 Foto</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Menu */}
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6" id="menu">
                        <h2 className="text-lg font-semibold text-blue-800 mb-3">Menu</h2>
                        
                        {/* Menu Tabs */}
                        <div className="flex border-b border-gray-200 mb-4">
                            <button 
                                className={`px-4 py-2 text-sm font-medium ${activeTab === 'minuman' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                                onClick={() => setActiveTab('minuman')}
                            >
                                <i className="ri-cup-line mr-1"></i>
                                Minuman
                            </button>
                            <button 
                                className={`px-4 py-2 text-sm font-medium ${activeTab === 'makanan' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                                onClick={() => setActiveTab('makanan')}
                            >
                                <i className="ri-restaurant-line mr-1"></i>
                                Makanan
                            </button>
                            <button 
                                className={`px-4 py-2 text-sm font-medium ${activeTab === 'snack' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                                onClick={() => setActiveTab('snack')}
                            >
                                <i className="ri-cake-line mr-1"></i>
                                Snack
                            </button>
                        </div>
                        
                        {/* Menu Items */}
                        <div className="space-y-3">
                            {menuItems[activeTab].map((item, index) => (
                                <div key={index} className="flex items-center p-2 hover:bg-blue-50 rounded-lg transition-colors">
                                    <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="w-16 h-16 object-cover rounded-lg mr-3"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                                        <p className="text-xs text-gray-500 mb-1">{item.desc}</p>
                                        <div className="flex items-center">
                                            <span className="text-sm font-semibold text-blue-700">Rp {item.price}</span>
                                        </div>
                                    </div>
                                    <button className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
                                        <i className="ri-add-line"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Lokasi */}
        <section id="location" className="mb-8 bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            <i className="ri-map-pin-line mr-2 text-blue-600"></i> Lokasi Strategis
          </h2>
          <div className="h-56 bg-blue-200 rounded-lg mb-3 overflow-hidden shadow">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d809.8671932386756!2d106.8189271213288!3d-6.357376754627543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69edd20620a009%3A0x6f0694db8cd39a05!2sCavelatte%20%7C%20Cofee%20%26%20Eatery!5e0!3m2!1sen!2sid!4v1745322396484!5m2!1sen!2sid"
                className="w-full h-full border-0 rounded-lg"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="space-y-3 text-gray-700 text-sm">
              <div className="flex items-start">
                <i className="ri-building-2-line mt-1 mr-2 text-blue-600"></i>
                <div>
                  <p className="font-medium">Alamat Lengkap</p>
                  <p>Jl. Rawa Pule 1 No. 24, Kukusan, Beji, Depok</p>
                </div>
              </div>
              <div className="flex items-start">
                <i className="ri-timer-line mt-1 mr-2 text-blue-600"></i>
                <div>
                  <p className="font-medium">Akses Mudah</p>
                  <p>5 menit ke UI, 10 menit ke Margo City</p>
                </div>
              </div>
              <div className="flex items-start">
                <i className="ri-bus-line mt-1 mr-2 text-blue-600"></i>
                <div>
                  <p className="font-medium">Transportasi</p>
                  <p>Dekat halte bus & stasiun Depok</p>
                </div>
              </div>
              <a 
                href="https://maps.google.com?q=Jl.+Rawa+Pule+1+No.+24,+RT+02/02,+Kukusan,+Beji,+Depok" 
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center shadow-md"
              >
                <i className="ri-navigation-line mr-2"></i> Buka di Google Maps
              </a>
            </div>
        </section>
                    
                    {/* Review */}
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6" id="review">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-semibold text-blue-800">Ulasan</h2>
                            <Link to="#" className="text-sm text-blue-600 font-medium">Lihat Semua</Link>
                        </div>
                        
                        {/* Review Items */}
                        <div className="space-y-4">
                            <div className="border-b border-gray-100 pb-3">
                                <div className="flex items-center mb-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
                                        <i className="ri-user-smile-line"></i>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-600">Ahmad R.</h4>
                                        <div className="flex text-yellow-400 text-xs">
                                            <i className="ri-star-fill"></i>
                                            <i className="ri-star-fill"></i>
                                            <i className="ri-star-fill"></i>
                                            <i className="ri-star-fill"></i>
                                            <i className="ri-star-fill"></i>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">Tempatnya nyaman banget, buat ngerjain tugas atau kerja sambil ngopi enak. Wifi kenceng!</p>
                            </div>
                            
                            <div className="border-b border-gray-100 pb-3">
                                <div className="flex items-center mb-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
                                        <i className="ri-user-smile-line"></i>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-600">Siti N.</h4>
                                        <div className="flex text-yellow-400 text-xs">
                                            <i className="ri-star-fill"></i>
                                            <i className="ri-star-fill"></i>
                                            <i className="ri-star-fill"></i>
                                            <i className="ri-star-fill"></i>
                                            <i className="ri-star-line"></i>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">Suasananya adem, kolam ikannya bikin betah. Menu makanannya juga enak-enak!</p>
                            </div>
                        </div>
                        
                        {/* Write Review */}
                        <button className="mt-3 flex items-center justify-center w-full py-2 bg-blue-50 rounded-lg text-blue-600 text-sm font-medium">
                            <i className="ri-edit-line mr-1"></i>
                            Tulis Ulasan
                        </button>
                    </div>
                </div>
            </main>

            {/* Bottom Navbar */}
            <BottomNavbar />
        </div>
    );
}

export default Cavelatte;