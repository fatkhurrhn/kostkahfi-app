import React, { useState, useRef, useEffect } from 'react';

export default function TesChatBot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Konichiwa! 👋 Aku virtual assistant Kost Al Kahfi nih~ 🏡\n\n<small class='text-orange-600'>Info penting: Saat ini semua kamar sudah terisi penuh ya gaes!</small>\n\nAku bisa bantu jawab pertanyaan seputar:\n• Kamar & fasilitas 🛏️\n• Harga & pembayaran 💰\n• Aturan kost 📅\n• Lokasi & akses 📍\n\nLangsung tanya aja yaa...",
      sender: 'bot',
    },
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Quick Replies
  const quickReplies = [
    "Ada kamar kosong?",
    "Berapa harga sewa?",
    "Lokasi tepatnya dimana?",
    "Bisa lihat foto kamar?",
    "Ada wifi ga?",
    "Boleh bawa teman?",
    "Jam malam sampai kapan?",
    "Ada video tour?"
  ];

  // Auto scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Typing dots animation
  const TypingDots = () => (
    <div className="flex space-x-1">
      {[...Array(3)].map((_, i) => (
        <div 
          key={i}
          className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );

  // Auto responses
  const getAutoResponse = (question) => {
    const q = question.toLowerCase();
    
    // Kamar & Fasilitas
    if (q.includes('kamar') && (q.includes('kosong') || q.includes('tersedia'))) {
      return {
        text: "Waduh... 😅\nMaaf ya, semua kamar di Kost Al Kahfi udah full booked nih~ \n\nTapi kamu bisa:\n1. Tanya info buat referensi\n2. Hubungi pengelola buat waiting list\n3. Cek video tour dulu: <a href='https://youtu.be/qb1dQafhWQY' target='_blank' class='text-orange-600 underline'>Tonton di YouTube</a>\n\n<b>Kontak pengelola:</b>\n📞 <a href='tel:082285512813' class='text-orange-600'>0822-8551-2813</a> (WA available)",
        quickReplies: ["Video tour?", "Kontak pengelola"]
      };
    }
    
    if (q.includes('ukuran') || q.includes('besar') || q.includes('luas')) {
      return {
        text: "Ukuran kamar standar kita 3x4 meter (cukup buat 1 orang nyaman kok~)\n\nIsinya udah include:\n• Ranjang\n• Kasur\n• Lemari\n• Meja belajar\n• Kursi\n• Toilet dalam\n\nKalo mau lebih lengkap bisa liat <a href='/kamar' class='text-orange-600 underline'>foto kamar</a> langsung",
        quickReplies: ["Fasilitas lengkap?", "Ada foto kamar?"]
      };
    }
    
    if (q.includes('ac') || q.includes('angin') || q.includes('kipas')) {
      return {
        text: "Nggak ada AC bawaan dari kost nya sih... 😅\n\nTapi kamu boleh:\n• Bawa kipas angin sendiri\n• Pasang AC (tambah biaya listrik)\n• Atau nebeng sewa AC bareng temen sekamar\n\nFYI: Udara di sini lumayan adem kok, deket sama area kampus UI yang banyak pohon~",
        quickReplies: ["Biaya listrik?", "Boleh pasang alat elektronik?"]
      };
    }
    
    if (q.includes('mandi') || q.includes('toilet') || q.includes('km')) {
      return {
        text: "Yoi! Setiap kamar udah ada toilet + shower di dalam~ 🚿\n\nFasilitas kamar mandi:\n• Kloset duduk\n• Shower\n• Wastafel\n• Keran air normal (ada air panas dingin)\n\nJangan lupa bawa perlengkapan mandi sendiri ya! 😉",
        quickReplies: ["Ada mesin cuci?", "Dapur umum?"]
      };
    }
    
    if (q.includes('parkir') || q.includes('motor') || q.includes('mobil')) {
      return {
        text: "Ada dong! 🏍️🚗\n\nArea parkir kita:\n• Khusus motor: Ada di setiap gedung\n• Untuk mobil: Taman parkir depan\n• Aman 24 jam (ada CCTV)\n\n<b>Catatan:</b>\n• Gratis buat penghuni\n• Kalo ada tamu, lapor ke penjaga dulu yaa",
        quickReplies: ["Ada CCTV?", "Siapa penjaganya?"]
      };
    }
    
    if (q.includes('wifi') || q.includes('internet')) {
      return {
        text: "Nih info WiFi kita~ 🌐\n\n• <b>WiFi gratis</b> cuma ada di lobby (jangkauan terbatas)\n• Tiap gedung biasanya patungan WiFi sendiri (rata-rata 50rb/bln)\n• Speed: 10-20Mbps (cukup buat streaming & meeting online)\n\nKalo mau lebih stabil, bisa paket internet sendiri aja 😄",
        quickReplies: ["Biaya tambahan?", "Fasilitas umum?"]
      };
    }
    
    // Harga & Pembayaran
    if (q.includes('harga') || q.includes('sewa') || q.includes('biaya')) {
      return {
        text: "Ini daftar harganya ya~ 💸\n\n<b>Kamar Standard:</b>\n• Rp750.000 - 1.200.000/bln (tergantung lantai & gedung)\n\n<b>Sudah termasuk:</b>\n• Air & listrik dasar\n• Kebersihan umum\n• Fasilitas bersama\n\n<b>Extra:</b>\n• WiFi gedung: ~50rb/bln (opsional)\n• Laundry: ada mesin cuci coin\n\nPembayaran fleksibel bisa per bulan!",
        quickReplies: ["Ada deposit?", "Bisa transfer bank?"]
      };
    }
    
    if (q.includes('tambahan') || q.includes('listrik') || q.includes('air')) {
      return {
        text: "Nah ini detail biaya tambahannya~ 💡💧\n\n• <b>Air:</b> Gratis (udah include)\n• <b>Listrik:</b> Gratis buat pemakaian normal\n• <b>WiFi:</b> Kalo mau yg gedung ~50rb/bln\n\nKalo pakai AC/alat listrik besar, ada tambahan biaya listrik per kWh (itung pakai token)",
        quickReplies: ["Boleh pasang AC?", "Biaya token listrik?"]
      };
    }
    
    if (q.includes('bayar') || q.includes('pembayaran') || q.includes('transfer')) {
      return {
        text: "Pembayaran bisa pilih yang mana aja~ 💳\n\n• Cash langsung ke pengelola\n• Transfer bank (BCA/Mandiri)\n• E-wallet (OVO/DANA)\n\n<b>Catatan:</b>\n• Nggak ada biaya admin\n• Bayar sebelum tanggal 5 setiap bulan\n• Nggak ada kontrak mengikat\n\nPaling gampang sih bayar cash pas ketemu om kost 😆",
        quickReplies: ["Minimal sewa?", "Ada kontrak?"]
      };
    }
    
    if (q.includes('deposit') || q.includes('jaminan')) {
      return {
        text: "Alhamdulillah kita <b>nggak ada deposit</b> sama sekali! 🎉\n\nCuma bayar:\n1. Sewa bulan pertama\n2. Kalo mau WiFi gedung (+50rb)\n\nGitu aja, simpel kan? 😊",
        quickReplies: ["Syarat sewa?", "Dokumen perlu apa?"]
      };
    }
    
    // Aturan Kost
    if (q.includes('teman') || q.includes('menginap') || q.includes('visit')) {
      return {
        text: "Soal bawa temen nih~ 👫\n\n<b>Boleh-boleh aja</b> asal:\n• Lapor ke penjaga dulu\n• Nggak mengganggu penghuni lain\n• Cuma untuk keperluan penting\n• Maksimal 1-2 hari\n\nKalo cuma mau nongkrong, mending ke Cavelatte aja yaa~ ☕",
        quickReplies: ["Apa itu Cavelatte?", "Jam malam?"]
      };
    }
    
    if (q.includes('masak') || q.includes('kompor') || q.includes('memasak')) {
      return {
        text: "Untuk urusan masak-masak~ 🍳\n\n<b>Di kamar:</b>\n• Boleh pake rice cooker/panci listrik\n• Jangan pake kompor gas (bahaya)\n\n<b>Dapur umum:</b>\n• Ada kompor gas 2 tungku\n• Kulkas bersama\n• Peralatan masak dasar\n\nJangan lupa bersihkan setelah pakai yaa! 😇",
        quickReplies: ["Dapur buka jam berapa?", "Ada warung dekat?"]
      };
    }
    
    if (q.includes('jam malam') || q.includes('gerbang') || q.includes('kunci')) {
      return {
        text: "Nih jadwal gerbang kost~ ⏰\n\n<b>Buka:</b> 5.00 - 22.00 WIB\n<b>Tutup:</b> 22.00 - 5.00 WIB\n\nTapi tenang aja, penghuni dikasih:\n• PIN akses gerbang\n• Kunci pagar darurat\n\nKalo pulang malem, hati-hati yaa! 🚨",
        quickReplies: ["Ada penjaga malam?", "Kontak darurat?"]
      };
    }
    
    if (q.includes('hewan') || q.includes('kucing') || q.includes('pelihara')) {
      return {
        text: "Waduh... soal hewan peliharaan nih~ 🐱\n\n<b>Peraturan:</b>\n• Nggak boleh bawa hewan peliharaan\n• Tapi di kost udah ada kucing kampung\n• Kucing-kucingnya friendly & diurus bareng\n\nJadi kalo suka kucing, bisa main sama si Oyen & kawan-kawan 😸",
        quickReplies: ["Ada CCTV?", "Penjaga kost siapa?"]
      };
    }
    
    if (q.includes('elektronik') || q.includes('pasang') || q.includes('alat')) {
      return {
        text: "Untuk alat elektronik nih~ 🔌\n\n<b>Boleh:</b>\n• Lampu tambahan\n• Kipas angin\n• Rice cooker\n• TV kecil\n\n<b>Nggak boleh:</b>\n• AC tanpa ijin\n• Alat listrik watt tinggi\n• Pemanas air\n\nKalo ragu, tanya om kost dulu yaa!",
        quickReplies: ["Biaya listrik?", "Ada stopkontak banyak?"]
      };
    }
    
    // Lokasi & Akses
    if (q.includes('lokasi') || q.includes('alamat') || q.includes('maps')) {
      return {
        text: "Ini alamat lengkap kita~ 🗺️\n\n<b>Kost Al Kahfi</b>\nJl. Rw. Pule I No.24, RT 02\nKukusan, Beji, Depok\n\n📍 <a href='https://maps.app.goo.gl/iVsCbC5sxibLzd376' target='_blank' class='text-orange-600 underline'>Buka di Google Maps</a>\n\n<b>Deket dengan:</b>\n• Kampus UI (10 menit jalan kaki)\n• Stasiun Pondok Cina\n• Warung & minimarket\n\nKalo nyasar, WA om kost aja 😉",
        quickReplies: ["Akses kendaraan umum?", "Ada angkot?"]
      };
    }
    
    if (q.includes('kampus') || q.includes('ui') || q.includes('universitas')) {
      return {
        text: "Kost kita <b>super deket</b> sama kampus UI nih! 🎓\n\n<b>Rute ke UI:</b>\n1. Jalan kaki 10 menit ke gerbang UI\n2. Lewat taman tengah (lebih cepat)\n3. Ada shuttle kampus lewat depan\n\n<b>Fasilitas mahasiswa:</b>\n• WiFi kampus bisa dipake\n• Banyak warung murah\n• Lingkungan tenang buat belajar\n\nPerfect buat anak UI! 😍",
        quickReplies: ["Ada kosongan?", "Harga khusus mahasiswa?"]
      };
    }
    
    if (q.includes('angkot') || q.includes('transportasi') || q.includes('ojek')) {
      return {
        text: "Soal transportasi nih~ 🚌\n\n<b>Kendaraan umum:</b>\n• Angkot: Nggak ada yang lewat depan\n• Ojek online: Bisa pesen (Grab/Gojek)\n• Shuttle kampus: Ada rute deket sini\n\n<b>Saran:</b>\n• Punya motor lebih enak\n• Kalo mau hemat bisa jalan kaki\n• Atau patungan beli sepeda bekas 😄",
        quickReplies: ["Parkir aman?", "Sewa motor ada?"]
      };
    }
    
    if (q.includes('minimarket') || q.includes('warung') || q.includes('makan')) {
      return {
        text: "Tempat makan & belanja deket sini~ 🛒🍜\n\n<b>Warung terdekat:</b>\n• 2 menit jalan kaki (depan komplek)\n• Buka 24 jam\n• Nasi goreng legendaris!\n\n<b>Minimarket:</b>\n• Indomaret: 5 menit motor\n• Alfamidi: 7 menit jalan kaki\n\n<b>Tips:</b> Coba mie ayam depan gerbang, enak banget! 😋",
        quickReplies: ["Boleh masak di kamar?", "Dapur umum?"]
      };
    }
    
    // Kebersihan & Keamanan
    if (q.includes('bersih') || q.includes('sampah') || q.includes('kebersihan')) {
      return {
        text: "Kita jaga kebersihan bareng-bareng ya~ 🧹\n\n<b>Jadwal bersih-bersih:</b>\n• Sampah diambil: 2 hari sekali\n• Kamar mandi dibersihkan: 1 minggu sekali\n• Area umum: Setiap hari\n\n<b>Peraturan:</b>\n• Sampah harian taruh di depan kamar\n• Jangan numpuk barang di koridor\n• Kotor = denda 50rb! 😱",
        quickReplies: ["Ada petugas kebersihan?", "Denda lainnya?"]
      };
    }
    
    if (q.includes('petugas') || q.includes('kebersihan') || q.includes('cleaning')) {
      return {
        text: "Tim kebersihan kita nih~ 🧽\n\n• <b>Pak Joko</b> - bersihin kamar mandi & sampah\n• <b>Bu Siti</b> - sapu & pel area umum\n• <b>Penghuni</b> - wajib jaga kebersihan kamar sendiri\n\nKerjanya pagi hari (8-11), kalo mau request bersihin kamar bisa kasih tips ke mereka 😉",
        quickReplies: ["Jadwal bersih-bersih?", "Ada denda?"]
      };
    }
    
    if (q.includes('aman') || q.includes('keamanan') || q.includes('cctv')) {
      return {
        text: "Keamanan kost kita oke banget kok! 🔒\n\n<b>Sistem keamanan:</b>\n• CCTV 24 jam (8 titik)\n• Penjaga malam (Mas Iqbal)\n• Gerbang otomatis\n• PIN akses penghuni\n\n<b>Catatan:</b>\n• Jangan kasih PIN ke orang luar\n• Kalo ada masalah, langsung WA om kost\n• Lingkungan sekitar juga aman sih~",
        quickReplies: ["Kontak darurat?", "Penjaga kost siapa?"]
      };
    }
    
    if (q.includes('penjaga') || q.includes('satpam') || q.includes('security')) {
      return {
        text: "Ini tim keamanan kita~ 🛡️\n\n<b>Siang:</b>\n• Mas Iqbal (08.00-20.00)\n\n<b>Malam:</b>\n• Pak Bambang (20.00-08.00)\n\nMereka bisa bantu:\n• Terima paket\n• Jaga tamu\n• Buka gerbang\n\nSopan-sopan ya sama penjaga~ 😊",
        quickReplies: ["Kontak penjaga?", "Ada CCTV?"]
      };
    }
    
    // Administrasi
    if (q.includes('booking') || q.includes('pesan') || q.includes('sewa')) {
      return {
        text: "Cara booking kamar gampang banget~ ✍️\n\n1. Hubungi om kost: <a href='tel:082285512813' class='text-orange-600'>0822-8551-2813</a>\n2. Janjian liat kamar (kalo ada yg kosong)\n3. Bayar bulan pertama\n4. Dapet kunci & selesai!\n\n<b>FYI:</b> Saat ini semua kamar full, bisa daftar waiting list dulu",
        quickReplies: ["Waiting list bagaimana?", "Bisa transfer dulu?"]
      };
    }
    
    if (q.includes('kontrak') || q.includes('perjanjian') || q.includes('aturan')) {
      return {
        text: "Kita <b>nggak pake kontrak</b> ribet kok~ 📝\n\nCukup:\n• Bayar per bulan\n• Ikut aturan dasar kost\n• Nggak merusak fasilitas\n\nKalo mau pindah, kasih tau 1 minggu sebelumnya aja. Gampang kan? 😄",
        quickReplies: ["Minimal sewa?", "Denda kalau pindah?"]
      };
    }
    
    if (q.includes('minimal') || q.includes('lama') || q.includes('bulan')) {
      return {
        text: "Sewa kamar kita fleksibel banget~ 🗓️\n\n<b>Minimal:</b> 3 bulan\n<b>Maksimal:</b> Bebas\n\nTapi biasanya penghuni betah sampe lulus loh 😆\n\nKalo mau pindah, kasih tau 1 minggu sebelumnya aja~",
        quickReplies: ["Ada kontrak?", "Bisa per bulan?"]
      };
    }
    
    if (q.includes('dokumen') || q.includes('ktp') || q.includes('syarat')) {
      return {
        text: "Gampang syaratnya~ 📄\n\n<b>Perlu:</b>\n1. Fotokopi KTP\n2. Foto 3x4 (1 lembar)\n3. Uang sewa bulan pertama\n\n<b>Nggak perlu:</b>\n• Surat keterangan\n• Jaminan\n• Kontrak\n\nSantai aja prosesnya, kayak ngobrol sama om kost 😊",
        quickReplies: ["Bisa bayar transfer?", "Ada deposit?"]
      };
    }
    
    // Visual & Info Tambahan
    if (q.includes('foto') || q.includes('kamar') || q.includes('lihat')) {
      return {
        text: "Mau liat kamarnya ya? 📸\n\nIni beberapa referensi:\n• <a href='/kamar' class='text-orange-600 underline'>Foto kamar standar</a>\n• <a href='https://youtu.be/qb1dQafhWQY' target='_blank' class='text-orange-600 underline'>Video tour</a>\n• <a href='https://maps.app.goo.gl/vb8APw8xLCnEQoMq9' target='_blank' class='text-orange-600 underline'>Review di Google Maps</a>\n\nKalo mau liat langsung, bisa janjian sama om kost~",
        quickReplies: ["Video tour?", "Ada kamar kosong?"]
      };
    }
    
    if (q.includes('video') || q.includes('tour') || q.includes('youtube')) {
      return {
        text: "Nih ada video tour lengkap kita~ 🎥\n\n<a href='https://youtu.be/qb1dQafhWQY' target='_blank' class='text-orange-600 underline'>Tonton di YouTube</a>\n\nIsi videonya:\n• Tour semua gedung\n• Lihat kamar kosong\n• Fasilitas umum\n• Area sekitar kost\n\nJangan lupa subscribe channel kita ya! 😉",
        quickReplies: ["Foto kamar?", "Lokasi kost?"]
      };
    }
    
    if (q.includes('review') || q.includes('ulasan') || q.includes('rating')) {
      return {
        text: "Ini beberapa review dari penghuni~ ⭐\n\n<a href='https://maps.app.goo.gl/vb8APw8xLCnEQoMq9' target='_blank' class='text-orange-600 underline'>Baca di Google Maps</a>\n\n<b>Rating rata-rata:</b> 4.7/5\n\n<b>Komentar populer:</b>\n\"Lokasi strategis, deket kampus\"\n\"Pengelolanya ramah-ramah\"\n\"Fasilitas lengkap harganya terjangkau\"\n\nKalo udah jadi penghuni, jangan lupa kasih review juga yaa! 😄",
        quickReplies: ["Ada kamar kosong?", "Kontak pengelola?"]
      };
    }
    
    return null;
  };

  // Generate response
  const generateContent = async (prompt) => {
    const autoResponse = getAutoResponse(prompt);
    if (autoResponse) return autoResponse.text;
    
    try {
      // const response = await fetch('http://localhost:3000/chat', {
      const response = await fetch('https://gemini-server-production-1918.up.railway.app/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: `[Kontekstual untuk Kost Al Kahfi di Depok] Pertanyaan: ${prompt}\n\n` +
                   `Jawab dengan bahasa santai dan friendly seperti anak muda. ` +
                   `Gunakan emoticon sesekali. Jika tidak tahu jawabannya, arahkan ` +
                   `ke kontak pengelola di 082285512813.`
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Server error:', error);
        return "Yah, server lagi error nih 😅\nCoba tanya lagi atau langsung hubungi om kost aja ya:\n📞 <a href='tel:082285512813' class='text-orange-600'>0822-8551-2813</a>";
      }

      const data = await response.json();
      return data.reply || "Aduh aku kurang paham nih 😅\nCoba tanya ke om kost langsung aja yuk:\n📞 <a href='tel:082285512813' class='text-orange-600'>0822-8551-2813</a>";
    } catch (error) {
      console.error('Network error:', error);
      return "Wah koneksiku lagi bermasalah nih~ 😢\nBisa langsung kontak om kost aja ya:\n📞 <a href='tel:082285512813' class='text-orange-600'>0822-8551-2813</a>\nAtau coba lagi nanti yaa!";
    }
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) return;

    // Add user message
    setMessages((prev) => [...prev, { id: Date.now(), text, sender: 'user' }]);
    setInputText('');
    setIsTyping(true);

    // Get response
    const reply = await generateContent(text);
    setIsTyping(false);

    // Add bot message
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + 1, text: reply, sender: 'bot' },
    ]);
  };

  const handleQuickReply = (question) => {
    setInputText(question);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-gray-50">
      <section className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-orange-200">
          <h1 className="text-2xl font-bold text-orange-800 mb-1">
            Kost Al Kahfi <span className="text-orange-600">Chatbot</span>
          </h1>
          <p className="text-orange-600 text-sm">
            Tanya apa aja seputar kost kita~
          </p>
          <div className="mt-2 text-xs text-orange-400">
            🏡 Jl. Rw. Pule I No.24, Kukusan, Depok
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-orange-200">
          {/* Messages */}
          <div className="h-[400px] overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white mr-2 mt-1">
                    🏡
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-orange-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-orange-100 rounded-bl-none shadow-sm'
                  }`}
                  dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }}
                />

                {msg.sender === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 ml-2 mt-1 flex items-center justify-center text-orange-600 border border-orange-200">
                    👤
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white mr-2">
                  🏡
                </div>
                <div className="bg-white px-3 py-2 rounded-lg rounded-bl-none border border-orange-100 shadow-sm">
                  <TypingDots />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-3 bg-orange-50 border-t border-orange-100">
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  className="text-xs bg-white text-orange-700 border border-orange-300 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-all shadow-sm"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-orange-100 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tanya tentang kamar, harga, dll..."
              className="flex-1 border border-orange-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className={`px-4 py-2 rounded-lg ${inputText.trim() ? 'bg-orange-600 hover:bg-orange-700' : 'bg-orange-300 cursor-not-allowed'} text-white transition-colors`}
            >
              Kirim
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-xs text-orange-600">
          <p>Kost Al Kahfi © {new Date().getFullYear()} • 
            <a href="https://wa.me/6282285512813" className="underline ml-1">0822-8551-2813</a>
          </p>
          <p className="mt-1 text-orange-500">Semua kamar saat ini sudah terisi</p>
        </div>
      </section>
    </div>
  );
}