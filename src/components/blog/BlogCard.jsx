// src/components/blog/BlogCard.jsx
import { Link } from 'react-router-dom';

export default function BlogCard({ blog }) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
                            year: 'numeric',
                        })}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{blog.views} views</span>
                </div>
                <h2 className="text-xl font-bold mb-2 line-clamp-2">
                    <Link to={`/blogs/${blog.slug}`} className="hover:text-gray-600">
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
                            to={`/blogs?tag=${tag}`}
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
    );
}