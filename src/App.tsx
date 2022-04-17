import React, { useReducer } from 'react';
import { initialState, reducer as metronomeReducer } from './reducers/reducer';
import { ReducerContext } from './reducers/context';

import Controller from './Controller';

import './styles.css';
import Background from './Background';

export default function App() {
  const [state, dispatch] = useReducer(metronomeReducer, initialState);
  return (
    <ReducerContext.Provider
      value={{
        state: state,
        dispatch: dispatch,
      }}
    >
      <Background />
      <Controller />
    </ReducerContext.Provider>
  );
}
