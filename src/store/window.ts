interface SetWindowSizeAction {
  type: "SET_WINDOW_SIZE";
  payload: {width: number, height: number };
}

export const setWindowSize = (payload: WindowState) => ({
  payload, type: "SET_WINDOW_SIZE",
});

export interface WindowState {
  width: number;
  height: number;
}

const initialState = {
  width: window.innerWidth,
  height: window.innerHeight,
};

export default (state: WindowState = initialState, action: SetWindowSizeAction) => {
  if (action.type === "SET_WINDOW_SIZE") {
    return action.payload;
  }
  return state;
};
