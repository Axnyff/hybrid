import { Action, combineReducers, createStore } from "redux";
import entitiesReducer, { EntitiesState } from "./entities";
import gameReducer, { GameState } from "./game";
import keyboardReducer, { KeyboardState } from "./keyboard";
import playerReducer, { PlayerState } from "./player";
import windowReducer, { WindowState } from "./window";

export const updateAction = {
  type: "UPDATE"
};

export const update = () => updateAction;

export interface State {
  keyboard: KeyboardState;
  window: WindowState;
  entities: EntitiesState;
  game: GameState;
  player: PlayerState;
}

export const reducer = combineReducers({
  keyboard: keyboardReducer,
  window: windowReducer,
  entities: entitiesReducer,
  game: gameReducer,
  player: playerReducer
});
