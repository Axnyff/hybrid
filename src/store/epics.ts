import { combineEpics, Epic, StateObservable, ofType } from 'redux-observable';
import { Observable } from 'rxjs';
import { AnyAction } from 'redux';
import { State } from 'store';
import { Direction } from 'store/keyboard';
import { Entity } from 'store/entities';
import { WindowState } from 'store/window';
import { filter, mapTo, flatMap, map, delay, withLatestFrom } from 'rxjs/operators';
import {interval, from} from 'rxjs';

const updateEpic = (action$: Observable<AnyAction>, state$: StateObservable<State>) =>
  action$.pipe(
    ofType('UPDATE'),
    flatMap(() => from([
      { type: 'UPDATE_SPEED' },
      { type: 'UPDATE_POSITION' }
    ])));

const updateSpeedEpic = (action$: Observable<AnyAction>, state$: StateObservable<State>) =>
  action$.pipe(
    ofType('UPDATE_SPEED'),
    flatMap(() => {
      const state = state$.value;
      const { keyboard, entities } = state

      return from(entities.map(entity => {
        if (entity.type === 'player') {
          let speedX = entity.speedX;
          let speedY = entity.speedY;
          let jumpCount = entity.jumpCount;
          let lastJump = entity.lastJump || 0;

          if (keyboard.left) {
            speedX = Math.max(speedX - 5, - 10);
          }
          if (keyboard.right) {
            speedX = Math.min(speedX + 5, 10);
          }
          if (!keyboard.left && !keyboard.right) {
            speedX = Math.sign(speedX) * Math.max(0, Math.abs(speedX) - 2);
          }

          console.log(performance.now() - lastJump);
          if (keyboard.up && entity.jumpCount < 2 && performance.now() - lastJump >= 500) {
            lastJump = performance.now();
            jumpCount = entity.jumpCount += 1;
            speedY = 25;
          }

          return {
            type: 'UPDATE_ENTITY',
            payload: {
              entity: {...entity, speedX, speedY, lastJump },
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

function handleCollision(moving: Entity, others: Entity[], window: WindowState) {
  let result = {...moving, x: moving.x + moving.speedX, y: moving.y + moving.speedY, speedY: moving.speedY - 1};
  for (const other of others) {

    const y = result.y + result.speedY;

    const otherTop = other.y + other.height;
    const otherRight = other.x + other.width;

    if (
      overlap(result.x, result.x + result.width, other.x, other.x + other.width) &&
      overlap(result.y, result.y + result.height, other.y, otherTop)) {
      if (
        result.y <= otherTop && moving.y >= otherTop
      ) {
        result = {...result, y: otherTop, speedY: 0, jumpCount: 0};
      }
      else if (moving.y + result.height <= other.y && result.y + result.height >= other.y) {
        result = {...result, y: other.y - result.height, speedY: -5 };
      } else if (moving.x + result.width <= other.x && result.x + result.width >= other.x) {
        result = {...result, x: other.x - result.width, speedX: 0 };
      } else {
        result = {...result, x: otherRight, speedX: 0 };
      }
    }
  }

  let { x, y, speedX, speedY, jumpCount } = result;
  if (x <= 0) {
    x = 0;
    speedX = 0;
  } else if (x + result.width >= window.width) {
    x = window.width - result.width;
    speedX = 0;
  }
  if (y <= 0) {
    y = 0;
    speedY = 0
    jumpCount = 0;
  } else if (y + result.height >= window.height) {
    y = window.height - result.height;
    speedY = -5;
  }
  return {...result, x, y, speedX, speedY, jumpCount };
};

const updatePositionEpic = (action$: Observable<AnyAction>, state$: StateObservable<State>) =>
  action$.pipe(
    ofType('UPDATE_POSITION'),
    delay(0),
    withLatestFrom(state$),
    flatMap(([, state]) => {
      const { entities, window } = state

      return from(entities.map(entity => {
        if (entity.type === 'player') {
          const others = entities.filter(({ id }) => id !== entity.id);

          return {
            type: 'UPDATE_ENTITY',
            payload: {
              entity: handleCollision(entity, others, window)
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

export default combineEpics(
  updateEpic,
  updateSpeedEpic,
  updatePositionEpic
);
