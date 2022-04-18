import sound from './sound.mp3';
import { BPM_MAX, UNIVERSAL_MAX } from '../../constants';
import { loadSample } from './audioLoader';

const ONE_MINUTE = 60 * 1000;
const PLAYBACK_RATE_RANGE = [-2, 0, 2, 4, 6, 8];

export type Subscriber = (
  beatIndex: number | null,
  isValidMeasure: boolean
) => void;

export function createMetronome() {
  const audioContext = new window.AudioContext();
  const gainNode: GainNode = audioContext.createGain();
  gainNode.connect(audioContext.destination);

  let audioBuffer: AudioBuffer | null = null;
  async function prepare() {
    audioBuffer = await loadSample(sound, audioContext);
  }
  prepare();

  let isPlaying = false;
  let bpm: number | null = null;
  let beatCount: number | null = null;
  let pattern: number[] | null = null;
  let isValidMeasure = true;
  let currentTimeouts: number[] = [];
  const subscribers: Set<Subscriber> = new Set<Subscriber>();

  function setBpm(newBpm: number) {
    bpm = newBpm;
    isValidMeasure = false;
  }
  function setBeatCount(newBeatCount: number) {
    beatCount = newBeatCount;
    isValidMeasure = false;
  }
  function setBeatPattern(newPattern: number[]) {
    pattern = newPattern;
    isValidMeasure = false;
  }
  function subscribe(fn: Subscriber) {
    subscribers.add(fn);
    return () => {
      subscribers.delete(fn);
    };
  }
  function notifySubscribers(beatIndex: number | null) {
    subscribers.forEach((subscriber) => {
      subscriber(beatIndex, isValidMeasure);
    });
  }

  function play() {
    if (!audioBuffer) {
      console.log('Loading in progress');
      return;
    }
    if (isPlaying) {
      return;
    }
    isPlaying = true;
    scheduleNextMeasure();
  }
  function stop() {
    if (!isPlaying) {
      return;
    }
    isPlaying = false;
    clearAllPendingTimeout();
  }

  function scheduleNextMeasure() {
    if (!isPlaying) {
      notifySubscribers(null);
      return;
    }
    if (!isNumber(bpm) || !isNumber(beatCount)) {
      console.error(`Beat Player: Invalid attribute.
Debug Info:
BPM: ${bpm}
Beat: ${beatCount}
      `);
      isPlaying = false;
      return;
    }
    currentTimeouts = [];
    scheduleBeatsInMeasure(bpm, beatCount, pattern);
  }
  function scheduleBeatsInMeasure(
    bpm: number,
    beatCount: number,
    pattern: number[] | null
  ) {
    isValidMeasure = true;
    const pace = ONE_MINUTE / bpm;

    playSound(0, pattern?.[0]);

    for (let i = 1; i < beatCount; ++i) {
      currentTimeouts.push(
        window.setTimeout(() => playSound(i, pattern?.[i]), pace * i)
      );
    }
    currentTimeouts.push(
      window.setTimeout(scheduleNextMeasure, pace * beatCount)
    );
  }
  function clearAllPendingTimeout() {
    currentTimeouts.forEach((currentTimeout) => clearTimeout(currentTimeout));
  }

  function playSound(index: number, gain: number | undefined | null) {
    if (!audioBuffer) {
      return;
    }
    if (isNumber(gain) && gain === 0) {
      return;
    }

    const metronomeSound = audioContext.createBufferSource();
    metronomeSound.buffer = audioBuffer;
    metronomeSound.connect(gainNode);

    if (isNumber(gain)) {
      metronomeSound.playbackRate.value =
        2 **
        (Math.floor(gain / (UNIVERSAL_MAX / PLAYBACK_RATE_RANGE.length - 1)) /
          12);
      gainNode.gain.value = gain / UNIVERSAL_MAX;
    } else {
      gainNode.gain.value = 1;
    }
    metronomeSound.start(0);
    notifySubscribers(index);
    setTimeout(() => {
      metronomeSound.disconnect();
    }, ONE_MINUTE / (BPM_MAX + 1));
  }

  return {
    play,
    stop,
    setBpm,
    setBeatCount,
    setBeatPattern,
    subscribe,
  };
}

function isNumber(v: number | null | undefined): v is number {
  return v != null;
}
