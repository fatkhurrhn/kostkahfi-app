// src/components/blog/ErrorMessage.jsx
export default function ErrorMessage({ error }) {
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