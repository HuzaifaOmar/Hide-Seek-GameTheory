import { CellType } from '../types/game';

/**
 * Gets the color for a cell based on its type
 */
export function getCellTypeColor(type: string): string {
  switch (type) {
    case "easy":
      return "bg-green-500 hover:bg-green-600";
    case "neutral":
      return "bg-yellow-500 hover:bg-yellow-600";
    case "hard":
      return "bg-red-500 hover:bg-red-600";
    default:
      return "bg-gray-400 hover:bg-gray-500";
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

export const getGridDimensions = (
  gridSize: number
): { rows: number; cols: number } => {
  let size = Math.ceil(Math.sqrt(gridSize));
  size = Math.max(size, 3); // Ensure at least 3x3 grid (9 places)
  return { rows: size, cols: size };
};