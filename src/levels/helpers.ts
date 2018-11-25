import { DoorEntity, TrapEntity, PlatformEntity, Entity } from "store/entities";

type PlatformData = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  updateFn?: UpdateFn;
  speedX?: number;
  speedY?: number;
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

const defaultSize = 50;

export const genPlateforms = (platforms: PlatformData[]): PlatformEntity[] =>
  platforms.map(({ x = 0, y = 0, width = defaultSize, height = defaultSize, speedX = 0, speedY = 0, updateFn }, index) => ({
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
  platforms.map(({ x = 0, y = 0, width = defaultSize, height = defaultSize, speedX = 0, speedY = 0, updateFn }, index) => ({
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
  platforms.map(({ x = 0, y = 0, width = defaultSize, height = defaultSize, speedX = 0, speedY = 0, updateFn }, index) => ({
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
  const updatedEntity = boundedYUpdate(speedY, boundariesY)(entity);
  return boundedXUpdate(speedX, boundariesX)(updatedEntity);
};

export const boundedXUpdate = (speedX: number, boundariesX: [number, number]): UpdateFn => entity => {
  let entitySpeedX = entity.speedX || speedX;
  if (entity.x <= boundariesX[0]) {
    entitySpeedX = speedX;
  } else if (entity.x >= boundariesX[1]) {
    entitySpeedX = -speedX;
  }
  return {
    ...entity,
    speedX: entitySpeedX,
    x: entity.x + entitySpeedX,
  };
};

export const boundedYUpdate = (speedY: number, boundariesY: [number, number]): UpdateFn => entity => {
  let entitySpeedY = entity.speedY || speedY;
  if (entity.y <= boundariesY[0]) {
    entitySpeedY = speedY;
  } else if (entity.y >= boundariesY[1]) {
    entitySpeedY = -speedY;
  }
  return {
    ...entity,
    speedY: entitySpeedY,
    y: entity.y + entitySpeedY,
  };
};

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
