"""
Test script to demonstrate the use of the GameFacade.
"""

import time
import random
import numpy as np
from src.game.gamefacade import GameFacade, PlayerRole


def print_matrix(matrix, title):
    """Print a matrix with proper formatting."""
    print(f"\n{title}")
    for row in matrix:
        print(" ".join(f"{val:5.2f}" for val in row))


def test_game_facade():
    """Test the GameFacade class."""
    print("\n===== Testing GameFacade =====")

    # Initialize the game facade
    grid_size = 4
    facade = GameFacade(grid_size=grid_size, grid_type="linear", use_proximity=True)

    print("\nDifficulty of each position in the game grid:")
    for i in range(grid_size):
        place_type = facade.game_grid.get_place_type(i)
        base_score = facade.game_grid.get_place_score(i)
        print(f"Position {i}: {place_type.name} (Base Score: {base_score})")

    # Print the payoff matrix
    print_matrix(facade.payoff_matrix, "Initial Payoff Matrix:")

    # Start a new game as a hider
    game_config = facade.start_new_game(PlayerRole.HIDER)
    print(f"\nStarted new game as {game_config['human_role'].value}")
    print(f"Computer is {game_config['computer_role'].value}")

    # Print computer's mixed strategy
    probabilities = game_config["computer_strategy"]["probabilities"]
    print("\nComputer's mixed strategy (probabilities):")
    for i, prob in enumerate(probabilities):
        print(f"Position {i}: {prob:.4f}")

    # Play a few rounds
    for round_num in range(3):
        # Human chooses a random position
        human_position = int(input("Enter your position (0-3): "))
        print(f"\nRound {round_num + 1}: Human chooses position {human_position}")

        # Play the round
        result = facade.play_round(human_position)

        # Print the results
        print(f"Computer chose position {result['computer_position']}")
        print(f"Winner: {result['winner']}")
        print(f"Human score: {result['human_score']}, Computer score: {result['computer_score']}")

    # Reset the game
    reset_result = facade.reset_game()
    print("\nGame reset.")


if __name__ == "__main__":
    print("Hide & Seek Game Test Script")
    print("---------------------------")

    # Run the tests
    test_game_facade()
    print("\n" + "=" * 50)
