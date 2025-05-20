export type GridType = 'linear' | 'linear-approximation' | '2d';
export type PlayerRole = 'hider' | 'seeker';
export type GameMode = 'simulation' | 'interactive';
export type CellType = 'easy' | 'neutral' | 'hard';

export interface GameSettings {
  mode: GameMode;
  humanRole: PlayerRole;
  gridType: string;
  gridSize: number;
  simulationRounds: number;
}

export interface GameState {
  round: number;
  humanScore: number;
  computerScore: number;
  humanWins: number;
  computerWins: number;
  payoffMatrix: number[][];
  placeTypes: string[];
  humanRole?: PlayerRole;
  computerRole?: PlayerRole;
  humanPosition?: number;
  computerPosition?: number;
  hiderPosition?: number;
  seekerPosition?: number;
  winner?: string;
  isGameRunning: boolean;
  computerStrategy?: {
    probabilities: number[];
  };
}
// API Response Types
export interface InitializeResponse {
  status: string;
  payoff_matrix: number[][];
  grid_size: number;
  grid_type: string;
  use_proximity: boolean;
  place_types: string[];
}

export interface StartGameResponse {
  status: string;
  human_role: string;
  computer_role: string;
  payoff_matrix: number[][];
  computer_strategy: {
    probabilities: number[];
  };
}

export interface PlayRoundResponse {
  status: string;
  human_position: number;
  computer_position: number;
  hider_position: number;
  seeker_position: number;
  human_score: number;
  computer_score: number;
  human_wins: number;
  computer_wins: number;
  winner: string;
  round_number: number;
}

export interface ResetGameResponse {
  status: string;
  payoff_matrix: number[][];
}

export interface GameStateResponse {
  game_state: {
    is_game_running: boolean;
    round: number;
    human_role: string;
    computer_role: string;
    human_score: number;
    computer_score: number;
    human_wins: number;
    computer_wins: number;
    payoff_matrix: number[][];
    human_position?: number;
    computer_position?: number;
    winner?: string;
  };
}

export interface SimulationResponse {
  status: string;
  simulation_rounds: number;
  human_score: number;
  computer_score: number;
  human_wins: number;
  computer_wins: number;
  game_state: {
    is_game_running: boolean;
    round: number;
    human_role: string;
    computer_role: string;
    human_score: number;
    computer_score: number;
    human_wins: number;
    computer_wins: number;
    payoff_matrix: number[][];
  };
}