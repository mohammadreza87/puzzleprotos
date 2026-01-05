/**
 * Level configurations for Pixel Belt game
 */

// Reuse pixel art from pixel-piano
import { PIXEL_ART, LEVELS as PIXEL_ART_LEVELS } from '../../pixel-piano/data/pixelArt';

export const LEVELS = [
  {
    id: 1,
    name: 'Flower',
    artKey: 'flower',
    difficulty: 'Easy',
    beltSpeed: 200,      // ms per step (slower)
  },
  {
    id: 2,
    name: 'Heart',
    artKey: 'heart',
    difficulty: 'Easy',
    beltSpeed: 180,
  },
  {
    id: 3,
    name: 'Star',
    artKey: 'star',
    difficulty: 'Easy',
    beltSpeed: 160,
  },
  {
    id: 4,
    name: 'Fish',
    artKey: 'fish',
    difficulty: 'Medium',
    beltSpeed: 140,
  },
  {
    id: 5,
    name: 'Rocket',
    artKey: 'rocket',
    difficulty: 'Medium',
    beltSpeed: 120,
  },
  {
    id: 6,
    name: 'Butterfly',
    artKey: 'butterfly',
    difficulty: 'Hard',
    beltSpeed: 100,
  },
];

/**
 * Create belt path around pixel grid
 * Path order: bottom-left → bottom-right → top-right → top-left → bottom-left
 *
 * IMPORTANT: Creates exactly one point per grid cell on each edge
 * to ensure proper shooting opportunities
 *
 * Coordinates are relative to the grid origin (0,0 = top-left of grid)
 */
export const createBeltPath = (gridWidth, gridHeight, pixelSize) => {
  const points = [];

  // Calculate grid dimensions in pixels
  const gridPixelWidth = gridWidth * pixelSize;
  const gridPixelHeight = gridHeight * pixelSize;

  // Belt offset from grid edge (how far outside the grid the belt sits)
  const beltOffset = 15;

  // Corner positions relative to grid (0,0 is top-left of grid)
  const left = -beltOffset;
  const right = gridPixelWidth + beltOffset;
  const top = -beltOffset;
  const bottom = gridPixelHeight + beltOffset;

  // BOTTOM edge: left to right - one point per column
  for (let col = 0; col < gridWidth; col++) {
    const x = (col + 0.5) * pixelSize; // Center of each column
    points.push({
      x,
      y: bottom,
      edge: 'bottom',
      gridCol: col,
      gridRow: null,
    });
  }

  // RIGHT edge: bottom to top - one point per row
  for (let row = gridHeight - 1; row >= 0; row--) {
    const y = (row + 0.5) * pixelSize; // Center of each row
    points.push({
      x: right,
      y,
      edge: 'right',
      gridCol: null,
      gridRow: row,
    });
  }

  // TOP edge: right to left - one point per column
  for (let col = gridWidth - 1; col >= 0; col--) {
    const x = (col + 0.5) * pixelSize; // Center of each column
    points.push({
      x,
      y: top,
      edge: 'top',
      gridCol: col,
      gridRow: null,
    });
  }

  // LEFT edge: top to bottom - one point per row
  for (let row = 0; row < gridHeight; row++) {
    const y = (row + 0.5) * pixelSize; // Center of each row
    points.push({
      x: left,
      y,
      edge: 'left',
      gridCol: null,
      gridRow: row,
    });
  }

  return points;
};

/**
 * Calculate ring number for each pixel (0 = edge, higher = more inner)
 */
export const calculatePixelRing = (x, y, width, height) => {
  const distFromLeft = x;
  const distFromRight = width - 1 - x;
  const distFromTop = y;
  const distFromBottom = height - 1 - y;

  return Math.min(distFromLeft, distFromRight, distFromTop, distFromBottom);
};

/**
 * Get maximum ring number for a grid
 */
export const getMaxRing = (width, height) => {
  return Math.floor(Math.min(width, height) / 2);
};

export { PIXEL_ART };

export default LEVELS;
