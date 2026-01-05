/**
 * Zustand store for Pixel Belt game state
 *
 * Mechanics:
 * 1. Player taps queue to send blob (with multiple shots) onto belt
 * 2. Up to 5 blobs can be active (belt + slots combined)
 * 3. Blob travels: bottom-left → right → top → left → back
 * 4. Each blob shoots MAX 1 pixel per position (matching color in current ring)
 * 5. When blob.shots reaches 0 → vanishes immediately with animation
 * 6. When blob completes loop with shots remaining → goes to slot
 * 7. Lose: 5 slots full and blob completes loop with shots remaining
 */

import { create } from 'zustand';
import { LEVELS, PIXEL_ART, createBeltPath } from '../data/levels';

const MAX_ACTIVE_BLOBS = 5;
const PIXEL_SCALE = 2; // 2x resolution - each original pixel becomes 2x2

// Parse pixel art into pixel objects with scaling
const parsePixelArt = (art) => {
  const pixels = [];
  art.pixels.forEach((row, origY) => {
    [...row].forEach((char, origX) => {
      if (char !== ' ' && art.colorMap[char]) {
        // Create PIXEL_SCALE x PIXEL_SCALE block for each original pixel
        for (let dy = 0; dy < PIXEL_SCALE; dy++) {
          for (let dx = 0; dx < PIXEL_SCALE; dx++) {
            const x = origX * PIXEL_SCALE + dx;
            const y = origY * PIXEL_SCALE + dy;
            pixels.push({
              id: `${x}-${y}`,
              x,
              y,
              color: art.colorMap[char],
              filled: false,
            });
          }
        }
      }
    });
  });
  return pixels;
};

// Create color stacks from pixels - each stack has 20 or 40 shots
const createColorStacks = (pixels) => {
  const colorCounts = {};
  pixels.forEach(p => {
    colorCounts[p.color] = (colorCounts[p.color] || 0) + 1;
  });

  // Create stacks with exactly 20 or 40 shots
  const stacks = [];
  Object.entries(colorCounts).forEach(([color, count]) => {
    let remaining = count;
    let stackId = 0;

    while (remaining > 0) {
      // Use 40 if we have enough, otherwise 20, or remaining if less than 20
      let stackSize;
      if (remaining >= 40) {
        stackSize = 40;
      } else if (remaining >= 20) {
        stackSize = 20;
      } else {
        // For remaining < 20, round up to 20 to ensure we have enough shots
        stackSize = 20;
      }

      stacks.push({
        id: `${color}-${stackId++}`,
        color,
        count: stackSize,
      });
      remaining -= stackSize;
    }
  });

  // Shuffle stacks
  for (let i = stacks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [stacks[i], stacks[j]] = [stacks[j], stacks[i]];
  }

  return stacks;
};

// Distribute stacks into queues
const distributeToQueues = (stacks, numQueues = 5) => {
  const queues = Array.from({ length: numQueues }, () => []);
  stacks.forEach((stack, i) => {
    queues[i % numQueues].push(stack);
  });
  return queues;
};

export const usePixelBeltState = create((set, get) => ({
  // Game state
  gameState: 'menu', // 'menu', 'playing', 'won', 'lost'
  currentLevel: 0,

  // Pixel grid
  pixels: [],
  gridWidth: 0,
  gridHeight: 0,

  // Belt - multiple blobs can be on belt
  beltPath: [],
  blobsOnBelt: [], // Array of blobs currently on belt
  pixelSize: 18,

  // Queue system - player taps to send blob to belt
  queues: [[], [], [], [], []], // 5 queues

  // Launcher slots - blobs go here AFTER completing loop (if they still have shots)
  launcherSlots: [null, null, null, null, null], // 5 slots

  // Vanishing blobs (for animation)
  vanishingBlobs: [],

  // Projectiles
  projectiles: [],
  nextBlobId: 0,

  // Audio callbacks
  audioCallbacks: {
    onPixelFill: null,
    onRingComplete: null,
    onWin: null,
  },

  setAudioCallbacks: (callbacks) => set({ audioCallbacks: callbacks }),

  // Get total active blobs (belt + slots)
  getActiveCount: () => {
    const state = get();
    const beltCount = state.blobsOnBelt.length;
    const slotCount = state.launcherSlots.filter(s => s !== null).length;
    return beltCount + slotCount;
  },

  // Initialize level
  initLevel: (levelIndex) => {
    const level = LEVELS[levelIndex % LEVELS.length];
    const art = PIXEL_ART[level.artKey];
    const pixels = parsePixelArt(art);
    const stacks = createColorStacks(pixels);
    const queues = distributeToQueues(stacks);

    // Grid dimensions (scaled)
    const gridWidth = art.width * PIXEL_SCALE;
    const gridHeight = art.height * PIXEL_SCALE;

    // Pixel size - smaller for higher resolution
    const pixelSize = Math.max(8, Math.floor(280 / Math.max(gridWidth, gridHeight)));
    const beltPath = createBeltPath(gridWidth, gridHeight, pixelSize);

    set({
      currentLevel: levelIndex,
      pixels,
      gridWidth,
      gridHeight,
      beltPath,
      blobsOnBelt: [],
      pixelSize,
      queues,
      launcherSlots: [null, null, null, null, null],
      vanishingBlobs: [],
      projectiles: [],
      nextBlobId: 0,
      gameState: 'playing',
    });
  },

  showMenu: () => set({ gameState: 'menu' }),

  // Get fillable pixels - the outermost unfilled pixel in each row/column
  getFillablePixels: () => {
    const { pixels, gridWidth, gridHeight } = get();
    const fillableIds = new Set();

    // For each column, find bottom-most and top-most unfilled pixels
    for (let col = 0; col < gridWidth; col++) {
      const colPixels = pixels.filter(p => p.x === col && !p.filled);
      if (colPixels.length > 0) {
        // Bottom-most (highest y) - shootable from bottom edge
        const bottomMost = colPixels.reduce((max, p) => p.y > max.y ? p : max);
        fillableIds.add(bottomMost.id);
        // Top-most (lowest y) - shootable from top edge
        const topMost = colPixels.reduce((min, p) => p.y < min.y ? p : min);
        fillableIds.add(topMost.id);
      }
    }

    // For each row, find left-most and right-most unfilled pixels
    for (let row = 0; row < gridHeight; row++) {
      const rowPixels = pixels.filter(p => p.y === row && !p.filled);
      if (rowPixels.length > 0) {
        // Right-most (highest x) - shootable from right edge
        const rightMost = rowPixels.reduce((max, p) => p.x > max.x ? p : max);
        fillableIds.add(rightMost.id);
        // Left-most (lowest x) - shootable from left edge
        const leftMost = rowPixels.reduce((min, p) => p.x < min.x ? p : min);
        fillableIds.add(leftMost.id);
      }
    }

    return pixels.filter(p => fillableIds.has(p.id));
  },

  // Get the shootable pixel from current belt position
  // Can only shoot the outermost unfilled pixel in the line of fire
  // Returns null if that pixel doesn't match the blob's color (barrier)
  getShootablePixel: (blob, pathPoint) => {
    const { pixels } = get();

    if (!pathPoint) return null;

    const edge = pathPoint.edge;
    let targetPixel = null;

    if (edge === 'bottom' && pathPoint.gridCol !== null) {
      // Shooting UP into this column - find bottommost unfilled pixel
      const col = pathPoint.gridCol;
      const colPixels = pixels.filter(p => p.x === col && !p.filled);
      if (colPixels.length > 0) {
        // Get bottommost (highest y value)
        targetPixel = colPixels.reduce((max, p) => p.y > max.y ? p : max);
        // Only shoot if color matches - otherwise it's a barrier
        if (targetPixel.color !== blob.color) targetPixel = null;
      }
    } else if (edge === 'right' && pathPoint.gridRow !== null) {
      // Shooting LEFT into this row - find rightmost unfilled pixel
      const row = pathPoint.gridRow;
      const rowPixels = pixels.filter(p => p.y === row && !p.filled);
      if (rowPixels.length > 0) {
        targetPixel = rowPixels.reduce((max, p) => p.x > max.x ? p : max);
        if (targetPixel.color !== blob.color) targetPixel = null;
      }
    } else if (edge === 'top' && pathPoint.gridCol !== null) {
      // Shooting DOWN into this column - find topmost unfilled pixel
      const col = pathPoint.gridCol;
      const colPixels = pixels.filter(p => p.x === col && !p.filled);
      if (colPixels.length > 0) {
        targetPixel = colPixels.reduce((min, p) => p.y < min.y ? p : min);
        if (targetPixel.color !== blob.color) targetPixel = null;
      }
    } else if (edge === 'left' && pathPoint.gridRow !== null) {
      // Shooting RIGHT into this row - find leftmost unfilled pixel
      const row = pathPoint.gridRow;
      const rowPixels = pixels.filter(p => p.y === row && !p.filled);
      if (rowPixels.length > 0) {
        targetPixel = rowPixels.reduce((min, p) => p.x < min.x ? p : min);
        if (targetPixel.color !== blob.color) targetPixel = null;
      }
    }

    return targetPixel;
  },

  // Handle slot tap - send blob from slot back to belt
  handleSlotTap: (slotIndex) => {
    const state = get();
    if (state.gameState !== 'playing') return false;

    const slot = state.launcherSlots[slotIndex];
    if (!slot) return false; // Empty slot

    // Check minimum spacing on belt entry
    const entryOccupied = state.blobsOnBelt.some(blob => blob.pathIndex < 3);
    if (entryOccupied) return false;

    // Move blob from slot to belt
    set(s => ({
      launcherSlots: s.launcherSlots.map((sl, i) =>
        i === slotIndex ? null : sl
      ),
      blobsOnBelt: [
        ...s.blobsOnBelt,
        {
          id: `blob-${s.nextBlobId}`,
          color: slot.color,
          shotsRemaining: slot.shotsRemaining,
          pathIndex: 0,
        },
      ],
      nextBlobId: s.nextBlobId + 1,
    }));

    return true;
  },

  // Handle queue tap - send blob to belt if entry is free
  handleQueueTap: (queueIndex) => {
    const state = get();
    if (state.gameState !== 'playing') return false;
    if (state.queues[queueIndex].length === 0) return false;

    // Check minimum spacing on belt entry (no blob near starting position)
    const entryOccupied = state.blobsOnBelt.some(blob => blob.pathIndex < 3);
    if (entryOccupied) return false;

    const stack = state.queues[queueIndex][0];

    set(s => ({
      queues: s.queues.map((q, i) =>
        i === queueIndex ? q.slice(1) : q
      ),
      blobsOnBelt: [
        ...s.blobsOnBelt,
        {
          id: `blob-${s.nextBlobId}`,
          color: stack.color,
          shotsRemaining: stack.count,
          pathIndex: 0,
        },
      ],
      nextBlobId: s.nextBlobId + 1,
    }));

    return true;
  },

  // Game tick - check for shooting at current position, then move blobs
  tick: () => {
    const state = get();
    if (state.gameState !== 'playing') return;

    const totalLength = state.beltPath.length;
    let newProjectiles = [...state.projectiles];
    const blobsToSlot = [];
    const newVanishing = [];
    const pixelsToFill = [];

    // Process each blob: FIRST check for shooting at current position, THEN move
    const updatedBlobs = state.blobsOnBelt.map(blob => {
      let updatedBlob = { ...blob };

      // Step 1: Check for shooting at CURRENT position
      if (blob.shotsRemaining > 0) {
        const currentPathPoint = state.beltPath[blob.pathIndex];
        const targetPixel = state.getShootablePixel(blob, currentPathPoint);

        if (targetPixel) {
          // Create projectile
          newProjectiles.push({
            id: `proj-${blob.id}-${blob.pathIndex}`,
            color: blob.color,
            fromX: currentPathPoint.x,
            fromY: currentPathPoint.y,
            toPixelId: targetPixel.id,
            toX: targetPixel.x * state.pixelSize + state.pixelSize / 2,
            toY: targetPixel.y * state.pixelSize + state.pixelSize / 2,
          });

          // Decrement shots
          updatedBlob.shotsRemaining = blob.shotsRemaining - 1;

          // Queue pixel fill (will be filled in this tick's state update)
          pixelsToFill.push({ id: targetPixel.id, x: targetPixel.x, y: targetPixel.y });

          // If shots now 0, vanish immediately
          if (updatedBlob.shotsRemaining === 0) {
            newVanishing.push({
              id: updatedBlob.id,
              color: updatedBlob.color,
              x: currentPathPoint.x,
              y: currentPathPoint.y,
            });
            return null; // Remove from belt
          }
        }
      }

      // Step 2: Move to next position
      const newPathIndex = blob.pathIndex + 1;

      // Check if blob completed the loop
      if (newPathIndex >= totalLength) {
        if (updatedBlob.shotsRemaining > 0) {
          // Has shots remaining - go to slot
          blobsToSlot.push(updatedBlob);
        }
        return null; // Remove from belt
      }

      // Update position
      updatedBlob.pathIndex = newPathIndex;

      return updatedBlob;
    }).filter(b => b !== null);

    // Handle blobs going to slots
    let newSlots = [...state.launcherSlots];
    let blobCouldntFitInSlot = false;

    for (const blob of blobsToSlot) {
      const emptySlotIndex = newSlots.findIndex(s => s === null);
      if (emptySlotIndex !== -1) {
        newSlots[emptySlotIndex] = {
          id: blob.id,
          color: blob.color,
          shotsRemaining: blob.shotsRemaining,
        };
      } else {
        // No empty slot available - this blob couldn't fit = LOSE
        blobCouldntFitInSlot = true;
      }
    }

    // Lose condition: A blob completed the loop but couldn't fit in any slot
    const gameLost = blobCouldntFitInSlot;

    // Create set of pixel IDs to fill for quick lookup
    const pixelIdsToFill = new Set(pixelsToFill.map(p => p.id));

    // Mark pixels as filled IMMEDIATELY to prevent double-shooting
    const updatedPixels = state.pixels.map(p =>
      pixelIdsToFill.has(p.id) ? { ...p, filled: true } : p
    );

    // Check win condition
    const allFilled = updatedPixels.every(p => p.filled);

    // Single atomic state update
    set({
      gameState: gameLost ? 'lost' : (allFilled ? 'won' : state.gameState),
      pixels: updatedPixels,
      blobsOnBelt: updatedBlobs,
      launcherSlots: newSlots,
      projectiles: newProjectiles,
      vanishingBlobs: [...state.vanishingBlobs, ...newVanishing],
    });

    // Trigger audio callbacks for filled pixels
    pixelsToFill.forEach(pixel => {
      const { audioCallbacks } = get();
      if (audioCallbacks.onPixelFill) {
        audioCallbacks.onPixelFill(pixel.x, pixel.y, state.gridWidth, state.gridHeight);
      }
    });

    // Audio callback for win
    if (allFilled) {
      const { audioCallbacks } = get();
      if (audioCallbacks.onWin) {
        audioCallbacks.onWin();
      }
    }

    // Clean up projectiles after animation
    if (pixelsToFill.length > 0) {
      setTimeout(() => {
        set(s => ({
          projectiles: s.projectiles.filter(proj => !pixelIdsToFill.has(proj.toPixelId)),
        }));
      }, 200);
    }

    // Clean up vanishing blobs after animation
    if (newVanishing.length > 0) {
      setTimeout(() => {
        set(s => ({
          vanishingBlobs: s.vanishingBlobs.filter(
            v => !newVanishing.some(nv => nv.id === v.id)
          ),
        }));
      }, 400);
    }
  },

  // Next level
  nextLevel: () => {
    const state = get();
    if (state.currentLevel < LEVELS.length - 1) {
      get().initLevel(state.currentLevel + 1);
    }
  },

  // Retry level
  retryLevel: () => {
    get().initLevel(get().currentLevel);
  },
}));

export default usePixelBeltState;
