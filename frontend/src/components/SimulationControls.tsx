import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { Play, BarChart, Loader } from 'lucide-react';

const SimulationControls: React.FC = () => {
  const { settings, updateSettings, runSimulation } = useGame();
  const [rounds, setRounds] = useState(settings.simulationRounds || 100);
  const [isRunning, setIsRunning] = useState(false);

  const handleRoundsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0 && value <= 1000) {
      setRounds(value);
      updateSettings({ simulationRounds: value });
    }
  };

  const handleRunSimulation = () => {
    setIsRunning(true);
    // Simulate processing time for better UX
    setTimeout(() => {
      runSimulation(rounds);
      setIsRunning(false);
    }, 1500);
  };

  if (settings.mode !== 'simulation') {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4 text-slate-800">Simulation Settings</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">Grid Type</label>
        <select
          className="w-full py-2 px-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={settings.gridType}
          onChange={(e) => updateSettings({ gridType: e.target.value as any })}
        >
          <option value="linear">Linear</option>
          <option value="linear-approximation">Linear with Approximation</option>
          <option value="2d">2D with Approximation</option>
        </select>
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
          onChange={(e) => updateSettings({ gridSize: parseInt(e.target.value, 10) })}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        />
      </div>

      <button
        className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md font-medium flex items-center justify-center transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        onClick={handleRunSimulation}
        disabled={isRunning}
      >
        {isRunning ? (
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