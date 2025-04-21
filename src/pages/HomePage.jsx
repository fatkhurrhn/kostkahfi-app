import BottomNavbar from '../components/BottomNavbar';
import Logo from '/logo.png';

function Home() {
  const galleryImages = [
    { id: 1, title: "Tampak Depan Kost", category: "building" },
    { id: 2, title: "Kamar Tipe Standard", category: "room" },
    { id: 3, title: "Aula Kegiatan", category: "facility" },
    { id: 4, title: "Cavelatte", category: "facility" },
    { id: 5, title: "Kegiatan Mahasantri", category: "activity" },
    { id: 6, title: "Dapur Bersama", category: "facility" },
  ];

  // Fasilitas utama (ditampilkan 6 yang paling penting)
  const mainFacilities = [
    { name: "Kamar Mandi Dalam", icon: "ri-shower-line" },
    { name: "Kasur & Lemari", icon: "ri-hotel-bed-line" },
    { name: "WiFi Cepat", icon: "ri-wifi-line" },
    { name: "Dapur Umum", icon: "ri-restaurant-line" },
    { name: "Aula Kegiatan", icon: "ri-building-line" },
    { name: "Cavelatte", icon: "ri-cup-line" }
  ];

  // Testimonials
  const testimonials = [
    { 
      name: "Ahmad (Mahasantri)", 
      comment: "Dapat kamar gratis karena ikut program, pengelola sangat supportif.", 
      rating: 5 
    },
    { 
      name: "Siti (Biman)", 
      comment: "Program Biman benar-benar mengembangkan soft skill saya.", 
      rating: 5 
    }
  ];

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm py-3 border-b">
        <div className="w-full mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <img src={Logo} alt="Kost Al-Kahfi Logo" className="h-8 mr-2" />
            {/* <span className="text-gray-800 font-bold text-lg">Kost Al-Kahfi</span> */}
          </div>
          <a href="tel:08159080785" className="text-blue-600">
            <i className="ri-phone-line text-[20px]"></i>
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto container mx-auto px-4 pt-[70px] pb-20">
        {/* Hero Section */}
        <section className="mb-8 relative rounded-xl overflow-hidden">
          <img 
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgzlnD-9WXj3tIZOsvklEzhPLVQqwJ3-W0yAh7K9x1uRyBJm_fuHTD88-xPqpt2LCs8GLy5lyZh4bl9NWTw5zusR3kgnluTgJpKVgrr1wceHhsUDPhyZXQ5I2-9ZHWsIORt46ZlDjHjx8iE/s320/kost+ui+kukusan+depok+kahfi+lobby.png" 
            alt="Kost Al-Kahfi" 
            className="w-full h-48 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <h1 className="text-2xl font-bold text-white">Kost Al-Kahfi Depok</h1>
            <p className="text-white text-sm">4 Gedung dengan Fasilitas Lengkap</p>
          </div>
        </section>

        {/* Fasilitas */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            <i className="ri-home-gear-line mr-2 text-blue-600"></i> Fasilitas
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {mainFacilities.map((facility, index) => (
              <div key={index} className="bg-blue-50 p-3 rounded-lg flex items-center">
                <i className={`${facility.icon} text-blue-600 text-xl mr-2`}></i>
                <span className="text-sm text-gray-700">{facility.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <i className="ri-image-line mr-2 text-blue-600"></i> Dokumentasi
            </h2>
            <a href="/gallery" className="text-blue-600 text-sm">Lihat Semua</a>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {galleryImages.slice(0,4).map((image) => (
              <div key={image.id} className="bg-blue-200 rounded-lg aspect-square flex items-center justify-center">
                <i className="ri-image-line text-3xl text-blue-600"></i>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-2">
            {galleryImages.slice(4,6).map((image) => (
              <div key={image.id} className="bg-blue-200 rounded-lg aspect-square flex items-center justify-center">
                <i className="ri-image-line text-2xl text-blue-600"></i>
              </div>
            ))}
            <a href="/gallery" className="bg-blue-100 rounded-lg aspect-square flex items-center justify-center">
              <span className="text-blue-600 text-xs text-center">+{galleryImages.length-5} lebih</span>
            </a>
          </div>
        </section>

        
        {/* Program Unggulan */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            <i className="ri-award-line mr-2 text-blue-600"></i> Program Unggulan
          </h2>
          
          <div className="bg-blue-50 rounded-xl p-4 mb-4">
            <div className="flex items-center mb-2">
              <i className="ri-book-line text-blue-600 text-xl mr-2"></i>
              <h3 className="font-bold text-gray-800">Mahasantri</h3>
            </div>
            <p className="text-gray-700 text-sm mb-3">
              Program pembinaan khusus untuk mahasiswa yang ingin mengkombinasikan kehidupan akademik dan pengembangan diri.
            </p>
            <a href="/mahasantri" className="text-blue-600 text-sm font-medium flex items-center">
              Pelajari lebih lanjut <i className="ri-arrow-right-line ml-1"></i>
            </a>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center mb-2">
              <i className="ri-user-star-line text-blue-600 text-xl mr-2"></i>
              <h3 className="font-bold text-gray-800">Biman</h3>
            </div>
            <p className="text-gray-700 text-sm mb-3">
              Program pengembangan karakter dan kepemimpinan untuk penghuni Kost Al-Kahfi.
            </p>
            <a href="/biman" className="text-blue-600 text-sm font-medium flex items-center">
              Pelajari lebih lanjut <i className="ri-arrow-right-line ml-1"></i>
            </a>
          </div>
        </section>

        {/* Highlight Cavelatte */}
        <section className="mb-8 bg-blue-50 rounded-xl p-4">
          <div className="flex items-center mb-3">
            <i className="ri-cup-line text-2xl text-blue-600 mr-2"></i>
            <h2 className="text-xl font-bold text-gray-800">Cavelatte</h2>
          </div>
          <p className="text-gray-700 mb-3 text-sm">
            Tempat nongkrong eksklusif untuk penghuni Kost Al-Kahfi. Nyaman untuk mengerjakan tugas, meeting, atau sekedar bersantai.
          </p>
          <div className="h-40 bg-blue-200 rounded-lg mb-3 flex items-center justify-center">
            <i className="ri-image-line text-4xl text-blue-600"></i>
          </div>
          <a href="/cavelatte" className="text-blue-600 text-sm font-medium flex items-center justify-end">
            Lihat lebih banyak <i className="ri-arrow-right-line ml-1"></i>
          </a>
        </section>

        {/* Testimoni */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            <i className="ri-chat-quote-line mr-2 text-blue-600"></i> Kata Penghuni
          </h2>
          <div className="space-y-3">
            {testimonials.map((testi, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <i className="ri-user-line text-blue-600"></i>
                  </div>
                  <span className="font-medium">{testi.name}</span>
                  <div className="ml-auto flex">
                    {[...Array(5)].map((_, i) => (
                      <i 
                        key={i} 
                        className={`${i < testi.rating ? 'ri-star-fill' : 'ri-star-line'} text-yellow-400 ml-1`}
                      ></i>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700">"{testi.comment}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* Lokasi */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            <i className="ri-map-pin-line mr-2 text-blue-600"></i> Lokasi Strategis
          </h2>
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="h-40 bg-blue-200 rounded-lg mb-3 flex items-center justify-center">
              <i className="ri-map-2-line text-4xl text-blue-600"></i>
            </div>
            <div className="space-y-2 text-gray-700 text-sm">
              <p className="flex items-center">
                <i className="ri-building-2-line mr-2 text-blue-600"></i>
                Jl. Rawa Pule 1 No. 24, Kukusan, Beji, Depok
              </p>
              <p className="flex items-center">
                <i className="ri-timer-line mr-2 text-blue-600"></i>
                5 menit ke UI, 10 menit ke Margo City
              </p>
              <a 
                href="https://maps.google.com?q=Jl.+Rawa+Pule+1+No.+24,+RT+02/02,+Kukusan,+Beji,+Depok" 
                className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center"
              >
                <i className="ri-navigation-line mr-2"></i> Buka di Google Maps
              </a>
            </div>
          </div>
        </section>


        {/* CTA WhatsApp */}
        <section className="mb-8">
          <a 
            href="https://wa.me/628159080785" 
            className="w-full bg-green-500 text-white py-3 rounded-lg text-sm font-medium flex items-center justify-center shadow-md"
          >
            <i className="ri-whatsapp-line mr-2 text-xl"></i> Hubungi Kami via WhatsApp
          </a>
        </section>
      </div>

      {/* Bottom Navbar */}
      <BottomNavbar />
    </div>
  );
}

export default Home;