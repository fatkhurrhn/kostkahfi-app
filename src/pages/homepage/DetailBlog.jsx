import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  doc, getDoc, updateDoc, collection, query, where, orderBy, limit, getDocs, 
  addDoc, serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../../firebase';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function DetailBlog() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
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
        // First find the blog by slug
        const blogsRef = collection(db, 'blog');
        const q = query(blogsRef, where('slug', '==', slug));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          setError('Blog not found');
          setLoading(false);
          return;
        }
        
        const blogData = querySnapshot.docs[0].data();
        const blogId = querySnapshot.docs[0].id;
        
        // Update view count
        await updateDoc(doc(db, 'blog', blogId), {
          views: (blogData.views || 0) + 1,
        });
        
        setBlog({ id: blogId, ...blogData });
        
        // Fetch related blogs (excluding current blog)
        const relatedQuery = query(
          blogsRef,
          where('slug', '!=', slug),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        const relatedSnapshot = await getDocs(relatedQuery);
        const relatedData = relatedSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setRelatedBlogs(relatedData);
        
        // Fetch latest 5 blogs for horizontal scroll
        const latestQuery = query(
          blogsRef,
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const latestSnapshot = await getDocs(latestQuery);
        const latestData = latestSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLatestBlogs(latestData);
        
        // Fetch comments for this blog
        const commentsRef = collection(db, 'komentar-blog');
        const commentsQuery = query(
          commentsRef,
          where('blogId', '==', blogId),
          orderBy('createdAt', 'desc')
        );
        const commentsSnapshot = await getDocs(commentsQuery);
        const commentsData = commentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setComments(commentsData);
        
        // Fetch all unique tags
        const tagsQuery = query(blogsRef);
        const tagsSnapshot = await getDocs(tagsQuery);
        const tagsSet = new Set();
        tagsSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.tags && Array.isArray(data.tags)) {
            data.tags.forEach(tag => tagsSet.add(tag));
          }
        });
        setAllTags(Array.from(tagsSet));
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blog: ', err);
        setError('Failed to load blog');
        setLoading(false);
      }
    };

    fetchBlogData();

    // Set up auth listener
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [slug]);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

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

  const handleCommentSubmit = async (e) => {
  e.preventDefault();
  if (!commentText.trim() || !user || !blog) return;

  try {
    const newComment = {
      blogId: blog.id,
      userId: user.uid,
      userName: user.displayName,
      userPhoto: user.photoURL,
      content: commentText,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await addDoc(collection(db, 'komentar-blog'), newComment);
    setCommentText('');

    // Re-fetch comments agar `createdAt` ter-render dengan benar
    const commentsRef = collection(db, 'komentar-blog');
    const commentsQuery = query(
      commentsRef,
      where('blogId', '==', blog.id),
      orderBy('createdAt', 'desc')
    );
    const commentsSnapshot = await getDocs(commentsQuery);
    const commentsData = commentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setComments(commentsData);
  } catch (error) {
    console.error('Error adding comment:', error);
  }
};

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
      <section className="max-w-7xl mx-auto px-4 py-8">
        {!blog ? (
  <div className="text-center py-10 text-gray-500">Loading blog...</div>
) : (
  // konten blog<div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
              
              <div className="flex items-center text-sm text-gray-500 mb-6">
                <i className="ri-user-line mr-1"></i>
                <span className="mr-4">{blog.author}</span>
                <i className="ri-time-line mr-1"></i>
                <span>
                  {blog.createdAt?.toDate().toLocaleDateString()} •{' '}
                  {blog.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="mx-4">•</span>
                <i className="ri-eye-line mr-1"></i>
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
              ></div>
            </div>

            {/* Comments Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <i className="ri-chat-3-line mr-2"></i>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-100 bg-white text-gray-800 min-h-[100px]"
                        required
                      />
                      <button
                        type="submit"
                        className="mt-2 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-300 flex items-center"
                      >
                        <i className="ri-send-plane-line mr-2"></i>
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
                    <i className="ri-google-fill mr-2 text-red-500"></i>
                    Login with Google
                  </button>
                </div>
              )}
              
              <div className="space-y-6">
                {comments.length > 0 ? (
                  comments.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar src={comment.userPhoto} alt={comment.userName} />
                      <div className="flex-grow">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold">{comment.userName}</h4>
                            <span className="text-xs text-gray-500">
                              {comment.createdAt?.toDate().toLocaleString()}
                            </span>
                          </div>
                          <p>{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <i className="ri-chat-1-line text-4xl mb-2"></i>
                    <p>No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Latest Blogs Horizontal Scroll */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Latest Blogs</h2>
              <div className="relative">
                <div className="overflow-x-auto pb-4">
                  <div className="flex space-x-4">
                    {latestBlogs.map(latestBlog => (
                      <div key={latestBlog.id} className="flex-shrink-0 w-64">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
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
                              {latestBlog.createdAt?.toDate().toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="space-y-6 sticky top-4">
              {/* Popular Blogs */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <i className="ri-fire-line mr-2 text-red-500"></i>
                  Popular Blogs
                </h2>
                
                {relatedBlogs.length > 0 ? (
                  <div className="space-y-4">
                    {relatedBlogs.map((relatedBlog) => (
                      <div key={relatedBlog.id} className="flex gap-3">
                        <img 
                          src={relatedBlog.thumbnail} 
                          alt={relatedBlog.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <h3 className="font-medium hover:text-gray-600">
                            <a href={`/blog/${relatedBlog.slug}`} className="line-clamp-2">
                              {relatedBlog.title}
                            </a>
                          </h3>
                          <div className="text-xs text-gray-500 mt-1">
                            {relatedBlog.views} views
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-4">
                    No related blogs found
                  </div>
                )}
              </div>
              
              {/* Tags */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <i className="ri-price-tag-3-line mr-2 text-blue-500"></i>
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag, index) => (
                    <a
                      key={index}
                      href={`/blog?tag=${tag}`}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full"
                    >
                      {tag}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
)}
      </section>
    </div>
  );
}