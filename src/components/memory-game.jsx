import React, { useEffect, useState } from "react";

const MemoryGame = () => {
  const [gridSize, setGridSize] = useState(4);
  const [cards, setCards] = useState([]);

  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);

//   const [maxMoves, setMaxMoves] = useState(9999);

  const [won, setWon] = useState(false);

  const handleGridSizeChange = (e) => {
    const size = parseInt(e.target.value);

    if (size >= 2 && size <= 10) {
      setGridSize(size);
    }
  };

  const initializeGame = () => {
    const totalCards = gridSize * gridSize;
    const pairCount = Math.floor(totalCards / 2);

    const numbers = [];
    for (let i = 1; i <= pairCount; i++) {
      numbers.push(i);
    }

    const shuffledCards = [...numbers, ...numbers];

    // Fisher-Yates shuffle algorithm
    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
      [shuffledCards[i], shuffledCards[j]] = [
        shuffledCards[j],
        shuffledCards[i],
      ]; // swap elements
    }

    const shuffledCardsobj = shuffledCards.map((number, index) => ({
      id: index,
      number,
    }));

    setCards(shuffledCardsobj);
    setFlipped([]);
    setSolved([]);
    setWon(false);

    // console.log(shuffledCardsobj);
  };

  useEffect(() => {
    initializeGame();
  }, [gridSize]);

  const checkMatch = (secondId) => {
    const [firstId] = flipped;

    if (cards[firstId].number === cards[secondId].number) {
      setSolved([...solved, firstId, secondId]);
      setFlipped([]);
      setDisabled(false);
    } else {
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 1000);
    }
  };

  const handleClick = (id) => {
    if (disabled || won) {
      return;
    }

    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }

    if (flipped.length === 1) {
      setDisabled(true);

      if (id !== flipped[0]) {
        setFlipped([...flipped, id]);

        // check logic;
        checkMatch(id);
      } else {
        setFlipped([]);
        setDisabled(false);
      }
    }
  };

  const isFlipped = (id) => flipped.includes(id) || solved.includes(id);
  const isSolved = (id) => solved.includes(id);

  useEffect(() => {
    if (cards.length > 0 && solved.length === cards.length) {
      setWon(true);
    }
  }, [solved, cards]);

  return (
    <div className=" flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Memory Game</h1>

      {/* Input grid size */}

      <div className=" mb-4 ">
        <label htmlFor="gridSize" className="mr-2">
          {" "}
          Grid Size: (max 10)
        </label>
        <input
          type="number"
          id="gridSize"
          min="2"
          max="10"
          value={gridSize}
          onChange={handleGridSizeChange}
          className=" border-2 border-gray-300 rounded px-2 py-2"
        />
      </div>

      {/* Input max Moves */}

      {/* <div className="mb-4">
        <label htmlFor="maxmoves" className="mr-2"> Max Moves: (max 9999) </label>
        <input
          type="number"
          id="maxmoves"
          min="0"
          max="9999"
          value={maxMoves}
          className= " border-2 border-gray-300 rounded px-2 py-2"
        />
      </div> */}

      {/* Current moves */}

      

      {/* Game board which will show the cards */}
      <div
        className={` grid gap-2 mb-4`}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          width: `min(100%, ${gridSize * 5.5}rem)`,
        }}
      >
        {cards.map((card) => {
          return (
            <div
              key={card.id}
              onClick={() => {
                handleClick(card.id);
              }}
              className={`aspect-square flex items-center justify-center text-xl font-bold rounded-lg cursor-pointer transition-all duration-300 ${
                isFlipped(card.id)
                  ? isSolved(card.id)
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-500"
              }`}
            >
              {isFlipped(card.id) ? card.number : "?"}
            </div>
          );
        })}
      </div>

      {/* Result */}

      {won && (
        <div className="mt-4 text-4xl font-bold text-green-600 animate-bounce">
          {" "}
          You Won!
        </div>
      )}
      {/* Reset or Play again Button */}
      <button
        onClick={initializeGame}
        className=" mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        {won ? "Play again.." : "Reset"}
      </button>
    </div>
  );
};

export default MemoryGame;
