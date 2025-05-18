from src.game.gamelogic.gamegrid.grid2d.gamegrid2d import GameGrid2d
from src.game.gamelogic.gamegrid.lineargrid.linear_approximate_gamegrid import LinearProximityGameGrid
from src.game.gamelogic.gamegrid.lineargrid.linear_gamegrid import LinearGameGrid


def create_game_grid(size, grid_type="linear", use_proximity=False):
    if grid_type.lower() == "linear":
        if use_proximity:
            return LinearProximityGameGrid(size)
        else:
            return LinearGameGrid(size)
    elif grid_type.lower() == "2d":
            return GameGrid2d(size)
    else:
        raise ValueError(f"Invalid grid type: {grid_type}. Must be 'linear' or '2d'.")