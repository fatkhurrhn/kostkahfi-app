import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Modal from 'react-modal';
import {
    collection, addDoc, doc, updateDoc, deleteDoc,
    serverTimestamp, query, orderBy, onSnapshot
} from 'firebase/firestore';
import { db } from '../../../../firebase';
import 'remixicon/fonts/remixicon.css';
import Layout from '../../../components/admin/Layout';

Modal.setAppElement('#root'); // agar aksesibel

export default function ManageBlog() {
    const [blogs, setBlogs] = useState([]);
    // const [allTags, setAllTags] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [form, setForm] = useState({
        id: null, title: '', thumbnail: '', tags: '', content: '', uploadDate: new Date().toISOString().substr(0, 10) // YYYY-MM-DD
    });

    /* ---------- Editor ---------- */
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({ openOnClick: false }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content: '<p>Start writing...</p>',
    });

    /* ---------- Realtime data ---------- */
    useEffect(() => {
        const q = query(collection(db, 'blog'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, snap => {
            const arr = [];
            const tagSet = new Set();
            snap.forEach(d => {
                const data = d.data();
                arr.push({ id: d.id, ...data });
                data.tags?.forEach(t => tagSet.add(t));
            });
            setBlogs(arr);
            // setAllTags(Array.from(tagSet));
        });
        return unsub;
    }, []);

    /* ---------- CRUD helpers ---------- */
    const slugify = str => str.toLowerCase().replace(/[^\w ]+/g, '').replace(/\s+/g, '-');

    const resetForm = () => {
        setForm({ id: null, title: '', thumbnail: '', tags: '', content: '' });
        editor.commands.setContent('<p>Start writing...</p>');
    };

    const openCreate = () => { resetForm(); setModalOpen(true); };
    const openEdit = b => {
        setForm({ id: b.id, title: b.title, thumbnail: b.thumbnail, tags: b.tags?.join(', ') || '', content: b.content, uploadDate: b.uploadDate?.toDate ? b.uploadDate.toDate().toISOString().substr(0, 10) : new Date().toISOString().substr(0, 10) });
        editor.commands.setContent(b.content);
        setModalOpen(true);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const data = {
            title: form.title.trim(),
            slug: slugify(form.title),
            thumbnail: form.thumbnail.trim(),
            tags: form.tags.split(',').map(t => t.trim()),
            content: editor.getHTML(),
            author: 'Admin',
            uploadDate: new Date(form.uploadDate), // Firestore Timestamp
            updatedAt: serverTimestamp(),
        };

        try {
            if (form.id) {
                await updateDoc(doc(db, 'blog', form.id), data);
            } else {
                await addDoc(collection(db, 'blog'), { ...data, createdAt: serverTimestamp(), views: 0 });
            }
            setModalOpen(false);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async () => {
        await deleteDoc(doc(db, 'blog', deleteId));
        setDeleteId(null);
    };

    /* ---------- Menu Bar ---------- */
    const MenuBar = () => {
        if (!editor) return null;
        return (
            <div className="flex gap-1 border-b pb-2 mb-2">
                {/* bold, italic, underline */}
                {['bold', 'italic', 'underline'].map(btn => (
                    <button key={btn}
                        onClick={() => editor.chain().focus().toggleMark(btn).run()}
                        className={`p-1 rounded ${editor.isActive(btn) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
                        <i className={`ri-${btn === 'bold' ? 'bold' : btn === 'italic' ? 'italic' : 'underline'}`} />
                    </button>
                ))}
                {/* align */}
                {['left', 'center', 'right', 'justify'].map(a => (
                    <button key={a}
                        onClick={() => editor.chain().focus().setTextAlign(a).run()}
                        className={`p-1 rounded ${editor.isActive({ textAlign: a }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
                        <i className={`ri-align-${a}`} />
                    </button>
                ))}
                {/* link */}
                <button
                    onClick={() => {
                        const url = window.prompt('URL');
                        if (url) editor.chain().focus().setLink({ href: url }).run();
                    }}
                    className={`p-1 rounded ${editor.isActive('link') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
                    <i className="ri-link" />
                </button>
            </div>
        );
    };

    /* ---------- Render ---------- */
    return (
        <Layout>
            <div className="bg-gray-50 min-h-screen text-gray-800">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold">Manage Blogs</h1>
                        <button
                            onClick={openCreate}
                            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700">
                            <i className="ri-add-line mr-1" /> New Blog
                        </button>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Thumbnail</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Views</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Created</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {blogs.map(b => (
                                    <tr key={b.id}>
                                        {/* Kolom Thumbnail */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <img
                                                src={b.thumbnail}
                                                alt={b.title}
                                                className="w-12 h-12 object-cover rounded"
                                                onError={e => { e.target.src = 'https://via.placeholder.com/50'; }}
                                            />
                                        </td>

                                        {/* Kolom Title (dulunya pertama) */}
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{b.title}</div>
                                            <div className="text-xs text-gray-500">{b.tags?.join(', ')}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {b.views}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {b.uploadDate?.toDate ? b.uploadDate.toDate().toLocaleDateString('id-ID') : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm space-x-2">
                                            <button onClick={() => openEdit(b)} className="text-blue-600">
                                                <i className="ri-edit-line" /> Edit
                                            </button>
                                            <button onClick={() => setDeleteId(b.id)} className="text-red-600">
                                                <i className="ri-delete-bin-line" /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Modal Create / Edit */}
                    <Modal
                        isOpen={modalOpen}
                        onRequestClose={() => setModalOpen(false)}
                        className="bg-white rounded-lg shadow-2xl w-full max-w-3xl mx-auto my-12 p-6 outline-none"
                        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    >
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h2 className="text-2xl font-bold mb-2">{form.id ? 'Edit Blog' : 'Create Blog'}</h2>

                            <input
                                placeholder="Title"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                className="w-full border px-3 py-2 rounded"
                                required
                            />
                            <input
                                id="thumbnail"
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                value={form.thumbnail}
                                onChange={e => setForm({ ...form, thumbnail: e.target.value })}
                                className="w-full border px-3 py-2 rounded"
                                required
                            />
                            {/* Preview otomatis */}
                            {form.thumbnail && (
                                <div className="mt-1">
                                    <span className="text-xs text-gray-600 mb-1 block">Preview:</span>
                                    <img
                                        src={form.thumbnail}
                                        alt="preview"
                                        className="w-32 h-20 object-cover rounded border"
                                        onError={e => { e.target.src = 'https://via.placeholder.com/128x80?text=No+Image'; }}
                                    />
                                </div>
                            )}
                            <input
                                placeholder="Tags (comma separated)"
                                value={form.tags}
                                onChange={e => setForm({ ...form, tags: e.target.value })}
                                className="w-full border px-3 py-2 rounded"
                            />
                            <label className="block text-sm font-medium mb-1">Tanggal Upload</label>
                            <input
                                type="date"
                                value={form.uploadDate}
                                onChange={e => setForm({ ...form, uploadDate: e.target.value })}
                                className="w-full border px-3 py-2 rounded"
                            />

                            <MenuBar />
                            <EditorContent
                                editor={editor}
                                className="border rounded min-h-[200px] max-h-[400px] overflow-y-auto p-2"
                            />

                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded border hover:bg-gray-100">
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-700">
                                    {form.id ? 'Update' : 'Publish'}
                                </button>
                            </div>
                        </form>
                    </Modal>

                    {/* Modal Delete */}
                    <Modal
                        isOpen={!!deleteId}
                        onRequestClose={() => setDeleteId(null)}
                        className="bg-white rounded-lg shadow-2xl w-full max-w-3xl mx-auto my-12 p-6 outline-none"
                        overlayClassName="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto z-50"
                    >
                        <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
                        <p>Are you sure you want to delete this blog permanently?</p>
                        <div className="mt-6 flex justify-end gap-2">
                            <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded border hover:bg-gray-100">
                                Cancel
                            </button>
                            <button onClick={handleDelete} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">
                                Delete
                            </button>
                        </div>
                    </Modal>
                </div>
            </div>
        </Layout>
    );
}