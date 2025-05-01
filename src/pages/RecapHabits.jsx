import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Rekapitulasi Amal Yaumiyah Santri</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Santri</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-4 py-2 border rounded"
              >
                <option value="">-- Pilih Santri --</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.nama} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full px-4 py-2 border rounded"
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
                className="w-full px-4 py-2 border rounded"
              >
                {[2024, 2025, 2026].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          
          {userData && (
            <div className="mb-6 p-4 bg-blue-50 rounded">
              <h2 className="text-xl font-semibold text-gray-800">
                Data Santri: {userData.nama} ({userData.email})
              </h2>
            </div>
          )}
        </div>
        
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2">Memuat data...</p>
          </div>
        )}
        
        {!loading && habitsData && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kebiasaan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Persentase
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Detail Harian
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {habitsData.habits.map((habit, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{habit}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${calculateCompletionPercentage(index)}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm font-medium text-gray-700">
                            {calculateCompletionPercentage(index)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => i + 1).map(day => {
                            const dateKey = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const isCompleted = habitsData.completions[dateKey]?.[index] || false;
                            
                            return (
                              <div 
                                key={day} 
                                className={`w-6 h-6 rounded flex items-center justify-center text-xs ${
                                  isCompleted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}
                                title={`Tanggal ${day}`}
                              >
                                {day}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {!loading && !habitsData && selectedUserId && (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">Tidak ada data untuk bulan dan tahun yang dipilih</p>
          </div>
        )}
      </div>
    </div>
  );
}