import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Components
import { Scene3D } from './components/Scene3D';
import { ColorPalette } from './components/ColorPalette';
import { ModelSelector } from './components/ModelSelector';

// State
import { useColoringStore } from './hooks/useColoringState';
import { MODELS } from './data/models';

// Shared
import { colors, shadows } from '../../shared/styles/theme';
import { springTransition, buttonVariants } from '../../shared/styles/animations';

/**
 * 3D Coloring Game Component
 */
export const Coloring3DGame = () => {
  const navigate = useNavigate();
  const {
    currentModel,
    gameState,
    setCurrentModel,
    resetGame,
    getProgress,
    completedRegions,
    totalRegions,
  } = useColoringStore();

  // Initialize with first model on mount
  useEffect(() => {
    const model = MODELS[currentModel] || MODELS.swampIsland;
    // For full GLB models, regions are populated dynamically
    setCurrentModel(model.id, model.regions?.length || 0);
  }, []);

  const progress = getProgress();

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
          background: `linear-gradient(135deg, ${colors.neon.mint}, ${colors.neon.azure}, ${colors.neon.lavender})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        3D Coloring
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
        Tap regions to color them with the selected color
      </motion.p>

      {/* Model Selector */}
      <div style={{ marginBottom: 12 }}>
        <ModelSelector />
      </div>

      {/* 3D Scene */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          width: '100%',
          maxWidth: 400,
          height: 300,
          borderRadius: 12,
          overflow: 'hidden',
          background: colors.glass.medium,
          border: `1px solid ${colors.glass.border}`,
          marginBottom: 16,
        }}
      >
        <Scene3D />
      </motion.div>

      {/* Color Palette */}
      <ColorPalette />

      {/* Progress Bar */}
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          marginTop: 16,
        }}
      >
        <div
          style={{
            height: 8,
            backgroundColor: '#1a1414',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <motion.div
            style={{
              height: '100%',
              background: `linear-gradient(90deg, ${colors.neon.mint}, ${colors.neon.azure})`,
              borderRadius: 4,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div
          style={{
            textAlign: 'center',
            marginTop: 6,
            fontSize: '0.75rem',
            fontWeight: 600,
            color: colors.primary[300],
          }}
        >
          {completedRegions.size} / {totalRegions} regions
        </div>
      </div>

      {/* Win Overlay */}
      <AnimatePresence>
        {gameState === 'won' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(8px)',
              zIndex: 100,
            }}
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              style={{
                fontSize: '3rem',
                marginBottom: 16,
              }}
            >
              🎨
            </motion.div>
            <motion.h2
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                marginBottom: 8,
                background: `linear-gradient(135deg, ${colors.neon.mint}, ${colors.neon.azure})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Complete!
            </motion.h2>
            <p
              style={{
                fontSize: '1rem',
                color: colors.primary[300],
                marginBottom: 24,
              }}
            >
              You colored the entire model!
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <motion.button
                onClick={resetGame}
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                transition={springTransition}
                style={{
                  padding: '12px 24px',
                  borderRadius: 8,
                  border: `1px solid ${colors.neon.azure}60`,
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#fff',
                  background: `linear-gradient(135deg, ${colors.neon.azure}40, ${colors.neon.lavender}40)`,
                  boxShadow: shadows.glow.sm(colors.neon.azure),
                }}
              >
                Play Again
              </motion.button>
              <motion.button
                onClick={() => navigate('/')}
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                transition={springTransition}
                style={{
                  padding: '12px 24px',
                  borderRadius: 8,
                  border: `1px solid ${colors.glass.border}`,
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: colors.primary[200],
                  background: colors.glass.light,
                }}
              >
                Home
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Coloring3DGame;
