import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/game";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Game API functions
export const initializeGame = async (
  gridSize: number,
  gridType: string
) => {
  const response = await api.post("/initialize", {
    grid_size: gridSize,
    grid_type: gridType,
  });
  return response.data;
};

export const startGame = async (humanRole: string) => {
  const response = await api.post("/start-game", {
    human_role: humanRole,
  });
  return response.data;
};

export const playRound = async (humanPosition: number) => {
  const response = await api.post("/play-round", {
    human_position: humanPosition,
  });
  return response.data;
};

export const resetGame = async () => {
  const response = await api.post("/reset-game", {});
  return response.data;
};

export const getGameState = async () => {
  const response = await api.get("/get-game-state");
  return response.data;
};

export const runSimulation = async (
  gridSize: number,
  gridType: string,
  useProximity: boolean,
  numRounds: number
) => {
  const response = await api.post("/run-simulation", {
    grid_size: gridSize,
    grid_type: gridType,
    use_proximity: useProximity,
    num_rounds: numRounds,
  });
  return response.data;
};
