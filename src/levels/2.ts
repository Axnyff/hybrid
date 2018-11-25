import {
  genPlateforms,
  boundedXUpdate,
  defaultPlayer,
  genDoors
} from "./helpers";

const entities = [
  defaultPlayer,
  ...genPlateforms([
    {
      x: 300,
      y: 100,
      width: 100,
      updateFn: boundedXUpdate(5, [300, 900])
    },
    {
      x: 300,
      y: 300,
      width: 100,
      updateFn: boundedXUpdate(5, [300, 900])
    },
  ]),
  ...genDoors([
    {
      x: 1000,
      y: 400,
      speedX: 0,
      speedY: 0,
      width: 20,
      height: 50
    }
  ]),
];

const pillCount = 0;

export default {
  entities,
  pillCount,
};
