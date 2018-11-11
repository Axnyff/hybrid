export interface WinGameAction {
  type: "WIN_GAME";
}

export const winGame = (): WinGameAction => ({
  type: "WIN_GAME"
});

export interface LoseGameAction {
  type: "LOSE_GAME";
}

export const loseGame = (): LoseGameAction => ({
  type: "LOSE_GAME"
});

export interface SetGameAction {
  type: "SET_GAME";
  payload: Partial<GameState>;
}

export const setGame = (payload: Partial<GameState>) => ({
  payload,
  type: "SET_GAME"
});

interface TogglePauseAction {
  type: "TOGGLE_PAUSE";
}

export const togglePause = () => ({
  type: "TOGGLE_PAUSE"
});

export interface GameState {
  level: number;
  paused: boolean;
  lost: boolean;
  won: boolean;
}

const initialState = {
  level: 1,
  paused: true,
  lost: false,
  won: false
};

type Action =
  | SetGameAction
  | TogglePauseAction
  | WinGameAction
  | LoseGameAction;

export default (state: GameState = initialState, action: Action) => {
  if (action.type === "SET_GAME") {
    return { ...state, ...action.payload };
  }
  if (action.type === "WIN_GAME") {
    return { ...state, won: true };
  }
  if (action.type === "LOSE_GAME") {
    return { ...state, lost: true };
  }
  if (action.type === "TOGGLE_PAUSE") {
    return {
      ...state,
      paused: !state.paused
    };
  }
  return state;
};
