import { Link } from 'react-router-dom';

export default function GalleryPreview() {
    const galleryImages = [
        "https://i.pinimg.com/1200x/95/55/c6/9555c67c29362dc7951a426337a8e773.jpg",
        "https://i.pinimg.com/736x/68/25/0e/68250e5a011744a8dc97dcd541e84020.jpg",
        "https://i.pinimg.com/1200x/6f/e5/6a/6fe56a2dc513680a5b5f743f0b7db19f.jpg",
        "https://i.pinimg.com/736x/40/91/07/4091077b10a58899f01ed37be5731d41.jpg",
    ];

    return (
        <div className="mb-16">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                    <span className="block sm:hidden">Galeri</span>
                    <span className="hidden sm:block">
                        Galeri <span className="text-[#eb6807]">Kost Alkahfi</span>
                    </span>
                </h2>
                <Link
                    to="/gallery"
                    className="inline-flex items-center text-[#eb6807] hover:text-[#d45e06] font-medium transition-colors"
                >
                    Lihat Semua <i className="ri-arrow-right-line ml-2"></i>
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryImages.map((src, index) => (
                    <div
                        key={index}
                        className="aspect-square rounded-xl overflow-hidden transform transition-transform duration-300 hover:scale-[1.03] shadow-sm"
                    >
                        <img
                            src={src}
                            alt={`Galeri ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}