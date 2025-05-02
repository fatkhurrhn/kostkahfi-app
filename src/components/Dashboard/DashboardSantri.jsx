import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

export default function DashboardSantri() {
  const { currentUser, logout } = useAuth();

  if (!currentUser || currentUser.role !== 'santri') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-md">
          <h1 className="text-2xl font-bold text-red-500">Unauthorized Access</h1>
          <p>You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Santri Navbar */}
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Santri Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span>Hello, {currentUser?.nama}</span>
            <button 
              onClick={logout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard Santri</h1>
        <div className="grid grid-cols-1 gap-6">
          {/* Santri Profile */}
          <div className="mt-6 bg-white p-6 rounded shadow text-gray-800">
            <h2 className="text-2xl font-semibold mb-4">Profile Santri</h2>
            <div className="space-y-3">
              <p><span className="font-medium">Nama:</span> {currentUser?.nama}</p>
              <p><span className="font-medium">Email:</span> {currentUser?.email}</p>
              <p><span className="font-medium">Role:</span> {currentUser?.role}</p>
              <p><span className="font-medium">Tanggal Daftar:</span> {currentUser?.createdAt?.toDate().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Amal Yaumiyah */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Amal Yaumiyah</h2>
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
    "Tahajud 🌙🙏",
    "Sholat Subuh 🌅🙏",
    "Al-Matsurat Pagi 📿📖",
    "Istigfar min 100x 🙏🕌",
    "Sedekah subuh 🤲💰",
    "Minum air putih 💧🥤",
    "Olahraga 🏃‍♂️💪",
    "Dhuha ☀️🙏",
    "Baca Buku 📚👓",
    "Mendengarkan Kajian/Podcast 🎧",
    "Sholat Dzuhur ☀️🙏",
    "Sholat Ashar 🌇🙏",
    "Al-Matsurat Petang 📿📖",
    "Sholat Maghrib 🌆🙏",
    "Sholat Isya 🌙🙏",
    "Sholat Rawatib 🌙🙏",
    "Tilawah minimal 4 Halaman 📖"
  ];

  const months = [
    { name: "Januari", value: "01", days: 31 },
    { name: "Februari", value: "02", days: 28 },
    { name: "Maret", value: "03", days: 31 },
    { name: "April", value: "04", days: 30 },
    { name: "Mei", value: "05", days: 31 },
    { name: "Juni", value: "06", days: 30 },
    { name: "Juli", value: "07", days: 31 },
    { name: "Agustus", value: "08", days: 31 },
    { name: "September", value: "09", days: 30 },
    { name: "Oktober", value: "10", days: 31 },
    { name: "November", value: "11", days: 30 },
    { name: "Desember", value: "12", days: 31 }
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
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          className="px-4 py-2 border rounded"
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
          className="px-4 py-2 border rounded"
        >
          {[2024, 2025, 2026].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-gray-800">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-100 text-left sticky left-0 z-10">Kegiatan</th>
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                <th key={day} className="border p-2 bg-gray-100 text-center">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.map((habit, habitIndex) => (
              <tr key={habitIndex}>
                <td className="border p-2 bg-white sticky left-0 z-10">{habit}</td>
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                  const dateKey = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const isCompleted = habitsData.completions[dateKey]?.[habitIndex] || false;
                  const editable = isDateEditable(day);
                  
                  return (
                    <td key={day} className="border p-1 bg-white text-center">
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={() => handleCheckboxChange(day, habitIndex)}
                        disabled={!editable}
                        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}