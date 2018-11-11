import { PlayerState } from "./player";

const pillsType: {
  [k: string]: (state: PlayerState) => PlayerState;
} = {
  yolo: ({ gravity, ...rest }) => ({ gravity: gravity * 2, ...rest })
};

export const allPills = Object.keys(pillsType);
export default pillsType;
