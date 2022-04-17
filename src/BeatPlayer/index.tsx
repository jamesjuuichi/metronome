import React, { useContext, useEffect, useRef, useState } from "react";
import { ReducerContext } from "../reducers/context";
import { createMetronome } from "./beatPlayer";

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
    // beatPlayer.current.playOnce();
  }, [isPlaying]);

  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? "Pause" : "Play"}
      </button>
    </>
  );
}
