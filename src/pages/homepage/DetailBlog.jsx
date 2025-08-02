import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Link, useParams } from 'react-router-dom';
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    addDoc,
    serverTimestamp,
    onSnapshot,
    updateDoc,
    doc
} from 'firebase/firestore';
import { db } from '../../../firebase';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const Avatar = ({ src, alt }) => (
    <img
        src={src || 'https://cdn-icons-png.freepik.com/512/7718/7718888.png'}
        alt={alt || 'user'}
        className="w-10 h-10 rounded-full bg-gray-200 object-cover"
        onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://cdn-icons-png.freepik.com/512/7718/7718888.png';
        }}
    />
);

export default function DetailBlog() {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [latestBlogs, setLatestBlogs] = useState([]);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [user, setUser] = useState(null);
    const [allTags, setAllTags] = useState([]);
    const auth = getAuth();

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                // Blog utama
                const blogsRef = collection(db, 'blog');
                const q = query(blogsRef, where('slug', '==', slug));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setError('Blog not found');
                    setLoading(false);
                    return;
                }

                const blogDoc = querySnapshot.docs[0];
                const blogData = blogDoc.data();
                const blogId = blogDoc.id;

                await updateDoc(doc(db, 'blog', blogId), { views: (blogData.views || 0) + 1 });
                setBlog({ id: blogId, ...blogData });

                // Related
                const relatedQ = query(blogsRef, where('slug', '!=', slug), orderBy('createdAt', 'desc'), limit(3));
                const relatedSnap = await getDocs(relatedQ);
                setRelatedBlogs(relatedSnap.docs.map(d => ({ id: d.id, ...d.data() })));

                // Latest
                const latestQ = query(blogsRef, orderBy('createdAt', 'desc'), limit(5));
                const latestSnap = await getDocs(latestQ);
                setLatestBlogs(latestSnap.docs.map(d => ({ id: d.id, ...d.data() })));

                // Tags
                const tagsSnap = await getDocs(blogsRef);
                const tags = new Set();
                tagsSnap.docs.forEach(d => {
                    (d.data().tags || []).forEach(t => tags.add(t));
                });
                setAllTags(Array.from(tags));

                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to load blog');
                setLoading(false);
            }
        };

        fetchBlogData();
        const unsub = auth.onAuthStateChanged(setUser);
        return unsub;
    }, [slug]);

    useEffect(() => {
        if (!blog?.id) return;
        const q = query(
            collection(db, 'komentar-blog'),
            where('blogId', '==', blog.id),
            orderBy('createdAt', 'desc')
        );
        return onSnapshot(q, snap =>
            setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        );
    }, [blog?.id]);

    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (e) {
            console.error(e);
        }
    };

    const handleCommentSubmit = async e => {
        e.preventDefault();
        if (!commentText.trim() || !user || !blog) return;
        await addDoc(collection(db, 'komentar-blog'), {
            blogId: blog.id,
            userId: user.uid,
            userName: user.displayName,
            userPhoto: user.photoURL,
            content: commentText,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        setCommentText('');
    };

    if (error) {
        return (
            <div className="bg-gray-50 min-h-screen text-gray-800">
                <section className="max-w-7xl mx-auto px-4 py-8">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen text-gray-800 transition-colors duration-300">
            <Navbar />
            <section className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Konten utama */}
                    <div className="lg:w-2/3">
                        {loading ? (
                            <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
                                Memuat data...
                            </div>
                        ) : blog ? (
                            <>
                                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                                    <div className="text-sm text-gray-500 mb-4">
                                        <Link to="/blog" className="font-medium text-gray-800">
                                            Blog
                                        </Link>
                                        <span className="mx-1">{'>'}</span>
                                        <span className="text-gray-800 font-medium">
                                            {blog.title}
                                        </span>
                                    </div>
                                    <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
                                    <div className="flex items-center text-sm text-gray-500 mb-6">
                                        <i className="ri-user-line mr-1" />
                                        <span className="mr-4">{blog.author}</span>
                                        <i className="ri-time-line mr-1" />
                                        <span>
                                            {blog.createdAt?.toDate().toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}{' '}
                                            •{' '}
                                            {blog.createdAt
                                                ?.toDate()
                                                .toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })}{' '}
                                            WIB
                                        </span>
                                        <span className="mx-4">•</span>
                                        <i className="ri-eye-line mr-1" />
                                        <span>{blog.views} views</span>
                                    </div>

                                    <img
                                        src={blog.thumbnail}
                                        alt={blog.title}
                                        className="w-full h-96 object-cover rounded-lg mb-6"
                                    />

                                    <div
                                        className="prose max-w-none"
                                        dangerouslySetInnerHTML={{ __html: blog.content }}
                                    />
                                </div>

                                {/* Komentar */}
                                <div className="bg-white p-6 rounded-lg shadow-md">
                                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                                        <i className="ri-chat-3-line mr-2" />
                                        Comments ({comments.length})
                                    </h2>

                                    {user ? (
                                        <form onSubmit={handleCommentSubmit} className="mb-6">
                                            <div className="flex items-start gap-3">
                                                <Avatar src={user.photoURL} alt={user.displayName} />
                                                <div className="flex-grow">
                                                    <textarea
                                                        value={commentText}
                                                        onChange={(e) => setCommentText(e.target.value)}
                                                        placeholder="Write your comment..."
                                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 min-h-[100px]"
                                                        required
                                                    />
                                                    <button
                                                        type="submit"
                                                        className="mt-2 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center"
                                                    >
                                                        <i className="ri-send-plane-line mr-2" />
                                                        Post Comment
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-md mb-6">
                                            <p className="mb-3">Please login with Google to leave a comment.</p>
                                            <button
                                                onClick={handleGoogleLogin}
                                                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center"
                                            >
                                                <i className="ri-google-fill mr-2 text-red-500" />
                                                Login with Google
                                            </button>
                                        </div>
                                    )}

                                    <div className="space-y-6">
                                        {comments.length ? (
                                            comments.map(comment => (
                                                <div key={comment.id} className="flex gap-3">
                                                    <Avatar src={comment.userPhoto} alt={comment.userName} />
                                                    <div className="flex-grow">
                                                        <div className="bg-gray-50 p-4 rounded-lg">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <h4 className="font-bold">{comment.userName}</h4>
                                                                <span className="text-xs text-gray-500">
                                                                    {comment.createdAt?.toDate?.()?.toLocaleString()}
                                                                </span>
                                                            </div>
                                                            <p>{comment.content}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-6 text-gray-500">
                                                <i className="ri-chat-1-line text-4xl mb-2" />
                                                <p>No comments yet. Be the first to comment!</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Latest Blogs Horizontal Scroll */}
                                <div className="mt-8">
                                    <h2 className="text-2xl font-bold mb-4">Latest Blogs</h2>
                                    <div className="overflow-x-auto pb-4">
                                        <div className="flex space-x-4">
                                            {latestBlogs.map(latestBlog => (
                                                <div key={latestBlog.id} className="flex-shrink-0 w-64">
                                                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg h-full">
                                                        <img
                                                            src={latestBlog.thumbnail}
                                                            alt={latestBlog.title}
                                                            className="w-full h-40 object-cover"
                                                        />
                                                        <div className="p-4">
                                                            <h3 className="font-bold mb-2 line-clamp-2">
                                                                <a href={`/blog/${latestBlog.slug}`} className="hover:text-gray-600">
                                                                    {latestBlog.title}
                                                                </a>
                                                            </h3>
                                                            <div className="text-xs text-gray-500">
                                                                {blog.createdAt?.toDate().toLocaleDateString('id-ID', {
                                                                    day: 'numeric',
                                                                    month: 'long',
                                                                    year: 'numeric',
                                                                })}{' '}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-1/3">
                        <div className="space-y-6 sticky top-4">
                            {/* Popular Blogs */}
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-xl font-bold mb-4 flex items-center">
                                    <i className="ri-fire-line mr-2 text-red-500" />
                                    Popular Blogs
                                </h2>
                                {loading ? (
                                    <div className="text-left text-gray-500">Memuat data...</div>
                                ) : relatedBlogs.length ? (
                                    <div className="space-y-4">
                                        {relatedBlogs.map(rb => (
                                            <div key={rb.id} className="flex gap-3">
                                                <img
                                                    src={rb.thumbnail}
                                                    alt={rb.title}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                                <div>
                                                    <h3 className="font-medium line-clamp-2">
                                                        <a href={`/blog/${rb.slug}`} className="hover:text-gray-600">
                                                            {rb.title}
                                                        </a>
                                                    </h3>
                                                    <div className="text-xs text-gray-500">{rb.views} views • {blog.createdAt?.toDate().toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}{' '}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-center py-4">—</div>
                                )}
                            </div>

                            {/* Tags */}
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-xl font-bold mb-4 flex items-center">
                                    <i className="ri-price-tag-3-line mr-2 text-blue-500" />
                                    Tags
                                </h2>
                                {loading ? (
                                    <div className="text-left text-gray-500">Memuat data...</div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {allTags.map((tag, i) => (
                                            <a
                                                key={i}
                                                href={`/blog?tag=${tag}`}
                                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full"
                                            >
                                                {tag}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}