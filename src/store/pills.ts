import { PlayerState } from "./player";

const randInObject = (obj: object) => {
  const values = Object.values(obj);
  return values[Math.floor(Math.random() * values.length)];
};

const pillsType: {
  [k: string]: (state: PlayerState) => PlayerState;
} = {
  "High gravity": ({ gravity, ...rest }) => ({ gravity: gravity * 2, ...rest }),
  "Low gravity": ({ gravity, ...rest }) => ({
    gravity: gravity * 0.5,
    ...rest
  }),
  "Fast mode": ({ frameRate, ...rest }) => ({
    frameRate: frameRate * 2,
    ...rest
  }),
  "Slow mode": ({ frameRate, ...rest }) => ({
    frameRate: frameRate * 0.5,
    ...rest
  }),
  "Slow poke": ({ accelerationLeft, accelerationRight, ...rest }) => ({
    accelerationLeft: accelerationLeft * 0.5,
    accelerationRight: accelerationRight * 0.5,
    ...rest
  }),
  Sprinter: ({ accelerationLeft, accelerationRight, ...rest }) => ({
    accelerationLeft: accelerationLeft * 2,
    accelerationRight: accelerationRight * 2,
    ...rest
  }),
  "More jumps": ({ maxJump, ...rest }) => ({ maxJump: maxJump + 1, ...rest }),
  "Less jumps": ({ maxJump, ...rest }) => ({
    maxJump: Math.max(1, maxJump - 1),
    ...rest
  }),
  Jumper: ({ jumpSpeed, ...rest }) => ({ jumpSpeed: jumpSpeed * 2, ...rest }),
  Slippery: ({ slowDownX, ...rest }) => ({ slowDownX: 0.3, ...rest }),
  Leftie: ({ accelerationLeft, ...rest }) => ({
    accelerationLeft: accelerationLeft * 4,
    ...rest
  }),
  Chaos: state => randInObject(pillsType)(randInObject(pillsType)(state))
};

export const allPills = Object.keys(pillsType);

export default pillsType;
