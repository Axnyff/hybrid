import { AnyAction } from "redux";
import { combineEpics, ofType, StateObservable } from "redux-observable";
import { Observable, from } from "rxjs";
import { delay, filter, flatMap, map, mapTo } from "rxjs/operators";
import { State } from "store";
import { Entity, PlayerEntity } from "store/entities";
import { eatPill } from "store/player";
import { winGame, loseGame } from "store/game";
import { updatePlayerEntity, detectWinOrLost, detectPill } from "./helpers";
import levels from '../../levels';

const updateGameEpic = (
  action$: Observable<AnyAction>,
  state$: StateObservable<State>
) =>
  action$.pipe(
    ofType("WIN_GAME"),
    delay(200),
    filter(() => state$.value.game.level <= Object.keys(levels).length),
    map(() => ({
      type: "SET_GAME",
      payload: {
        won: false,
        level: state$.value.game.level + 1
      }
    }))
  );

const handlePlateFormUpdate = (entity: Entity) => {
  return {
    ...entity,
    x: entity.x + entity.speedX,
    y: entity.y + entity.speedY
  };
};

const updateEpic = (
  action$: Observable<AnyAction>,
  state$: StateObservable<State>
) =>
  action$.pipe(
    ofType("UPDATE"),
    filter(() => state$.value.game.won === false),
    mapTo({
      type: "UPDATE_PLATFORMS_ENTITY"
    })
  );

const updatePlatformsEpic = (
  action$: Observable<AnyAction>,
  state$: StateObservable<State>
) =>
  action$.pipe(
    ofType("UPDATE_PLATFORMS_ENTITY"),
    flatMap(() => {
      const state = state$.value;

      const actions = state.entities
        .filter(({ type }) => type !== "player")
        .map(entity => {
          if (entity.updateFn) {
            return {
              type: "UPDATE_ENTITY",
              payload: {
                entity: handlePlateFormUpdate(entity.updateFn(entity))
              }
            };
          }
          return {
            type: "NONE"
          };
        })
        .filter(({ type }) => type !== "NONE");

      actions.push({ type: "UPDATE_PLAYER_ENTITY" });
      return from(actions);
    }),
    filter(({ type }) => type !== "NONE")
  );
const updatePlayerEpic = (
  action$: Observable<AnyAction>,
  state$: StateObservable<State>
) =>
  action$.pipe(
    ofType("UPDATE_PLAYER_ENTITY"),
    map(() => {
      const state = state$.value;
      const { entities } = state;
      const playerEntity = entities.find(
        ({ type }) => type === "player"
      ) as PlayerEntity;

      const [won, lost] = detectWinOrLost(playerEntity, state);

      if (lost) {
        return loseGame();
      }

      if (won) {
        return winGame();
      }

      const foundPill = detectPill(playerEntity, state);

      if (foundPill) {
        return eatPill(foundPill);
      }

      return {
        type: "UPDATE_ENTITY",
        payload: {
          entity: updatePlayerEntity(playerEntity, state)
        }
      };
    })
  );

export default combineEpics(
  updateEpic,
  updateGameEpic,
  updatePlayerEpic,
  updatePlatformsEpic
);
