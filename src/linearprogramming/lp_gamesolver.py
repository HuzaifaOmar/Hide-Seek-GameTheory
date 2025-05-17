import numpy as np
from scipy.optimize import linprog


class LPGameSolver:
    def __init__(self, payoff_matrix):
        self.payoff_matrix = payoff_matrix
        self.n = self.payoff_matrix.shape[0]  # number of places

    def solve_for_hider(self):
        # sum(x_i * Aij) >= v for all j (constraint 1)
        # sum(x_i) = 1 (constraint 2)
        # x_i >= 0 for all i
        # v >= 0

        # min z = -v (equivalent to max v)
        # convert ">= v" into "<= -v"

        c = np.zeros(self.n + 1)
        c[-1] = -1  # coefficient of v

        # Constraint 1
        # convert sum(x_i) * Aij - v >= 0 for all j
        # into -sum(x_i) * Aij + v <= 0 for all j
        A_ub = np.zeros((self.n, self.n + 1))
        for j in range(self.n):
            A_ub[j, :-1] = -self.payoff_matrix[:, j]
            A_ub[j, -1] = 1
        b_ub = np.zeros(self.n)

        # Constraint 2
        A_eq = np.zeros((1, self.n + 1))
        A_eq[0, :-1] = 1
        b_eq = np.array([1])

        bounds = [(0, None) for _ in range(self.n)] + [(None, None)]

        solution = linprog(c, A_ub=A_ub, b_ub=b_ub, A_eq=A_eq, b_eq=b_eq, bounds=bounds)
        probabilities = solution.x[:-1]
        expected_value = solution.x[-1]

        return {
            'probabilities': probabilities,
            'expected_value': expected_value,
            'solution': solution
        }

    def solve_for_seeker(self):
        # sum(x_i * Aij) <= w for all i (constraint 1)
        # sum(x_i) = 1 (constraint 2)
        # x_i >= 0 for all i
        # w >= 0

        # min z = w

        c = np.zeros(self.n + 1)
        c[-1] = 1

        # Constraint 1
        A_ub = np.zeros((self.n, self.n + 1))
        for i in range(self.n):
            A_ub[i, :-1] = self.payoff_matrix[i, :]
            A_ub[i, -1] = -1
        b_ub = np.zeros(self.n)

        # Constraint 2
        A_eq = np.zeros((1, self.n + 1))
        A_eq[0, :-1] = 1
        b_eq = np.array([1])

        bouds = [(0, None) for _ in range(self.n)] + [(None, None)]

        solution = linprog(c, A_ub=A_ub, b_ub=b_ub, A_eq=A_eq, b_eq=b_eq, bounds=bouds)
        probabilities = solution.x[:-1]
        expected_value = solution.x[-1]

        return {
            'probabilities': probabilities,
            'expected_value': expected_value,
            'solution': solution
        }

def solve_payoff_matrix(payoff_matrix, player="hider"):
    """
    Solve the Hide and Seek game for the specified player.

    Args:
        payoff_matrix (np.ndarray): 2D array representing the hider's payoff matrix
        player (str): Either "hider" or "seeker"

    Returns:
        tuple: (probabilities, expected_value)
    """
    solver = LPGameSolver(payoff_matrix)

    if player.lower() == "hider":
        result = solver.solve_for_hider()
    elif player.lower() == "seeker":
        result = solver.solve_for_seeker()
    else:
        raise ValueError("Player must be either 'hider' or 'seeker'")

    return result['probabilities'], result['expected_value']
