// src/components/blog/HeaderSection.jsx
import { Link } from 'react-router-dom';

export default function BlogHeader({ tagFilter }) {
    return (
        <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3 text-gray-800">
                <span className="text-[#eb6807]">Blog</span> Kost Kahfi
            </h1>
            <div className="w-20 h-1 bg-[#eb6807] mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-lg mx-auto">
                {tagFilter
                    ? `Blog dengan tag "${tagFilter}"`
                    : 'Tetap terhubung dengan informasi dan kabar terbaru seputar KostAlkahfi'}
            </p>
            {tagFilter && (
                <Link to="/blogs" className="text-red-600">
                    [hapus filter]
                </Link>
            )}
        </div>
    );
}