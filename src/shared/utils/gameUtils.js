// Game utility functions

/**
 * Parse a pixel art pattern into an array of pixel objects
 * @param {Object} art - Pixel art object with pixels and colorMap
 * @returns {Array} Array of pixel objects with x, y, color, filled, row
 */
export const parsePixelArt = (art) => {
  const pixels = [];
  art.pixels.forEach((row, y) => {
    [...row].forEach((char, x) => {
      if (char !== ' ' && art.colorMap[char]) {
        pixels.push({
          x,
          y,
          color: art.colorMap[char],
          filled: false,
          row: y,
          id: `${x}-${y}`
        });
      }
    });
  });
  return pixels;
};

/**
 * Create color stacks from pixels
 * @param {Array} pixels - Array of pixel objects
 * @returns {Array} Array of stack objects with color, count, id
 */
export const createStacks = (pixels) => {
  const colorCounts = {};
  pixels.forEach(p => {
    colorCounts[p.color] = (colorCounts[p.color] || 0) + 1;
  });

  const allStacks = [];
  Object.entries(colorCounts).forEach(([color, total]) => {
    let remaining = total;
    while (remaining > 0) {
      let stackSize;
      if (total <= 8) {
        stackSize = Math.min(remaining, Math.ceil(Math.random() * 3) + 1);
      } else if (total <= 25) {
        stackSize = Math.min(remaining, Math.floor(Math.random() * 6) + 3);
      } else {
        stackSize = Math.min(remaining, Math.floor(Math.random() * 10) + 5);
      }
      allStacks.push({
        color,
        count: stackSize,
        id: `${color}-${Math.random().toString(36).substr(2, 9)}`
      });
      remaining -= stackSize;
    }
  });

  // Verify total stack counts match total pixels
  const totalStackCount = allStacks.reduce((sum, s) => sum + s.count, 0);
  if (totalStackCount !== pixels.length) {
    console.error('Stack count mismatch!', totalStackCount, 'vs', pixels.length);
  }

  return allStacks;
};

/**
 * Distribute stacks evenly across queues
 * @param {Array} stacks - Array of stack objects
 * @param {number} queueCount - Number of queues (default 4)
 * @returns {Array} Array of queue arrays
 */
export const distributeStacksToQueues = (stacks, queueCount = 4) => {
  const shuffled = [...stacks].sort(() => Math.random() - 0.5);
  const queues = Array.from({ length: queueCount }, () => []);
  shuffled.forEach((stack, i) => {
    queues[i % queueCount].push(stack);
  });
  return queues;
};

/**
 * Get fillable pixels (unfilled pixels in the lowest row)
 * @param {Array} pixels - Array of pixel objects
 * @returns {Array} Array of fillable pixel objects
 */
export const getFillablePixels = (pixels) => {
  const unfilled = pixels.filter(p => !p.filled);
  if (unfilled.length === 0) return [];
  const minRow = Math.min(...unfilled.map(p => p.row));
  return unfilled.filter(p => p.row === minRow);
};

/**
 * Calculate pixel size based on art dimensions
 * @param {number} width - Art width in pixels
 * @param {number} height - Art height in pixels
 * @param {number} maxSize - Maximum container size
 * @returns {number} Calculated pixel size
 */
export const calculatePixelSize = (width, height, maxSize = 300) => {
  const maxDim = Math.max(width, height);
  return Math.max(12, Math.min(22, Math.floor(maxSize / maxDim)));
};

/**
 * Check if game is won (all pixels filled)
 * @param {Array} pixels - Array of pixel objects
 * @returns {boolean}
 */
export const isGameWon = (pixels) => {
  return pixels.length > 0 && pixels.every(p => p.filled);
};

/**
 * Check if game is stuck (launchers full and no matching fillable pixels)
 * @param {Array} launchers - Array of launcher objects
 * @param {Array} fillablePixels - Array of fillable pixel objects
 * @returns {boolean}
 */
export const isGameStuck = (launchers, fillablePixels) => {
  const fullLaunchers = launchers.filter(l => l !== null);
  if (fullLaunchers.length < 5) return false;
  return !fullLaunchers.some(l => fillablePixels.some(f => f.color === l.color));
};

/**
 * Calculate progress percentage
 * @param {Array} pixels - Array of pixel objects
 * @returns {number} Progress percentage (0-100)
 */
export const calculateProgress = (pixels) => {
  if (pixels.length === 0) return 0;
  return (pixels.filter(p => p.filled).length / pixels.length) * 100;
};
