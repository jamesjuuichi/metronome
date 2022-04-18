import React, { useContext } from 'react';
import { ReducerContext } from '../reducers/context';

import GridElement from '../GridElement';

import PerBeatConfig from './PerBeatConfig';

import style from './style.module.scss';

export default function PatternConfig() {
  const { state } = useContext(ReducerContext);

  return (
    <>
      {state.pattern.map((beat, index) => (
        <GridElement
          key={index}
          className={style[`beat${index + 1}`]}
          skipStyling={true}
        >
          <PerBeatConfig value={beat} index={index} />
        </GridElement>
      ))}
    </>
  );
}
