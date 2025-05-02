import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import { signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import LogoutConfirmModal from '../LogoutConfirmModal';


export default function DashboardSantri() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/mahasantri");
    } catch (error) {
      console.error("Error logging out: ", error);
      alert("Logout gagal: " + error.message);
    }
  };


  if (!currentUser || currentUser.role !== 'santri') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-xl font-bold text-red-500 mb-2">Akses Ditolak</h1>
          <p className="text-gray-600">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal Konfirmasi */}
            <LogoutConfirmModal
              isOpen={showLogoutModal}
              onClose={() => setShowLogoutModal(false)}
              onConfirm={handleLogout}
            />
      {/* Santri Navbar */}
      <nav className="bg-blue-600 text-white p-3 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-lg font-bold">Dashboard Santri</h1>
          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline text-sm">Hello, {currentUser?.nama}</span>
            <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Logout
          </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-4">
        <div className="space-y-4">
          {/* Santri Profile */}
          <div className="bg-white p-4 rounded-lg shadow-sm text-gray-800">
            <h2 className="text-xl font-semibold mb-3">Profil Santri</h2>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Nama:</span> {currentUser?.nama}</p>
              <p><span className="font-medium">Email:</span> {currentUser?.email}</p>
              {/* <p><span className="font-medium">Tanggal Daftar:</span> {currentUser?.createdAt?.toDate().toLocaleDateString()}</p> */}
              <p><span className="font-medium">Login Terakhir:</span> {new Date(currentUser?.metadata?.lastSignInTime).toLocaleDateString()}</p>

            </div>
          </div>

          {/* Amal Yaumiyah */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Amal Yaumiyah</h2>
            <AmalYaumiyahComponent currentUser={currentUser} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Amal Yaumiyah Component
function AmalYaumiyahComponent({ currentUser }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [daysInMonth, setDaysInMonth] = useState(31);
  const [habitsData, setHabitsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const habits = [
    "Sholat Tahajud",
    "Sholat Subuh",
    "Al-Matsurat",
    "Istigfar 100x",
    "Sedekah",
    "Air putih",
    "Olahraga",
    "Sholat Dhuha",
    "Baca Buku ",
    "Kajian/podcast",
    "Sholat Dzuhur",
    "Sholat Ashar",
    "Al-Matsurat",
    "Sholat Maghrib",
    "Sholat Isya",
    "Rawatib",
    "Tilawah Al-Qur'an"
  ];

  const months = [
    { name: "Jan", value: "01", days: 31 },
    { name: "Feb", value: "02", days: 28 },
    { name: "Mar", value: "03", days: 31 },
    { name: "Apr", value: "04", days: 30 },
    { name: "Mei", value: "05", days: 31 },
    { name: "Jun", value: "06", days: 30 },
    { name: "Jul", value: "07", days: 31 },
    { name: "Ags", value: "08", days: 31 },
    { name: "Sep", value: "09", days: 30 },
    { name: "Okt", value: "10", days: 31 },
    { name: "Nov", value: "11", days: 30 },
    { name: "Des", value: "12", days: 31 }
  ];

  useEffect(() => {
    const monthObj = months[selectedMonth - 1];
    let days = monthObj.days;
    
    if (selectedMonth === 2) {
      const isLeapYear = (selectedYear % 4 === 0 && selectedYear % 100 !== 0) || (selectedYear % 400 === 0);
      days = isLeapYear ? 29 : 28;
    }
    
    setDaysInMonth(days);
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    const loadData = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      const monthYear = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
      const docRef = doc(db, 'daily_habits', `${currentUser.uid}_${monthYear}`);
      
      try {
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setHabitsData(docSnap.data());
        } else {
          const newData = {
            userId: currentUser.uid,
            monthYear,
            habits,
            completions: {}
          };
          
          await setDoc(docRef, newData);
          setHabitsData(newData);
        }
      } catch (error) {
        console.error("Error loading habits data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [currentUser, selectedMonth, selectedYear]);

  const handleCheckboxChange = async (day, habitIndex) => {
    if (!currentUser || !habitsData) return;
    
    const today = new Date();
    const currentDate = new Date(selectedYear, selectedMonth - 1, day);
    
    if (currentDate > today) return;
    
    const dateKey = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const updatedCompletions = { ...habitsData.completions };
    
    if (!updatedCompletions[dateKey]) {
      updatedCompletions[dateKey] = Array(habits.length).fill(false);
    }
    
    updatedCompletions[dateKey][habitIndex] = !updatedCompletions[dateKey][habitIndex];
    
    try {
      const docRef = doc(db, 'daily_habits', `${currentUser.uid}_${habitsData.monthYear}`);
      await updateDoc(docRef, {
        completions: updatedCompletions
      });
      
      setHabitsData({
        ...habitsData,
        completions: updatedCompletions
      });
    } catch (error) {
      console.error("Error updating habit:", error);
    }
  };

  const isDateEditable = (day) => {
    const today = new Date();
    const currentDate = new Date(selectedYear, selectedMonth - 1, day);
    return currentDate <= today;
  };

  if (loading || !habitsData) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          className="px-3 py-1 border rounded bg-white text-gray-800 text-sm"
        >
          {months.map((month, index) => (
            <option key={month.value} value={index + 1}>
              {month.name}
            </option>
          ))}
        </select>
        
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="px-3 py-1 border rounded bg-white text-gray-800 text-sm"
        >
          {[2024, 2025, 2026].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
  <div className="min-w-max bg-white rounded-lg shadow-sm">
    {/* Header - Days */}
    <div className="flex border-b border-gray-200">
      <div className="w-32 min-w-[8rem] p-2 font-medium text-sm text-gray-800 bg-gray-50">
        Kegiatan
      </div>
      <div className="flex">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
          <div 
            key={day} 
            className="w-10 min-w-[2.5rem] p-1 text-center text-xs font-medium text-gray-800 bg-gray-50"
          >
            {day}
          </div>
        ))}
      </div>
    </div>
    
    {/* Rows - Habits */}
    <div className="divide-y divide-gray-200">
      {habits.map((habit, habitIndex) => (
        <div key={habitIndex} className="flex hover:bg-gray-50 transition-colors">
          <div className="w-32 min-w-[8rem] p-2 text-sm text-gray-800 truncate">
            {habit}
          </div>
          <div className="flex">
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const dateKey = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isCompleted = habitsData.completions[dateKey]?.[habitIndex] || false;
              const editable = isDateEditable(day);
              
              return (
                <div 
                  key={day} 
                  className="w-10 min-w-[2.5rem] p-1 flex items-center justify-center"
                >
                  <button
                    onClick={() => handleCheckboxChange(day, habitIndex)}
                    disabled={!editable}
                    className={`
                      w-6 h-6 rounded border-2 flex items-center justify-center transition-all
                      ${isCompleted ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'}
                      ${editable ? 
                        'cursor-pointer hover:border-blue-300 active:scale-95' : 
                        'cursor-not-allowed opacity-40'
                      }
                    `}
                    aria-label={`Toggle habit ${habit} untuk tanggal ${day}`}
                  >
                    {isCompleted && (
                      <span className="text-green-600 text-sm">✓</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Catatan: Anda hanya bisa mencentang untuk hari yang sudah lewat atau hari ini.</p>
      </div>
    </div>
  );
}