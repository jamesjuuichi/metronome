import {
  BPM_MIN,
  BPM_MAX,
  UNIVERSAL_MIN,
  UNIVERSAL_MAX,
  BEAT_MIN,
  BEAT_MAX,
  INIT_BEAT,
  INIT_BPM
} from "../constants";
export type MetronomeState = {
  bpm: number;
  beats: number;
  pattern: number[];
};
export enum ACTIONS {
  INCREASE_BPM,
  DECREASE_BPM,
  MODIFY_BPM,
  INCREASE_BEAT_COUNT,
  DECREASE_BEAT_COUNT,
  MODIFY_BEAT_COUNT,
  MODIFY_PATTERN
}

export type IncreaseBpmAction = {
  type: ACTIONS.INCREASE_BPM;
};
export type DecreaseBpmAction = {
  type: ACTIONS.DECREASE_BPM;
};
export type ModifyBpmAction = {
  type: ACTIONS.MODIFY_BPM;
  value: number;
};
export type IncreaseBeatCountAction = {
  type: ACTIONS.INCREASE_BEAT_COUNT;
};
export type DecreaseBeatCountAction = {
  type: ACTIONS.DECREASE_BEAT_COUNT;
};
export type ModifyBeatCounntAction = {
  type: ACTIONS.MODIFY_BEAT_COUNT;
  value: number;
};
export type ModifyPatternAction = {
  type: ACTIONS.MODIFY_PATTERN;
  index: number;
  value: number;
};

export type ActionType =
  | IncreaseBpmAction
  | DecreaseBpmAction
  | ModifyBpmAction
  | IncreaseBeatCountAction
  | DecreaseBeatCountAction
  | ModifyBeatCounntAction
  | ModifyPatternAction;

export const initialState: MetronomeState = {
  bpm: INIT_BPM,
  beats: INIT_BEAT,
  pattern: [100, 100, 100, 100]
};

export function reducer(
  state: MetronomeState,
  action: ActionType
): MetronomeState {
  switch (action.type) {
    case ACTIONS.INCREASE_BPM:
      return {
        ...state,
        bpm: legalizeRange(state.bpm + 1, BPM_MIN, BPM_MAX)
      };
    case ACTIONS.DECREASE_BPM:
      return {
        ...state,
        bpm: legalizeRange(state.bpm - 1, BPM_MIN, BPM_MAX)
      };
    case ACTIONS.MODIFY_BPM:
      return modifyBpmHandler(state, action);
    case ACTIONS.DECREASE_BEAT_COUNT:
      return decreaseBeatCount(state);
    case ACTIONS.INCREASE_BEAT_COUNT:
      return increaseBeatCount(state);
    case ACTIONS.MODIFY_BEAT_COUNT:
      return modifyBeatHandler(state, action);
    case ACTIONS.MODIFY_PATTERN:
      return modifyPatternHandler(state, action);
  }
}

function decreaseBeatCount(state: MetronomeState): MetronomeState {
  const newPattern = state.pattern.slice();
  newPattern.pop();
  return {
    ...state,
    beats: legalizeRange(state.beats - 1, BEAT_MIN, BEAT_MAX),
    pattern: newPattern
  };
}
function increaseBeatCount(state: MetronomeState): MetronomeState {
  const newPattern = state.pattern.slice();
  newPattern.push(UNIVERSAL_MAX);
  return {
    ...state,
    beats: legalizeRange(state.beats + 1, BEAT_MIN, BEAT_MAX),
    pattern: newPattern
  };
}

function modifyBeatHandler(
  state: MetronomeState,
  action: ModifyBeatCounntAction
): MetronomeState {
  if (state.beats === action.value) {
    return state;
  }
  const newPattern = state.pattern.slice(
    0,
    action.value < state.beats ? action.value : undefined
  );
  const missingBeatCount = action.value - state.beats;
  for (let i = 0; i < missingBeatCount; ++i) {
    newPattern.push(UNIVERSAL_MAX);
  }

  return {
    ...state,
    beats: legalizeRange(action.value, BEAT_MIN, BEAT_MAX),
    pattern: newPattern
  };
}

function modifyBpmHandler(
  state: MetronomeState,
  action: ModifyBpmAction
): MetronomeState {
  if (state.bpm === action.value) {
    return state;
  }
  return {
    ...state,
    bpm: legalizeRange(action.value, BPM_MIN, BPM_MAX)
  };
}

function modifyPatternHandler(
  state: MetronomeState,
  action: ModifyPatternAction
): MetronomeState {
  if (
    action.index >= state.beats ||
    state.pattern[action.index] === action.value
  ) {
    return state;
  }
  const newPattern = state.pattern.slice();
  newPattern[action.index] = legalizeRange(action.value);
  return {
    ...state,
    pattern: newPattern
  };
}

function legalizeRange(
  value: number,
  min = UNIVERSAL_MIN,
  max = UNIVERSAL_MAX
) {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}
