import {
  genPlateforms,
  boundedYUpdate,
  boundedXUpdate,
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
      y: 650,
      width: 100,
      updateFn: boundedYUpdate(4, [350, 650])
    },
    {
      x: 200,
      y: 320,
      width: 100,
      updateFn: boundedYUpdate(4, [20, 320])
    },
    {
      x: 200,
      y: 350,
      width: 100,
      updateFn: boundedYUpdate(4, [350, 650])
    },
    {
      x: 400,
      y: 320,
      width: 100,
      updateFn: boundedYUpdate(4, [20, 320])
    },
    {
      x: 400,
      y: 350,
      width: 100,
      updateFn: boundedYUpdate(4, [350, 650])
    },
    {
      x: 600,
      y: 320,
      width: 100,
      updateFn: boundedYUpdate(4, [20, 320])
    },
    {
      x: 600,
      y: 350,
      width: 100,
      updateFn: boundedYUpdate(4, [350, 650])
    },
    {
      x: 700,
      y: 30,
      width: 100,
      height: 800,
    },
    {
      x: 0,
      y: 800,
      width: 100,
      height: 800,
      updateFn: boundedXUpdate(10, [0, 800])
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
