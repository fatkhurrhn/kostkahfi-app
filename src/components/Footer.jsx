import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerSections = [
    {
      title: "Tentang",
      links: [
        { label: "Profil Kost", path: "/about" },
        { label: "Fasilitas", path: "/facilities" },
        { label: "Gallery", path: "/gallery" }
      ]
    },
    {
      title: "Program",
      links: [
        { label: "Mahasantri", path: "/program/mahasantri" },
        { label: "Biman", path: "/program/biman" }
      ]
    },
    {
      title: "Layanan",
      links: [
        { label: "Cavelatte", path: "/cavelatte" },
        { label: "Blog", path: "/blog" },
        { label: "FAQ", path: "/faq" }
      ]
    },
    {
      title: "Kontak",
      content: (
        <address className="not-italic text-gray-600 space-y-2">
          <p>Jl. Rawa Pule, Kukusan, Depok</p>
          <p><span className="font-medium">Email:</span> kostalkahfi@gmail.com</p>
          <p><span className="font-medium">Kontak:</span> +62 812-3456-7890</p>
        </address>
      )
    }
  ];

  const socialLinks = [
    { 
      icon: "ri-map-pin-fill", 
      url: "https://maps.app.goo.gl/iVsCbC5sxibLzd376",
      tooltip: "Lokasi Kami"
    },
    { 
      icon: "ri-whatsapp-fill", 
      url: "https://wa.me/6281234567890",
      tooltip: "WhatsApp"
    },
    { 
      icon: "ri-instagram-fill", 
      url: "https://instagram.com/kostalkahfi",
      tooltip: "Instagram"
    },
    { 
      icon: "ri-tiktok-fill", 
      url: "https://tiktok.com/@kostalkahfi",
      tooltip: "TikTok"
    }
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 pb-7">
        {/* Main Footer Content */}
        <div className="grid grid-cols- md:grid-cols-5 gap-8 mb-8">
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-2xl font-bold text-[#eb6807] mb-4 inline-block">
              kostAlKahfi
            </Link>
            <p className="text-gray-600 mb-4">
              Rumah nyaman untuk mahasiswa dan profesional muda di Depok.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  to={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#eb6807] text-xl transition-colors"
                  aria-label={social.tooltip}
                >
                  <i className={social.icon}></i>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index} className="mt-4 md:mt-0">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {section.title}
              </h3>
              {section.links ? (
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        to={link.path}
                        className="text-gray-600 hover:text-[#eb6807] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                section.content
              )}
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-5 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} kostAlKahfi. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/privacy-policy" className="text-gray-500 hover:text-[#eb6807] text-sm">
              Kebijakan Privasi
            </Link>
            <Link to="/terms" className="text-gray-500 hover:text-[#eb6807] text-sm">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}