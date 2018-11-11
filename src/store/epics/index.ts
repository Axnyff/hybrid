import { AnyAction } from "redux";
import { combineEpics, Epic, ofType, StateObservable } from "redux-observable";
import { interval, Observable, from } from "rxjs";
import {
  delay,
  filter,
  flatMap,
  map,
  mapTo,
  withLatestFrom
} from "rxjs/operators";
import { State } from "store";
import { Entity, PlatformEntity, PlayerEntity } from "store/entities";
import { Direction } from "store/keyboard";
import { WindowState } from "store/window";
import { updatePlayerEntity, detectWinOrLost } from "./helpers";

const updateGameEpic = (
  action$: Observable<AnyAction>,
  state$: StateObservable<State>
) =>
  action$.pipe(
    ofType("WIN_GAME"),
    delay(200),
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
      const { keyboard, entities, player } = state;

      const actions = entities
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
      const { keyboard, entities, player } = state;
      const playerEntity = entities.find(
        ({ type }) => type === "player"
      ) as PlayerEntity;

      const [won, lost] = detectWinOrLost(playerEntity, state);

      if (lost) {
        return { type: "LOSE_GAME" };
      }

      if (won) {
        return { type: "WIN_GAME" };
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
