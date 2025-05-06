import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const MemoryMatchGame = () => {
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [moves, setMoves] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [bestTime, setBestTime] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);

    const generateCards = () => {
        const cardValues = ['🍎', '🍌', '🍒', '🍍', '🍇', '🍓', '🍉', '🍊'];
        const cards = [...cardValues, ...cardValues];
        const shuffledCards = cards.sort(() => Math.random() - 0.5);
        return shuffledCards.map((value, index) => ({
            id: index,
            value,
            flipped: false,
            matched: false
        }));
    };

    useEffect(() => {
        const savedBestTime = localStorage.getItem('memoryMatchBestTime');
        if (savedBestTime) {
            setBestTime(parseInt(savedBestTime));
        }
        setCards(generateCards());
    }, []);

    useEffect(() => {
        let timerInterval;

        if (startTime !== null) {
            timerInterval = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }

        return () => clearInterval(timerInterval);
    }, [startTime]);

    const flipCard = (index) => {
        if (!gameStarted) {
            setGameStarted(true);
            setStartTime(Date.now());
        }

        if (flippedCards.length < 2 && !cards[index].flipped && !cards[index].matched && !gameOver) {
            const newCards = [...cards];
            newCards[index].flipped = true;
            setCards(newCards);
            setFlippedCards((prev) => [...prev, index]);
        }
    };

    useEffect(() => {
        if (flippedCards.length === 2) {
            const [firstCardIndex, secondCardIndex] = flippedCards;
            const firstCard = cards[firstCardIndex];
            const secondCard = cards[secondCardIndex];

            if (firstCard.value === secondCard.value) {
                const newCards = [...cards];
                newCards[firstCardIndex].matched = true;
                newCards[secondCardIndex].matched = true;
                setCards(newCards);

                setMatchedPairs((prev) => prev + 1);
                setMoves((prev) => prev + 1);
                setFlippedCards([]);

                if (matchedPairs + 1 === cards.length / 2) {
                    const finalTime = Math.floor((Date.now() - startTime) / 1000);
                    setElapsedTime(finalTime);
                    setGameOver(true);

                    if (!bestTime || finalTime < bestTime) {
                        setBestTime(finalTime);
                        localStorage.setItem('memoryMatchBestTime', finalTime.toString());
                    }
                }
            } else {
                setMoves((prev) => prev + 1);
                setTimeout(() => {
                    const newCards = [...cards];
                    newCards[firstCardIndex].flipped = false;
                    newCards[secondCardIndex].flipped = false;
                    setCards(newCards);
                    setFlippedCards([]);
                }, 1000);
            }
        }
    }, [flippedCards, cards, matchedPairs]);

    const restartGame = () => {
        setCards(generateCards());
        setFlippedCards([]);
        setMatchedPairs(0);
        setMoves(0);
        setGameOver(false);
        setGameStarted(false);
        setStartTime(null);
        setElapsedTime(0);
    };

    const formatTime = (time) => {
        if (time === null) return '--';
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">🎮 Memory Match Game</h2>

            <div className="flex justify-center items-center mb-4">
                <div className="flex space-x-4">
                    <div className="bg-blue-100 px-3 py-1 rounded-lg">
                        <span className="text-sm font-medium text-blue-700">Moves: </span>
                        <span className="font-bold text-blue-700">{moves}</span>
                    </div>
                    <div className="bg-blue-100 px-3 py-1 rounded-lg">
                        <span className="text-sm font-medium text-blue-700">Time: </span>
                        <span className="font-bold text-blue-700">{formatTime(elapsedTime)}</span>
                    </div>
                    <div className="bg-blue-100 px-3 py-1 rounded-lg">
                        <span className="text-sm font-medium text-blue-700">Best: </span>
                        <span className="font-bold text-blue-700">{formatTime(bestTime)}</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-center items-center mb-6">
                <div className="grid grid-cols-4 gap-5">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            onClick={() => flipCard(index)}
                            className={`w-16 h-16 flex items-center justify-center rounded-lg cursor-pointer text-3xl transition-all duration-300 transform ${card.flipped || card.matched
                                    ? 'bg-white rotate-y-180 shadow-inner'
                                    : 'bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 hover:scale-105'
                                } ${card.matched ? 'opacity-80' : ''} shadow-md`}
                            style={{
                                transformStyle: 'preserve-3d',
                                transform: card.flipped || card.matched ? 'rotateY(180deg)' : 'rotateY(0deg)',
                            }}
                        >
                            <div className={`absolute backface-hidden ${card.flipped || card.matched ? 'visible' : 'invisible'}`}>
                                {card.value}
                            </div>
                            <div className={`absolute backface-hidden ${!card.flipped && !card.matched ? 'visible' : 'invisible'}`}>
                                ?
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {gameOver && (
                <div className="text-center">
                    <div className="text-xl font-bold text-green-600 mb-2">🎉 Congratulations!</div>
                    <p className="mb-4 text-gray-700">You finished in {formatTime(elapsedTime)} with {moves} moves</p>
                    <button
                        className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg shadow hover:from-green-600 hover:to-green-700 transition-all"
                        onClick={restartGame}
                    >
                        🔄 Play Again
                    </button>
                </div>
            )}
        </div>
    );
};

const LoginForm = ({ onClose, switchToRegister }) => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            const user = await login(email, password);

            if (user.role === 'admin') {
                navigate('/dashboard-admin');
            } else {
                navigate('/dashboard-santri');
            }
        } catch {
            setError('Failed to login. Check your email and password.');
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <i className="ri-close-line text-2xl"></i>
                </button>

                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Ahlan Mahasantri 👋</h1>
                    <p className="text-gray-600 mt-1">Sign in to your account</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded">
                        <div className="flex items-center">
                            <i className="ri-error-warning-line text-red-500 mr-2"></i>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border bg-white text-gray-700 border-gray-300 rounded-lg outline-none transition focus:ring-2 focus:ring-blue-500"
                                placeholder="your@email.com"
                                required
                            />
                            <i className="ri-mail-line absolute right-3 top-3 text-gray-400"></i>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border bg-white text-gray-700 border-gray-300 rounded-lg outline-none transition focus:ring-2 focus:ring-blue-500 pr-10"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? (
                                    <i className="ri-eye-off-line text-lg"></i>
                                ) : (
                                    <i className="ri-eye-line text-lg"></i>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 px-4 rounded-lg font-medium text-white transition ${loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                                    Processing...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button
                        onClick={switchToRegister}
                        className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
                    >
                        Register here
                    </button>
                </div>
            </div>
        </div>
    );
};

const RegisterForm = ({ onClose, switchToLogin }) => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [nama, setNama] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            await register(nama, email, password);
            navigate('/mahasantri/login');
        } catch {
            setError('Failed to register. Email might already be in use.');
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <i className="ri-close-line text-2xl"></i>
                </button>

                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
                    <p className="text-gray-600 mt-1">Register as a new santri</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded">
                        <div className="flex items-center">
                            <i className="ri-error-warning-line text-red-500 mr-2"></i>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="nama"
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                className="w-full px-4 py-2 border bg-white text-gray-700 border-gray-300 rounded-lg outline-none transition focus:ring-2 focus:ring-blue-500"
                                placeholder="Your full name"
                                required
                            />
                            <i className="ri-user-line absolute right-3 top-3 text-gray-400"></i>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border bg-white text-gray-700 border-gray-300 rounded-lg outline-none transition focus:ring-2 focus:ring-blue-500"
                                placeholder="your@email.com"
                                required
                            />
                            <i className="ri-mail-line absolute right-3 top-3 text-gray-400"></i>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border bg-white text-gray-700 border-gray-300 rounded-lg outline-none transition focus:ring-2 focus:ring-blue-500 pr-10"
                                placeholder="••••••••"
                                required
                                minLength="6"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? (
                                    <i className="ri-eye-off-line text-lg"></i>
                                ) : (
                                    <i className="ri-eye-line text-lg"></i>
                                )}
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 px-4 rounded-lg font-medium text-white transition ${loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                                    Processing...
                                </span>
                            ) : (
                                'Register'
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <button
                        onClick={switchToLogin}
                        className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
                    >
                        Login here
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function HomePage() {
    const navigate = useNavigate();
    const [quote, setQuote] = useState('');
    const [showGame, setShowGame] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    useEffect(() => {
        fetch('/quotes/quotes.json')
            .then((res) => res.json())
            .then((data) => {
                const randomIndex = Math.floor(Math.random() * data.length);
                setQuote(data[randomIndex]);
            })
            .catch((err) => console.error('Gagal ambil quote:', err));
    }, []);

    return (
        <div className="h-screen flex flex-col bg-slate-50">
            <div className="flex-1 overflow-y-auto container max-w-2xl mx-auto px-4 pt-[70px] pb-20 scrollbar-hide">
                {/* Header */}
                <div className="fixed top-0 left-0 max-w-[710px] mx-auto right-0 bg-white z-50 border-b border-gray-300 py-3">
                    <div className="w-full mx-auto px-6 flex justify-between items-center">
                        <h3 className="text-black flex items-center gap-2 cursor-pointer">
                            <i className="ri-arrow-left-line text-lg"></i> Program Mahasantri
                        </h3>
                        <div className="flex items-center space-x-4">
                            <i className="ri-notification-3-line text-lg text-gray-700"></i>
                            <button
                                onClick={() => setShowLogin(true)}
                                className="text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                <i className="ri-user-line text-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Page Title with Gradient Background */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-6 mb-6 relative overflow-hidden shadow-md">
                    <div className="absolute top-0 right-0 opacity-20">
                        <i className="ri-group-line text-9xl text-white"></i>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                        Assalamualaikum 👋
                    </h1>
                    <p className="text-white text-sm opacity-90">Ahlan wa sahlan Anak Program</p>
                    <div className="mt-4 bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                        <div className="flex items-center text-white">
                            <div>
                                <p className="text-[14px]"><b>Quote of the day</b></p>
                                <p className="font-smal text-[12px]"><i>"{quote}"</i></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl pt-3">
                    <button
                        onClick={() => navigate('/mahasantri/recap-habits')}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-6 rounded-lg shadow-md transition-colors duration-300 flex flex-col items-center"
                    >
                        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Daily Habits
                        <span className="text-sm font-normal mt-1">Lihat Track Habits</span>
                    </button>

                    <button
                        onClick={() => navigate('/mahasantri/recap-kehadiran')}
                        className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-4 px-6 rounded-lg shadow-md transition-colors duration-300 flex flex-col items-center"
                    >
                        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Recap Kajian
                        <span className="text-sm font-normal mt-1">Lihat Data Kehadiran</span>
                    </button>

                    <button
                        onClick={() => navigate('/mahasantri/recap-setoran')}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-4 px-6 rounded-lg shadow-md transition-colors duration-300 flex flex-col items-center"
                    >
                        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Recap Setoran
                        <span className="text-sm font-normal mt-1">Lihat Data Setoran</span>
                    </button>

                    <button
                        onClick={() => navigate('/mahasantri/gallery')}
                        className="bg-violet-600 hover:bg-violet-700 text-white font-medium py-4 px-6 rounded-lg shadow-md transition-colors duration-300 flex flex-col items-center"
                    >
                        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Gallery Mahasantri
                        <span className="text-sm font-normal mt-1">Lihat Gallery Disini</span>
                    </button>
                </div>

                {/* Button to show game */}
                {!showGame && (
                    <button
                        onClick={() => setShowGame(true)}
                        className="w-full mt-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center"
                    >
                        <i className="ri-gamepad-line mr-2 text-xl"></i>
                        Maen Bentar Yuk hhe
                    </button>
                )}

                {/* Game Section */}
                {showGame && <MemoryMatchGame />}

                {/* Login Popup */}
                {showLogin && (
                    <LoginForm
                        onClose={() => setShowLogin(false)}
                        switchToRegister={() => {
                            setShowLogin(false);
                            setShowRegister(true);
                        }}
                    />
                )}

                {/* Register Popup */}
                {showRegister && (
                    <RegisterForm
                        onClose={() => setShowRegister(false)}
                        switchToLogin={() => {
                            setShowRegister(false);
                            setShowLogin(true);
                        }}
                    />
                )}
            </div>
        </div>
    );
}