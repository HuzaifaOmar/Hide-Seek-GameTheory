import React, { useState } from "react";
import { useGame } from "../contexts/GameContext";
import { Play, Loader } from "lucide-react";
import { GridType } from "../types/game";

const SimulationControls: React.FC = () => {
  const { settings, updateSettings, runSimulation, loading } = useGame();
  const [rounds, setRounds] = useState(settings.simulationRounds || 100);

  const handleRoundsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0 && value <= 1000) {
      setRounds(value);
      updateSettings({ simulationRounds: value });
    }
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

  const handleRunSimulation = async () => {
    await runSimulation();
  };

  if (settings.mode !== "simulation") {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4 text-slate-800">
        Simulation Settings
      </h2>

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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
          >
            2D with Approximation
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Grid Size: {settings.gridSize}
        </label>
        <input
          type="number"
          min="2"
          max="100"
          value={settings.gridSize}
          onChange={handleGridSizeChange}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Number of Rounds: {rounds}
        </label>
        <input
          type="number"
          min="10"
          max="1000"
          value={rounds}
          onChange={handleRoundsChange}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
      </div>

      <button
        className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md font-medium flex items-center justify-center transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        onClick={handleRunSimulation}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader className="w-5 h-5 mr-2 animate-spin" />
            Running Simulation...
          </>
        ) : (
          <>
            <Play className="w-5 h-5 mr-2" />
            Run Simulation
          </>
        )}
      </button>
    </div>
  );
};

export default SimulationControls;
