export type Direction = "left" | "up" | "right" | "down";

export interface KeyboardUpAction {
  type: "KEYBOARD_UP";
  payload: Direction;
}

export const keyboardUp = (dir: Direction) => ({
  type: "KEYBOARD_UP",
  payload: dir
});

export interface KeyboardDownAction {
  type: "KEYBOARD_DOWN";
  payload: Direction;
}

export const keyboardDown = (dir: Direction) => ({
  type: "KEYBOARD_DOWN",
  payload: dir
});

export type KeyboardState = { [d in Direction]: boolean };

export type KeyboardAction = KeyboardUpAction | KeyboardDownAction;

const initialStateKeyboard = {
  left: false,
  up: false,
  right: false,
  down: false
};

export default (
  state: KeyboardState = initialStateKeyboard,
  action: KeyboardAction
) => {
  switch (action.type) {
    case "KEYBOARD_UP":
      if (state[action.payload]) {
        return {
          ...state,
          [action.payload]: false
        };
      }
      break;
    case "KEYBOARD_DOWN":
      if (!state[action.payload]) {
        return {
          ...state,
          [action.payload]: true
        };
      }
  }
  return state;
};
