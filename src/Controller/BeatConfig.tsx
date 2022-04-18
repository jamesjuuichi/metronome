import { ReducerContext } from '../reducers/context';
import React, { useContext, useCallback } from 'react';
import { BEAT_MAX, BEAT_MIN } from '../constants';
import { ACTIONS } from '../reducers/reducer';
import GridElement from '../GridElement';
import Slider from '../Slider';
import style from './style.module.scss';
export default function BeatConfig() {
  const { state, dispatch } = useContext(ReducerContext);
  const reportValue = useCallback(
    (value: number) => dispatch({ type: ACTIONS.MODIFY_BEAT_COUNT, value }),
    [dispatch]
  );
  const decreaseBeat = useCallback(() => {
    dispatch({ type: ACTIONS.DECREASE_BEAT_COUNT });
  }, [dispatch]);
  const increaseBeat = useCallback(() => {
    dispatch({ type: ACTIONS.INCREASE_BEAT_COUNT });
  }, [dispatch]);
  return (
    <>
      <GridElement className={style.decreaseBeat} skipStyling={true}>
        <button
          onClick={decreaseBeat}
          className={style.button}
          disabled={state.beats === BEAT_MIN}
        >
          -
        </button>
      </GridElement>
      <GridElement className={style.rangeBeat} skipStyling={true}>
        <Slider
          value={state.beats}
          min={BEAT_MIN}
          max={BEAT_MAX}
          reportValue={reportValue}
        />
        <div className={style.overlayingText}>{state.beats}</div>
      </GridElement>
      <GridElement className={style.increaseBeat} skipStyling={true}>
        <button
          onClick={increaseBeat}
          className={style.button}
          disabled={state.beats === BEAT_MAX}
        >
          +
        </button>
      </GridElement>
    </>
  );
}
