import sound from './sound.mp3';
import { UNIVERSAL_MAX } from '../../constants';
import { loadSample } from './audioLoader';

const ONE_MINUTE = 60 * 1000;
const PLAYBACK_RATE_RANGE = [-2, -1, 0, 1, 2, 3];

export function createMetronome() {
  const AudioContext = window.AudioContext;

  const audioContext = new AudioContext();

  let audioBuffer: AudioBuffer | null = null;
  const gainNode: GainNode = audioContext.createGain();
  gainNode.connect(audioContext.destination);

  async function prepare() {
    audioBuffer = await loadSample(sound, audioContext);
  }
  prepare();

  let isPlaying = false;
  let bpm: number | null = null;
  let beatCount: number | null = null;
  let pattern: number[] | null = null;
  function play() {
    if (!audioBuffer) {
      console.log('Loading in progress');
    }
    if (isPlaying) {
      return;
    }
    isPlaying = true;
    scheduleNextBar();
  }
  function stop() {
    if (!isPlaying) {
      return;
    }
    isPlaying = false;
  }
  function scheduleNextBar() {
    if (!isPlaying) {
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

    scheduleBeatsInBar(bpm, beatCount, pattern);
  }

  function scheduleBeatsInBar(
    bpm: number,
    beatCount: number,
    pattern: number[] | null
  ) {
    const pace = ONE_MINUTE / bpm;

    playSound(pattern?.[0]);
    for (let i = 1; i < beatCount; ++i) {
      setTimeout(() => playSound(pattern?.[i]), pace * i);
    }
    setTimeout(scheduleNextBar, pace * beatCount);
  }

  function setBpm(newBpm: number) {
    bpm = newBpm;
  }
  function setBeatCount(newBeatCount: number) {
    beatCount = newBeatCount;
  }
  function setBeatPattern(newPattern: number[]) {
    pattern = newPattern;
  }

  function playSound(gain: number | undefined | null) {
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
    setTimeout(() => {
      metronomeSound.disconnect();
    }, 80);
  }

  return {
    play,
    stop,
    setBpm,
    setBeatCount,
    setBeatPattern,
  };
}

function isNumber(v: number | null | undefined): v is number {
  return v != null;
}
