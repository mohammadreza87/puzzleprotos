import { create } from 'zustand';

/**
 * Color palette for the 3D coloring game
 */
export const COLORING_PALETTE = {
  1: { color: '#FF4D4D', name: 'Red' },
  2: { color: '#FF8533', name: 'Orange' },
  3: { color: '#FFE033', name: 'Yellow' },
  4: { color: '#33FF99', name: 'Green' },
  5: { color: '#33AAFF', name: 'Blue' },
  6: { color: '#AA55FF', name: 'Purple' },
  7: { color: '#FF55AA', name: 'Pink' },
  8: { color: '#8B4513', name: 'Brown' },
};

/**
 * Zustand store for 3D coloring game state
 */
export const useColoringStore = create((set, get) => ({
  // Current model ID
  currentModel: 'swampIsland',

  // Region colors: { regionId: colorNumber }
  regionColors: {},

  // Currently selected color number (1-8)
  selectedColor: 1,

  // Completed regions set
  completedRegions: new Set(),

  // Total regions for current model
  totalRegions: 0,

  // Game state: 'playing' | 'won'
  gameState: 'playing',

  // Actions
  setCurrentModel: (modelId, totalRegions = 0) => set({
    currentModel: modelId,
    regionColors: {},
    completedRegions: new Set(),
    totalRegions,
    gameState: 'playing',
  }),

  setTotalRegions: (total) => set({ totalRegions: total }),

  selectColor: (colorNumber) => set({ selectedColor: colorNumber }),

  colorRegion: (regionId, expectedColor) => {
    const { selectedColor, regionColors, completedRegions, totalRegions } = get();

    // Check if color matches expected
    if (selectedColor !== expectedColor) {
      return false; // Wrong color
    }

    // Already colored
    if (regionColors[regionId]) {
      return false;
    }

    const newRegionColors = { ...regionColors, [regionId]: selectedColor };
    const newCompletedRegions = new Set(completedRegions);
    newCompletedRegions.add(regionId);

    const isComplete = newCompletedRegions.size >= totalRegions;

    set({
      regionColors: newRegionColors,
      completedRegions: newCompletedRegions,
      gameState: isComplete ? 'won' : 'playing',
    });

    return true; // Successfully colored
  },

  resetGame: () => {
    const { currentModel, totalRegions } = get();
    set({
      regionColors: {},
      completedRegions: new Set(),
      gameState: 'playing',
    });
  },

  getProgress: () => {
    const { completedRegions, totalRegions } = get();
    if (totalRegions === 0) return 0;
    return Math.round((completedRegions.size / totalRegions) * 100);
  },
}));

export default useColoringStore;
