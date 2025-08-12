// src/components/blog/BlogList.jsx
import { Link } from 'react-router-dom';
import BlogCard from './BlogCard'; 

export default function BlogList({ blogs, loading }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {loading ? (
                <div className="text-left text-gray-500">Memuat data...</div>
            ) : blogs.length ? (
                blogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                ))
            ) : (
                <div className="text-gray-500 text-center py-4">—</div>
            )}
        </div>
    );
}