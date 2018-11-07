import { Action, createStore, combineReducers } from 'redux';
import keyboardReducer, { KeyboardState } from './keyboard';
import windowReducer, { WindowState } from './window';
import entitiesReducer, { EntitiesState } from './entities';
import gameReducer, { GameState } from './game';
import playerReducer, { PlayerState} from './player';

export const updateAction = ({
  type: 'UPDATE',
});

export const update = () => updateAction;

export type State = {
  keyboard: KeyboardState;
  window: WindowState;
  entities: EntitiesState;
  game: GameState;
  player: PlayerState;
};

export const reducer = combineReducers({
  keyboard: keyboardReducer,
  window: windowReducer,
  entities: entitiesReducer,
  game: gameReducer,
  player: playerReducer,
});
