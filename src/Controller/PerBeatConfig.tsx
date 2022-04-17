import React, { useContext, useCallback } from 'react';
import { ReducerContext } from '../reducers/context';
import { UNIVERSAL_MAX, UNIVERSAL_MIN } from '../constants';
import { ACTIONS } from '../reducers/reducer';

import Slider, { SLIDER_ORIENTATION } from '../Slider';

type Props = {
  value: number;
  index: number;
};

export default function PerBeatConfig({ value, index }: Props) {
  const { dispatch } = useContext(ReducerContext);

  const reportValue = useCallback(
    (value: number) => dispatch({ type: ACTIONS.MODIFY_PATTERN, value, index }),
    [index, dispatch]
  );

  return (
    <Slider
      value={value}
      min={UNIVERSAL_MIN}
      max={UNIVERSAL_MAX}
      orientation={SLIDER_ORIENTATION.VERTICAL}
      reportValue={reportValue}
    />
  );
}
