/**
 * Level configurations for Conveyor Sort game
 */

import { COLOR_NAMES } from './colors';

export const LEVELS = [
  {
    id: 1,
    name: 'Easy',
    description: '2 colors, single layer',
    colors: 2,
    placements: 4,
    gridCols: 2,
    beltCapacity: 16,
    stackCapacity: 8,
    beltSpeed: 60,
    cubesPerPlacement: 4,
    depth: 1,
  },
  {
    id: 2,
    name: 'Medium',
    description: '3 colors, 2 layers deep',
    colors: 3,
    placements: 4,
    gridCols: 2,
    beltCapacity: 16,
    stackCapacity: 6,
    beltSpeed: 55,
    cubesPerPlacement: 4,
    depth: 2,
  },
  {
    id: 3,
    name: 'Hard',
    description: '4 colors, 2 layers deep',
    colors: 4,
    placements: 4,
    gridCols: 2,
    beltCapacity: 16,
    stackCapacity: 6,
    beltSpeed: 50,
    cubesPerPlacement: 4,
    depth: 2,
  },
  {
    id: 4,
    name: 'Super Hard',
    description: '4 colors, 6 placements, 2 layers',
    colors: 4,
    placements: 6,
    gridCols: 2,
    beltCapacity: 16,
    stackCapacity: 5,
    beltSpeed: 45,
    cubesPerPlacement: 4,
    depth: 2,
  },
  {
    id: 5,
    name: 'Extreme',
    description: '5 colors, 3 layers deep',
    colors: 5,
    placements: 6,
    gridCols: 2,
    beltCapacity: 16,
    stackCapacity: 5,
    beltSpeed: 45,
    cubesPerPlacement: 4,
    depth: 3,
  },
  {
    id: 6,
    name: 'Nightmare',
    description: '6 colors, 9 placements, 3 layers',
    colors: 6,
    placements: 9,
    gridCols: 3,
    beltCapacity: 16,
    stackCapacity: 4,
    beltSpeed: 40,
    cubesPerPlacement: 4,
    depth: 3,
  },
];

/**
 * Create conveyor path points based on height
 */
export const createConveyorPath = (height = 360) => {
  const points = [];
  const width = 320;
  const cornerRadius = 55;
  const centerX = 200;
  const centerY = 60 + height / 2;

  const left = centerX - width / 2;
  const right = centerX + width / 2;
  const top = centerY - height / 2;
  const bottom = centerY + height / 2;

  const straightPoints = 30;
  const cornerPoints = 15;

  // Top edge (left to right)
  for (let i = 0; i <= straightPoints; i++) {
    points.push({
      x: left + cornerRadius + (width - 2 * cornerRadius) * (i / straightPoints),
      y: top,
    });
  }

  // Top-right corner
  for (let i = 0; i <= cornerPoints; i++) {
    const angle = -Math.PI / 2 + (Math.PI / 2) * (i / cornerPoints);
    points.push({
      x: right - cornerRadius + cornerRadius * Math.cos(angle),
      y: top + cornerRadius + cornerRadius * Math.sin(angle),
    });
  }

  // Right edge (top to bottom)
  for (let i = 0; i <= straightPoints; i++) {
    points.push({
      x: right,
      y: top + cornerRadius + (height - 2 * cornerRadius) * (i / straightPoints),
    });
  }

  // Bottom-right corner
  for (let i = 0; i <= cornerPoints; i++) {
    const angle = 0 + (Math.PI / 2) * (i / cornerPoints);
    points.push({
      x: right - cornerRadius + cornerRadius * Math.cos(angle),
      y: bottom - cornerRadius + cornerRadius * Math.sin(angle),
    });
  }

  // Bottom edge (right to left)
  for (let i = 0; i <= straightPoints; i++) {
    points.push({
      x: right - cornerRadius - (width - 2 * cornerRadius) * (i / straightPoints),
      y: bottom,
    });
  }

  // Bottom-left corner
  for (let i = 0; i <= cornerPoints; i++) {
    const angle = Math.PI / 2 + (Math.PI / 2) * (i / cornerPoints);
    points.push({
      x: left + cornerRadius + cornerRadius * Math.cos(angle),
      y: bottom - cornerRadius + cornerRadius * Math.sin(angle),
    });
  }

  // Left edge (bottom to top)
  for (let i = 0; i <= straightPoints; i++) {
    points.push({
      x: left,
      y: bottom - cornerRadius - (height - 2 * cornerRadius) * (i / straightPoints),
    });
  }

  // Top-left corner
  for (let i = 0; i <= cornerPoints; i++) {
    const angle = Math.PI + (Math.PI / 2) * (i / cornerPoints);
    points.push({
      x: left + cornerRadius + cornerRadius * Math.cos(angle),
      y: top + cornerRadius + cornerRadius * Math.sin(angle),
    });
  }

  return points;
};

/**
 * Generate placement positions based on grid
 */
export const generatePlacementPositions = (count, gridCols, conveyorHeight) => {
  const gridRows = Math.ceil(count / gridCols);
  const positions = [];

  const boxSize = 80;
  const gap = 10;
  const totalWidth = gridCols * boxSize + (gridCols - 1) * gap;
  const totalHeight = gridRows * boxSize + (gridRows - 1) * gap;

  const startX = 200 - totalWidth / 2 + boxSize / 2;
  const startY = 60 + conveyorHeight / 2 - totalHeight / 2 + boxSize / 2;

  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / gridCols);
    const col = i % gridCols;

    positions.push({
      id: i,
      x: startX + col * (boxSize + gap),
      y: startY + row * (boxSize + gap),
      side: col < gridCols / 2 ? 'left' : 'right',
    });
  }

  return positions;
};

/**
 * Shuffle array in place (Fisher-Yates)
 */
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * Generate level data with placements
 * IMPORTANT: Ensures solvability by balancing cube colors
 */
export const generateLevel = (levelConfig) => {
  const { colors, placements, cubesPerPlacement, gridCols, depth } = levelConfig;
  const conveyorHeight = placements > 6 ? 420 : placements > 4 ? 380 : 340;
  const positions = generatePlacementPositions(placements, gridCols, conveyorHeight);

  const availableColors = COLOR_NAMES.slice(0, colors);

  // Step 1: Determine target colors for each placement's layers
  const placementTargets = positions.map((pos, posIndex) => {
    const layerTargets = [];
    for (let layerIndex = 0; layerIndex < depth; layerIndex++) {
      layerTargets.push(availableColors[(posIndex + layerIndex) % availableColors.length]);
    }
    return layerTargets;
  });

  // Step 2: Count how many cubes of each color are needed total
  const colorNeeds = {};
  availableColors.forEach(c => colorNeeds[c] = 0);

  placementTargets.forEach(targets => {
    targets.forEach(targetColor => {
      colorNeeds[targetColor] += cubesPerPlacement;
    });
  });

  // Step 3: Create a pool of ALL cubes with exact counts needed
  const allCubes = [];
  Object.entries(colorNeeds).forEach(([color, count]) => {
    for (let i = 0; i < count; i++) {
      allCubes.push(color);
    }
  });

  // Step 4: Shuffle the pool
  const shuffledCubes = shuffleArray(allCubes);

  // Step 5: Distribute cubes to placements (each placement gets depth * cubesPerPlacement)
  let cubeIndex = 0;
  const generatedPlacements = positions.map((pos, posIndex) => {
    const layers = [];

    for (let layerIndex = 0; layerIndex < depth; layerIndex++) {
      const targetColor = placementTargets[posIndex][layerIndex];
      const layerCubes = [];

      for (let i = 0; i < cubesPerPlacement; i++) {
        layerCubes.push({
          id: `p${posIndex}-l${layerIndex}-c${i}-${Date.now()}-${Math.random()}`,
          color: shuffledCubes[cubeIndex++],
        });
      }

      layers.push({
        targetColor,
        cubes: layerCubes,
        completed: false,
      });
    }

    return {
      id: pos.id,
      x: pos.x,
      y: pos.y,
      side: pos.side,
      layers,
      currentLayerIndex: depth - 1,
    };
  });

  return { placements: generatedPlacements, conveyorHeight };
};

export const getLevel = (levelIndex) => LEVELS[levelIndex] || LEVELS[0];

export default LEVELS;
