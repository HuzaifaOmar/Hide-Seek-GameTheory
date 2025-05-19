import { CellType, GridType } from '../types/game';

/**
 * Generates a game matrix based on the grid size and type
 */
export function generateGameMatrix(size: number, gridType: GridType): number[][] {
  const matrix: number[][] = [];
  
  for (let i = 0; i < size; i++) {
    matrix[i] = [];
    for (let j = 0; j < size; j++) {
      if (i === j) {
        // When hider and seeker are in the same position, the seeker wins
        // This is represented by a negative value in the hider's payoff matrix
        matrix[i][j] = -1 - Math.floor(Math.random() * 3); // Random negative value between -1 and -3
      } else {
        // Otherwise the hider's payoff is positive
        matrix[i][j] = 1 + Math.floor(Math.random() * 2); // Random value between 1 and 2
      }
    }
  }
  
  // Add proximity effect for approximation grids
  if (gridType.includes('approximation')) {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (i !== j) {
          const distance = Math.abs(i - j);
          if (distance === 1) {
            matrix[i][j] = Math.max(1, Math.floor(matrix[i][j] * 0.5)); // 50% reduction for adjacent cells
          } else if (distance === 2) {
            matrix[i][j] = Math.max(1, Math.floor(matrix[i][j] * 0.75)); // 25% reduction for cells 2 spots away
          }
        }
      }
    }
  }
  
  return matrix;
}

/**
 * Generates random cell types for the grid
 */
export function generateCellTypes(size: number): CellType[] {
  const types: CellType[] = [];
  const possibleTypes: CellType[] = ['easy', 'neutral', 'hard'];
  
  for (let i = 0; i < size; i++) {
    // Random selection from the possible types
    const randomIndex = Math.floor(Math.random() * possibleTypes.length);
    types.push(possibleTypes[randomIndex]);
  }
  
  return types;
}

/**
 * Gets the color for a cell based on its type
 */
export function getCellTypeColor(type: CellType): string {
  switch (type) {
    case 'easy':
      return 'bg-green-500 hover:bg-green-600';
    case 'neutral':
      return 'bg-yellow-500 hover:bg-yellow-600';
    case 'hard':
      return 'bg-red-500 hover:bg-red-600';
    default:
      return 'bg-gray-400 hover:bg-gray-500';
  }
}

/**
 * Gets the text description for a cell type
 */
export function getCellTypeDescription(type: CellType): string {
  switch (type) {
    case 'easy':
      return 'Easy for the seeker';
    case 'neutral':
      return 'Neutral ground';
    case 'hard':
      return 'Hard for the seeker';
    default:
      return 'Unknown';
  }
}