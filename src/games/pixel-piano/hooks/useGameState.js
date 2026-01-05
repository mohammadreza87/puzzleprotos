import { useState, useCallback, useEffect, useRef } from 'react';
import { PIXEL_ART, LEVELS } from '../data/pixelArt';
import {
  parsePixelArt,
  createStacks,
  distributeStacksToQueues,
  getFillablePixels,
  calculatePixelSize,
  isGameWon,
  isGameStuck,
  calculateProgress,
} from '../../../shared/utils/gameUtils';

// Animation duration for projectiles (ms)
const PROJECTILE_DURATION = 300;

/**
 * Custom hook for game state management
 * Handles pixels, queues, launchers, projectiles, and game logic
 */
export const useGameState = () => {
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, won, lost
  const [level, setLevel] = useState(0);
  const [pixels, setPixels] = useState([]);
  const [queues, setQueues] = useState([[], [], [], []]);
  const [launchers, setLaunchers] = useState([null, null, null, null, null]);
  const [projectiles, setProjectiles] = useState([]); // Flying projectiles
  const [message, setMessage] = useState('');
  const [artDimensions, setArtDimensions] = useState({ width: 14, height: 14 });
  const [pixelSize, setPixelSize] = useState(16);
  const [activeNotes, setActiveNotes] = useState([]);
  const [completedRows, setCompletedRows] = useState(new Set());

  // Audio callbacks (set by component)
  const audioCallbacksRef = useRef({
    onPixelFill: null,
    onRowComplete: null,
    onWin: null,
  });

  // Ref for stable access to current pixels in intervals
  const pixelsRef = useRef(pixels);
  useEffect(() => {
    pixelsRef.current = pixels;
  }, [pixels]);

  // Track pixels that are targeted by in-flight projectiles
  const targetedPixelsRef = useRef(new Set());

  // Track completed rows ref for stable access
  const completedRowsRef = useRef(new Set());

  // Set audio callbacks
  const setAudioCallbacks = useCallback((callbacks) => {
    audioCallbacksRef.current = { ...audioCallbacksRef.current, ...callbacks };
  }, []);

  // Initialize a level
  const initLevel = useCallback((lvl = 0) => {
    const artKey = LEVELS[lvl % LEVELS.length];
    const art = PIXEL_ART[artKey];
    const newPixels = parsePixelArt(art);
    const stacks = createStacks(newPixels);
    const newQueues = distributeStacksToQueues(stacks);
    const calculatedSize = calculatePixelSize(art.width, art.height);

    setPixels(newPixels);
    setQueues(newQueues);
    setLaunchers([null, null, null, null, null]);
    setProjectiles([]);
    setMessage(`${art.difficulty}: ${artKey}`);
    setLevel(lvl);
    setArtDimensions({ width: art.width, height: art.height });
    setPixelSize(calculatedSize);
    setActiveNotes([]);
    setCompletedRows(new Set());
    targetedPixelsRef.current = new Set();
    completedRowsRef.current = new Set();

    return { artKey, art };
  }, []);

  // Start the game
  const startGame = useCallback(() => {
    setGameState('playing');
  }, []);

  // Handle queue tap - move stack to launcher
  const handleQueueTap = useCallback((queueIndex) => {
    if (gameState !== 'playing') return false;
    if (queues[queueIndex].length === 0) return false;

    const emptyIndex = launchers.findIndex(l => l === null);
    if (emptyIndex === -1) {
      setMessage('Launchers full!');
      return false;
    }

    const stack = queues[queueIndex][0];
    setQueues(prev => prev.map((q, i) =>
      i === queueIndex ? q.slice(1) : q
    ));

    setLaunchers(prev => {
      const next = [...prev];
      next[emptyIndex] = { color: stack.color, count: stack.count, id: stack.id };
      return next;
    });

    return true;
  }, [gameState, queues, launchers]);

  // Shoot a projectile from launcher to target pixel
  const shootProjectile = useCallback((launcherIndex, target, color) => {
    const projectileId = `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const targetKey = `${target.x}-${target.y}`;

    // Mark pixel as targeted
    targetedPixelsRef.current.add(targetKey);

    // Create projectile
    const newProjectile = {
      id: projectileId,
      color,
      launcherIndex,
      targetX: target.x,
      targetY: target.y,
      createdAt: Date.now(),
    };

    setProjectiles(prev => [...prev, newProjectile]);

    // After animation completes, fill the pixel and remove projectile
    setTimeout(() => {
      // Fill the pixel
      setPixels(prev => {
        const newPixels = prev.map(p =>
          p.x === target.x && p.y === target.y
            ? { ...p, filled: true }
            : p
        );

        // Trigger pixel fill audio callback
        const { onPixelFill, onRowComplete } = audioCallbacksRef.current;
        if (onPixelFill) {
          const dims = { width: artDimensions.width, height: artDimensions.height };
          onPixelFill(target.x, target.y, dims.width, dims.height);
        }

        // Check if row is complete
        const rowPixels = newPixels.filter(p => p.row === target.row);
        const rowComplete = rowPixels.every(p => p.filled);
        if (rowComplete && !completedRowsRef.current.has(target.row)) {
          completedRowsRef.current.add(target.row);
          setCompletedRows(new Set(completedRowsRef.current));
          if (onRowComplete) {
            onRowComplete(target.row);
          }
        }

        return newPixels;
      });

      // Remove projectile
      setProjectiles(prev => prev.filter(p => p.id !== projectileId));

      // Unmark pixel as targeted
      targetedPixelsRef.current.delete(targetKey);
    }, PROJECTILE_DURATION);
  }, [artDimensions]);

  // Auto-fill from launchers (called on interval)
  const processAutoFill = useCallback(() => {
    if (gameState !== 'playing') return null;

    const currentPixels = pixelsRef.current;
    const allFillable = getFillablePixels(currentPixels);

    // Filter out pixels that already have projectiles flying to them
    const fillable = allFillable.filter(f =>
      !targetedPixelsRef.current.has(`${f.x}-${f.y}`)
    );

    // Check win condition
    if (allFillable.length === 0 && isGameWon(currentPixels)) {
      setGameState('won');
      setMessage('Complete! Your musical masterpiece is ready!');
      // Trigger win callback
      const { onWin } = audioCallbacksRef.current;
      if (onWin) {
        onWin();
      }
      return null;
    }

    if (fillable.length === 0) return null;

    // Try to fill from launchers
    let shotInfo = null;

    setLaunchers(prevLaunchers => {
      const newLaunchers = [...prevLaunchers];
      let filled = false;

      for (let i = 0; i < newLaunchers.length && !filled; i++) {
        const launcher = newLaunchers[i];
        if (!launcher || launcher.count <= 0) continue;

        // Find matching fillable pixel
        const matchIdx = fillable.findIndex(f => f.color === launcher.color);
        if (matchIdx === -1) continue;

        const target = fillable[matchIdx];

        // Shoot projectile instead of immediately filling
        shootProjectile(i, target, launcher.color);

        // Store shot info for return
        shotInfo = { launcherIndex: i, target, color: launcher.color };

        // Update launcher
        if (launcher.count <= 1) {
          newLaunchers[i] = null;
        } else {
          newLaunchers[i] = { ...launcher, count: launcher.count - 1 };
        }

        filled = true;
      }

      // Check stuck condition - only when ALL launchers are full and none match
      if (!filled && projectiles.length === 0 && allFillable.length > 0) {
        const activeLaunchers = newLaunchers.filter(l => l !== null);

        // Only stuck if ALL 5 launchers are full and none match
        if (activeLaunchers.length === 5) {
          const hasMatchingColor = activeLaunchers.some(l =>
            allFillable.some(f => f.color === l.color)
          );

          if (!hasMatchingColor) {
            setTimeout(() => {
              setGameState('lost');
              setMessage('Stuck! No matching colors. Try again.');
            }, 100);
          }
        }
      }

      return newLaunchers;
    });

    return shotInfo;
  }, [gameState, shootProjectile, projectiles.length]);

  // Play notes for a row (returns note info for visualization)
  const playRowNotes = useCallback((row) => {
    const rowPixels = pixelsRef.current.filter(p => p.row === row && p.filled);
    const notes = rowPixels.map(pixel => ({
      x: pixel.x,
      y: pixel.y,
      color: pixel.color,
    }));

    setActiveNotes(notes);
    setTimeout(() => setActiveNotes([]), 100);

    return notes;
  }, []);

  // Get current fillable pixels
  const fillable = getFillablePixels(pixels);

  // Calculate progress
  const progress = calculateProgress(pixels);

  // Get max row
  const maxRow = pixels.length > 0
    ? Math.max(...pixels.map(p => p.row))
    : 0;

  return {
    // State
    gameState,
    level,
    pixels,
    queues,
    launchers,
    projectiles,
    message,
    artDimensions,
    pixelSize,
    activeNotes,
    fillable,
    progress,
    maxRow,
    completedRows,

    // Setters
    setGameState,
    setMessage,
    setAudioCallbacks,

    // Actions
    initLevel,
    startGame,
    handleQueueTap,
    processAutoFill,
    playRowNotes,
  };
};

export default useGameState;
