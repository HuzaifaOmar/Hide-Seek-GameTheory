from src.game.gamelogic.gamegrid.abstract_gamegrid import AbstractGameGrid
from src.game.gamelogic.gamegrid.lineargrid.linear_gamegrid import LinearGameGrid
from src.game.gamelogic.gamegrid.place_type import PlaceType


class LinearProximityGameGrid(AbstractGameGrid):
    def _calculate_distance(self, pos1, pos2):
        return abs(pos1 - pos2)

    def _generate_payoff_matrix(self):

        base_matrix = self._generate_base_payoff_matrix()
        proximity_matrix = base_matrix.copy()

        for hider_pos in range(self.size):
            for seeker_pos in range(self.size):
                if hider_pos != seeker_pos:
                    distance = self._calculate_distance(hider_pos, seeker_pos)
                    multiplier = self._apply_proximity_multiplier(distance)
                    proximity_matrix[hider_pos][seeker_pos] *= multiplier

        return proximity_matrix

    def print_game_grid(self):
        result = "1D Game Grid (With Proximity):\n"
        for i in range(self.size):
            place_type = self.get_place_type(i)
            seeker_score = self.base_scores[place_type][0]
            hider_score = self.base_scores[place_type][1]

            if place_type == PlaceType.EASY:
                result += f"Position {i}: EASY (Seeker win: +{seeker_score}, Hider win: +{hider_score})\n"
            elif place_type == PlaceType.NEUTRAL:
                result += f"Position {i}: NEUTRAL (Seeker win: +{seeker_score}, Hider win: +{hider_score})\n"
            else:
                result += f"Position {i}: HARD (Seeker win: +{seeker_score}, Hider win: +{hider_score})\n"

        print(result)

        if self.size >= 5:
            center = self.size // 2
            result = "\nLinear Distance Example:\n"
            result += f"Distances from position {center}:\n"

            for pos in range(self.size):
                distance = abs(pos - center)
                result += f"Position {pos}: Distance {distance}"
                if distance in [1, 2]:
                    multiplier = self._apply_proximity_multiplier(distance)
                    result += f" (Payoff multiplier: {multiplier})"
                result += "\n"

            print(result)