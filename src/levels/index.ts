import { Entity } from "store/entities";
import level1 from "./1";
import level2 from "./2";
import level3 from "./3";
import level4 from "./4";
import level5 from "./5";
import level6 from "./6";
import level7 from "./7";
import level8 from "./8";
import level9 from "./9";
import level10 from "./10";

type LevelData = {
  [k: number]: {
    entities: Entity[];
    pillCount: number;
  };
};

const exports: LevelData = {
  1: level1,
  2: level2,
  3: level3,
  4: level4,
  5: level5,
  6: level6,
  7: level7,
  8: level8,
  9: level9,
  10: level10,
};

export default exports;
