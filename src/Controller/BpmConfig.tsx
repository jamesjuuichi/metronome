import React, { useContext, useCallback } from "react";
import { ReducerContext } from "../reducers/context";

import { BPM_MAX, BPM_MIN } from "../constants";
import { ACTIONS } from "../reducers/reducer";

import GridElement from "../GridElement";
import Slider from "../Slider";

import style from "./style.module.scss";

export default function BpmConfig() {
  const { state, dispatch } = useContext(ReducerContext);

  const reportValue = useCallback(
    (value: number) => dispatch({ type: ACTIONS.MODIFY_BPM, value }),
    [dispatch]
  );

  const decreaseBpm = useCallback(() => {
    dispatch({ type: ACTIONS.DECREASE_BPM });
  }, [dispatch]);

  const increaseBpm = useCallback(() => {
    dispatch({ type: ACTIONS.INCREASE_BPM });
  }, [dispatch]);

  return (
    <>
      <GridElement colSpan={2}>
        <button
          onClick={decreaseBpm}
          className={style.button}
          disabled={state.bpm === BPM_MIN}
        >
          -
        </button>
      </GridElement>
      <GridElement colStart={3} colSpan={4}>
        <Slider
          value={state.bpm}
          min={BPM_MIN}
          max={BPM_MAX}
          reportValue={reportValue}
        />
        <div className={style.overlayingText}>{state.bpm}</div>
      </GridElement>
      <GridElement colStart={7} colSpan={2}>
        <button
          onClick={increaseBpm}
          className={style.button}
          disabled={state.bpm === BPM_MAX}
        >
          +
        </button>
      </GridElement>
    </>
  );
}
