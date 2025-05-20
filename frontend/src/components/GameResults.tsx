import React from "react";
import { useGame } from "../contexts/GameContext";
import { Award, RotateCcw } from "lucide-react";

const GameResults: React.FC = () => {
  const { gameState, resetGame, loading } = useGame();

  if (gameState.round === 0) {
    return null;
  }

  const humanWinPercentage =
    gameState.round > 0
      ? Math.round((gameState.humanWins / gameState.round) * 100)
      : 0;

  const computerWinPercentage =
    gameState.round > 0
      ? Math.round((gameState.computerWins / gameState.round) * 100)
      : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Game Results</h2>
        <button
          onClick={resetGame}
          disabled={loading}
          className="flex items-center text-sm text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset Game
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-blue-600 mb-1">You</h3>
          <div className="text-3xl font-bold text-slate-800">
            {gameState.humanScore}
          </div>
          <div className="text-sm text-slate-500">Total Score</div>
          <div className="mt-2 text-lg font-semibold">
            {gameState.humanWins}{" "}
            <span className="text-sm font-normal text-slate-500">wins</span>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-lg font-medium text-red-600 mb-1">Computer</h3>
          <div className="text-3xl font-bold text-slate-800">
            {gameState.computerScore}
          </div>
          <div className="text-sm text-slate-500">Total Score</div>
          <div className="mt-2 text-lg font-semibold">
            {gameState.computerWins}{" "}
            <span className="text-sm font-normal text-slate-500">wins</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-slate-600 mb-1">
          <span>Win Rate</span>
          <span>Round {gameState.round}</span>
        </div>
        <div className="w-full h-6 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 flex items-center justify-start pl-2 text-xs text-white font-medium"
            style={{ width: `${humanWinPercentage}%` }}
          >
            {humanWinPercentage > 15 ? `${humanWinPercentage}%` : ""}
          </div>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-blue-600">You: {humanWinPercentage}%</span>
          <span className="text-red-600">
            Computer: {computerWinPercentage}%
          </span>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        {gameState.humanScore > gameState.computerScore ? (
          <div className="flex items-center text-green-600 font-medium">
            <Award className="w-5 h-5 mr-2" />
            You're winning!
          </div>
        ) : gameState.humanScore < gameState.computerScore ? (
          <div className="flex items-center text-red-600 font-medium">
            <Award className="w-5 h-5 mr-2" />
            Computer is ahead!
          </div>
        ) : (
          <div className="flex items-center text-amber-600 font-medium">
            <Award className="w-5 h-5 mr-2" />
            It's a tie!
          </div>
        )}
      </div>
    </div>
  );
};

export default GameResults;
