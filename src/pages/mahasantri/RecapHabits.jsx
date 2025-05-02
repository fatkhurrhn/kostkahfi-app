import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

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

export default function RecapHabits() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [habitsData, setHabitsData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load all santri users (role = 'santri')
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'santri'));
        const usersSnapshot = await getDocs(q);
        const usersList = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Calculate days in month
  const getDaysInMonth = (month, year) => {
    const monthObj = months[month - 1];
    let days = monthObj.days;
    
    if (month === 2) {
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      days = isLeapYear ? 29 : 28;
    }
    
    return days;
  };

  // Load habits data when filters change
  useEffect(() => {
    const loadData = async () => {
      if (!selectedUserId) return;
      
      setLoading(true);
      const monthYear = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
      
      try {
        // Get user data
        const userDoc = await getDoc(doc(db, 'users', selectedUserId));
        setUserData(userDoc.data());

        // Get habits data
        const docRef = doc(db, 'daily_habits', `${selectedUserId}_${monthYear}`);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setHabitsData(docSnap.data());
        } else {
          setHabitsData(null);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [selectedUserId, selectedMonth, selectedYear]);

  const calculateCompletionPercentage = (habitIndex) => {
    if (!habitsData || !habitsData.completions) return 0;
    
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    let completed = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (habitsData.completions[dateKey]?.[habitIndex]) {
        completed++;
      }
    }
    
    return Math.round((completed / daysInMonth) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Rekapitulasi Amal Yaumiyah Santri</h1>
          <p className="text-gray-600">Pantau perkembangan kebiasaan harian santri</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Santri</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              >
                <option value="">-- Pilih Santri --</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.nama} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bulan</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                >
                  {months.map((month, index) => (
                    <option key={month.value} value={index + 1}>
                      {month.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-200 rounded-lg text-gray-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                >
                  {[2024, 2025, 2026].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {userData && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <i className="ri-user-3-line mr-2 text-blue-600"></i>
                {userData.nama}
              </h2>
              <p className="text-sm text-gray-600 mt-1">{userData.email}</p>
            </div>
          )}
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-blue-800 font-medium">Memuat data...</p>
          </div>
        )}
        
        {/* Habits Data */}
        {!loading && habitsData && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-200">
              {habitsData.habits.map((habit, index) => (
                <div key={index} className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-gray-800">{habit}</h3>
                    <span className="text-sm font-medium text-blue-600">
                      {calculateCompletionPercentage(index)}%
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${calculateCompletionPercentage(index)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => i + 1).map(day => {
                      const dateKey = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const isCompleted = habitsData.completions[dateKey]?.[index] || false;
                      
                      return (
                        <div 
                          key={day} 
                          className={`w-6 h-6 rounded-md flex items-center justify-center text-xs ${
                            isCompleted 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}
                          title={`Tanggal ${day}`}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {!loading && !habitsData && selectedUserId && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-file-search-line text-2xl text-gray-400"></i>
            </div>
            <h3 className="text-gray-800 font-medium mb-1">Tidak ada data</h3>
            <p className="text-sm text-gray-500">Tidak ada data untuk bulan dan tahun yang dipilih</p>
          </div>
        )}
      </div>
    </div>
  );
}