import pillsType from "./pills";
import { LoseGameAction, RestartGameAction } from "./game";

type InitPillsAction = {
  type: "INIT_PILLS";
  payload: {
    type: string;
    id: number;
    x: number;
    y: number;
  }[];
};

export const initPills = (
  payload: { id: number; type: string; x: number; y: number }[]
) => ({
  type: "INIT_PILLS",
  payload
});

type EatPillAction = {
  type: "EAT_PILL";
  payload: {
    id: number;
    type: string;
  };
};

export const eatPill = (payload: { id: number; type: string }) => ({
  type: "EAT_PILL",
  payload
});

export interface PlayerState {
  gravity: number;
  accelerationLeft: number;
  accelerationRight: number;
  slowDownX: number;
  maxSpeedLeft: number;
  maxSpeedRight: number;
  maxJump: number;
  jumpDelay: number;
  jumpSpeed: number;
  frameRate: number;
  pills: {
    id: number;
    type: string;
    x: number;
    y: number;
  }[];
  eatenPills: string[];
}

const initialState = {
  gravity: 2,
  accelerationLeft: 5,
  accelerationRight: 5,
  slowDownX: 2,
  maxSpeedLeft: 10,
  maxSpeedRight: 10,
  maxJump: 2,
  jumpDelay: 200,
  maxSpeedX: 10,
  jumpSpeed: 25,
  frameRate: 1,
  pills: [],
  eatenPills: []
};

type Action = InitPillsAction | EatPillAction | LoseGameAction | RestartGameAction;

export default (
  state: PlayerState = initialState,
  action: Action
): PlayerState => {
  let pill;
  switch (action.type) {
    case "LOSE_GAME":
      return initialState;
    case "RESTART_GAME":
      return initialState;
    case "INIT_PILLS":
      return {
        ...state,
        pills: action.payload
      };
    case "EAT_PILL":
      pill = pillsType[action.payload.type];
      if (pill) {
        return {
          ...pill(state),
          pills: state.pills.filter(({ id }) => id !== action.payload.id),
          eatenPills: [...state.eatenPills, action.payload.type]
        };
      }
  }
  return state;
};
