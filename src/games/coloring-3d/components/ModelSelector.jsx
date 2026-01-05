import { motion } from 'framer-motion';
import { useColoringStore } from '../hooks/useColoringState';
import { MODEL_LIST } from '../data/models';
import { colors, shadows } from '../../../shared/styles/theme';
import { springTransition, buttonVariants } from '../../../shared/styles/animations';

/**
 * Model Selector for choosing which 3D model to color
 */
export const ModelSelector = () => {
  const { currentModel, setCurrentModel } = useColoringStore();

  const handleSelectModel = (model) => {
    // For full GLB models, total regions will be set dynamically after loading
    setCurrentModel(model.id, model.regions?.length || 0);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'center',
      }}
    >
      {MODEL_LIST.map((model) => {
        const isActive = currentModel === model.id;

        return (
          <motion.button
            key={model.id}
            onClick={() => handleSelectModel(model)}
            variants={buttonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            transition={springTransition}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: isActive
                ? `2px solid ${colors.neon.mint}`
                : `1px solid ${colors.glass.border}`,
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: isActive ? '#fff' : colors.primary[300],
              background: isActive
                ? `linear-gradient(135deg, ${colors.neon.mint}30, ${colors.neon.azure}30)`
                : colors.glass.light,
              boxShadow: isActive ? shadows.glow.sm(colors.neon.mint) : 'none',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span style={{ fontSize: '0.875rem' }}>{model.name}</span>
            <span
              style={{
                fontSize: '0.625rem',
                color: colors.primary[500],
              }}
            >
              {model.difficulty}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default ModelSelector;
