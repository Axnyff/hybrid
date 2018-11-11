import { Entity } from "store/entities";
export const createPlateform = ({
  id,
  x,
  y,
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
  updateFn: (entity: Entity) => Entity;
}): Entity => ({
  x,
  y,
  id,
  width,
  height,
  speedX,
  speedY,
  type: "platform",
  updateFn
});
