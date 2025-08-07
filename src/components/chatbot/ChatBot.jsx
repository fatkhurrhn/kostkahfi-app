// src/components/ChatBot.jsx

import React, { useState, useRef, useEffect } from 'react';
import { getAutoResponse } from './responses';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Holaaaa! 👋 Aku virtual assistant Kost Al Kahfi nih~ 🏡<br><small class='text-orange-600'>Info penting: Saat ini semua kamar sudah terisi penuh ya gaes!</small><br>Aku bisa bantu jawab pertanyaan seputar:<br>• Kamar & fasilitas 🛏️<br>• Harga & pembayaran 💰<br>• Lokasi & akses 📍<br>• dll<br>Langsung tanya aja yaa... :v <br> yang lain juga bisa sih sebenarnya, tapi jangan yang aneh-aneh wkwk",
      sender: 'bot',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickReplies = [
    "Ada kamar kosong?",
    "Berapa harga sewa?",
    "Lokasi tepatnya dimana?",
    "Bisa lihat foto kamar?",
    "Ada wifi ga?",
    "Boleh bawa teman?",
    "Jam malam sampai kapan?",
    "Ada video tour?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const TypingDots = () => (
    <div className="flex space-x-1">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );

  const generateContent = async (prompt) => {
    const autoResponse = getAutoResponse(prompt);
    if (autoResponse) return autoResponse.text;

    try {
      const response = await fetch('http://localhost:9999/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `[Kontekstual untuk Kost Al Kahfi di Depok] Pertanyaan: ${prompt}\n` +
            `Jawab dengan bahasa santai dan friendly seperti anak muda. ` +
            `Gunakan emoticon sesekali. Jika tidak tahu jawabannya, arahkan ` +
            `ke kontak pengelola di 082285512813.`
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Server error:', error);
        return "Yah, server lagi error nih 😅<br>" +
          "Coba tanya lagi atau langsung hubungi om kost aja ya:<br>" +
          "📞 <a href='tel:082285512813' class='text-orange-600'>0822-8551-2813</a>";
      }

      const data = await response.json();
      return data.reply || "Aduh aku kurang paham nih 😅<br>" +
        "Coba tanya ke om kost langsung aja yuk:<br>" +
        "📞 <a href='tel:082285512813' class='text-orange-600'>0822-8551-2813</a>";
    } catch (error) {
      console.error('Network error:', error);
      return "Wah koneksiku lagi bermasalah nih~ 😢<br>" +
        "Bisa langsung kontak om kost aja ya:<br>" +
        "📞 <a href='tel:082285512813' class='text-orange-600'>0822-8551-2813</a><br>" +
        "Atau coba lagi nanti yaa!";
    }
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) return;

    setMessages(prev => [...prev, { id: Date.now(), text, sender: 'user' }]);
    setInputText('');
    setIsTyping(true);

    const reply = await generateContent(text);
    setIsTyping(false);

    setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, sender: 'bot' }]);
  };

  const handleQuickReply = (question) => {
    setInputText(question);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-4 w-14 h-14 bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-700 active:scale-95 transition z-50"
          aria-label="Open Chat"
        >
          <i className="ri-robot-2-line text-xl"></i>
        </button>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end pointer-events-none">
          {/* Mobile: Full Screen | Desktop: Panel Kecil */}
          <div
            className={`bg-white w-full ${isOpen ? 'animate-slide-up' : ''
              } md:max-w-md md:h-[600px] md:max-h-[90vh] md:rounded-t-xl md:shadow-2xl md:overflow-hidden md:border md:border-orange-200 flex flex-col pointer-events-auto ${isOpen ? 'h-full' : 'h-0'
              }`}
            style={{ maxHeight: '100vh' }}
          >
            {/* Header */}
            <div className="bg-orange-600 text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold">Kost Al Kahfi Chatbot</h3>
                <p className="text-sm opacity-90">Online sekarang</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white p-1 h-10 w-10 hover:bg-white/20 rounded-full transition"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white mr-2 mt-1">
                      🏡
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-lg ${msg.sender === 'user'
                        ? 'bg-orange-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-orange-100 rounded-bl-none shadow-sm'
                      }`}
                    dangerouslySetInnerHTML={{ __html: msg.text }}
                  />
                  {msg.sender === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 ml-2 mt-1 flex items-center justify-center text-orange-600 border border-orange-200">
                      👤
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white mr-2">
                    🏡
                  </div>
                  <div className="bg-white px-3 py-2 rounded-lg rounded-bl-none border border-orange-100 shadow-sm">
                    <TypingDots />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies - Scroll Horizontal */}
            <div className="px-3 py-2 bg-orange-50 border-t border-orange-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
              <div className="flex gap-2 pb-1">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="text-xs bg-white text-orange-700 border border-orange-300 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-all shadow-sm whitespace-nowrap"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-orange-100 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Tanya tentang kamar, harga, dll..."
                className="flex-1 border border-orange-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className={`px-4 py-2 rounded-lg ${inputText.trim()
                    ? 'bg-orange-600 hover:bg-orange-700'
                    : 'bg-orange-300 cursor-not-allowed'
                  } text-white transition-colors`}
              >
                <i className="ri-telegram-2-line"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;