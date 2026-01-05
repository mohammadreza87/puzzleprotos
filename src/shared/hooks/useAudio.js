import { useRef, useCallback, useState } from 'react';
import { Howl } from 'howler';

/**
 * Custom hook for audio management using Web Audio API
 * Provides instrument synthesis and drum sounds
 */
export const useAudio = () => {
  const audioCtxRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize audio context (must be called from user interaction)
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
      console.error('Audio initialization failed:', e);
      return false;
    }
  }, []);

  // Play an instrument note
  const playInstrument = useCallback((frequency, instrument, duration = 0.4) => {
    if (!audioCtxRef.current) return;

    try {
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;

      switch (instrument) {
        case 'piano': {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = 'triangle';
          osc1.frequency.value = frequency;
          osc2.type = 'sine';
          osc2.frequency.value = frequency * 2;

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.2, now + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.1, now + 0.1);
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
          gain.gain.linearRampToValueAtTime(0.25, now + 0.005);
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
          gain.gain.linearRampToValueAtTime(0.15, now + 0.002);
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

        case 'pad': {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc1.type = 'sawtooth';
          osc1.frequency.value = frequency;
          osc2.type = 'sawtooth';
          osc2.frequency.value = frequency * 1.005;

          filter.type = 'lowpass';
          filter.frequency.value = frequency * 3;

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.08, now + 0.1);
          gain.gain.linearRampToValueAtTime(0.06, now + duration * 0.8);
          gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

          osc1.connect(filter);
          osc2.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + duration + 0.1);
          osc2.stop(now + duration + 0.1);
          break;
        }

        case 'flute': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = 'sine';
          osc.frequency.value = frequency;

          filter.type = 'bandpass';
          filter.frequency.value = frequency;
          filter.Q.value = 5;

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
          gain.gain.linearRampToValueAtTime(0.1, now + duration * 0.7);
          gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + duration + 0.1);
          break;
        }

        case 'strings': {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          const gain = ctx.createGain();

          osc1.type = 'sawtooth';
          osc1.frequency.value = frequency;
          osc2.type = 'sawtooth';
          osc2.frequency.value = frequency * 0.998;

          lfo.type = 'sine';
          lfo.frequency.value = 5;
          lfoGain.gain.value = 3;

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.1, now + 0.08);
          gain.gain.linearRampToValueAtTime(0.08, now + duration * 0.8);
          gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

          lfo.connect(lfoGain);
          lfoGain.connect(osc1.frequency);
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);

          lfo.start(now);
          osc1.start(now);
          osc2.start(now);
          lfo.stop(now + duration + 0.1);
          osc1.stop(now + duration + 0.1);
          osc2.stop(now + duration + 0.1);
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
          gain.gain.linearRampToValueAtTime(0.12, now + 0.01);
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

        case 'bass': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = 'sine';
          osc.frequency.value = frequency;

          filter.type = 'lowpass';
          filter.frequency.value = 400;

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.3, now + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.01, now + duration * 0.8);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + duration);
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
          gain.gain.linearRampToValueAtTime(0.1, now + 0.001);
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

        default: {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.value = frequency;

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + duration + 0.1);
        }
      }
    } catch (e) {
      console.log('Instrument error:', e);
    }
  }, []);

  // Play kick drum
  const playKick = useCallback(() => {
    if (!audioCtxRef.current) return;

    try {
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);

      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  }, []);

  // Play hi-hat
  const playHihat = useCallback(() => {
    if (!audioCtxRef.current) return;

    try {
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;

      const bufferSize = ctx.sampleRate * 0.05;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
      }

      const noise = ctx.createBufferSource();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      noise.buffer = buffer;
      filter.type = 'highpass';
      filter.frequency.value = 7000;

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
    } catch (e) {}
  }, []);

  return {
    isReady,
    initAudio,
    playInstrument,
    playKick,
    playHihat,
  };
};

export default useAudio;
