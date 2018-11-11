import { Entity } from "store/entities";
export const looseComp = (a: number, b: number): boolean => a <= b;
export const strictComp = (a: number, b: number): boolean => a < b;

export function hasOverlap(entityA: Entity, entityB: Entity, comp: ((a: number, b: number) => boolean) = strictComp): boolean {
  return (
    comp(entityA.x, entityB.x + entityB.width) &&
    comp(entityB.x, entityA.x + entityA.width) &&
    comp(entityA.y, entityB.y + entityB.height) &&
    comp(entityB.y, entityA.y + entityA.height)
  );
}

export function normalize(min: number, range: number, boundaries: [number, number]): number {
  if (min < boundaries[0]) {
    return boundaries[0];
  }
  if (min  + range > boundaries[1]) {
    return boundaries[1] - range;
  }
  return min;
}
