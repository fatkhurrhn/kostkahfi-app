import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Blog() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const tagFilter = searchParams.get('tag');

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const blogsRef = collection(db, 'blog');
                let q;

                if (tagFilter) {
                    q = query(
                        blogsRef,
                        where('tags', 'array-contains', tagFilter),
                        orderBy('createdAt', 'desc')
                    );
                } else {
                    q = query(blogsRef, orderBy('createdAt', 'desc'));
                }

                const querySnapshot = await getDocs(q);

                const blogsData = [];
                querySnapshot.forEach((doc) => {
                    blogsData.push({ id: doc.id, ...doc.data() });
                });

                setBlogs(blogsData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching blogs: ', err);
                setError('Failed to load blogs');
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [tagFilter]);

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen text-gray-800 transition-colors duration-300">
                <section className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <i className="ri-loader-4-line animate-spin text-4xl text-gray-600"></i>
                    </div>
                </section>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-50 min-h-screen text-gray-800 transition-colors duration-300">
                <section className="max-w-7xl mx-auto px-4 py-8">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        {error}
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen text-gray-800 transition-colors duration-300">
            <Navbar />
            <section className="max-w-7xl mx-auto px-4 py-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-3 text-gray-800">
                        <span className="text-[#eb6807]">Blog</span> KostAlkahfi
                    </h1>
                    <div className="w-20 h-1 bg-[#eb6807] mx-auto mb-4"></div>
                    <p className="text-gray-600 max-w-lg mx-auto">
                        {tagFilter ? `Blogs tagged with "${tagFilter}"` : 'Informasi seputar kost alkahfi terupdated secara real-time'}
                    </p>
                    {tagFilter && (
                        <Link to="/blog" className="text-red-600">
                            [hapus filter]
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {blogs.map((blog) => (
                        <div key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <img
                                src={blog.thumbnail}
                                alt={blog.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <div className="flex items-center text-[12px] text-gray-500 mb-1">
                                    <span>
                                        {new Date(blog.createdAt?.toDate()).toLocaleDateString('id-ID', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </span>
                                    <span className="mx-2">•</span>
                                    <span>{blog.views} views</span>
                                </div>
                                <h2 className="text-xl font-bold mb-2 line-clamp-2">
                                    <Link to={`/blog/${blog.slug}`} className="hover:text-gray-600">
                                        {blog.title}
                                    </Link>
                                </h2>
                                <p className="text-gray-600 mb-4 line-clamp-2 text-[14px]">
                                    {blog.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {blog.tags?.slice(0, 3).map((tag, index) => (
                                        <Link
                                            key={index}
                                            to={`/blog?tag=${tag}`}
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-1 py-1 rounded"
                                        >
                                            #{tag}
                                        </Link>
                                    ))}

                                    {blog.tags?.length > 3 && (
                                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded cursor-default">
                                            +{blog.tags.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {blogs.length === 0 && (
                    <div className="text-center py-12">
                        <i className="ri-article-line text-5xl text-gray-400 mb-4"></i>
                        <p className="text-xl text-gray-600">No blogs found</p>
                        {tagFilter && (
                            <Link to="/blog" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
                                Back to all blogs
                            </Link>
                        )}
                    </div>
                )}
            </section>
            <Footer />
        </div>
    );
}