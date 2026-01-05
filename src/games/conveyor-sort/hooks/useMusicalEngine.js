/**
 * Musical Engine for Conveyor Sort
 *
 * SIMPLE LOOP:
 * - N placements = N positions in the loop
 * - 4 boxes = loop: 0 → 1 → 2 → 3 → 0 → 1 → 2 → 3...
 * - 6 boxes = loop: 0 → 1 → 2 → 3 → 4 → 5 → 0...
 *
 * Each position = 1 measure = 3 beats (waltz 3/4 time)
 * Accompaniment always plays (oom-pah-pah)
 * When a box is completed, its melody plays at that position!
 */

import { useCallback, useRef, useState, useEffect } from 'react';
import {
  getPhraseMelody,
  getBassForPosition,
  getChordForPosition,
  getFrequency,
  getBeatsPerPhrase,
} from '../data/melodies';

// Tempo per level (BPM)
export const LEVEL_TEMPOS = [
  100, 110, 120, 130, 140, 150,
];

// Belt speed per level (ms per step)
export const LEVEL_BELT_SPEEDS = [
  50, 45, 42, 38, 35, 32,
];

export const useMusicalEngine = () => {
  const audioCtxRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTempo, setCurrentTempo] = useState(120);
  const [currentBeltSpeed, setCurrentBeltSpeed] = useState(42);

  // Music loop state
  const loopIntervalRef = useRef(null);
  const isPlayingRef = useRef(false);

  // Position tracking
  const currentPositionRef = useRef(0);  // Which phrase position (0 to N-1)
  const currentBeatRef = useRef(0);       // Beat within measure (0, 1, 2)
  const placementCountRef = useRef(4);    // Number of placements = loop length

  // Completed boxes
  const completedBoxesRef = useRef(new Set());
  const [completedBoxes, setCompletedBoxes] = useState(new Set());

  // Victory lap callback
  const onLoopCompleteRef = useRef(null);

  const getMsPerBeat = useCallback(() => {
    return 60000 / currentTempo;
  }, [currentTempo]);

  const getBeltSpeed = useCallback(() => {
    return currentBeltSpeed;
  }, [currentBeltSpeed]);

  // Initialize audio
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

  // Set tempo for level
  const setLevelTempo = useCallback((levelIndex) => {
    const tempo = LEVEL_TEMPOS[levelIndex] || 120;
    const beltSpeed = LEVEL_BELT_SPEEDS[levelIndex] || 42;
    setCurrentTempo(tempo);
    setCurrentBeltSpeed(beltSpeed);
    completedBoxesRef.current = new Set();
    setCompletedBoxes(new Set());
    return beltSpeed;
  }, []);

  // Set number of placements (= loop length)
  const setPlacementCountForLevel = useCallback((count) => {
    placementCountRef.current = count;
  }, []);

  /**
   * Play a piano-like note
   * Piano sound: quick attack, long decay, rich harmonics that decay at different rates
   */
  const playNote = useCallback((frequency, duration = 0.3, volume = 0.12, type = 'melody') => {
    if (!audioCtxRef.current || isMuted) return;

    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    try {
      // Piano has multiple harmonics with different amplitudes and decay rates
      const harmonics = [
        { ratio: 1, amp: 1.0, decay: 1.0 },      // Fundamental
        { ratio: 2, amp: 0.5, decay: 0.8 },      // 2nd harmonic
        { ratio: 3, amp: 0.25, decay: 0.6 },     // 3rd harmonic
        { ratio: 4, amp: 0.15, decay: 0.5 },     // 4th harmonic
        { ratio: 5, amp: 0.08, decay: 0.4 },     // 5th harmonic
        { ratio: 6, amp: 0.04, decay: 0.3 },     // 6th harmonic
      ];

      // Adjust parameters based on note type
      let attackTime = 0.005;  // Very quick attack (piano hammer)
      let decayTime = duration * 1.5;
      let baseVolume = volume;

      if (type === 'bass') {
        baseVolume = volume * 1.2;
        decayTime = duration * 2;
      } else if (type === 'chord') {
        baseVolume = volume * 0.4;
        decayTime = duration * 0.8;
      }

      // Create master gain for this note
      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);

      // Soft lowpass filter to smooth the sound
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = Math.min(frequency * 8, 8000);
      filter.Q.value = 0.5;
      filter.connect(masterGain);

      // Create oscillators for each harmonic
      harmonics.forEach(({ ratio, amp, decay }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = frequency * ratio;

        // Piano envelope: quick attack, exponential decay
        const harmonicVolume = baseVolume * amp;
        const harmonicDecay = decayTime * decay;

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(harmonicVolume, now + attackTime);
        gain.gain.exponentialRampToValueAtTime(harmonicVolume * 0.3, now + harmonicDecay * 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + harmonicDecay);

        osc.connect(gain);
        gain.connect(filter);

        osc.start(now);
        osc.stop(now + harmonicDecay + 0.1);
      });

      // Add a subtle "hammer" noise for attack
      if (type === 'melody') {
        const noiseGain = ctx.createGain();
        const noiseFilter = ctx.createBiquadFilter();
        const bufferSize = ctx.sampleRate * 0.02;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const noiseData = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          noiseData[i] = (Math.random() * 2 - 1) * 0.3;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.value = frequency * 2;
        noiseFilter.Q.value = 2;

        noiseGain.gain.setValueAtTime(baseVolume * 0.15, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);

        noise.start(now);
        noise.stop(now + 0.05);
      }
    } catch (e) {}
  }, [isMuted]);

  /**
   * Play chord
   */
  const playChord = useCallback((noteNames, duration = 0.3, volume = 0.06) => {
    noteNames.forEach((noteName, i) => {
      const freq = getFrequency(noteName);
      setTimeout(() => {
        playNote(freq, duration, volume * (1 - i * 0.1), 'chord');
      }, i * 8);
    });
  }, [playNote]);

  /**
   * Play melody for a phrase position (if that box is completed)
   */
  const playPhraseIfCompleted = useCallback((position, msPerBeat) => {
    if (!completedBoxesRef.current.has(position)) return;

    const totalPlacements = placementCountRef.current;
    const melody = getPhraseMelody(position, totalPlacements);
    melody.forEach(({ note, beat, duration }) => {
      const freq = getFrequency(note);
      const delayMs = beat * msPerBeat;
      const durationSec = duration * msPerBeat / 1000;

      setTimeout(() => {
        playNote(freq, durationSec, 0.18, 'melody');
      }, delayMs);
    });
  }, [playNote]);

  /**
   * Process one beat of the loop
   * Now handles dynamic beats per phrase based on placement count
   */
  const processBeat = useCallback(() => {
    if (isMuted) return;

    const position = currentPositionRef.current;
    const beat = currentBeatRef.current;
    const msPerBeat = 60000 / currentTempo;
    const duration = msPerBeat / 1000 * 0.8;
    const total = placementCountRef.current;
    const beatsPerPhrase = getBeatsPerPhrase(total);

    // Accompaniment pattern based on beat within phrase
    // Beat 0 = bass + melody, other beats = chord (waltz style)
    if (beat === 0) {
      // Bass on first beat of phrase
      const bassNote = getBassForPosition(position, total);
      playNote(getFrequency(bassNote), duration, 0.12, 'bass');

      // Trigger melody for this position if completed
      playPhraseIfCompleted(position, msPerBeat);
    } else {
      // Chord on other beats
      const chordNotes = getChordForPosition(position, total);
      playChord(chordNotes, duration * 0.6, 0.05);
    }

    // Advance beat within phrase
    const nextBeat = beat + 1;

    // Check if we finished this phrase
    if (nextBeat >= beatsPerPhrase) {
      currentBeatRef.current = 0;
      const nextPosition = (position + 1) % total;
      currentPositionRef.current = nextPosition;

      // If we just wrapped back to position 0, a full loop completed
      if (nextPosition === 0 && onLoopCompleteRef.current) {
        onLoopCompleteRef.current();
      }
    } else {
      currentBeatRef.current = nextBeat;
    }
  }, [isMuted, currentTempo, playNote, playChord, playPhraseIfCompleted]);

  /**
   * Start music loop
   */
  const startMusicLoop = useCallback(() => {
    if (isPlayingRef.current) return;

    isPlayingRef.current = true;
    currentPositionRef.current = 0;
    currentBeatRef.current = 0;

    const msPerBeat = 60000 / currentTempo;

    loopIntervalRef.current = setInterval(() => {
      processBeat();
    }, msPerBeat);
  }, [currentTempo, processBeat]);

  /**
   * Stop music loop
   */
  const stopMusicLoop = useCallback(() => {
    isPlayingRef.current = false;
    if (loopIntervalRef.current) {
      clearInterval(loopIntervalRef.current);
      loopIntervalRef.current = null;
    }
    currentPositionRef.current = 0;
    currentBeatRef.current = 0;
  }, []);

  /**
   * Mark box as completed - its phrase will now play in the loop!
   */
  const markBoxCompleted = useCallback((boxIndex) => {
    completedBoxesRef.current.add(boxIndex);
    setCompletedBoxes(new Set(completedBoxesRef.current));
  }, []);

  /**
   * Reset completed boxes
   */
  const resetCompletedBoxes = useCallback(() => {
    completedBoxesRef.current = new Set();
    setCompletedBoxes(new Set());
  }, []);

  /**
   * Set callback for when a full loop completes (for victory lap)
   */
  const setOnLoopComplete = useCallback((callback) => {
    onLoopCompleteRef.current = callback;
  }, []);

  // Sound effects
  const playPickSound = useCallback((color) => {
    if (isMuted) return;
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan'];
    const notes = ['A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5'];
    const idx = colors.indexOf(color);
    playNote(getFrequency(notes[idx] || 'E5'), 0.1, 0.08, 'melody');
  }, [playNote, isMuted]);

  const playPlaceSound = useCallback((color) => {
    if (isMuted) return;
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan'];
    const notes = ['A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5'];
    const idx = colors.indexOf(color);
    const freq = getFrequency(notes[idx] || 'E5');
    playNote(freq, 0.2, 0.1, 'melody');
    setTimeout(() => playNote(freq * 1.5, 0.15, 0.06, 'chord'), 20);
  }, [playNote, isMuted]);

  /**
   * Called when box completes - add to loop!
   */
  const playBoxMelody = useCallback((color, boxIndex) => {
    markBoxCompleted(boxIndex);

    // Celebration flourish
    if (!isMuted) {
      const notes = ['C5', 'E5', 'G5'];
      notes.forEach((note, i) => {
        setTimeout(() => {
          playNote(getFrequency(note), 0.15, 0.12, 'melody');
        }, i * 60);
      });
    }
  }, [markBoxCompleted, playNote, isMuted]);

  const playWinFanfare = useCallback(() => {
    if (isMuted) return;
    const notes = ['A4', 'C5', 'E5', 'A5', 'C6', 'E6'];
    notes.forEach((note, i) => {
      setTimeout(() => playNote(getFrequency(note), 0.8, 0.15, 'melody'), i * 100);
    });
    setTimeout(() => playChord(['A4', 'C5', 'E5', 'A5'], 1.5, 0.1), 700);
  }, [playNote, playChord, isMuted]);

  const playLoseSound = useCallback(() => {
    if (isMuted) return;
    const notes = ['E5', 'D5', 'C5', 'B4', 'A4'];
    notes.forEach((note, i) => {
      setTimeout(() => playNote(getFrequency(note), 0.5, 0.1, 'melody'), i * 200);
    });
  }, [playNote, isMuted]);

  const playClick = useCallback(() => {
    if (isMuted) return;
    playNote(getFrequency('E5'), 0.08, 0.05, 'melody');
  }, [playNote, isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      if (!prev) stopMusicLoop();
      return !prev;
    });
  }, [stopMusicLoop]);

  useEffect(() => () => stopMusicLoop(), [stopMusicLoop]);

  return {
    isReady,
    isMuted,
    currentTempo,
    completedBoxes,
    initAudio,
    toggleMute,
    setLevelTempo,
    setPlacementCountForLevel,
    getBeltSpeed,
    getMsPerBeat,
    startMusicLoop,
    stopMusicLoop,
    markBoxCompleted,
    resetCompletedBoxes,
    setOnLoopComplete,
    playPickSound,
    playPlaceSound,
    playBoxMelody,
    playWinFanfare,
    playLoseSound,
    playClick,
  };
};

export default useMusicalEngine;
