from abc import ABC, abstractmethod
import random
import numpy as np
from .place_type import PlaceType

class AbstractGameGrid(ABC):
    def __init__(self, size):
        self.size = size
        self.place_types = []
        self.base_scores = {
            PlaceType.EASY: (1, 3),  # Easy: if seeker wins gets 1 point,if hider gets 2 points
            PlaceType.NEUTRAL: (2, 2),  # Neutral: Both get 1 point when winning
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
                    payoff_matrix[hider_pos][seeker_pos] = self.base_scores[self.get_place_type(hider_pos)][1]

        return payoff_matrix

    def _apply_proximity_multiplier(self, distance):
        multiplier = 1.0
        if distance == 1:
            multiplier = 0.5
        elif distance == 2:
            multiplier = 0.75
        return multiplier

    def get_payoff_matrix(self):
        return self.base_payoff_matrix

    @abstractmethod
    def _calculate_distance(self, pos1, pos2):
        pass

    @abstractmethod
    def _generate_payoff_matrix(self):
        pass

    @abstractmethod
    def print_game_grid(self):
        pass