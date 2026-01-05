/**
 * ConveyorSortGame - Main game component
 * Now with tempo-synchronized musical gameplay!
 */

import { useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import {
  ConveyorTrack,
  PlacementBox,
  InputStack,
  BeltCube,
  LevelSelect,
  GameOverlay,
  CompletionAnimation,
} from './components';

import { useConveyorGameState } from './hooks/useConveyorGameState';
import { useMusicalEngine, LEVEL_TEMPOS } from './hooks/useMusicalEngine';
import { LEVELS } from './data/levels';
import { colors, shadows } from '../../shared/styles/theme';
import { springTransition, buttonVariants } from '../../shared/styles/animations';

export const ConveyorSortGame = () => {
  const navigate = useNavigate();

  const {
    gameState,
    currentLevel,
    placements,
    cubesOnBelt,
    inputStack,
    conveyorHeight,
    pathPoints,
    arrowOffset,
    completionAnimations,
    beatCount,
    stepCount,
    getLevelConfig,
    getInputGatePos,
    getTotalRemainingLayers,
    initLevel,
    showMenu,
    tick,
    releaseCubeFromStack,
    handleCubeClick,
    checkWinLose,
    onVictoryLapComplete,
    nextLevel,
    retryLevel,
    setAudioCallbacks,
  } = useConveyorGameState();

  const {
    isReady: audioReady,
    isMuted,
    currentTempo,
    completedBoxes,
    initAudio,
    toggleMute,
    setLevelTempo,
    setPlacementCountForLevel,
    getBeltSpeed,
    startMusicLoop,
    stopMusicLoop,
    resetCompletedBoxes,
    setOnLoopComplete,
    playPickSound,
    playPlaceSound,
    playBoxMelody,
    playWinFanfare,
    playLoseSound,
    playClick,
  } = useMusicalEngine();

  const gameLoopRef = useRef(null);

  const levelConfig = getLevelConfig();
  const inputGatePos = getInputGatePos();
  const gameAreaHeight = conveyorHeight + 140;

  // Register musical callbacks with game state
  useEffect(() => {
    setAudioCallbacks({
      onCubePick: (color, count) => {
        // Play note when picking cubes
        playPickSound(color);
      },
      onCubePlace: (color, boxIndex) => {
        // Play harmony when cube lands in box
        playPlaceSound(color);
      },
      onBeltRelease: (color) => {
        // Quick note when cube enters belt
        playPickSound(color);
      },
      onLayerComplete: (color, boxIndex) => {
        // Play box's unique melodic phrase when layer completes!
        playBoxMelody(color, boxIndex);
      },
      onVictoryLap: () => {
        // Victory lap started - music keeps playing, set up loop complete callback
        setOnLoopComplete(() => {
          onVictoryLapComplete();
        });
      },
      onWin: () => {
        // Keep music playing - no fanfare, just the completed song looping
        setOnLoopComplete(null); // Clear the callback
      },
      onLose: () => {
        stopMusicLoop();
        playLoseSound();
      },
      onBeat: () => {}, // Accompaniment provides rhythm now
    });
  }, [setAudioCallbacks, playPickSound, playPlaceSound, playBoxMelody, playWinFanfare, playLoseSound, stopMusicLoop, setOnLoopComplete, onVictoryLapComplete]);

  // Start/stop music loop based on game state (keep playing during victory lap and won)
  useEffect(() => {
    if ((gameState === 'playing' || gameState === 'victory_lap' || gameState === 'won') && audioReady && !isMuted) {
      startMusicLoop();
    } else if (gameState !== 'victory_lap' && gameState !== 'won') {
      stopMusicLoop();
    }
  }, [gameState, audioReady, isMuted, startMusicLoop, stopMusicLoop]);

  // Initialize audio on first user interaction
  const handleFirstInteraction = useCallback(async () => {
    if (!audioReady) {
      await initAudio();
    }
  }, [audioReady, initAudio]);

  // Handle level selection with audio init and tempo setup
  const handleSelectLevel = useCallback(async (levelIndex) => {
    await handleFirstInteraction();
    playClick();
    setLevelTempo(levelIndex); // Set tempo for this level
    setPlacementCountForLevel(LEVELS[levelIndex].placements); // Set melody parts
    resetCompletedBoxes(); // Start fresh
    initLevel(levelIndex);
  }, [handleFirstInteraction, playClick, setLevelTempo, setPlacementCountForLevel, resetCompletedBoxes, initLevel]);

  // Main game loop - tempo synchronized (keep running during victory lap and won for visual)
  useEffect(() => {
    if (gameState !== 'playing' && gameState !== 'victory_lap' && gameState !== 'won') return;

    // Get belt speed from musical engine (based on tempo)
    const beltSpeed = getBeltSpeed();

    // Clear any existing loop
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }

    // Tempo-synced game loop: tick() handles beat counting and metronome
    gameLoopRef.current = setInterval(() => {
      tick();
    }, beltSpeed);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameState, getBeltSpeed, tick]);

  // Release cubes from stack
  useEffect(() => {
    if (gameState !== 'playing') return;
    releaseCubeFromStack();
  }, [cubesOnBelt, inputStack, gameState, releaseCubeFromStack]);

  // Check win/lose
  useEffect(() => {
    if (gameState !== 'playing') return;
    checkWinLose();
  }, [placements, cubesOnBelt, inputStack, gameState, checkWinLose]);

  // Show level select
  if (gameState === 'menu') {
    return <LevelSelect onSelectLevel={handleSelectLevel} />;
  }

  return (
    <div
      onClick={handleFirstInteraction}
      style={{
        minHeight: '100vh',
        background: `linear-gradient(180deg, ${colors.primary[900]} 0%, ${colors.primary[800]} 100%)`,
        padding: 15,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 10,
          width: '100%',
          maxWidth: 400,
          justifyContent: 'space-between',
        }}
      >
        <motion.button
          variants={buttonVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
          onClick={() => {
            playClick();
            navigate('/');
          }}
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: `1px solid ${colors.glass.border}`,
            background: colors.glass.light,
            backdropFilter: 'blur(8px)',
            color: colors.primary[200],
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          ← Home
        </motion.button>

        <div
          style={{
            background: colors.glass.medium,
            backdropFilter: 'blur(12px)',
            padding: '6px 14px',
            borderRadius: 20,
            border: `1px solid ${colors.glass.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ color: colors.primary[400], fontSize: 11 }}>
            Lv.{levelConfig.id}
          </span>
          <span
            style={{
              color: colors.primary[100],
              fontWeight: 'bold',
              fontSize: 13,
            }}
          >
            {levelConfig.name}
          </span>
          {levelConfig.depth > 1 && (
            <span
              style={{
                backgroundColor: `${colors.neon.lavender}30`,
                color: colors.neon.lavender,
                padding: '2px 6px',
                borderRadius: 6,
                fontSize: 10,
              }}
            >
              {getTotalRemainingLayers()}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {/* Mute Button */}
          <motion.button
            variants={buttonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            onClick={() => {
              toggleMute();
            }}
            style={{
              padding: '8px 10px',
              borderRadius: 8,
              border: `1px solid ${isMuted ? colors.neon.coral + '40' : colors.neon.mint + '40'}`,
              background: isMuted ? `${colors.neon.coral}20` : `${colors.neon.mint}20`,
              color: isMuted ? colors.neon.coral : colors.neon.mint,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            {isMuted ? '🔇' : '🔊'}
          </motion.button>

          {/* Retry Button */}
          <motion.button
            variants={buttonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            onClick={() => {
              playClick();
              setLevelTempo(currentLevel);
              resetCompletedBoxes(); // Reset melody parts
              retryLevel();
            }}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: `1px solid ${colors.neon.azure}40`,
              background: `${colors.neon.azure}20`,
              color: colors.neon.azure,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ↻
          </motion.button>
        </div>
      </div>

      {/* Tempo/BPM Display with Waltz Beat Indicator (3/4 time) */}
      <motion.div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              color: colors.primary[400],
              fontSize: 11,
              fontWeight: 500,
            }}
          >
            {currentTempo} BPM
          </span>
          {/* 3/4 waltz beat indicator */}
          <div style={{ display: 'flex', gap: 3 }}>
            {[0, 1, 2].map((beat) => (
              <motion.div
                key={beat}
                animate={{
                  scale: beatCount % 3 === beat ? 1.4 : 1,
                  backgroundColor:
                    beatCount % 3 === beat
                      ? beat === 0
                        ? colors.neon.coral
                        : colors.neon.mint
                      : colors.primary[700],
                }}
                transition={{ duration: 0.08 }}
                style={{
                  width: beat === 0 ? 10 : 7,
                  height: beat === 0 ? 10 : 7,
                  borderRadius: '50%',
                }}
              />
            ))}
          </div>
        </div>

        {/* Melody parts indicator - shows which boxes are looping */}
        {completedBoxes.size > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: colors.neon.mint, fontSize: 10 }}>
              ♪ {completedBoxes.size}/{levelConfig.placements}
            </span>
          </div>
        )}
      </motion.div>

      {/* Game Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: '1.25rem',
          fontWeight: 900,
          marginBottom: 8,
          background: `linear-gradient(135deg, ${colors.neon.coral}, ${colors.neon.orange})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Block Sort
      </motion.h1>

      {/* Game Area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          position: 'relative',
          width: 400,
          height: gameAreaHeight,
          background: colors.glass.medium,
          backdropFilter: 'blur(12px)',
          border: `1px solid ${colors.glass.border}`,
          borderRadius: 20,
        }}
      >
        {/* Conveyor Track */}
        <ConveyorTrack
          pathPoints={pathPoints}
          arrowOffset={arrowOffset}
          inputGatePos={inputGatePos}
          height={gameAreaHeight}
        />

        {/* Placement Boxes */}
        {placements.map(p => (
          <PlacementBox
            key={p.id}
            placement={p}
            cubesPerPlacement={levelConfig.cubesPerPlacement}
            onCubeClick={handleCubeClick}
          />
        ))}

        {/* Completion Animations */}
        <AnimatePresence>
          {completionAnimations.map(anim => (
            <CompletionAnimation key={anim.id} animation={anim} />
          ))}
        </AnimatePresence>

        {/* Input Stack */}
        <InputStack
          stack={inputStack}
          stackCapacity={levelConfig.stackCapacity}
          inputGatePos={inputGatePos}
          gameAreaHeight={gameAreaHeight}
        />

        {/* Belt Counter */}
        <div
          style={{
            position: 'absolute',
            left: inputGatePos.x + 30,
            top: inputGatePos.y - 10,
            backgroundColor:
              cubesOnBelt.length >= levelConfig.beltCapacity
                ? colors.neon.coral
                : colors.primary[700],
            padding: '4px 10px',
            borderRadius: 10,
            color: colors.primary[100],
            fontSize: 11,
            fontWeight: 'bold',
            zIndex: 25,
          }}
        >
          Belt: {cubesOnBelt.length}/{levelConfig.beltCapacity}
        </div>

        {/* Cubes on Belt */}
        <AnimatePresence>
          {cubesOnBelt.map(cube => (
            <BeltCube
              key={cube.id}
              cube={cube}
              position={pathPoints[cube.pathIndex]}
            />
          ))}
        </AnimatePresence>

        {/* Victory Lap Indicator */}
        <AnimatePresence>
          {gameState === 'victory_lap' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                style={{
                  fontSize: 48,
                }}
              >
                🎵
              </motion.div>
              <div
                style={{
                  background: `${colors.neon.mint}20`,
                  backdropFilter: 'blur(8px)',
                  border: `2px solid ${colors.neon.mint}`,
                  borderRadius: 12,
                  padding: '8px 16px',
                  color: colors.neon.mint,
                  fontWeight: 'bold',
                  fontSize: 14,
                }}
              >
                Playing complete song...
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Win/Lose Overlay */}
        <AnimatePresence>
          {(gameState === 'won' || gameState === 'lost') && (
            <GameOverlay
              gameState={gameState}
              hasNextLevel={currentLevel < LEVELS.length - 1}
              onRetry={() => {
                playClick();
                setLevelTempo(currentLevel);
                resetCompletedBoxes();
                retryLevel();
              }}
              onNextLevel={() => {
                playClick();
                const nextLevelIdx = currentLevel + 1;
                setLevelTempo(nextLevelIdx);
                setPlacementCountForLevel(LEVELS[nextLevelIdx].placements);
                resetCompletedBoxes();
                nextLevel();
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Level Select Button */}
      <motion.button
        variants={buttonVariants}
        initial="idle"
        whileHover="hover"
        whileTap="tap"
        onClick={() => {
          playClick();
          showMenu();
        }}
        style={{
          marginTop: 16,
          padding: '10px 20px',
          borderRadius: 10,
          border: `1px solid ${colors.glass.border}`,
          background: colors.glass.light,
          backdropFilter: 'blur(8px)',
          color: colors.primary[300],
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Change Level
      </motion.button>
    </div>
  );
};

export default ConveyorSortGame;
