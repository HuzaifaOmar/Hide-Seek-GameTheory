import React from 'react';
import { useGame } from '../contexts/GameContext';
import { getCellTypeColor, getCellTypeDescription } from '../utils/gameUtils';

const GameBoard: React.FC = () => {
  const { settings, gameState, makeMove } = useGame();
  
  if (gameState.round === 0 || !gameState.cellTypes.length) {
    return null;
  }

  const handleCellClick = (index: number) => {
    if (gameState.playerChoice === undefined) {
      makeMove(index);
    }
  };

  const renderLinearGrid = () => {
    return (
      <div className="flex flex-wrap justify-center gap-6 mb-6 max-w-5xl">
        {gameState.cellTypes.map((type, index) => {
          const isPlayerChoice = gameState.playerChoice === index;
          const isComputerChoice = gameState.computerChoice === index;
          const bothChoseSame = isPlayerChoice && isComputerChoice;
          
          return (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              disabled={gameState.playerChoice !== undefined}
              className={`
                relative w-28 h-28 rounded-lg flex items-center justify-center text-2xl font-bold
                transition-all duration-300 transform hover:scale-105
                ${getCellTypeColor(type)}
                ${bothChoseSame ? 'ring-4 ring-purple-500' : 
                  isPlayerChoice ? 'ring-4 ring-blue-500' : 
                  isComputerChoice ? 'ring-4 ring-red-500' : ''}
                ${gameState.playerChoice !== undefined ? 'cursor-default' : 'cursor-pointer'}
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
    const gridSize = Math.ceil(Math.sqrt(settings.gridSize));
    
    return (
      <div 
        className="grid gap-4 mb-6 mx-auto"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          maxWidth: `${gridSize * 140}px`
        }}
      >
        {gameState.cellTypes.map((type, index) => {
          const isPlayerChoice = gameState.playerChoice === index;
          const isComputerChoice = gameState.computerChoice === index;
          const bothChoseSame = isPlayerChoice && isComputerChoice;
          
          return (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              disabled={gameState.playerChoice !== undefined}
              className={`
                relative w-28 h-28 rounded-lg flex items-center justify-center text-2xl font-bold
                transition-all duration-300 transform hover:scale-105
                ${getCellTypeColor(type)}
                ${bothChoseSame ? 'ring-4 ring-purple-500' : 
                  isPlayerChoice ? 'ring-4 ring-blue-500' : 
                  isComputerChoice ? 'ring-4 ring-red-500' : ''}
                ${gameState.playerChoice !== undefined ? 'cursor-default' : 'cursor-pointer'}
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
        {settings.role === 'hider' ? 'Choose a place to hide' : 'Choose a place to search'}
      </h2>
      
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {['easy', 'neutral', 'hard'].map((type) => (
          <div key={type} className="flex items-center">
            <div 
              className={`w-4 h-4 rounded-full mr-1 ${getCellTypeColor(type as any)}`}
            ></div>
            <span className="text-sm text-slate-700 mr-3">
              {getCellTypeDescription(type as any)}
            </span>
          </div>
        ))}
      </div>
      
      {settings.gridType === '2d-approximation' ? renderGrid2D() : renderLinearGrid()}
      
      {gameState.lastRoundWinner && (
        <div className="text-center mt-4">
          <div 
            className={`text-lg font-semibold mb-2 ${
              gameState.lastRoundWinner === 'player' 
                ? 'text-green-600' 
                : gameState.lastRoundWinner === 'computer' 
                  ? 'text-red-600' 
                  : 'text-slate-600'
            }`}
          >
            {gameState.lastRoundWinner === 'player' 
              ? 'You won this round!' 
              : gameState.lastRoundWinner === 'computer' 
                ? 'Computer won this round!' 
                : 'This round was a tie!'}
          </div>
          <button
            onClick={() => makeMove(-1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Next Round
          </button>
        </div>
      )}
    </div>
  );
};

export default GameBoard;