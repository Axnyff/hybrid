import { Entity } from "store/entities";
import level1 from "./1";

type LevelData = {
  [k: number]: {
    entities: Entity[];
  };
};

const exports: LevelData = {
  1: level1
};

export default exports;
