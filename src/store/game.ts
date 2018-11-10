type SetGameAction = {
  type: 'SET_GAME',
  payload: {
    level: number,
    paused: boolean;
  };
};

export const setGame = (payload: GameState) => ({
  payload, type: 'SET_GAME',
});

type TogglePauseAction = {
  type: 'TOGGLE_PAUSE',
};

export const togglePause = () => ({
  type: 'TOGGLE_PAUSE',
});

export type GameState = {
  level: number,
  paused: boolean,
};

const initialState = {
  level: 1,
  paused: true,
};

export default (state: GameState = initialState, action: SetGameAction | TogglePauseAction) => {
  if (action.type === 'SET_GAME') {
    return action.payload;
  }
  if (action.type === 'TOGGLE_PAUSE') {
    return {
      ...state,
      paused: !state.paused
    };
  }
  return state;
}
