import React, { useState, useEffect } from 'react';
import { Observable, animationFrameScheduler, interval } from 'rxjs';
import { scan } from 'rxjs/operators';


const state = {
  time: performance.now(),
  delta: 0,
};

const clock = interval(0, animationFrameScheduler)
  .pipe(scan((previous, value) => {
      const time = performance.now();
      return {
          time,
          delta: time - previous.time,
      };
  }, state));

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


const useLoop = (update: (progress: number) => void) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let lastRender: number = performance.now();
    let keepGoing = true;
    const loop = (timestamp: number) => {
      const progress = timestamp - lastRender;
      lastRender = timestamp;
      update(progress);
      if (keepGoing) {
        requestAnimationFrame(loop);
      }
    };
    requestAnimationFrame(loop);
    return () => {
      keepGoing = false;
    };
  });
  return progress;
};


const useWindowSize = () => {
  const [size, setSize ] = useState([window.innerWidth, window.innerHeight]);

  useEffect(() => {
    function onResize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', onResize);
    window.removeEventListener('resize', onResize);
  }, []);
  return size;
};

const handleLeft = (currentVal: number, diff: number) => {
  if (currentVal <= diff) {
    return currentVal;
  }
  return currentVal - diff;
}

const handleRight = (currentVal: number, diff: number, width: number, size: number) => {
  if (currentVal + diff  + size >= width) {
    return currentVal;
  }
  return currentVal + diff;
}

const usePlayerState = () => {
  const currentKeys = useKeyboard();
  const [size, setSize] = useState(50);

  const [left, setLeft] = useState(0);
  const [bottom, setBottom] = useState(0);
  const [maxWidth, maxHeight ] = useWindowSize();

  const update = (progress: number) => {
    const diff = progress / 10;
    if (currentKeys.left) {
      setLeft(x => handleLeft(x, diff));
    } else if (currentKeys.right) {
      setLeft(x => handleRight(x, diff, maxWidth, size));
    }
  };

  useLoop(update);
  return { left, bottom, size };

};


const App = () => {
  const { left, bottom, size }  = usePlayerState();
  return <div style={{
    position: 'absolute',
      background: 'red',
      height: `${size}px`,
      width: `${size}px`,
      left: `${left}px`,
      bottom: `${bottom}px`,
  }}></div>;
};

export default App;
