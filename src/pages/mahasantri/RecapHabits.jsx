import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-gray-50">
              {/* Header */}
              <div className="sticky pb-3 top-0 left-0 right-0 bg-white z-50 border-b border-gray-300 py-3 shadow-sm">
        <div className="w-full max-w-2xl mx-auto px-4 flex justify-between items-center">
          <h3 className="text-black flex items-center gap-2 cursor-pointer" onClick={() => navigate(-1)}>
            <i className="ri-arrow-left-line text-lg"></i> Daily Habits
          </h3>
          <div className="flex items-center space-x-4">
            <i className="ri-notification-3-line text-lg text-gray-700"></i>
            <i className="ri-user-line text-lg text-gray-700"></i>
          </div>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 pt-7">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Santri</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  {months.map((month, index) => (
                    <option key={month.value} value={index + 1}>
                      {month.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  {[2024, 2025, 2026].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {userData && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
              <h2 className="text-md font-semibold text-gray-800 flex items-center">
                <i className="ri-user-3-line mr-2 text-blue-600"></i>
                {userData.nama}
              </h2>
              <p className="text-xs text-gray-600 mt-1">{userData.email}</p>
            </div>
          )}
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-blue-800 font-medium">Memuat data...</p>
          </div>
        )}
        
        {/* Habits Data */}
        {!loading && habitsData && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200">
              {habitsData.habits.map((habit, index) => (
                <div key={index} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-800 text-sm">{habit}</h3>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {calculateCompletionPercentage(index)}%
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full" 
                        style={{ width: `${calculateCompletionPercentage(index)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => i + 1).map(day => {
                      const dateKey = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const isCompleted = habitsData.completions[dateKey]?.[index] || false;
                      
                      return (
                        <div 
                          key={day} 
                          className={`w-5 h-5 rounded-sm flex items-center justify-center text-[10px] ${
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
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="ri-file-search-line text-xl text-gray-400"></i>
            </div>
            <h3 className="text-gray-800 font-medium text-sm mb-1">Tidak ada data</h3>
            <p className="text-xs text-gray-500">Tidak ada data untuk bulan dan tahun yang dipilih</p>
          </div>
        )}
      </div>
    </div>
  );
}