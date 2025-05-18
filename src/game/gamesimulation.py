import random

from src.game.gamefacade import GameFacade, PlayerRole
from src.linearprogramming.lp_gamesolver import solve_payoff_matrix


class GameSimulation:
    def __init__(self, grid_size=4, grid_type="linear", use_proximity=False):
        self.grid_size = grid_size
        self.grid_type = grid_type
        self.use_proximity = use_proximity
        self.game_facade = GameFacade(grid_size, grid_type, use_proximity)
        self.seeker_strategy = None

    def setup_simulation(self):
        self.game_facade.reset_game()
        self.game_facade.start_new_game(PlayerRole.SEEKER)
        self.seeker_strategy = solve_payoff_matrix(self.game_facade.payoff_matrix, player="hider")['probabilities']

    def run_simulation(self, num_rounds=100):
        self.setup_simulation()

        for i in range(num_rounds):
            seeker_position = random.choices(list(range(self.grid_size)), self.seeker_strategy)[0]
            self.game_facade.play_round(seeker_position)
