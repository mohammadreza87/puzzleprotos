/**
 * PlacementBox - Individual placement box with layers
 */

import { motion } from 'framer-motion';
import { GAME_COLORS } from '../data/colors';
import { colors, shadows } from '../../../shared/styles/theme';

export const PlacementBox = ({
  placement,
  cubesPerPlacement,
  onCubeClick,
}) => {
  const activeLayerIdx = placement.currentLayerIndex;
  const activeLayer = activeLayerIdx >= 0 ? placement.layers[activeLayerIdx] : null;
  const layersBelow = activeLayerIdx;
  const totalLayers = placement.layers.length;

  // Completed placement
  if (!activeLayer) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          position: 'absolute',
          left: placement.x - 38,
          top: placement.y - 38,
          width: 76,
          height: 76,
          backgroundColor: `${colors.neon.mint}20`,
          border: `4px dashed ${colors.neon.mint}`,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 15,
        }}
      >
        <span style={{ fontSize: 32 }}>✓</span>
      </motion.div>
    );
  }

  const isComplete =
    activeLayer.cubes.length === cubesPerPlacement &&
    activeLayer.cubes.every(c => c.color === activeLayer.targetColor);

  const targetColor = GAME_COLORS[activeLayer.targetColor];

  return (
    <div
      style={{
        position: 'absolute',
        left: placement.x - 38,
        top: placement.y - 38,
      }}
    >
      {/* Render layers below (stacked effect) */}
      {Array.from({ length: layersBelow }).map((_, idx) => {
        const layer = placement.layers[idx];
        const offset = (layersBelow - idx) * 4;
        const layerColor = GAME_COLORS[layer.targetColor];

        return (
          <div
            key={`layer-${idx}`}
            style={{
              position: 'absolute',
              left: offset,
              top: offset,
              width: 76,
              height: 76,
              backgroundColor: `${layerColor}44`,
              border: `3px solid ${layerColor}88`,
              borderRadius: 12,
              zIndex: 10 + idx,
            }}
          />
        );
      })}

      {/* Main active layer */}
      <motion.div
        animate={{
          boxShadow: isComplete
            ? shadows.glow.md(targetColor)
            : '0 4px 8px rgba(0,0,0,0.3)',
        }}
        style={{
          position: 'relative',
          width: 76,
          height: 76,
          backgroundColor: `${targetColor}33`,
          border: `4px solid ${targetColor}`,
          borderRadius: 12,
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          gap: 3,
          padding: 5,
          zIndex: 15 + layersBelow,
        }}
      >
        {[0, 1, 2, 3].map(i => {
          const cube = activeLayer.cubes[i];

          if (!cube) {
            return (
              <div
                key={`empty-${i}`}
                style={{
                  backgroundColor: `${targetColor}22`,
                  borderRadius: 5,
                  border: `2px dashed ${targetColor}66`,
                }}
              />
            );
          }

          const isCorrect = cube.color === activeLayer.targetColor;
          const cubeColor = GAME_COLORS[cube.color];
          // Can pick up any cube unless the layer is fully complete
          const canPickUp = !isComplete;

          return (
            <motion.div
              key={cube.id}
              onClick={() => canPickUp && onCubeClick(placement.id, cube.color)}
              whileHover={canPickUp ? { scale: 1.1 } : {}}
              whileTap={canPickUp ? { scale: 0.95 } : {}}
              style={{
                backgroundColor: cubeColor,
                borderRadius: 5,
                cursor: canPickUp ? 'pointer' : 'default',
                boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.2)',
                border: isCorrect
                  ? '2px solid rgba(255,255,255,0.5)'
                  : '2px solid rgba(255,255,255,0.3)',
              }}
            />
          );
        })}

        {/* Depth indicator badge */}
        {totalLayers > 1 && (
          <div
            style={{
              position: 'absolute',
              top: -10,
              right: -10,
              backgroundColor: colors.neon.azure,
              color: 'white',
              width: 22,
              height: 22,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              border: '2px solid white',
            }}
          >
            {layersBelow + 1}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PlacementBox;
