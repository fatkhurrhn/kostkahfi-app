import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';

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
  { name: "Februari", value: "02", days: 28 }, // Akan diupdate untuk tahun kabisat
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

export default function AmalYaumiyah() {
  const { currentUser } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [daysInMonth, setDaysInMonth] = useState(31);
  const [habitsData, setHabitsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Update days in month based on selected month and year
  useEffect(() => {
    const monthObj = months[selectedMonth - 1];
    let days = monthObj.days;
    
    // Handle February for leap years
    if (selectedMonth === 2) {
      const isLeapYear = (selectedYear % 4 === 0 && selectedYear % 100 !== 0) || (selectedYear % 400 === 0);
      days = isLeapYear ? 29 : 28;
    }
    
    setDaysInMonth(days);
  }, [selectedMonth, selectedYear]);

  // Load habits data from Firebase
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
          // Create new document if not exists
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
    
    // Only allow editing today or past dates
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