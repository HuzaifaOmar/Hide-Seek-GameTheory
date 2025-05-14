from enum import Enum
import random
import numpy as np
import math


class PlaceType(Enum):
    EASY = 1
    NEUTRAL = 2
    HARD = 3


class GameGrid:
    def __init__(self, size):
        self.size = size
        self.place_types = []
        self.base_scores = {
            PlaceType.EASY: (1, 2),  # Easy: if seeker wins gets 1 point,if hider gets 2 points
            PlaceType.NEUTRAL: (1, 1),  # Neutral: Both get 1 point when winning
            PlaceType.HARD: (3, 1)  # Hard: if seeker wins gets 3 points, if hider wins gets 1 point
        }

        self._generate_place_types()

        self.base_payoff_matrix = self._generate_base_payoff_matrix()

    def _generate_place_types(self):
        self.place_types = [random.choice(list(PlaceType)) for _ in range(self.size)]

    def get_place_type(self, position):
        if 0 <= position < self.size:
            return self.place_types[position]
        raise ValueError(f"Invalid position: {position} is out of range [0, {self.size - 1})")

    def get_place_score(self, position, winner="hider"):
        if winner == "seeker":
            return self.base_scores[self.get_place_type(position)][0]
        return self.base_scores[self.get_place_type(position)][1]

    def _generate_base_payoff_matrix(self):
        payoff_matrix = np.zeros((self.size, self.size))
        for hider_pos in range(self.size):
            for seeker_pos in range(self.size):
                if hider_pos == seeker_pos:
                    payoff_matrix[hider_pos][seeker_pos] = -self.base_scores[self.get_place_type(seeker_pos)][0]
                else:
                    payoff_matrix[hider_pos][seeker_pos] = -self.base_scores[self.get_place_type(seeker_pos)][1]

        return payoff_matrix

    def get_proximity_payoff_matrix(self):
        proximity_matrix = self.base_payoff_matrix.copy()

        for hider_pos in range(self.size):
            for seeker_pos in range(self.size):
                if hider_pos != seeker_pos:
                    distance = abs(hider_pos - seeker_pos)
                    multiplier = 1.0
                    if distance == 1:
                        multiplier = 0.5
                    elif distance == 2:
                        multiplier = 0.75
                    # WARN: the current multiplier changes the score of both the hider and the seeker
                    proximity_matrix[hider_pos][seeker_pos] *= multiplier
        return proximity_matrix

    def get_2d_grid_dimension(self):
        grid_size = int(math.sqrt(self.size))

        if grid_size * grid_size == self.size:
            return grid_size, grid_size

        for i in range(grid_size, 0, -1):
            if self.size % i == 0:
                return i, self.size // i

        # just a fallback to pass interpreter error
        return -1, -1

    def _get_2d_coordinates(self, position):
        """Convert 1D linear position into 2D coordinates (row, col)"""
        cols = self.get_2d_grid_dimension()[1]
        rows = position // cols
        col = position % cols
        return rows, col

    def _get_1d_position(self, row, col):
        cols = self.get_2d_grid_dimension()[1]
        return row * cols + col

    def _get_manhattan_distance(self, pos1, pos2):
        row1, col1 = self._get_2d_coordinates(pos1)
        row2, col2 = self._get_2d_coordinates(pos2)
        return abs(row1 - row2) + abs(col1 - col2)

    def get_2d_proximity_payoff_matrix(self):
        proximity_matrix = self.base_payoff_matrix.copy()
        # TODO: implement 2D proximity payoff matrix
        return proximity_matrix

    def get_payoff_matrix(self, use_proximity=False, use_2d=False):
        if use_proximity:
            if use_2d:
                return self.get_2d_proximity_payoff_matrix()
            return self.get_proximity_payoff_matrix()
        return self.base_payoff_matrix

    def print_1d_game_grid(self):
        # TODO: implement 1D grid printing
        pass

    def print_2d_game_grid(self):
        # TODO: implement 2D grid printing
        pass
