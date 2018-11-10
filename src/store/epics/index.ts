import { combineEpics, Epic, StateObservable, ofType } from 'redux-observable';
import { Observable } from 'rxjs';
import { AnyAction } from 'redux';
import { State } from 'store';
import { Direction } from 'store/keyboard';
import { Entity } from 'store/entities';
import { WindowState } from 'store/window';
import { filter, mapTo, flatMap, map, delay, withLatestFrom } from 'rxjs/operators';
import {interval, from} from 'rxjs';

const updateGameEpic = (action$: Observable<AnyAction>, state$: StateObservable<State>) =>
  action$.pipe(
    ofType('WIN_GAME'),
    delay(200),
    map(() => ({
      type: 'SET_GAME',
      payload: {
        won: false,
        level: state$.value.game.level + 1,
      }}))
  )

const updateEpic = (action$: Observable<AnyAction>, state$: StateObservable<State>) =>
  action$.pipe(
    ofType('UPDATE'),
    filter(() => state$.value.game.won ===  false),
    flatMap(() => {
      const state = state$.value;
      const { keyboard, entities, player } = state

      return from(entities.map(entity => {
        if (entity.type === 'player') {
          const touchedTrap = entities.find((otherEntity) =>
            otherEntity.type === 'trap' && hasOverlap(otherEntity, entity)
          );

          const reachedDoor = entities.find((otherEntity) =>
            otherEntity.type === 'door' && hasOverlap(otherEntity, entity)
          );

          if (touchedTrap) {
            return { type: 'LOSE_GAME' };
          }

          if (reachedDoor) {
            return { type: 'WIN_GAME'};
          }

          let speedX = entity.speedX;
          let speedY = entity.speedY;
          let jumpCount = entity.jumpCount;
          let lastJump = entity.lastJump || 0;


          if (keyboard.left) {
            speedX = Math.max(speedX - player.accelerationX, - 10);
          }
          if (keyboard.right) {
            speedX = Math.min(speedX + player.accelerationX, 10);
          }
          if (!keyboard.left && !keyboard.right) {
            speedX = Math.sign(speedX) * Math.max(0, Math.abs(speedX) - player.slowDownX);
          }

          if (keyboard.up && entity.jumpCount < player.maxJump && performance.now() - lastJump >= 200) {
            lastJump = performance.now();
            jumpCount = entity.jumpCount += 1;
            speedY = 25;
          } else {
            speedY = Math.max(speedY - player.gravity, -10);
          }

          return {
            type: 'UPDATE_ENTITY',
            payload: {
              entity: updateEntity(
                {...entity, speedX, speedY, lastJump },
                state),
            }
          };
        } else {
          return {
            type: 'NONE',
          };
        }
      }));
    }),
    filter(({ type }) => type !== 'NONE')
  );




type Coords = {
  a: number;
  b: number;
}

function overlap(a1: number, a2: number, b1: number, b2: number) {
  return a1 <= b2 && b1 <= a2;
}

function hasOverlap(entityA: Entity, entityB: Entity): boolean {
  return (
    entityA.x < entityB.x + entityB.width &&
    entityA.x + entityA.width >= entityB.x &&
    entityA.y + entityA.height >= entityB.y &&
    entityA.y <= entityB.y + entityB.height
  );
}


function handleCollision(entity: Entity, otherEntity: Entity, originalEntity: Entity): Entity {
  const { x, y, height, width } = originalEntity;
  const newY = entity.y
  const newX = entity.x

  const otherTop = otherEntity.y + otherEntity.height;
  const otherRight = otherEntity.x + otherEntity.width;

  if (hasOverlap(entity, otherEntity)) {
    // y overlap
    if (y >= otherTop &&  newY <= otherTop) {
      return {...entity, y: otherTop, speedY: 0, jumpCount: 0};
    }
    if (y + height <= otherEntity.y && entity.y + height >= otherEntity.y) {
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


function updateEntity(entity: Entity, { window, entities }: State) {
  const moved = {
    ...entity, x: entity.x + entity.speedX, y: entity.y + entity.speedY,
  };

  const otherEntities = entities.filter(
    other => other.id !== entity.id && other.type !== 'door' && other.type !== 'trap'
  ).concat([
    { x: 0, y: -50, height: 50, width: window.width, type: 'platform', id: 'floor', speedX: 0, speedY: 0, jumpCount: 0 },
    { x: 0, y: window.height, height: 50, width: window.width, type: 'platform', id: 'ceiling', speedX: 0, speedY: 0, jumpCount: 0 },
    { x: -50, y: 0, height: window.height, width: 50, type: 'platform', id: 'leftwall', speedX: 0, speedY: 0, jumpCount: 0 },
    { x: window.width, y: 0, height: window.height, width: 50, type: 'platform', id: 'leftwall', speedX: 0, speedY: 0, jumpCount: 0 },
  ]);

  return otherEntities
    .reduce((result, other) => handleCollision(result, other, entity), moved);
};

export default combineEpics(
  updateEpic, updateGameEpic,
);
