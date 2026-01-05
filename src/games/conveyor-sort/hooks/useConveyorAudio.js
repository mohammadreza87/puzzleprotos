/**
 * Audio hook for Conveyor Sort game
 * Maps colors to musical notes for a melodic experience
 */

import { useCallback, useRef, useState } from 'react';

// Musical scale - Pentatonic for pleasant sounds
const COLOR_NOTES = {
  red: { frequency: 523.25, instrument: 'marimba' },    // C5
  blue: { frequency: 587.33, instrument: 'bell' },      // D5
  green: { frequency: 659.25, instrument: 'celesta' },  // E5
  yellow: { frequency: 783.99, instrument: 'chime' },   // G5
  purple: { frequency: 880.00, instrument: 'strings' }, // A5
  orange: { frequency: 987.77, instrument: 'marimba' }, // B5
  pink: { frequency: 1046.50, instrument: 'celesta' },  // C6
  cyan: { frequency: 1174.66, instrument: 'bell' },     // D6
};

// Success chord frequencies (major chord)
const SUCCESS_CHORD = [523.25, 659.25, 783.99, 1046.50]; // C major

// Failure sound
const FAIL_FREQ = 130.81; // Low C

export const useConveyorAudio = () => {
  const audioCtxRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Initialize audio context
  const initAudio = useCallback(async () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();

      if (audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
      }

      setIsReady(true);
      return true;
    } catch (e) {
      console.error('Audio init failed:', e);
      return false;
    }
  }, []);

  // Generic instrument player
  const playNote = useCallback((frequency, instrument = 'marimba', duration = 0.3, volume = 0.15) => {
    if (!audioCtxRef.current || isMuted) return;

    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    try {
      switch (instrument) {
        case 'marimba': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = 'sine';
          osc.frequency.value = frequency;

          filter.type = 'lowpass';
          filter.frequency.value = frequency * 4;
          filter.Q.value = 2;

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(volume, now + 0.005);
          gain.gain.exponentialRampToValueAtTime(0.01, now + duration * 0.7);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + duration);
          break;
        }

        case 'bell': {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const osc3 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = 'sine';
          osc1.frequency.value = frequency;
          osc2.type = 'sine';
          osc2.frequency.value = frequency * 2.4;
          osc3.type = 'sine';
          osc3.frequency.value = frequency * 5.95;

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(volume * 0.8, now + 0.002);
          gain.gain.exponentialRampToValueAtTime(0.01, now + duration * 1.5);

          osc1.connect(gain);
          osc2.connect(gain);
          osc3.connect(gain);
          gain.connect(ctx.destination);

          osc1.start(now);
          osc2.start(now);
          osc3.start(now);
          osc1.stop(now + duration * 1.5);
          osc2.stop(now + duration * 1.5);
          osc3.stop(now + duration * 1.5);
          break;
        }

        case 'celesta': {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = 'sine';
          osc1.frequency.value = frequency;
          osc2.type = 'triangle';
          osc2.frequency.value = frequency * 3;

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(volume, now + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.01, now + duration * 1.2);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + duration * 1.2);
          osc2.stop(now + duration * 1.2);
          break;
        }

        case 'chime': {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = 'sine';
          osc1.frequency.value = frequency;
          osc2.type = 'sine';
          osc2.frequency.value = frequency * 2.76;

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(volume * 0.7, now + 0.001);
          gain.gain.exponentialRampToValueAtTime(0.01, now + duration * 2);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + duration * 2);
          osc2.stop(now + duration * 2);
          break;
        }

        case 'strings': {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = 'sawtooth';
          osc1.frequency.value = frequency;
          osc2.type = 'sawtooth';
          osc2.frequency.value = frequency * 0.998;

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(volume * 0.5, now + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + duration + 0.1);
          osc2.stop(now + duration + 0.1);
          break;
        }

        default: {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.value = frequency;

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(volume, now + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + duration + 0.1);
        }
      }
    } catch (e) {
      // Silently fail
    }
  }, [isMuted]);

  // Play sound for a specific color
  const playColorSound = useCallback((color) => {
    const note = COLOR_NOTES[color];
    if (note) {
      playNote(note.frequency, note.instrument, 0.4, 0.12);
    }
  }, [playNote]);

  // Play when cube is picked from placement (slightly lower pitch)
  const playPickSound = useCallback((color) => {
    const note = COLOR_NOTES[color];
    if (note) {
      playNote(note.frequency * 0.5, 'marimba', 0.2, 0.1);
    }
  }, [playNote]);

  // Play when cube lands in placement
  const playPlaceSound = useCallback((color) => {
    const note = COLOR_NOTES[color];
    if (note) {
      playNote(note.frequency, note.instrument, 0.3, 0.15);
    }
  }, [playNote]);

  // Play when cube enters belt from stack
  const playBeltSound = useCallback(() => {
    playNote(392, 'marimba', 0.15, 0.08); // G4 - soft click
  }, [playNote]);

  // Play layer completion sound (arpeggio)
  const playLayerComplete = useCallback((color) => {
    const baseNote = COLOR_NOTES[color];
    const baseFreq = baseNote ? baseNote.frequency : 523.25;

    // Play ascending arpeggio
    [0, 100, 200, 300].forEach((delay, i) => {
      setTimeout(() => {
        playNote(baseFreq * Math.pow(1.25, i), 'celesta', 0.4, 0.12);
      }, delay);
    });
  }, [playNote]);

  // Play win sound (major chord fanfare)
  const playWinSound = useCallback(() => {
    // First chord
    SUCCESS_CHORD.forEach((freq, i) => {
      setTimeout(() => {
        playNote(freq, 'bell', 0.8, 0.1);
      }, i * 80);
    });

    // Second chord higher
    setTimeout(() => {
      SUCCESS_CHORD.forEach((freq, i) => {
        setTimeout(() => {
          playNote(freq * 1.5, 'celesta', 1.0, 0.12);
        }, i * 60);
      });
    }, 400);
  }, [playNote]);

  // Play lose sound
  const playLoseSound = useCallback(() => {
    // Descending sad notes
    [FAIL_FREQ * 2, FAIL_FREQ * 1.5, FAIL_FREQ].forEach((freq, i) => {
      setTimeout(() => {
        playNote(freq, 'strings', 0.5, 0.1);
      }, i * 200);
    });
  }, [playNote]);

  // Play click feedback
  const playClick = useCallback(() => {
    playNote(800, 'marimba', 0.1, 0.05);
  }, [playNote]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return {
    isReady,
    isMuted,
    initAudio,
    toggleMute,
    playColorSound,
    playPickSound,
    playPlaceSound,
    playBeltSound,
    playLayerComplete,
    playWinSound,
    playLoseSound,
    playClick,
  };
};

export default useConveyorAudio;
