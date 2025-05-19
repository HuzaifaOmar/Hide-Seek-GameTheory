import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CellType, GameContextType, GameSettings, GameState, PlayerRole } from '../types/game';
import { generateGameMatrix, generateCellTypes } from '../utils/gameUtils';

const defaultSettings: GameSettings = {
  mode: 'interactive',
  role: 'hider',
  gridType: 'linear',
  gridSize: 5,
  simulationRounds: 100,
};

const defaultGameState: GameState = {
  round: 0,
  playerScore: 0,
  computerScore: 0,
  playerWins: 0,
  computerWins: 0,
  gameMatrix: [],
  cellTypes: [],
  probabilities: [],
  isGameOver: false,
  playerChoice: undefined,
  computerChoice: undefined,
  lastRoundWinner: undefined,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);
  const [gameState, setGameState] = useState<GameState>(defaultGameState);

  useEffect(() => {
    if (settings.gridSize > 0) {
      const matrix = generateGameMatrix(settings.gridSize, settings.gridType);
      const cellTypes = generateCellTypes(settings.gridSize);
      
      setGameState(prevState => ({
        ...prevState,
        gameMatrix: matrix,
        cellTypes: cellTypes,
        probabilities: Array(settings.gridSize).fill(1 / settings.gridSize),
      }));
    }
  }, [settings.gridSize, settings.gridType]);

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    if (newSettings.gridSize || newSettings.gridType || newSettings.role) {
      resetGame();
    }
  };

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      round: 1,
      playerScore: 0,
      computerScore: 0,
      playerWins: 0,
      computerWins: 0,
      isGameOver: false,
      playerChoice: undefined,
      computerChoice: undefined,
      lastRoundWinner: undefined,
    }));
  };

  const resetGame = () => {
    const matrix = generateGameMatrix(settings.gridSize, settings.gridType);
    const cellTypes = generateCellTypes(settings.gridSize);

    setGameState({
      ...defaultGameState,
      gameMatrix: matrix,
      cellTypes: cellTypes,
      probabilities: Array(settings.gridSize).fill(1 / settings.gridSize),
    });
  };

  const startNextRound = () => {
    setGameState(prev => ({
      ...prev,
      round: prev.round + 1,
      playerChoice: undefined,
      computerChoice: undefined,
      lastRoundWinner: undefined,
    }));
  };

  const determineWinner = (playerPos: number, computerPos: number, playerRole: PlayerRole): { 
    winner: 'player' | 'computer' | 'none', 
    playerScoreChange: number, 
    computerScoreChange: number 
  } => {
    const seekerWins = playerPos === computerPos;
    
    let playerScoreChange = 0;
    let computerScoreChange = 0;
    let winner: 'player' | 'computer' | 'none' = 'none';
    
    if (playerRole === 'hider') {
      if (seekerWins) {
        winner = 'computer';
        playerScoreChange = -Math.abs(gameState.gameMatrix[playerPos][computerPos]);
        computerScoreChange = Math.abs(gameState.gameMatrix[playerPos][computerPos]);
      } else {
        winner = 'player';
        playerScoreChange = 2;
        computerScoreChange = -1;
        
        if (settings.gridType.includes('approximation')) {
          const distance = Math.abs(playerPos - computerPos);
          if (distance === 1) {
            playerScoreChange *= 0.5;
          } else if (distance === 2) {
            playerScoreChange *= 0.75;
          }
        }
      }
    } else {
      if (seekerWins) {
        winner = 'player';
        playerScoreChange = Math.abs(gameState.gameMatrix[computerPos][playerPos]);
        computerScoreChange = -Math.abs(gameState.gameMatrix[computerPos][playerPos]);
      } else {
        winner = 'computer';
        playerScoreChange = -1;
        computerScoreChange = 2;
        
        if (settings.gridType.includes('approximation')) {
          const distance = Math.abs(playerPos - computerPos);
          if (distance === 1) {
            computerScoreChange *= 0.5;
          } else if (distance === 2) {
            computerScoreChange *= 0.75;
          }
        }
      }
    }
    
    return { winner, playerScoreChange, computerScoreChange };
  };

  const makeMove = (position: number) => {
    if (gameState.isGameOver || settings.mode !== 'interactive') return;

    if (position === -1) {
      startNextRound();
      return;
    }

    const computerPosition = Math.floor(Math.random() * settings.gridSize);

    const { winner, playerScoreChange, computerScoreChange } = 
      determineWinner(position, computerPosition, settings.role);

    setGameState(prev => ({
      ...prev,
      playerScore: prev.playerScore + playerScoreChange,
      computerScore: prev.computerScore + computerScoreChange,
      playerWins: prev.playerWins + (winner === 'player' ? 1 : 0),
      computerWins: prev.computerWins + (winner === 'computer' ? 1 : 0),
      playerChoice: position,
      computerChoice: computerPosition,
      lastRoundWinner: winner,
    }));
  };

  const runSimulation = (rounds: number) => {
    let newPlayerScore = gameState.playerScore;
    let newComputerScore = gameState.computerScore;
    let newPlayerWins = gameState.playerWins;
    let newComputerWins = gameState.computerWins;
    
    for (let i = 0; i < rounds; i++) {
      const playerPosition = Math.floor(Math.random() * settings.gridSize);
      const computerPosition = Math.floor(Math.random() * settings.gridSize);
      
      const { winner, playerScoreChange, computerScoreChange } = 
        determineWinner(playerPosition, computerPosition, 'hider');
      
      newPlayerScore += playerScoreChange;
      newComputerScore += computerScoreChange;
      
      if (winner === 'player') newPlayerWins++;
      if (winner === 'computer') newComputerWins++;
    }
    
    setGameState(prev => ({
      ...prev,
      round: prev.round + rounds,
      playerScore: newPlayerScore,
      computerScore: newComputerScore,
      playerWins: newPlayerWins,
      computerWins: newComputerWins,
      isGameOver: true,
    }));
  };

  return (
    <GameContext.Provider
      value={{
        settings,
        gameState,
        updateSettings,
        startGame,
        resetGame,
        makeMove,
        runSimulation,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}