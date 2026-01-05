/**
 * 3D Model Configurations
 * Each model has regions with expected colors (1-8)
 * Colors: 1=Red, 2=Orange, 3=Yellow, 4=Green, 5=Blue, 6=Purple, 7=Pink, 8=Brown
 */

export const MODELS = {
  swampIsland: {
    id: 'swampIsland',
    name: 'Swamp Island',
    difficulty: 'Hard',
    isFullGLB: true,
    modelPath: '/Swamp Island.glb',
    regions: [], // Will be populated dynamically from GLB meshes
  },
};

export const MODEL_LIST = Object.values(MODELS);

export default MODELS;
