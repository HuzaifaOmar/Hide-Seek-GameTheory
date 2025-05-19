import numpy as np

from src.game.gamelogic.gamegrid.gamegrid_factory import create_game_grid
from src.game.gamelogic.gamegrid.place_type import PlaceType


def test_payoff_example():
    # Create a linear grid without proximity
    world = create_game_grid(4, grid_type="linear", use_proximity=False)

    # Set specific place types for testing
    world.place_types = [
        PlaceType.NEUTRAL,
        PlaceType.EASY,
        PlaceType.HARD,
        PlaceType.EASY
    ]

    # Regenerate payoff matrix with new place types
    world.base_payoff_matrix = world._generate_base_payoff_matrix()

    payoff = world.base_payoff_matrix

    print("Game example from assignment:")
    print("Place 1: Neutral, Place 2: Easy, Place 3: Hard, Place 4: Easy")
    print("\nPayoff Matrix:")
    print(payoff)

    # Expected payoff matrix based on the assignment example
    expected_payoff = np.array([
        [-2, 2, 2, 2],  # H1
        [3, -1, 3, 3],  # H2
        [1, 1, -3, 1],  # H3
        [3, 3, 3, -1]  # H4
    ])

    print("\nExpected Matrix:")
    print(expected_payoff)

    is_match = np.array_equal(payoff, expected_payoff)
    print(f"\nMatrix matches example: {is_match}")

    if not is_match:
        print("\nDifferences:")
        diff = payoff - expected_payoff
        print(diff)

    return is_match


def test_proximity_effects():
    # Create a linear grid with proximity
    world = create_game_grid(4, grid_type="linear", use_proximity=True)

    # Set specific place types for testing
    world.place_types = [
        PlaceType.NEUTRAL,  # Position 0
        PlaceType.EASY,    # Position 1
        PlaceType.HARD,    # Position 2
        PlaceType.EASY     # Position 3
    ]

    # Get payoff matrices
    base_payoff = world.get_payoff_matrix()
    prox_payoff = world._generate_payoff_matrix()

    print("Place configuration:")
    print("Position 0: Neutral, Position 1: Easy, Position 2: Hard, Position 3: Easy")

    print("\nBase Payoff Matrix (No Proximity):")
    print(base_payoff)

    print("\nProximity Payoff Matrix:")
    print(prox_payoff)


def test_2d_grid_layout():
    # Test square grid (9 positions = 3x3)
    square_world = create_game_grid(9, grid_type="2d")
    print("3x3 Square Grid:")
    square_world.print_game_grid()

    # Test bigger grid (16 positions = 4x4)
    big_world = create_game_grid(16, grid_type="2d")
    print("\n4x4 Grid:")
    big_world.print_game_grid()


if __name__ == "__main__":
    print("=== Example Payoff Matrix Test ===")
    test_payoff_example()

    print("\n\n=== Proximity Effects Test ===")
    test_proximity_effects()

    print("\n\n=== 2D Grid Layout Test ===")
    test_2d_grid_layout()