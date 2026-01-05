import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for game loop management
 * Handles BPM-based playhead, beat counting, and timing
 */
export const useGameLoop = ({
  bpm = 120,
  isPlaying = false,
  maxRow = 0,
  onBeat,
  onPlayheadMove,
}) => {
  const [playheadRow, setPlayheadRow] = useState(0);
  const [beatCount, setBeatCount] = useState(0);
  const intervalRef = useRef(null);

  // Calculate milliseconds per beat
  const msPerBeat = 60000 / bpm;
  const msPerHalfBeat = msPerBeat / 2;

  // Start/stop the game loop
  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      // Update beat count
      setBeatCount(prev => {
        const newBeat = prev + 1;
        const beatInMeasure = newBeat % 4;

        // Trigger beat callback
        if (onBeat) {
          onBeat(beatInMeasure, newBeat);
        }

        return newBeat;
      });

      // Update playhead
      setPlayheadRow(prev => {
        const nextRow = maxRow > 0 ? (prev + 1) % (maxRow + 1) : 0;

        // Trigger playhead move callback
        if (onPlayheadMove) {
          onPlayheadMove(nextRow);
        }

        return nextRow;
      });
    }, msPerHalfBeat);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, msPerHalfBeat, maxRow, onBeat, onPlayheadMove]);

  // Reset playhead
  const resetPlayhead = useCallback(() => {
    setPlayheadRow(0);
    setBeatCount(0);
  }, []);

  return {
    playheadRow,
    beatCount,
    resetPlayhead,
    setPlayheadRow,
  };
};

export default useGameLoop;
