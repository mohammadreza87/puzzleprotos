/**
 * ConveyorTrack - SVG conveyor belt with animated arrows
 */

import { useMemo } from 'react';
import { colors } from '../../../shared/styles/theme';

const NUM_ARROWS = 8;

export const ConveyorTrack = ({
  pathPoints,
  arrowOffset,
  inputGatePos,
  height,
}) => {
  // Generate SVG path string
  const trackPath = useMemo(() => {
    if (pathPoints.length === 0) return '';
    let d = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
    for (let i = 1; i < pathPoints.length; i++) {
      d += ` L ${pathPoints[i].x} ${pathPoints[i].y}`;
    }
    d += ' Z';
    return d;
  }, [pathPoints]);

  // Calculate arrow positions
  const arrows = useMemo(() => {
    const result = [];
    const totalLength = pathPoints.length;

    for (let i = 0; i < NUM_ARROWS; i++) {
      const baseIndex = Math.floor((i / NUM_ARROWS) * totalLength);
      const currentIndex = (baseIndex + arrowOffset) % totalLength;
      const nextIndex = (currentIndex + 3) % totalLength;

      const point = pathPoints[currentIndex];
      const nextPoint = pathPoints[nextIndex];
      if (!point || !nextPoint) continue;

      const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180 / Math.PI;
      result.push({ x: point.x, y: point.y, angle });
    }
    return result;
  }, [pathPoints, arrowOffset]);

  return (
    <svg
      width="400"
      height={height}
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      {/* Track layers for depth effect */}
      <path
        d={trackPath}
        fill="none"
        stroke={colors.primary[600]}
        strokeWidth="44"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={trackPath}
        fill="none"
        stroke={colors.primary[500]}
        strokeWidth="38"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={trackPath}
        fill="none"
        stroke={colors.primary[400]}
        strokeWidth="30"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Animated arrows */}
      {arrows.map((arrow, i) => (
        <g
          key={i}
          transform={`translate(${arrow.x}, ${arrow.y}) rotate(${arrow.angle})`}
        >
          <polygon
            points="-6,-5 6,0 -6,5"
            fill={colors.primary[300]}
            opacity="0.7"
          />
        </g>
      ))}

      {/* Input gate */}
      <rect
        x={inputGatePos.x - 22}
        y={inputGatePos.y - 22}
        width="44"
        height="44"
        rx="8"
        fill={colors.primary[700]}
        stroke={colors.primary[600]}
        strokeWidth="3"
      />
      <rect
        x={inputGatePos.x - 12}
        y={inputGatePos.y + 5}
        width="24"
        height="4"
        rx="2"
        fill={colors.neon.mint}
      />
      <text
        x={inputGatePos.x}
        y={inputGatePos.y}
        textAnchor="middle"
        fill={colors.primary[400]}
        fontSize="10"
        fontWeight="bold"
      >
        IN
      </text>
    </svg>
  );
};

export default ConveyorTrack;
