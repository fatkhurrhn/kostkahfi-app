export default function UniqueValue() {
    const features = [
        {
            icon: "ri-community-line",
            title: "Ekosistem Komunitas",
            description: "Program mingguan untuk networking dan pengembangan diri"
        },
        {
            icon: "ri-leaf-line",
            title: "Konsep Green Living",
            description: "Lingkungan hijau dengan sistem pengelolaan sampah terpadu"
        },
        {
            icon: "ri-smartphone-line",
            title: "Digital Experience",
            description: "Aplikasi mobile untuk manajemen pembayaran dan permintaan layanan"
        }
    ];

    return (
        <div className="mb-24 bg-gray-100 p-12 rounded-3xl">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
                <span className="text-[#eb6807]">Keunikan</span> Al Kahfi
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
                {features.map((item, index) => (
                    <div key={index} className="bg-white p-8 rounded-xl shadow-sm text-center hover:shadow-md transition-all">
                        <div className="bg-[#eb6807]/10 text-[#eb6807] p-4 rounded-full inline-block mb-4">
                            <i className={`${item.icon} text-3xl`}></i>
                        </div>
                        <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}