import React, { useState, useReducer, useEffect } from 'react';
import { Observable, animationFrameScheduler, interval } from 'rxjs';
import xs from 'xstream';


const useKeyboard = () => {

  type Keys = 'left' | 'up' | 'down' | 'right';
  type KeyMap = {
    [K: number]: Keys;
  };

  const keyMap: KeyMap = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
  };

  type State = {
    [K in Keys]?: boolean;
  };

  const [currentKeys, setKeys] = useState<State>(() =>
    Object.values(keyMap).reduce((acc, val) => ({...acc, [val]: false}), {})
  );

  useEffect(() => {
    const keyDownListener = (event: KeyboardEvent) => {
      const { keyCode } = event;
      const mappedKey = keyMap[keyCode];
      if (mappedKey && !currentKeys[mappedKey]) {
        setKeys(currentKeys => ({...currentKeys, [mappedKey]: true }));
      }
    };

    const keyUpListener = (event: KeyboardEvent) => {
      const { keyCode } = event;
      if (keyMap[keyCode]) {
        setKeys(currentKeys => ({...currentKeys, [keyMap[keyCode]]: false }));
      }
    };
    document.addEventListener('keydown', keyDownListener);
    document.addEventListener('keyup', keyUpListener);

    return () => {
      document.removeEventListener('keydown', keyDownListener);
      document.removeEventListener('keyup', keyDownListener);
    };
  }, []);
  return currentKeys;
};


const useLoop = (update: () => void) => {
  useEffect(() => {
    const sub = xs.periodic(1000 / 60).subscribe({
      next: () => update(),
    });

    return () => sub.unsubscribe();
  });
};


const useWindowSize = () => {
  const [size, setSize ] = useState([window.innerWidth, window.innerHeight]);

  useEffect(() => {
    function onResize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  });
  return size;
};

const handleLeft = (currentVal: number, diff: number) => {
  if (currentVal <= diff) {
    return currentVal;
  }
  return currentVal - diff;
}

const handleRight = (currentVal: number, diff: number, width: number, size: number) => {
  if (currentVal + diff + size  >= width) {
    return currentVal;
  }
  return currentVal + diff;
}


const overlap = (x1: number, x2: number, y1: number, y2: number) => {
  return x1 < y2 && y1 < x2;
};

type Object = {
  left: number,
  width: number,
  bottom: number,
  height: number
};

type PlayerState = Object & {
  isJumping: boolean,
  speedY: number,
};


const MOVE_LEFT = 'MOVE_LEFT';

type MoveLeftAction = {
  type: typeof MOVE_LEFT;
};

const moveLeft: () => MoveLeftAction = () => ({
  type: MOVE_LEFT
});

const MOVE_RIGHT = 'MOVE_RIGHT';

type MoveRightAction = {
  type: typeof MOVE_RIGHT;
};

const moveRight: () => MoveRightAction = () => ({
  type: MOVE_RIGHT
});

const JUMP = 'JUMP';

type JumpAction = {
  type: typeof JUMP;
};

const jump: () => JumpAction = () => ({
  type: JUMP
});

const FALL = 'FALL';

type FallAction = {
  type: typeof FALL;
};

const fall: () => FallAction = () => ({
  type: FALL,
});

const FIND_PILL = 'FIND_PILL';

type FindPillAction = {
  type: typeof FIND_PILL;
  label: string;
  pillType: string;
};

const findPill: (pill: {pillType: string, label: string}) => FindPillAction = (pill) => ({
  type: FIND_PILL,
  label: pill.label,
  pillType: pill.pillType,
});



type Action = MoveLeftAction | MoveRightAction | JumpAction | FallAction;

const diff = 15;

const hasOverlap = (objA: Object, objB: Object) => {
    return overlap(
      objA.left, objA.left + objA.width, objB.left, objB.left + objB.width
    ) && overlap(
      objA.bottom, objA.bottom + objA.height, objB.bottom, objB.bottom + objB.height
    );
};


const hasCollision = (state: PlayerState) : [PlayerState, boolean] => {
  const collisionning = platforms.find(coords => hasOverlap(coords, state));
  if (collisionning) {
    const top = collisionning.bottom + collisionning.height;
    if (top > state.bottom && top < state.bottom + state.height) {
      return [{...state, bottom: top }, true];
    } else {
      return [{...state, bottom: collisionning.bottom - state.height}, true];
    }
  }
  return [state, false];
};


const reducer = (state: PlayerState, action: Action) => {
  let newState;
  switch (action.type) {
  case MOVE_LEFT:
    newState = {...state, left: state.left - diff };
    if (hasCollision(newState)[1] || newState.left <= 0) {
      return state;
    } else {
      return newState;
    }
  case MOVE_RIGHT:
    newState = {...state, left: state.left + diff };
    if (hasCollision(newState)[1] || newState.left >= window.innerWidth - state.width) {
      return state;
    } else {
      return newState;
    }
  case JUMP:
    newState = {...state, bottom: state.bottom + diff, speedY: diff, isJumping: true};
    if (hasCollision(newState)[1]) {
      return state;
    } else {
      return newState;
    }
  case FALL:
    newState = {...state,
      bottom: Math.max(state.bottom + state.speedY, 0),
      speedY: state.isJumping ? state.speedY - 1 : 0,
      isJumping: state.bottom > 0,
    };
    const collision = hasCollision(newState);
    if (collision[1]) {
      if (state.speedY > 0) {
        return {
          ...collision[0], speedY: -1,
        };
      } else {
        return {
          ...collision[0], isJumping: false, speedY: 0,
        };
      }
    } else {
      return newState;
    }
  };

  return state;
};

const initialState : PlayerState = {
  bottom: 0,
  left: 0,
  isJumping: false,
  speedY: 0,
  width: 50,
  height: 50,
};

const usePlayerState = () => {
  const currentKeys = useKeyboard();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [maxWidth, maxHeight ] = useWindowSize();

  const { isJumping, bottom } = state;

  const update = () => {
    const pill = pills.find(pill => hasOverlap(pill, state));
    if (pill) {
      findPill(pill);
    }

    if (currentKeys.left) {
      dispatch(moveLeft());
    } else if (currentKeys.right) {
      dispatch(moveRight());
    }

    if (currentKeys.up && !isJumping) {
      dispatch(jump());
    }

    dispatch(fall());
  };

  useLoop(update);
  return state;
};


const platforms : Object[] = [
  {
    left: 100,
    bottom: 80,
    width: 100,
    height: 30,
  },
  {
    left: 500,
    bottom: 10,
    width: 100,
    height: 30,
  },
  {
    left: 800,
    bottom: 100,
    width: 100,
    height: 30,
  }
];

const Plateform = ({ coords }: { coords: Object }) => {
  const { left, bottom, width, height } = coords;
  return (
    <div style={{
        position: 'absolute',
        background: 'green',
        height: `${height}px`,
        width: `${width}px`,
        left: `${left}px`,
        bottom: `${bottom}px`,
    }}>
    </div>
  );
};

type Pill = {
  label: string;
  pillType: string;
} & Object;

const pills = [{
  label: 'Chill pill',
  pillType: 'chill',
  left: 1000,
  bottom: 30,
  width: 30,
  height: 30,
}];

const Pills = ({ label, ...coords }: Pill) => {
  const { left, bottom, width, height } = coords;
  return (
    <div style={{
      borderRadius: '100%',
        position: 'absolute',
        background: 'black',
        height: `${height}px`,
        width: `${width}px`,
        left: `${left}px`,
        bottom: `${bottom}px`,
    }}>
    </div>
  );
};
const App = () => {
  const state = usePlayerState();
  const { left, bottom, height, width, speedY }  = state;

  return (
    <div>
    <pre>
      {JSON.stringify(state)}
    </pre>
    { platforms.map((platform, index) => <Plateform key={index} coords={platform} />)}
    { pills.map((pill, index) => <Pills key={index} {...pill} />)}
    <div style={{
        position: 'absolute',
        background: 'red',
        height: `${height}px`,
        width: `${width}px`,
        left: `${left}px`,
        bottom: `${bottom}px`,
    }}></div>
    </div>
  );
};

export default App;
