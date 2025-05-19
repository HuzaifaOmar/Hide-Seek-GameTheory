export type GridType = 'linear' | 'linear-approximation' | '2d-approximation';
export type PlayerRole = 'hider' | 'seeker';
export type GameMode = 'simulation' | 'interactive';
export type CellType = 'easy' | 'neutral' | 'hard';

export interface GameSettings {
  mode: GameMode;
  role: PlayerRole;
  gridType: GridType;
  gridSize: number;
  simulationRounds?: number;
}

export interface GameState {
  round: number;
  playerScore: number;
  computerScore: number;
  playerWins: number;
  computerWins: number;
  gameMatrix: number[][];
  cellTypes: CellType[];
  probabilities: number[];
  isGameOver: boolean;
  playerChoice?: number;
  computerChoice?: number;
  lastRoundWinner?: 'player' | 'computer' | 'none';
}

export interface GameContextType {
  settings: GameSettings;
  gameState: GameState;
  updateSettings: (settings: Partial<GameSettings>) => void;
  startGame: () => void;
  resetGame: () => void;
  makeMove: (position: number) => void;
  runSimulation: (rounds: number) => void;
}