import React, { useState, useEffect } from "react";
import Layout from "../../../components/admin/Layout";

const API_URL = "http://localhost:8888/api/gallery";

// Rekomendasi kategori untuk kostan (hanya satu yang bisa dipilih)
const CATEGORIES = [
    "--Pilih Kategori--",   // 👈 ubah jadi ini
    "Kamar",
    "Fasilitas Umum",
    "Kamar Mandi",
    "Ruang Santai",
    "Dapur",
    "Area Parkir",
    "Cavelatte",
    "Eksterior",
    "Lainnya"
];

export default function ManageGallery() {
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({ title: "", category: "" });
    const [editId, setEditId] = useState(null);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(null);

    // Ambil data
    const fetchItems = async () => {
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error("Gagal ambil data");
            const data = await res.json();
            setItems(Array.isArray(data) ? data : []);
        } catch {
            setMessage("Gagal load data. Cek backend!");
            setItems([]);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    // Handle input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle file change + preview
    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({ title: "", category: "" });
        setFile(null);
        setPreview(null);
        setEditId(null);
        setMessage("");
    };

    // Submit (Create/Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.category || formData.category === "--Pilih Kategori--") {
            setMessage("title dan kategori wajib diisi!");
            return;
        }
        if (!file && !editId) {
            setMessage("Upload gambar dulu!");
            return;
        }

        setLoading(true);
        setMessage("");

        const body = new FormData();
        body.append("title", formData.title);
        body.append("category", formData.category); // cuma satu
        if (file) body.append("image", file);

        const method = editId ? "PUT" : "POST";
        const url = editId ? `${API_URL}/${editId}` : API_URL;

        try {
            const res = await fetch(url, { method, body });
            if (res.ok) {
                const result = await res.json();
                setItems(prev =>
                    editId
                        ? prev.map(item => (item.id === editId ? result : item))
                        : [result, ...prev]
                );
                resetForm();
                setMessage(editId ? "Berhasil update!" : "Berhasil tambah foto!");
            } else {
                const error = await res.json();
                setMessage(`Error: ${error.message}`);
            }
        } catch {
            setMessage("Gagal koneksi ke backend. Pastikan jalan di port 8888!");
        } finally {
            setLoading(false);
        }
    };

    // Edit item
    const handleEdit = (item) => {
        setFormData({
            title: item.title,
            category: item.category || ""
        });
        setEditId(item.id);
        setFile(null);
        setPreview(`http://localhost:8888${item.imageUrl}`); // 👈 Tambahkan ini
        setMessage("");
    };

    // Delete modal
    const confirmDelete = (item) => {
        setShowDeleteModal(item);
    };

    const deleteItem = async () => {
        if (!showDeleteModal) return;
        try {
            const res = await fetch(`${API_URL}/${showDeleteModal.id}`, { method: "DELETE" });
            if (res.ok) {
                setItems(items.filter(item => item.id !== showDeleteModal.id));
                setMessage("Foto berhasil dihapus!");
            } else {
                setMessage("Gagal hapus.");
            }
        } catch {
            setMessage("Koneksi gagal.");
        } finally {
            setShowDeleteModal(null);
        }
    };

    return (
        <Layout>
            <div className="max-w-full mx-auto bg-gray-50 min-h-screen">
                {/* Status Message */}
                {message && (
                    <div
                        className={`p-3 mb-6 text-sm rounded ${message.includes("gagal") || message.includes("Error")
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                            }`}
                    >
                        {message}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow mb-5">
                    <div className="grid grid-cols-12 items-end gap-3">
                        {/* title */}
                        <div className="col-span-12 md:col-span-3">
                            <label htmlFor="title" className="block text-xs font-medium mb-1">title</label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                placeholder="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 text-sm rounded focus:ring-1 focus:ring-[#eb6807]/10 focus:outline-none"
                                required
                            />
                        </div>

                        {/* Kategori */}
                        <div className="col-span-12 md:col-span-2">
                            <label htmlFor="category" className="block text-xs font-medium mb-1">Kategori</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 text-sm rounded focus:ring-1 focus:ring-[#eb6807]/10 focus:outline-none"
                                required
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat} disabled={cat === "Pilih Kategori"}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Upload + Preview */}
                        <div className="col-span-12 md:col-span-3">
                            <label className="block text-xs font-medium mb-1">Gambar</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-xs border rounded px-3 py-2"
                                required={!editId}
                            />
                            {editId && !file && (
                                <p className="text-xs text-gray-600 mt-0.5 truncate">
                                    File: {items.find(i => i.id === editId)?.imageUrl?.split('/').pop()}
                                </p>
                            )}
                            {(preview || (editId && items.find(i => i.id === editId)?.imageUrl)) && (
                                <img
                                    src={preview || `http://localhost:8888${items.find(i => i.id === editId)?.imageUrl}`}
                                    alt="preview"
                                    className="w-10 h-10 object-cover rounded border mt-1"
                                />
                            )}
                        </div>

                        {/* Tombol */}
                        <div className="col-span-12 md:col-span-4 flex gap-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-[#eb6807] text-white text-sm py-2 rounded hover:bg-[#d45a00] disabled:opacity-50 transition"
                            >
                                {loading ? "..." : editId ? "Update" : "Tambah Gallery"}
                            </button>
                            {editId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 bg-gray-300 text-gray-700 text-sm py-2 rounded hover:bg-gray-400 transition"
                                >
                                    Batal
                                </button>
                            )}
                        </div>
                    </div>
                </form>

                {/* daftar foto */}
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Daftar Foto</h3>
                {items.length === 0 ? (
                    <p className="text-gray-500 text-center py-4 bg-white rounded-lg">
                        Belum ada foto. Tambahkan yang pertama!
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-3">
                        {items.map((item) => {
                            const date = new Date(item.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            });
                            return (
                                <div
                                    key={item.id}
                                    className="bg-white border rounded-lg shadow hover:shadow-md transition-shadow duration-300 overflow-hidden"
                                >
                                    <img
                                        src={`http://localhost:8888${item.imageUrl}`}
                                        alt={item.title}
                                        className="w-full h-40 object-cover"
                                    />
                                    <div className="p-4">
                                        <h4 className="font-semibold text-gray-800 truncate">{item.title}</h4>
                                        <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-700 mb-2 block w-fit">
                                            {item.category}
                                        </span>
                                        <p className="text-xs text-gray-500">Upload: {date}</p>
                                        <div className="flex gap-3 mt-3 justify-end">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(item)}
                                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Modal Konfirmasi Hapus */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
                            <h3 className="text-lg font-bold mb-2">Hapus Foto?</h3>
                            <p className="text-gray-600 mb-4 text-sm">
                                Yakin ingin menghapus <strong>{showDeleteModal.title}</strong>?
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(null)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={deleteItem}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}