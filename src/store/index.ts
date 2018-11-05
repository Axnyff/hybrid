import { Action, createStore, combineReducers } from 'redux';
import keyboardReducer, { KeyboardState } from './keyboard';
import windowReducer, { WindowState } from './window';

export type State = {
  keyboard: KeyboardState;
  window: WindowState;
};

export const reducer = combineReducers({
  keyboard: keyboardReducer,
  window: windowReducer,
});
