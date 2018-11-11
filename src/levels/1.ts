import {
  genPlateforms,
  boundedUpdate,
  boundedXUpdate,
  boundedYUpdate,
  defaultPlayer,
  genTraps,
  genDoors
} from "./helpers";

const entities = [
  defaultPlayer,
  ...genPlateforms([
    {
      x: 300,
      y: 100,
      speedX: 5,
      speedY: 0,
      width: 30,
      height: 30,
      updateFn: boundedXUpdate(5, [100, 300])
    },
    {
      x: 400,
      y: 50,
      speedY: 10,
      speedX: 0,
      width: 300,
      height: 300,
      updateFn: boundedYUpdate(10, [20, 200])
    }
  ]),
  ...genDoors([
    {
      x: 1000,
      y: 200,
      speedX: 0,
      speedY: 0,
      width: 20,
      height: 50
    }
  ]),
  ...genTraps([
    {
      x: 100,
      y: 90,
      speedX: 0,
      speedY: 0,
      width: 20,
      height: 50,
      updateFn: boundedUpdate(3, 2, [100, 300], [20, 300])
    }
  ])
];

export default {
  entities
};
