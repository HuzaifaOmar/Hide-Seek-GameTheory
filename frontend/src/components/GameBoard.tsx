import React from "react";
import { useGame } from "../contexts/GameContext";
import { getCellTypeColor, getGridDimensions } from "../utils/gameUtils";

const GameBoard: React.FC = () => {
  const { settings, gameState, makeMove, loading, nextRound } = useGame();

  if (gameState.round === 0 || !gameState.placeTypes.length) {
    return null;
  }

  const handleCellClick = async (index: number) => {
    if (gameState.humanPosition === undefined && !loading) {
      await makeMove(index);
    }
  };

  const handleNextRound = () => {
    // Reset positions for next round
    nextRound();
  };

  const getCellTypeDescription = (type: string): string => {
    switch (type.toLowerCase()) {
      case "easy":
        return "Easy for the seeker";
      case "neutral":
        return "Neutral ground";
      case "hard":
        return "Hard for the seeker";
      default:
        return type;
    }
  };

  const renderLinearGrid = () => {
    return (
      <div className="flex flex-wrap justify-center gap-6 mb-6 max-w-5xl mx-auto">
        {gameState.placeTypes.map((type, index) => {
          const isPlayerChoice = gameState.humanPosition === index;
          const isComputerChoice = gameState.computerPosition === index;
          const bothChoseSame = isPlayerChoice && isComputerChoice;

          return (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              disabled={gameState.humanPosition !== undefined}
              className={`
                relative w-28 h-28 rounded-lg flex items-center justify-center text-2xl font-bold
                transition-all duration-300 transform hover:scale-105
                ${getCellTypeColor(type.toLowerCase())}
                ${
                  bothChoseSame
                    ? "ring-4 ring-purple-500"
                    : isPlayerChoice
                    ? "ring-4 ring-blue-500"
                    : isComputerChoice
                    ? "ring-4 ring-red-500"
                    : ""
                }
                 ${
                   gameState.humanPosition !== undefined || loading
                     ? "cursor-default"
                     : "cursor-pointer"
                 }
              `}
            >
              <span className="text-white">{index + 1}</span>
              {isPlayerChoice && (
                <div className="absolute -top-3 -right-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  You
                </div>
              )}
              {isComputerChoice && !bothChoseSame && (
                <div className="absolute -top-3 -left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  AI
                </div>
              )}
              {bothChoseSame && (
                <div className="absolute -top-3 -left-3 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                  Both
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  const renderGrid2D = () => {
    const { cols } = getGridDimensions(settings.gridSize);

    return (
      <div
        className="grid gap-4 mb-6 mx-auto"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          maxWidth: `${Math.min(cols * 120, 720)}px`,
        }}
      >
        {gameState.placeTypes.map((type, index) => {
          const isPlayerChoice = gameState.humanPosition === index;
          const isComputerChoice = gameState.computerPosition === index;
          const bothChoseSame = isPlayerChoice && isComputerChoice;

          return (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              disabled={gameState.humanPosition !== undefined || loading}
              className={`
                relative w-24 h-24 rounded-lg flex items-center justify-center text-xl font-bold
                transition-all duration-300 transform hover:scale-105
                ${getCellTypeColor(type.toLowerCase())}
                ${
                  bothChoseSame
                    ? "ring-4 ring-purple-500"
                    : isPlayerChoice
                    ? "ring-4 ring-blue-500"
                    : isComputerChoice
                    ? "ring-4 ring-red-500"
                    : ""
                }
                ${
                  gameState.humanPosition !== undefined || loading
                    ? "cursor-default"
                    : "cursor-pointer"
                }
              `}
            >
              <span className="text-white">{index + 1}</span>
              {isPlayerChoice && (
                <div className="absolute -top-3 -right-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  You
                </div>
              )}
              {isComputerChoice && !bothChoseSame && (
                <div className="absolute -top-3 -left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  AI
                </div>
              )}
              {bothChoseSame && (
                <div className="absolute -top-3 -left-3 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                  Both
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto mb-8">
      <h2 className="text-xl font-semibold mb-4 text-center text-slate-800">
        {settings.humanRole === "hider"
          ? "Choose a place to hide"
          : "Choose a place to search"}
      </h2>

      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {gameState.placeTypes
          .filter((type, index, self) => self.indexOf(type) === index)
          .map((type) => (
            <div key={type} className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full mr-1 ${getCellTypeColor(
                  type.toLowerCase()
                )}`}
              ></div>
              <span className="text-sm text-slate-700 mr-3">
                {getCellTypeDescription(type)}
              </span>
            </div>
          ))}
      </div>

      {settings.gridType === "2d" ? renderGrid2D() : renderLinearGrid()}

      {gameState.winner && (
        <div className="text-center mt-4">
          <div
            className={`text-lg font-semibold mb-2 ${
              gameState.winner === "human"
                ? "text-green-600"
                : gameState.winner === "computer"
                ? "text-red-600"
                : "text-slate-600"
            }`}
          >
            {gameState.winner === "human"
              ? "You won this round!"
              : gameState.winner === "computer"
              ? "Computer won this round!"
              : "This round was a tie!"}
          </div>
          <button
            onClick={() => handleNextRound()}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
          >
            {loading ? "Loading..." : "Next Round"}
          </button>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
