import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  GameSettings,
  GameState,
  PlayerRole,
  InitializeResponse,
  StartGameResponse,
  PlayRoundResponse,
  GameStateResponse,
} from "../types/game";
import * as gameApi from "../services/api";

const defaultSettings: GameSettings = {
  mode: "interactive",
  humanRole: "hider",
  gridType: "linear",
  gridSize: 5,
  useProximity: false,
  simulationRounds: 100,
};

const defaultGameState: GameState = {
  round: 0,
  humanScore: 0,
  computerScore: 0,
  humanWins: 0,
  computerWins: 0,
  payoffMatrix: [],
  placeTypes: [],
  isGameRunning: false,
};

interface GameContextType {
  settings: GameSettings;
  gameState: GameState;
  loading: boolean;
  error: string | null;
  updateSettings: (settings: Partial<GameSettings>) => void;
  initializeGame: () => Promise<void>;
  startGame: () => Promise<void>;
  resetGame: () => Promise<void>;
  makeMove: (position: number) => Promise<void>;
  runSimulation: () => Promise<void>;
  nextRound: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}

interface GameProviderProps {
  children: ReactNode;
}

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);
  const [gameState, setGameState] = useState<GameState>(defaultGameState);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiError = (error: any) => {
    console.error("API Error:", error);
    setError(error.response?.data?.message || "An error occurred");
    setLoading(false);
  };

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const initializeGame = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: InitializeResponse = await gameApi.initializeGame(
        settings.gridSize,
        settings.gridType,
        settings.useProximity
      );

      if (response.status === "success") {
        setGameState((prev) => ({
          ...prev,
          payoffMatrix: response.payoff_matrix,
          placeTypes: response.place_types,
          round: 0,
          isGameRunning: false,
        }));
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const startGame = async () => {
    initializeGame();
    setLoading(true);
    setError(null);
    try {
      const response: StartGameResponse = await gameApi.startGame(
        settings.humanRole
      );

      if (response.status === "success") {
        setGameState((prev) => ({
          ...prev,
          humanRole: response.human_role as PlayerRole,
          computerRole: response.computer_role as PlayerRole,
          payoffMatrix: response.payoff_matrix,
          computerStrategy: response.computer_strategy,
          round: 1,
          humanScore: 0,
          computerScore: 0,
          humanWins: 0,
          computerWins: 0,
          humanPosition: undefined,
          computerPosition: undefined,
          isGameRunning: true,
          winner: undefined,
        }));
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const resetGame = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await gameApi.resetGame();

      if (response.status === "success") {
        setGameState((prev) => ({
          ...prev,
          payoffMatrix: response.payoff_matrix,
          round: 0,
          humanScore: 0,
          computerScore: 0,
          humanWins: 0,
          computerWins: 0,
          humanPosition: undefined,
          computerPosition: undefined,
          isGameRunning: false,
          winner: undefined,
        }));
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const makeMove = async (position: number) => {
    if (!gameState.isGameRunning || settings.mode !== "interactive") return;

    setLoading(true);
    setError(null);
    try {
      const response: PlayRoundResponse = await gameApi.playRound(position);

      console.log("makeMove response", response);
      console.log("payoff matrix", gameState.payoffMatrix);

      if (response.status === "success") {
        setGameState((prev) => ({
          ...prev,
          round: response.round_number,
          humanPosition: response.human_position,
          computerPosition: response.computer_position,
          humanScore: response.human_score,
          computerScore: response.computer_score,
          humanWins: response.human_wins,
          computerWins: response.computer_wins,
          winner: response.winner,
          hiderPosition: response.hider_position,
          seekerPosition: response.seeker_position,
        }));
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await gameApi.runSimulation(
        settings.gridSize,
        settings.gridType,
        settings.useProximity,
        settings.simulationRounds
      );

      if (response.status === "success") {
        setGameState((prev) => ({
          ...prev,
          round: response.simulation_rounds,
          humanScore: response.human_score,
          computerScore: response.computer_score,
          humanWins: response.human_wins,
          computerWins: response.computer_wins,
          payoffMatrix: response.game_state.payoff_matrix,
          isGameRunning: false,
        }));
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGameState = async () => {
    try {
      const response: GameStateResponse = await gameApi.getGameState();
      const state = response.game_state;

      setGameState({
        round: state.round,
        humanScore: state.human_score,
        computerScore: state.computer_score,
        humanWins: state.human_wins,
        computerWins: state.computer_wins,
        payoffMatrix: state.payoff_matrix,
        humanRole: state.human_role as PlayerRole,
        computerRole: state.computer_role as PlayerRole,
        humanPosition: state.human_position,
        computerPosition: state.computer_position,
        winner: state.winner,
        isGameRunning: state.is_game_running,
        placeTypes: [], // Will be populated by initialize
      });
    } catch (error) {
      console.error("Failed to fetch game state:", error);
    }
  };

  const nextRound = () => {
    setGameState((prev) => ({
      ...prev,
      humanPosition: undefined,
      computerPosition: undefined,
      winner: undefined,
    }));
  };

  useEffect(() => {
    // When component mounts, initialize the game
    initializeGame();

    // Optional: Poll for game state updates
    // const intervalId = setInterval(fetchGameState, 5000);
    // return () => clearInterval(intervalId);
  }, []);

  return (
    <GameContext.Provider
      value={{
        settings,
        gameState,
        loading,
        error,
        updateSettings,
        initializeGame,
        startGame,
        resetGame,
        makeMove,
        runSimulation,
        nextRound,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
