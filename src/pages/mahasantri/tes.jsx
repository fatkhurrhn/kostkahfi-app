import React, { useState, useEffect } from 'react';

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
    // Load best time from localStorage if available
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
        // Match found
        const newCards = [...cards];
        newCards[firstCardIndex].matched = true;
        newCards[secondCardIndex].matched = true;
        setCards(newCards);
        
        setMatchedPairs((prev) => prev + 1);
        setMoves((prev) => prev + 1);
        setFlippedCards([]);
        
        if (matchedPairs + 1 === cards.length / 2) {
          // Game finished
          const finalTime = Math.floor((Date.now() - startTime) / 1000);
          setElapsedTime(finalTime);
          setGameOver(true);
          
          // Update best time if current time is better
          if (!bestTime || finalTime < bestTime) {
            setBestTime(finalTime);
            localStorage.setItem('memoryMatchBestTime', finalTime.toString());
          }
        }
      } else {
        // No match
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">Memory Match</h1>
        
        <div className="grid grid-cols-4 gap-3 mb-6">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => flipCard(index)}
              className={`w-16 h-16 flex items-center justify-center rounded-lg cursor-pointer text-3xl transition-all duration-300 transform ${
                card.flipped || card.matched 
                  ? 'bg-white rotate-y-180' 
                  : 'bg-purple-500 hover:bg-purple-600 hover:scale-105'
              } ${card.matched ? 'opacity-70' : ''} shadow-md`}
            >
              {card.flipped || card.matched ? card.value : '?'}
            </div>
          ))}
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-purple-700">Moves:</span>
            <span className="font-bold">{moves}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-purple-700">Time:</span>
            <span className="font-bold">{formatTime(elapsedTime)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-purple-700">Best Time:</span>
            <span className="font-bold">{formatTime(bestTime)}</span>
          </div>
        </div>
        
        {!gameStarted && !gameOver && (
          <button
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-lg shadow hover:from-purple-600 hover:to-blue-600 transition-all mb-4"
            onClick={() => {
              setGameStarted(true);
              setStartTime(Date.now());
            }}
          >
            Start Game
          </button>
        )}
        
        {gameOver && (
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">Congratulations!</div>
            <p className="mb-4">You finished in {formatTime(elapsedTime)} with {moves} moves</p>
            <button
              className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-lg shadow hover:from-green-600 hover:to-teal-600 transition-all"
              onClick={restartGame}
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryMatchGame;