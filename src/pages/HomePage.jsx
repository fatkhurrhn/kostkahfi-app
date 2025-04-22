import BottomNavbar from '../components/BottomNavbar';
import Logo from '/logo.png';

function Home() {
  // Fasilitas utama
  const mainFacilities = [
    { name: "Kamar Mandi Dalam", icon: "ri-showers-line" },
    { name: "Kasur & Lemari", icon: "ri-hotel-bed-line" },
    { name: "WiFi Cepat", icon: "ri-wifi-line" },
    { name: "Dapur Umum", icon: "ri-restaurant-line" },
    { name: "Aula Kegiatan", icon: "ri-building-line" },
    { name: "Cavelatte", icon: "ri-cup-line" },
    { name: "Laundry", icon: "ri-t-shirt-line" },
    { name: "Parkir Aman", icon: "ri-car-line" }
  ];

  // Testimonials
  const testimonials = [
    { 
      name: "Ahmad (Mahasantri)", 
      comment: "Dapat kamar gratis karena ikut program, pengelola sangat supportif.", 
      rating: 5,
      date: "2 minggu lalu"
    },
    { 
      name: "Siti (Biman)", 
      comment: "Program Biman benar-benar mengembangkan soft skill saya.", 
      rating: 5,
      date: "1 bulan lalu"
    },
    { 
      name: "Budi (Mahasiswa UI)", 
      comment: "Lokasi sangat strategis, dekat kampus dan tempat makan.", 
      rating: 4,
      date: "3 bulan lalu"
    }
  ];

  // Promo
  const promos = [
    {
      title: "Promo Awal Tahun",
      description: "Diskon 20% untuk pendaftaran bulan ini",
      validUntil: "30 Juni 2024"
    },
    {
      title: "Beasiswa Mahasantri",
      description: "Kesempatan dapat kamar gratis + uang saku",
      validUntil: "15 Juli 2024"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-blue-600 z-50 shadow-md py-3">
        <div className="w-full mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            {/* <img src={Logo} alt="Kost Al-Kahfi Logo" className="h-8 mr-2" /> */}
            <span className="text-white font-bold text-lg">Kost Al-Kahfi</span>
          </div>
          <div className="flex space-x-3">
            <a href="tel:08159080785" className="text-white">
              <i className="ri-phone-line text-xl"></i>
            </a>
            <a href="https://wa.me/628159080785" className="text-white">
              <i className="ri-whatsapp-line text-xl"></i>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto container mx-auto px-4 pt-[70px] pb-24">
        {/* Promo Banner */}
        <div className="mb-4 relative rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-lg">Promo Spesial!</h3>
                <p className="text-blue-100 text-sm">Diskon 20% untuk pendaftaran bulan ini</p>
              </div>
              <div className="bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                BARU
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="mb-6 relative rounded-xl overflow-hidden shadow-md">
          <div className="relative h-48 w-full">
            <img 
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgzlnD-9WXj3tIZOsvklEzhPLVQqwJ3-W0yAh7K9x1uRyBJm_fuHTD88-xPqpt2LCs8GLy5lyZh4bl9NWTw5zusR3kgnluTgJpKVgrr1wceHhsUDPhyZXQ5I2-9ZHWsIORt46ZlDjHjx8iE/s320/kost+ui+kukusan+depok+kahfi+lobby.png" 
              alt="Kost Al-Kahfi" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h1 className="text-2xl font-bold text-white">Kost Al-Kahfi Depok</h1>
              <p className="text-blue-100 text-sm">4 Gedung dengan Fasilitas Lengkap</p>
              <div className="flex items-center mt-2">
                <div className="flex items-center mr-4">
                  <i className="ri-star-fill text-yellow-400 mr-1"></i>
                  <span className="text-white text-sm">4.9 (128 reviews)</span>
                </div>
                <div className="flex items-center">
                  <i className="ri-map-pin-2-fill text-blue-200 mr-1"></i>
                  <span className="text-white text-sm">Kukusan, Depok</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <a href="#facilities" className="bg-white rounded-lg p-2 text-center shadow-sm">
            <i className="ri-home-gear-line text-blue-600 text-xl block mb-1"></i>
            <span className="text-xs text-gray-700">Fasilitas</span>
          </a>
          <a href="#programs" className="bg-white rounded-lg p-2 text-center shadow-sm">
            <i className="ri-award-line text-blue-600 text-xl block mb-1"></i>
            <span className="text-xs text-gray-700">Program</span>
          </a>
          <a href="#gallery" className="bg-white rounded-lg p-2 text-center shadow-sm">
            <i className="ri-image-line text-blue-600 text-xl block mb-1"></i>
            <span className="text-xs text-gray-700">Gallery</span>
          </a>
          <a href="#location" className="bg-white rounded-lg p-2 text-center shadow-sm">
            <i className="ri-map-pin-line text-blue-600 text-xl block mb-1"></i>
            <span className="text-xs text-gray-700">Lokasi</span>
          </a>
        </div>

        {/* Fasilitas */}
        <section id="facilities" className="mb-8 bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <i className="ri-home-gear-line mr-2 text-blue-600"></i> Fasilitas Kami
            </h2>
            <a href="/facilities" className="text-blue-600 text-sm">Lihat Semua</a>
          </div>
          <div className="grid grid-cols-2 gap-3">
          {mainFacilities.map((facility, index) => (
              <div key={index} className="bg-blue-50 p-3 rounded-lg flex items-center shadow-sm">
                <div className="bg-blue-100 w-10 h-10 flex items-center justify-center rounded-full mr-3">
                  <i className={`${facility.icon} text-blue-600 text-lg`}></i>
                </div>
                <span className="text-sm text-gray-700 font-medium">{facility.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section id="gallery" className="mb-8 bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <i className="ri-image-line mr-2 text-blue-600"></i> Dokumentasi
            </h2>
            <a href="/gallery" className="text-blue-600 text-sm">Lihat Semua</a>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="aspect-square rounded-lg overflow-hidden shadow">
              <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhkq9rpqVR08NY9ImgYezuUEhozn4p3p32jOHcombHafgWu6qvoua3qgPAkqXocej7BHe4c6DnLN3YS8BDijefFV7P3MAyjjV1kE-Qsfc5w5smZOgzDkUfuadqLB6X8E8Rfe31uZExvPDwE/s320/kost+samping+UI+depok2.jpg" 
                className="w-full h-full object-cover" 
                alt="Tampak depan kost"
              />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden shadow">
              <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg4a0eCC4te68wBRzVlLBNVOoYnIla4fj7YUcxVaPFC3OvT3F7u2nV7ZFPVwi09XYa9C7LkuPJU-e6s8oYX3ubwWZZ61I9d8Iu3wYqI7mTpqmnXKgfImeD1SEIBoJlrOZjxB46Xn8rehCav/s400/kost+kosan+dekat+ui+depok+7.jpg" 
                className="w-full h-full object-cover" 
                alt="Kamar kost"
              />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden shadow">
              <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgTd9-m7mw-k8gLeFiTGFiXBfKKYxRz74TGcg1a-99iVWYeKHLYKqxc-r4-KTS9SmOacPpxNnGBE2wfeoK4D2nGQzuhv566FPjgzrlPvewkNDwqCcGKDuJzMzY48DOe25H8K0LfoSlBHD8u/s400/kost+dekat+UI+kutek.jpg" 
                className="w-full h-full object-cover" 
                alt="Fasilitas umum"
              />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden shadow">
              <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjt0zVF3T7bA5er94hf6lLPJ2hSFlEvqCgu-f24C_C4G-F4QWbOc-qWntHdhK3ppXUOMLWW1W18MyC3rzZi90Nt6fG2yrY1SAq2235rwbMdvWtiPHBV1rTjmktwRfQGqEdtMeraQpFDrVlF/s1600/KOST+UI+DEPOK+KUTEK+KAHFI2.JPG" 
                className="w-full h-full object-cover" 
                alt="Area sekitar kost"
              />
            </div>
          </div>
          
          <div className="mt-3">
            <a href="/gallery" className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center">
              Lihat Galeri Lengkap <i className="ri-arrow-right-line ml-2"></i>
            </a>
          </div>
        </section>
        
        {/* Program Unggulan */}
        <section id="programs" className="mb-8 bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            <i className="ri-award-line mr-2 text-blue-600"></i> Program Unggulan
          </h2>
          
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-4 mb-4 text-white">
            <div className="flex items-center mb-2">
              <div className="bg-white/20 p-2 rounded-full mr-3">
                <i className="ri-book-line text-xl"></i>
              </div>
              <h3 className="font-bold text-lg">Mahasantri</h3>
            </div>
            <p className="text-blue-100 text-sm mb-3">
              Program pembinaan khusus untuk mahasiswa yang ingin mengkombinasikan kehidupan akademik dan pengembangan diri.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs bg-white/20 px-2 py-1 rounded">Gratis Kamar</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded">Uang Saku</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded">Mentoring</span>
            </div>
            <a href="/mahasantri" className="mt-3 inline-block text-white text-sm font-medium flex items-center">
              Pelajari lebih lanjut <i className="ri-arrow-right-line ml-1"></i>
            </a>
          </div>
          
          <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-xl p-4 text-white">
            <div className="flex items-center mb-2">
              <div className="bg-white/20 p-2 rounded-full mr-3">
                <i className="ri-user-star-line text-xl"></i>
              </div>
              <h3 className="font-bold text-lg">Biman</h3>
            </div>
            <p className="text-blue-100 text-sm mb-3">
              Program pengembangan karakter dan kepemimpinan untuk penghuni Kost Al-Kahfi.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs bg-white/20 px-2 py-1 rounded">Soft Skill</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded">Leadership</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded">Networking</span>
            </div>
            <a href="/biman" className="mt-3 inline-block text-white text-sm font-medium flex items-center">
              Pelajari lebih lanjut <i className="ri-arrow-right-line ml-1"></i>
            </a>
          </div>
        </section>

        {/* Highlight Cavelatte */}
        <section className="mb-8 bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center mb-3">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <i className="ri-cup-line text-xl text-blue-600"></i>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Cavelatte</h2>
          </div>
          <p className="text-gray-700 mb-3 text-sm">
            Tempat nongkrong eksklusif untuk penghuni Kost Al-Kahfi. Nyaman untuk mengerjakan tugas, meeting, atau sekedar bersantai.
          </p>
          <div className="relative h-48 rounded-lg mb-3 overflow-hidden shadow">
            <img 
              src="https://asset.kompas.com/crops/N6R6BU6e6q_bpFOxVTl4WReHXbc=/101x66:899x599/1200x800/data/photo/2023/04/08/6431098ec2fdf.jpg" 
              alt="Cavelatte" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <p className="text-white text-sm font-medium">Free coffee setiap Senin pagi!</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="aspect-square bg-blue-100 rounded-lg overflow-hidden">
              <img 
                src="https://img.freepik.com/free-photo/coffee-cup-cafe_1417-1426.jpg" 
                className="w-full h-full object-cover"
                alt="Coffee corner"
              />
            </div>
            <div className="aspect-square bg-blue-100 rounded-lg overflow-hidden">
              <img 
                src="https://img.freepik.com/free-photo/people-working-modern-coworking-office_23-2149161308.jpg" 
                className="w-full h-full object-cover"
                alt="Working space"
              />
            </div>
            <div className="aspect-square bg-blue-100 rounded-lg overflow-hidden">
              <img 
                src="https://img.freepik.com/free-photo/group-diverse-people-having-business-meeting_53876-25060.jpg" 
                className="w-full h-full object-cover"
                alt="Meeting space"
              />
            </div>
          </div>
          <a href="/cavelatte" className="text-blue-600 text-sm font-medium flex items-center justify-end">
            Lihat lebih/ banyak <i className="ri-arrow-right-line ml-1"></i>;
          </a>
        </section>

        {/* Promo Section */}
        <section className="mb-8 bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            <i className="ri-percent-line mr-2 text-blue-600"></i> Promo Spesial
          </h2>
          
          <div className="space-y-3">
            {promos.map((promo, index) => (
              <div key={index} className="border border-blue-200 rounded-xl p-3">
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                    <i className="ri-gift-line text-lg"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{promo.title}</h3>
                    <p className="text-gray-600 text-sm mb-1">{promo.description}</p>
                    <p className="text-blue-600 text-xs">
                      <i className="ri-time-line mr-1"></i> Berlaku hingga {promo.validUntil}
                    </p>
                  </div>
                </div>
                <a href="/promo" className="mt-2 inline-block text-blue-600 text-sm font-medium flex items-center">
                  Klaim sekarang <i className="ri-arrow-right-line ml-1"></i>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Testimoni */}
        <section className="mb-8 bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <i className="ri-chat-quote-line mr-2 text-blue-600"></i> Kata Penghuni
            </h2>
            <a href="/testimonials" className="text-blue-600 text-sm">Lihat Semua</a>
          </div>
          <div className="space-y-4">
            {testimonials.map((testi, index) => (
              <div key={index} className="bg-blue-50 rounded-xl p-4 text-gray-800">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <i className="ri-user-line text-blue-600"></i>
                  </div>
                  <div className="flex-1">
                    <span className="font-medium block">{testi.name}</span>
                    <span className="text-gray-500 text-xs">{testi.date}</span>
                  </div>
                  <div className="flex">
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
        <section id="location" className="mb-8 bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            <i className="ri-map-pin-line mr-2 text-blue-600"></i> Lokasi Strategis
          </h2>
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="h-56 bg-blue-200 rounded-lg mb-3 overflow-hidden shadow">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d308.8196818436734!2d106.81910581003186!3d-6.364835593827771!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ec1eaa42e9f7%3A0x34274ff0079e7e5d!2sJl.%20Rawa%20Pule%201%20No.24%2C%20Kukusan%2C%20Beji%2C%20Depok!5e0!3m2!1sen!2sid!4v1710000000000"
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
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 rounded-2xl p-6 text-center text-white shadow-md mb-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-blue-500 opacity-50">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 opacity-30">
                                <path fill="#ffffff" fillOpacity="1" d="M0,96L48,106.7C96,117,192,139,288,133.3C384,128,480,96,576,106.7C672,117,768,171,864,186.7C960,203,1056,181,1152,170.7C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                            </svg>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-3">Tertarik Kost di Al-Kahfi?</h3>
                            <p className="text-blue-100 mb-5">Hubungi kami sekarang untuk info lebih lanjut atau kunjungan</p>
                            <div className="flex justify-center space-x-3">
                                <button className="bg-white text-blue-700 px-5 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                                <i className="ri-phone-line mr-2"></i> Telepon
                                </button>
                                <button className="bg-blue-700 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors">
                                <i className="ri-whatsapp-line mr-2"></i> WhatsApp
                                </button>
                            </div>
                        </div>
                    </section>

        {/* FAQ Section */}
        <section className="mb-8 bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            <i className="ri-question-line mr-2 text-blue-600"></i> Pertanyaan Umum
          </h2>
          <div className="space-y-3 text-gray-700">
            <div className="border-b border-gray-200 pb-3">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span>Berapa harga sewa per bulan?</span>
                  <i className="ri-arrow-down-s-line group-open:rotate-180 transition-transform"></i>
                </summary>
                <p className="text-gray-600 mt-2 text-sm">
                  Harga mulai dari Rp 1.200.000 - Rp 2.500.000 tergantung tipe kamar dan fasilitas. Ada diskon khusus untuk mahasiswa UI.
                </p>
              </details>
            </div>
            <div className="border-b border-gray-200 pb-3">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span>Apakah ada kontrak minimal?</span>
                  <i className="ri-arrow-down-s-line group-open:rotate-180 transition-transform"></i>
                </summary>
                <p className="text-gray-600 mt-2 text-sm">
                  Ya, kontrak minimal 6 bulan. Untuk program Mahasantri, kontrak mengikuti durasi program.
                </p>
              </details>
            </div>
            <div className="border-b border-gray-200 pb-3">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span>Boleh membawa tamu?</span>
                  <i className="ri-arrow-down-s-line group-open:rotate-180 transition-transform"></i>
                </summary>
                <p className="text-gray-600 mt-2 text-sm">
                  Boleh dengan beberapa ketentuan: Tamu hanya boleh di area umum (tidak boleh masuk kamar), maksimal sampai jam 9 malam, dan harus lapor ke pengelola.
                </p>
              </details>
            </div>
          </div>
          <a href="/faq" className="mt-3 inline-block text-blue-600 text-sm font-medium flex items-center">
            Lihat FAQ lengkap <i className="ri-arrow-right-line ml-1"></i>
          </a>
        </section>
      </main>

      {/* Bottom Navbar */}
      <BottomNavbar />
    </div>
  );
}

export default Home;