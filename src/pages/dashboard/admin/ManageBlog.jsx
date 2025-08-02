import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useNavigate } from 'react-router-dom';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-300 bg-gray-50">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
        title="Bold"
      >
        <i className="ri-bold"></i>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
        title="Italic"
      >
        <i className="ri-italic"></i>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
        title="Underline"
      >
        <i className="ri-underline"></i>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
        title="Bullet List"
      >
        <i className="ri-list-unordered"></i>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
        title="Numbered List"
      >
        <i className="ri-list-ordered"></i>
      </button>
      <button
        onClick={() => {
          const previousUrl = editor.getAttributes('link').href;
          const url = window.prompt('URL', previousUrl);

          if (url === null) return;
          if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
          }

          editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
        title="Link"
      >
        <i className="ri-link"></i>
      </button>
    </div>
  );
};

export default function ManageBlog() {
  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: '<p>Start writing your blog content here...</p>',
  });

  useEffect(() => {
    const fetchBlogsAndTags = async () => {
      const blogsRef = collection(db, 'blog');
      const q = query(blogsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const blogsData = [];
      const tagsSet = new Set();
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        blogsData.push({ id: doc.id, ...data });
        
        if (data.tags && Array.isArray(data.tags)) {
          data.tags.forEach(tag => tagsSet.add(tag));
        }
      });
      
      setBlogs(blogsData);
      setAllTags(Array.from(tagsSet));
    };

    fetchBlogsAndTags();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate slug from title
      const slug = title.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      // Get HTML content from editor
      const htmlContent = editor.getHTML();

      const blogData = {
        title,
        slug,
        author: 'Admin',
        content: htmlContent,
        thumbnail,
        tags: tags.split(',').map(tag => tag.trim()),
        views: 0,
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        // Update existing blog
        await updateDoc(doc(db, 'blog', editingId), blogData);
        alert('Blog updated successfully!');
      } else {
        // Create new blog
        blogData.createdAt = serverTimestamp();
        await addDoc(collection(db, 'blog'), blogData);
        alert('Blog created successfully!');
      }

      navigate('/blog');
    } catch (error) {
      console.error('Error:', error);
      alert(`Error ${editingId ? 'updating' : 'creating'} blog`);
    } finally {
      setIsSubmitting(false);
      setEditingId(null);
    }
  };

  const handleEdit = (blog) => {
    setTitle(blog.title);
    setThumbnail(blog.thumbnail);
    setTags(blog.tags?.join(', ') || '');
    setEditingId(blog.id);
    editor.commands.setContent(blog.content);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteDoc(doc(db, 'blog', id));
        setBlogs(blogs.filter(blog => blog.id !== id));
        alert('Blog deleted successfully!');
      } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Error deleting blog');
      }
    }
  };

  const addSuggestedTag = (tag) => {
    setTags(prev => prev ? `${prev}, ${tag}` : tag);
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 transition-colors duration-300">
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          {editingId ? 'Edit Blog' : 'Create New Blog'}
        </h1>
        
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
          {/* Form fields remain the same as before */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-100 bg-white text-gray-800"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="thumbnail">
              Thumbnail URL
            </label>
            <input
              id="thumbnail"
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-100 bg-white text-gray-800"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="tags">
              Tags (comma separated)
            </label>
            <input
              id="tags"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-100 bg-white text-gray-800"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., food, health, tips"
            />
            {allTags.length > 0 && (
              <div className="mt-2">
                <span className="text-sm text-gray-600">Suggested tags: </span>
                {allTags.map((tag, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => addSuggestedTag(tag)}
                    className="text-sm bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded mr-1 mb-1 inline-block"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Content</label>
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <MenuBar editor={editor} />
              <EditorContent 
                editor={editor} 
                className="min-h-[200px] p-3 focus:outline-none bg-white" 
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-300 flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                {editingId ? 'Updating...' : 'Publishing...'}
              </>
            ) : (
              <>
                <i className={editingId ? 'ri-edit-line mr-2' : 'ri-save-line mr-2'}></i>
                {editingId ? 'Update Blog' : 'Publish Blog'}
              </>
            )}
          </button>
        </form>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Manage Blogs</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogs.map((blog) => (
                  <tr key={blog.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{blog.title}</div>
                      <div className="text-sm text-gray-500">
                        {blog.tags?.join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {blog.views}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {blog.createdAt?.toDate().toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(blog)}
                        className="text-gray-600 hover:text-gray-900 mr-3"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}