import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { GridType, PlayerRole } from '../types/game';
import { Play, Rotate3D as Rotate, Loader } from 'lucide-react';

const GameSetup: React.FC = () => {
  const { settings, updateSettings, startGame } = useGame();
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = (role: PlayerRole) => {
    updateSettings({ role });
  };

  const handleGridTypeChange = (gridType: GridType) => {
    updateSettings({ gridType });
  };

  const handleGridSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value, 10);
    if (!isNaN(size) && size >= 2 && size <= 10) {
      updateSettings({ gridSize: size });
    }
  };

  const handleStartGame = () => {
    setIsLoading(true);
    setTimeout(() => {
      startGame();
      setIsLoading(false);
    }, 800);
  };

  if (settings.mode !== 'interactive') {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4 text-slate-800">Game Setup</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">Your Role</label>
        <div className="flex space-x-2">
          <button
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              settings.role === 'hider'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            onClick={() => handleRoleChange('hider')}
          >
            Hider
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              settings.role === 'seeker'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            onClick={() => handleRoleChange('seeker')}
          >
            Seeker
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">Grid Type</label>
        <div className="flex flex-col space-y-2">
          <button
            className={`py-2 px-4 rounded-md transition-colors text-left ${
              settings.gridType === 'linear'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            onClick={() => handleGridTypeChange('linear')}
          >
            Linear
          </button>
          <button
            className={`py-2 px-4 rounded-md transition-colors text-left ${
              settings.gridType === 'linear-approximation'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            onClick={() => handleGridTypeChange('linear-approximation')}
          >
            Linear with Approximation
          </button>
          <button
            className={`py-2 px-4 rounded-md transition-colors text-left ${
              settings.gridType === '2d-approximation'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            onClick={() => handleGridTypeChange('2d-approximation')}
          >
            2D with Approximation
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Grid Size (2-10)
        </label>
        <input
          type="number"
          min="2"
          max="10"
          value={settings.gridSize}
          onChange={handleGridSizeChange}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <button
        className="w-full py-3 px-4 bg-green-600 text-white rounded-md font-medium flex items-center justify-center transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        onClick={handleStartGame}
        disabled={isLoading}
      >
        {isLoading ? (
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