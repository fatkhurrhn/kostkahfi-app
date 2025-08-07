export default function TeamMember({ member, mobile }) {
    return (
        <div className={`${mobile ? 'w-72 flex-shrink-0' : ''} bg-white rounded-xl shadow-md overflow-hidden`}>
            <div className={`${mobile ? 'h-48' : 'h-60'} ${member.photo} bg-cover bg-center`}></div>
            <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                <p className="text-[#eb6807] font-medium mb-2">{member.role}</p>
                <div className="flex space-x-3">
                    <a
                        href={`https://instagram.com/${member.social.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-[#eb6807] transition-colors"
                        aria-label={`Instagram ${member.name}`}
                    >
                        <i className="ri-instagram-fill text-xl"></i>
                    </a>
                    <a
                        href={`https://linkedin.com${member.social.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-[#eb6807] transition-colors"
                        aria-label={`LinkedIn ${member.name}`}
                    >
                        <i className="ri-linkedin-box-fill text-xl"></i>
                    </a>
                    <a
                        href={`mailto:${member.social.email}`}
                        className="text-gray-500 hover:text-[#eb6807] transition-colors"
                        aria-label={`Email ${member.name}`}
                    >
                        <i className="ri-mail-fill text-xl"></i>
                    </a>
                </div>
            </div>
        </div>
    );
}