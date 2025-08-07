export default function AboutCTA() {
    return (
        <div className="bg-gradient-to-r from-[#1F2937] to-[#1F2937] text-white rounded-2xl p-12 text-center overflow-hidden relative">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full"></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full"></div>
            <div className="relative">
                <h2 className="text-3xl font-bold mb-4">Bergabunglah dengan Komunitas Kami</h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto">
                    Temukan pengalaman tinggal terbaik di jantung Depok
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <a
                        href="/kamar"
                        className="bg-white text-[#eb6807] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                    >
                        Lihat Kamar Tersedia
                    </a>
                    <a
                        href="/contact"
                        className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors"
                    >
                        Hubungi Kami
                    </a>
                </div>
            </div>
        </div>
    );
}