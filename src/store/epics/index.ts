import { AnyAction } from "redux";
import { combineEpics, Epic, ofType, StateObservable } from "redux-observable";
import { interval, Observable } from "rxjs";
import { delay, filter, flatMap, map, mapTo, withLatestFrom } from "rxjs/operators";
import { State } from "store";
import { Entity, PlatformEntity, PlayerEntity } from "store/entities";
import { Direction } from "store/keyboard";
import { WindowState } from "store/window";
import { hasOverlap, looseComp, normalize } from "./helpers";

const staticEntities = (window: WindowState): Entity[] => [
    { x: 0, y: -50, height: 50, width: window.width, type: "platform", id: "floor", speedX: 0, speedY: 0, jumpCount: 0 },
    { x: 0, y: window.height, height: 50, width: window.width, type: "platform", id: "ceiling", speedX: 0, speedY: 0, jumpCount: 0 },
    { x: -50, y: 0, height: window.height, width: 50, type: "platform", id: "leftwall", speedX: 0, speedY: 0, jumpCount: 0 },
    { x: window.width, y: 0, height: window.height, width: 50, type: "platform", id: "leftwall", speedX: 0, speedY: 0, jumpCount: 0 }];

const updateGameEpic = (action$: Observable<AnyAction>, state$: StateObservable<State>) =>
  action$.pipe(
    ofType("WIN_GAME"),
    delay(200),
    map(() => ({
      type: "SET_GAME",
      payload: {
        won: false,
        level: state$.value.game.level + 1,
      }})),
  );

const handlePlateFormUpdate = (entity: Entity) => {
  return {
    ...entity,
    x: entity.x + entity.speedX,
    y: entity.y + entity.speedY,
  };
};

const updatePlayerEpic = (action$: Observable<AnyAction>, state$: StateObservable<State>) =>
  action$.pipe(
    ofType("UPDATE_PLAYER_ENTITY"),
    map(() => {
      const state = state$.value;
      const { keyboard, entities, player } = state;
      const playerEntity =
        entities.find(({ type }) => type === "player") as PlayerEntity;

      if (!playerEntity) {
        return { type: "NONE" };
      }

      const touchedTrap = entities.find((otherEntity) =>
        otherEntity.type === "trap" && hasOverlap(otherEntity, playerEntity),
      );

      const reachedDoor = entities.find((otherEntity) =>
        otherEntity.type === "door" && hasOverlap(otherEntity, playerEntity),
      );

      const platformsTouching = entities.filter((otherEntity) =>
        otherEntity.type === "platform" && hasOverlap(
          playerEntity, otherEntity, looseComp),
      ).length;

      const staticTouching = staticEntities(state.window).filter((otherEntity) =>
        hasOverlap(
          playerEntity, otherEntity, looseComp,
        )).length;

      const crushed = platformsTouching > 1 || platformsTouching >= 1 && staticTouching >= 1;

      if (touchedTrap || crushed) {
        return { type: "LOSE_GAME" };
      }

      if (reachedDoor) {
        return { type: "WIN_GAME"};
      }

      let { speedX, speedY, jumpCount, lastJump = 0 } = playerEntity;

      if (keyboard.left) {
        speedX = Math.max(speedX - player.accelerationX, - 10);
      }
      if (keyboard.right) {
        speedX = Math.min(speedX + player.accelerationX, 10);
      }
      if (!keyboard.left && !keyboard.right) {
        speedX = Math.sign(speedX) * Math.max(0, Math.abs(speedX) - player.slowDownX);
      }

      if (keyboard.up && playerEntity.jumpCount < player.maxJump && performance.now() - lastJump >= 200) {
        lastJump = performance.now();
        jumpCount = playerEntity.jumpCount += 1;
        speedY = 25;
      } else {
        speedY = Math.max(speedY - player.gravity, -10);
      }

      return {
        type: "UPDATE_ENTITY",
        payload: {
          entity: updatePlayerEntity(
            {...playerEntity, speedX, speedY, lastJump },
            state),
        },
      };
    }));

const updateEpic = (action$: Observable<AnyAction>, state$: StateObservable<State>) =>
  action$.pipe(
    ofType("UPDATE"),
    filter(() => state$.value.game.won ===  false),
    mapTo({
      type: "UPDATE_PLATFORMS_ENTITY",
    }));

const updatePlatformsEpic = (action$: Observable<AnyAction>, state$: StateObservable<State>) =>
    action$.pipe(
      ofType("UPDATE_PLATFORMS_ENTITY"),
      flatMap(() => {
        const state = state$.value;
        const { keyboard, entities, player } = state;

        const actions = entities.filter(({ type }) =>  type !== "player").map((entity) => {
          if (entity.updateFn) {
            return {
              type: "UPDATE_ENTITY",
              payload: {
                entity: handlePlateFormUpdate(entity.updateFn(entity)),
              },
            };
          }
          return {
            type: "NONE",
          };
        }).filter(({ type }) => type !== "NONE");

        actions.push({ type: "UPDATE_PLAYER_ENTITY" });
        return from(actions);

      }),
      filter(({ type }) => type !== "NONE"));

interface Coords {
  a: number;
  b: number;
}

function handlePlayerCollision(entity: Entity, otherEntity: Entity, originalEntity: Entity): Entity {
  const { x, y, height, width } = originalEntity;
  const newY = entity.y;
  const newX = entity.x;

  const top = entity.y + entity.height;
  const otherTop = otherEntity.y + otherEntity.height;
  const otherRight = otherEntity.x + otherEntity.width;

  if (hasOverlap(entity, otherEntity)) {

    // top overlap
    if ((top >= otherTop && y <= otherTop) ||
      (y >= otherTop &&  newY <= otherTop)) {
      return {...entity, y: otherTop, speedY: 0, jumpCount: 0};
    }

    // bottom overlap
    if (y <= otherEntity.y && top >= otherEntity.y) {
      return {...entity, y: otherEntity.y - height, speedY: 0 };
    }

    // x overlap
    if (originalEntity.x + width <= otherEntity.x && entity.x + originalEntity.width >= otherEntity.x) {
      return {...entity, x: otherEntity.x - entity.width, speedX: 0 };
    }

    // only overlap left
    return {...entity, x: otherRight, speedX: 0 };
  }
  return entity;
}

function updatePlayerEntity(entity: Entity, { window, entities }: State) {
  const moved = {
    ...entity, x: entity.x + entity.speedX, y: entity.y + entity.speedY,
  };

  const otherEntities = entities.filter(
    (other) => other.id !== entity.id && other.type !== "door" && other.type !== "trap",
  ).concat(staticEntities(window));

  const result = otherEntities
    .reduce((result, other) => handlePlayerCollision(result, other, entity), moved);
  return {
    ...result,
    x: normalize(result.x, result.width, [0, window.width]),
    y: normalize(result.y, result.height, [0, window.height]),
  };
}

export default combineEpics(
  updateEpic, updateGameEpic, updatePlayerEpic, updatePlatformsEpic,
);
