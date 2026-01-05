/**
 * Zustand store for Conveyor Sort game state
 * Now tempo-synchronized for musical gameplay
 */

import { create } from 'zustand';
import { generateLevel, createConveyorPath, LEVELS } from '../data/levels';

export const useConveyorGameState = create((set, get) => ({
  // Game state
  currentLevel: 0,
  gameState: 'menu', // 'menu', 'playing', 'won', 'lost'

  // Level data
  placements: [],
  cubesOnBelt: [],
  inputStack: [],
  conveyorHeight: 340,
  pathPoints: createConveyorPath(340),

  // Animation state
  arrowOffset: 0,
  nextCubeId: 0,
  completionAnimations: [],

  // Musical state
  beatCount: 0,
  stepCount: 0, // 4 steps per beat

  // Audio callbacks (set by component)
  audioCallbacks: {
    onCubePick: null,
    onCubePlace: null,
    onBeltRelease: null,
    onLayerComplete: null,
    onVictoryLap: null,
    onWin: null,
    onLose: null,
    onBeat: null,
    onStep: null,
  },

  setAudioCallbacks: (callbacks) => set({ audioCallbacks: callbacks }),

  // Getters
  getLevelConfig: () => LEVELS[get().currentLevel],

  getTotalPathLength: () => get().pathPoints.length,

  getInputGateIndex: () => Math.floor(get().pathPoints.length * 0.54),

  getInputGatePos: () => {
    const index = get().getInputGateIndex();
    return get().pathPoints[index] || { x: 200, y: 400 };
  },

  getBoxSpacing: () => {
    const config = get().getLevelConfig();
    return Math.floor(get().pathPoints.length / config.beltCapacity);
  },

  getActiveLayer: (placement) => {
    if (placement.currentLayerIndex < 0) return null;
    return placement.layers[placement.currentLayerIndex];
  },

  getTotalRemainingLayers: () => {
    return get().placements.reduce((sum, p) => sum + p.currentLayerIndex + 1, 0);
  },

  // Actions
  setCurrentLevel: (level) => set({ currentLevel: level }),

  initLevel: (levelIndex) => {
    const config = LEVELS[levelIndex];
    const { placements, conveyorHeight } = generateLevel(config);
    const pathPoints = createConveyorPath(conveyorHeight);

    set({
      currentLevel: levelIndex,
      placements,
      conveyorHeight,
      pathPoints,
      cubesOnBelt: [],
      inputStack: [],
      nextCubeId: 0,
      gameState: 'playing',
      completionAnimations: [],
      arrowOffset: 0,
      beatCount: 0,
      stepCount: 0,
    });
  },

  showMenu: () => set({ gameState: 'menu' }),

  // Called every step (4 steps per beat)
  tick: () => {
    const state = get();
    const totalLength = state.pathPoints.length;
    const newStepCount = (state.stepCount + 1) % 4;
    const newBeatCount = newStepCount === 0 ? (state.beatCount + 1) % 4 : state.beatCount;

    // Trigger beat callback on downbeat
    if (newStepCount === 0) {
      const { audioCallbacks } = state;
      if (audioCallbacks.onBeat) {
        audioCallbacks.onBeat(newBeatCount === 0);
      }
    }

    // Move conveyor
    set(s => ({
      arrowOffset: (s.arrowOffset + 1) % totalLength,
      stepCount: newStepCount,
      beatCount: newBeatCount,
      cubesOnBelt: s.cubesOnBelt.map(cube => ({
        ...cube,
        pathIndex: (cube.pathIndex + 1) % totalLength,
      })),
    }));

    // Process cube jumps
    get().processCubeJumps();
  },

  isNearPlacement: (pathIndex, placement) => {
    const point = get().pathPoints[pathIndex];
    if (!point) return false;
    const dy = Math.abs(point.y - placement.y);

    if (placement.side === 'left' && point.x < 60 && dy < 70) return true;
    if (placement.side === 'right' && point.x > 340 && dy < 70) return true;
    return false;
  },

  processCubeJumps: () => {
    const state = get();
    const config = state.getLevelConfig();
    const cubesToRemove = [];
    const jumps = [];

    for (const cube of state.cubesOnBelt) {
      if (cubesToRemove.includes(cube.id)) continue;

      for (const placement of state.placements) {
        const activeLayer = state.getActiveLayer(placement);
        if (!activeLayer) continue;
        if (activeLayer.targetColor !== cube.color) continue;
        if (activeLayer.cubes.length >= config.cubesPerPlacement) continue;

        if (state.isNearPlacement(cube.pathIndex, placement)) {
          cubesToRemove.push(cube.id);
          jumps.push({
            placementId: placement.id,
            color: cube.color,
            cubeId: cube.id,
            boxIndex: placement.id,
          });
          break;
        }
      }
    }

    if (jumps.length > 0) {
      set(state => ({
        cubesOnBelt: state.cubesOnBelt.filter(c => !cubesToRemove.includes(c.id)),
        placements: state.placements.map(p => {
          const relevantJumps = jumps.filter(j => j.placementId === p.id);
          if (relevantJumps.length === 0) return p;

          const activeLayerIdx = p.currentLayerIndex;
          if (activeLayerIdx < 0) return p;

          const newLayers = p.layers.map((layer, idx) => {
            if (idx !== activeLayerIdx) return layer;
            if (layer.cubes.length >= config.cubesPerPlacement) return layer;

            const newCubes = [...layer.cubes];
            for (const jump of relevantJumps) {
              if (newCubes.length < config.cubesPerPlacement) {
                newCubes.push({ id: jump.cubeId, color: jump.color });
              }
            }
            return { ...layer, cubes: newCubes };
          });

          return { ...p, layers: newLayers };
        }),
      }));

      // Trigger audio for placed cubes
      const { audioCallbacks } = get();
      jumps.forEach(jump => {
        if (audioCallbacks.onCubePlace) {
          audioCallbacks.onCubePlace(jump.color, jump.boxIndex);
        }
        // Check for layer completion
        setTimeout(() => get().checkLayerCompletion(jump.placementId), 50);
      });
    }

    return jumps;
  },

  checkLayerCompletion: (placementId) => {
    const config = get().getLevelConfig();

    set(state => {
      const newPlacements = state.placements.map(p => {
        if (p.id !== placementId) return p;

        const activeLayer = state.getActiveLayer(p);
        if (!activeLayer) return p;

        const isComplete =
          activeLayer.cubes.length === config.cubesPerPlacement &&
          activeLayer.cubes.every(c => c.color === activeLayer.targetColor);

        if (isComplete) {
          // Add completion animation
          const animId = `${p.id}-${p.currentLayerIndex}-${Date.now()}`;
          set(s => ({
            completionAnimations: [
              ...s.completionAnimations,
              { id: animId, x: p.x, y: p.y, color: activeLayer.targetColor },
            ],
          }));

          setTimeout(() => {
            set(s => ({
              completionAnimations: s.completionAnimations.filter(a => a.id !== animId),
            }));
          }, 500);

          // Trigger layer complete audio with box melody
          const { audioCallbacks } = get();
          if (audioCallbacks.onLayerComplete) {
            audioCallbacks.onLayerComplete(activeLayer.targetColor, p.id);
          }

          const newLayerIndex = p.currentLayerIndex - 1;

          return {
            ...p,
            layers: p.layers.map((layer, idx) =>
              idx === p.currentLayerIndex ? { ...layer, completed: true } : layer
            ),
            currentLayerIndex: newLayerIndex,
          };
        }

        return p;
      });

      return { placements: newPlacements };
    });
  },

  releaseCubeFromStack: () => {
    const state = get();
    const config = state.getLevelConfig();

    if (state.inputStack.length === 0) return false;
    if (state.cubesOnBelt.length >= config.beltCapacity) return false;

    const inputGateIndex = state.getInputGateIndex();
    const boxSpacing = state.getBoxSpacing();

    const gateOccupied = state.cubesOnBelt.some(cube => {
      const distance = Math.abs(cube.pathIndex - inputGateIndex);
      const wrappedDistance = Math.min(distance, state.pathPoints.length - distance);
      return wrappedDistance < boxSpacing;
    });

    if (!gateOccupied) {
      const [nextCube, ...remainingStack] = state.inputStack;
      set(s => ({
        cubesOnBelt: [
          ...s.cubesOnBelt,
          {
            id: `belt-${s.nextCubeId}-${Date.now()}`,
            color: nextCube,
            pathIndex: inputGateIndex,
          },
        ],
        nextCubeId: s.nextCubeId + 1,
        inputStack: remainingStack,
      }));

      // Trigger belt release audio
      const { audioCallbacks } = get();
      if (audioCallbacks.onBeltRelease) {
        audioCallbacks.onBeltRelease(nextCube);
      }

      return true;
    }
    return false;
  },

  handleCubeClick: (placementId, cubeColor) => {
    const state = get();
    const config = state.getLevelConfig();

    if (state.gameState !== 'playing') return;
    if (state.inputStack.length >= config.stackCapacity) return;

    let pickedCount = 0;

    set(s => {
      const newPlacements = s.placements.map(p => {
        if (p.id !== placementId) return p;

        const activeLayerIdx = p.currentLayerIndex;
        if (activeLayerIdx < 0) return p;

        const activeLayer = p.layers[activeLayerIdx];
        const cubesToRemove = activeLayer.cubes.filter(c => c.color === cubeColor);
        const remainingCubes = activeLayer.cubes.filter(c => c.color !== cubeColor);

        const spaceInStack = config.stackCapacity - s.inputStack.length;
        const cubesToAdd = cubesToRemove.slice(0, spaceInStack);
        pickedCount = cubesToAdd.length;

        if (cubesToAdd.length > 0) {
          set(prev => ({
            inputStack: [...prev.inputStack, ...cubesToAdd.map(c => c.color)],
          }));
        }

        const cubesToKeep = cubesToRemove.slice(spaceInStack);

        const newLayers = p.layers.map((layer, idx) => {
          if (idx !== activeLayerIdx) return layer;
          return { ...layer, cubes: [...remainingCubes, ...cubesToKeep] };
        });

        return { ...p, layers: newLayers };
      });

      return { placements: newPlacements };
    });

    // Trigger pick audio
    if (pickedCount > 0) {
      const { audioCallbacks } = get();
      if (audioCallbacks.onCubePick) {
        audioCallbacks.onCubePick(cubeColor, pickedCount);
      }
    }
  },

  // Called when victory lap completes (full music loop played)
  onVictoryLapComplete: () => {
    const state = get();
    if (state.gameState !== 'victory_lap') return;

    set({ gameState: 'won' });
    const { audioCallbacks } = state;
    if (audioCallbacks.onWin) {
      audioCallbacks.onWin();
    }
  },

  checkWinLose: () => {
    const state = get();
    const config = state.getLevelConfig();

    if (state.placements.length === 0 || (state.gameState !== 'playing' && state.gameState !== 'victory_lap')) return;

    // Win: All layers completed - start victory lap first
    const allComplete = state.placements.every(p => p.currentLayerIndex < 0);
    if (allComplete && state.gameState === 'playing') {
      // Enter victory lap - music will play one full loop
      set({ gameState: 'victory_lap' });
      const { audioCallbacks } = state;
      if (audioCallbacks.onVictoryLap) {
        audioCallbacks.onVictoryLap();
      }
      return;
    }

    // Lose: Belt and stack full with wrong cubes
    if (
      state.cubesOnBelt.length >= config.beltCapacity &&
      state.inputStack.length >= config.stackCapacity
    ) {
      const hasWrongCubes = state.placements.some(p => {
        const activeLayer = state.getActiveLayer(p);
        return activeLayer && activeLayer.cubes.some(c => c.color !== activeLayer.targetColor);
      });
      if (hasWrongCubes) {
        set({ gameState: 'lost' });
        const { audioCallbacks } = state;
        if (audioCallbacks.onLose) {
          audioCallbacks.onLose();
        }
      }
    }
  },

  nextLevel: () => {
    const state = get();
    if (state.currentLevel < LEVELS.length - 1) {
      get().initLevel(state.currentLevel + 1);
    }
  },

  retryLevel: () => {
    get().initLevel(get().currentLevel);
  },
}));

export default useConveyorGameState;
