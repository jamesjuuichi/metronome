import React, { useContext, useEffect, useRef, useState } from 'react';
import GridElement from '../../GridElement';
import CurrentBeatIndicator from './CurrentBeatIndicator';

import { createMetronome } from './beatPlayer';
import { ReducerContext } from '../../reducers/context';

import style from '../style.module.scss';

export default function BeatPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const { state } = useContext(ReducerContext);
  const { bpm, beats, pattern } = state;

  const beatPlayer = useRef(createMetronome());

  useEffect(() => {
    beatPlayer.current.setBpm(bpm);
  }, [bpm]);

  useEffect(() => {
    beatPlayer.current.setBeatCount(beats);
  }, [beats]);

  useEffect(() => {
    beatPlayer.current.setBeatPattern(pattern);
  }, [pattern]);

  useEffect(() => {
    // NOTE: Already safeguard inside of beatPlayer, thus no need for usePrevious here
    if (isPlaying) {
      beatPlayer.current.play();
    } else {
      beatPlayer.current.stop();
    }
  }, [isPlaying]);

  return (
    <>
      <CurrentBeatIndicator subscribe={beatPlayer.current.subscribe} />
      <GridElement rowStart={6} colSpan={16}>
        <button
          className={style.button}
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </GridElement>
    </>
  );
}
