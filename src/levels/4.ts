import {
  genPlateforms,
  boundedYUpdate,
  defaultPlayer,
  genDoors
} from "./helpers";

const entities = [
  defaultPlayer,
  ...genPlateforms([
    {
      x: 100,
      y: 20,
      width: 100,
      updateFn: boundedYUpdate(4, [20, 320])
    },
    {
      x: 100,
      y: 650,
      width: 100,
      updateFn: boundedYUpdate(4, [350, 650])
    },
    {
      x: 300,
      y: 20,
      width: 100,
      updateFn: boundedYUpdate(4, [20, 320])
    },
    {
      x: 300,
      y: 650,
      width: 100,
      updateFn: boundedYUpdate(4, [350, 650])
    },
    {
      x: 500,
      y: 20,
      width: 100,
      updateFn: boundedYUpdate(4, [20, 320])
    },
    {
      x: 500,
      y: 350,
      width: 100,
      updateFn: boundedYUpdate(4, [350, 650])
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
