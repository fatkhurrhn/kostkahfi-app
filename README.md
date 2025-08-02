# Kost Kahfi - Sistem Manajemen Kos

![Kost Kahfi Logo](https://cdn-icons-png.freepik.com/512/7718/7718888.png)

Sistem manajemen kos modern berbasis web untuk memudahkan pengelolaan kos secara digital.

## 🚀 Fitur Utama

### 🏠 Manajemen Kamar
- Daftar kamar lengkap dengan fasilitas
- Sistem booking online
- Status ketersediaan real-time

### 👨‍💼 Manajemen Penghuni
- Registrasi penghuni baru
- Data lengkap penghuni
- Riwayat pembayaran otomatis

### 💳 Sistem Pembayaran
- Tagihan bulanan otomatis
- Konfirmasi pembayaran online
- Notifikasi jatuh tempo

### 📊 Admin Dashboard
- Monitoring penghuni
- Laporan keuangan
- Multi-role access (admin, staff, penghuni)

## Teknologi

**Frontend:**
- React.js
- Tailwind CSS
- React Router

**Backend:**
- Firebase Firestore
- Firebase Authentication

## Instalasi

1. Clone repo:
```bash
git clone https://github.com/fatkhurrhn/kostkahfi-app.git
cd kost-kahfi
```
2. Install dependencies:
```bash
npm install
```

3. Buat file .env:
```bash
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_id
```

4. Jalankan:
```bash
npm start
```

## Struktur Folder
```bash
kost-kahfi/
├── public/
├── src/
│   ├── assets/            # Gambar, icon, dll
│   ├── components/        # Komponen reusable
│   ├── pages/             # Halaman aplikasi
│   │   ├── admin/         # Dashboard admin
│   │   ├── auth/          # Autentikasi
│   │   ├── home/          # Halaman utama
│   │   └── user/          # Dashboard penghuni
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   ├── App.js             # Main App component
│   └── index.js           # Entry point
├── firebase.js            # Firebase config
├── package.json
└── README.md
```