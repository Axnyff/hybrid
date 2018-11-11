import { State } from "store";
import { WindowState } from "store/window";
import { PlayerEntity, Entity } from "store/entities";
export const looseComp = (a: number, b: number): boolean => a <= b;
export const strictComp = (a: number, b: number): boolean => a < b;

export const staticEntities = (window: WindowState): Entity[] => [
  {
    x: 0,
    y: -50,
    height: 50,
    width: window.width,
    type: "platform",
    id: "floor",
    speedX: 0,
    speedY: 0,
    jumpCount: 0
  },
  {
    x: 0,
    y: window.height,
    height: 50,
    width: window.width,
    type: "platform",
    id: "ceiling",
    speedX: 0,
    speedY: 0,
    jumpCount: 0
  },
  {
    x: -50,
    y: 0,
    height: window.height,
    width: 50,
    type: "platform",
    id: "leftwall",
    speedX: 0,
    speedY: 0,
    jumpCount: 0
  },
  {
    x: window.width,
    y: 0,
    height: window.height,
    width: 50,
    type: "platform",
    id: "leftwall",
    speedX: 0,
    speedY: 0,
    jumpCount: 0
  }
];

export function hasOverlap(
  entityA: Entity,
  entityB: Entity,
  comp: ((a: number, b: number) => boolean) = strictComp
): boolean {
  return (
    comp(entityA.x, entityB.x + entityB.width) &&
    comp(entityB.x, entityA.x + entityA.width) &&
    comp(entityA.y, entityB.y + entityB.height) &&
    comp(entityB.y, entityA.y + entityA.height)
  );
}

export function normalize(
  min: number,
  range: number,
  boundaries: [number, number]
): number {
  if (min < boundaries[0]) {
    return boundaries[0];
  }
  if (min + range > boundaries[1]) {
    return boundaries[1] - range;
  }
  return min;
}

export function detectWinOrLost(
  playerEntity: PlayerEntity,
  state: State
): [boolean, boolean] {
  const { entities, window } = state;

  const touchedTrap =
    entities.find(
      otherEntity =>
        otherEntity.type === "trap" && hasOverlap(otherEntity, playerEntity)
    ) !== undefined;

  const reachedDoor =
    entities.find(
      otherEntity =>
        otherEntity.type === "door" && hasOverlap(otherEntity, playerEntity)
    ) !== undefined;

  const platformsTouching = entities.filter(
    otherEntity =>
      otherEntity.type === "platform" &&
      hasOverlap(playerEntity, otherEntity, looseComp)
  ).length;

  const staticTouching = staticEntities(state.window).filter(otherEntity =>
    hasOverlap(playerEntity, otherEntity, looseComp)
  ).length;

  const crushed =
    platformsTouching > 1 || (platformsTouching >= 1 && staticTouching >= 1);

  return [reachedDoor, crushed || touchedTrap];
}

export function handlePlayerSpeed(
  playerEntity: PlayerEntity,
  state: State
): PlayerEntity {
  let { speedX, speedY, jumpCount, lastJump = 0 } = playerEntity;
  const { keyboard, player } = state;

  if (keyboard.left) {
    speedX = Math.max(speedX - player.accelerationX, -player.maxSpeedX);
  }
  if (keyboard.right) {
    speedX = Math.min(speedX + player.accelerationX, player.maxSpeedX);
  }
  if (!keyboard.left && !keyboard.right) {
    speedX =
      Math.sign(speedX) * Math.max(0, Math.abs(speedX) - player.slowDownX);
  }

  if (
    keyboard.up &&
    playerEntity.jumpCount < player.maxJump &&
    performance.now() - lastJump >= player.jumpDelay
  ) {
    lastJump = performance.now();
    jumpCount = jumpCount + 1;
    speedY = player.jumpSpeed;
  } else {
    speedY = Math.max(speedY - player.gravity, -10);
  }
  return {
    ...playerEntity,
    speedX,
    speedY,
    jumpCount,
    lastJump
  };
}

function handlePlayerCollision(
  entity: PlayerEntity,
  otherEntity: Entity,
  originalEntity: PlayerEntity
): PlayerEntity {
  const { x, y, height, width } = originalEntity;
  const newY = entity.y;
  const newX = entity.x;

  const top = entity.y + entity.height;
  const otherTop = otherEntity.y + otherEntity.height;
  const otherRight = otherEntity.x + otherEntity.width;

  if (hasOverlap(entity, otherEntity)) {
    // top overlap
    if (
      (top >= otherTop && y <= otherTop) ||
      (y >= otherTop && newY <= otherTop)
    ) {
      return { ...entity, y: otherTop, speedY: 0, jumpCount: 0 };
    }

    // bottom overlap
    if (y <= otherEntity.y && top >= otherEntity.y) {
      return { ...entity, y: otherEntity.y - height, speedY: 0 };
    }

    // x overlap
    if (
      originalEntity.x + width <= otherEntity.x &&
      entity.x + originalEntity.width >= otherEntity.x
    ) {
      return { ...entity, x: otherEntity.x - entity.width, speedX: 0 };
    }

    // only overlap left
    return { ...entity, x: otherRight, speedX: 0 };
  }
  return entity;
}

export function handlePlayerCollisions(
  entity: PlayerEntity,
  state: State
): PlayerEntity {
  const moved: PlayerEntity = {
    ...entity,
    x: entity.x + entity.speedX,
    y: entity.y + entity.speedY
  };

  const otherEntities: Entity[] = state.entities
    .filter(
      other =>
        other.id !== entity.id && other.type !== "door" && other.type !== "trap"
    )
    .concat(staticEntities(state.window));

  return otherEntities.reduce(
    (result: PlayerEntity, other: Entity) =>
      handlePlayerCollision(result, other, entity),
    moved
  ) as PlayerEntity;
}

export function normalizePosition(
  entity: PlayerEntity,
  state: State
): PlayerEntity {
  const { window } = state;
  return {
    ...entity,
    x: normalize(entity.x, entity.width, [0, window.width]),
    y: normalize(entity.y, entity.height, [0, window.height])
  };
}

export function updatePlayerEntity(entity: PlayerEntity, state: State) {
  const funcs: ((
    playerEntity: PlayerEntity,
    state: State
  ) => PlayerEntity)[] = [
    handlePlayerSpeed,
    handlePlayerCollisions,
    normalizePosition
  ];

  return funcs.reduce((entity, func) => func(entity, state), entity);
}
