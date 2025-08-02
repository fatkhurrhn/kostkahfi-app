import React, { useEffect, useState } from 'react';
import Layout from '../../components/admin/Layout';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';

// Register ChartJS components
ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

export default function DashboardAdmin() {
    const [stats, setStats] = useState({
        users: 0,
        blogPosts: 0,
        comments: 0,
        payments: 0,
        rooms: 0,
        revenue: 0
    });
    const [recentPayments, setRecentPayments] = useState([]);
    const [recentBlogs, setRecentBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);
    const [userGrowth, setUserGrowth] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch all data in parallel
                const [
                    usersSnapshot,
                    blogSnapshot,
                    commentsSnapshot,
                    paymentsSnapshot,
                    roomsSnapshot
                ] = await Promise.all([
                    getDocs(collection(db, 'users')),
                    getDocs(collection(db, 'blog')),
                    getDocs(collection(db, 'komentar-blog')),
                    getDocs(collection(db, 'pembayaran')),
                    getDocs(collection(db, 'kamar'))
                ]);

                // Calculate total revenue (using 'nominal' field)
                let totalRevenue = 0;
                paymentsSnapshot.forEach(doc => {
                    const payment = doc.data();
                    if (payment.nominal) {
                        totalRevenue += parseFloat(payment.nominal);
                    }
                });

                // Get recent 5 payments
                const paymentsData = paymentsSnapshot.docs
                    .sort((a, b) => b.data().tanggal?.toDate() - a.data().tanggal?.toDate())
                    .slice(0, 5)
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        tanggal: doc.data().tanggal?.toDate().toLocaleDateString()
                    }));

                // Get recent 5 blog posts with comment count
                const blogsData = await Promise.all(
                    blogSnapshot.docs
                        .sort((a, b) => b.data().createdAt?.toDate() - a.data().createdAt?.toDate())
                        .slice(0, 5)
                        .map(async doc => {
                            const commentsQuery = query(
                                collection(db, 'komentar-blog'),
                                where('blogId', '==', doc.id)
                            );
                            const comments = await getDocs(commentsQuery);

                            return {
                                id: doc.id,
                                ...doc.data(),
                                createdAt: doc.data().createdAt?.toDate().toLocaleDateString(),
                                commentCount: comments.size
                            };
                        })
                );

                // Hitung data bulanan
                const monthlyRevenueData = calculateMonthlyData(paymentsSnapshot.docs);
                setMonthlyRevenue(monthlyRevenueData);

                // Hitung pertumbuhan pengguna
                const userGrowthData = calculateUserGrowth(usersSnapshot.docs);
                setUserGrowth(userGrowthData);
                
                console.log('Monthly revenue data:', monthlyRevenueData);
                console.log('User growth data:', userGrowthData);

                setStats({
                    users: usersSnapshot.size,
                    blogPosts: blogSnapshot.size,
                    comments: commentsSnapshot.size,
                    payments: paymentsSnapshot.size,
                    rooms: roomsSnapshot.size,
                    revenue: totalRevenue
                });

                setRecentPayments(paymentsData);
                setRecentBlogs(blogsData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const calculateMonthlyData = (paymentDocs) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
        const currentYear = new Date().getFullYear();
        const monthlyData = Array(12).fill(0);

        paymentDocs.forEach(doc => {
            const payment = doc.data();
            if (payment.tanggal) {
                const date = payment.tanggal.toDate();
                if (date.getFullYear() === currentYear) {
                    const month = date.getMonth();
                    monthlyData[month] += payment.nominal ? parseFloat(payment.nominal) : 0;
                }
            }
        });

        return {
            labels: months,
            data: monthlyData
        };
    };

    const calculateUserGrowth = (userDocs) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
        const currentYear = new Date().getFullYear();
        const monthlyCounts = Array(12).fill(0);

        userDocs.forEach(doc => {
            const userData = doc.data();
            if (userData.createdAt) {
                const date = userData.createdAt.toDate();
                if (date.getFullYear() === currentYear) {
                    const month = date.getMonth();
                    monthlyCounts[month]++;
                }
            }
        });

        // Hitung akumulasi
        const cumulativeCounts = monthlyCounts.map((sum => value => sum += value)(0));

        return {
            labels: months,
            data: cumulativeCounts
        };
    };

    // Chart data configurations
    const userGrowthChartData = {
        labels: userGrowth.labels,
        datasets: [
            {
                label: 'Pertumbuhan Pengguna',
                data: userGrowth.data,
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }
        ]
    };

    const revenueChartData = {
        labels: monthlyRevenue.labels,
        datasets: [
            {
                label: 'Pendapatan Bulanan (Rp)',
                data: monthlyRevenue.data,
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 2
            }
        ]
    };

    const contentStatsData = {
        labels: ['Artikel', 'Komentar'],
        datasets: [
            {
                data: [stats.blogPosts, stats.comments],
                backgroundColor: [
                    'rgba(99, 102, 241, 0.7)',
                    'rgba(236, 72, 153, 0.7)'
                ],
                borderWidth: 1
            }
        ]
    };

    if (loading) {
        return (
            <Layout>
                <div className="p-6 flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
                    <div className="relative max-w-md w-full">
                        <input
                            type="text"
                            className="bg-white text-gray-800 focus:ring-1 focus:ring-gray-100 w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none pl-10"
                            placeholder="Cari..."
                        />
                        <i className="ri-search-line absolute left-3 top-3 text-gray-400"></i>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-8">
                    <StatCard
                        icon="ri-user-line"
                        title="Pengguna"
                        value={stats.users}
                        change="+12% bulan ini"
                        color="bg-blue-100 text-blue-600"
                    />
                    <StatCard
                        icon="ri-article-line"
                        title="Artikel"
                        value={stats.blogPosts}
                        change="+5% bulan ini"
                        color="bg-green-100 text-green-600"
                    />
                    <StatCard
                        icon="ri-hotel-line"
                        title="Kamar"
                        value={stats.rooms}
                        change="+2% bulan ini"
                        color="bg-yellow-100 text-yellow-600"
                    />
                    <StatCard
                        icon="ri-money-dollar-circle-line"
                        title="Pembayaran"
                        value={stats.payments}
                        change="+15% bulan ini"
                        color="bg-red-100 text-red-600"
                    />
                    <StatCard
                        icon="ri-bank-card-line"
                        title="Pendapatan"
                        value={`Rp ${stats.revenue.toLocaleString('id-ID')}`}
                        change="+18% bulan ini"
                        color="bg-teal-100 text-teal-600"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Pertumbuhan Pengguna</h2>
                            <div className="flex space-x-2">
                                <button className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded">Tahun Ini</button>
                                <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded">Bulan Ini</button>
                            </div>
                        </div>
                        <div className="h-80">
                            <Line
                                data={userGrowthChartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Pendapatan Bulanan</h2>
                            <div className="flex space-x-2">
                                <button className="px-3 py-1 text-xs bg-green-100 text-green-600 rounded">2025</button>
                                <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded">2026</button>
                            </div>
                        </div>
                        <div className="h-80">
                            <Bar
                                data={revenueChartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            ticks: {
                                                callback: function (value) {
                                                    return 'Rp ' + value.toLocaleString('id-ID');
                                                }
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Additional Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Statistik Konten</h2>
                            <i className="ri-pie-chart-line text-gray-500"></i>
                        </div>
                        <div className="h-64">
                            <Pie
                                data={contentStatsData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                        },
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Aktivitas Terkini</h2>
                            <i className="ri-notification-line text-gray-500"></i>
                        </div>
                        <div className="space-y-4">
                            {recentPayments.slice(0, 3).map((payment, index) => (
                                <div key={index} className="flex items-start">
                                    <div className="bg-green-100 p-2 rounded-full mr-3">
                                        <i className="ri-wallet-3-line text-green-600"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Pembayaran baru</p>
                                        <p className="text-xs text-gray-500">Rp {payment.nominal?.toLocaleString('id-ID') || '0'} - {payment.tanggal || 'N/A'}</p>
                                    </div>
                                </div>
                            ))}
                            {recentBlogs.slice(0, 2).map((blog, index) => (
                                <div key={`blog-${index}`} className="flex items-start">
                                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                                        <i className="ri-article-line text-blue-600"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Artikel baru: {blog.title?.substring(0, 20)}...</p>
                                        <p className="text-xs text-gray-500">{blog.createdAt || 'N/A'} - {blog.commentCount} komentar</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Kamar Tersedia</h2>
                            <i className="ri-hotel-line text-gray-500"></i>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <RoomStatusCard
                                type="Standard"
                                available={12}
                                total={20}
                                color="bg-blue-100 text-blue-600"
                            />
                            <RoomStatusCard
                                type="Deluxe"
                                available={5}
                                total={10}
                                color="bg-green-100 text-green-600"
                            />
                            <RoomStatusCard
                                type="Suite"
                                available={3}
                                total={5}
                                color="bg-purple-100 text-purple-600"
                            />
                            <RoomStatusCard
                                type="Executive"
                                available={2}
                                total={4}
                                color="bg-yellow-100 text-yellow-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Recent Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Pembayaran Terbaru</h2>
                            <Link to="/dashboard-admin/manage-pembayaran" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                                Lihat Semua <i className="ri-arrow-right-line ml-1"></i>
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentPayments.map(payment => (
                                        <tr key={payment.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.id.substring(0, 8)}...</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                                Rp {payment.nominal?.toLocaleString('id-ID') || '0'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.tanggal || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${payment.status === 'lunas' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {payment.status || 'pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Artikel Terbaru</h2>
                            <Link to="/dashboard-admin/manage-blog" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                                Lihat Semua <i className="ri-arrow-right-line ml-1"></i>
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Komentar</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentBlogs.map(blog => (
                                        <tr key={blog.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                                {blog.title?.substring(0, 20)}...
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{blog.uploadDate?.toDate ? blog.uploadDate.toDate().toLocaleDateString('id-ID') : '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className="inline-flex items-center">
                                                    <i className="ri-eye-line mr-1"></i> {blog.views}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className="inline-flex items-center">
                                                    <i className="ri-chat-1-line mr-1"></i> {blog.commentCount || 0} Komentar
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

const StatCard = ({ icon, title, value, change, color }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-start">
                <div className={`w-12 h-12 flex items-center justify-center rounded-full ${color.split(' ')[0]} ${color.split(' ')[1]} mr-4`}>
                    <i className={`${icon} text-xl`}></i>
                </div>
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className="text-xl font-bold text-gray-800">{value}</p>
                    <p className={`text-xs mt-1 ${change?.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {change} <i className={`ri-arrow-${change?.startsWith('+') ? 'up' : 'down'}-line`}></i>
                    </p>
                </div>
            </div>
        </div>
    );
};

const RoomStatusCard = ({ type, available, total, color }) => {
    const percentage = Math.round((available / total) * 100);

    return (
        <div className="bg-white p-3 rounded-lg border border-gray-100">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{type}</span>
                <span className="text-xs font-medium text-gray-500">{available}/{total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`h-2 rounded-full ${color.split(' ')[0]}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <div className="text-right mt-1">
                <span className="text-xs font-medium text-gray-500">{percentage}% tersedia</span>
            </div>
        </div>
    );
};