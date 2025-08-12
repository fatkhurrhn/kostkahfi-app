// src/pages/Blog.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import ChatBot from '../components/chatbot/ChatBot';
import BlogHeader from '../components/blog/HeaderSection';
import BlogList from '../components/blog/BlogList';
import ErrorMessage from '../components/blog/ErrorMessage';

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

    if (error) {
        return <ErrorMessage error={error} />;
    }

    return (
        <div className="bg-gray-50 min-h-screen text-gray-800 transition-colors duration-300">
            <Navbar />
            <ChatBot />
            <ScrollToTop />
            <section className="max-w-7xl mx-auto px-4 pt-[110px] mb-4">
                <BlogHeader tagFilter={tagFilter} />
                <BlogList blogs={blogs} loading={loading} />
            </section>
            <Footer />
        </div>
    );
}