import TeamMember from './TeamMember';

export default function TeamSection() {
    const teamMembers = [
        {
            name: "Ahmad Fatkhurrohman",
            role: "Founder & CEO",
            specialty: "Manajemen Properti",
            social: {
                instagram: "@afatkhur",
                linkedin: "/in/afatkhur",
                email: "afatkhur@kostalkahfi.com"
            },
            photo: "bg-[url('https://i.pinimg.com/736x/f6/05/92/f60592ce2784e044f8e3387f025222e7.jpg')]"
        },
        {
            name: "Siti Aminah",
            role: "Manajer Operasional",
            specialty: "Hubungan Penghuni",
            social: {
                instagram: "@sitiaminah",
                linkedin: "/in/sitiaminah",
                email: "sitiaminah@kostalkahfi.com"
            },
            photo: "bg-[url('https://i.pinimg.com/736x/e1/f3/e9/e1f3e9f687aff238f6624e6b7930ec5a.jpg')]"
        },
        {
            name: "Budi Santoso",
            role: "Manajer Fasilitas",
            specialty: "Perawatan Gedung",
            social: {
                instagram: "@budisant",
                linkedin: "/in/budisant",
                email: "budisant@kostalkahfi.com"
            },
            photo: "bg-[url('https://i.pinimg.com/1200x/87/fa/ec/87faec9b22495d9ee1544af6c760c1c6.jpg')]"
        },
        {
            name: "Dewi Anggraeni",
            role: "Manajer Cavelatte",
            specialty: "Event & Komunitas",
            social: {
                instagram: "@dewanggra",
                linkedin: "/in/dewanggra",
                email: "dewanggra@kostalkahfi.com"
            },
            photo: "bg-[url('https://i.pinimg.com/736x/45/c3/a6/45c3a651fc02cb82a76418324375fa28.jpg')]"
        }
    ];

    return (
        <div className="mb-20">
            <div className="text-center mb-12 px-4">
                <h2 className="text-4xl font-bold mb-4 text-gray-800">
                    <span className="text-[#eb6807]">Tim</span> Pengelola
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                    Tim profesional yang berdedikasi untuk memberikan pengalaman terbaik bagi penghuni Kost Al Kahfi
                </p>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden px-4">
                <div className="pb-6 overflow-x-auto">
                    <div className="flex space-x-4 w-max">
                        {teamMembers.map((member, index) => (
                            <TeamMember key={index} member={member} mobile={true} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden lg:grid grid-cols-4 gap-5 px-4">
                {teamMembers.map((member, index) => (
                    <TeamMember key={index} member={member} mobile={false} />
                ))}
            </div>
        </div>
    );
}