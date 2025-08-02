// src/pages/admin/ManageComments.jsx
import React, { useState, useEffect } from 'react';
import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from '../../../../firebase';
import { Link } from 'react-router-dom';
import Layout from '../../../components/admin/Layout';

const formatFirebaseTimestamp = (ts) => {
    if (!ts) return '-';
    try {
        return ts.toDate().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return '-';
    }
};

export default function ManageComments() {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toDelete, setToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                const cRef = collection(db, 'komentar-blog');
                const cSnap = await getDocs(query(cRef, orderBy('createdAt', 'desc')));

                const bRef = collection(db, 'blog');
                const bSnap = await getDocs(bRef);
                const blogs = bSnap.docs.map(d => ({ id: d.id, ...d.data() }));

                const data = cSnap.docs.map(d => {
                    const c = d.data();
                    const blog = blogs.find(b => b.id === c.blogId);
                    return {
                        id: d.id,
                        ...c,
                        formattedDate: formatFirebaseTimestamp(c.createdAt),
                        userPhoto: 'https://cdn-icons-png.freepik.com/512/7718/7718888.png',
                        blogSlug: blog?.slug || null
                    };
                });

                setComments(data);
            } catch {
                ('Gagal memuat data komentar');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const handleDelete = async () => {
        if (!toDelete) return;
        setIsDeleting(true);
        try {
            await deleteDoc(doc(db, 'komentar-blog', toDelete));
            setComments(prev => prev.filter(c => c.id !== toDelete));
        } catch {
            alert('Gagal menghapus komentar');
        } finally {
            setIsDeleting(false);
            setToDelete(null);
        }
    };

    return (
        <Layout>
            <div className="bg-gray-50 min-h-screen text-gray-800">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pengguna</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Komentar</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">Memuat data...</td>
                                    </tr>
                                ) : comments.length ? (
                                    comments.map(c => (
                                        <tr key={c.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <img src={c.userPhoto} alt={c.userName} className="w-10 h-10 rounded-full mr-3" />
                                                    <div>
                                                        <div className="font-medium">{c.userName}</div>
                                                        <div className="text-sm text-gray-500">ID: {c.userId}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm">{c.content}</div>
                                                <div className="flex items-center mt-1 text-xs">
                                                    <Link
                                                        to={c.blogSlug ? `/blog/${c.blogSlug}` : '#'}
                                                        className={`px-2 py-1 rounded ${c.blogSlug ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
                                                        onClick={e => !c.blogSlug && e.preventDefault()}
                                                    >
                                                        <i className="ri-eye-line mr-1"></i>
                                                        {c.blogSlug ? 'Lihat Blog' : 'Tidak Ditemukan'}
                                                    </Link>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{c.formattedDate}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setToDelete(c.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <i className="ri-delete-bin-line"></i> Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                            Tidak ada komentar yang ditemukan
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal konfirmasi hapus */}
                {toDelete && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <h3 className="text-lg font-bold mb-3">Konfirmasi Hapus</h3>
                            <p className="mb-4">Apakah Anda yakin ingin menghapus komentar ini?</p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setToDelete(null)}
                                    className="px-4 py-2 border rounded hover:bg-gray-100"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-400"
                                >
                                    {isDeleting ? <i className="ri-loader-4-line animate-spin mr-1" /> : null}
                                    Ya, Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}