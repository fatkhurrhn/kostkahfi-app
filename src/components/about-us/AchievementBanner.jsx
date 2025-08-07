export default function AchievementBanner() {
    const achievements = [
        {
            number: "70+",
            title: "Kamar Tersedia",
            icon: "ri-home-3-line"
        },
        {
            number: "11",
            title: "Fasilitas Unggulan",
            icon: "ri-star-smile-line"
        },
        {
            number: "24/7",
            title: "Layanan Pelanggan",
            icon: "ri-customer-service-2-line"
        }
    ];

    return (
        <div className="mb-24 bg-gray-800 rounded-2xl overflow-hidden">
            <div className="grid md:grid-cols-3">
                {achievements.map((item, index) => (
                    <div key={index} className="p-8 text-center text-white">
                        <i className={`${item.icon} text-4xl mb-4`}></i>
                        <p className="text-4xl font-bold mb-2">{item.number}</p>
                        <p className="text-lg">{item.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}