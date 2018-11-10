export type WinGameAction = {
  type: 'WIN_GAME',
};

export type LoseGameAction = {
  type: 'LOSE_GAME',
};

export type SetGameAction = {
  type: 'SET_GAME',
  payload: Partial<GameState>;
};

export const setGame = (payload: Partial<GameState>) => ({
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
  lost: boolean,
  won: boolean,
};

const initialState = {
  level: 1,
  paused: false,
  lost: false,
  won: false,
};

type Action = SetGameAction | TogglePauseAction | WinGameAction | LoseGameAction;

export default (state: GameState = initialState, action: Action) => {
  if (action.type === 'SET_GAME') {
    return {...state, ...action.payload};
  }
  if (action.type === 'WIN_GAME') {
    return {...state, won: true};
  }
  if (action.type === 'LOSE_GAME') {
    return {...state, lost: true};
  }
  if (action.type === 'TOGGLE_PAUSE') {
    return {
      ...state,
      paused: !state.paused
    };
  }
  return state;
}
