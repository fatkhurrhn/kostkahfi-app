import React, { useState, useEffect, useMemo } from 'react';
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  addDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { app } from '../../../../firebase';
import {
  Table,
  Tabs,
  Badge,
  Button,
  Modal,
  Select,
  Card,
  Tag,
  Space,
  DatePicker,
  Input,
  message,
  Popconfirm,
  Alert
} from 'antd';
import {
  EyeOutlined,
  CheckOutlined,
  NotificationOutlined,
  SearchOutlined,
  CloseOutlined,
  PlusOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import Layout from '../../../components/admin/Layout';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const ROLE_PRICE = {
  reguler: 750000,
  mahasantri: 350000,
  biman: 0,
};

export default function ManagePembayaranAdmin() {
  // State management
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedUser, setSelectedUser] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState([]);
  const [userPaymentStatus, setUserPaymentStatus] = useState({});
  const [monthlySummary, setMonthlySummary] = useState([]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const db = getFirestore(app);

        const [usersSnapshot, paymentsSnapshot] = await Promise.all([
          getDocs(query(collection(db, 'users'), where('role', '!=', 'admin'), orderBy('nama'))),
          getDocs(query(collection(db, 'pembayaran'), orderBy('createdAt', 'desc')))
        ]);

        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          uid: doc.data().userId || doc.id,
          ...doc.data(),
          tglMasuk: doc.data().tglMasuk?.toDate?.() || new Date()
        }));

        const paymentsData = paymentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          paymentDate: doc.data().createdAt?.toDate?.() || null,
          formattedDate: doc.data().createdAt?.toDate?.().toLocaleDateString('id-ID') || '-'
        }));

        setUsers(usersData);
        setPayments(paymentsData);
        generateUserPaymentStatus(usersData, paymentsData);
        generateMonthlySummary(usersData, paymentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error('Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate payment status for all users from Jan 2025 to Dec 2026
  const generateUserPaymentStatus = (usersData, paymentsData) => {
    const statusMap = {};
    const startYear = 2025;
    const endYear = 2026;

    usersData.forEach(user => {
      const userPayments = paymentsData.filter(p => p.userId === user.uid);
      const paidMonths = {};

      userPayments.forEach(payment => {
        paidMonths[`${payment.tahun}-${payment.bulan}`] = payment.status;
      });

      // Generate all months from Jan 2025 to Dec 2026
      const userMonths = [];

      for (let year = startYear; year <= endYear; year++) {
        for (let month = 1; month <= 12; month++) {
          userMonths.push({
            tahun: year,
            bulan: month,
            namaBulan: new Date(year, month - 1, 1).toLocaleDateString('id-ID', { month: 'long' }),
            status: paidMonths[`${year}-${month}`] || 'belum bayar'
          });
        }
      }

      statusMap[user.uid] = userMonths;
    });

    setUserPaymentStatus(statusMap);
  };

  // Generate monthly summary for all users
  const generateMonthlySummary = (usersData, paymentsData) => {
    const summary = [];
    const startYear = 2025;
    const endYear = 2026;

    for (let year = startYear; year <= endYear; year++) {
      for (let month = 1; month <= 12; month++) {
        const monthPayments = paymentsData.filter(
          p => p.tahun === year && p.bulan === month
        );

        const lunasCount = monthPayments.filter(p => p.status === 'lunas').length;
        const pendingCount = monthPayments.filter(p => p.status === 'pending').length;
        const totalUsers = usersData.length;

        summary.push({
          tahun: year,
          bulan: month,
          namaBulan: new Date(year, month - 1, 1).toLocaleDateString('id-ID', { month: 'long' }),
          lunas: lunasCount,
          pending: pendingCount,
          belumBayar: totalUsers - (lunasCount + pendingCount),
          totalUsers
        });
      }
    }

    setMonthlySummary(summary);
  };

  // Count pending payments
  const pendingCount = useMemo(() => (
    payments.filter(p => p.status === 'pending').length
  ), [payments]);

  // Filter payments based on selected filters
  const filteredPayments = useMemo(() => {
    let result = [...payments];

    // Filter by year
    if (selectedYear !== 'all') {
      result = result.filter(p => p.tahun === selectedYear);
    }

    // Filter by user
    if (selectedUser !== 'all') {
      result = result.filter(p => p.userId === selectedUser);
    }

    // Filter by tab
    if (activeTab === 'pending') {
      result = result.filter(p => p.status === 'pending');
    } else if (activeTab === 'unpaid') {
      result = result.filter(p => p.status !== 'lunas');
    }

    // Filter by search text
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter(p => {
        const userName = users.find(u => u.uid === p.userId)?.nama || '';
        return userName.toLowerCase().includes(searchLower);
      });
    }

    // Filter by date range
    if (dateRange && dateRange.length === 2) {
      const [start, end] = dateRange;
      result = result.filter(p => {
        const paymentDate = p.paymentDate;
        if (!paymentDate) return false;
        return dayjs(paymentDate).isAfter(start) && dayjs(paymentDate).isBefore(end);
      });
    }

    return result;
  }, [payments, selectedYear, selectedUser, activeTab, searchText, dateRange, users]);

  // Mark payment as complete
  const markAsComplete = async (paymentId, userId, month, year) => {
    try {
      const db = getFirestore(app);

      if (paymentId) {
        // Update existing payment
        await updateDoc(doc(db, 'pembayaran', paymentId), {
          status: 'lunas',
          updatedAt: serverTimestamp()
        });
      } else {
        // Create new payment record
        const user = users.find(u => u.uid === userId);
        const rolePrice = ROLE_PRICE[user?.role] || ROLE_PRICE.reguler;

        await addDoc(collection(db, 'pembayaran'), {
          userId,
          bulan: month,
          tahun: year,
          status: 'lunas',
          nominal: rolePrice,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          adminMarked: true
        });
      }

      // Refresh data
      const [usersSnapshot, paymentsSnapshot] = await Promise.all([
        getDocs(query(collection(db, 'users'), where('role', '!=', 'admin'), orderBy('nama'))),
        getDocs(query(collection(db, 'pembayaran'), orderBy('createdAt', 'desc')))
      ]);

      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        uid: doc.data().userId || doc.id,
        ...doc.data(),
        tglMasuk: doc.data().tglMasuk?.toDate?.() || new Date()
      }));

      const paymentsData = paymentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        paymentDate: doc.data().createdAt?.toDate?.() || null,
        formattedDate: doc.data().createdAt?.toDate?.().toLocaleDateString('id-ID') || '-'
      }));

      setPayments(paymentsData);
      generateUserPaymentStatus(usersData, paymentsData);
      generateMonthlySummary(usersData, paymentsData);

      message.success('Pembayaran berhasil ditandai lunas');
    } catch (error) {
      console.error("Error marking as complete:", error);
      message.error('Gagal menandai lunas');
    }
  };

  // Cancel payment status
  const cancelPayment = async (paymentId) => {
    try {
      const db = getFirestore(app);

      await deleteDoc(doc(db, 'pembayaran', paymentId));

      // Refresh data
      const [usersSnapshot, paymentsSnapshot] = await Promise.all([
        getDocs(query(collection(db, 'users'), where('role', '!=', 'admin'), orderBy('nama'))),
        getDocs(query(collection(db, 'pembayaran'), orderBy('createdAt', 'desc')))
      ]);

      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        uid: doc.data().userId || doc.id,
        ...doc.data(),
        tglMasuk: doc.data().tglMasuk?.toDate?.() || new Date()
      }));

      const paymentsData = paymentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        paymentDate: doc.data().createdAt?.toDate?.() || null,
        formattedDate: doc.data().createdAt?.toDate?.().toLocaleDateString('id-ID') || '-'
      }));

      setPayments(paymentsData);
      generateUserPaymentStatus(usersData, paymentsData);
      generateMonthlySummary(usersData, paymentsData);

      message.success('Pembayaran berhasil dibatalkan');
    } catch (error) {
      console.error("Error cancelling payment:", error);
      message.error('Gagal membatalkan pembayaran');
    }
  };

  // Generate available years
  const availableYears = useMemo(() => {
    return ['all', 2025, 2026]; // Added 'all' option
  }, []);

  // Get unpaid months for a user
  const getUnpaidMonths = (userId) => {
    if (!userPaymentStatus[userId]) return [];
    return userPaymentStatus[userId].filter(m => m.status === 'belum bayar');
  };

  // Table columns for payments
  const paymentColumns = [
    {
      title: 'Nama Penghuni',
      dataIndex: 'userId',
      key: 'nama',
      render: (userId) => {
        const user = users.find(u => u.uid === userId);
        return user ? (
          <div>
            <div className="font-medium text-gray-800">{user.nama}</div>
            <div className="text-xs text-gray-500">
{user.role} | Masuk: {new Date(user.tglMasuk).toLocaleDateString('id-ID')}
            </div>
          </div>
        ) : userId;
      },
      sorter: (a, b) => {
        const userA = users.find(u => u.uid === a.userId)?.nama || '';
        const userB = users.find(u => u.uid === b.userId)?.nama || '';
        return userA.localeCompare(userB);
      }
    },
    {
      title: 'Bulan/Tahun',
      key: 'bulanTahun',
      render: (_, record) => (
        <div>
          <div className="text-gray-800">{MONTHS[record.bulan - 1] || record.bulan} {record.tahun}</div>
          {record.adminMarked && (
            <Tag color="blue" className="mt-1">Ditandai Admin</Tag>
          )}
        </div>
      ),
      sorter: (a, b) => {
        const monthCompare = a.bulan - b.bulan;
        return monthCompare !== 0 ? monthCompare : a.tahun - b.tahun;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = '';
        let text = '';

        switch (status) {
          case 'lunas':
            color = 'green';
            text = 'Lunas';
            break;
          case 'pending':
            color = 'orange';
            text = 'Menunggu';
            break;
          case 'dibatalkan':
            color = 'red';
            text = 'Dibatalkan';
            break;
          default:
            color = 'red';
            text = 'Belum Lunas';
        }

        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: 'Lunas', value: 'lunas' },
        { text: 'Menunggu', value: 'pending' },
        { text: 'Dibatalkan', value: 'dibatalkan' },
        { text: 'Belum Lunas', value: 'belum_lunas' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
  title: 'Nominal',
  key: 'nominal',
  render: (_, record) => {
    const user = users.find(u => u.uid === record.userId);
    const rolePrice = ROLE_PRICE[user?.role] || ROLE_PRICE.reguler;
    return (
      <span className="text-gray-800">
        Rp{rolePrice.toLocaleString('id-ID')}
      </span>
    );
  }
},
    {
      title: 'Tanggal Pembayaran',
      dataIndex: 'formattedDate',
      key: 'date',
      render: (text) => <span className="text-gray-800">{text}</span>,
      sorter: (a, b) => {
        const dateA = a.paymentDate ? new Date(a.paymentDate).getTime() : 0;
        const dateB = b.paymentDate ? new Date(b.paymentDate).getTime() : 0;
        return dateA - dateB;
      }
    },
    {
      title: 'Bukti',
      dataIndex: 'buktiUrl',
      key: 'bukti',
      render: (url) => url ? (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => setPreviewImage(url)}
          className="text-gray-600"
        >
          Lihat
        </Button>
      ) : <span className="text-gray-400">-</span>
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_, record) => (
        <Space>
          {record.status === 'lunas' ? (
            <Popconfirm
              title="Batalkan pembayaran?"
              description="Yakin ingin membatalkan status lunas pembayaran ini?"
              onConfirm={() => cancelPayment(record.id)}
              okText="Ya"
              cancelText="Tidak"
            >
              <Button
                danger
                icon={<CloseOutlined />}
                className="bg-white text-red-500 border-red-200 hover:text-white hover:bg-red-500"
              >
                Batalkan
              </Button>
            </Popconfirm>
          ) : (
            <Button
              type="primary"
              icon={<CheckOutlined />}
              className="bg-gray-800 hover:bg-gray-700 border-gray-700"
              onClick={() => markAsComplete(record.id, record.userId, record.bulan, record.tahun)}
            >
              Tandai Lunas
            </Button>
          )}
        </Space>
      )
    }
  ];

  // Table columns for monthly summary
  const summaryColumns = [
    {
      title: 'Bulan/Tahun',
      dataIndex: 'namaBulan',
      key: 'bulan',
      render: (text, record) => (
        <div className="text-gray-800">
          {text} {record.tahun}
        </div>
      ),
      sorter: (a, b) => {
        const yearCompare = a.tahun - b.tahun;
        return yearCompare !== 0 ? yearCompare : a.bulan - b.bulan;
      }
    },
    {
      title: 'Status Pembayaran',
      key: 'status',
      render: (_, record) => (
        <div className="space-y-2">
          <div>
            <Tag color="green">Lunas: {record.lunas}/{record.totalUsers}</Tag>
          </div>
          <div>
            <Tag color="orange">Pending: {record.pending}/{record.totalUsers}</Tag>
          </div>
          <div>
            <Tag color="red">Belum Bayar: {record.belumBayar}/{record.totalUsers}</Tag>
          </div>
        </div>
      )
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => {
            setSelectedYear(record.tahun);
            setActiveTab('all');
          }}
          className="text-gray-600"
        >
          Lihat Detail
        </Button>
      )
    }
  ];

  // Add new payment modal
  const [addPaymentModalVisible, setAddPaymentModalVisible] = useState(false);
  const [selectedUserForAdd, setSelectedUserForAdd] = useState(null);
  const [selectedMonthForAdd, setSelectedMonthForAdd] = useState(null);
  const [selectedYearForAdd, setSelectedYearForAdd] = useState(2025);

  const handleAddPayment = () => {
    if (!selectedUserForAdd || !selectedMonthForAdd) {
      message.error('Pilih penghuni dan bulan terlebih dahulu');
      return;
    }

    markAsComplete(null, selectedUserForAdd, selectedMonthForAdd, selectedYearForAdd);
    setAddPaymentModalVisible(false);
  };

  return (
    <Layout>
      <div className="max-w-full mx-auto">
        {/* Filters */}
        <Card className="mb-6 bg-white border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Tahun</label>
              <Select
                className="w-full"
                value={selectedYear}
                onChange={setSelectedYear}
              >
                {availableYears.map(year => (
                  <Option key={year} value={year}>
                    {year === 'all' ? 'Semua Tahun' : year}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Penghuni</label>
              <Select
                className="w-full"
                value={selectedUser}
                onChange={setSelectedUser}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option value="all">Semua Penghuni</Option>
                {users.map(user => (
                  <Option key={user.uid} value={user.uid}>{user.nama} - {user.role}</Option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Tanggal Pembayaran</label>
              <RangePicker
                className="w-full"
                onChange={setDateRange}
                onClear={() => setDateRange([])}
                allowClear
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Cari Nama</label>
              <Input
                placeholder="Cari nama penghuni..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="border-gray-300"
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-between items-end mb-0 flex-wrap gap-2">
          {/* Tabs */}
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            type="card"
            className="custom-tabs"
            items={[
              {
                key: 'all',
                label: 'Semua Pembayaran',
              },
              {
                key: 'pending',
                label: (
                  <span className="flex items-center">
                    <NotificationOutlined />
                    <span className="ml-1">Konfirmasi Baru</span>
                    {pendingCount > 0 && (
                      <Badge count={pendingCount} className="ml-2" />
                    )}
                  </span>
                ),
              },
            ]}
          />

          {/* Button */}
          <button
            onClick={() => setAddPaymentModalVisible(true)}
            className="bg-gray-800 text-white px-3 py-1 rounded-md text-[14px] mb-4"
          >
            <i className="ri-add-line mr-2"></i>
            Pembayaran Manual
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'summary' ? (
          <Card className="bg-white border border-gray-200">
            <Table
              columns={summaryColumns}
              dataSource={monthlySummary}
              rowKey={record => `${record.tahun}-${record.bulan}`}
              loading={loading}
              scroll={{ x: true }}
              pagination={{
                pageSize: 12,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} bulan`
              }}
            />
          </Card>
        ) : (
          <Card className="bg-white border border-gray-200">
            <Table
              columns={paymentColumns}
              dataSource={filteredPayments}
              rowKey="id"
              loading={loading}
              scroll={{ x: true }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} pembayaran`
              }}
            />
          </Card>
        )}

        {/* Add Payment Modal */}
        <Modal
          title="Tambah Pembayaran Manual"
          open={addPaymentModalVisible}
          onCancel={() => setAddPaymentModalVisible(false)}
          onOk={handleAddPayment}
          okText="Simpan"
          cancelText="Batal"
          width={600}
          okButtonProps={{ className: 'bg-gray-800 hover:bg-gray-700 border-gray-700' }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Penghuni</label>
              <Select
                className="w-full"
                placeholder="Pilih penghuni"
                onChange={setSelectedUserForAdd}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {users.map(user => (
                  <Option key={user.uid} value={user.uid}>
                    {user.nama} ({user.role})
                  </Option>
                ))}
              </Select>
            </div>

            {selectedUserForAdd && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Tahun</label>
                    <Select
                      className="w-full"
                      value={selectedYearForAdd}
                      onChange={(value) => {
                        setSelectedYearForAdd(value);
                        setSelectedMonthForAdd(null);
                      }}
                    >
                      <Option value={2025}>2025</Option>
                      <Option value={2026}>2026</Option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Bulan</label>
                    <Select
                      className="w-full"
                      placeholder="Pilih bulan"
                      value={selectedMonthForAdd}
                      onChange={setSelectedMonthForAdd}
                    >
                      {getUnpaidMonths(selectedUserForAdd)
                        .filter(m => m.tahun === selectedYearForAdd)
                        .map(month => (
                          <Option key={`${month.tahun}-${month.bulan}`} value={month.bulan}>
                            {month.namaBulan}
                          </Option>
                        ))}
                    </Select>
                  </div>
                </div>

                {selectedMonthForAdd && (
                  <Alert
                    message="Informasi Pembayaran"
                    description={
                      <>
                        <div>Bulan: {MONTHS[selectedMonthForAdd - 1]} {selectedYearForAdd}</div>
                        <div>
                          Nominal: Rp{
                            ROLE_PRICE[users.find(u => u.uid === selectedUserForAdd)?.role]?.toLocaleString('id-ID') ||
                            ROLE_PRICE.reguler.toLocaleString('id-ID')
                          }
                        </div>
                      </>
                    }
                    type="info"
                    showIcon
                    className="bg-blue-50 border-blue-100"
                  />
                )}
              </>
            )}
          </div>
        </Modal>

        {/* Proof Modal */}
        <Modal
          title="Bukti Pembayaran"
          open={!!previewImage}
          onCancel={() => setPreviewImage('')}
          footer={null}
          width={800}
        >
          <img
            src={previewImage}
            alt="Bukti Pembayaran"
            className="w-full"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x600?text=Bukti+Tidak+Tersedia';
            }}
          />
        </Modal>
      </div>
    </Layout>
  );
}