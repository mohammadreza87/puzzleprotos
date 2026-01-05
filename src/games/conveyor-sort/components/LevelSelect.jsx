/**
 * LevelSelect - Level selection screen
 * Shows tempo/BPM for each level
 */

import { motion } from 'framer-motion';
import { LEVELS } from '../data/levels';
import { LEVEL_TEMPOS } from '../hooks/useMusicalEngine';
import { colors, shadows } from '../../../shared/styles/theme';
import { springTransition, buttonVariants } from '../../../shared/styles/animations';

const getDifficultyColor = (index) => {
  if (index < 2) return colors.neon.mint;
  if (index < 4) return colors.neon.orange;
  return colors.neon.coral;
};

export const LevelSelect = ({ onSelectLevel }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(180deg, ${colors.primary[900]} 0%, ${colors.primary[800]} 100%)`,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: '2rem',
          fontWeight: 900,
          marginBottom: 10,
          background: `linear-gradient(135deg, ${colors.neon.coral}, ${colors.neon.orange})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Block Sort
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{
          color: colors.primary[400],
          fontSize: 14,
          marginBottom: 30,
        }}
      >
        Select a level to play
      </motion.p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 15,
          maxWidth: 400,
          width: '100%',
        }}
      >
        {LEVELS.map((level, index) => (
          <motion.button
            key={level.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, ...springTransition }}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => onSelectLevel(index)}
            style={{
              padding: '20px 15px',
              borderRadius: 16,
              border: `1px solid ${colors.glass.border}`,
              background: colors.glass.medium,
              backdropFilter: 'blur(12px)',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  backgroundColor: getDifficultyColor(index),
                  color: 'white',
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 'bold',
                }}
              >
                {level.id}
              </span>
              <span
                style={{
                  color: colors.primary[100],
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
              >
                {level.name}
              </span>
            </div>

            <p
              style={{
                color: colors.primary[400],
                fontSize: 12,
                margin: 0,
              }}
            >
              {level.description}
            </p>

            <div
              style={{
                display: 'flex',
                gap: 8,
                marginTop: 10,
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  backgroundColor: `${colors.neon.coral}30`,
                  color: colors.neon.coral,
                  padding: '2px 8px',
                  borderRadius: 6,
                  fontSize: 10,
                  fontWeight: 600,
                }}
              >
                {LEVEL_TEMPOS[index]} BPM
              </span>
              <span
                style={{
                  backgroundColor: `${colors.neon.azure}30`,
                  color: colors.neon.azure,
                  padding: '2px 8px',
                  borderRadius: 6,
                  fontSize: 10,
                }}
              >
                {level.colors} colors
              </span>
              <span
                style={{
                  backgroundColor: `${colors.neon.orange}30`,
                  color: colors.neon.orange,
                  padding: '2px 8px',
                  borderRadius: 6,
                  fontSize: 10,
                }}
              >
                {level.placements} boxes
              </span>
              <span
                style={{
                  backgroundColor: `${colors.neon.lavender}30`,
                  color: colors.neon.lavender,
                  padding: '2px 8px',
                  borderRadius: 6,
                  fontSize: 10,
                }}
              >
                {level.depth} {level.depth > 1 ? 'layers' : 'layer'}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default LevelSelect;
