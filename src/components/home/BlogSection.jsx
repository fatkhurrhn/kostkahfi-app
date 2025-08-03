// src/components/homepage/BlogSection.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { db } from '../../firebase';

export default function BlogSection() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const q = query(
          collection(db, 'blog'),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBlogPosts(posts);
      } catch (error) {
        console.error("Error fetching blog posts: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Artikel Terbaru</h2>
            <Link to="/blog" className="inline-flex items-center text-[#eb6807] font-medium">
              Lihat Semua <i className="ri-arrow-right-line ml-2"></i>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Artikel Terbaru</h2>
          <Link to="/blog" className="inline-flex items-center text-[#eb6807] font-medium">
            Lihat Semua <i className="ri-arrow-right-line ml-2"></i>
          </Link>
        </div>

        {blogPosts.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Tidak ada artikel tersedia</p>
        )}
      </div>
    </section>
  );
}

function BlogCard({ post }) {
  // Function to strip HTML tags
  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '');
  };

  // Get clean excerpt
  const cleanExcerpt = stripHtml(post.excerpt || post.content?.substring(0, 100));

  return (
    <div className="group">
      <div className="relative rounded-xl overflow-hidden aspect-video mb-4">
        <img
          src={post.thumbnail}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent"></div>
        
        {/* Date and Views container */}
        <div className="absolute bottom-0 w-full px-4 pb-3 flex justify-between items-end">
          {/* Date on left */}
          <span className="bg-white text-gray-800 text-xs px-2 py-1 rounded">
            {new Date(post.createdAt?.toDate()).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })}
          </span>
          
          {/* Views on right */}
          <span className="bg-white text-gray-800 text-xs px-2 py-1 rounded flex items-center">
            <i className="ri-eye-line mr-1"></i> {post.views || 0} Views
          </span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-2 group-hover:text-[#eb6807] transition-colors line-clamp-1">
        {post.title}
      </h3>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{cleanExcerpt}...</p>
      
      <Link 
        to={`/blog/${post.slug}`} 
        className="inline-flex items-center text-sm text-[#eb6807] hover:text-[#eb6807] font-medium"
      >
        Baca Selengkapnya <i className="ri-arrow-right-line ml-2"></i>
      </Link>
    </div>
  );
}

function BlogCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-xl aspect-video mb-4"></div>
      <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded mb-4 w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </div>
  );
}