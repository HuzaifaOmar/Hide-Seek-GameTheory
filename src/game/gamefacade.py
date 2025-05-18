from enum import Enum
import random
from src.game.gamelogic.gamegrid.gamegrid_factory import create_game_grid
from src.linearprogramming.lp_gamesolver import solve_payoff_matrix


class PlayerRole(Enum):
    HIDER = "hider"
    SEEKER = "seeker"

class GameFacade:
    def __init__(self, grid_size=4, grid_type="linear", use_proximity=False):
        self.grid_size = grid_size
        self.grid_type = grid_type
        self.use_proximity = use_proximity

        self.game_grid = create_game_grid(grid_size, grid_type, use_proximity)
        self.payoff_matrix = self.game_grid.get_payoff_matrix()

        self.human_role = None
        self.computer_role = None
        self.human_score = 0
        self.computer_score = 0
        self.round_number = 0
        self.human_wins = 0
        self.computer_wins = 0
        self.computer_strategy = None
        self.is_game_running = False

    def start_new_game(self, human_role):
        self.is_game_running = True
        self.human_role = human_role
        self.computer_role = (PlayerRole.SEEKER if human_role == PlayerRole.HIDER else PlayerRole.HIDER)
        self.round_number = 0
        self.human_score = 0
        self.computer_score = 0
        self.human_wins = 0
        self.computer_wins = 0

        self._calculate_computer_strategy()
        return {
            "human_role": self.human_role,
            "computer_role": self.computer_role,
            "payoff_matrix": self.payoff_matrix,
            "computer_strategy": self.computer_strategy
        }

    def _calculate_computer_strategy(self):
        probabilities, expected_value = solve_payoff_matrix(self.payoff_matrix, player=self.computer_role.name)
        self.computer_strategy = {
            "probabilities": probabilities,
            "expected_value": expected_value
        }

    def get_computer_move(self):
        positions = list(range(self.grid_size))
        position = random.choices(
            positions,
            weights=self.computer_strategy["probabilities"],
        )[0]

        return position

    def play_round(self, human_position):
        if not self.is_game_running:
            raise ValueError("Game is not running. Call start_new_game() first.")

        if not (0 <= human_position < self.grid_size):
            raise ValueError(f"Invalid position: {human_position} is out of range [0, {self.grid_size - 1}]")

        computer_position = self.get_computer_move()

        hider_position = (human_position if self.human_role == PlayerRole.HIDER else computer_position)
        seeker_position = (computer_position if self.human_role == PlayerRole.HIDER else human_position)

        round_result = self._evaluate_round(hider_position, seeker_position)

        self.round_number += 1
        return {
            "human_position": human_position,
            "computer_position": computer_position,
            "hider_position": hider_position,
            "seeker_position": seeker_position,
            "human_score": self.human_score,
            "computer_score": self.computer_score,
            "human_wins": self.human_wins,
            "computer_wins": self.computer_wins,
            "winner": round_result["winner"],
            "round_number": self.round_number
        }

    def _evaluate_round(self, hider_positon, seeker_position):
        score = self.game_grid.get_place_score(seeker_position, "seeker")
        winner = ("seeker" if hider_positon == seeker_position else "hider")

        # Human wins
        if (winner == "hider" and self.human_role == PlayerRole.HIDER) or (winner == "seeker" and self.human_role == PlayerRole.SEEKER):
            self.human_score += score
            self.human_wins += 1
            self.computer_score -= score
            human_score_change = score
            computer_score_change = -score
        else:
            self.computer_score += score
            self.computer_wins += 1
            self.human_score -= score
            human_score_change = -score
            computer_score_change = score

        return {
            "winner": winner,
            "human_score_change": human_score_change,
            "computer_score_change": computer_score_change
        }

    def reset_game(self):
        self.game_grid = create_game_grid(self.grid_size, self.grid_type, self.use_proximity)
        self.payoff_matrix = self.game_grid.get_payoff_matrix()

        self.human_role = None
        self.computer_role = None
        self.human_score = 0
        self.computer_score = 0
        self.round_number = 0
        self.human_wins = 0
        self.computer_wins = 0
        self.computer_strategy = None
        self.is_game_running = False

        return {
            "payoff_matrix": self.payoff_matrix
        }

    def get_game_state(self):
        return {
            "is_game_running": self.is_game_running,
            "human_role": self.human_role,
            "computer_role": self.computer_role,
            "human_score": self.human_score,
            "computer_score": self.computer_score,
            "round_number": self.round_number,
            "human_wins": self.human_wins,
            "computer_wins": self.computer_wins,
            "payoff_matrix": self.payoff_matrix,
            "grid_size": self.grid_size,
            "grid_type": self.grid_type,
            "use_proximity": self.use_proximity,
            "place_types": [self.game_grid.get_place_type(i).name for i in range(self.grid_size)],
        }