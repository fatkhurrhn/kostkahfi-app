import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { autoTranslate } from '../utils/translate';
import { useTranslation } from 'react-i18next';

export default function Template() {
  const { i18n } = useTranslation();

  // Konten asli
  const title1EN = 'Contact';
  const title2EN = 'Us';
  const descriptionEN = 'Have questions, feedback, or interested in collaborating with us? We\'re here to help. Feel free to reach out to us anytime.';

  // State terjemahan
  const [title1, setTitle1] = useState(title1EN);
  const [title2, setTitle2] = useState(title2EN);
  const [description, setDescription] = useState(descriptionEN);

  useEffect(() => {
    const translateContent = async () => {
      if (i18n.language === 'id') {
        const t1 = await autoTranslate(title1EN, 'id');
        const t2 = await autoTranslate(title2EN, 'id');
        const desc = await autoTranslate(descriptionEN, 'id');
        setTitle1(t1);
        setTitle2(t2);
        setDescription(desc);
      } else {
        // Balik ke English
        setTitle1(title1EN);
        setTitle2(title2EN);
        setDescription(descriptionEN);
      }
    };

    translateContent();
  }, [i18n.language]);

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 transition-colors duration-300">
      <Navbar />
      <section className="max-w-7xl mx-auto px-4 pt-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3 text-gray-800">
            <span className="text-[#eb6807]">{title1}</span> {title2}
          </h1>
          <div className="w-20 h-1 bg-[#eb6807] mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-lg mx-auto">
            {description}
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
