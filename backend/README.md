# Hide & Seek Game Backend

This is the backend for the Hide & Seek game theory implementation.

## Setup

1. Create a virtual environment:
   ```
   python -m venv .venv
   ```

2. Activate the virtual environment:
   ```
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the server:
   ```
   python app.py
   ```

The server will start at http://localhost:5000.

## API Documentation

### Health Check

- **URL**: `/api/health`
- **Method**: `GET`
- **Response**: 
  ```json
  {
    "status": "success",
    "message": "Hide & Seek Game API is running"
  }
  ```

### Initialize Game

- **URL**: `/api/game/initialize`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "grid_size": 4,
    "grid_type": "linear",
    "use_proximity": false
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "payoff_matrix": [[...], [...], ...],
    "grid_size": 4,
    "grid_type": "linear",
    "use_proximity": false,
    "place_types": ["EASY", "HARD", "NEUTRAL", "EASY"]
  }
  ```

### Start Game

- **URL**: `/api/game/start-game`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "human_role": "hider"  // or "seeker"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "human_role": "hider",
    "computer_role": "seeker",
    "payoff_matrix": [[...], [...], ...],
    "computer_strategy": {
      "probabilities": [0.2, 0.3, 0.1, 0.4],
      "expected_value": 0.75
    }
  }
  ```

### Play Round

- **URL**: `/api/game/play-round`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "human_position": 2
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "human_position": 2,
    "computer_position": 1,
    "hider_position": 2,
    "seeker_position": 1,
    "human_score": 1,
    "computer_score": -1,
    "human_wins": 1,
    "computer_wins": 0,
    "winner": "hider",
    "round_number": 1
  }
  ```

### Reset Game

- **URL**: `/api/game/reset-game`
- **Method**: `POST`
- **Response**:
  ```json
  {
    "status": "success",
    "payoff_matrix": [[...], [...], ...]
  }
  ```

### Get Game State

- **URL**: `/api/game/game-state`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "status": "success",
    "game_state": {
      "is_game_running": true,
      "human_role": "hider",
      "computer_role": "seeker",
      "human_score": 2,
      "computer_score": -2,
      "round_number": 2,
      "human_wins": 2,
      "computer_wins": 0,
      "payoff_matrix": [[...], [...], ...],
      "grid_size": 4,
      "grid_type": "linear",
      "use_proximity": false,
      "place_types": ["EASY", "HARD", "NEUTRAL", "EASY"]
    }
  }
  ```

### Run Simulation

- **URL**: `/api/game/run-simulation`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "grid_size": 4,
    "grid_type": "linear",
    "use_proximity": false,
    "num_rounds": 100
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "simulation_rounds": 100,
    "human_score": 25,
    "computer_score": -25,
    "human_wins": 65,
    "computer_wins": 35,
    "game_state": {
      "is_game_running": true,
      "human_role": "seeker",
      "computer_role": "hider",
      "human_score": 25,
      "computer_score": -25,
      "round_number": 100,
      "human_wins": 65,
      "computer_wins": 35,
      "payoff_matrix": [[...], [...], ...],
      "grid_size": 4,
      "grid_type": "linear",
      "use_proximity": false,
      "place_types": ["EASY", "HARD", "NEUTRAL", "EASY"]
    }
  }
  ```

### Get Available Grid Types

- **URL**: `/api/game/available-grid-types`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "status": "success",
    "grid_types": [
      {
        "id": "linear",
        "name": "Linear Grid",
        "proximity_enabled": false
      },
      {
        "id": "linear", 
        "name": "Linear Grid with Proximity",
        "proximity_enabled": true
      },
      {
        "id": "2d",
        "name": "2D Grid",
        "proximity_enabled": true
      }
    ]
  }
  ``` 