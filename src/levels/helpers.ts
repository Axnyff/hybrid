import { DoorEntity, TrapEntity, PlatformEntity, Entity } from "store/entities";

type PlatformData = {
  x: number;
  y: number;
  width: number;
  height: number;
  updateFn?: UpdateFn;
  speedX: number;
  speedY: number;
};

export const defaultPlayer: Entity = {
  id: "player",
  x: 0,
  y: 0,
  speedX: 0,
  speedY: 0,
  width: 50,
  height: 50,
  jumpCount: 0,
  type: "player"
};

export const genPlateforms = (platforms: PlatformData[]): PlatformEntity[] =>
  platforms.map(({ x, y, width, height, speedX, speedY, updateFn }, index) => ({
    id: "platform" + index,
    x,
    y,
    width,
    height,
    speedX,
    speedY,
    updateFn,
    type: "platform" as "platform"
  })) as PlatformEntity[];

export const genTraps = (platforms: PlatformData[]): TrapEntity[] =>
  platforms.map(({ x, y, width, height, speedX, speedY, updateFn }, index) => ({
    id: "trap" + index,
    x,
    y,
    width,
    height,
    speedX,
    speedY,
    updateFn,
    type: "trap" as "trap"
  }));

export const genDoors = (platforms: PlatformData[]): DoorEntity[] =>
  platforms.map(({ x, y, width, height, updateFn, speedX, speedY }, index) => ({
    id: "door" + index,
    x,
    y,
    width,
    height,
    speedX,
    speedY,
    updateFn,
    type: "door" as "door"
  }));

export const boundedUpdate = (
  speedX: number,
  speedY: number,
  boundariesX: [number, number],
  boundariesY: [number, number]
): UpdateFn => entity => {
  if (speedX) {
    if (entity.x <= boundariesX[0]) {
      return {
        ...entity,
        speedX,
        x: entity.x + speedX
      };
    }
    if (entity.x >= boundariesX[1]) {
      return {
        ...entity,
        speedX: -speedX,
        x: entity.x - speedX
      };
    }
  }
  if (speedY) {
    if (entity.y <= boundariesY[0]) {
      return {
        ...entity,
        speedY,
        y: entity.y + speedY
      };
    }
    if (entity.y >= boundariesY[1]) {
      return {
        ...entity,
        speedY: -speedY,
        y: entity.y - speedY
      };
    }
  }
  return {
    ...entity,
    x: entity.x + entity.speedX,
    y: entity.y + entity.speedY
  };
};

export const boundedXUpdate = (speedX: number, boundariesX: [number, number]) =>
  boundedUpdate(speedX, 0, boundariesX, [0, 0]);

export const boundedYUpdate = (speedY: number, boundariesY: [number, number]) =>
  boundedUpdate(0, speedY, [0, 0], boundariesY);

type UpdateFn = (entity: Entity) => Entity;

export const createPlatform = ({
  x,
  y,
  id,
  width,
  height,
  updateFn,
  speedX = 0,
  speedY = 0
}: {
  id: string;
  x: number;
  speedX?: number;
  speedY?: number;
  y: number;
  width: number;
  height: number;
  updateFn?: (entity: Entity) => Entity;
}): Entity => ({
  id,
  x,
  y,
  width,
  height,
  speedX,
  speedY,
  type: "platform",
  updateFn
});
