import math

from src.game.gamelogic.gamegrid.abstract_gamegrid import AbstractGameGrid
from src.game.gamelogic.gamegrid.place_type import PlaceType


class GameGrid2d(AbstractGameGrid):
    def __init__(self, size):
        # Validate size for 2D grid
        self.size = size
        rows, cols = self._calculate_grid_dimensions()
        if rows * cols < size:
            raise ValueError(f"invalid 2D square grid size, size must be a perfect square and greater than or equal to 9")

        super().__init__(size)

    def _calculate_grid_dimensions(self):
        grid_size = int(math.sqrt(self.size))

        if grid_size * grid_size == self.size:
            return grid_size, grid_size

        grid_size = max(grid_size, 3)
        return grid_size, grid_size

    def _get_2d_coordinates(self, position):
        cols = self._calculate_grid_dimensions()[1]
        row = position // cols
        col = position % cols
        return row, col

    def _get_1d_position(self, row, col):
        cols = self._calculate_grid_dimensions()[1]
        return row * cols + col

    def _calculate_distance(self, pos1, pos2):
        row1, col1 = self._get_2d_coordinates(pos1)
        row2, col2 = self._get_2d_coordinates(pos2)
        return max(abs(row1 - row2), abs(col1 - col2))

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
        rows, cols = self._calculate_grid_dimensions()
        result = "2D Game Grid (With Proximity):\n"
        for row in range(rows):
            line = ""
            for col in range(cols):
                pos = self._get_1d_position(row, col)
                if pos < self.size:
                    place_type = self.get_place_type(pos)
                    if place_type == PlaceType.EASY:
                        line += "E "
                    elif place_type == PlaceType.NEUTRAL:
                        line += "N "
                    else:
                        line += "H "
                else:
                    line += "  "
            result += line + "\n"
        result += "\nLegend: E=Easy, N=Neutral, H=Hard\n"

        print(result)

        # Print proximity example
        if self.size >= 9:
            center = self.size // 2
            row_c, col_c = self._get_2d_coordinates(center)
            result = f"\nChebyshev Distance Example:\n"
            result += f"Distances from position ({row_c}, {col_c}):\n"

            for row in range(rows):
                line = ""
                for col in range(cols):
                    pos = self._get_1d_position(row, col)
                    if pos < self.size:
                        distance = self._calculate_distance(center, pos)
                        line += f"{distance} "
                    else:
                        line += "  "
                result += line + "\n"

            print(result)
