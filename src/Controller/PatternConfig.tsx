import React, { useContext, useCallback } from "react";
import { ReducerContext } from "../reducers/context";

import GridElement from "../GridElement";

import PerBeatConfig from "./PerBeatConfig";

export default function PatternConfig() {
  const { state } = useContext(ReducerContext);

  return (
    <>
      {state.pattern.map((beat, index) => (
        <GridElement key={index} colStart={1 + index} rowSpan={3} rowStart={2}>
          <PerBeatConfig value={beat} index={index} />
        </GridElement>
      ))}
    </>
  );
}
