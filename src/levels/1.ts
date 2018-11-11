import { EntitiesState } from "store/entities";
import { createPlateform } from "./helpers";

const entities: EntitiesState = [
  {
    id: "player",
    x: 0,
    y: 0,
    speedX: 0,
    speedY: 0,
    width: 50,
    height: 50,
    jumpCount: 0,
    type: "player"
  },
  {
    id: "door",
    x: 1000,
    y: 200,
    speedX: 0,
    speedY: 0,
    width: 20,
    height: 50,
    type: "door"
  },
  {
    id: "door2",
    x: 1200,
    y: 0,
    speedX: 0,
    speedY: 0,
    width: 20,
    height: 50,
    type: "door"
  },
  {
    id: "trap",
    x: 900,
    y: 90,
    speedX: 0,
    speedY: 0,
    width: 20,
    height: 50,
    type: "trap"
  },
  createPlateform({
    id: "platform",
    x: 200,
    y: 100,
    speedX: 5,
    speedY: 0,
    width: 30,
    height: 30,
    updateFn: entity => {
      const { x } = entity;
      if (x <= 100) {
        return {
          ...entity,
          x: 100,
          speedX: 5
        };
      } else if (x >= 300) {
        return {
          ...entity,
          x: 300,
          speedX: -5
        };
      }
      return entity;
    }
  }),
  createPlateform({
    id: "platform2",
    x: 400,
    y: 50,
    speedY: 5,
    speedX: 0,
    width: 300,
    height: 300,
    updateFn: entity => {
      const { y } = entity;
      if (y <= 20) {
        return {
          ...entity,
          y: 20,
          speedY: 5
        };
      } else if (y >= 200) {
        return {
          ...entity,
          y: 200,
          speedY: -5
        };
      }
      return entity;
    }
  })
];

export default {
  entities
};
