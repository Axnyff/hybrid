export interface PlayerState {
  gravity: number;
  accelerationX: number;
  slowDownX: number;
  accelerationY: number;
  maxSpeed: number;
  maxJump: number;
  jumpDelay: number;
  maxSpeedX: number;
  jumpSpeed: number;
}

const initialState = {
  gravity: 2,
  accelerationX: 5,
  accelerationY: 5,
  slowDownX: 2,
  maxSpeed: 10,
  maxJump: 2,
  jumpDelay: 200,
  maxSpeedX: 10,
  jumpSpeed: 25
};

export default (
  state: PlayerState = initialState,
  action: any
): PlayerState => {
  return state;
};
