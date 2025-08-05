// src/components/chatbot/responses.js

export const getAutoResponse = (question) => {
  const q = question.toLowerCase();

  // --- Kampus UI ---
  if (q.includes('kampus') && (q.includes('ui') || q.includes('universitas indonesia'))) {
    return {
      text: "Kost kita <b>super deket</b> sama kampus UI nih! 🎓<br><br>" +
            "<b>Rute ke UI:</b><br>" +
            "• Jalan kaki 10 menit ke gerbang UI<br>" +
            "• Lewat taman tengah (lebih cepat)<br>" +
            "• Ada shuttle kampus lewat depan<br><br>" +
            "<b>Fasilitas mahasiswa:</b><br>" +
            "• WiFi kampus bisa dipake<br>" +
            "• Banyak warung murah<br>" +
            "• Lingkungan tenang buat belajar<br><br>" +
            "Perfect buat anak UI! 😍",
      quickReplies: ["Ada kosongan?", "Harga khusus mahasiswa?"]
    };
  }

  // --- Kampus Gunadarma ---
  if (q.includes('kampus') && (q.includes('gunadarma') || q.includes('ug'))) {
    return {
      text: "Wah kalau ke kampus Gunadarma agak jauh nih, kak~ 🚗<br><br>" +
            "• Jarak sekitar 7-8 km (±20-25 menit naik motor)<br>" +
            "• Bisa lewat Margonda atau Tol Cinere<br>" +
            "• Ojek online juga bisa nyampe kok<br><br>" +
            "Tapi tenang, banyak penghuni kost yang kuliah di Gunadarma juga, jadi bisa patungan onlen barengan 😄",
      quickReplies: ["Ada angkot?", "Boleh sewa motor?"]
    };
  }

  // --- Kampus lain (fallback) ---
  if (q.includes('kampus')) {
    return {
      text: "Lokasi Kost Al Kahfi paling deket ke <b>UI (Universitas Indonesia)</b> nih~ 🎓<br><br>" +
            "Kalau kamu kuliah di kampus lain, bisa kasih tau nama kampusnya, aku bantu cek jarak & aksesnya ya! 😊",
      quickReplies: ["UI", "Gunadarma", "IPB", "Trisakti"]
    };
  }

  // --- Kamar & Fasilitas ---
  if (q.includes('kamar') && (q.includes('kosong') || q.includes('tersedia'))) {
    return {
      text: "Waduh... 😅<br>" +
            "Maaf ya, semua kamar di Kost Al Kahfi udah full booked nih~<br>" +
            "Tapi kamu bisa:<br>" +
            "1. Tanya info buat referensi<br>" +
            "2. Hubungi pengelola buat waiting list<br>" +
            "3. Cek video tour dulu: <a href='https://youtu.be/qb1dQafhWQY' target='_blank' class='text-orange-600 underline'>Tonton di YouTube</a><br>" +
            "<b>Kontak pengelola:</b><br>" +
            "📞 <a href='tel:082285512813' class='text-orange-600'>0822-8551-2813</a> (WA available)",
      quickReplies: ["Video tour?", "Kontak pengelola"]
    };
  }

  if (q.includes('ukuran') || q.includes('besar') || q.includes('luas')) {
    return {
      text: "Ukuran kamar standar kita 3x4 meter (cukup buat 1 orang nyaman kok~)<br>" +
            "Isinya udah include:<br>" +
            "• Ranjang<br>" +
            "• Kasur<br>" +
            "• Lemari<br>" +
            "• Meja belajar<br>" +
            "• Kursi<br>" +
            "• Toilet dalam<br>" +
            "Kalo mau lebih lengkap bisa liat <a href='/kamar' class='text-orange-600 underline'>foto kamar</a> langsung",
      quickReplies: ["Fasilitas lengkap?", "Ada foto kamar?"]
    };
  }

  if (q.includes('ac') || q.includes('angin') || q.includes('kipas')) {
    return {
      text: "Nggak ada AC bawaan dari kost nya sih... 😅<br>" +
            "Tapi kamu boleh:<br>" +
            "• Bawa kipas angin sendiri<br>" +
            "• Pasang AC (tambah biaya listrik)<br>" +
            "• Atau nebeng sewa AC bareng temen sekamar<br>" +
            "FYI: Udara di sini lumayan adem kok, deket sama area kampus UI yang banyak pohon~",
      quickReplies: ["Biaya listrik?", "Boleh pasang alat elektronik?"]
    };
  }

  if (q.includes('mandi') || q.includes('toilet') || q.includes('km')) {
    return {
      text: "Yoi! Setiap kamar udah ada toilet + shower di dalam~ 🚿<br>" +
            "Fasilitas kamar mandi:<br>" +
            "• Kloset duduk<br>" +
            "• Shower<br>" +
            "• Wastafel<br>" +
            "• Keran air normal (ada air panas dingin)<br>" +
            "Jangan lupa bawa perlengkapan mandi sendiri ya! 😉",
      quickReplies: ["Ada mesin cuci?", "Dapur umum?"]
    };
  }

  if (q.includes('parkir') || q.includes('motor') || q.includes('mobil')) {
    return {
      text: "Ada dong! 🏍️🚗<br>" +
            "Area parkir kita:<br>" +
            "• Khusus motor: Ada di setiap gedung<br>" +
            "• Untuk mobil: Taman parkir depan<br>" +
            "• Aman 24 jam (ada CCTV)<br>" +
            "<b>Catatan:</b><br>" +
            "• Gratis buat penghuni<br>" +
            "• Kalo ada tamu, lapor ke penjaga dulu yaa",
      quickReplies: ["Ada CCTV?", "Siapa penjaganya?"]
    };
  }

  if (q.includes('wifi') || q.includes('internet')) {
    return {
      text: "Nih info WiFi kita~ 🌐<br>" +
            "• <b>WiFi gratis</b> cuma ada di lobby (jangkauan terbatas)<br>" +
            "• Tiap gedung biasanya patungan WiFi sendiri (rata-rata 50rb/bln)<br>" +
            "• Speed: 10-20Mbps (cukup buat streaming & meeting online)<br>" +
            "Kalo mau lebih stabil, bisa paket internet sendiri aja 😄",
      quickReplies: ["Biaya tambahan?", "Fasilitas umum?"]
    };
  }

  // --- Harga & Pembayaran ---
  if (q.includes('harga') || q.includes('sewa') || q.includes('biaya')) {
    return {
      text: "Ini daftar harganya ya~ 💸<br>" +
            "<b>Kamar Standard:</b><br>" +
            "• Rp750.000 - 1.200.000/bln (tergantung lantai & gedung)<br>" +
            "<b>Sudah termasuk:</b><br>" +
            "• Air & listrik dasar<br>" +
            "• Kebersihan umum<br>" +
            "• Fasilitas bersama<br>" +
            "<b>Extra:</b><br>" +
            "• WiFi gedung: ~50rb/bln (opsional)<br>" +
            "• Laundry: ada mesin cuci yang mudah di pake<br>",
      quickReplies: ["Ada deposit?", "Bisa transfer bank?"]
    };
  }

  if (q.includes('tambahan') || q.includes('listrik') || q.includes('air')) {
    return {
      text: "Nah ini detail biaya tambahannya~ 💡💧<br>" +
            "• <b>Air:</b> Gratis (udah include)<br>" +
            "• <b>Listrik:</b> Gratis buat pemakaian normal<br>" +
            "• <b>WiFi:</b> Kalo mau yg gedung ~50rb/bln<br>" +
            "Kalo pakai AC/alat listrik besar, ada tambahan biaya listrik per kWh (itung pakai token)",
      quickReplies: ["Boleh pasang AC?", "Biaya token listrik?"]
    };
  }

  if (q.includes('bayar') || q.includes('pembayaran') || q.includes('transfer')) {
    return {
      text: "Pembayaran bisa pilih yang mana aja~ 💳<br>" +
            "• Cash langsung ke pengelola<br>" +
            "• Transfer bank (BCA/Mandiri)<br>" +
            "• E-wallet (OVO/DANA)<br>" +
            "<b>Catatan:</b><br>" +
            "• Nggak ada biaya admin<br>" +
            "• Bayar sebelum tanggal 5 setiap bulan<br>" +
            "• Nggak ada kontrak mengikat<br>" +
            "Paling gampang sih bayar cash pas ketemu om kost 😆",
      quickReplies: ["Minimal sewa?", "Ada kontrak?"]
    };
  }

  if (q.includes('deposit') || q.includes('jaminan')) {
    return {
      text: "Alhamdulillah kita <b>nggak ada deposit</b> sama sekali! 🎉<br>" +
            "Cuma bayar:<br>" +
            "1. Sewa bulan pertama<br>" +
            "2. Kalo mau WiFi gedung (+50rb)<br>" +
            "Gitu aja, simpel kan? 😊",
      quickReplies: ["Syarat sewa?", "Dokumen perlu apa?"]
    };
  }

  // --- Aturan Kost ---
  if (q.includes('teman') || q.includes('menginap') || q.includes('visit')) {
    return {
      text: "Soal bawa temen nih~ 👫<br>" +
            "<b>Boleh-boleh aja</b> asal:<br>" +
            "• Lapor ke penjaga dulu<br>" +
            "• Nggak mengganggu penghuni lain<br>" +
            "• Cuma untuk keperluan penting<br>" +
            "• Maksimal 1-2 hari<br>" +
            "Kalo cuma mau nongkrong, mending ke Cavelatte aja yaa~ ☕",
      quickReplies: ["Apa itu Cavelatte?", "Jam malam?"]
    };
  }

  if (q.includes('masak') || q.includes('kompor') || q.includes('memasak')) {
    return {
      text: "Untuk urusan masak-masak~ 🍳<br>" +
            "<b>Di kamar:</b><br>" +
            "• Boleh pake rice cooker/panci listrik<br>" +
            "• Jangan pake kompor gas (bahaya)<br>" +
            "<b>Dapur umum:</b><br>" +
            "• Ada kompor gas 2 tungku<br>" +
            "• Kulkas bersama<br>" +
            "• Peralatan masak dasar<br>" +
            "Jangan lupa bersihkan setelah pakai yaa! 😇",
      quickReplies: ["Dapur buka jam berapa?", "Ada warung dekat?"]
    };
  }

  if (q.includes('jam malam') || q.includes('gerbang') || q.includes('kunci')) {
    return {
      text: "Nih jadwal gerbang kost~ ⏰<br>" +
            "<b>Buka:</b> 5.00 - 22.00 WIB<br>" +
            "<b>Tutup:</b> 22.00 - 5.00 WIB<br>" +
            "Tapi tenang aja, penghuni dikasih:<br>" +
            "• PIN akses gerbang<br>" +
            "• Kunci pagar darurat<br>" +
            "Kalo pulang malem, hati-hati yaa! 🚨",
      quickReplies: ["Ada penjaga malam?", "Kontak darurat?"]
    };
  }

  if (q.includes('hewan') || q.includes('kucing') || q.includes('pelihara')) {
    return {
      text: "Waduh... soal hewan peliharaan nih~ 🐱<br>" +
            "<b>Peraturan:</b><br>" +
            "• Nggak boleh bawa hewan peliharaan<br>" +
            "• Tapi di kost udah ada kucing kampung<br>" +
            "• Kucing-kucingnya friendly & diurus bareng<br>" +
            "Jadi kalo suka kucing, bisa main sama si Oyen & kawan-kawan 😸",
      quickReplies: ["Ada CCTV?", "Penjaga kost siapa?"]
    };
  }

  // --- Lokasi & Akses ---
  if (q.includes('lokasi') || q.includes('alamat') || q.includes('maps')) {
    return {
      text: "Ini alamat lengkap kita~ 🗺️<br>" +
            "<b>Kost Al Kahfi</b><br>" +
            "Jl. Rw. Pule I No.24, RT 02<br>" +
            "Kukusan, Beji, Depok<br>" +
            "📍 <a href='https://maps.app.goo.gl/iVsCbC5sxibLzd376' target='_blank' class='text-orange-600 underline'>Buka di Google Maps</a><br>" +
            "<b>Deket dengan:</b><br>" +
            "• Kampus UI (10 menit jalan kaki)<br>" +
            "• Stasiun Pondok Cina<br>" +
            "• Warung & minimarket<br>" +
            "Kalo nyasar, WA om kost aja 😉",
      quickReplies: ["Akses kendaraan umum?", "Ada angkot?"]
    };
  }

  if (q.includes('angkot') || q.includes('transportasi') || q.includes('ojek')) {
    return {
      text: "Soal transportasi nih~ 🚌<br>" +
            "<b>Kendaraan umum:</b><br>" +
            "• Angkot: Nggak ada yang lewat depan<br>" +
            "• Ojek online: Bisa pesen (Grab/Gojek)<br>" +
            "• Shuttle kampus: Ada rute deket sini<br>" +
            "<b>Saran:</b><br>" +
            "• Punya motor lebih enak<br>" +
            "• Kalo mau hemat bisa jalan kaki<br>" +
            "• Atau patungan beli sepeda bekas 😄",
      quickReplies: ["Parkir aman?", "Sewa motor ada?"]
    };
  }

  if (q.includes('minimarket') || q.includes('warung') || q.includes('makan')) {
    return {
      text: "Tempat makan & belanja deket sini~ 🛒🍜<br>" +
            "<b>Warung terdekat:</b><br>" +
            "• 2 menit jalan kaki (depan komplek)<br>" +
            "• Buka 24 jam<br>" +
            "• Nasi goreng legendaris!<br>" +
            "<b>Minimarket:</b><br>" +
            "• Indomaret: 5 menit motor<br>" +
            "• Alfamidi: 7 menit jalan kaki<br>" +
            "<b>Tips:</b> Coba mie ayam depan gerbang, enak banget! 😋",
      quickReplies: ["Boleh masak di kamar?", "Dapur umum?"]
    };
  }

  // --- Visual & Info Tambahan ---
  if (q.includes('foto') || q.includes('kamar') || q.includes('lihat')) {
    return {
      text: "Mau liat kamarnya ya? 📸<br>" +
            "• <a href='/kamar' class='text-orange-600 underline'>Foto kamar standar</a><br>" +
            "• <a href='https://youtu.be/qb1dQafhWQY' target='_blank' class='text-orange-600 underline'>Video tour</a><br>" +
            "• <a href='https://maps.app.goo.gl/vb8APw8xLCnEQoMq9' target='_blank' class='text-orange-600 underline'>Review di Google Maps</a><br>" +
            "Kalo mau liat langsung, bisa janjian sama om kost~",
      quickReplies: ["Video tour?", "Ada kamar kosong?"]
    };
  }

  if (q.includes('video') || q.includes('tour') || q.includes('youtube')) {
    return {
      text: "Nih ada video tour lengkap kita~ 🎥<br>" +
            "<a href='https://youtu.be/qb1dQafhWQY' target='_blank' class='text-orange-600 underline'>Tonton di YouTube</a><br>" +
            "Isi videonya:<br>" +
            "• Tour semua gedung<br>" +
            "• Lihat kamar kosong<br>" +
            "• Fasilitas umum<br>" +
            "• Area sekitar kost<br>" +
            "Jangan lupa subscribe channel kita ya! 😉",
      quickReplies: ["Foto kamar?", "Lokasi kost?"]
    };
  }

  if (q.includes('review') || q.includes('ulasan') || q.includes('rating')) {
    return {
      text: "Ini beberapa review dari penghuni~ ⭐<br>" +
            "<a href='https://maps.app.goo.gl/vb8APw8xLCnEQoMq9' target='_blank' class='text-orange-600 underline'>Baca di Google Maps</a><br>" +
            "<b>Rating rata-rata:</b> 4.7/5<br>" +
            "<b>Komentar populer:</b><br>" +
            "\"Lokasi strategis, deket kampus\"<br>" +
            "\"Pengelolanya ramah-ramah\"<br>" +
            "\"Fasilitas lengkap harganya terjangkau\"<br>" +
            "Kalo udah jadi penghuni, jangan lupa kasih review juga yaa! 😄",
      quickReplies: ["Ada kamar kosong?", "Kontak pengelola?"]
    };
  }

  // --- Default: Tidak ditemukan ---
  return null;
};