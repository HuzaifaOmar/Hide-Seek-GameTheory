import React from "react";
import { GameMode } from "../types/game";
import { useGame } from "../contexts/GameContext";
import { LayoutGrid, Play } from "lucide-react";

const GameModeSelector: React.FC = () => {
  const { settings, updateSettings, loading } = useGame();

  const handleModeChange = (mode: GameMode) => {
    updateSettings({ mode });
  };

  return (
    <div className="flex flex-col items-center mb-6 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4 text-slate-800">
        Select Game Mode
      </h2>

      <div className="grid grid-cols-2 gap-4 w-full">
        <button
          className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all duration-300 hover:shadow-md ${
            settings.mode === "interactive"
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-slate-300 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50"
          }`}
          onClick={() => handleModeChange("interactive")}
          disabled={loading}
        >
          <Play className="w-8 h-8 mb-2" />
          <span className="font-medium">Interactive</span>
          <p className="text-xs mt-2 text-center">Play against the computer</p>
        </button>

        <button
          className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all duration-300 hover:shadow-md ${
            settings.mode === "simulation"
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-slate-300 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50"
          }`}
          onClick={() => handleModeChange("simulation")}
          disabled={loading}
        >
          <LayoutGrid className="w-8 h-8 mb-2" />
          <span className="font-medium">Simulation</span>
          <p className="text-xs mt-2 text-center">Run automated simulations</p>
        </button>
      </div>
    </div>
  );
};

export default GameModeSelector;
