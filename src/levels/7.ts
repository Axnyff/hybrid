import {
  genTraps,
  boundedYUpdate,
  defaultPlayer,
  genDoors
} from "./helpers";

const entities = [
  defaultPlayer,
  ...genTraps([
    {
      x: 700,
      y: 30,
      width: 100,
      height: 800,
      updateFn: boundedYUpdate(3, [40, 200]),
    },
  ]),
  ...genDoors([
    {
      x: 1000,
      y: 40,
      speedX: 0,
      speedY: 0,
      width: 20,
      height: 50
    }
  ]),
];

const pillCount = 1;

export default {
  entities,
  pillCount,
};
