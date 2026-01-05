/**
 * PixelBeltGame - Main game component
 *
 * Mechanics:
 * - Tap queue to send blob (with multiple shots) onto belt
 * - Up to 5 blobs active (belt + slots combined)
 * - Blob travels: bottom-left → right → top → left → back
 * - Blob auto-shoots 1 matching pixel per position
 * - When shots = 0, blob vanishes with sparkle animation
 * - When loop completes with shots remaining, blob goes to slot
 * - Lose: 5 slots full when blob completes loop
 */

import { useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { usePixelBeltState } from './hooks/usePixelBeltState';
import { usePixelPianoMusic } from '../pixel-piano/hooks/usePixelPianoMusic';
import {
  BeltPixelGrid,
  PixelBeltTrack,
  BeltBlob,
  VanishingBlob,
  BlobInventory,
} from './components';
import { LEVELS } from './data/levels';

import { colors, shadows } from '../../shared/styles/theme';
import { springTransition, buttonVariants } from '../../shared/styles/animations';

export const PixelBeltGame = () => {
  const navigate = useNavigate();

  // Game state
  const {
    gameState,
    currentLevel,
    pixels,
    gridWidth,
    gridHeight,
    pixelSize,
    beltPath,
    blobsOnBelt,
    queues,
    launcherSlots,
    vanishingBlobs,
    projectiles,
    initLevel,
    showMenu,
    handleQueueTap,
    handleSlotTap,
    tick,
    nextLevel,
    retryLevel,
    setAudioCallbacks,
  } = usePixelBeltState();

  // Music
  const {
    isReady: audioReady,
    initAudio,
    playPixelNote,
    startMusicLoop,
    stopMusicLoop,
    resetCompletedRows,
  } = usePixelPianoMusic();

  const tickIntervalRef = useRef(null);

  // Set up audio callbacks
  useEffect(() => {
    setAudioCallbacks({
      onPixelFill: (x, y, width, height) => {
        playPixelNote(x, y, width, height);
      },
      onWin: () => {
        // Victory - keep music playing
      },
    });
  }, [setAudioCallbacks, playPixelNote]);

  // Store tick in ref to avoid re-creating interval
  const tickRef = useRef(tick);
  tickRef.current = tick;

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
      return;
    }

    const level = LEVELS[currentLevel % LEVELS.length];
    tickIntervalRef.current = setInterval(() => tickRef.current(), level.beltSpeed);

    return () => {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
    };
  }, [gameState, currentLevel]);

  // Start/stop music
  useEffect(() => {
    if (gameState === 'playing' && audioReady) {
      startMusicLoop();
    } else if (gameState === 'menu' || gameState === 'lost') {
      stopMusicLoop();
      resetCompletedRows();
    }
  }, [gameState, audioReady, startMusicLoop, stopMusicLoop, resetCompletedRows]);

  // Handle start
  const handleStart = async () => {
    const success = await initAudio();
    if (success) {
      initLevel(0);
    }
  };

  // Handle level select
  const handleLevelSelect = useCallback((lvl) => {
    stopMusicLoop();
    resetCompletedRows();
    initLevel(lvl);
  }, [initLevel, stopMusicLoop, resetCompletedRows]);

  // Handle replay
  const handleReplay = useCallback(() => {
    stopMusicLoop();
    resetCompletedRows();
    retryLevel();
  }, [retryLevel, stopMusicLoop, resetCompletedRows]);

  // Handle next
  const handleNext = useCallback(() => {
    stopMusicLoop();
    resetCompletedRows();
    nextLevel();
  }, [nextLevel, stopMusicLoop, resetCompletedRows]);

  const level = LEVELS[currentLevel % LEVELS.length];
  const gridPixelWidth = gridWidth * pixelSize;
  const gridPixelHeight = gridHeight * pixelSize;
  const padding = 30;

  // Calculate progress
  const filledCount = pixels.filter(p => p.filled).length;
  const totalCount = pixels.length;
  const progress = totalCount > 0 ? Math.round((filledCount / totalCount) * 100) : 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        background: `linear-gradient(180deg, ${colors.primary[900]} 0%, ${colors.primary[800]} 50%, ${colors.primary[900]} 100%)`,
        padding: 16,
        color: '#fff',
      }}
    >
      {/* Back Button */}
      <motion.button
        onClick={() => navigate('/')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          padding: '8px 16px',
          borderRadius: 8,
          border: `1px solid ${colors.glass.border}`,
          background: colors.glass.light,
          backdropFilter: 'blur(8px)',
          color: colors.primary[200],
          fontSize: '0.75rem',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Back
      </motion.button>

      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: '1.5rem',
          fontWeight: 900,
          marginBottom: 4,
          background: `linear-gradient(135deg, ${colors.neon.mint}, ${colors.neon.azure})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Pixel Belt
      </motion.h1>

      {/* Level info */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          fontSize: '0.75rem',
          color: colors.primary[400],
          marginBottom: 12,
        }}
      >
        {gameState === 'menu' ? 'Tap to start' : `${level.name} - ${progress}%`}
      </motion.p>

      {/* Menu Screen */}
      <AnimatePresence mode="wait">
        {gameState === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 24,
              background: colors.glass.medium,
              borderRadius: 16,
              border: `1px solid ${colors.glass.border}`,
            }}
          >
            <p style={{ fontSize: '1rem', marginBottom: 8, color: colors.primary[100] }}>
              Fill pixels from outside to inside!
            </p>
            <p style={{ fontSize: '0.75rem', marginBottom: 16, color: colors.primary[400], textAlign: 'center' }}>
              Tap queues to send blobs around the belt.
              <br />
              They auto-shoot 1 matching pixel at a time!
            </p>

            <motion.button
              onClick={handleStart}
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
              style={{
                padding: '16px 32px',
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 700,
                color: '#fff',
                background: `linear-gradient(135deg, ${colors.neon.mint}, ${colors.neon.azure})`,
                boxShadow: shadows.glow.md(colors.neon.mint),
              }}
            >
              Start Game
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Area */}
      {gameState !== 'menu' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          {/* Progress bar */}
          <div
            style={{
              width: gridPixelWidth + padding * 2,
              height: 6,
              background: colors.primary[700],
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              style={{
                height: '100%',
                background: `linear-gradient(90deg, ${colors.neon.mint}, ${colors.neon.azure}, ${colors.neon.lavender})`,
                borderRadius: 3,
              }}
            />
          </div>

          {/* Grid with belt */}
          <div
            style={{
              position: 'relative',
              width: gridPixelWidth + padding * 2,
              height: gridPixelHeight + padding * 2,
            }}
          >
            {/* Belt track */}
            <PixelBeltTrack
              beltPath={beltPath}
              gridWidth={gridWidth}
              gridHeight={gridHeight}
              pixelSize={pixelSize}
              padding={padding}
            />

            {/* Pixel grid */}
            <div
              style={{
                position: 'absolute',
                left: padding,
                top: padding,
              }}
            >
              <BeltPixelGrid
                pixels={pixels}
                gridWidth={gridWidth}
                gridHeight={gridHeight}
                pixelSize={pixelSize}
                projectiles={projectiles}
              />
            </div>

            {/* Blobs on belt */}
            {blobsOnBelt.map(blob => {
              const position = beltPath[blob.pathIndex];
              return (
                <BeltBlob
                  key={blob.id}
                  blob={blob}
                  position={position}
                  padding={padding}
                />
              );
            })}

            {/* Vanishing blobs (sparkle animation) */}
            {vanishingBlobs.map(blob => (
              <VanishingBlob
                key={`vanish-${blob.id}`}
                blob={blob}
                padding={padding}
              />
            ))}
          </div>

          {/* Inventory */}
          <BlobInventory
            queues={queues}
            launcherSlots={launcherSlots}
            blobsOnBelt={blobsOnBelt}
            onQueueTap={handleQueueTap}
            onSlotTap={handleSlotTap}
            disabled={gameState !== 'playing'}
          />
        </motion.div>
      )}

      {/* Win/Lose Overlay */}
      <AnimatePresence>
        {(gameState === 'won' || gameState === 'lost') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              marginTop: 16,
            }}
          >
            <p style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: gameState === 'won' ? colors.neon.mint : colors.neon.coral,
            }}>
              {gameState === 'won' ? 'Complete!' : 'Slots Full!'}
            </p>

            <div style={{ display: 'flex', gap: 12 }}>
              <motion.button
                onClick={handleReplay}
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: `1px solid ${colors.neon.azure}60`,
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#fff',
                  background: colors.glass.medium,
                  backdropFilter: 'blur(8px)',
                }}
              >
                Replay
              </motion.button>

              {gameState === 'won' && currentLevel < LEVELS.length - 1 && (
                <motion.button
                  onClick={handleNext}
                  variants={buttonVariants}
                  initial="idle"
                  whileHover="hover"
                  whileTap="tap"
                  style={{
                    padding: '10px 20px',
                    borderRadius: 8,
                    border: `1px solid ${colors.neon.mint}60`,
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#fff',
                    background: `linear-gradient(135deg, ${colors.neon.mint}40, ${colors.neon.azure}40)`,
                    boxShadow: shadows.glow.sm(colors.neon.mint),
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  Next Level
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level selector */}
      {gameState !== 'menu' && (
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginTop: 16,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {LEVELS.map((lvl, i) => (
            <motion.button
              key={lvl.id}
              onClick={() => handleLevelSelect(i)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: i === currentLevel
                  ? `2px solid ${colors.neon.mint}`
                  : `1px solid ${colors.primary[600]}`,
                background: i === currentLevel
                  ? colors.neon.mint + '40'
                  : colors.primary[800],
                color: colors.primary[100],
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {i + 1}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PixelBeltGame;
