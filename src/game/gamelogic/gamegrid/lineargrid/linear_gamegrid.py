from src.game.gamelogic.gamegrid.abstract_gamegrid import AbstractGameGrid
from src.game.gamelogic.gamegrid.place_type import PlaceType


class LinearGameGrid(AbstractGameGrid):
    def _calculate_distance(self, pos1, pos2):
        return abs(pos1 - pos2)

    def _generate_payoff_matrix(self):
        return self._generate_base_payoff_matrix()

    def print_game_grid(self):
        result = "1D Game Grid (No Proximity):\n"
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
