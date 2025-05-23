import numpy as np
import matplotlib.pyplot as plt

from src.game.gamelogic.gamegrid.grid2d.gamegrid2d import GameGrid2d
from src.game.gamelogic.gamegrid.lineargrid.linear_approximate_gamegrid import LinearProximityGameGrid
from src.game.gamelogic.gamegrid.lineargrid.linear_gamegrid import LinearGameGrid
from src.linearprogramming.lp_gamesolver import solve_payoff_matrix


def display_solution(payoff_matrix, player="hider"):
    probabilities, expected_value = solve_payoff_matrix(payoff_matrix, player)

    print(f"Optimal strategy for {player.title()}:")
    for i, prob in enumerate(probabilities):
        print(f"Position {i + 1}: {prob:.4f} ({prob * 100:.2f}%)")

    print(f"\nExpected game value: {expected_value:.4f}")

    # Plot the probabilities
    plt.figure(figsize=(10, 6))

    # Plot probabilities as bar chart
    plt.subplot(1, 2, 1)
    plt.bar(range(1, len(probabilities) + 1), probabilities)
    plt.xlabel('Position')
    plt.ylabel('Probability')
    plt.title(f'Optimal Mixed Strategy for {player.title()}')
    plt.xticks(range(1, len(probabilities) + 1))

    # Show the game matrix as a heatmap
    plt.subplot(1, 2, 2)
    plt.imshow(payoff_matrix, cmap='RdBu')
    plt.colorbar(label="Hider's Payoff")
    plt.title("Game Payoff Matrix")
    plt.xlabel("Seeker's Position")
    plt.ylabel("Hider's Position")
    plt.xticks(range(len(payoff_matrix)))
    plt.yticks(range(len(payoff_matrix)))

    # Add text annotations to the heatmap
    for i in range(len(payoff_matrix)):
        for j in range(len(payoff_matrix)):
            plt.text(j, i, f"{payoff_matrix[i, j]}",
                     ha="center", va="center", color="black")

    plt.tight_layout()
    plt.savefig(f"{player}.png")


# Example usage
if __name__ == "__main__":
    payoff_matrix_linear = LinearGameGrid(4).get_payoff_matrix()
    payoff_matrix_linear_approx = LinearProximityGameGrid(4).get_payoff_matrix()
    payoff_matrix_2d_approx = GameGrid2d(9).get_payoff_matrix()

    # Solve for hider
    print("=== Solving for Hider ===")
    display_solution(payoff_matrix_linear_approx, "hider")

    # Solve for seeker
    print("\n=== Solving for Seeker ===")
    display_solution(payoff_matrix_linear_approx, "seeker")