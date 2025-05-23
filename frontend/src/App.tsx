import React from "react";
import { GameProvider, useGame } from "./contexts/GameContext";
import GameModeSelector from "./components/GameModeSelector";
import GameSetup from "./components/GameSetup";
import SimulationControls from "./components/SimulationControls";
import GameBoard from "./components/GameBoard";
import GameResults from "./components/GameResults";
import GameMatrix from "./components/GameMatrix";
import { Shield } from "lucide-react";

function GameContent() {
  const { settings } = useGame();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm py-4 px-6 mb-6">
        <div className="container mx-auto flex items-center justify-center">
          <Shield className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-slate-800">
            Hide & Seek Game
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-12">
        <div className="flex flex-col items-center">
          <GameModeSelector />
          <GameSetup />
          <SimulationControls />
          <GameBoard />
          <div className="w-full max-w-3xl mt-4 space-y-6">
            {settings.mode === "simulation" && <GameMatrix />}
            <GameResults />
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

export default App;
