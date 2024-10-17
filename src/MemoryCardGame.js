import React, { useState, useEffect } from 'react';
import './MemoryCardGame.css';

const cardValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33B5', '#33FFF3', '#B533FF', '#FFC233'];

const MemoryCardGame = () => {
  const [board, setBoard] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStatus, setGameStatus] = useState('ongoing'); // 'ongoing', 'win', 'draw'
  const maxMoves = 20;

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const shuffledCards = [...cardValues, ...cardValues]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        value,
        index,
        matched: false,
        flipped: false,
        color: colors[index % colors.length], // Assign a color based on index
      }));

    setBoard(shuffledCards);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameStatus('ongoing'); // Reset game status
  };

  const handleCardClick = (index) => {
    if (flippedIndices.length < 2 && !board[index].flipped && !board[index].matched) {
      const newBoard = [...board];
      newBoard[index].flipped = true;
      setFlippedIndices([...flippedIndices, index]);
      setBoard(newBoard);
      setMoves((prev) => prev + 1);

      if (flippedIndices.length === 1) {
        checkMatch(index);
      }

      // Check for draw condition
      if (moves + 1 >= maxMoves && matchedPairs.length < cardValues.length) {
        setGameStatus('draw');
      }
    }
  };

  const checkMatch = (index) => {
    const firstIndex = flippedIndices[0];
    const firstCard = board[firstIndex];
    const secondCard = board[index];

    if (firstCard.value === secondCard.value) {
      const newBoard = [...board];
      newBoard[firstIndex].matched = true;
      newBoard[index].matched = true;
      setMatchedPairs([...matchedPairs, firstCard.value]);
      setBoard(newBoard);
      setFlippedIndices([]);

      // Check for win condition
      if (matchedPairs.length + 1 === cardValues.length) {
        setGameStatus('win');
      }
    } else {
      setTimeout(() => {
        const newBoard = [...board];
        newBoard[firstIndex].flipped = false;
        newBoard[index].flipped = false;
        setBoard(newBoard);
        setFlippedIndices([]);
      }, 1000);
    }
  };

  return (
    <div className="memory-card-game">
      <h1>Memory Card Game</h1>
      <h2>Moves: {moves}</h2>
      <div className="board">
        {board.map((card, index) => (
          <div
            key={index}
            className={`card ${card.flipped ? 'flipped' : ''}`}
            onClick={() => handleCardClick(index)}
            style={{ backgroundColor: card.flipped || card.matched ? card.color : '#ffffff' }} // Change background color
          >
            {card.flipped || card.matched ? card.value : '?'}
          </div>
        ))}
      </div>
      {gameStatus === 'win' && <div className="winner">You found all pairs!</div>}
      {gameStatus === 'draw' && <div className="draw">It's a draw!</div>}
      <button onClick={resetGame}>Restart Game</button>
    </div>
  );
};

export default MemoryCardGame;
