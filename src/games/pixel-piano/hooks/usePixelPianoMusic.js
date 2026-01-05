/**
 * Musical Engine for Pixel Piano
 *
 * Similar to Block Sort:
 * - Each pixel fills = play a note
 * - Each row complete = add that row's phrase to the loop
 * - All complete = victory lap with full melody
 */

import { useCallback, useRef, useState, useEffect } from 'react';

// Note frequencies
const NOTE_FREQ = {
  'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00,
  'A3': 220.00, 'B3': 246.94,
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00,
  'G#4': 415.30, 'A4': 440.00, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99,
  'A5': 880.00, 'B5': 987.77,
  'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51,
};

// Complete melody - 24 beats
const COMPLETE_MELODY = [
  { note: 'E5', beat: 0, duration: 1 },
  { note: 'E5', beat: 1, duration: 0.5 },
  { note: 'F5', beat: 1.5, duration: 0.5 },
  { note: 'E5', beat: 2, duration: 1 },
  { note: 'D5', beat: 3, duration: 1 },
  { note: 'C5', beat: 4, duration: 0.5 },
  { note: 'D5', beat: 4.5, duration: 0.5 },
  { note: 'E5', beat: 5, duration: 1 },
  { note: 'D5', beat: 6, duration: 1 },
  { note: 'D5', beat: 7, duration: 0.5 },
  { note: 'E5', beat: 7.5, duration: 0.5 },
  { note: 'D5', beat: 8, duration: 1 },
  { note: 'C5', beat: 9, duration: 1 },
  { note: 'B4', beat: 10, duration: 0.5 },
  { note: 'C5', beat: 10.5, duration: 0.5 },
  { note: 'A4', beat: 11, duration: 1 },
  { note: 'E5', beat: 12, duration: 0.5 },
  { note: 'G5', beat: 12.5, duration: 0.5 },
  { note: 'A5', beat: 13, duration: 1 },
  { note: 'G5', beat: 14, duration: 1 },
  { note: 'F5', beat: 15, duration: 0.5 },
  { note: 'E5', beat: 15.5, duration: 0.5 },
  { note: 'D5', beat: 16, duration: 1 },
  { note: 'E5', beat: 17, duration: 1 },
  { note: 'D5', beat: 18, duration: 0.5 },
  { note: 'C5', beat: 18.5, duration: 0.5 },
  { note: 'B4', beat: 19, duration: 1 },
  { note: 'A4', beat: 20, duration: 1 },
  { note: 'C5', beat: 21, duration: 0.5 },
  { note: 'B4', beat: 21.5, duration: 0.5 },
  { note: 'A4', beat: 22, duration: 2 },
];

const TOTAL_BEATS = 24;

// Bass line
const COMPLETE_BASS = [
  'A3', 'A3', 'A3', 'D3', 'D3', 'D3',
  'G3', 'G3', 'G3', 'C3', 'C3', 'C3',
  'F3', 'F3', 'F3', 'E3', 'E3', 'E3',
  'E3', 'E3', 'E3', 'A3', 'A3', 'A3',
];

// Chords
const COMPLETE_CHORDS = [
  ['E4', 'A4', 'C5'],
  ['F4', 'A4', 'D5'],
  ['G4', 'B4', 'D5'],
  ['C4', 'E4', 'G4'],
  ['F4', 'A4', 'C5'],
  ['E4', 'G#4', 'B4'],
  ['E4', 'G#4', 'B4'],
  ['E4', 'A4', 'C5'],
];

const getFrequency = (noteName) => NOTE_FREQ[noteName] || 440;

const getBeatsPerRow = (totalRows) => TOTAL_BEATS / totalRows;

const getRowMelody = (rowIndex, totalRows) => {
  const beatsPerRow = getBeatsPerRow(totalRows);
  const rowStartBeat = rowIndex * beatsPerRow;
  const rowEndBeat = rowStartBeat + beatsPerRow;

  return COMPLETE_MELODY
    .filter(note => note.beat >= rowStartBeat && note.beat < rowEndBeat)
    .map(note => ({
      ...note,
      beat: note.beat - rowStartBeat,
    }));
};

export const usePixelPianoMusic = () => {
  const audioCtxRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Music loop state
  const loopIntervalRef = useRef(null);
  const isPlayingRef = useRef(false);
  const currentPositionRef = useRef(0);
  const currentBeatRef = useRef(0);
  const totalRowsRef = useRef(8);
  const completedRowsRef = useRef(new Set());
  const [completedRows, setCompletedRows] = useState(new Set());
  const onLoopCompleteRef = useRef(null);
  const tempoRef = useRef(120);

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

  // Play a piano note
  const playNote = useCallback((frequency, duration = 0.3, volume = 0.12, type = 'melody') => {
    if (!audioCtxRef.current || isMuted) return;

    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    try {
      const harmonics = [
        { ratio: 1, amp: 1.0, decay: 1.0 },
        { ratio: 2, amp: 0.5, decay: 0.8 },
        { ratio: 3, amp: 0.25, decay: 0.6 },
        { ratio: 4, amp: 0.15, decay: 0.5 },
        { ratio: 5, amp: 0.08, decay: 0.4 },
        { ratio: 6, amp: 0.04, decay: 0.3 },
      ];

      let attackTime = 0.005;
      let decayTime = duration * 1.5;
      let baseVolume = volume;

      if (type === 'bass') {
        baseVolume = volume * 1.2;
        decayTime = duration * 2;
      } else if (type === 'chord') {
        baseVolume = volume * 0.4;
        decayTime = duration * 0.8;
      }

      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = Math.min(frequency * 8, 8000);
      filter.Q.value = 0.5;
      filter.connect(masterGain);

      harmonics.forEach(({ ratio, amp, decay }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = frequency * ratio;

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

      // Hammer noise for melody
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

  // Play chord
  const playChord = useCallback((noteNames, duration = 0.3, volume = 0.06) => {
    noteNames.forEach((noteName, i) => {
      const freq = getFrequency(noteName);
      setTimeout(() => {
        playNote(freq, duration, volume * (1 - i * 0.1), 'chord');
      }, i * 8);
    });
  }, [playNote]);

  // Play note for pixel position
  const playPixelNote = useCallback((x, y, totalWidth, totalHeight) => {
    if (isMuted) return;

    // Map x position to note (higher x = higher pitch)
    const noteIndex = Math.floor((x / totalWidth) * 12);
    const baseNotes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5'];
    const note = baseNotes[noteIndex % baseNotes.length];

    // Map y position to volume (top = louder)
    const volume = 0.1 + (1 - y / totalHeight) * 0.08;

    playNote(getFrequency(note), 0.2, volume, 'melody');
  }, [playNote, isMuted]);

  // Play row melody if completed
  const playRowIfCompleted = useCallback((position, msPerBeat) => {
    if (!completedRowsRef.current.has(position)) return;

    const totalRows = totalRowsRef.current;
    const melody = getRowMelody(position, totalRows);

    melody.forEach(({ note, beat, duration }) => {
      const freq = getFrequency(note);
      const delayMs = beat * msPerBeat;
      const durationSec = duration * msPerBeat / 1000;

      setTimeout(() => {
        playNote(freq, durationSec, 0.18, 'melody');
      }, delayMs);
    });
  }, [playNote]);

  // Process one beat
  const processBeat = useCallback(() => {
    if (isMuted) return;

    const position = currentPositionRef.current;
    const beat = currentBeatRef.current;
    const msPerBeat = 60000 / tempoRef.current;
    const duration = msPerBeat / 1000 * 0.8;
    const total = totalRowsRef.current;
    const beatsPerRow = getBeatsPerRow(total);

    // Bass on first beat
    if (beat === 0) {
      const beatIndex = Math.floor(position * beatsPerRow);
      const bassNote = COMPLETE_BASS[beatIndex % COMPLETE_BASS.length];
      playNote(getFrequency(bassNote), duration, 0.12, 'bass');
      playRowIfCompleted(position, msPerBeat);
    } else {
      // Chord on other beats
      const beatIndex = Math.floor(position * beatsPerRow);
      const chordIndex = Math.floor(beatIndex / 3);
      const chordNotes = COMPLETE_CHORDS[chordIndex % COMPLETE_CHORDS.length];
      playChord(chordNotes, duration * 0.6, 0.05);
    }

    // Advance
    const nextBeat = beat + 1;
    if (nextBeat >= beatsPerRow) {
      currentBeatRef.current = 0;
      const nextPosition = (position + 1) % total;
      currentPositionRef.current = nextPosition;

      if (nextPosition === 0 && onLoopCompleteRef.current) {
        onLoopCompleteRef.current();
      }
    } else {
      currentBeatRef.current = nextBeat;
    }
  }, [isMuted, playNote, playChord, playRowIfCompleted]);

  // Start music loop
  const startMusicLoop = useCallback(() => {
    if (isPlayingRef.current) return;

    isPlayingRef.current = true;
    currentPositionRef.current = 0;
    currentBeatRef.current = 0;

    const msPerBeat = 60000 / tempoRef.current;

    loopIntervalRef.current = setInterval(() => {
      processBeat();
    }, msPerBeat);
  }, [processBeat]);

  // Stop music loop
  const stopMusicLoop = useCallback(() => {
    isPlayingRef.current = false;
    if (loopIntervalRef.current) {
      clearInterval(loopIntervalRef.current);
      loopIntervalRef.current = null;
    }
    currentPositionRef.current = 0;
    currentBeatRef.current = 0;
  }, []);

  // Set total rows (phrases)
  const setTotalRows = useCallback((count) => {
    totalRowsRef.current = Math.max(1, Math.min(count, 24));
  }, []);

  // Mark row as completed
  const markRowCompleted = useCallback((rowIndex) => {
    completedRowsRef.current.add(rowIndex);
    setCompletedRows(new Set(completedRowsRef.current));

    // Play celebration arpeggio
    if (!isMuted) {
      const notes = ['C5', 'E5', 'G5'];
      notes.forEach((note, i) => {
        setTimeout(() => {
          playNote(getFrequency(note), 0.15, 0.12, 'melody');
        }, i * 60);
      });
    }
  }, [playNote, isMuted]);

  // Reset
  const resetCompletedRows = useCallback(() => {
    completedRowsRef.current = new Set();
    setCompletedRows(new Set());
  }, []);

  // Set loop complete callback
  const setOnLoopComplete = useCallback((callback) => {
    onLoopCompleteRef.current = callback;
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      if (!prev) stopMusicLoop();
      return !prev;
    });
  }, [stopMusicLoop]);

  // Cleanup
  useEffect(() => () => stopMusicLoop(), [stopMusicLoop]);

  return {
    isReady,
    isMuted,
    completedRows,
    initAudio,
    toggleMute,
    startMusicLoop,
    stopMusicLoop,
    setTotalRows,
    markRowCompleted,
    resetCompletedRows,
    setOnLoopComplete,
    playPixelNote,
    playNote,
  };
};

export default usePixelPianoMusic;
