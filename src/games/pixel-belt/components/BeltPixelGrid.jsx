/**
 * BeltPixelGrid - Pixel art grid with edge-based fillable visualization
 * Shows which pixels are currently shootable (outermost unfilled in each row/column)
 */

import { memo, useMemo } from 'react';
import { COLORS } from '../../../shared/data/colors';
import { colors } from '../../../shared/styles/theme';

// Memoized pixel component for performance
const Pixel = memo(({ pixel, pixelSize, isFillable }) => {
  const colorHex = COLORS[pixel.color] || '#888888';

  return (
    <div
      style={{
        position: 'absolute',
        left: pixel.x * pixelSize,
        top: pixel.y * pixelSize,
        width: pixelSize - 1,
        height: pixelSize - 1,
        borderRadius: 2,
        background: pixel.filled
          ? colorHex
          : `${colorHex}${isFillable ? '66' : '22'}`,
        border: isFillable
          ? `1px solid ${colors.neon.yellow}`
          : 'none',
        boxShadow: pixel.filled
          ? `0 0 ${pixelSize/2}px ${colorHex}88`
          : 'none',
        transition: 'background 0.15s, box-shadow 0.15s',
      }}
    />
  );
});

export const BeltPixelGrid = memo(({
  pixels,
  gridWidth,
  gridHeight,
  pixelSize,
  projectiles,
}) => {
  const gridPixelWidth = gridWidth * pixelSize;
  const gridPixelHeight = gridHeight * pixelSize;

  // Calculate which pixels are fillable (outermost unfilled in each row/column)
  const fillableIds = useMemo(() => {
    const ids = new Set();

    // For each column, find bottom-most and top-most unfilled pixels
    for (let col = 0; col < gridWidth; col++) {
      const colPixels = pixels.filter(p => p.x === col && !p.filled);
      if (colPixels.length > 0) {
        const bottomMost = colPixels.reduce((max, p) => p.y > max.y ? p : max);
        const topMost = colPixels.reduce((min, p) => p.y < min.y ? p : min);
        ids.add(bottomMost.id);
        ids.add(topMost.id);
      }
    }

    // For each row, find left-most and right-most unfilled pixels
    for (let row = 0; row < gridHeight; row++) {
      const rowPixels = pixels.filter(p => p.y === row && !p.filled);
      if (rowPixels.length > 0) {
        const rightMost = rowPixels.reduce((max, p) => p.x > max.x ? p : max);
        const leftMost = rowPixels.reduce((min, p) => p.x < min.x ? p : min);
        ids.add(rightMost.id);
        ids.add(leftMost.id);
      }
    }

    return ids;
  }, [pixels, gridWidth, gridHeight]);

  return (
    <div
      style={{
        position: 'relative',
        width: gridPixelWidth,
        height: gridPixelHeight,
        background: colors.primary[900],
        borderRadius: 4,
        overflow: 'hidden',
      }}
    >
      {/* Pixels */}
      {pixels.map(pixel => (
        <Pixel
          key={pixel.id}
          pixel={pixel}
          pixelSize={pixelSize}
          isFillable={fillableIds.has(pixel.id)}
        />
      ))}

      {/* Projectiles - simple CSS animation */}
      {projectiles.map(proj => {
        const colorHex = COLORS[proj.color] || '#888888';
        return (
          <div
            key={proj.id}
            style={{
              position: 'absolute',
              left: proj.toX - pixelSize / 2,
              top: proj.toY - pixelSize / 2,
              width: pixelSize * 1.5,
              height: pixelSize * 1.5,
              borderRadius: '50%',
              background: colorHex,
              boxShadow: `0 0 ${pixelSize}px ${colorHex}`,
              zIndex: 100,
              animation: 'pulse 0.2s ease-out',
            }}
          />
        );
      })}
    </div>
  );
});

export default BeltPixelGrid;
