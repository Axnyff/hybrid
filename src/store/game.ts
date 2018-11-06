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

export type GameState = {
  level: number,
  paused: boolean,
};

const initialState = {
  level: 1,
  paused: false,
};

export default (state: GameState = initialState, action: SetGameAction) => {
  if (action.type === 'SET_GAME') {
    return action.payload;
  }
  return state;
}
