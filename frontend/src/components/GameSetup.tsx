import React, { useState } from "react";
import { useGame } from "../contexts/GameContext";
import { GridType, PlayerRole } from "../types/game";
import { Play, Loader } from "lucide-react";

const GameSetup: React.FC = () => {
  const { settings, updateSettings, startGame, loading } = useGame();
  const [localLoading, setLocalLoading] = useState(false);

  const handleRoleChange = (humanRole: PlayerRole) => {
    updateSettings({ humanRole });
  };

  const handleGridTypeChange = (gridType: GridType) => {
    if (gridType === "2d") {
      // When switching to 2D, ensure grid size is square and at least 9
      const squareSize = Math.max(Math.ceil(Math.sqrt(settings.gridSize)), 3);
      const perfectSquare = squareSize * squareSize;
      updateSettings({
        gridType,
        gridSize: perfectSquare,
      });
    } else {
      updateSettings({ gridType });
    }
  };

  const handleGridSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputSize = parseInt(e.target.value, 10);
    if (!isNaN(inputSize) && inputSize >= 2 && inputSize <= 100) {
      // For 2D grid, ensure it's a perfect square or at least 9
      if (settings.gridType === "2d") {
        const squareSize = Math.max(Math.ceil(Math.sqrt(inputSize)), 3);
        const perfectSquare = squareSize * squareSize;
        updateSettings({ gridSize: perfectSquare });
      } else {
        updateSettings({ gridSize: inputSize });
      }
    }
  };
  const handleStartGame = async () => {
    setLocalLoading(true);
    await startGame();
    setLocalLoading(false);
  };

  if (settings.mode !== "interactive") {
    return null;
  }

  const isButtonDisabled = loading || localLoading;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4 text-slate-800">Game Setup</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Your Role
        </label>
        <div className="flex space-x-2">
          <button
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              settings.humanRole === "hider"
                ? "bg-blue-500 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
            onClick={() => handleRoleChange("hider")}
            disabled={isButtonDisabled}
          >
            Hider
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              settings.humanRole === "seeker"
                ? "bg-blue-500 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
            onClick={() => handleRoleChange("seeker")}
            disabled={isButtonDisabled}
          >
            Seeker
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Grid Type
        </label>
        <div className="flex flex-col space-y-2">
          <button
            className={`py-2 px-4 rounded-md transition-colors text-left ${
              settings.gridType === "linear"
                ? "bg-blue-500 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
            onClick={() => handleGridTypeChange("linear")}
            disabled={isButtonDisabled}
          >
            Linear
          </button>
          <button
            className={`py-2 px-4 rounded-md transition-colors text-left ${
              settings.gridType === "linear-approximation"
                ? "bg-blue-500 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
            onClick={() => handleGridTypeChange("linear-approximation")}
            disabled={isButtonDisabled}
          >
            Linear with Approximation
          </button>
          <button
            className={`py-2 px-4 rounded-md transition-colors text-left ${
              settings.gridType === "2d"
                ? "bg-blue-500 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
            onClick={() => handleGridTypeChange("2d")}
            disabled={isButtonDisabled}
          >
            2D with Approximation
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Grid Size (2-100)
        </label>
        <input
          type="number"
          min="2"
          max="100"
          value={settings.gridSize}
          onChange={handleGridSizeChange}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        className="w-full py-3 px-4 bg-green-600 text-white rounded-md font-medium flex items-center justify-center transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        onClick={handleStartGame}
        disabled={isButtonDisabled}
      >
        {isButtonDisabled ? (
          <>
            <Loader className="w-5 h-5 mr-2 animate-spin" />
            Preparing Game...
          </>
        ) : (
          <>
            <Play className="w-5 h-5 mr-2" />
            Start Game
          </>
        )}
      </button>
    </div>
  );
};

export default GameSetup;
