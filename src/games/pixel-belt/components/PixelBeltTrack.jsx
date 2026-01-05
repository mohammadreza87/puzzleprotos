/**
 * PixelBeltTrack - Rectangular conveyor belt around the pixel grid
 * Uses CSS animations for performance instead of state-driven animations
 */

import { memo, useMemo } from 'react';
import { colors } from '../../../shared/styles/theme';

export const PixelBeltTrack = memo(({
  beltPath,
  gridWidth,
  gridHeight,
  pixelSize,
  padding = 30,
}) => {
  if (!beltPath || beltPath.length === 0) return null;

  const gridPixelWidth = gridWidth * pixelSize;
  const gridPixelHeight = gridHeight * pixelSize;
  const offsetX = padding;
  const offsetY = padding;

  // Memoize SVG path calculation
  const svgPath = useMemo(() => {
    if (beltPath.length < 2) return '';
    const start = beltPath[0];
    let path = `M ${start.x + offsetX} ${start.y + offsetY}`;
    for (let i = 1; i < beltPath.length; i++) {
      path += ` L ${beltPath[i].x + offsetX} ${beltPath[i].y + offsetY}`;
    }
    path += ' Z';
    return path;
  }, [beltPath, offsetX, offsetY]);

  // Calculate path length for CSS animation
  const pathLength = useMemo(() => {
    let len = 0;
    for (let i = 0; i < beltPath.length; i++) {
      const next = beltPath[(i + 1) % beltPath.length];
      const curr = beltPath[i];
      len += Math.sqrt((next.x - curr.x) ** 2 + (next.y - curr.y) ** 2);
    }
    return len;
  }, [beltPath]);

  return (
    <svg
      width={gridPixelWidth + padding * 2}
      height={gridPixelHeight + padding * 2}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
      }}
    >
      <defs>
        <style>
          {`
            @keyframes dashMove {
              to { stroke-dashoffset: -24; }
            }
          `}
        </style>
      </defs>

      {/* Belt track - outer shadow */}
      <path
        d={svgPath}
        fill="none"
        stroke="rgba(0,0,0,0.4)"
        strokeWidth="36"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Belt track - main */}
      <path
        d={svgPath}
        fill="none"
        stroke={colors.primary[700]}
        strokeWidth="30"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Belt track - inner highlight */}
      <path
        d={svgPath}
        fill="none"
        stroke={colors.primary[600]}
        strokeWidth="22"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Belt track - animated groove with CSS animation */}
      <path
        d={svgPath}
        fill="none"
        stroke={colors.primary[800]}
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="8 4"
        style={{
          animation: 'dashMove 0.5s linear infinite',
        }}
      />
    </svg>
  );
});

export default PixelBeltTrack;
