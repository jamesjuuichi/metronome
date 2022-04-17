import { createContext, Dispatch } from 'react';
import { ActionType, initialState, MetronomeState } from './reducer';

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noopDispatch(_action: ActionType) {}

type ReducerContextType = {
  state: MetronomeState;
  dispatch: Dispatch<ActionType>;
};

export const ReducerContext = createContext<ReducerContextType>({
  state: initialState,
  dispatch: noopDispatch,
});
