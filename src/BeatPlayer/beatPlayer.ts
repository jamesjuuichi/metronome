/*eslint @typescript-eslint/no-use-before-define: ["error", "nofunc"]*/
import sound from "./sound.mp3";
import { UNIVERSAL_MAX } from "../constants";

const ONE_MINUTE = 60 * 1000;

export function createMetronome() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;

  const metronomeSound = new Audio(sound);
  const audioContext = new AudioContext();
  const source = audioContext.createMediaElementSource(metronomeSound);
  const gainNode = audioContext.createGain();
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);

  let isPlaying = false;
  let bpm: number | null = null;
  let beatCount: number | null = null;
  let pattern: number[] | null = null;
  function play() {
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
    // if (isNumber(gain)) {
    //   if (gain === 0) {
    //     return;
    //   } else {
    //     gainNode.gain.value = gain / UNIVERSAL_MAX;
    //   }
    // } else {
    //   gainNode.gain.value = 1;
    // }
    // gainNode.gain.value = 1;
    // console.log("a", gainNode.gain.value);
    metronomeSound.play();
  }

  function playOnce() {
    metronomeSound.play();
  }

  return {
    playOnce,
    play,
    stop,
    setBpm,
    setBeatCount,
    setBeatPattern
  };
}

function isNumber(v: number | null | undefined): v is number {
  return v != null;
}
