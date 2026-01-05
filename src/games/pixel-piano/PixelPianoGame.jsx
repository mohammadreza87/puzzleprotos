import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Shared Hooks
import { useGameLoop } from '../../shared/hooks/useGameLoop';

// Game-specific Hooks
import { useGameState } from './hooks/useGameState';
import { usePixelPianoMusic } from './hooks/usePixelPianoMusic';

// Game Components
import { PixelGrid } from './components/PixelGrid';
import { Launcher } from './components/Launcher';
import { ColorQueue } from './components/ColorQueue';
import { ControlPanel } from './components/ControlPanel';
import { LevelSelector } from './components/LevelSelector';
import { ColorLegend } from './components/ColorLegend';

// Shared Theme
import { colors, shadows } from '../../shared/styles/theme';
import { springTransition, buttonVariants } from '../../shared/styles/animations';

// Game Data
import { LEVELS } from './data/pixelArt';

/**
 * Pixel Piano Game Component
 */
export const PixelPianoGame = () => {
  const navigate = useNavigate();
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);

  // Music hook (like Block Sort)
  const {
    isReady: audioReady,
    isMuted,
    initAudio,
    toggleMute,
    startMusicLoop,
    stopMusicLoop,
    setTotalRows,
    markRowCompleted,
    resetCompletedRows,
    setOnLoopComplete,
    playPixelNote,
  } = usePixelPianoMusic();

  // Game state hook
  const {
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
    setGameState,
    setAudioCallbacks,
    initLevel,
    startGame,
    handleQueueTap,
    processAutoFill,
    playRowNotes,
  } = useGameState();

  // Auto-fill interval ref
  const autoFillIntervalRef = useRef(null);

  // Set up audio callbacks when hook is ready
  useEffect(() => {
    setAudioCallbacks({
      onPixelFill: (x, y, width, height) => {
        playPixelNote(x, y, width, height);
      },
      onRowComplete: (rowIndex) => {
        markRowCompleted(rowIndex);
      },
      onWin: () => {
        // Victory - music loop continues with all rows playing
      },
    });
  }, [setAudioCallbacks, playPixelNote, markRowCompleted]);

  // Set total rows when level changes
  useEffect(() => {
    if (maxRow > 0) {
      setTotalRows(maxRow + 1);
    }
  }, [maxRow, setTotalRows]);

  // Start/stop music loop based on game state
  useEffect(() => {
    if (gameState === 'playing' && audioReady) {
      startMusicLoop();
    } else if (gameState === 'waiting' || gameState === 'lost') {
      stopMusicLoop();
      resetCompletedRows();
    }
    // Keep playing on 'won' for victory lap
  }, [gameState, audioReady, startMusicLoop, stopMusicLoop, resetCompletedRows]);

  // Handle playhead move callback (for visual sync)
  const handlePlayheadMove = useCallback((row) => {
    playRowNotes(row);
  }, [playRowNotes]);

  // Game loop
  const { playheadRow, resetPlayhead } = useGameLoop({
    bpm,
    isPlaying: isPlaying && gameState === 'playing',
    maxRow,
    onPlayheadMove: handlePlayheadMove,
  });

  // Initialize first level on mount
  useEffect(() => {
    initLevel(0);
  }, [initLevel]);

  // Auto-fill interval
  useEffect(() => {
    if (gameState !== 'playing') {
      if (autoFillIntervalRef.current) {
        clearInterval(autoFillIntervalRef.current);
        autoFillIntervalRef.current = null;
      }
      return;
    }

    autoFillIntervalRef.current = setInterval(processAutoFill, 150);

    return () => {
      if (autoFillIntervalRef.current) {
        clearInterval(autoFillIntervalRef.current);
        autoFillIntervalRef.current = null;
      }
    };
  }, [gameState, processAutoFill]);

  // Start audio and game
  const handleStart = async () => {
    const success = await initAudio();
    if (success) {
      startGame();
      setIsPlaying(true);
    }
  };

  // Handle level select
  const handleLevelSelect = useCallback((lvl) => {
    stopMusicLoop();
    resetCompletedRows();
    initLevel(lvl);
    resetPlayhead();
    if (audioReady) {
      startGame();
      setIsPlaying(true);
    }
  }, [initLevel, resetPlayhead, audioReady, startGame, stopMusicLoop, resetCompletedRows]);

  // Handle replay
  const handleReplay = useCallback(() => {
    stopMusicLoop();
    resetCompletedRows();
    initLevel(level);
    resetPlayhead();
    startGame();
    setIsPlaying(true);
  }, [initLevel, level, resetPlayhead, startGame, stopMusicLoop, resetCompletedRows]);

  // Handle next level
  const handleNextLevel = useCallback(() => {
    stopMusicLoop();
    resetCompletedRows();
    initLevel(level + 1);
    resetPlayhead();
    startGame();
    setIsPlaying(true);
  }, [initLevel, level, resetPlayhead, startGame, stopMusicLoop, resetCompletedRows]);

  // Toggle play/pause
  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

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
          background: `linear-gradient(135deg, ${colors.neon.coral}, ${colors.neon.orange}, ${colors.neon.yellow})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: 'none',
        }}
      >
        Pixel Piano
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{
          fontSize: '0.75rem',
          color: colors.primary[300],
          marginBottom: 12,
        }}
      >
        {message}
      </motion.p>

      {/* Start Screen */}
      <AnimatePresence mode="wait">
        {gameState === 'waiting' && (
          <motion.div
            key="start-screen"
            className="glass-panel"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={springTransition}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
              marginBottom: 16,
            }}
          >
            <p
              style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                marginBottom: 8,
                color: colors.primary[100],
              }}
            >
              Ready to play?
            </p>
            <p
              style={{
                fontSize: '0.75rem',
                color: colors.primary[400],
                marginBottom: 16,
                textAlign: 'center',
                lineHeight: 1.5,
              }}
            >
              Each color = a note & instrument<br />
              Darker shades = lower pitch
            </p>

            <ColorLegend />

            <motion.button
              onClick={handleStart}
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
              transition={springTransition}
              style={{
                padding: '16px 32px',
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.125rem',
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

      {/* Controls */}
      {audioReady && (
        <ControlPanel
          isPlaying={isPlaying}
          bpm={bpm}
          onPlayPause={handlePlayPause}
          onBpmChange={setBpm}
        />
      )}

      {/* Game Area */}
      {gameState !== 'waiting' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Pixel Grid */}
          <div style={{ marginBottom: 12 }}>
            <PixelGrid
              pixels={pixels}
              pixelSize={pixelSize}
              artDimensions={artDimensions}
              playheadRow={playheadRow}
              fillable={fillable}
              activeNotes={activeNotes}
              progress={progress}
              projectiles={projectiles}
            />
          </div>

          {/* Launchers */}
          <Launcher launchers={launchers} />

          {/* Color Queues */}
          <div style={{ marginBottom: 12 }}>
            <ColorQueue
              queues={queues}
              onQueueTap={handleQueueTap}
              gameState={gameState}
            />
          </div>
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
              gap: 12,
              marginBottom: 16,
            }}
          >
            <motion.button
              onClick={handleReplay}
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
              transition={springTransition}
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                border: `1px solid ${colors.neon.azure}60`,
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#fff',
                background: `linear-gradient(135deg, ${colors.neon.azure}40, ${colors.neon.lavender}40)`,
                boxShadow: shadows.glow.sm(colors.neon.azure),
                backdropFilter: 'blur(8px)',
              }}
            >
              Replay
            </motion.button>
            {gameState === 'won' && (
              <motion.button
                onClick={handleNextLevel}
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                transition={springTransition}
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Selector */}
      <LevelSelector
        currentLevel={level}
        onLevelSelect={handleLevelSelect}
      />

      {/* Color Legend (during play) */}
      {audioReady && <ColorLegend compact />}
    </div>
  );
};

export default PixelPianoGame;
