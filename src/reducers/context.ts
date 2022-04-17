import { createContext, Dispatch } from "react";
import { ActionType, initialState, MetronomeState } from "./reducer";

function noopDispatch(action: ActionType) {}

type ReducerContextType = {
  state: MetronomeState;
  dispatch: Dispatch<ActionType>;
};

export const ReducerContext = createContext<ReducerContextType>({
  state: initialState,
  dispatch: noopDispatch
});
